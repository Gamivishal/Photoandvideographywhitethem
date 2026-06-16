# Implementation Plan — Lighthouse Performance Optimization (Mobile 90+ / Desktop 95+)

This plan outlines the technical steps to optimize the Yash Raj Motion Picture website for maximum Lighthouse Performance scores, targeting:
* **Mobile Performance**: 90+
* **Desktop Performance**: 95+
* **Core Web Vitals**: Pass (FCP < 1.8s, LCP < 2.5s, CLS < 0.1, TBT < 150ms, INP < 200ms)

---

## User Review Required

Since our sandboxed environment has restricted local terminal execution permissions, we have designed a fully automated optimization script `scripts/optimize-assets.js`. After reviewing and approving this plan, you will need to run the following command in your local terminal:

```bash
node scripts/optimize-assets.js
```

Running this script will automatically perform image conversions, minification of HTML, CSS, and JS, critical CSS extraction/inlining, and static header/footer HTML compilation across all 15 pages of the site.

---

## Proposed Changes

We will group our optimizations into 6 core performance layers:

### 1. Inlining Header & Footer (Eliminating Render-Blocking JS & CLS)
Currently, `js/header.js` and `js/footer.js` dynamically insert the navigation menu and footer elements using `document.write` or `insertAdjacentHTML` on page load. This causes:
* **Render-Blocking Penalty**: The browser blocks page parsing to fetch and execute these external scripts.
* **Layout Shift (CLS)**: The page renders briefly without a header, and then shifts dramatically when the navbar is injected, penalizing CLS.
* **Compatibility Warnings**: Lighthouse flags the use of `document.write` as a critical performance blocker.

**Solution**:
Our script will parse the static HTML elements from `js/header.js` and `js/footer.js`, resolve the relative file paths (e.g. `./` for root, `../` for subpages), and compile them directly into the 15 HTML files. The script tags `<script src="js/header.js"></script>` and `footer.js` will be removed.

### 2. Critical CSS Inlining & Async Stylesheets (Eliminating FOUC & Render-Blocking CSS)
Stylesheets block initial paint. The site loads ~140KB of CSS (`style.css`, `pages.css`, `animations.css`) synchronously.

**Solution**:
* We will extract the first **900 lines of style.css** (containing `:root` variables, reset rules, loading screens, custom cursor coordinates, navbar alignment, and hero layout), minify them, and inline them in a `<style id="critical-css">` tag in the `<head>` of all HTML files.
* We will convert the full stylesheets loading sequence to load asynchronously:
```html
<link rel="preload" as="style" href="css/style.css" />
<link rel="stylesheet" href="css/style.css" media="print" onload="this.media='all'" />
```
This ensures above-the-fold content paints instantly with zero layout shifts, while the remaining heavy styles load in the background.

### 3. Dynamic LCP Preloading & Image Optimization
Large uncompressed JPEGs (up to 3.5MB each) delay the Largest Contentful Paint (LCP).

**Solution**:
* **Next-Gen WebP Conversion**: The script will recursively convert JPEGs/PNGs into optimized WebP formats (80% quality) and update references in all HTML and CSS files.
* **Image Compression**: Original files will be compressed in-place to ~75% quality as fallbacks.
* **LCP Preload Injection**: For each page, our script will detect the above-the-fold LCP image (e.g. `Heroimage1.webp` on the homepage, or the unique page-hero backgrounds on subpages) and inject a `<link rel="preload" as="image" href="..." />` tag in the `<head>` to start downloading the asset immediately.

### 4. Code Minification & Non-Blocking JS Execution
* **HTML, CSS, JS Minification**: Our script will recursively remove comments, collapse whitespace, and compress code lines in all static assets.
* **Non-Blocking Scripts**: We will add the `defer` attribute to the remaining `main.js` and `animations.js` tags at the bottom of the body.
* **Throttling Custom Cursor & Particle Controls**: In `js/main.js`, we will throttle cursor tracking coordinates using `requestAnimationFrame` and skip tracking entirely on mobile screens, minimizing main-thread blocking time (TBT) and improving Interaction to Next Paint (INP).

### 5. Service Worker Caching for Repeat Visits
We will create a Service Worker (`sw.js`) that caches static assets (WebP images, CSS, JS, Google Fonts) using a cache-first strategy. This guarantees near-instant loading (0ms network cost) for repeat visits.

### 6. HTML Payload Minification
We will strip comments and collapse whitespace in all 15 HTML files to reduce initial payload bytes, leading to faster Time to First Byte (TTFB) and First Contentful Paint (FCP).

---

## Proposed File Changes

### [Scripting & Build Layer]
#### [MODIFY] [optimize-assets.js](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/scripts/optimize-assets.js)
* Update/Rewrite the automation script to handle:
  1. Header/Footer HTML inlining in all HTML files.
  2. Critical CSS extraction and injection.
  3. Dynamic LCP preloading injection per page.
  4. HTML, CSS, and JS minification.
  5. Image compression and WebP conversion.

### [Asset & Caching Layer]
#### [NEW] [sw.js](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/sw.js)
* Implement cache-first service worker for static files and preloaded fonts.

### [Global Stylesheet & Logic]
#### [MODIFY] [main.js](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/js/main.js)
* Add Service Worker registration script.
* Optimize custom cursor code to prevent main thread blocking (lower TBT and INP).

---

## Verification Plan

### Automated Tests
* **Lighthouse Audits**: Once you run the optimization script, run a local Lighthouse audit to confirm:
  * Performance: Mobile > 90, Desktop > 95.
  * LCP < 2.5s, TBT < 150ms, CLS < 0.1.
* **Syntax/Lint check**: Check console for any JS errors or broken images.

### Manual Verification
* Inspect pages on mobile viewports to verify that the navbar toggle, slider, WhatsApp float, and images load correctly and align.
