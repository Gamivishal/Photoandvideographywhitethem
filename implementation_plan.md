# Implementation Plan — Lighthouse Performance & Accessibility Optimizations (>90 Score)

This plan details the technical steps to optimize the Yash Raj Motion Picture website for mobile and desktop clients, raising Lighthouse **Performance** and **Accessibility** scores to 90+.

---

## User Review Required

Please review the proposed plan to optimize the website's performance and accessibility scores. Since I cannot execute terminal commands directly due to execution constraints in my environment, I have created a script that you can run locally to automate the image compression and conversion process.

> [!IMPORTANT]
> **Key Steps & Approvals:**
> 1. **Run the Asset Optimizer Script**: You will need to run `node scripts/optimize-assets.js` in your terminal. This will automatically convert all JPEG/PNG images to WebP and compress the original files to ~75% quality (reducing their total size from ~25MB to under 1.5MB).
> 2. **Review Asynchronous Font Loading**: We will convert the Google Fonts link on all 14 pages to load asynchronously, preventing them from blocking initial page rendering.
> 3. **Approve Text Contrast Tuning**: We will adjust the light-theme gold color variable slightly (making it darker) to ensure readability and compliance with the WCAG 4.5:1 ratio.

---

## Proposed Changes

### 1. Performance Optimizations

#### A. Image Asset Compression & WebP Conversion
The homepage currently loads around 7.5MB of hero images, and other pages load heavy couple/wedding photos ranging between 2.5MB and 3.5MB each.
We will create a Node.js utility script, `scripts/optimize-assets.js`, to:
1. Recursively scan `Staticdata/images/`.
2. Convert all `.jpg`, `.jpeg`, and `.png` files into optimized next-gen `.webp` formats (at 80% quality).
3. Compress the original `.jpg`, `.jpeg`, and `.png` files directly (reducing their size by 90-95% to act as fail-safe fallback images).
4. Run a script-based search-and-replace to update `.jpg`/`.jpeg`/`.png` references to `.webp` across all HTML and CSS files.

#### B. Asynchronous Font Loading (Non-Blocking)
Google Fonts stylesheets block rendering by default. We will update all 14 HTML pages to load Google Fonts asynchronously using the preload/print onload technique:
```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" media="print" onload="this.media='all'" />
```

#### C. Mobile Performance: Custom Cursor & Particle Controls
- We will add a media query in `css/style.css` to hide the custom cursor elements (`#cursorDot` and `#cursorCircle`) on screens under `1024px` and devices with touch pointers (`@media (pointer: coarse)` or `(max-width: 1024px)`) to reduce DOM paint and mouse-tracking layout shifting overhead on mobile viewports.
- We will ensure cinematic background animations are paused or disabled on mobile screens to save GPU cycles.

#### D. Lazy Video Preloading
We will audit and ensure all `<video>` elements (e.g. subpages, galleries, portfolios) have `preload="none"` or `preload="metadata"` and fallback poster frames, removing auto-buffering over slow mobile cellular connections.

---

### 2. Accessibility Optimizations

#### A. Color Contrast Adjustments
We will modify `--gold-dark` (`#997852`) to a slightly darker shade `#825e36` specifically under `.white-theme` rules in `css/style.css` to ensure all gold headers and small text elements achieve a contrast ratio above the WCAG AA requirement of **4.5:1** on light backgrounds (current contrast is 4.1:1).

#### B. Instagram Grid Accessible Names
The homepage footer features an Instagram grid with 10 visual link cards. Currently, these links contain no inner text and no labels, causing Lighthouse to flag "Links do not have a discernible name". We will add descriptive `aria-label` tags to each link:
```html
<a href="https://www.instagram.com/yashraj_motion_picturez/" target="_blank" rel="noopener" class="insta-item" style="..." aria-label="View Yash Raj Motion Picture Instagram portfolio post 1"></a>
```

---

## Proposed File Changes

### [Technical & Scripting Layer]

#### [NEW] [optimize-assets.js](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/scripts/optimize-assets.js)
* Write a Node script utilizing the `sharp` library to compress all JPEGs/PNGs, generate WebP formats, and automatically update reference paths in all HTML and CSS files.
* Since our environment runner has system-restricted execution permissions, the USER can execute this script locally via:
  ```bash
  node scripts/optimize-assets.js
  ```

### [Global CSS Stylesheet]

#### [MODIFY] [style.css](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/css/style.css)
* Adjust text contrast parameters for `.white-theme .section-label` and `.white-theme .btn-text-link`.
* Add media queries to set custom cursors `.cursor-dot` and `.cursor-circle` to `display: none` on mobile/touch pointers.

### [HTML Page Templates]

#### [MODIFY] All HTML Pages (14 files)
* Update Google Font tags to load asynchronously.
* Ensure all image/video links point to compressed next-gen WebP formats.
* Add accessible names/labels (`aria-label`) to elements lacking discernible names (specifically the Instagram feed on the homepage).

---

## Verification Plan

### Automated Checks
- Run a site review pass using Lighthouse F12 locally to confirm:
  - Mobile & Desktop Performance > 90
  - Mobile & Desktop Accessibility > 90
- Validate that all updated resource links (WebP) map correctly.

### Manual Verification
- Test key inputs, forms, and pages across viewports (mobile, tablet, desktop) to ensure no layouts break.
- Verify touch inputs work smoothly on mobile layout simulations without the custom cursor layer.
