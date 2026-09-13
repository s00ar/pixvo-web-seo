import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const imageDir = 'public/images';
const widths = [320, 640, 1024];
const supportedFormats = ['.jpg', '.jpeg', '.png'];

async function generateResponsiveImages() {
  console.log('📐 Generando variantes responsivas de imágenes...\n');

  const files = await getImageFiles(imageDir);
  let generated = 0;

  for (const file of files) {
    try {
      const ext = extname(file).toLowerCase();
      if (!supportedFormats.includes(ext)) continue;

      const fileName = basename(file, ext);
      const dirPath = file.substring(0, file.lastIndexOf('/'));

      // Get original dimensions to avoid upscaling
      const metadata = await sharp(file).metadata();
      if (!metadata.width) continue;

      const applicableWidths = widths.filter(w => w < metadata.width);
      if (applicableWidths.length === 0) continue;

      for (const width of applicableWidths) {
        const responsivePath = `${dirPath}/${fileName}-${width}w${ext}`;

        // Check if file already exists
        try {
          await stat(responsivePath);
          continue; // File exists, skip
        } catch {
          // File doesn't exist, create it
        }

        await sharp(file)
          .resize(width, undefined, { withoutEnlargement: true })
          .toFile(responsivePath);

        const stats = await stat(responsivePath);
        console.log(`✓ ${fileName}-${width}w${ext} (${(stats.size / 1024).toFixed(1)}KB)`);
        generated++;
      }
    } catch (error) {
      // Silently skip errors
    }
  }

  console.log(`\n✅ Generadas ${generated} variantes responsivas\n`);
  console.log('📝 Uso en componentes:');
  console.log(`
const image = {
  src: '/images/example.jpg',
  srcset: [
    '/images/example-320w.jpg 320w',
    '/images/example-640w.jpg 640w',
    '/images/example-1024w.jpg 1024w',
    '/images/example.jpg 1200w'
  ].join(','),
  sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1024px'
};
  `);
}

async function getImageFiles(dir) {
  const files = [];

  async function walk(path) {
    const entries = await readdir(path, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(path, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

generateResponsiveImages().catch(console.error);
