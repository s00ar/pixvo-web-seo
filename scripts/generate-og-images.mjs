import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const ogDir = 'public/images/og';

// Configuración de imágenes OG por tipo
const ogConfigs = [
  {
    type: 'solutions',
    path: `${ogDir}/solutions-default.png`,
    text: 'Soluciones de Crecimiento Digital',
    color: '#667eea',
  },
  {
    type: 'cases',
    path: `${ogDir}/cases-default.png`,
    text: 'Casos de Éxito Verificables',
    color: '#764ba2',
  },
  {
    type: 'articles',
    path: `${ogDir}/articles-default.png`,
    text: 'Blog de SEO, Automatización y Crecimiento',
    color: '#00bcd4',
  },
  {
    type: 'problems',
    path: `${ogDir}/problems-default.png`,
    text: 'Identifica Tu Problema de Crecimiento',
    color: '#ff5722',
  },
  {
    type: 'resources',
    path: `${ogDir}/resources-default.png`,
    text: 'Comparativas de Decisión Comercial',
    color: '#4caf50',
  },
  {
    type: 'growth-system',
    path: `${ogDir}/growth-system.png`,
    text: 'Sistema de Crecimiento Digital para PyMEs',
    color: '#008b99',
  },
];

async function createOGImage(config) {
  const width = 1200;
  const height = 630;
  const padding = 80;

  // Create SVG with text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0a192f;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#grad)"/>

      <!-- Decorative shapes -->
      <circle cx="${width * 0.2}" cy="${height * 0.2}" r="150" fill="rgba(255,255,255,0.1)"/>
      <circle cx="${width * 0.9}" cy="${height * 0.8}" r="200" fill="rgba(255,255,255,0.08)"/>

      <!-- Logo placeholder -->
      <text x="${padding}" y="${padding + 40}" font-family="system-ui" font-size="28" font-weight="bold" fill="white">
        PIXVO
      </text>

      <!-- Main text -->
      <text x="${padding}" y="${height / 2 - 30}" font-family="system-ui" font-size="56" font-weight="bold" fill="white" font-smooth="always">
        <tspan x="${padding}" dy="0">${config.text.split(' ').slice(0, 2).join(' ')}</tspan>
        <tspan x="${padding}" dy="70">${config.text.split(' ').slice(2).join(' ')}</tspan>
      </text>

      <!-- Tagline -->
      <text x="${padding}" y="${height - padding - 20}" font-family="system-ui" font-size="18" fill="rgba(255,255,255,0.9)">
        Crecimiento Digital para PyMEs
      </text>
    </svg>
  `;

  try {
    await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toFile(config.path);

    console.log(`✓ Creada: ${config.path}`);
  } catch (error) {
    console.error(`✗ Error en ${config.path}:`, error.message);
  }
}

async function generateOGImages() {
  console.log('🎨 Generando imágenes OG específicas...\n');

  // Crear directorio si no existe
  try {
    await mkdir(dirname(ogDir), { recursive: true });
  } catch (error) {
    // El directorio ya existe
  }

  for (const config of ogConfigs) {
    await createOGImage(config);
  }

  console.log(`\n✅ Imágenes OG generadas exitosamente!\n`);
  console.log('📝 Para usar estas imágenes en componentes:');
  console.log('   import solutionsOG from "/images/og/solutions-default.png"\n');
}

generateOGImages().catch(console.error);
