# Implementation Plan — Portfolio Hover & Lightbox Upgrades & Contact Form White Background Styling

This plan outlines the design and code enhancements to:
1. Resolve the overlapping hover text on the portfolio page grid items.
2. Implement a premium, unified fullscreen lightbox for images/videos with glassmorphism captions.
3. Update the contact page form card to feature a gorgeous white textured background image with highly legible dark/gold contrast styling.

## Proposed Changes

### 1. Style Corrections & Enhancements

#### [MODIFY] [pages.css](file:///c:/Users/Admin/source/repos/Photoandvideography/css/pages.css)
- **Portfolio Hover Text**: Set `.masonry-info` to `opacity: 0` and `pointer-events: none` by default, transitioning to `opacity: 1` on hover.
- **Lightbox Styling**: Add styling for `.lightbox-content` (flex alignment), `.lightbox-video` (sizing), and `.lightbox-caption` (semi-transparent blur backdrop with gold accents, gold titles, and light gray subtitles).

#### [MODIFY] [contact/index.html](file:///c:/Users/Admin/source/repos/Photoandvideography/contact/index.html)
- **Contact Form White Background**:
  - Set the background of `.contact-form-container` to a high-end white marble background image overlaid with a semi-transparent white gradient (`rgba(255, 255, 255, 0.92)`).
  - Update headers, form labels, input placeholders, select dropdowns, and button colors within the form card to be dark (e.g. `#13100E`) and gold, creating a beautiful and highly readable contrast.

### 2. JavaScript Unified Lightbox Controller

#### [MODIFY] [main.js](file:///c:/Users/Admin/source/repos/Photoandvideography/js/main.js)
- Upgrade the `#lightbox` element setup. Dynamically create/inject a container that houses both `<img>` and `<video>` tags along with the caption area.
- Add unified click listeners to support opening any `.masonry-item` (both images and videos on the Portfolio page), `.gallery-item`, or standard `[data-lightbox]` element in the lightbox.
- Extract caption text (title/subtitle) from `.masonry-info` tags or image `alt` attributes.
- Ensure video playbacks pause/reset correctly when the lightbox is closed so audio doesn't continue in the background.

---

## Verification Plan

### Manual Verification
1. **Portfolio Hover**: Hover over portfolio grid items and check that text overlay appears smoothly.
2. **Lightbox Captions & Videos**: Click a portfolio image and video. Verify that the media loads in fullscreen, showing the title and location at the bottom. Closing the video must stop the audio immediately.
3. **Contact Form Style**: Open `/contact/` and verify the form container now has a luxurious white marble textured background. Check that all label text, inputs, and the submit button are highly legible and look clean.
