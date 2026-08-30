import { writeFile } from 'node:fs/promises';
import { legacyGone, legacyManualReview, legacyRedirects } from '../src/data/legacyRoutes.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const apachePath = (value) => escapeRegex(value.replace(/^\//, '').replace(/\/$/, ''));
const redirectRules = legacyRedirects.map(({ source, destination }) => {
  const pattern = apachePath(source);
  return `RewriteRule ^${pattern}/?$ ${destination} [R=301,L,NE]`;
}).join('\n');
const goneRules = legacyGone.map(({ source }) => `RewriteRule ^${apachePath(source)}/?$ - [R=410,L]`).join('\n');

const htaccess = `# Generado por scripts/generate-hostinger-config.mjs. No editar a mano.\nOptions -Indexes\nDirectoryIndex index.html\n\n<IfModule mod_rewrite.c>\n  RewriteEngine On\n\n  # Un único host HTTPS para evitar duplicados entre http/www/apex.\n  RewriteCond %{HTTPS} !=on [OR]\n  RewriteCond %{HTTP_HOST} !^pixvo\\.tech$ [NC]\n  RewriteRule ^ https://pixvo.tech%{REQUEST_URI} [R=301,L,NE]\n\n  # Spam confirmado sin sustituto: se elimina con 410, nunca se redirige a la Home.\n  ${goneRules}\n\n  # Endpoints WordPress ausentes en el proyecto actual.\n  RewriteRule ^(?:wp-admin|wp-content|wp-includes)(?:/|$) - [R=404,L,NC]\n  RewriteRule ^(?:wp-login\\.php|xmlrpc\\.php)$ - [R=404,L,NC]\n\n  # Migraciones legacy con equivalencia explícita.\n  ${redirectRules}\n</IfModule>\n\n# Las rutas SEO válidas existen físicamente como directorios prerenderizados.\n# No hay fallback global a index.html: una URL desconocida debe conservar HTTP 404.\nErrorDocument 404 /404/index.html\nErrorDocument 410 /404/index.html\n\n<IfModule mod_headers.c>\n  Header always set X-Content-Type-Options "nosniff"\n  Header always set X-Frame-Options "DENY"\n  Header always set Referrer-Policy "strict-origin-when-cross-origin"\n  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"\n  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS\n  Header always set Content-Security-Policy "upgrade-insecure-requests"\n</IfModule>\n\n<FilesMatch "(^\\.|\\.(?:env|ini|log|sql|bak|old|dist|key|pem|p12|pfx)$)">\n  Require all denied\n</FilesMatch>\n\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType text/css "access plus 1 year"\n  ExpiresByType application/javascript "access plus 1 year"\n  ExpiresByType image/avif "access plus 1 year"\n  ExpiresByType image/webp "access plus 1 year"\n  ExpiresByType image/png "access plus 1 year"\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType image/svg+xml "access plus 1 year"\n  ExpiresByType font/woff2 "access plus 1 year"\n</IfModule>\n`;
await writeFile('public/.htaccess', htaccess, 'utf8');

const csv = (value = '') => {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const columns = ['old_url', 'detected_source', 'current_http_status', 'current_topic', 'equivalent_new_url', 'action', 'redirect_target', 'reason', 'risk', 'validation_required'];
const rows = [
  ...legacyRedirects.map((item) => ({ old_url: item.source, detected_source: 'inventario y redirects del proyecto', current_http_status: item.source === '/proyectos' ? '301→403' : '404', current_topic: item.topic, equivalent_new_url: item.destination, action: '301', redirect_target: item.destination, reason: item.reason, risk: item.risk, validation_required: item.validationRequired ? 'yes: GSC/backlinks' : 'no' })),
  ...legacyGone.map((item) => ({ old_url: item.source, detected_source: 'auditoría pública previa y verificación HTTP 2026-08-30', current_http_status: '404', current_topic: item.topic, equivalent_new_url: '', action: '410', redirect_target: '', reason: item.reason, risk: item.risk, validation_required: 'yes: verificar después del deploy y solicitar retirada en GSC si sigue indexada' })),
  { old_url: '/wp-login.php, /wp-admin/, /wp-json/, /xmlrpc.php, /wp-content/', detected_source: 'comprobación pública 2026-08-30', current_http_status: '404', current_topic: 'Endpoints WordPress legacy', equivalent_new_url: '', action: '404', redirect_target: '', reason: 'WordPress no forma parte de la aplicación Vite activa', risk: 'high', validation_required: 'yes: confirmar filesystem y bases en hPanel' },
  ...legacyManualReview.map((item) => ({ old_url: item.source, detected_source: 'antecedentes de auditoría; no enumerables desde el repo', current_http_status: 'unknown', current_topic: item.topic, equivalent_new_url: '', action: 'MANUAL_REVIEW', redirect_target: '', reason: item.reason, risk: item.risk, validation_required: 'yes: export WordPress + GSC + backlinks' })),
];
const contents = `${columns.join(',')}\n${rows.map((row) => columns.map((column) => csv(row[column])).join(',')).join('\n')}\n`;
await writeFile('docs/seo/legacy-url-migration.csv', contents, 'utf8');
console.log(`Hostinger: .htaccess generado con ${legacyRedirects.length} redirects, ${legacyGone.length} URL 410 y ${rows.length} filas legacy.`);

