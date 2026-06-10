/* ============================================================
   YASH RAJ MOTION PICTURE — Main JavaScript
   Static data, no API calls. All content is hard-coded.
   ============================================================ */

// ---- LOADER ----
const loader = document.getElementById('loader');
const hideLoader = () => {
  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
  }, 600);
};

if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader);
}
// Fallback in case load event gets missed
setTimeout(hideLoader, 2000);

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR (desktop only) ----
  const cursorDot = document.getElementById('cursorDot');
  const cursorCircle = document.getElementById('cursorCircle');
  if (cursorDot && cursorCircle && window.matchMedia('(pointer: fine)').matches) {
    let cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cx += (e.clientX - cx) * 0.12;
      cy += (e.clientY - cy) * 0.12;
      cursorCircle.style.left = cx + 'px';
      cursorCircle.style.top = cy + 'px';
    });
    // Smoothly animate cursor circle
    (function animateCursor() {
      requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, .portfolio-item, .service-card, .gallery-item, .masonry-item, .package-card, .pkg-tab').forEach(el => {
      el.addEventListener('mouseenter', () => cursorCircle.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorCircle.classList.remove('hovered'));
    });
  } else {
    // Hide cursor elements on touch devices
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorCircle) cursorCircle.style.display = 'none';
  }

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- MOBILE NAV TOGGLE (Left Sliding Panel & Sub-menus) ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    // Dynamically create navOverlay backdrop if it doesn't exist
    let navOverlay = document.getElementById('navOverlay');
    if (!navOverlay) {
      navOverlay = document.createElement('div');
      navOverlay.id = 'navOverlay';
      navOverlay.className = 'nav-overlay';
      document.body.appendChild(navOverlay);
    }

    const closeMenu = () => {
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('active');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
        document.body.style.overflow = 'hidden';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.body.style.overflow = '';
      }
    });

    // Close when clicking the overlay backdrop
    navOverlay.addEventListener('click', closeMenu);

    // Dropdown toggle on mobile
    const dropdownTriggers = navLinks.querySelectorAll('.nav-has-dropdown > a');
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 1024px)').matches) {
          e.preventDefault(); // Stop navigating to services index
          const parent = trigger.parentElement;
          const dropdown = parent.querySelector('.nav-dropdown');
          const arrow = parent.querySelector('.nav-arrow');
          if (dropdown) {
            dropdown.classList.toggle('active');
            if (dropdown.classList.contains('active')) {
              if (arrow) arrow.textContent = '▴';
            } else {
              if (arrow) arrow.textContent = '▾';
            }
          }
        }
      });
    });

    // Auto close sidebar when clicking menu links (excluding dropdown toggle triggers)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // If it's a dropdown toggle trigger on mobile/tablet, do not close the menu
        if (window.matchMedia('(max-width: 1024px)').matches && link.parentElement.classList.contains('nav-has-dropdown')) {
          return;
        }
        closeMenu();
      });
    });
  }

  // ---- HERO SLIDER (Ken Burns Fade) ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');
  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide] && slides[currentSlide].classList.remove('active');
    dots[currentSlide]   && dots[currentSlide].classList.remove('active');
    
    currentSlide = ((index % slides.length) + slides.length) % slides.length;
    
    if (slides[currentSlide]) {
      slides[currentSlide].classList.add('active');
    }
    dots[currentSlide] && dots[currentSlide].classList.add('active');
  }
  window.goToSlide = goToSlide;

  if (slides.length > 0) {
    setInterval(() => goToSlide(currentSlide + 1), 6000); // 6 seconds for majestic effect
  }

  // ---- SCROLL REVEAL ----
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach(el => revealOnScroll.observe(el));

  // ---- SERVICES 3D TILT & SPOTLIGHT EFFECT ----
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Spotlight glow
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // 3D Tilt calculation (max 10 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -10;
      const tiltY = ((x - centerX) / centerX) * 10;
      
      // We keep the transition to 0s during movement so it tracks instantly,
      // but smooth out the entry/exit using a small transition in CSS or via class
      card.style.transition = 'transform 0.1s ease';
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });

  // Hero reveal after loader
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
  }, 950);

  // ---- STATS COUNTER ----
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ---- TESTIMONIALS GRID ----
  const testimonials = document.querySelectorAll('.testimonial-item');
  testimonials.forEach(testimonial => testimonial.classList.add('active'));
  window.changeTestimonial = function () { };

  // ---- PORTFOLIO FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      masonryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? 'block' : 'none';
        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        }
      });
    });
  });

  // ---- LIGHTBOX ----
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);
  }
  
  // Re-build inner HTML of lightbox to ensure all elements exist on all pages
  lightbox.innerHTML = `
    <button class="lightbox-close" id="lightboxClose" aria-label="Close">&times;</button>
    <div class="lightbox-content">
      <img src="" alt="Fullscreen View" class="lightbox-img" id="lightboxImg" style="display: none;" />
      <video src="" controls class="lightbox-video" id="lightboxVideo" style="display: none;"></video>
      <div class="lightbox-caption" id="lightboxCaption" style="display: none;">
        <h4 id="lightboxTitle"></h4>
        <p id="lightboxDesc"></p>
      </div>
    </div>
  `;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = (src, type, title, desc) => {
    // Reset inputs
    lightboxImg.style.display = 'none';
    lightboxImg.src = '';
    lightboxVideo.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.src = '';
    
    if (type === 'video') {
      lightboxVideo.src = src;
      lightboxVideo.style.display = 'block';
      lightboxVideo.play().catch(e => console.log('Video autoplay blocked or failed', e));
    } else {
      lightboxImg.src = src;
      lightboxImg.style.display = 'block';
    }

    if (title || desc) {
      lightboxTitle.textContent = title || '';
      lightboxDesc.textContent = desc || '';
      lightboxCaption.style.display = 'block';
    } else {
      lightboxCaption.style.display = 'none';
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxImg.src = '';
  };

  // Bind click event to elements that have data-lightbox
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Prevent default click (e.g. if it's an anchor tag)
      e.preventDefault();
      e.stopPropagation();
      const src = el.dataset.lightbox || el.getAttribute('href');
      const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg'));
      
      let title = '';
      let desc = '';
      const info = el.querySelector('.masonry-info') || el.closest('.masonry-item')?.querySelector('.masonry-info') || el.querySelector('.gallery-overlay') || el.closest('.gallery-item')?.querySelector('.gallery-overlay');
      if (info) {
        title = info.querySelector('h4')?.textContent || '';
        desc = info.querySelector('p')?.textContent || '';
      } else {
        title = el.querySelector('img')?.getAttribute('alt') || el.getAttribute('title') || '';
      }

      openLightbox(src, isVideo ? 'video' : 'image', title, desc);
    });
  });

  // Bind click events on portfolio masonry items and gallery items
  document.querySelectorAll('.masonry-item, .gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // If they clicked controls on a video, let them interact with video controls
      if (e.target.tagName === 'VIDEO' && e.target.hasAttribute('controls')) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      const img = item.querySelector('img');
      const video = item.querySelector('video');
      const source = video ? video.querySelector('source') : null;
      
      let src = '';
      let type = 'image';
      
      if (video && source) {
        src = source.src;
        type = 'video';
      } else if (img) {
        src = item.dataset.lightbox || img.src;
        type = 'image';
      }
      
      if (!src) return;
      
      const info = item.querySelector('.masonry-info') || item.querySelector('.gallery-overlay');
      let title = '';
      let desc = '';
      
      if (info) {
        title = info.querySelector('h4')?.textContent || '';
        desc = info.querySelector('p')?.textContent || '';
      }
      if (!title && img) {
        title = img.getAttribute('alt') || '';
      }
      
      openLightbox(src, type, title, desc);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  lightbox.addEventListener('click', e => { 
    if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.id === 'lightbox') {
      closeLightbox(); 
    } 
  });
  document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') closeLightbox(); 
  });

  // ---- CONTACT FORM (static simulation) ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formMessage = document.getElementById('formMessage');
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const requiredFields = [
      {
        input: document.getElementById('yourName'),
        error: document.getElementById('yourNameError'),
        message: 'Please enter your name.'
      },
      {
        input: document.getElementById('email'),
        error: document.getElementById('emailError'),
        message: 'Please enter a valid email address.'
      },
      {
        input: document.getElementById('categorySelect'),
        error: document.getElementById('categoryError'),
        message: 'Please select a category.'
      },
      {
        input: document.getElementById('eventDate'),
        error: document.getElementById('eventDateError'),
        message: 'This date is fully booked (max 2 bookings per day). Please choose another date.',
        customValidate: (val) => {
          if (!val) return true; // Date is optional on Contact page
          const fullyBookedDates = ['2026-06-15', '2026-07-01', '2026-12-25'];
          return !fullyBookedDates.includes(val);
        }
      }
    ];

    const clearValidation = () => {
      requiredFields.forEach(({ input, error }) => {
        if (input) input.classList.remove('error');
        if (input) input.setAttribute('aria-invalid', 'false');
        if (error) error.textContent = '';
      });
      if (formMessage) formMessage.className = 'form-message';
      if (formMessage) formMessage.textContent = '';
    };

    const validateField = (field) => {
      const { input, error, message, customValidate } = field;
      if (!input) return true;
      const value = input.value.trim();
      let isValid = Boolean(value);

      if (input.type === 'email' && value) {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (customValidate) {
        isValid = customValidate(value);
      }

      if (!isValid) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = message;
        return false;
      }

      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
      if (error) error.textContent = '';
      return true;
    };

    requiredFields.forEach((field) => {
      const { input, error } = field;
      if (!input) return;
      input.addEventListener('input', () => {
        if (error && error.textContent) {
          validateField(field);
        }
        if (formMessage && formMessage.classList.contains('error')) {
          formMessage.className = 'form-message';
          formMessage.textContent = '';
        }
      });
      input.addEventListener('blur', () => validateField(field));
      if (input.tagName === 'SELECT' || input.type === 'date') {
        input.addEventListener('change', () => validateField(field));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      clearValidation();

      const invalidFields = requiredFields.filter(field => !validateField(field));
      if (invalidFields.length > 0) {
        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.textContent = 'Please fill in the required fields before sending your enquiry.';
        }
        invalidFields[0].input?.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      // Simulate a short delay (no real API)
      setTimeout(() => {
        if (formMessage) {
          formMessage.className = 'form-message success';
          formMessage.textContent = '✓ Thank you! We\'ll get back to you within 24 hours. You can also WhatsApp us for a faster response.';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
        contactForm.reset();
        clearValidation();
      }, 1200);
    });
  }

  // ---- DYNAMIC PACKAGE DISPLAY ----
  const packageWrapper = document.getElementById('packageWrapper');
  const packageSelect = document.getElementById('packageSelect');
  const categorySelect = document.getElementById('categorySelect');
  const packagesByCategory = {
    'wedding': [
      {value: 'silver', text: 'Silver'},
      {value: 'gold', text: 'Gold'},
      {value: 'platinum', text: 'Platinum'}
    ],
    'pre-wedding': [
      {value: 'basic', text: 'Basic'},
      {value: 'signature', text: 'Signature'},
      {value: 'destination', text: 'Destination'}
    ],
    'corporate': [
      {value: 'starter', text: 'Starter'},
      {value: 'business', text: 'Business'},
      {value: 'enterprise', text: 'Enterprise'}
    ],
    'events': [
      {value: 'half-day', text: 'Half Day'},
      {value: 'full-event', text: 'Full Event'},
      {value: 'grand-event', text: 'Grand Event'}
    ],
    'product': [
      {value: 'starter', text: 'Starter'},
      {value: 'catalogue', text: 'Catalogue'},
      {value: 'brand-story', text: 'Brand Story'}
    ]
  };
  const updatePackageOptions = () => {
    if (!categorySelect || !packageSelect || !packageWrapper) return;
    const cat = categorySelect.value;
    if (cat && packagesByCategory[cat]) {
      // Clear existing options
      packageSelect.innerHTML = '';
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select a package...';
      packageSelect.appendChild(defaultOption);
      packagesByCategory[cat].forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.value;
        opt.textContent = p.text;
        packageSelect.appendChild(opt);
      });
      packageWrapper.style.display = 'block';
    } else {
      packageWrapper.style.display = 'none';
      packageSelect.innerHTML = '';
    }
  };
  if (categorySelect) {
    categorySelect.addEventListener('change', updatePackageOptions);
  }
  // Initial state
  updatePackageOptions();



  // ---- FAQ ACCORDION ----
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- PACKAGES TABS ----
  const pkgTabs = document.querySelectorAll('.pkg-tab');
  const pkgPanels = document.querySelectorAll('.pkg-panel');
  const animatePackageCards = (panel) => {
    if (!panel) return;
    const cards = panel.querySelectorAll('.package-card');
    cards.forEach((card, index) => {
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = `packageCardEnter 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.08}s both`;
    });
  };
  pkgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pkgTabs.forEach(t => t.classList.remove('active'));
      pkgPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('pkg-' + tab.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        animatePackageCards(panel);
      }
    });
  });

  // ---- PACKAGES CARD HOVER MOTION ----
  document.querySelectorAll('#packagesMain .package-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -8;
      const tiltY = ((x - centerX) / centerX) * 8;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--tilt-x', `${tiltX}deg`);
      card.style.setProperty('--tilt-y', `${tiltY}deg`);
      card.style.setProperty('--lift', '-10px');
      card.style.setProperty('--scale', '1.02');
    });

    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--lift', '-10px');
      card.style.setProperty('--scale', '1.02');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--lift', '0px');
      card.style.setProperty('--scale', '1');
    });
  });

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- WHATSAPP BUTTON CLICK TRACKING ----
  document.querySelectorAll('.whatsapp-float, .wa-cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Optional: fire analytics event here
      console.log('[YRMP] WhatsApp CTA clicked');
    });
  });

});
