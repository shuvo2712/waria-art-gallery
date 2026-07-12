// Dynamic copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
});

// Close mobile nav when a link is clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// Smooth scroll for anchor links (with fix for '#' empty href selector issue)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Subtle fade-in on scroll using IntersectionObserver (with hover state transform overrides fixed)
const fadeEls = document.querySelectorAll(
  '.category-card, .product-card, .step, .testimonial, .section-header'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.style.transform.replace('translateY(24px)', 'translateY(0)');
      
      // Remove inline styles after transition to restore CSS hover animations
      entry.target.addEventListener('transitionend', function handler() {
        entry.target.style.opacity = '';
        entry.target.style.transform = '';
        entry.target.style.transition = '';
        entry.target.removeEventListener('transitionend', handler);
      });
      
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = (el.style.transform || '') + ' translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.25s ease';
  observer.observe(el);
});

// Dynamic Gallery Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Set active button state
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterValue = btn.getAttribute('data-filter');

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      if (filterValue === 'all' || cardCategory === filterValue) {
        card.classList.remove('hidden-filter');
        // Let it display first, then trigger opacity transition next frame
        setTimeout(() => {
          card.classList.remove('fade-out');
        }, 10);
      } else {
        card.classList.add('fade-out');
        // Wait for fade-out transition before adding display: none
        card.addEventListener('transitionend', function handler(e) {
          if (e.propertyName === 'opacity' && card.classList.contains('fade-out')) {
            card.classList.add('hidden-filter');
            card.removeEventListener('transitionend', handler);
          }
        });
      }
    });
  });
});

// Category Cards Interactivity (Clicking a card scrolls & filters the gallery)
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const category = card.getAttribute('data-category');
    
    // Avoid double trigger if they click the overlay button inside
    if (e.target.classList.contains('btn')) {
      e.preventDefault(); // Intercept collection button default smooth scroll
    }

    if (category === 'anime') {
      // Anime is custom only, scroll to the CTA section
      const target = document.getElementById('gallery-cta');
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      // Abstract or Nature, scroll to gallery and filter
      const gallerySection = document.getElementById('gallery');
      const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
      
      if (targetFilterBtn) {
        targetFilterBtn.click(); // Trigger the active filter
      }

      if (gallerySection) {
        const offset = 80;
        const top = gallerySection.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// Lightbox Modal Interactivity
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxPrice = document.getElementById('lightbox-price');
const lightboxBadge = document.getElementById('lightbox-badge');
const lightboxOrderBtn = document.getElementById('lightbox-order-btn');
const lightboxClose = document.getElementById('lightbox-close');

productCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // If the click is on the order link inside the card footer, bypass lightbox modal opening
    if (e.target.closest('.product-footer a')) {
      return;
    }
    
    e.preventDefault();
    
    // Extract info from product card
    const imgUrl = card.querySelector('.product-img-wrap img').src;
    const titleText = card.querySelector('.product-info h4').textContent;
    const priceText = card.querySelector('.price').textContent;
    const badgeEl = card.querySelector('.product-badge');
    const orderUrl = card.querySelector('.product-footer a').href;

    // Populate lightbox
    lightboxImg.src = imgUrl;
    lightboxImg.alt = titleText;
    lightboxTitle.textContent = titleText;
    lightboxPrice.textContent = priceText;
    lightboxOrderBtn.href = orderUrl;

    if (badgeEl) {
      lightboxBadge.textContent = badgeEl.textContent;
      lightboxBadge.style.display = 'inline-block';
      if (badgeEl.classList.contains('new')) {
        lightboxBadge.style.background = '#2563eb';
        lightboxBadge.style.color = '#ffffff';
      } else {
        lightboxBadge.style.background = '#f3f4f6';
        lightboxBadge.style.color = 'var(--fg)';
      }
    } else {
      lightboxBadge.style.display = 'none';
    }

    // Open lightbox
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

// Close Lightbox functions
const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

lightboxClose.addEventListener('click', closeLightbox);

// Close on clicking overlay outside the content
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});
