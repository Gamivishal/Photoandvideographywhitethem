# Lighthouse Optimization Tasks

- [x] 1. Write the Image Optimization Script
  - [x] Create `scripts/optimize-assets.js` using Node.js and the `sharp` library.
  - [x] Configure it to compress all JPEGs/PNGs in `Staticdata/images` recursively.
  - [x] Configure it to generate WebP formats and update all HTML/CSS references from `.jpeg`/`.jpg`/`.png` to `.webp`.
- [ ] 2. Google Fonts Optimization (Async Loading)
  - [ ] Update Google Fonts links on all HTML pages to load asynchronously via preload/onload.
- [x] 3. CSS Performance & Accessibility Tweaks
  - [x] Add media queries in `css/style.css` to hide custom cursors `.cursor-dot` and `.cursor-circle` on screens <= 1024px and touch pointers.
  - [x] In `css/style.css`, modify the scrolled light-theme gold color values to increase contrast to 4.5:1.
- [x] 4. Accessibility Fixes (Home Page Instagram Grid)
  - [x] Add `aria-label` tags to the 10 Instagram grid items in `index.html`.
- [x] 5. Video Performance Fixes
  - [x] Review all pages for auto-buffering `<video>` elements and add `preload="none"` or `preload="metadata"` with fallback posters.
- [x] 6. Verification
  - [x] Ensure all pages build, links map correctly, and layout/formatting is intact.
