import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const candidateFiles = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

const forbiddenPaths = candidateFiles.filter((path) => {
  const normalized = path.replaceAll('\\', '/');
  const name = normalized.split('/').at(-1);
  if (name === '.env.example') return false;
  return name === '.env'
    || name.startsWith('.env.')
    || normalized.startsWith('.vercel/')
    || /\.(?:pem|key|p12|pfx)$/i.test(name);
});

const signatures = [
  ['clave privada', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['token personal de GitHub', /(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}/],
  ['token granular de GitHub', /github_pat_[A-Za-z0-9_]{30,}/],
  ['access key de AWS', /AKIA[0-9A-Z]{16}/],
  ['clave de Google API', /AIza[0-9A-Za-z_-]{35}/],
  ['clave privada de Stripe', /sk_live_[0-9A-Za-z]{20,}/],
  ['token de Slack', /xox[baprs]-[0-9A-Za-z-]{20,}/],
  ['token de Vercel asignado directamente', /VERCEL_TOKEN\s*[:=]\s*["']?(?!\$\{\{)[0-9A-Za-z._-]{16,}/],
];

const findings = forbiddenPaths.map((path) => ({ path, kind: 'archivo sensible versionado' }));

for (const path of candidateFiles) {
  let content;
  try {
    const buffer = await readFile(path);
    if (buffer.includes(0)) continue;
    content = buffer.toString('utf8');
  } catch {
    continue;
  }
  for (const [kind, pattern] of signatures) {
    if (pattern.test(content)) findings.push({ path, kind });
  }
}

if (findings.length) {
  console.error('Se detectaron posibles credenciales o archivos sensibles:');
  for (const finding of findings) console.error(`- ${finding.path}: ${finding.kind}`);
  console.error('No se muestran los valores detectados. Retíralos del historial y rota la credencial antes de continuar.');
  process.exit(1);
}

console.log(`Seguridad: ${candidateFiles.length} archivos versionados o versionables revisados sin credenciales detectables.`);
