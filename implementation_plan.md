# Implementation Plan — Global Responsive Typography Standardization

This plan outlines the steps to perform a complete typography audit and standardize all text styles across the website (Home, About, Services, Portfolio, Packages, Contact, Testimonials, Footer, and timelines) to deliver a consistent, luxury brand experience.

---

## User Review Required

Please review the proposed responsive typography scale, font choices, and standard line heights/spacings.

> [!IMPORTANT]
> To preserve the luxury photography brand aesthetic, we will standardize on:
> *   **Heading Font**: `"Playfair Display"`, serif (or `"Cormorant Garamond"` where appropriate for fine-art contexts, but mapped cleanly).
> *   **Body Font**: `"Montserrat"`, sans-serif.
> *   We will utilize CSS Custom Properties inside `:root` to control the font sizes dynamically. This makes the entire codebase easier to maintain and fully responsive.

---

## Proposed Typography Scale

We will define the following variables inside `:root` in `css/style.css`:

```css
:root {
  /* Font Families */
  --font-heading: "Playfair Display", serif;
  --font-body: "Montserrat", sans-serif;
  --font-serif: "Cormorant Garamond", Georgia, serif; /* Maintained for specific luxury details */

  /* Global Typographic Scales (Desktop defaults) */
  --fs-h1: clamp(2.5rem, 6vw, 4.5rem);      /* Main Hero Titles */
  --fs-h2: clamp(2rem, 4.5vw, 3rem);        /* Section Titles */
  --fs-h3: clamp(1.35rem, 2.5vw, 1.75rem);  /* Card / Mid Titles */
  --fs-h4: clamp(1.1rem, 2vw, 1.3rem);      /* Small Titles / Cards */
  --fs-h5: 1rem;                            /* Badges / Micro Titles */
  --fs-body: 1rem;                          /* Default body/paragraph text */
  --fs-body-sm: 0.875rem;                   /* Small description / captions */
  --fs-label: 0.75rem;                      /* Subtitles / Metadata labels */

  /* Font Weights */
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;
  --fw-bold: 700;

  /* Line Heights */
  --lh-heading: 1.25;
  --lh-body: 1.75;

  /* Letter Spacing */
  --ls-normal: 0;
  --ls-wide: 0.08em;
  --ls-widest: 0.25em;
}
```

### Responsive Scale Overrides
We will adjust the custom properties on smaller screens to ensure readability and prevent overflow:

```css
/* Tablet (max-width: 992px) */
@media (max-width: 992px) {
  :root {
    --fs-h1: clamp(2.2rem, 5vw, 3.5rem);
    --fs-h2: clamp(1.8rem, 4vw, 2.5rem);
    --fs-h3: clamp(1.2rem, 2.5vw, 1.5rem);
    --fs-h4: 1.15rem;
    --fs-body: 0.95rem;
  }
}

/* Mobile (max-width: 768px) */
@media (max-width: 768px) {
  :root {
    --fs-h1: clamp(1.8rem, 7vw, 2.8rem);
    --fs-h2: clamp(1.5rem, 6vw, 2.2rem);
    --fs-h3: 1.25rem;
    --fs-h4: 1.1rem;
    --fs-body: 0.9rem;
    --fs-body-sm: 0.825rem;
    --fs-label: 0.7rem;
  }
}
```

---

## Proposed Changes

We will group changes into `css/style.css` and clean up overrides in `css/pages.css`.

### [Component: CSS Variables & Resets]
#### [MODIFY] [style.css](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/css/style.css)
*   Define core typography CSS variables in `:root`.
*   Standardize base `body` text configurations (using `--font-body`, `--fs-body`, `--fw-light`, `--lh-body`).
*   Map elements `h1`, `h2`, `h3`, `h4`, `h5`, `h6` to the new variables.
*   Enforce a clean reset for consistent line-heights and margin spacing.
*   Update global section headers (`.section-label`, `.section-title`, `.section-desc`) to use variables instead of hardcoded font-sizes.
*   Standardize global button typography (`.btn-primary`, `.btn-outline`, `.btn-text-link`).

### [Component: Pages CSS Audit & Cleanup]
#### [MODIFY] [pages.css](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/css/pages.css)
*   Audit and clean up page-specific components to utilize the new variables.
*   Standardize `.page-hero-content h1` to map directly to `--fs-h1` or `--fs-h2` as appropriate.
*   Standardize testimonial texts, card structures, packages details, and timeline paragraphs.
*   Remove redundant font family declarations (e.g. duplicating serif vs display).

---

## Verification Plan

### Automated Build & Lint Check
*   Ensure the CSS loads correctly, checking for syntax errors or broken braces.

### Manual Verification
1.  Open major pages (`index.html`, `about/index.html`, `wedding-photography/index.html`, `contact/index.html`, `portfolio/index.html`) on desktop and mobile.
2.  Inspect heading elements to confirm they follow the unified custom property scale.
3.  Check layout alignment and line-heights to ensure text flows beautifully without overflowing or text wrapping awkwardly.
4.  Verify that font sizes scale smoothly across Desktop, Tablet, and Mobile.
