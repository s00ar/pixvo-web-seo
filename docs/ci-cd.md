# CI/CD de Pixvo en Hostinger

## Arquitectura final

`pull request → GitHub Actions → merge a main → auto deployment de Hostinger`

GitHub Actions es la barrera de calidad. Hostinger obtiene el repositorio mediante su integración OAuth y publica únicamente después de un push a `main`. El workflow no contiene FTP, tokens de Hostinger ni variables `VERCEL_*`.

- Rama de producción: `main`
- Node.js: 22
- Instalación: `npm ci`
- Build: `npm run build`
- Directorio publicado: `dist`
- Aplicación: Vite/React prerenderizada como archivos estáticos
- Configuración Apache: `public/.htaccess`, generada desde `src/data/legacyRoutes.js`

El build ejecuta generación SEO, Vite, prerender, configuración Hostinger y auditoría del HTML final. Una URL válida se sirve desde su directorio físico. No se configura un fallback SPA global: una ruta desconocida debe devolver 404.

## GitHub Actions

`.github/workflows/ci-cd.yml` ejecuta checks independientes llamados `Secrets`, `Lint`, `Tests` y `Build y SEO`. El último corre solo si los tres anteriores terminan correctamente y vuelve a validar el artefacto con `npm run check:seo`.

Antes de hacer merge, configurar los checks como requeridos según `docs/github-branch-protection.md`.

## Activar el despliegue automático en hPanel

Esta acción requiere una sesión autorizada en Hostinger y no puede completarse desde el repositorio.

1. En hPanel, abrir el sitio `pixvo.tech` y localizar **Git / Git deployments** o **Node.js Web Apps**, según el plan habilitado.
2. Conectar GitHub mediante OAuth. No copiar un token personal al repositorio ni a una variable `VITE_*`.
3. Seleccionar `s00ar/pixvo-web-seo`, rama `main`.
4. Configurar Node 22, comando de instalación `npm ci`, comando de build `npm run build` y directorio de salida `dist`.
5. Activar deployment automático al recibir cambios en `main`.
6. Confirmar que el document root final apunta al contenido de `dist`, no a una carpeta WordPress anterior ni a la raíz del repositorio.
7. Ejecutar el primer deployment solo después de que GitHub Actions esté verde.

Si el plan solo ofrece **Git deployment** sin build de Node, crear el artefacto en un entorno limpio y publicar `dist` mediante el mecanismo admitido por Hostinger. No añadir credenciales FTP al frontend. La preferencia sigue siendo la integración OAuth administrada por Hostinger.

## Comprobación posterior

1. Registrar el SHA desplegado que muestra hPanel.
2. Verificar `/`, `/mx/`, `/mx/sistema-crecimiento-digital/`, un caso, un artículo, `robots.txt` y `sitemap_index.xml`.
3. Confirmar `301` de HTTP y `www` hacia `https://pixvo.tech`.
4. Confirmar `301` de una ruta legacy equivalente, `410` en `/official-site/` y `404` en una ruta inventada y en endpoints WordPress.
5. Comprobar title, canonical, hreflang, H1 y contenido sin JavaScript en una muestra del HTML recibido.
6. Ejecutar el smoke test externo documentado en `docs/security/production-cleanup.md`.

### Estado público observado antes del nuevo deploy (2026-08-30)

- `https://pixvo.tech/`: 200 y headers de plataforma Hostinger/hPanel.
- `https://www.pixvo.tech/`: 200; el host duplicado todavía no redirige al apex.
- `/official-site/`: 404; el artefacto nuevo lo normaliza a 410.
- `/wp-login.php` y una ruta de control inexistente: 404.
- `/proyectos/`: 403; el artefacto nuevo contiene el 301 explícito al índice de casos MX.

Estos resultados prueban que el nuevo artefacto todavía no fue desplegado. Repetir la comprobación después de activar hPanel; no marcar el deploy como realizado solo porque el build local sea correcto.

## Rollback

1. En hPanel, seleccionar el deployment exitoso anterior o volver a desplegar el SHA anterior desde GitHub.
2. Restaurar conjuntamente los archivos de `dist`, incluido `.htaccess`; no mezclar HTML nuevo con redirects viejos.
3. Repetir las comprobaciones HTTP, sitemaps y muestra HTML.
4. Documentar SHA retirado, SHA restaurado, causa y hora. No reescribir la historia Git.

## Secretos

No se necesitan secretos de Hostinger en GitHub para el flujo OAuth. `.env`, `.env.*` (excepto el ejemplo), `.vercel/`, claves y certificados se excluyen mediante `.gitignore`. Los valores públicos usados por Vite no deben contener credenciales.
