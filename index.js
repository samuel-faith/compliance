// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
});
function closeMobile() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
}

// ── Nav shadow ──
window.addEventListener('scroll', () => {
    document.getElementById('navbar').style.boxShadow =
    window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.3)' : 'none';
});

// ── Scroll animations ──
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

// ── FAQ ──
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.faq-question').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
    }
    });
});

// ── Penalty Calculator ──
function calcUpdate() {
    const type = parseInt(document.getElementById('calcType').value);
    const days = parseInt(document.getElementById('calcDays').value) || 1;
    const total = type * days;
    const fmt = '$' + total.toLocaleString('en-US');
    document.getElementById('calcResult').textContent = fmt;
    document.getElementById('calcFine').textContent = fmt + ' in fines';
}
document.getElementById('calcType').addEventListener('change', calcUpdate);
document.getElementById('calcDays').addEventListener('input', calcUpdate);
calcUpdate();

// ── EmailJS Form ──
// SETUP: Replace with your EmailJS keys
const EMAILJS_PUBLIC_KEY  = 'JUC8RtFhM8wghtHvD';
const EMAILJS_SERVICE_ID  = 'service_6muqlgj';
const EMAILJS_TEMPLATE_ID = 'template_mp9pzbh';

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
script.onload = () => emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
document.head.appendChild(script);

const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = document.getElementById('btnText');
const btnArrow  = document.getElementById('btnArrow');
const btnSpinner= document.getElementById('btnSpinner');
const toast     = document.getElementById('form-toast');

function showToast(msg, ok) {
    toast.textContent = msg;
    toast.style.display = 'block';
    toast.style.background    = ok ? 'rgba(26,122,74,0.08)'  : 'rgba(192,57,43,0.08)';
    toast.style.color         = ok ? '#1A7A4A'                : '#C0392B';
    toast.style.borderColor   = ok ? 'rgba(26,122,74,0.25)'  : 'rgba(192,57,43,0.25)';
    setTimeout(() => { toast.style.display = 'none'; }, 6000);
}
function setLoading(on) {
    submitBtn.disabled       = on;
    btnText.textContent      = on ? 'Sending…' : 'Send Message';
    btnArrow.style.display   = on ? 'none' : 'block';
    btnSpinner.style.display = on ? 'block' : 'none';
    submitBtn.style.opacity  = on ? '0.75' : '1';
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const ids = ['firstName','lastName','email','restaurant','state','plan'];
    for (const id of ids) {
    if (!document.getElementById(id).value.trim()) {
        showToast('Please fill in all required fields.', false);
        document.getElementById(id).focus();
        return;
    }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value)) {
    showToast('Please enter a valid email address.', false);
    return;
    }
    setLoading(true);
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email:   'sam.rctusa@gmail.com',
    from_name:  document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
    from_email: document.getElementById('email').value,
    restaurant: document.getElementById('restaurant').value,
    state:      document.getElementById('state').value,
    plan:       document.getElementById('plan').value,
    message:    document.getElementById('message').value,
    reply_to:   document.getElementById('email').value,
    })
    .then(() => {
    setLoading(false);
    showToast("✅ Message received! Samuel will be in touch within 24 hours.", true);
    form.reset();
    })
    .catch(err => {
    setLoading(false);
    console.error(err);
    showToast('Something went wrong. Email us directly at sam.rctusa@gmail.com', false);
    });
});

// Spinner keyframe
const s = document.createElement('style');
s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(s);