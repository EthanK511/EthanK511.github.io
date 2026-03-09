/* ============================================================
   script.js — Portfolio interactions
   ============================================================ */

/* ---------- Typed tagline ---------- */
const phrases = [
  'Building things for the web.',
  'Clean code. Smooth design.',
  'Developer & creator.',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIndex);
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
  }

  let typingDelay = isDeleting ? 45 : 80;

  if (!isDeleting && charIndex === current.length) {
    typingDelay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingDelay = 400;
  }

  setTimeout(type, typingDelay);
}

type();

/* ---------- Nav shadow on scroll ---------- */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---------- Scroll-reveal cards & sections ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const revealDelay = el.dataset.index ? Number(el.dataset.index) * 100 : 0;
        setTimeout(() => el.classList.add('visible'), revealDelay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.card, .fade-up').forEach((el) => {
  revealObserver.observe(el);
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Subtle cursor-follow glow on hero ---------- */
const heroGlow = document.querySelector('.hero-glow');
const hero = document.querySelector('.hero');

if (heroGlow && hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroGlow.style.background = `radial-gradient(
      ellipse at ${x}% ${y}%,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(168, 85, 247, 0.07) 40%,
      transparent 70%
    )`;
  });

  hero.addEventListener('mouseleave', () => {
    heroGlow.style.background = '';
  });
}
