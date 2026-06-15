# Implementation Plan — Website Audit & Optimization

This plan outlines the steps to perform a complete professional audit and optimization across the entire Yash Raj Motion Picture website (Home, About, Services, Portfolio, Contact, and subpages) to elevate it to agency-level production standards.

---

## User Review Required

Please review the proposed updates below for SEO, performance, design, and consistency.

> [!IMPORTANT]
> **Key Decisions & Enhancements:**
> 1. **Unsplash Asset Replacement**: We will systematically replace all remaining Unsplash and external stock image links in headers, banners, and grids with locally hosted photography assets from our `/Staticdata/images/` subdirectories.
> 2. **Technical SEO Integration**: We will insert canonical tags and Open Graph metadata template headers on all HTML pages referencing `https://yashrajmotionpicture.com/` as the primary domain.
> 3. **Robots.txt & Sitemap**: We will update the sitemap path in `robots.txt` and create a dedicated `sitemap.xml` file mapped to `yashrajmotionpicture.com`.
> 4. **Image & Video Performance**: We will append `loading="lazy"` and alt descriptions to all `<img>` tags and video poster images.
> 5. **Visual Grid Polish**: We will ensure the Fashion 2x2 grid layout handles different screens correctly, and align typography variables.

---

## Proposed Changes

We will edit the files logically, starting with page structures and ending with technical sitemaps.

### [Technical & SEO Foundation]

#### [NEW] [sitemap.xml](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/sitemap.xml)
* Create a complete search-engine sitemap listing all pages:
  - `/` (Home)
  - `/about/`
  - `/services/`
  - `/portfolio/`
  - `/packages/`
  - `/contact/`
  - `/testimonials/`
  - `/blog/`
  - `/wedding-photography/`
  - `/pre-wedding/`
  - `/corporate-events/`
  - `/drone-photography/`
  - `/product-fashion/`
  - `/book-now/`
  - `/gallery/`

#### [MODIFY] [robots.txt](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/robots.txt)
* Point `Sitemap:` to `https://yashrajmotionpicture.com/sitemap.xml`.

---

### [Global CSS & Style Polish]

#### [MODIFY] [style.css](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/css/style.css)
* Verify that the global visual hierarchy, line heights, and spacings are consistently applied.
* Add responsive typography values inside `:root`.

#### [MODIFY] [pages.css](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/css/pages.css)
* Add grid rules for `data-active-filter` to prevent layout breaks on other grid columns.
* Ensure consistent margin between masonry items on mobile viewport sizes.

---

### [Page Audits & Placeholders Cleanup]

#### [MODIFY] [index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/index.html)
* Replace any remaining external stock-photo links.
* Ensure Open Graph tags and meta properties are fully populated.

#### [MODIFY] [about/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/about/index.html)
* Replace Unsplash URLs with high-quality local couple/wedding/about photos.
* Add missing canonical URL.
* Audit typography and layout spacing.

#### [MODIFY] [contact/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/contact/index.html)
* Add canonical link pointing to `/contact/`.
* Remove any local layout errors or inconsistencies in footer code.

#### [MODIFY] [services/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/services/index.html)
* Swap Unsplash hero URL with `Staticdata/images/wedding/marriage (1).jpeg`.
* Add missing canonical meta tag.

#### [MODIFY] [packages/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/packages/index.html)
* Update stock background image styles to point to local assets.
* Inject canonical and OG tags.

#### [MODIFY] [wedding-photography/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/wedding-photography/index.html)
* Clean up all Unsplash URLs in cards, detail sections, and hero banners.
* Ensure all images use `loading="lazy"` and alt texts.
* Map canonical tag.

#### [MODIFY] [pre-wedding/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/pre-wedding/index.html)
* Clean up 14+ Unsplash URLs. Map to local `Prewedding` images.
* Setup canonical link.

#### [MODIFY] [corporate-events/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/corporate-events/index.html)
* Clean up Unsplash URLs. Map to local `Corporate` and `Events` assets.
* Inject canonical link.

#### [MODIFY] [drone-photography/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/drone-photography/index.html)
* Swap stock hero banner with local `Staticdata/images/drone/images3.jpg`.
* Add canonical link.

#### [MODIFY] [product-fashion/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/product-fashion/index.html)
* Clean up all Unsplash URLs. Map to local `Fashion` and `Product` files.
* Inject canonical link.

#### [MODIFY] [testimonials/index.html](file:///c:/Users/Admin/source/repos/Photoandvideographywhitethem/testimonials/index.html)
* Replace stock video testimonial poster images with local wedding/pre-wedding thumbnails.
* Add canonical link.

---

## Verification Plan

### Automated Checks
- Validate HTML markup structure.
- Verify sitemap is well-formed XML.

### Manual Verification
- Check all pages across viewport dimensions (mobile, tablet, desktop) to ensure no layouts break.
- Verify sitemap links match canonical link tags exactly.
- Confirm all images load from local storage path (`/Staticdata/`) instead of Unsplash.
