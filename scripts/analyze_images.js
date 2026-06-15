const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'Staticdata', 'images');
console.log('Scanning directory:', imgDir);

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

const allFiles = getFiles(imgDir);
const sorted = allFiles
  .map(f => {
    const stats = fs.statSync(f);
    return {
      path: path.relative(imgDir, f),
      sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
      sizeBytes: stats.size
    };
  })
  .sort((a, b) => b.sizeBytes - a.sizeBytes);

console.log('\n--- Top 30 Largest Images ---');
sorted.slice(0, 30).forEach((item, index) => {
  console.log(`${index + 1}. ${item.path} - ${item.sizeMB} MB (${item.sizeBytes} bytes)`);
});
