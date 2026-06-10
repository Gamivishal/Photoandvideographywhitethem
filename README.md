# 📸 Lumière Studio — Wedding Photography & Videography Website

> A premium wedding photography and videography client presentation website.

---

## 🗂️ Project Structure

```
Photoandvideography/
├── index.html                  # Home page
├── css/
│   ├── style.css               # Main styles (variables, navbar, hero, sections)
│   ├── pages.css               # Inner page styles (about, portfolio, services, etc.)
│   └── animations.css          # Reveal, parallax, micro-animation styles
├── js/
│   ├── main.js                 # Core JS (loader, cursor, slider, counter, forms)
│   └── animations.js           # Scroll animations, parallax, lazy loading
├── pages/
│   ├── about.html              # About Us page
│   ├── portfolio.html          # Portfolio page (with filters + lightbox)
│   ├── services.html           # Services + Packages page
│   ├── gallery.html            # Photo gallery page (with filters + lightbox)
│   └── contact.html            # Contact form + FAQ page
├── api/
│   └── api.js                  # 🔌 API integration layer (ready for backend)
├── images/                     # Place all images here
│   ├── hero1.jpg               # Hero slider image 1
│   ├── hero2.jpg               # Hero slider image 2
│   ├── hero3.jpg               # Hero slider image 3
│   ├── about1.jpg              # Home intro image 1
│   ├── about2.jpg              # Home intro image 2
│   ├── port1.jpg – port6.jpg   # Portfolio images
│   ├── gal1.jpg – gal9.jpg     # Gallery images
│   ├── team1.jpg – team3.jpg   # Team photos
│   ├── svc1.jpg – svc3.jpg     # Service section images
│   ├── cta-bg.jpg              # CTA section background
│   ├── about-hero.jpg          # About page hero background
│   ├── portfolio-hero.jpg      # Portfolio page hero background
│   ├── services-hero.jpg       # Services page hero background
│   ├── gallery-hero.jpg        # Gallery page hero background
│   └── contact-hero.jpg        # Contact page hero background
└── assets/
    └── fonts/                  # Custom fonts (if not using Google Fonts CDN)
```

---

## ✨ Features

- 🌑 **Luxury dark theme** with gold accents
- 🎠 **Auto-playing hero slider** with smooth transitions
- 🖱️ **Custom cursor** with hover effects
- 📜 **Scroll reveal animations** on all sections
- 🔢 **Animated stat counters**
- 🖼️ **Filterable portfolio & gallery** grids
- 💡 **Lightbox** for full-screen image viewing
- 💬 **Testimonials slider**
- 📋 **Contact form** with validation & submission handling
- ❓ **FAQ accordion**
- 📱 **Fully responsive** on all screen sizes
- 🔌 **API-ready architecture** (see `api/api.js`)

---

## 🔌 API Integration (Future)

The file `api/api.js` contains ready-to-use async functions for:

| Endpoint | Function | Description |
|---|---|---|
| `/portfolio` | `fetchPortfolio()` | Fetch portfolio items with pagination & filtering |
| `/gallery` | `fetchGallery()` | Fetch gallery images |
| `/instagram` | `fetchInstagramFeed()` | Fetch latest Instagram posts |
| `/contact` | `submitContactForm()` | Submit enquiry form |
| `/testimonials` | `fetchTestimonials()` | Fetch couple testimonials |
| `/availability` | `checkAvailability()` | Check booking availability by date |

**To enable API:** Set `API_BASE_URL` in `api/api.js` to your backend URL.

---

## 🖼️ Adding Images

1. Place all your images in the `images/` folder
2. Name them as listed in the folder structure above
3. Or update the `src` / `background-image` references in the HTML files

---

## 🚀 How to Run

Simply open `index.html` in your browser — **no build tools required!**

For live development server:
```bash
# Using VS Code Live Server extension
# OR
npx serve .
```

---

## 🎨 Design System

| Variable | Value | Usage |
|---|---|---|
| `--gold` | `#c9a96e` | Primary accent, buttons, icons |
| `--dark` | `#0a0a0a` | Primary background |
| `--light` | `#f8f5f0` | Light section backgrounds |
| `--font-display` | Playfair Display | Headings & titles |
| `--font-serif` | Cormorant Garamond | Sub-headings & elegant text |
| `--font-sans` | Montserrat | Body text & UI elements |

---

## 📞 Customization

Update the following placeholder content with real client data:
- Studio name: **Lumière Studio** → Client's actual name
- Phone: **+91 99999 99999** → Real phone number
- Email: **hello@lumierestudio.in** → Real email
- Address: Update in all footer sections
- Instagram handle: **@lumiere.studio** → Real handle
- Prices in `services.html` → Real pricing

---

*Built with ❤️ — Premium Wedding Photography & Videography Website*
