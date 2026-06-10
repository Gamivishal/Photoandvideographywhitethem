const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const rootDir = __dirname;

if (!fs.existsSync(pagesDir)) {
  console.log('Pages directory not found or already restructured.');
  process.exit(0);
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const pageName = file.replace('.html', '');
  const targetDir = path.join(rootDir, pageName);

  // Create folder
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // Read content
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Update links inside the file to use clean URLs
  // Replace: href="something.html" -> href="../something/"
  // Replace: href="../index.html" -> href="../"

  content = content.replace(/href="\.\.\/index\.html"/g, 'href="../"');

  // Replace standard page links (e.g. href="about.html" -> href="../about/")
  files.forEach(f => {
    const pName = f.replace('.html', '');
    const regex = new RegExp(`href="${f}"`, 'g');
    content = content.replace(regex, `href="../${pName}/"`);
  });

  // Write to new location
  const newFilePath = path.join(targetDir, 'index.html');
  fs.writeFileSync(newFilePath, content, 'utf-8');

  // Delete old file
  fs.unlinkSync(filePath);
  console.log(`Moved and updated ${file} -> ${pageName}/index.html`);
});

// Remove pages dir if empty
try {
  fs.rmdirSync(pagesDir);
  console.log('Removed empty pages directory.');
} catch (e) {
  console.log('Could not remove pages directory (might not be empty).');
}

console.log('Restructure complete! Your website now uses Clean URLs.');
