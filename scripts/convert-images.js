const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertFolder() {
  const folder = path.join(__dirname, '..', 'Staticdata', 'images', 'Award');
  if (!fs.existsSync(folder)) {
    console.error('Folder not found:', folder);
    process.exit(1);
  }

  const files = fs.readdirSync(folder).filter(f => f.toLowerCase().endsWith('.avif'));
  if (files.length === 0) {
    console.log('No .avif files found in', folder);
    return;
  }

  for (const file of files) {
    const input = path.join(folder, file);
    const base = file.replace(/\.avif$/i, '');
    const outWebP = path.join(folder, base + '.webp');
    const outJpg = path.join(folder, base + '.jpg');

    try {
      await sharp(input).webp({ quality: 90 }).toFile(outWebP);
      console.log('Written', outWebP);
      await sharp(input).jpeg({ quality: 90 }).toFile(outJpg);
      console.log('Written', outJpg);
    } catch (err) {
      console.error('Failed to convert', input, err.message || err);
    }
  }
}

convertFolder();
