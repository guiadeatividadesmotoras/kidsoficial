const CHECKOUT_URL = '#';

const header = document.querySelector('[data-header]');
const mobileBar = document.querySelector('[data-mobile-bar]');
const checkoutLinks = document.querySelectorAll('[data-checkout-link]');
const modal = document.querySelector('[data-lightbox-modal]');
const modalImage = modal?.querySelector('img');
const closeButton = modal?.querySelector('.lightbox-close');
let lastFocus = null;

checkoutLinks.forEach((link) => {
  link.href = CHECKOUT_URL;
});

const updateScrollState = () => {
  const scrolled = window.scrollY > 18;
  header?.classList.toggle('scrolled', scrolled);
  mobileBar?.classList.toggle('visible', window.scrollY > 600);
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const openLightbox = (src, alt, trigger) => {
  if (!modal || !modalImage) return;
  lastFocus = trigger;
  modalImage.src = src;
  modalImage.alt = alt || 'Prévia ampliada do material';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeButton?.focus();
};

const closeLightbox = () => {
  if (!modal || !modalImage) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalImage.removeAttribute('src');
  document.body.style.overflow = '';
  lastFocus?.focus();
};

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    openLightbox(button.dataset.lightbox, image?.alt, button);
  });
});

closeButton?.addEventListener('click', closeLightbox);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('open')) closeLightbox();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const heroStack = document.querySelector('.hero-stack');
  window.addEventListener('scroll', () => {
    if (!heroStack || window.innerWidth < 900) return;
    heroStack.style.transform = `translateY(${Math.min(window.scrollY * 0.025, 18)}px)`;
  }, { passive: true });
}

