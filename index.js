/* ══ RESTAURANT COMPLIANCE TRACKER USA — index.js ══ */

// ── EmailJS Config ──
const EMAILJS_PUBLIC_KEY  = 'JUC8RtFhM8wghtHvD';
const EMAILJS_SERVICE_ID  = 'service_6muqlgj';
const EMAILJS_TEMPLATE_ID = 'template_mp9pzbh';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ── Urgency Bar ──
const urgencyBar   = document.getElementById('urgencyBar');
const urgencyClose = document.getElementById('urgencyClose');
const navbar       = document.getElementById('navbar');

urgencyClose.addEventListener('click', () => {
  urgencyBar.style.display = 'none';
  navbar.classList.add('urgency-gone');
  // Adjust mobile nav top
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) mobileNav.style.top = '66px';
});

// ── Hamburger / Mobile Nav ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

// ── Nav shadow on scroll ──
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 32px rgba(0,0,0,0.4)'
    : 'none';
}, { passive: true });

// ── Sticky CTA ──
const stickyCta   = document.getElementById('stickyCta');
const heroSection = document.getElementById('hero');

const stickyObserver = new IntersectionObserver(([entry]) => {
  stickyCta.classList.toggle('visible', !entry.isIntersecting);
}, { threshold: 0.1 });

if (heroSection) stickyObserver.observe(heroSection);

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger siblings
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('visible');
      }, Math.min(idx * 80, 300));
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── FAQ Accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ── Penalty Calculator ──
function calcUpdate() {
  const type = parseInt(document.getElementById('calcType').value) || 5000;
  const days = Math.max(1, parseInt(document.getElementById('calcDays').value) || 1);
  const total = type * days;
  const fmt = '$' + total.toLocaleString('en-US');
  document.getElementById('calcResult').textContent = fmt;
  document.getElementById('calcFine').textContent = `Based on $${type.toLocaleString()} per day × ${days} days`;
  document.getElementById('calcFineDisplay').textContent = fmt;
}

document.getElementById('calcType').addEventListener('change', calcUpdate);
document.getElementById('calcDays').addEventListener('input', calcUpdate);
calcUpdate();

// ── Contact Form ──
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');
const btnArrow   = document.getElementById('btnArrow');
const btnSpinner = document.getElementById('btnSpinner');
const toast      = document.getElementById('form-toast');

function showToast(msg, ok) {
  toast.innerHTML = msg;
  toast.style.display  = 'block';
  toast.style.background   = ok ? 'rgba(31,140,90,0.06)'  : 'rgba(217,64,64,0.06)';
  toast.style.color        = ok ? '#1F8C5A'                : '#D94040';
  toast.style.borderColor  = ok ? 'rgba(31,140,90,0.25)'  : 'rgba(217,64,64,0.25)';
  if (ok) setTimeout(() => { toast.style.display = 'none'; }, 8000);
}

function setLoading(on) {
  submitBtn.disabled       = on;
  btnText.textContent      = on ? 'Sending…' : 'Send Message';
  btnArrow.style.display   = on ? 'none' : 'block';
  btnSpinner.style.display = on ? 'block' : 'none';
  btnSpinner.style.animation = on ? 'spin 0.8s linear infinite' : 'none';
  submitBtn.style.opacity  = on ? '0.8' : '1';
}

form.addEventListener('submit', e => {
  e.preventDefault();

  // Validate required fields
  const required = ['firstName','lastName','email','restaurant','state','plan'];
  for (const id of required) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      showToast(`⚠ Please fill in the <strong>${el.previousElementSibling.textContent.replace(' *','')}</strong> field.`, false);
      el.focus();
      return;
    }
  }

  // Validate email format
  const emailVal = document.getElementById('email').value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    showToast('⚠ Please enter a valid email address.', false);
    return;
  }

  setLoading(true);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email:   'sam.rctusa@gmail.com',
    from_name:  `${document.getElementById('firstName').value.trim()} ${document.getElementById('lastName').value.trim()}`,
    from_email: emailVal,
    restaurant: document.getElementById('restaurant').value.trim(),
    state:      document.getElementById('state').value,
    plan:       document.getElementById('plan').value,
    message:    document.getElementById('message').value.trim() || 'No additional message.',
    reply_to:   emailVal,
  })
  .then(() => {
    setLoading(false);
    showToast('✅ <strong>Message received!</strong> Samuel will review your details and respond within 24 hours.', true);
    form.reset();
    // Scroll to toast
    toast.scrollIntoView({ behavior: 'smooth', block: 'center' });
  })
  .catch(err => {
    setLoading(false);
    console.error('EmailJS error:', err);
    showToast('❌ Something went wrong. Please email us directly at <a href="mailto:sam.rctusa@gmail.com" style="color:inherit;font-weight:700;">sam.rctusa@gmail.com</a>', false);
  });
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      closeMobile();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Spinner keyframe injection ──
const style = document.createElement('style');
style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);