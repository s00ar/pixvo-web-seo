import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const imageDir = 'public/images';
const supportedFormats = ['.jpg', '.jpeg', '.png'];

async function convertImagesToWebP() {
  console.log('🖼️  Iniciando conversión de imágenes a WebP...\n');

  const files = await getImageFiles(imageDir);
  let converted = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const ext = extname(file).toLowerCase();
      if (!supportedFormats.includes(ext)) continue;

      const webpPath = file.replace(ext, '.webp');
      const fileName = basename(file);

      // Check file size
      const stats = await stat(file);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

      // Convert to WebP
      await sharp(file)
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);

      const webpStats = await stat(webpPath);
      const webpSizeMB = (webpStats.size / 1024 / 1024).toFixed(2);
      const savings = (((stats.size - webpStats.size) / stats.size) * 100).toFixed(1);

      console.log(`✓ ${fileName}`);
      console.log(`  Original: ${sizeMB}MB → WebP: ${webpSizeMB}MB (${savings}% menor)\n`);
      converted++;
    } catch (error) {
      console.error(`✗ Error convirtiendo ${file}:`, error.message);
      failed++;
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ✓ Convertidas: ${converted}`);
  console.log(`   ✗ Fallidas: ${failed}`);
  console.log(`\n✅ Conversión completada!\n`);
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

convertImagesToWebP().catch(console.error);
