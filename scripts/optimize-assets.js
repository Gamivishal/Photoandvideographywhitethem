const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.join(__dirname, '..');
const imagesDir = path.join(rootDir, 'Staticdata', 'images');
const cssDir = path.join(rootDir, 'css');
const jsDir = path.join(rootDir, 'js');

// Helper to recursively get files
function getFiles(dir, extFilter) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'packages') {
        results = results.concat(getFiles(filePath, extFilter));
      }
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
  console.log('--- Step 1: Optimizing Images ---');
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

// Helper to minify CSS
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ')             // Collapse whitespace
    .replace(/\s*([\{\}:;,])\s*/g, '$1') // Remove spacing around symbols
    .replace(/;}/g, '}')             // Remove redundant semicolons
    .trim();
}

// Helper to minify JS (Safe basic minifier)
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    // Collapsing multiple whitespace/tabs safely
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')       // Clean up spacing around newlines
    .trim();
}

// Helper to minify HTML (Safe split-based HTML minifier)
function minifyHTML(html) {
  // Strip HTML comments
  let minified = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

  // Split by tag boundaries to protect scripts/styles contents
  const parts = minified.split(/(<\/?[a-zA-Z0-9\-]+[^>]*>)/g);
  let isScript = false;
  let isStyle = false;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    if (part.toLowerCase().startsWith('<script')) {
      isScript = true;
    } else if (part.toLowerCase().startsWith('</script')) {
      isScript = false;
    } else if (part.toLowerCase().startsWith('<style')) {
      isStyle = true;
    } else if (part.toLowerCase().startsWith('</style')) {
      isStyle = false;
    } else if (!isScript && !isStyle && !part.startsWith('<')) {
      // It is a text node between tags, safe to collapse whitespace
      parts[i] = part.replace(/\s+/g, ' ');
    } else if (!isScript && !isStyle && part.startsWith('<')) {
      // Collapse inner tag spaces safely
      parts[i] = part.replace(/\s+/g, ' ');
    }
  }

  return parts.join('')
    .replace(/> </g, '><') // Remove spaces between tags
    .trim();
}

// 2. Process stylesheets and JS files (Minification)
function minifyAssets() {
  console.log('\n--- Step 2: Minifying CSS and JS Assets ---');

  // Minify CSS
  const cssFiles = getFiles(cssDir, ['.css']);
  for (const cssPath of cssFiles) {
    console.log(`Minifying CSS: ${path.relative(rootDir, cssPath)}`);
    const original = fs.readFileSync(cssPath, 'utf8');
    const minified = minifyCSS(original);
    fs.writeFileSync(cssPath, minified, 'utf8');
  }

  // Minify JS
  const jsFiles = getFiles(jsDir, ['.js']);
  for (const jsPath of jsFiles) {
    console.log(`Minifying JS: ${path.relative(rootDir, jsPath)}`);
    const original = fs.readFileSync(jsPath, 'utf8');
    const minified = minifyJS(original);
    fs.writeFileSync(jsPath, minified, 'utf8');
  }
}

// 3. Inline Header and Footer HTML, CSS Loading, LCP preloading, HTML minification
function compileHTMLPages() {
  console.log('\n--- Step 3: Compiling and Optimizing HTML Pages ---');

  // Load Header and Footer templates
  const headerJsPath = path.join(jsDir, 'header.js');
  const footerJsPath = path.join(jsDir, 'footer.js');

  const headerJsContent = fs.readFileSync(headerJsPath, 'utf8');
  const footerJsContent = fs.readFileSync(footerJsPath, 'utf8');

  // Extract HTML templates between backticks in the JS scripts
  const headerHtmlMatch = headerJsContent.match(/const headerHTML\s*=\s*`([\s\S]*?)`;/);
  const footerHtmlMatch = footerJsContent.match(/const footerHTML\s*=\s*`([\s\S]*?)`;/);

  if (!headerHtmlMatch || !footerHtmlMatch) {
    console.error('[ERROR] Could not extract header or footer HTML from JS templates.');
    return;
  }

  const headerTemplate = headerHtmlMatch[1];
  const footerTemplate = footerHtmlMatch[1];

  // Extract critical CSS from style.css
  const styleCssPath = path.join(cssDir, 'style.css');
  const styleCssOriginal = fs.readFileSync(styleCssPath, 'utf8');

  // Take first ~22000 chars (approx. first 900 lines of original styles)
  let criticalCSS = styleCssOriginal.substring(0, 22000);
  const lastBraceIndex = criticalCSS.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    criticalCSS = criticalCSS.substring(0, lastBraceIndex + 1);
  }

  const htmlFiles = getFiles(rootDir, ['.html']);
  console.log(`Processing ${htmlFiles.length} HTML files.`);

  for (const htmlPath of htmlFiles) {
    const relativePath = path.relative(rootDir, htmlPath);
    console.log(`Processing HTML Page: ${relativePath}`);

    let content = fs.readFileSync(htmlPath, 'utf8');

    // Determine path depth (whether subpage)
    const isSubPage = relativePath !== 'index.html';
    const rootPath = isSubPage ? '../' : './';

    // A. Strip out hardcoded custom cursor div elements to reduce DOM nodes
    content = content.replace(/<div[^>]*?class=["'][^"']*?cursor-dot[^"']*?["'][^>]*?>\s*<\/div>/gi, '');
    content = content.replace(/<div[^>]*?class=["'][^"']*?cursor-circle[^"']*?["'][^>]*?>\s*<\/div>/gi, '');
    content = content.replace(/<div[^>]*?id=["']cursorDot["'][^>]*?>\s*<\/div>/gi, '');
    content = content.replace(/<div[^>]*?id=["']cursorCircle["'][^>]*?>\s*<\/div>/gi, '');

    // B. Inline Navbar and Footer HTML
    const resolvedHeader = headerTemplate.replace(/\${root}/g, rootPath);
    const resolvedFooter = footerTemplate.replace(/\${root}/g, rootPath);

    // Replace header script tag
    const headerScriptRegex = /<script[^>]*?src=["'][^"']*?header\.js["'][^>]*?>\s*<\/script>/gi;
    content = content.replace(headerScriptRegex, resolvedHeader);

    // Replace footer script tag
    const footerScriptRegex = /<script[^>]*?src=["'][^"']*?footer\.js["'][^>]*?>\s*<\/script>/gi;
    content = content.replace(footerScriptRegex, resolvedFooter);

    // C. Inline Critical CSS & Async Stylesheets Loading
    const cssLinkRegex = /<link[^>]*?href=["']([^"']*?\.css)["'][^>]*?>/gi;

    let cssLinks = [];
    content = content.replace(cssLinkRegex, (match, cssUrl) => {
      cssLinks.push(cssUrl);
      return ''; // Strip from original header, we will insert them as async preloads
    });

    let asyncCssTags = '';
    const uniqueCssLinks = [...new Set(cssLinks)];
    for (const cssLink of uniqueCssLinks) {
      asyncCssTags += `  <link rel="preload" as="style" href="${cssLink}" />\n  <link rel="stylesheet" href="${cssLink}" media="print" onload="this.media='all'" />\n`;
    }

    const criticalTag = `  <style id="critical-css">\n    ${criticalCSS}\n  </style>\n${asyncCssTags}`;
    content = content.replace(/<\/head>/i, `${criticalTag}\n</head>`);

    // D. Dynamic LCP Hero Image Preloading (with fetchpriority="high")
    let lcpImage = null;
    if (!isSubPage) {
      lcpImage = 'Staticdata/images/Heroimage/Heroimage1.webp';
    } else {
      const bgMatch = content.match(/class=["'][^"']*?page-hero-bg[^"']*?["'][^>]*?style=["'][^"']*?background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
      if (bgMatch) {
        lcpImage = bgMatch[1].replace(/\.(jpg|jpeg|png)/i, '.webp');
      } else {
        const imgMatch = content.match(/<img[^>]*?src=["']([^"']*?Staticdata\/images\/[^"']*?)["']/i);
        if (imgMatch && !imgMatch[1].includes('Logo')) {
          lcpImage = imgMatch[1].replace(/\.(jpg|jpeg|png)/i, '.webp');
        }
      }
    }

    if (lcpImage) {
      console.log(`  -> Injecting LCP Hero Preload for: ${lcpImage}`);
      const preloadTag = `  <link rel="preload" as="image" href="${lcpImage}" fetchpriority="high" />`;
      content = content.replace(/<head>/i, `<head>\n${preloadTag}`);
    }

    // E. Optimize Google Fonts loading (async, only Montserrat & Playfair Display, display=swap)
    const fontLinkRegex = /<link[^>]*?href=["'](https:\/\/fonts\.googleapis\.com\/css2[^"']+)["'][^>]*?>/gi;
    const optimizedFontUrl = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';

    let fontReplaced = false;
    content = content.replace(fontLinkRegex, (match, url) => {
      fontReplaced = true;
      return `<link rel="preload" as="style" href="${optimizedFontUrl}" />\n  <link rel="stylesheet" href="${optimizedFontUrl}" media="print" onload="this.media='all'" />`;
    });

    // If there were preconnect links but font link matched slightly differently, replace preconnects or ensure it exists
    if (!fontReplaced) {
      // Check if we already have it or if we should add it
      if (!content.includes('fonts.googleapis.com')) {
        const preconnectTags = `  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link rel="preload" as="style" href="${optimizedFontUrl}" />\n  <link rel="stylesheet" href="${optimizedFontUrl}" media="print" onload="this.media='all'" />`;
        content = content.replace(/<\/head>/i, `${preconnectTags}\n</head>`);
      }
    }

    // F. Convert image links in HTML attributes (from jpg/jpeg/png to webp)
    const imageExtensionsRegex = /(Staticdata\/images\/[^"'>)]*?\.)(jpg|jpeg|png)/gi;
    content = content.replace(imageExtensionsRegex, '$1webp');

    // G. Defer non-critical javascript scripts (main.js and animations.js)
    const mainScriptRegex = /(<script[^>]*?src=["'][^"']*?js\/main\.js["'])/gi;
    const animScriptRegex = /(<script[^>]*?src=["'][^"']*?js\/animations\.js["'])/gi;

    content = content.replace(mainScriptRegex, '$1 defer');
    content = content.replace(animScriptRegex, '$1 defer');

    // H. Minify HTML
    const minifiedContent = minifyHTML(content);

    // Save optimized HTML
    fs.writeFileSync(htmlPath, minifiedContent, 'utf8');
    console.log(`  -> HTML Page ${relativePath} optimized & compiled successfully!`);
  }
}

async function run() {
  console.log('======================================================');
  console.log('Starting Website Performance Compilation & Optimizations');
  console.log('======================================================\n');

  await optimizeImages();
  minifyAssets();
  compileHTMLPages();

  console.log('\n======================================================');
  console.log('Compilation completed successfully!');
  console.log('All images optimized, files minified, and headers inlined.');
  console.log('======================================================');
}

run().catch(console.error);
