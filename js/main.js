/* ============================================================
   YASH RAJ MOTION PICTURE — Main JavaScript
   Static data, no API calls. All content is hard-coded.
   ============================================================ */

// ---- LOADER ----
const loader = document.getElementById('loader');
const hideLoader = () => {
  if (loader) loader.classList.add('hidden');
};

const initLoader = () => {
  const cinematicVideo = document.getElementById('cinematicVideo');
  if (cinematicVideo && cinematicVideo.readyState < 3) {
    // Wait for video to be ready enough to play
    cinematicVideo.addEventListener('canplay', hideLoader, { once: true });
    // Fallback if video takes too long
    setTimeout(hideLoader, 1500);
  } else {
    // Small delay for a smooth fadeout transition
    setTimeout(hideLoader, 400);
  }
};

// Use DOMContentLoaded to prevent waiting for heavy images and videos to load
document.addEventListener('DOMContentLoaded', initLoader);

document.addEventListener('DOMContentLoaded', () => {

  // ---- CUSTOM CURSOR (desktop only - dynamically created and throttled to prevent TBT/INP) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorDot = document.createElement('div');
    cursorDot.id = 'cursorDot';
    cursorDot.className = 'cursor-dot';
    const cursorCircle = document.createElement('div');
    cursorCircle.id = 'cursorCircle';
    cursorCircle.className = 'cursor-circle';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorCircle);

    let cx = 0, cy = 0;
    let mouseX = 0, mouseY = 0;
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(() => {
          cursorDot.style.left = mouseX + 'px';
          cursorDot.style.top = mouseY + 'px';
          cx += (mouseX - cx) * 0.12;
          cy += (mouseY - cy) * 0.12;
          cursorCircle.style.left = cx + 'px';
          cursorCircle.style.top = cy + 'px';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    document.querySelectorAll('a, button, .portfolio-item, .service-card, .gallery-item, .masonry-item, .package-card, .pkg-tab').forEach(el => {
      el.addEventListener('mouseenter', () => cursorCircle.classList.add('hovered'), { passive: true });
      el.addEventListener('mouseleave', () => cursorCircle.classList.remove('hovered'), { passive: true });
    });
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

    navOverlay.addEventListener('click', closeMenu);

    const dropdownTriggers = navLinks.querySelectorAll('.nav-has-dropdown > a');
    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 1024px)').matches) {
          const isArrowClick = e.target.classList.contains('nav-arrow') || e.target.closest('.nav-arrow');
          if (isArrowClick) {
            e.preventDefault();
            e.stopPropagation();
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
        }
      });
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 1024px)').matches && link.parentElement.classList.contains('nav-has-dropdown')) {
          return;
        }
        closeMenu();
      });
    });
  }

  // ---- LAZY INITIALIZATION FOR SECONDARY FEATURES (Runs inside requestIdleCallback) ----
  const initSecondary = () => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    // A. HERO SLIDER (Desktop Only, Delayed Init)
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function goToSlide(index) {
      if (slides.length === 0) return;
      slides[currentSlide] && slides[currentSlide].classList.remove('active');
      dots[currentSlide] && dots[currentSlide].classList.remove('active');
      currentSlide = ((index % slides.length) + slides.length) % slides.length;
      slides[currentSlide] && slides[currentSlide].classList.add('active');
      dots[currentSlide] && dots[currentSlide].classList.add('active');
    }
    window.goToSlide = goToSlide;

    const loadLazySlides = () => {
      document.querySelectorAll('.hero-slide img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      document.querySelectorAll('.hero-slide source[data-srcset]').forEach(source => {
        source.srcset = source.dataset.srcset;
        source.removeAttribute('data-srcset');
      });
    };

    if (!isTouch && slides.length > 0) {
      // Load slide assets after idle
      loadLazySlides();
      setInterval(() => goToSlide(currentSlide + 1), 6000);

      // Event listener load backup
      const events = ['touchstart', 'mouseover', 'scroll'];
      const triggerLoad = () => {
        loadLazySlides();
        events.forEach(e => window.removeEventListener(e, triggerLoad));
      };
      events.forEach(e => window.addEventListener(e, triggerLoad, { passive: true }));
    }

    // B. HERO REVEALS
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('visible'));
    }, 100);

    // C. STATS COUNTER
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length > 0 && 'IntersectionObserver' in window) {
      statNums.forEach(el => { el.textContent = '0'; });
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      statNums.forEach(el => statsObserver.observe(el));
    }

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
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

    // D. PORTFOLIO FILTER
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
    const masonryContainer = document.querySelector('.portfolio-masonry');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        if (masonryContainer) {
          masonryContainer.setAttribute('data-active-filter', filter);
        }
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

    // E. FAQ ACCORDION
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    // F. PACKAGES TABS
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

    // G. PACKAGES CARD HOVER (Desktop Only)
    if (!isTouch) {
      document.querySelectorAll('#packagesMain .package-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
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
    }

    // H. WHATSAPP BUTTON TRACKING
    document.querySelectorAll('.whatsapp-float, .wa-cta-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('[YRMP] WhatsApp CTA clicked');
      }, { passive: true });
    });

    // I. MARQUEE HOVER EFFECTS
    const marqueeContainer = document.querySelector('.logo-marquee-container');
    if (marqueeContainer) {
      const track = marqueeContainer.querySelector('.logo-marquee-track');
      marqueeContainer.addEventListener('mouseover', () => {
        marqueeContainer.style.opacity = '1';
        if (track) track.style.animationPlayState = 'paused';
      }, { passive: true });
      marqueeContainer.addEventListener('mouseout', () => {
        marqueeContainer.style.opacity = '0.6';
        if (track) track.style.animationPlayState = 'running';
      }, { passive: true });
    }

    // J. CINEMATIC LIGHT PARTICLES (Desktop Only)
    const heroSection = document.querySelector('.hero');
    if (!isTouch && heroSection) {
      const particleCount = 12; // Lowered count to minimize DOM nodes and layouts
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cinematic-particle';
        const size = Math.random() * 3 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        heroSection.appendChild(particle);
      }
    }

    // K. SCROLL PARALLAX EFFECT (Desktop Only)
    const parallaxImages = document.querySelectorAll('.intro-img-main img, .intro-img-side img');
    if (!isTouch && parallaxImages.length > 0) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        parallaxImages.forEach((img, index) => {
          const speed = index === 0 ? 0.05 : -0.03;
          const yPos = -(scrolled * speed);
          img.style.transform = `translateY(${yPos}px) scale(1.08)`;
        });
      }, { passive: true });
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => initSecondary());
  } else {
    setTimeout(initSecondary, 1200);
  }

  // ---- LAZY INITIALIZED LIGHTBOX ----
  const openLightbox = (src, type, title, desc) => {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      document.body.appendChild(lightbox);
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

      // Bind close events once
      const closeBtn = document.getElementById('lightboxClose');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
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
    }

    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    // Reset inputs
    if (lightboxImg) {
      lightboxImg.style.display = 'none';
      lightboxImg.src = '';
    }
    if (lightboxVideo) {
      lightboxVideo.style.display = 'none';
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }

    if (type === 'video' && lightboxVideo) {
      lightboxVideo.src = src;
      lightboxVideo.style.display = 'block';
      lightboxVideo.play().catch(e => console.log('Video autoplay blocked or failed', e));
    } else if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.style.display = 'block';
    }

    if ((title || desc) && lightboxCaption) {
      if (lightboxTitle) lightboxTitle.textContent = title || '';
      if (lightboxDesc) lightboxDesc.textContent = desc || '';
      lightboxCaption.style.display = 'block';
    } else if (lightboxCaption) {
      lightboxCaption.style.display = 'none';
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
    if (lightboxImg) {
      lightboxImg.src = '';
    }
  };

  // Bind clicks dynamically
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
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

  document.querySelectorAll('.masonry-item, .gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
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
        message: 'Please enter a valid date.'
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

      if (contactForm.getAttribute('action')) {
        return;
      }

      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
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
      { value: 'silver', text: 'Silver' },
      { value: 'gold', text: 'Gold' },
      { value: 'platinum', text: 'Platinum' }
    ],
    'pre-wedding': [
      { value: 'basic', text: 'Basic' },
      { value: 'signature', text: 'Signature' },
      { value: 'destination', text: 'Destination' }
    ],
    'corporate': [
      { value: 'starter', text: 'Starter' },
      { value: 'business', text: 'Business' },
      { value: 'enterprise', text: 'Enterprise' }
    ],
    'events': [
      { value: 'half-day', text: 'Half Day' },
      { value: 'full-event', text: 'Full Event' },
      { value: 'grand-event', text: 'Grand Event' }
    ],
    'product': [
      { value: 'starter', text: 'Starter' },
      { value: 'catalogue', text: 'Catalogue' },
      { value: 'brand-story', text: 'Brand Story' }
    ]
  };
  const updatePackageOptions = () => {
    if (!categorySelect || !packageSelect || !packageWrapper) return;
    const cat = categorySelect.value;
    if (cat && packagesByCategory[cat]) {
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
  updatePackageOptions();

  // ---- SERVICE WORKER REGISTRATION ----
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const pathDepth = window.location.pathname.split('/').filter(p => p.length > 0 && !p.endsWith('.html')).length;
      const swPath = pathDepth > 0 ? '../sw.js' : 'sw.js';
      navigator.serviceWorker.register(swPath)
        .then((reg) => console.log('[SW] Service Worker registered successfully:', reg.scope))
        .catch((err) => console.error('[SW] Service Worker registration failed:', err));
    });
  }

});
