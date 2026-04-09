/**
 * Fleur en Fleur — site behavior
 * WhatsApp: update `whatsappE164` and matching `wa.me/…` links in HTML footers & about page.
 */
const SITE = {
  whatsappE164: '6289609338889',
};

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav a').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

const orderForm = document.getElementById('orderForm');
const copyButton = document.getElementById('copyMessage');
const whatsappNumber = SITE.whatsappE164;

function buildMessage() {
  if (!orderForm) return '';

  const data = new FormData(orderForm);
  const values = Object.fromEntries(data.entries());

  const lines = [
    'Hello Fleur en Fleur, I would like to place an order.',
    '',
    `Name: ${values.name || '-'}`,
    `Phone: ${values.phone || '-'}`,
    `Occasion: ${values.occasion || '-'}`,
    `Collection: ${values.collection || '-'}`,
    `Size: ${values.size || '-'}`,
    `Flower Type: ${values.flowerType || '-'}`,
    `Mood: ${values.mood || '-'}`,
    `Preferred Colors: ${values.palette || '-'}`,
    `Budget Range: ${values.budget || '-'}`,
    `Pickup / Delivery Date: ${values.date || '-'}`,
    `Card Message: ${values.card || '-'}`,
    `Special Notes: ${values.notes || '-'}`,
  ];

  return lines.join('\n');
}

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!orderForm.reportValidity()) return;

    const message = buildMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  });
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const message = buildMessage();

    try {
      await navigator.clipboard.writeText(message);
      copyButton.textContent = 'Copied';
      setTimeout(() => {
        copyButton.textContent = 'Copy Order Details';
      }, 1600);
    } catch (error) {
      alert('Could not copy automatically. Please try again.');
    }
  });
}

/* Catalog 2026: size options depend on collection (see PDF). */
const collectionSelect = document.getElementById('collection');
const sizeSelect = document.getElementById('size');

const SIZE_BY_CATEGORY = {
  bouquet: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  bloombox: ['S', 'M', 'L', 'XL'],
  vase: ['S', 'M', 'L', 'XL', 'XXL'],
};

function collectionCategory(value) {
  if (!value) return 'bouquet';
  if (value.includes('Fleurette')) return 'bloombox';
  if (value.includes('Flourish')) return 'vase';
  return 'bouquet';
}

function syncSizeOptions() {
  if (!sizeSelect || !collectionSelect) return;
  const sizes = SIZE_BY_CATEGORY[collectionCategory(collectionSelect.value)];
  const previous = sizeSelect.value;
  sizeSelect.innerHTML = '<option value="">Choose size</option>';
  sizes.forEach((s) => {
    const opt = document.createElement('option');
    opt.textContent = s;
    opt.value = s;
    sizeSelect.appendChild(opt);
  });
  if (sizes.includes(previous)) sizeSelect.value = previous;
}

if (collectionSelect && sizeSelect) {
  collectionSelect.addEventListener('change', syncSizeOptions);
  syncSizeOptions();
}

/* Testimonials: infinite horizontal loop (mobile / tablet strip only). */
const testimonialStrip = document.querySelector('.testimonial-scroll-wrap .testimonial-grid');
const mqLoop = window.matchMedia('(max-width: 960px)');

function teardownTestimonialLoop() {
  if (!testimonialStrip) return;
  if (testimonialStrip._loopScroll) {
    testimonialStrip.removeEventListener('scroll', testimonialStrip._loopScroll);
    testimonialStrip._loopScroll = null;
  }
  testimonialStrip.querySelectorAll('[data-loop-clone]').forEach((el) => el.remove());
  testimonialStrip.dataset.loopReady = '';
}

function setupTestimonialLoop() {
  if (!testimonialStrip || !mqLoop.matches) return;

  const originals = Array.from(testimonialStrip.children).filter((el) => !el.dataset.loopClone);
  if (originals.length === 0) return;

  originals.forEach((node) => {
    const clone = node.cloneNode(true);
    clone.dataset.loopClone = '1';
    clone.setAttribute('aria-hidden', 'true');
    testimonialStrip.appendChild(clone);
  });

  testimonialStrip.dataset.loopReady = '1';

  const onScroll = () => {
    const half = testimonialStrip.scrollWidth / 2;
    if (half < 1) return;
    const sl = testimonialStrip.scrollLeft;
    if (sl >= half - 8) {
      testimonialStrip.scrollLeft = sl - half;
    } else if (sl <= 8) {
      testimonialStrip.scrollLeft = sl + half;
    }
  };

  testimonialStrip.addEventListener('scroll', onScroll, { passive: true });
  testimonialStrip._loopScroll = onScroll;
}

function initTestimonialLoop() {
  teardownTestimonialLoop();
  if (!mqLoop.matches) return;
  setupTestimonialLoop();
}

if (testimonialStrip) {
  mqLoop.addEventListener('change', initTestimonialLoop);
  if (document.readyState === 'complete') {
    initTestimonialLoop();
  } else {
    window.addEventListener('load', initTestimonialLoop);
  }
}
