// Protect route
guardAdmin();

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const res = await fetch(API_URL + '/admin/stats', {
      headers: authHeaders()
    });
    
    if(!res.ok) {
      if(res.status === 401 || res.status === 403) logout();
      throw new Error('Failed to fetch stats');
    }
    
    const data = await res.json();
    
    // Render Stats
    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-num">${data.pendingBookings || 0}</div>
        <div class="stat-label">Pending Bookings</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${data.availableRooms || 0}</div>
        <div class="stat-label">Available Rooms</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${data.unreadMessages || 0}</div>
        <div class="stat-label">Unread Messages</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">₵${data.monthlyRevenue || 0}</div>
        <div class="stat-label">Monthly Revenue</div>
      </div>
    `;

    // Render Recent Bookings
    const tbody = document.getElementById('bookingsTableBody');
    if(data.recentBookings && data.recentBookings.length > 0) {
      tbody.innerHTML = data.recentBookings.map(b => `
        <tr>
          <td>${b.name}</td>
          <td>${b.room}</td>
          <td>${new Date(b.date).toLocaleDateString()}</td>
          <td><span class="badge badge-${b.status === 'Pending' ? 'limited' : (b.status === 'Confirmed' ? 'avail' : 'occupied')}">${b.status}</span></td>
          <td><a href="bookings.html" style="color:var(--gold); text-decoration:none;">Review</a></td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:var(--text-muted);">No recent bookings found.</td></tr>`;
    }

  } catch (err) {
    document.getElementById('statsGrid').innerHTML = `<p style="color:#C94C4C;">Error loading dashboard data.</p>`;
    console.error(err);
  }
}