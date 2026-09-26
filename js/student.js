// ============================================================
// HOSTELEASE - STUDENT CONTROLLER
// ============================================================

const StudentController = {
  activeTab: 'dashboard',

  render() {
    const user = Auth.getCurrentUser();
    return `
    <div class="dashboard-wrapper">
      ${StudentController.renderSidebar(user)}
      <div class="dashboard-main">
        ${StudentController.renderTopbar(user)}
        <div class="page-content" id="student-content">
          ${StudentController.renderDashboard()}
        </div>
      </div>
    </div>
    <!-- Mobile Bottom Navigation Bar -->
    <nav class="mobile-bottom-nav">
      <button class="mobile-nav-btn active" id="mbnav-dashboard" onclick="StudentController.switchTab('dashboard')">
        <span class="mobile-nav-icon">🏠</span>
        <span>Home</span>
      </button>
      <button class="mobile-nav-btn" id="mbnav-attendance" onclick="StudentController.switchTab('attendance')">
        <span class="mobile-nav-icon">📋</span>
        <span>Attendance</span>
      </button>
      <button class="mobile-nav-btn" id="mbnav-mypasses" onclick="StudentController.switchTab('mypasses')">
        <span class="mobile-nav-icon">🎟️</span>
        <span>Passes</span>
      </button>
      <button class="mobile-nav-btn" id="mbnav-menu" onclick="StudentController.switchTab('menu')">
        <span class="mobile-nav-icon">🍽️</span>
        <span>Mess</span>
      </button>
      <button class="mobile-nav-btn" id="mbnav-complaint" onclick="StudentController.switchTab('complaint')">
        <span class="mobile-nav-icon">📣</span>
        <span>Complaint</span>
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
            <div class="sidebar-logo-sub">Student Portal</div>
          </div>
        </div>
        <button class="sidebar-close-btn" onclick="App.closeSidebar()" aria-label="Close menu">✕</button>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-avatar">${user.avatar || user.name.charAt(0)}</div>
        <div>
          <div class="sidebar-user-name">${user.name}</div>
          <div class="sidebar-user-role">${user.rollNo || 'Student'} · ${user.roomNo || '—'}</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <span class="sidebar-section-label">Overview</span>
        <div class="nav-item active" id="snav-dashboard" onclick="StudentController.switchTab('dashboard')">
          <span class="nav-item-icon">🏠</span> Dashboard
        </div>
        <span class="sidebar-section-label">Academic</span>
        <div class="nav-item" id="snav-attendance" onclick="StudentController.switchTab('attendance')">
          <span class="nav-item-icon">📋</span> My Attendance
        </div>
        <div class="nav-item" id="snav-menu" onclick="StudentController.switchTab('menu')">
          <span class="nav-item-icon">🍽️</span> Mess Menu
        </div>
        <span class="sidebar-section-label">Gate Passes</span>
        <div class="nav-item" id="snav-outpass" onclick="StudentController.switchTab('outpass')">
          <span class="nav-item-icon">🚶</span> Apply Out Pass
        </div>
        <div class="nav-item" id="snav-homepass" onclick="StudentController.switchTab('homepass')">
          <span class="nav-item-icon">🏡</span> Apply Home Pass
        </div>
        <div class="nav-item" id="snav-mypasses" onclick="StudentController.switchTab('mypasses')">
          <span class="nav-item-icon">🎟️</span> My Passes
        </div>
        <span class="sidebar-section-label">Support</span>
        <div class="nav-item" id="snav-complaint" onclick="StudentController.switchTab('complaint')">
          <span class="nav-item-icon">📣</span> Raise Complaint
        </div>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" onclick="App.closeSidebar(); SettingsController.openSettingsModal('student')">
          ⚙️ Settings & Profile
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
        <span class="topbar-title" id="student-topbar-title">🏠 Dashboard</span>
      </div>
      <div class="topbar-right">
        <div id="backend-status-badge" style="font-size:.78rem;font-weight:600;padding:.35rem .75rem;border-radius:var(--radius-full);background:var(--bg-surface);border:1px solid var(--border-light);display:flex;align-items:center;gap:.4rem;cursor:help;box-shadow:var(--shadow-sm)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981"></span> <span class="badge-full-text">Backend: Connected (SQLite)</span>
        </div>
        <button class="theme-toggle-btn" onclick="App.toggleTheme()" title="Toggle Theme">
          ${Storage.getTheme() === 'dark' ? '☀️' : '🌙'}
        </button>
        <div class="topbar-user-pill" style="display:flex;align-items:center;gap:.6rem;background:var(--bg-subtle);padding:.35rem .75rem;border-radius:var(--radius-full);border:1px solid var(--border-light)">
          <div style="width:28px;height:28px;border-radius:50%;background:var(--gradient-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0">
            ${user.avatar || user.name.charAt(0)}
          </div>
          <span class="topbar-user-name" style="font-size:.85rem;font-weight:600;color:var(--text-main)">${user.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
    `;
  },

  switchTab(tab) {
    StudentController.activeTab = tab;
    App.closeSidebar();
    document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById(`snav-${tab}`);
    if (navEl) navEl.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === `mbnav-${tab}`);
    });

    const titles = {
      dashboard:  '🏠 Dashboard',
      attendance: '📋 My Attendance',
      menu:       '🍽️ Mess Menu',
      outpass:    '🚶 Apply Out Pass',
      homepass:   '🏡 Apply Home Pass',
      mypasses:   '🎟️ My Passes',
      complaint:  '📣 Raise Complaint',
    };
    const titleEl = document.getElementById('student-topbar-title');
    if (titleEl) titleEl.textContent = titles[tab] || '';
    const content = document.getElementById('student-content');
    const map = {
      dashboard:  StudentController.renderDashboard,
      attendance: StudentController.renderAttendance,
      menu:       StudentController.renderMessMenu,
      outpass:    () => StudentController.renderPassForm('out-pass'),
      homepass:   () => StudentController.renderPassForm('home-pass'),
      mypasses:   StudentController.renderMyPasses,
      complaint:  StudentController.renderComplaint,
    };
    if (map[tab]) content.innerHTML = `<div class="animate-fade-in">${map[tab]()}</div>`;
  },

  // =====================================================================
  // DASHBOARD
  // =====================================================================
  renderDashboard() {
    const user = Auth.getCurrentUser();
    const passes     = Storage.getPassesByStudent(user.id);
    const complaints = Storage.getComplaintsByStudent(user.id);
    const att        = Storage.getStudentAttendance(user.id);
    const entries    = Object.values(att);
    const pct        = entries.length ? Math.round((entries.filter(v=>v==='present').length/entries.length)*100) : 0;
    const notices    = Storage.getNotices();
    const today      = new Date().toISOString().split('T')[0];
    const todayAtt   = att[today] || 'Not Marked';

    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">Welcome back, ${user.name.split(' ')[0]}! 👋</div>
        <div class="page-header-sub">${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon indigo">📋</div>
        <div>
          <div class="stat-value">${pct}%</div>
          <div class="stat-label">Attendance (30d)</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon ${todayAtt==='present'?'emerald':todayAtt==='absent'?'rose':'amber'}">📅</div>
        <div>
          <div class="stat-value" style="font-size:1.2rem;text-transform:capitalize">${todayAtt.charAt(0).toUpperCase()+todayAtt.slice(1)}</div>
          <div class="stat-label">Today's Status</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">🎟️</div>
        <div>
          <div class="stat-value">${passes.length}</div>
          <div class="stat-label">Total Passes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon amber">📣</div>
        <div>
          <div class="stat-value">${complaints.filter(c=>c.status==='pending').length}</div>
          <div class="stat-label">Open Complaints</div>
        </div>
      </div>
    </div>

    <!-- Student Info Card -->
    <div class="grid-2-col" style="margin-bottom:2rem">
      <div class="card">
        <div class="card-header"><div class="card-title">👤 My Profile</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem">
            <div style="width:56px;height:56px;border-radius:50%;background:var(--gradient-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700">${user.avatar||user.name.charAt(0)}</div>
            <div>
              <div style="font-weight:800;font-size:1.05rem;color:var(--text-main)">${user.name}</div>
              <div style="font-size:.8rem;color:var(--text-muted)">${user.email}</div>
            </div>
          </div>
          ${[['🎓 Roll No', user.rollNo||'—'], ['🏛️ Branch', user.branch||'—'], ['📚 Year', user.year||'—'], ['🏠 Room', `${user.block||''} / ${user.roomNo||'—'}`], ['📞 Phone', user.phone||'—']].map(([k,v])=>`
            <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border-light);font-size:.875rem">
              <span style="color:var(--text-muted)">${k}</span>
              <span style="font-weight:600;color:var(--text-main)">${v}</span>
            </div>
          `).join('')}
          <button class="btn btn-outline btn-sm" style="margin-top:1rem;width:100%" onclick="SettingsController.openSettingsModal('student')">✏️ Edit Profile</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">🎟️ Recent Passes</div></div>
        <div class="card-body" style="padding:0">
          ${passes.length===0 ? `<div class="empty-state" style="padding:2rem"><div class="empty-state-icon">🎟️</div><div class="empty-state-title">No passes yet</div></div>` :
          `<div class="table-responsive" style="border:none">
            <table class="data-table">
              <thead><tr><th>Type</th><th>Destination</th><th>Status</th></tr></thead>
              <tbody>
                ${passes.slice(0,4).map(p=>`
                  <tr>
                    <td><span class="pass-badge ${p.type}" style="font-size:.65rem">${p.type==='out-pass'?'Out':'Home'}</span></td>
                    <td style="font-size:.82rem;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.destination}</td>
                    <td><span class="badge badge-${p.status}" style="font-size:.65rem">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>`}
        </div>
      </div>
    </div>

    <!-- Notices -->
    <div class="card">
      <div class="card-header"><div class="card-title">📢 Hostel Notices</div></div>
      <div class="card-body">
        ${notices.map(n=>`
          <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border-light)">
            <div style="font-size:1.5rem">${n.type==='event'?'🎉':n.type==='warning'?'⚠️':'ℹ️'}</div>
            <div>
              <div style="font-weight:700;color:var(--text-main)">${n.title}</div>
              <div style="font-size:.83rem;color:var(--text-muted);margin-top:.25rem">${n.content}</div>
              <div style="font-size:.75rem;color:var(--text-light);margin-top:.4rem">📅 ${n.date}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    `;
  },

  // =====================================================================
  // PASS APPLICATION FORM (with ID card upload for out-pass)
  // =====================================================================
  renderPassForm(type) {
    const isOutPass = type === 'out-pass';
    const user = Auth.getCurrentUser();
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">${isOutPass ? '🚶 Apply for Out Pass' : '🏡 Apply for Home Pass'}</div>
        <div class="page-header-sub">${isOutPass ? 'Short leave from hostel (same/next day return)' : 'Extended leave to go home'}</div>
      </div>
    </div>
    <div class="card" style="max-width:680px">
      <div class="card-header"><div class="card-title">📝 Application Form</div></div>
      <div class="card-body">
        <form id="pass-form" onsubmit="StudentController.submitPass(event, '${type}')">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Student Name</label>
              <input class="form-input" type="text" value="${user.name}" readonly style="opacity:.7">
            </div>
            <div class="form-group">
              <label class="form-label">Roll No. / Room</label>
              <input class="form-input" type="text" value="${user.rollNo||'—'} · ${user.roomNo||'—'}" readonly style="opacity:.7">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Destination / Address *</label>
            <input class="form-input" type="text" id="pf-destination" placeholder="${isOutPass ? 'e.g. City Hospital, MG Road' : 'Your home address'}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Reason / Purpose *</label>
            <textarea class="form-textarea" id="pf-purpose" rows="3" placeholder="Briefly explain the reason for the pass..." required style="resize:vertical;min-height:80px"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">From Date *</label>
              <input class="form-input" type="date" id="pf-from" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label class="form-label">${isOutPass ? 'Return Date *' : 'Return Date *'}</label>
              <input class="form-input" type="date" id="pf-to" required min="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Expected Return Time</label>
            <input class="form-input" type="time" id="pf-return-time" value="18:00">
          </div>

          ${isOutPass ? `
          <!-- ID CARD UPLOAD (required for out pass) -->
          <div class="form-group">
            <label class="form-label">📷 College ID Card Photo <span style="color:var(--color-danger)">*</span></label>
            <div class="file-upload-area" id="id-upload-area">
              <input type="file" id="pf-id-card" accept="image/jpeg,image/png,image/jpg,image/webp" onchange="StudentController.previewIdCard(this)">
              <div id="id-upload-placeholder">
                <div style="font-size:2rem;margin-bottom:.5rem">📷</div>
                <div style="font-weight:700;margin-bottom:.25rem">Upload College ID Card</div>
                <div style="font-size:.8rem">Click or drag a photo here · JPG, PNG, WEBP accepted</div>
              </div>
              <img id="id-card-preview" class="file-preview" style="display:none" alt="ID Card Preview">
            </div>
            <p class="input-help">⚠️ Photo of your college-issued ID card is required for Out Pass. The Warden will review it.</p>
          </div>
          ` : ''}

          <div id="pass-error" style="display:none;color:var(--color-danger);font-size:.85rem;padding:.7rem 1rem;border-radius:var(--radius-md);background:var(--color-danger-light);margin-bottom:1rem"></div>
          <div style="display:flex;gap:.75rem;justify-content:flex-end;padding-top:.75rem;border-top:1px solid var(--border-light);margin-top:.5rem">
            <button type="reset" class="btn btn-secondary" onclick="document.getElementById('id-card-preview').style.display='none';document.getElementById('id-upload-placeholder').style.display='block'">Reset</button>
            <button type="submit" class="btn btn-primary">🚀 Submit Application</button>
          </div>
        </form>
      </div>
    </div>
    `;
  },

  previewIdCard(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Toast.error('Please upload an image file (JPG, PNG, WEBP).');
      input.value = ''; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Toast.error('Image is too large. Maximum size is 5MB.');
      input.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('id-card-preview');
      const placeholder = document.getElementById('id-upload-placeholder');
      if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
      if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  },

  submitPass(e, type) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    const errEl = document.getElementById('pass-error');
    errEl.style.display = 'none';

    const destination = document.getElementById('pf-destination').value.trim();
    const purpose     = document.getElementById('pf-purpose').value.trim();
    const fromDate    = document.getElementById('pf-from').value;
    const toDate      = document.getElementById('pf-to').value;
    const returnTime  = document.getElementById('pf-return-time').value;

    if (!destination || !purpose || !fromDate || !toDate) {
      errEl.textContent = 'Please fill in all required fields.';
      errEl.style.display = 'block'; return;
    }
    if (toDate < fromDate) {
      errEl.textContent = 'Return date cannot be before the start date.';
      errEl.style.display = 'block'; return;
    }

    // Handle ID card image
    let idCardImage = null;
    if (type === 'out-pass') {
      const fileInput = document.getElementById('pf-id-card');
      const preview   = document.getElementById('id-card-preview');
      if (!fileInput || !fileInput.files[0]) {
        errEl.textContent = 'Please upload your College ID Card photo (required for Out Pass).';
        errEl.style.display = 'block'; return;
      }
      idCardImage = preview ? preview.src : null;
    }

    const pass = {
      id:          Storage.generateId('pass'),
      studentId:   user.id,
      studentName: user.name,
      rollNo:      user.rollNo || '',
      roomNo:      user.roomNo || '',
      type,
      destination,
      purpose,
      fromDate,
      toDate,
      returnTime,
      status:      'pending',
      idCardImage,
      wardenNote:  '',
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };

    Storage.createPass(pass);
    Toast.success('Pass application submitted! Awaiting Warden approval.');
    StudentController.switchTab('mypasses');
  },

  // =====================================================================
  // MY PASSES
  // =====================================================================
  renderMyPasses() {
    const user   = Auth.getCurrentUser();
    const passes = Storage.getPassesByStudent(user.id);
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">🎟️ My Passes</div>
        <div class="page-header-sub">${passes.length} total pass application${passes.length!==1?'s':''}</div>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-outline btn-sm" onclick="StudentController.switchTab('outpass')">🚶 New Out Pass</button>
        <button class="btn btn-outline btn-sm" onclick="StudentController.switchTab('homepass')">🏡 New Home Pass</button>
      </div>
    </div>
    ${passes.length===0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">🎟️</div>
        <div class="empty-state-title">No passes yet</div>
        <p>Apply for an Out Pass or Home Pass using the menu.</p>
        <div style="display:flex;gap:.75rem;justify-content:center;margin-top:1rem">
          <button class="btn btn-primary" onclick="StudentController.switchTab('outpass')">Apply Now</button>
        </div>
      </div>
    ` : passes.map(p => `
    <div class="card" style="margin-bottom:1rem">
      <div class="card-body">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem">
          <div>
            <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.65rem">
              <span class="pass-badge ${p.type}">${p.type==='out-pass'?'🚶 Out Pass':'🏠 Home Pass'}</span>
              <span class="badge badge-${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span>
            </div>
            <div style="font-weight:700;color:var(--text-main);margin-bottom:.3rem">📍 ${p.destination}</div>
            <div style="font-size:.83rem;color:var(--text-muted);margin-bottom:.2rem">📅 ${p.fromDate} → ${p.toDate} · Return by ${p.returnTime}</div>
            <div style="font-size:.83rem;color:var(--text-muted)">📋 ${p.purpose}</div>
            ${p.idCardImage ? `<div style="font-size:.78rem;color:var(--color-success);font-weight:600;margin-top:.35rem">📷 ID Card uploaded ✓</div>` : ''}
            ${p.wardenNote && p.status!=='pending' ? `<div style="margin-top:.5rem;font-size:.82rem;padding:.5rem .85rem;background:${p.status==='approved'?'var(--color-success-light)':'var(--color-danger-light)'};border-radius:var(--radius-md);color:${p.status==='approved'?'var(--color-success)':'var(--color-danger)'}">📝 Warden: ${p.wardenNote}</div>` : ''}
          </div>
          <div style="display:flex;flex-direction:column;gap:.5rem;align-items:flex-end">
            <button class="btn btn-sm btn-outline" onclick="StudentController.viewPassTicket('${p.id}')">View Pass</button>
            <span style="font-size:.73rem;color:var(--text-light)">Applied ${new Date(p.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
    `).join('')}
    `;
  },

  viewPassTicket(id) {
    const p = Storage.getPassById(id);
    if (!p) return;
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'pass-ticket-modal';
    modal.innerHTML = `
    <div class="modal" style="max-width:600px">
      <div class="modal-header">
        <div class="modal-title">🎟️ Your Gate Pass</div>
        <button class="modal-close" onclick="document.getElementById('pass-ticket-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        ${p.status !== 'approved' ? `
          <div style="padding:.75rem 1rem;border-radius:var(--radius-md);background:var(--color-warning-light);border:1px solid var(--color-warning-glow);font-size:.85rem;margin-bottom:1.25rem;text-align:center">
            ⚠️ This pass is <strong>${p.status}</strong>. A gate pass ticket is only valid after Warden approval.
          </div>
        ` : ''}
        <div class="gate-pass-ticket">
          <div class="gate-pass-header">
            <div>
              <div style="font-size:.68rem;text-transform:uppercase;color:#94a3b8;letter-spacing:.06em">HostelEase Official Pass</div>
              <div style="font-size:1.15rem;font-weight:800;margin-top:.2rem">${p.type==='out-pass'?'🚶 OUT PASS':'🏠 HOME PASS'}</div>
            </div>
            <span class="badge badge-${p.status}">${p.status.toUpperCase()}</span>
          </div>
          <div class="gate-pass-body">
            <div class="gate-pass-details">
              <div><div class="detail-label">Student Name</div><div class="detail-val">${p.studentName}</div></div>
              <div><div class="detail-label">Roll Number</div><div class="detail-val">${p.rollNo||'—'}</div></div>
              <div><div class="detail-label">Room No.</div><div class="detail-val">${p.roomNo||'—'}</div></div>
              <div><div class="detail-label">Destination</div><div class="detail-val" style="font-size:.82rem">${p.destination}</div></div>
              <div><div class="detail-label">From Date</div><div class="detail-val">${p.fromDate}</div></div>
              <div><div class="detail-label">Return By</div><div class="detail-val">${p.toDate} ${p.returnTime}</div></div>
            </div>
            <div class="qr-placeholder">
              <div class="qr-matrix">${generateQR()}</div>
            </div>
          </div>
          <div class="gate-pass-footer">
            <div>Applied: ${new Date(p.createdAt).toLocaleDateString('en-IN')}</div>
            ${p.status==='approved' ? `<div class="warden-seal">✅ Warden Authorized</div>` : `<div style="color:#ef4444;font-weight:700">Pending Approval</div>`}
          </div>
        </div>
        ${p.idCardImage && p.status === 'approved' ? `
          <div style="margin-top:1.25rem;text-align:center">
            <div style="font-weight:700;margin-bottom:.75rem;font-size:.9rem">📷 Uploaded ID Card</div>
            <img src="${p.idCardImage}" style="max-width:100%;max-height:180px;border-radius:var(--radius-md);border:2px solid var(--color-success);object-fit:contain;display:inline-block">
          </div>
        ` : ''}
        ${p.wardenNote ? `
          <div style="margin-top:1rem;background:var(--color-${p.status==='approved'?'success':'danger'}-light);border:1px solid var(--color-${p.status==='approved'?'success':'danger'});border-radius:var(--radius-md);padding:1rem">
            <div style="font-weight:700;color:var(--color-${p.status==='approved'?'success':'danger'})">📝 Warden Note</div>
            <div style="font-size:.9rem;color:var(--text-main);margin-top:.3rem">${p.wardenNote}</div>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('pass-ticket-modal').remove()">Close</button>
      </div>
    </div>
    `;
    document.body.appendChild(modal);
  },

  // =====================================================================
  // ATTENDANCE
  // =====================================================================
  renderAttendance() {
    const user   = Auth.getCurrentUser();
    const att    = Storage.getStudentAttendance(user.id);
    const entries = Object.entries(att).sort((a,b)=>b[0].localeCompare(a[0]));
    const total   = entries.length;
    const present = entries.filter(([,v])=>v==='present').length;
    const absent  = entries.filter(([,v])=>v==='absent').length;
    const leave   = entries.filter(([,v])=>v==='leave').length;
    const pct     = total ? Math.round((present/total)*100) : 0;

    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">📋 My Attendance</div>
        <div class="page-header-sub">Last ${total} days record</div>
      </div>
    </div>
    <div class="attendance-summary-banner" style="--att-percent:${pct}">
      <div class="attendance-gauge">
        <div class="attendance-gauge-inner">
          <div class="att-val-num">${pct}%</div>
          <div class="att-val-label">Overall</div>
        </div>
      </div>
      <div>
        <div style="font-size:.8rem;text-transform:uppercase;color:#94a3b8;letter-spacing:.06em;margin-bottom:.75rem">Attendance Summary</div>
        <div class="att-stats-row">
          <div class="att-stat-box"><div class="att-stat-num">${total}</div><div class="att-stat-lbl">Total Days</div></div>
          <div class="att-stat-box"><div class="att-stat-num" style="color:#34d399">${present}</div><div class="att-stat-lbl">Present</div></div>
          <div class="att-stat-box"><div class="att-stat-num" style="color:#f87171">${absent}</div><div class="att-stat-lbl">Absent</div></div>
          <div class="att-stat-box"><div class="att-stat-num" style="color:#60a5fa">${leave}</div><div class="att-stat-lbl">Leave</div></div>
        </div>
        ${pct < 75 ? `<div style="margin-top:1rem;padding:.6rem 1rem;background:rgba(239,68,68,.15);border-radius:var(--radius-md);font-size:.8rem;color:#fca5a5;font-weight:600">⚠️ Your attendance is below 75%. Please attend classes regularly.</div>` : `<div style="margin-top:1rem;padding:.6rem 1rem;background:rgba(16,185,129,.15);border-radius:var(--radius-md);font-size:.8rem;color:#6ee7b7;font-weight:600">✅ Good attendance! Keep it up.</div>`}
      </div>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead><tr><th>Date</th><th>Day</th><th>Status</th></tr></thead>
        <tbody>
          ${entries.slice(0,30).map(([date, status])=>`
            <tr>
              <td>${new Date(date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
              <td style="color:var(--text-muted)">${new Date(date).toLocaleDateString('en-IN',{weekday:'long'})}</td>
              <td><span class="badge badge-${status==='present'?'approved':status==='absent'?'rejected':'in-progress'}">${status.charAt(0).toUpperCase()+status.slice(1)}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    `;
  },

  // =====================================================================
  // MESS MENU
  // =====================================================================
  renderMessMenu() {
    const menu = Storage.getMessMenu();
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const today = days[new Date().getDay()===0?6:new Date().getDay()-1];
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">🍽️ Weekly Mess Menu</div>
        <div class="page-header-sub">Today: ${today}</div>
      </div>
    </div>
    <div class="meal-day-pills" id="day-pills">
      ${days.map(d=>`<button class="meal-day-btn ${d===today?'active':''}" onclick="StudentController.showDay('${d}',this)">${d}</button>`).join('')}
    </div>
    <div id="menu-day-display">${StudentController.renderMenuDay(menu[today])}</div>
    `;
  },
  showDay(day, btn) {
    document.querySelectorAll('#day-pills .meal-day-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('menu-day-display').innerHTML = StudentController.renderMenuDay(Storage.getMessMenu()[day]);
  },
  renderMenuDay(dayMenu) {
    if (!dayMenu) return '<div class="empty-state"><div class="empty-state-icon">🍽️</div><div class="empty-state-title">Menu not available</div></div>';
    const meals = [
      {key:'breakfast',icon:'🌅',label:'Breakfast'},
      {key:'lunch',    icon:'☀️', label:'Lunch'},
      {key:'snacks',   icon:'🍵',label:'Evening Snacks'},
      {key:'dinner',   icon:'🌙',label:'Dinner'},
    ];
    const typeColor = {veg:'#10b981','non-veg':'#ef4444',special:'#f59e0b'};
    const typeLabel = {veg:'🟢 Vegetarian','non-veg':'🔴 Non-Vegetarian',special:'⭐ Special'};
    return `
    <div class="meal-cards-grid">
      ${meals.map(m=>{
        const meal = dayMenu[m.key]||{items:[],type:'veg',time:'—'};
        return `
        <div class="meal-card">
          <div class="meal-card-header">
            <h3>${m.icon} ${m.label}</h3>
            <span class="meal-timing">${meal.time}</span>
          </div>
          <div class="meal-card-body">
            ${meal.items.map(item=>`
              <div style="display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.45rem">
                <div class="diet-dot diet-${meal.type}" style="margin-top:7px"></div>
                <span style="font-size:.9rem;color:var(--text-main)">${item}</span>
              </div>
            `).join('')}
          </div>
          <div class="meal-card-footer">
            <span style="font-size:.76rem;color:var(--text-muted)">${meal.items.length} items</span>
            <span style="font-size:.76rem;font-weight:700;color:${typeColor[meal.type]||'#64748b'}">${typeLabel[meal.type]||'—'}</span>
          </div>
        </div>
        `;
      }).join('')}
    </div>
    `;
  },

  // =====================================================================
  // RAISE COMPLAINT
  // =====================================================================
  renderComplaint() {
    const user = Auth.getCurrentUser();
    const myComplaints = Storage.getComplaintsByStudent(user.id);
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">📣 Raise a Complaint</div>
        <div class="page-header-sub">Submit issues related to hostel facilities, food, or other concerns.</div>
      </div>
    </div>
    <div class="grid-2-col">
      <div class="card">
        <div class="card-header"><div class="card-title">📝 New Complaint</div></div>
        <div class="card-body">
          <form onsubmit="StudentController.submitComplaint(event)">
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="cf-category" required>
                <option value="">Select category...</option>
                ${['Infrastructure','Mess & Food','Cleanliness','Electrical','Water Supply','Security','Roommate Issue','Other'].map(c=>`<option>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Complaint Title *</label>
              <input class="form-input" type="text" id="cf-title" placeholder="Brief title of the issue" required>
            </div>
            <div class="form-group">
              <label class="form-label">Detailed Description *</label>
              <textarea class="form-textarea" id="cf-desc" rows="5" placeholder="Describe the issue in detail..." required style="resize:vertical;min-height:120px"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">📤 Submit Complaint</button>
          </form>
        </div>
      </div>
      <div>
        <div class="section-header"><div class="section-title">📋 My Complaints</div></div>
        ${myComplaints.length===0 ? `<div class="empty-state"><div class="empty-state-icon">📣</div><div class="empty-state-title">No complaints yet</div></div>` :
          myComplaints.map(c=>`
          <div class="complaint-card" style="margin-bottom:1rem">
            <div class="complaint-header">
              <div>
                <div class="complaint-title">${c.title}</div>
                <div class="complaint-meta">📂 ${c.category} · 📅 ${new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
              <span class="badge badge-${c.status}">${c.status.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
            </div>
            <div class="complaint-body" style="font-size:.85rem">${c.description}</div>
            ${c.adminNote ? `<div style="margin-top:.6rem;padding:.55rem .85rem;background:var(--color-success-light);border-radius:var(--radius-md);font-size:.82rem;color:var(--color-success);font-weight:600">📝 Warden: ${c.adminNote}</div>` : ''}
          </div>
          `).join('')}
      </div>
    </div>
    `;
  },

  submitComplaint(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    const category    = document.getElementById('cf-category').value;
    const title       = document.getElementById('cf-title').value.trim();
    const description = document.getElementById('cf-desc').value.trim();
    if (!category || !title || !description) { Toast.error('Please fill in all fields.'); return; }

    const complaint = {
      id:          Storage.generateId('comp'),
      studentId:   user.id,
      studentName: user.name,
      rollNo:      user.rollNo || '',
      roomNo:      user.roomNo || '',
      category,
      title,
      description,
      status:      'pending',
      adminNote:   '',
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };
    Storage.createComplaint(complaint);
    Toast.success('Complaint submitted! The Warden has been notified.');
    StudentController.switchTab('complaint');
  },

  init() {
    // Nothing extra needed
  },
};

window.StudentController = StudentController;
