/* ========================================
   PORTFOLIO SCRIPT
   ======================================== */

// ========================================
// PAGE LOADER
// ========================================

window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 350);
  }
  document.body.classList.add('loaded');
});

// ========================================
// UTILITIES
// ========================================

function debounce(fn, delay = 100) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ========================================
// SCROLL REVEAL ANIMATIONS (sections)
// ========================================

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================================
// STAGGERED REVEAL FOR CARD GROUPS
// ========================================
// Any element with .reveal-group containing .reveal-child items
// will have its children fade/scale in one-by-one as the group
// enters the viewport.

document.querySelectorAll('.reveal-group').forEach(group => {
  const children = group.querySelectorAll('.reveal-child');
  children.forEach((child, i) => {
    child.style.setProperty('--i', i);
  });
});

const groupObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.reveal-child').forEach(child => {
        child.classList.add('visible');
      });
      groupObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-group').forEach(group => groupObserver.observe(group));

// ========================================
// ACADEMIC PROGRESS BARS — FILL ON REVEAL
// ========================================

const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.getAttribute('data-width') || 0;
      bar.style.width = width + '%';
      progressObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.progress-bar').forEach(bar => progressObserver.observe(bar));

// ========================================
// AMBIENT CURSOR GLOW
// ========================================

(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let rafId = null;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let curX = targetX;
  let curY = targetY;

  function animate() {
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.classList.add('active');
  }, { passive: true });

  window.addEventListener('mouseleave', () => glow.classList.remove('active'));

  rafId = requestAnimationFrame(animate);
})();

// ========================================
// ACTIVE NAV LINK DETECTION
// ========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const updateActiveLink = debounce(() => {
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, 50);

window.addEventListener('scroll', updateActiveLink);

// ========================================
// HAMBURGER MENU
// ========================================

const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar')) {
    navLinksContainer.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
  }
});

// ========================================
// SMOOTH SCROLL BEHAVIOR
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 64,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// NAVBAR BACKGROUND ON SCROLL
// ========================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 10) {
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
  } else {
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    navbar.style.background = 'rgba(255, 255, 255, 0.96)';
  }
}, false);

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function createScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(button);

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 300);
  });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

createScrollToTopButton();

// ========================================
// MAGNETIC TILT ON CARDS
// ========================================

function initTiltCards() {
  const cards = document.querySelectorAll('.stat-card, .skill-card, .project-card, .contact-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = (e.clientY - rect.top  - rect.height / 2) / 16;
      const rotateY = (e.clientX - rect.left - rect.width  / 2) / 16;
      card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', initTiltCards);

// ========================================
// COUNTER ANIMATION (CGPA stat)
// ========================================

function animateCounter(element, target, duration = 1400) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = (target * eased).toFixed(2);
    element.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
    else element.textContent = target;
  }

  requestAnimationFrame(tick);
}

let statsAnimated = false;
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-value').forEach(stat => {
        const value = stat.textContent.trim();
        if (!isNaN(value) && value.includes('.')) {
          animateCounter(stat, parseFloat(value));
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) statsObserver.observe(statsSection);

// ========================================
// COPY TO CLIPBOARD
// ========================================

function setupClipboard() {
  document.querySelectorAll('.contact-card-val').forEach(element => {
    if (element.textContent.includes('@') || element.textContent.includes('+91')) {
      element.style.cursor = 'pointer';
      element.addEventListener('click', function(e) {
        e.preventDefault();
        const text = this.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          const originalText = this.textContent;
          this.textContent = '✓ Copied!';
          this.style.color = '#22c55e';
          setTimeout(() => {
            this.textContent = originalText;
            this.style.color = '';
          }, 2000);
        }).catch(() => console.log('Copy failed'));
      });
    }
  });
}

setupClipboard();

// ========================================
// MOBILE RESPONSIVE HANDLING
// ========================================

function handleResponsive() {
  document.body.style.fontSize = window.innerWidth < 768 ? '14px' : '16px';
}

window.addEventListener('resize', debounce(handleResponsive, 250));
handleResponsive();

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (navLinksContainer && navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      if (hamburger) hamburger.classList.remove('active');
    }
  }
});

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
  '%c✨ Welcome to Aashish Kumar\'s Portfolio ✨',
  'color: #2563eb; font-size: 16px; font-weight: bold;'
);
console.log(
  '%cBuilt with React, Django, and ❤️',
  'color: #8b5cf6; font-size: 12px;'
);