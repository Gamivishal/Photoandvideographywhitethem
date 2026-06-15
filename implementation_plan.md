# Implementation Plan — Mobile Award Ceremony Timeline Premium Iteration

This plan outlines the mobile-first CSS updates to transform the Award Ceremony timeline into an ultra-premium, luxury wedding studio showcase on mobile devices (screens 320px to 414px) while leaving the desktop layout intact.

---

## User Review Required

Please review the proposed mobile improvements and let me know if you would like to adjust the accents, shadows, or spacing variables.

> [!NOTE]
> All changes are restricted to the `@media (max-width: 768px)` query block in `css/pages.css`, ensuring the desktop layout remains unchanged.

---

## Mobile Showcase Features

### 1. Dashed Gold Thread Line
*   **Design**: Replace the solid vertical line on mobile with a subtle dashed gold thread line (`border-left: 1px dashed rgba(212, 175, 55, 0.45)`). This evokes fine-art lace or metallic wedding fabrics.
*   **Concentric Dots**: Style dots as a target aperture (`width: 14px; height: 14px; background: var(--gold); border: 3px solid #fff; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);`).

### 2. High-End Editorial Cards
*   **Elevation**: Soft, diffuse shadows (`box-shadow: 0 12px 30px rgba(18, 16, 14, 0.03)`) and subtle border lines (`1px solid rgba(212, 175, 55, 0.08)`).
*   **Corners**: Rounded card shapes with `14px` border-radius.
*   **Full-Width Image Layout**: Card padding is set to `0`, and images span 100% width of the card. The card's `overflow: hidden` automatically clips the top corners of the image.
*   **Text Block Padding**: Internal padding is focused on the text section below the photo (`padding: 1.75rem 1.5rem`).

### 3. Gold Accent Elements
*   **Laurel Star Accent**: Add a gold star (`✦`) pseudo-element before the category text `.timeline-meta`.
*   **Decorative Divider**: Add a delicate gold accent divider line (`width: 30px; height: 1.5px; background: var(--gold); margin-bottom: 0.75rem;`) directly above the text contents.

### 4. Alternating Card Colorways
*   **Card 1 & 3 (Light Gold Accent)**: Left border is solid gold (`border-left: 3px solid var(--gold)`) and background has a warm cream tint (`#fffdfb`).
*   **Card 2 (Ivory Accent)**: Left border is ivory-bronze (`border-left: 3px solid #d4cfc3`) and background has a soft ivory tint (`#fafaf8`).

### 5. Transition & Reveal Animations
*   Override reveal classes to fade/slide up over exactly `0.7s` using a custom cubic-bezier timing function (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`).

---

## Proposed CSS Overrides

Inside `css/pages.css` under `@media (max-width: 768px)`:

```css
@media (max-width: 768px) {
  /* Scroll reveal durations */
  .timeline-item.reveal-left, 
  .timeline-item.reveal-right {
    opacity: 0;
    transform: translateY(30px) !important;
    transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  }
  
  .timeline-item.reveal-left.visible, 
  .timeline-item.reveal-right.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  .award-ceremony .container {
    padding-left: 1.25rem !important;
    padding-right: 1.25rem !important;
  }

  /* Dashed Gold Thread line */
  .timeline-track {
    left: 20px !important;
    width: 0 !important;
    background: none !important;
    border-left: 1px dashed rgba(212, 175, 55, 0.45) !important;
    transform: none !important;
  }

  .timeline-item {
    display: flex !important;
    flex-direction: row !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    padding-left: 44px !important; /* Spacing from the track */
    margin-left: 0 !important;
    margin-bottom: 4.5rem !important; /* Spacious breathing room */
    width: 100% !important;
  }

  .timeline-item:last-child {
    margin-bottom: 0 !important;
  }

  .timeline-item.right {
    flex-direction: row !important;
  }

  /* Concentric target-dots */
  .timeline-dot {
    left: 20px !important;
    top: 28px !important;
    width: 14px !important;
    height: 14px !important;
    background: var(--gold) !important;
    border: 3px solid var(--white) !important;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3) !important;
    transform: translate(-50%, -50%) !important;
  }
  
  .timeline-dot::after {
    display: none !important; /* Hide desktop aperture inner element */
  }

  /* Full-width image editorial cards */
  .timeline-content {
    width: 100% !important;
    flex-direction: column !important;
    align-items: stretch !important;
    text-align: left !important;
    padding: 0 !important; /* Removed outer padding for full-width photo */
    border-radius: 14px !important;
    border: 1px solid rgba(212, 175, 55, 0.08) !important;
    box-shadow: 0 12px 30px rgba(18, 16, 14, 0.03) !important;
    overflow: hidden; /* Clips top photo corners to matches card radius */
  }

  /* Alternating Card Styles */
  .timeline-item:nth-of-type(1) .timeline-content,
  .timeline-item:nth-of-type(3) .timeline-content {
    border-left: 4px solid var(--gold) !important;
    background: #fffdfb !important; /* Light gold tint */
  }

  .timeline-item:nth-of-type(2) .timeline-content {
    border-left: 4px solid #d4cfc3 !important; /* Ivory accent */
    background: #fafaf8 !important; /* Ivory tint */
  }

  .timeline-item.left .timeline-content {
    text-align: left !important;
    flex-direction: column !important; /* Force photo on top, text on bottom */
  }

  .timeline-image {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    aspect-ratio: 16 / 10 !important;
    padding: 0 !important; /* Photo reaches edge */
    border: none !important;
  }

  .timeline-text {
    padding: 1.75rem 1.5rem !important; /* Added internal padding to text area */
  }

  /* Small gold accent divider line inside cards */
  .timeline-text::before {
    content: "";
    display: block;
    width: 30px;
    height: 1.5px;
    background: var(--gold);
    margin-bottom: 0.75rem;
  }

  /* Laurel star accent before category subtitle */
  .timeline-meta {
    font-size: 0.78rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.12em !important;
    color: var(--gold) !important;
    margin-bottom: 0.4rem !important;
    display: flex !important;
    align-items: center !important;
  }

  .timeline-meta::before {
    content: "✦" !important;
    font-size: 0.75rem !important;
    margin-right: 6px !important;
    color: var(--gold) !important;
    display: inline-block !important;
  }

  .timeline-text h4 {
    font-size: clamp(20px, 4.8vw, 23px) !important;
    margin-bottom: 0.6rem !important;
  }

  .timeline-text p {
    font-size: 14px !important;
    line-height: 1.55 !important;
  }
}
```

---

## Verification Plan

### Manual Verification
1.  Verify that desktop viewports render the alternating two-column layouts with hover effects unchanged.
2.  Use responsiveness simulator to audit viewports:
    *   **320px** (iPhone SE)
    *   **375px** (iPhone X/12 Mini)
    *   **390px** (iPhone 13/14)
    *   **414px** (iPhone 8 Plus/11)
3.  Ensure that images are cropped neatly with rounded corners on top, that left borders alternate colors cleanly, and that the text slide-up duration is smooth and visual.
