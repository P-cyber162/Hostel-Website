const API_URL = 'http://localhost:5000/api';

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(API_URL + endpoint, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API error:', err);
    throw err;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        name: document.getElementById('c-name').value,
        email: document.getElementById('c-email').value,
        message: document.getElementById('c-message').value
      };

      const btn = form.querySelector('button[type="submit"]');
      btn.innerText = 'Sending...';
      btn.disabled = true;

      try {
        await apiFetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        form.style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'flex';
      } catch (error) {
        btn.innerText = 'Send Message';
        btn.disabled = false;
        // Not using alert - inline error handling pattern
        let err = form.querySelector('.error-msg');
        if(!err) {
          err = document.createElement('p');
          err.className = 'error-msg';
          err.style.color = '#C94C4C';
          err.style.marginTop = '1rem';
          form.appendChild(err);
        }
        err.innerText = 'Failed to send message. Please try again.';
      }
    });
  }

  // Init scroll reveal
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
});