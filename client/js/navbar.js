document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Adding the CSS dynamically to not worry about missing it in global.css if index.html is overwritten
  const style = document.createElement('style');
  style.innerHTML = `
    .navbar {
      height: var(--nav-h);
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      background: linear-gradient(to bottom, rgba(10,10,15,0.9), transparent);
      transition: background 0.3s ease;
      display: flex;
      align-items: center;
    }
    .navbar.scrolled {
      background: rgba(10,10,15,0.98);
      border-bottom: 1px solid rgba(201,168,76,0.1);
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .logo {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      color: var(--gold);
      text-decoration: none;
      font-weight: 500;
    }
    .logo span {
      font-weight: 300;
      color: var(--cream);
    }
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    .nav-links a {
      font-family: var(--font-body);
      font-size: 0.82rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--cream);
      text-decoration: none;
      opacity: 0.75;
      transition: all 0.3s ease;
    }
    .nav-links a:hover, .nav-links a.active {
      opacity: 1;
      color: var(--gold);
    }
    .nav-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--gold);
      font-size: 1.5rem;
      cursor: pointer;
    }
    @media (max-width: 1024px) {
      .nav-links, .nav-cta {
        display: none;
      }
      .nav-toggle {
        display: block;
      }
      .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: var(--nav-h);
        left: 0;
        width: 100%;
        background: var(--dark-2);
        padding: 2rem;
        border-bottom: 1px solid var(--gold-dim);
      }
    }
  `;
  document.head.appendChild(style);
});