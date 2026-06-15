const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'Staticdata', 'images');
const rootDir = path.join(__dirname, '..');

// Helper to recursively get files
function getFiles(dir, extFilter) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, extFilter));
    } else {
      if (!extFilter || extFilter.includes(path.extname(filePath).toLowerCase())) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// 1. Convert and compress images
async function optimizeImages() {
  console.log('Scanning images inside:', imagesDir);
  const imageFiles = getFiles(imagesDir, ['.jpg', '.jpeg', '.png']);
  console.log(`Found ${imageFiles.length} JPEGs/PNGs to optimize.`);

  for (const imgPath of imageFiles) {
    const ext = path.extname(imgPath).toLowerCase();
    const dir = path.dirname(imgPath);
    const base = path.basename(imgPath, ext);
    const webpPath = path.join(dir, base + '.webp');

    console.log(`Optimizing: ${path.relative(imagesDir, imgPath)}`);

    try {
      // Create WebP version
      await sharp(imgPath)
        .webp({ quality: 80 })
        .toFile(webpPath);
      console.log(`  -> Generated WebP: ${path.relative(imagesDir, webpPath)}`);

      // Compress original file in-place to act as fallback
      const tempPath = imgPath + '.tmp';
      if (ext === '.png') {
        await sharp(imgPath)
          .png({ quality: 75, compressionLevel: 8 })
          .toFile(tempPath);
      } else {
        await sharp(imgPath)
          .jpeg({ quality: 75, progressive: true })
          .toFile(tempPath);
      }
      fs.renameSync(tempPath, imgPath);
      console.log(`  -> Compressed original: ${path.relative(imagesDir, imgPath)}`);
    } catch (err) {
      console.error(`  [ERROR] Failed to process ${imgPath}:`, err.message || err);
    }
  }
}

// 2. Update code references in HTML, CSS
function updateReferences() {
  console.log('\nUpdating references in HTML and CSS files...');

  // Find all HTML and CSS files recursively (skip node_modules, .git)
  function findFilesToUpdate(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules' || file === '.git' || file === 'packages') continue;
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(findFilesToUpdate(filePath));
      } else {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.html' || ext === '.css') {
          results.push(filePath);
        }
      }
    }
    return results;
  }

  const files = findFilesToUpdate(rootDir);
  console.log(`Found ${files.length} HTML/CSS files to update.`);

  // Regex to match Staticdata/images/ paths (excluding quotes, closing parens, brackets)
  const imgPathRegex = /(Staticdata\/images\/[^"'>)]*?\.)(jpg|jpeg|png)/gi;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (imgPathRegex.test(content)) {
      const updated = content.replace(imgPathRegex, '$1webp');
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`  Updated references in: ${path.relative(rootDir, filePath)}`);
    }
  }
  console.log('References update complete!');
}

// 3. Optimize Google Fonts loading (async rendering)
function optimizeFonts() {
  console.log('\nOptimizing Google Fonts loading (async rendering)...');
  // Reuse same recursion pattern for HTML files only
  function findHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules' || file === '.git' || file === 'packages') continue;
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(findHtmlFiles(filePath));
      } else {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.html') {
          results.push(filePath);
        }
      }
    }
    return results;
  }

  const htmlFiles = findHtmlFiles(rootDir);
  console.log(`Found ${htmlFiles.length} HTML files to optimize for fonts.`);

  // Regex to capture Google Fonts stylesheet link tag (multi-line supported)
  const fontLinkRegex = /<link[^>]*?href=["'](https:\/\/fonts\.googleapis\.com\/css2[^"']+)["'][^>]*?>/gi;

  for (const filePath of htmlFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (fontLinkRegex.test(content)) {
      fontLinkRegex.lastIndex = 0; // reset regex index
      const updated = content.replace(fontLinkRegex, (match, url) => {
        const cleanUrl = url.replace(/&amp;/g, '&');
        return `<link rel="preload" as="style" href="${cleanUrl}" />\n  <link rel="stylesheet" href="${cleanUrl}" media="print" onload="this.media='all'" />`;
      });
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`  Optimized fonts in: ${path.relative(rootDir, filePath)}`);
    }
  }
  console.log('Font optimization complete!');
}

async function run() {
  await optimizeImages();
  updateReferences();
  optimizeFonts();
  console.log('\n======================================================');
  console.log('Asset and font optimization completed successfully!');
  console.log('======================================================');
}

run().catch(console.error);
