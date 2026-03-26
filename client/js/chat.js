document.addEventListener('DOMContentLoaded', () => {
  // Inject Chat FAB and Panel into DOM
  const chatHTML = `
    <button class="chat-fab" id="chatFab">💬</button>
    
    <div class="chat-panel" id="chatPanel" style="display: none; transform: translateY(20px); opacity: 0; transition: all 0.3s ease;">
      <div class="chat-header">
        <div class="chat-title">
          <span class="chat-dot"></span>
          Premium Tower Palace
        </div>
        <button class="chat-close" id="chatClose">✕</button>
      </div>
      <div class="chat-tabs">
        <button class="chat-tab active" data-tab="message">Message Us</button>
        <button class="chat-tab" data-tab="whatsapp">WhatsApp</button>
      </div>
      <div class="chat-body">
        <div class="chat-form" id="tab-message">
          <form id="chatMessageForm">
            <input type="text" id="chat-name" placeholder="Name" required />
            <input type="email" id="chat-email" placeholder="Email" required />
            <input type="text" id="chat-room" placeholder="Room No (Optional)" />
            <textarea id="chat-msg" rows="3" placeholder="Message" required></textarea>
            <button type="submit" class="btn-primary w-100" style="padding: 0.5rem;">Send</button>
          </form>
          <div class="success-state" id="chatSuccess" style="display: none; padding: 2rem 0;">
            <div class="icon">✓</div>
            <p>Message Sent</p>
          </div>
        </div>
        <div class="chat-whatsapp" id="tab-whatsapp" style="display:none; text-align: center; padding: 2rem 1rem;">
          <p style="margin-bottom: 2rem; color: var(--text-muted); font-size: 0.9rem;">Chat with us directly on WhatsApp for faster responses.</p>
          <a href="https://wa.me/233551234567" target="_blank" class="btn-primary w-100" style="display: block; background: #25D366; color: white; text-decoration: none;">Open WhatsApp</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // Add styles
  const style = document.createElement('style');
  style.innerHTML = `
    .chat-fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: var(--gold);
      color: var(--dark);
      font-size: 1.5rem;
      border: none;
      cursor: pointer;
      z-index: 999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(201,168,76, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(201,168,76, 0); }
      100% { box-shadow: 0 0 0 0 rgba(201,168,76, 0); }
    }

    .chat-panel {
      position: fixed;
      bottom: 104px;
      right: 32px;
      width: 360px;
      max-height: 520px;
      background: var(--dark-3);
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 2px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-panel.open {
      display: flex !important;
      transform: translateY(0) !important;
      opacity: 1 !important;
    }

    .chat-header {
      padding: 1rem;
      background: var(--dark-2);
      border-bottom: 1px solid rgba(201,168,76,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-title {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .chat-dot {
      width: 8px;
      height: 8px;
      background: #25D366;
      border-radius: 50%;
      display: inline-block;
      animation: pulseGreen 2s infinite;
    }

    @keyframes pulseGreen {
      0% { box-shadow: 0 0 0 0 rgba(37,211,102, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(37,211,102, 0); }
      100% { box-shadow: 0 0 0 0 rgba(37,211,102, 0); }
    }

    .chat-close {
      background: none;
      border: none;
      color: var(--cream);
      cursor: pointer;
      font-size: 1.2rem;
    }

    .chat-tabs {
      display: flex;
      border-bottom: 1px solid var(--gold-dim);
    }

    .chat-tab {
      flex: 1;
      background: var(--dark-3);
      border: none;
      color: var(--text-muted);
      padding: 0.75rem;
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.85rem;
    }

    .chat-tab.active {
      color: var(--gold);
      border-bottom: 2px solid var(--gold);
    }

    .chat-body {
      padding: 1.5rem;
    }

    .chat-form input, .chat-form textarea {
      width: 100%;
      padding: 0.75rem;
      background: var(--dark-2);
      border: 1px solid var(--gold-dim);
      color: var(--cream);
      font-family: var(--font-body);
      border-radius: 2px;
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }

    .chat-form input:focus, .chat-form textarea:focus {
      outline: none;
      border-color: var(--gold);
    }
  `;
  document.head.appendChild(style);

  // Logic
  const fab = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const tabs = document.querySelectorAll('.chat-tab');
  
  fab.addEventListener('click', () => {
    panel.style.display = 'flex';
    // tiny delay to allow CSS transition
    setTimeout(() => panel.classList.add('open'), 10);
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
    setTimeout(() => panel.style.display = 'none', 300);
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      const targetId = e.target.getAttribute('data-tab');
      document.getElementById('tab-message').style.display = targetId === 'message' ? 'block' : 'none';
      document.getElementById('tab-whatsapp').style.display = targetId === 'whatsapp' ? 'block' : 'none';
    });
  });

  document.getElementById('chatMessageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
      name: document.getElementById('chat-name').value,
      email: document.getElementById('chat-email').value,
      room: document.getElementById('chat-room').value,
      message: document.getElementById('chat-msg').value
    };

    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerText = 'Sending...';
    btn.disabled = true;

    try {
      // Reusing the global API_URL if loaded, otherwise fallback
      const apiUrl = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:5000/api';
      await fetch(apiUrl + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      document.getElementById('chatMessageForm').style.display = 'none';
      document.getElementById('chatSuccess').style.display = 'flex';
    } catch(err) {
      btn.innerText = 'Send';
      btn.disabled = false;
    }
  });
});