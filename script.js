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

// Mobile hamburger menu toggle with scroll locking
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
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
  '.category-card, .step, .testimonial, .section-header'
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

// Products Data Array (19 Local Hand-crafted Artworks matching the pictures folder exactly)
const products = [
  { id: 1, title: "Carved Wooden Mandala (Diamond)", category: "wood-carvings", price: 3500, badge: "Bestseller", image: "pictures/1.jpeg" },
  { id: 2, title: "Mustard & Black Swirl Ink Art", category: "paintings-drawings", price: 2000, badge: null, image: "pictures/3.jpeg" },
  { id: 3, title: "Woven Bamboo Floral Vase", category: "wood-carvings", price: 3200, badge: null, image: "pictures/5.jpeg" },
  { id: 4, title: "Twig & Sun Mixed-Media Landscape", category: "mixed-media", price: 2500, badge: "New", image: "pictures/7.jpeg" },
  { id: 5, title: "Ochre Doodle Collage Drawing", category: "paintings-drawings", price: 2200, badge: null, image: "pictures/8.jpeg" },
  { id: 6, title: "Vivid Yellow & Blue Abstract", category: "paintings-drawings", price: 2000, badge: null, image: "pictures/9.jpeg" },
  { id: 7, title: "Fine Line Mesh Cell Drawing", category: "paintings-drawings", price: 2200, badge: null, image: "pictures/10.jpeg" },
  { id: 8, title: "Woodcut Faucet Print", category: "paintings-drawings", price: 1800, badge: null, image: "pictures/11.jpeg" },
  { id: 9, title: "Glazed Relief Ceramic Tiles", category: "mixed-media", price: 4000, badge: null, image: "pictures/12.jpeg" },
  { id: 10, title: "Textured Golden Canvas Abstract", category: "paintings-drawings", price: 4500, badge: null, image: "pictures/13.jpeg" },
  { id: 11, title: "Watercolor Sailboat Sunrise", category: "paintings-drawings", price: 2500, badge: null, image: "pictures/14.jpeg" },
  { id: 12, title: "Carved Wooden Mandala Triptych", category: "wood-carvings", price: 6500, badge: "Popular", image: "pictures/15.jpeg" },
  { id: 13, title: "Textured Red & Green Acrylic", category: "paintings-drawings", price: 2400, badge: "Popular", image: "pictures/16.jpeg" },
  { id: 14, title: "Embroidered Patchwork Tapestry", category: "mixed-media", price: 3800, badge: null, image: "pictures/17.jpeg" },
  { id: 15, title: "Crosshatched Abstract Canvas", category: "paintings-drawings", price: 2200, badge: null, image: "pictures/18.jpeg" },
  { id: 16, title: "Minimalist Gold Leaf Diptych", category: "paintings-drawings", price: 5000, badge: "New", image: "pictures/19.jpeg" },
  { id: 17, title: "Gallery Showroom Showcase", category: "mixed-media", price: 9500, badge: "New", image: "pictures/20.jpeg" },
  { id: 18, title: "Woven Bamboo Plant Vase I", category: "wood-carvings", price: 2800, badge: null, image: "pictures/2.jpeg" },
  { id: 19, title: "Woven Bamboo Plant Vase II", category: "wood-carvings", price: 2800, badge: "New", image: "pictures/4.jpeg" }
];

const galleryGrid = document.getElementById('gallery-grid');
const showMoreBtn = document.getElementById('show-more-btn');
const showMoreWrap = document.querySelector('.show-more-wrap');

let currentLimit = 8;
let currentFilter = 'all';

// Dynamic Rendering Engine
const renderProducts = () => {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';
  
  let renderedCount = 0;
  let totalMatchCount = 0;

  products.forEach(product => {
    const isMatch = currentFilter === 'all' || product.category === currentFilter;
    if (isMatch) {
      totalMatchCount++;
      if (renderedCount < currentLimit) {
        renderedCount++;
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-id', product.id);

        const badgeHTML = product.badge ? `<div class="product-badge ${product.badge.toLowerCase() === 'new' ? 'new' : ''}">${product.badge}</div>` : '';
        
        card.innerHTML = `
          <div class="product-img-wrap">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            ${badgeHTML}
          </div>
          <div class="product-info">
            <h4>${product.title}</h4>
            <p class="product-size">A3 / A2 / A1 Available</p>
            <div class="product-footer">
              <span class="price">Starting from ${product.price} BDT</span>
              <a href="https://www.facebook.com/WariasArtGallery" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Order via Facebook</a>
            </div>
          </div>
        `;
        
        galleryGrid.appendChild(card);
        
        // Dynamic scroll fade-in for generated items
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.25s ease';
        observer.observe(card);
      }
    }
  });

  // Toggle Show More button wrapper based on product limits
  if (showMoreWrap) {
    if (totalMatchCount > currentLimit) {
      showMoreWrap.classList.remove('hidden');
    } else {
      showMoreWrap.classList.add('hidden');
    }
  }
};

// Initial run
renderProducts();

// Dynamic Gallery Filtering Click Logic
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.getAttribute('data-filter');
    
    // Automatically reveal all matching items on filter change
    if (currentFilter !== 'all') {
      currentLimit = products.length;
    } else {
      currentLimit = 8; // Reset back to default 8
    }

    renderProducts();
  });
});

// Show More button click logic
if (showMoreBtn) {
  showMoreBtn.addEventListener('click', () => {
    currentLimit = products.length; // expand limit to show all
    renderProducts();
  });
}

// Category Cards Interactivity (Clicking a card scrolls & filters the gallery)
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const category = card.getAttribute('data-category');
    
    // Avoid double trigger if they click the overlay button inside
    if (e.target.closest('.btn')) {
      e.preventDefault();
    }

    // Abstract or Nature or Wood Carvings or Mixed Media, scroll to gallery and filter
    const gallerySection = document.getElementById('gallery');
    const targetFilterBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
    
    if (targetFilterBtn) {
      targetFilterBtn.click(); // Trigger active filter and expand
    }

    if (gallerySection) {
      const offset = 80;
      const top = gallerySection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
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

let currentBasePrice = 2000;

// Bind delegated click events on dynamic gallery grid
if (galleryGrid) {
  galleryGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    // Ignore lightbox popup if they click order CTA directly
    if (e.target.closest('.product-footer a')) {
      return;
    }
    
    e.preventDefault();
    
    // Load dynamic data from script object instead of DOM strings
    const productId = parseInt(card.getAttribute('data-id'), 10);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentBasePrice = product.price;

    // Reset size active selection back to A3 on open
    const sizeTags = document.querySelectorAll('.size-tag');
    sizeTags.forEach(t => t.classList.remove('active'));
    const defaultSizeTag = document.querySelector('.size-tag[data-size="A3"]');
    if (defaultSizeTag) {
      defaultSizeTag.classList.add('active');
    }

    // Populate lightbox contents
    lightboxImg.src = product.image;
    lightboxImg.alt = product.title;
    lightboxTitle.textContent = product.title;
    lightboxPrice.textContent = `Starting from ${currentBasePrice} BDT`;
    
    // Create pre-filled Messenger URL payload
    const msgTemplate = encodeURIComponent(`Hi! I would like to order the hand-crafted painting: "${product.title}"`);
    lightboxOrderBtn.href = `https://www.facebook.com/messages/t/WariasArtGallery?text=${msgTemplate}`;

    if (product.badge) {
      lightboxBadge.textContent = product.badge;
      lightboxBadge.style.display = 'inline-block';
      if (product.badge === 'New') {
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
}

// Size selection logic in Lightbox modal
const lightboxSizes = document.getElementById('lightbox-sizes');
if (lightboxSizes) {
  lightboxSizes.addEventListener('click', (e) => {
    const tag = e.target.closest('.size-tag');
    if (!tag) return;

    lightboxSizes.querySelectorAll('.size-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    const selectedSize = tag.getAttribute('data-size');
    let finalPrice = currentBasePrice;

    if (selectedSize === 'A2') {
      finalPrice = currentBasePrice + 500;
    } else if (selectedSize === 'A1') {
      finalPrice = currentBasePrice + 1000;
    }

    // Update price representation: size A3 keeps "Starting from", others show fixed price
    if (selectedSize === 'A3') {
      lightboxPrice.textContent = `Starting from ${finalPrice} BDT`;
    } else {
      lightboxPrice.textContent = `${finalPrice} BDT`;
    }
  });
}

// Close Lightbox functions
const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

// Close on clicking overlay outside the content
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Close on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

// Hero Image Slideshow (randomly switch every 3 seconds with a professional cross-dissolve)
const heroImg = document.getElementById('hero-slideshow-img');
if (heroImg && products && products.length > 0) {
  const heroImages = products.map(p => p.image);
  const heroTitles = products.map(p => p.title);
  
  // Pick a random starting image index on page load
  let currentHeroIndex = Math.floor(Math.random() * heroImages.length);
  const startImage = heroImages[currentHeroIndex];

  // Set the starting image and alt immediately
  heroImg.src = startImage;
  heroImg.alt = heroTitles[currentHeroIndex];

  const parentFrame = heroImg.parentElement;
  if (parentFrame) {
    parentFrame.style.backgroundImage = `url(${startImage})`;
  }

  const switchHeroImage = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * heroImages.length);
    } while (randomIndex === currentHeroIndex && heroImages.length > 1);

    currentHeroIndex = randomIndex;
    const nextImage = heroImages[currentHeroIndex];

    // Set background of the frame to the incoming image
    if (parentFrame) {
      parentFrame.style.backgroundImage = `url(${nextImage})`;
    }

    // Fade out the top image (takes 1.2s via transition)
    heroImg.style.opacity = '0';

    // Swap src + alt, then restore opacity once fade out finishes
    setTimeout(() => {
      heroImg.src = nextImage;
      heroImg.alt = heroTitles[currentHeroIndex];
      heroImg.style.opacity = '1';
    }, 1200); // matching CSS opacity transition time
  };

  setInterval(switchHeroImage, 3000);
}

