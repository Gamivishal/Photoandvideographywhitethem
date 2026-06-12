# Mobile Responsiveness Enhancements Implementation Plan

This plan outlines the layout, styling, and design updates required to make the Yash Raj Motion Picture website fully responsive and visually stunning on mobile and tablet viewports.

---

## Proposed Changes

### 1. Fix About Us Grid Overlaps on Tablet & Mobile
*   **The Issue:** On screens under `900px` wide, the `.about-grid` (using `.editorial-grid`) changes its template columns to `1fr` but does not reset the column/row assignments of `.about-image` (`grid-column: 1 / 8; grid-row: 1`) and `.about-text` (`grid-column: 7 / 13; grid-row: 1`). This causes the elements to overlap on a single row and break the layout.
*   **Solution:** In `css/pages.css`, under the `@media (max-width: 900px)` media query:
    *   Set `.editorial-grid` to `grid-template-columns: 1fr` and `gap: 2rem`.
    *   Set `.about-image` and `.about-text` to `grid-column: 1 / -1;` and `grid-row: auto;`.
    *   Optimize padding on `.about-text` to `3rem 2rem` so it fits small viewports perfectly.

### 2. Make the Founder Editorial Grid Fully Responsive
*   **The Issue:** The founder biography section (`.founder-editorial-grid`) lacks responsive overrides. On screens under `900px`, `.founder-text` and `.founder-image-wrapper` overlap inside a 12-column grid.
*   **Solution:** In `css/pages.css`, under `@media (max-width: 900px)`:
    *   Set `.founder-editorial-grid` to `grid-template-columns: 1fr` and `gap: 2rem`.
    *   Set `.founder-text` and `.founder-image-wrapper` to `grid-column: 1 / -1;` and `grid-row: auto;`.
    *   Scale the `.founder-image-wrapper` height to `450px` (or `min-height: auto;`) and padding on `.founder-text` to `0` or minimal values to look clean.

### 3. Redesign the Award Timeline for Small Screens
*   **The Issue:** The timeline is hard-coded to a two-column desktop layout (`.timeline-content { width: 45%; }` with `.timeline-track { left: 50%; }`). On tablet and mobile viewports, this severely squeezes the text and images into narrow vertical strips.
*   **Solution:** In `css/pages.css`, under a new responsive override section:
    *   Shift the `.timeline-track` line to the left (`left: 20px; transform: none;`).
    *   Change `.timeline-item` layout to stack vertically (`flex-direction: column !important; align-items: flex-start; margin-left: 40px; margin-bottom: 4rem;`).
    *   Move `.timeline-dot` to align with the left-aligned track (`left: 20px; top: 25px; transform: translate(-50%, -50%);`).
    *   Allow the `.timeline-content` to span full width (`width: 100% !important; flex-direction: column !important; align-items: flex-start !important; text-align: left !important; gap: 1rem !important;`).
    *   Constrain `.timeline-image` sizing on mobile to scale naturally with a `width: 100%; max-width: 320px;`.

### 4. Optimize Navbar and Logo Proportions on Small Screens
*   **The Issue:** The scrolled header logo might clip or overlap navigation links and toggles when resized.
*   **Solution:** Make sure the mobile navbar is neat and tidy. Ensure `.btn-book` and `#navToggle` are spaced properly and do not overlap on narrow viewports (e.g. `320px` to `480px`).

---

## Modified Files

### [MODIFY] [css/pages.css](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/css/pages.css)
*   Add responsive grid resets for `.about-image`, `.about-text`, `.founder-text`, and `.founder-image-wrapper` under `@media (max-width: 900px)`.
*   Add mobile timeline rules for `.award-timeline` under `@media (max-width: 768px)`.

---

## Verification Plan

### Manual Verification
1.  **About Page Verification:** Load `about/index.html` and verify that the "The Studio Story" and "Yash Raj Founder" sections stack beautifully and vertically without overlays on tablet and mobile resolutions.
2.  **Award Timeline Verification:** Scroll down on `about/index.html` to the Awards section and check that the timeline cards stack cleanly on mobile viewports.
3.  **Header Responsiveness Check:** Resize the screen to check the navbar layout on various widths (desktop, tablet, mobile).
