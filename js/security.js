// ============================================================
// HOSTELEASE - SECURITY GUARD CONTROLLER
// ============================================================

const SecurityController = {
  activeFilter: 'all',

  render() {
    const user = Auth.getCurrentUser();
    return `
    <div class="dashboard-wrapper">
      ${SecurityController.renderSidebar(user)}
      <div class="dashboard-main">
        ${SecurityController.renderTopbar(user)}
        <div class="page-content" id="security-content">
          ${SecurityController.renderPassBoard()}
        </div>
      </div>
    </div>
    <!-- Mobile Bottom Navigation Bar -->
    <nav class="mobile-bottom-nav">
      <button class="mobile-nav-btn active" id="sec-bnav-0" onclick="SecurityController.showPassBoard()">
        <span class="mobile-nav-icon">🎟️</span>
        <span>All</span>
      </button>
      <button class="mobile-nav-btn" id="sec-bnav-1" onclick="SecurityController.showPendingView()">
        <span class="mobile-nav-icon">⏳</span>
        <span>Pending</span>
      </button>
      <button class="mobile-nav-btn" id="sec-bnav-2" onclick="SecurityController.showApprovedView()">
        <span class="mobile-nav-icon">✅</span>
        <span>Approved</span>
      </button>
      <button class="mobile-nav-btn" id="sec-bnav-3" onclick="SecurityController.showRejectedView()">
        <span class="mobile-nav-icon">❌</span>
        <span>Rejected</span>
      </button>
      <button class="mobile-nav-btn" onclick="App.closeSidebar(); SettingsController.openSettingsModal('security')">
        <span class="mobile-nav-icon">⚙️</span>
        <span>Settings</span>
      </button>
    </nav>
    `;
  },

  renderSidebar(user) {
    return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div style="display:flex;align-items:center;gap:.75rem;min-width:0;flex:1">
          <div class="sidebar-logo-icon">🏨</div>
          <div>
            <div class="sidebar-logo-text">HostelEase</div>
            <div class="sidebar-logo-sub">Security Portal</div>
          </div>
        </div>
        <button class="sidebar-close-btn" onclick="App.closeSidebar()" aria-label="Close menu">✕</button>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-avatar" style="background:linear-gradient(135deg,#0f3460,#533483)">🛡️</div>
        <div>
          <div class="sidebar-user-name">${user.name}</div>
          <div class="sidebar-user-role">Security Guard</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <span class="sidebar-section-label">Gate Control</span>
        <div class="nav-item active" onclick="SecurityController.showPassBoard()">
          <span class="nav-item-icon">🎟️</span> Pass Status Board
        </div>
        <div class="nav-item" onclick="SecurityController.showPendingView()">
          <span class="nav-item-icon">⏳</span> Pending Passes
        </div>
        <div class="nav-item" onclick="SecurityController.showApprovedView()">
          <span class="nav-item-icon">✅</span> Approved Passes
        </div>
        <div class="nav-item" onclick="SecurityController.showRejectedView()">
          <span class="nav-item-icon">❌</span> Rejected Passes
        </div>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" onclick="App.closeSidebar(); SettingsController.openSettingsModal('security')">
          ⚙️ Settings
        </button>
        <button class="sidebar-footer-btn danger" onclick="App.logout()">
          🚪 Logout
        </button>
      </div>
    </aside>
    `;
  },

  renderTopbar(user) {
    return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle-btn" onclick="App.toggleSidebar()" aria-label="Toggle navigation">
          ☰
        </button>
        <span class="topbar-title">🛡️ Security Gate Monitor</span>
      </div>
      <div class="topbar-right">
        <div id="backend-status-badge" style="font-size:.78rem;font-weight:600;padding:.35rem .75rem;border-radius:var(--radius-full);background:var(--bg-surface);border:1px solid var(--border-light);display:flex;align-items:center;gap:.4rem;cursor:help;box-shadow:var(--shadow-sm)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981"></span> <span class="badge-full-text">Backend: Connected (SQLite)</span>
        </div>
        <button class="theme-toggle-btn" onclick="App.toggleTheme()" title="Toggle Theme">
          ${Storage.getTheme() === 'dark' ? '☀️' : '🌙'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="App.logout()">Logout</button>
      </div>
    </header>
    `;
  },

  renderPassBoard() {
    const passes = Storage.getPasses();
    const counts = {
      all: passes.length,
      pending: passes.filter(p=>p.status==='pending').length,
      approved: passes.filter(p=>p.status==='approved').length,
      rejected: passes.filter(p=>p.status==='rejected').length,
    };

    return `
    <div class="animate-fade-in">
      <!-- Banner -->
      <div class="security-header-banner">
        <div>
          <h1 style="color:#fff;font-size:1.5rem;font-weight:800;margin-bottom:.35rem">
            🛡️ Gate Pass Monitor
          </h1>
          <p style="color:#94a3b8;font-size:.9rem">
            Read-only view of all hostel gate passes. Contact Warden to approve/reject.
          </p>
        </div>
        <div style="background:rgba(255,255,255,.08);padding:1rem 1.5rem;border-radius:var(--radius-lg);text-align:center;border:1px solid rgba(255,255,255,.15)">
          <div style="font-size:2rem;font-weight:800;color:#fff">${counts.all}</div>
          <div style="font-size:.78rem;color:#94a3b8;text-transform:uppercase">Total Passes</div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stat-grid" style="margin-bottom:2rem">
        <div class="stat-card">
          <div class="stat-icon amber">⏳</div>
          <div><div class="stat-value">${counts.pending}</div><div class="stat-label">Pending Review</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">✅</div>
          <div><div class="stat-value">${counts.approved}</div><div class="stat-label">Approved</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon rose">❌</div>
          <div><div class="stat-value">${counts.rejected}</div><div class="stat-label">Rejected</div></div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="tab-nav" id="security-filter-tabs">
        ${['all','pending','approved','rejected'].map(f => `
          <button class="tab-btn ${SecurityController.activeFilter===f?'active':''}"
                  onclick="SecurityController.setFilter('${f}')">
            ${f.charAt(0).toUpperCase()+f.slice(1)}
            <span style="margin-left:.35rem;background:var(--bg-subtle);padding:.1rem .45rem;border-radius:var(--radius-full);font-size:.7rem">${counts[f]}</span>
          </button>
        `).join('')}
      </div>

      <!-- Pass Table -->
      ${SecurityController.renderPassTable(passes)}
    </div>
    `;
  },

  renderPassTable(allPasses) {
    const filtered = SecurityController.activeFilter === 'all'
      ? allPasses
      : allPasses.filter(p => p.status === SecurityController.activeFilter);

    if (!filtered.length) {
      return `<div class="empty-state">
        <div class="empty-state-icon">🎟️</div>
        <div class="empty-state-title">No passes found</div>
        <p>No ${SecurityController.activeFilter} passes at this time.</p>
      </div>`;
    }

    return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Room</th>
            <th>Pass Type</th>
            <th>Destination</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td>
                <div style="font-weight:700">${p.studentName}</div>
                <div style="font-size:.78rem;color:var(--text-muted)">${p.rollNo||''}</div>
              </td>
              <td><span class="badge badge-tag">${p.roomNo||'—'}</span></td>
              <td><span class="pass-badge ${p.type}">${p.type==='out-pass'?'🚶 Out Pass':'🏠 Home Pass'}</span></td>
              <td style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.destination}</td>
              <td style="white-space:nowrap">${p.fromDate}</td>
              <td style="white-space:nowrap">${p.toDate}</td>
              <td><span class="badge badge-${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
              <td>
                <button class="btn btn-sm btn-outline" onclick="SecurityController.viewPassModal('${p.id}')">View</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    `;
  },

  setFilter(filter) {
    SecurityController.activeFilter = filter;
    SecurityController.showPassBoard();
  },

  showPassBoard() {
    SecurityController.setActiveNav(0);
    document.getElementById('security-content').innerHTML = SecurityController.renderPassBoard();
  },
  showPendingView() {
    SecurityController.activeFilter = 'pending';
    SecurityController.setActiveNav(1);
    document.getElementById('security-content').innerHTML = SecurityController.renderPassBoard();
  },
  showApprovedView() {
    SecurityController.activeFilter = 'approved';
    SecurityController.setActiveNav(2);
    document.getElementById('security-content').innerHTML = SecurityController.renderPassBoard();
  },
  showRejectedView() {
    SecurityController.activeFilter = 'rejected';
    SecurityController.setActiveNav(3);
    document.getElementById('security-content').innerHTML = SecurityController.renderPassBoard();
  },

  setActiveNav(idx) {
    App.closeSidebar();
    document.querySelectorAll('.sidebar .nav-item').forEach((el,i) => {
      el.classList.toggle('active', i===idx);
    });
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach((el,i) => {
      el.classList.toggle('active', i===idx);
    });
  },

  viewPassModal(passId) {
    const pass = Storage.getPassById(passId);
    if (!pass) return;
    const student = Storage.getUserById(pass.studentId) || {};

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'security-pass-modal';
    modal.innerHTML = `
    <div class="modal" style="max-width:660px">
      <div class="modal-header">
        <div class="modal-title">🎟️ Gate Pass Details</div>
        <button class="modal-close" onclick="document.getElementById('security-pass-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="gate-pass-ticket" style="margin-bottom:1.5rem">
          <div class="gate-pass-header">
            <div>
              <div style="font-size:.7rem;text-transform:uppercase;color:#94a3b8;letter-spacing:.05em">HostelEase Official</div>
              <div style="font-size:1.1rem;font-weight:800;margin-top:.2rem">${pass.type === 'out-pass' ? '🚶 OUT PASS' : '🏠 HOME PASS'}</div>
            </div>
            <span class="badge badge-${pass.status}" style="font-size:.78rem">${pass.status.toUpperCase()}</span>
          </div>
          <div class="gate-pass-body">
            <div class="gate-pass-details">
              <div><div class="detail-label">Student</div><div class="detail-val">${pass.studentName}</div></div>
              <div><div class="detail-label">Roll No</div><div class="detail-val">${pass.rollNo||'—'}</div></div>
              <div><div class="detail-label">Room</div><div class="detail-val">${pass.roomNo||'—'}</div></div>
              <div><div class="detail-label">Purpose</div><div class="detail-val" style="font-size:.82rem">${pass.purpose}</div></div>
              <div><div class="detail-label">Destination</div><div class="detail-val" style="font-size:.82rem">${pass.destination}</div></div>
              <div><div class="detail-label">From → To</div><div class="detail-val">${pass.fromDate} → ${pass.toDate}</div></div>
            </div>
            <div class="qr-placeholder">
              <div class="qr-matrix">${generateQR()}</div>
            </div>
          </div>
          <div class="gate-pass-footer">
            <div>Applied: ${new Date(pass.createdAt).toLocaleDateString('en-IN')}</div>
            ${pass.status==='approved' ? `<div class="warden-seal">✅ Warden Approved</div>` : ''}
          </div>
        </div>
        ${pass.idCardImage ? `
          <div class="card" style="padding:1rem">
            <div style="font-weight:700;margin-bottom:.75rem">📷 Uploaded College ID Card</div>
            <img src="${pass.idCardImage}" alt="College ID" style="max-width:100%;max-height:200px;border-radius:var(--radius-md);border:1px solid var(--border-light);object-fit:contain;display:block;margin:auto">
          </div>
        ` : ''}
        ${pass.wardenNote ? `
          <div style="background:var(--color-success-light);border:1px solid var(--color-success);border-radius:var(--radius-md);padding:1rem;margin-top:.75rem">
            <div style="font-weight:700;margin-bottom:.3rem;color:var(--color-success)">📝 Warden Note</div>
            <div style="color:var(--text-main);font-size:.9rem">${pass.wardenNote}</div>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('security-pass-modal').remove()">Close</button>
      </div>
    </div>
    `;
    document.body.appendChild(modal);
  },

  init() {
    // Nothing extra needed on init
  },
};

window.SecurityController = SecurityController;
