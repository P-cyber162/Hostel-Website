const API_URL = 'http://localhost:5000/api';

const badges = {
  Available: { cls: 'badge-avail',    label: '✓ Available' },
  Occupied:  { cls: 'badge-occupied', label: '✗ Occupied'  },
  Reserved:  { cls: 'badge-limited',  label: '⏳ Reserved'  }
};

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
  loadRooms();

  document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
});

async function loadRooms() {
  const roomGrid = document.getElementById('roomGrid');
  
  // Show loaders
  roomGrid.innerHTML = `
    <div class="room-card skeleton" style="height:300px; padding:1rem;"></div>
    <div class="room-card skeleton" style="height:300px; padding:1rem;"></div>
    <div class="room-card skeleton" style="height:300px; padding:1rem;"></div>
  `;

  try {
    const filters = getFilterValues();
    const query = new URLSearchParams(filters).toString();
    const rooms = await apiFetch(`/rooms?${query}`);

    if (rooms.length === 0) {
      roomGrid.innerHTML = `
        <div class="empty-state text-center" style="grid-column: 1/-1; padding: 4rem;">
          <h2 class="icon mb-1" style="font-size:3rem; color:var(--gold);">🛏️</h2>
          <h3>No rooms match your filters</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    renderRooms(rooms);

  } catch (error) {
    roomGrid.innerHTML = `
      <div class="error-state room-card text-center" style="grid-column: 1/-1; border-color: rgba(201, 76, 76, 0.3);">
        <h3 style="color:#C94C4C">Error Loading Rooms</h3>
        <p>Could not connect to the server.</p>
        <button class="btn-primary" onclick="loadRooms()">Retry</button>
      </div>
    `;
  }
}

function getFilterValues() {
  return {
    type: document.getElementById('typeFilter').value,
    minPrice: document.getElementById('minPrice').value,
    maxPrice: document.getElementById('maxPrice').value,
    status: document.getElementById('statusFilter').value
  };
}

function applyFilters() {
  loadRooms();
}

function renderRooms(rooms) {
  const grid = document.getElementById('roomGrid');
  grid.innerHTML = '';

  rooms.forEach(room => {
    const badge = badges[room.status] || badges['Available'];
    const disabled = room.status !== 'Available';
    
    grid.innerHTML += `
      <div class="room-card reveal" style="padding-bottom:1rem;">
        <img src="${room.thumbnail || 'https://placehold.co/600x400/1A1A24/C9A84C?text=PTP'}" style="width:100%; height:200px; object-fit:cover;" />
        <div style="padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span class="badge ${badge.cls}">${badge.label}</span>
            <span style="font-family:var(--font-heading); font-size:1.5rem; color:var(--gold);">₵${room.price}/mo</span>
          </div>
          <h3 style="font-size:1.4rem;">${room.name} <em>Suite</em></h3>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">${room.type}</p>
          
          <button class="btn-primary w-100" 
                  ${disabled ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : `onclick="openBooking('${room.id}', '${room.name}')"`}>
            Book Now
          </button>
        </div>
      </div>
    `;
  });

  initScrollReveal();
}

function openBooking(roomId, roomName) {
  const modal = document.getElementById('bookingModalOverlay');
  document.getElementById('b-room').value = `${roomName} (${roomId})`;
  document.getElementById('bookingForm').style.display = 'block';
  document.getElementById('bookingSuccess').style.display = 'none';
  modal.classList.add('active');
}

document.getElementById('closeModalBtn').addEventListener('click', closeBookingModal);

function closeBookingModal() {
  document.getElementById('bookingModalOverlay').classList.remove('active');
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById('b-name').value,
    email: document.getElementById('b-email').value,
    phone: document.getElementById('b-phone').value,
    room: document.getElementById('b-room').value,
    date: document.getElementById('b-date').value
  };

  try {
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerText = 'Submitting...';
    btn.disabled = true;

    await apiFetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'flex';
  } catch(err) {
    btn.innerText = 'Submit Request';
    btn.disabled = false;
  }
});

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}
