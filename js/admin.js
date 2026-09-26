// ============================================================
// HOSTELEASE - ADMIN / WARDEN CONTROLLER
// ============================================================

const AdminController = {
  activeTab: 'dashboard',

  render() {
    const user = Auth.getCurrentUser();
    return `
    <div class="dashboard-wrapper">
      ${AdminController.renderSidebar(user)}
      <div class="dashboard-main">
        ${AdminController.renderTopbar(user)}
        <div class="page-content" id="admin-content">
          ${AdminController.renderDashboard()}
        </div>
      </div>
    </div>
    <!-- Mobile Bottom Navigation Bar -->
    <nav class="mobile-bottom-nav">
      <button class="mobile-nav-btn active" id="ambnav-dashboard" onclick="AdminController.switchTab('dashboard')">
        <span class="mobile-nav-icon">📊</span>
        <span>Overview</span>
      </button>
      <button class="mobile-nav-btn" id="ambnav-students" onclick="AdminController.switchTab('students')">
        <span class="mobile-nav-icon">👥</span>
        <span>Students</span>
      </button>
      <button class="mobile-nav-btn" id="ambnav-passes" onclick="AdminController.switchTab('passes')">
        <span class="mobile-nav-icon">🎟️</span>
        <span>Passes</span>
      </button>
      <button class="mobile-nav-btn" id="ambnav-attendance" onclick="AdminController.switchTab('attendance')">
        <span class="mobile-nav-icon">📋</span>
        <span>Attendance</span>
      </button>
      <button class="mobile-nav-btn" id="ambnav-complaints" onclick="AdminController.switchTab('complaints')">
        <span class="mobile-nav-icon">📣</span>
        <span>Complaints</span>
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
            <div class="sidebar-logo-sub">Warden Portal</div>
          </div>
        </div>
        <button class="sidebar-close-btn" onclick="App.closeSidebar()" aria-label="Close menu">✕</button>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-avatar" style="background:linear-gradient(135deg,#6366f1,#8b5cf6)">
          ${user.avatar || user.name.charAt(0)}
        </div>
        <div>
          <div class="sidebar-user-name">${user.name}</div>
          <div class="sidebar-user-role">${user.designation || 'Warden'}</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <span class="sidebar-section-label">Overview</span>
        <div class="nav-item active" id="anav-dashboard" onclick="AdminController.switchTab('dashboard')">
          <span class="nav-item-icon">📊</span> Dashboard
        </div>
        <span class="sidebar-section-label">Student Management</span>
        <div class="nav-item" id="anav-register" onclick="AdminController.switchTab('register')">
          <span class="nav-item-icon">➕</span> Register Student
        </div>
        <div class="nav-item" id="anav-students" onclick="AdminController.switchTab('students')">
          <span class="nav-item-icon">👥</span> All Students
        </div>
        <div class="nav-item" id="anav-attendance" onclick="AdminController.switchTab('attendance')">
          <span class="nav-item-icon">📋</span> Attendance
        </div>
        <span class="sidebar-section-label">Gate Passes</span>
        <div class="nav-item" id="anav-passes" onclick="AdminController.switchTab('passes')">
          <span class="nav-item-icon">🎟️</span> Pass Requests
          <span class="nav-item-badge" id="anav-passes-badge" style="display:none">0</span>
        </div>
        <span class="sidebar-section-label">Communication</span>
        <div class="nav-item" id="anav-complaints" onclick="AdminController.switchTab('complaints')">
          <span class="nav-item-icon">📣</span> Complaints
          <span class="nav-item-badge" id="anav-comp-badge" style="display:none">0</span>
        </div>
        <div class="nav-item" id="anav-menu" onclick="AdminController.switchTab('menu')">
          <span class="nav-item-icon">🍽️</span> Mess Menu
        </div>
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" onclick="App.closeSidebar(); SettingsController.openSettingsModal('admin')">
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
        <span class="topbar-title" id="admin-topbar-title">📊 Dashboard</span>
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
    AdminController.activeTab = tab;
    App.closeSidebar();
    document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById(`anav-${tab}`);
    if (navEl) navEl.classList.add('active');

    // Update bottom nav
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === `ambnav-${tab}`);
    });

    const titles = {
      dashboard:  '📊 Dashboard',
      register:   '➕ Register New Student',
      students:   '👥 All Students',
      attendance: '📋 Attendance',
      passes:     '🎟️ Pass Requests',
      complaints: '📣 Complaints',
      menu:       '🍽️ Mess Menu',
    };
    const titleEl = document.getElementById('admin-topbar-title');
    if (titleEl) titleEl.textContent = titles[tab] || '';

    const content = document.getElementById('admin-content');
    const map = {
      dashboard:  AdminController.renderDashboard,
      register:   AdminController.renderRegisterStudent,
      students:   AdminController.renderStudents,
      attendance: AdminController.renderAttendance,
      passes:     AdminController.renderPasses,
      complaints: AdminController.renderComplaints,
      menu:       AdminController.renderMessMenu,
    };
    if (map[tab]) content.innerHTML = `<div class="animate-fade-in">${map[tab]()}</div>`;
  },

  // =====================================================================
  // DASHBOARD
  // =====================================================================
  renderDashboard() {
    const students   = Storage.getApprovedStudents();
    const passes     = Storage.getPasses();
    const complaints = Storage.getComplaints();
    const pending    = passes.filter(p => p.status === 'pending').length;
    const openComp   = complaints.filter(c => c.status === 'pending').length;
    const notices    = Storage.getNotices();

    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">Good ${AdminController.greeting()}, Warden! 👋</div>
        <div class="page-header-sub">Here's what's happening in the hostel today.</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon indigo">👥</div>
        <div><div class="stat-value">${students.length}</div><div class="stat-label">Total Students</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon amber">⏳</div>
        <div><div class="stat-value">${pending}</div><div class="stat-label">Pending Passes</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon emerald">✅</div>
        <div><div class="stat-value">${passes.filter(p=>p.status==='approved').length}</div><div class="stat-label">Approved Passes</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon rose">📣</div>
        <div><div class="stat-value">${openComp}</div><div class="stat-label">Open Complaints</div></div>
      </div>
    </div>

    ${pending > 0 ? `
    <div class="notice-card" style="border-color:var(--color-warning);background:var(--color-warning-light)">
      <div>
        <strong style="color:var(--color-warning)">⚠️ ${pending} pass request${pending>1?'s':''} awaiting your approval!</strong>
        <div style="font-size:.82rem;color:var(--text-muted);margin-top:.2rem">Students are waiting for gate pass approval.</div>
      </div>
      <button class="btn btn-warning btn-sm" onclick="AdminController.switchTab('passes')">Review Now →</button>
    </div>
    ` : ''}

    <div class="grid-2-col">
      <div class="card">
        <div class="card-header"><div class="card-title">📋 Recent Pass Requests</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-responsive" style="border:none">
            <table class="data-table">
              <thead><tr><th>Student</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                ${passes.slice(0,5).map(p=>`
                  <tr>
                    <td><div style="font-weight:600;font-size:.9rem">${p.studentName}</div><div style="font-size:.75rem;color:var(--text-muted)">${p.roomNo||''}</div></td>
                    <td><span class="pass-badge ${p.type}">${p.type==='out-pass'?'Out':'Home'}</span></td>
                    <td><span class="badge badge-${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
                  </tr>
                `).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem">No passes yet</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">📣 Recent Complaints</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-responsive" style="border:none">
            <table class="data-table">
              <thead><tr><th>Student</th><th>Category</th><th>Status</th></tr></thead>
              <tbody>
                ${complaints.slice(0,5).map(c=>`
                  <tr>
                    <td><div style="font-weight:600;font-size:.9rem">${c.studentName||'Unknown'}</div><div style="font-size:.75rem;color:var(--text-muted)">${c.roomNo||''}</div></td>
                    <td style="font-size:.82rem">${c.category}</td>
                    <td><span class="badge badge-${c.status}">${c.status.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())}</span></td>
                  </tr>
                `).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:2rem">No complaints</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1.5rem">
      <div class="card-header"><div class="card-title">📢 Hostel Notices</div></div>
      <div class="card-body">
        ${notices.map(n => `
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
  // REGISTER NEW STUDENT (Warden only)
  // =====================================================================
  renderRegisterStudent() {
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">➕ Register New Student</div>
        <div class="page-header-sub">Create a student account. The student can login immediately after registration.</div>
      </div>
    </div>
    <div class="card" style="max-width:720px">
      <div class="card-header"><div class="card-title">📝 Student Registration Form</div></div>
      <div class="card-body">
        <form id="reg-form" onsubmit="AdminController.registerStudent(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input class="form-input" id="rf-name" type="text" placeholder="e.g. Arjun Sharma" required>
            </div>
            <div class="form-group">
              <label class="form-label">Roll Number *</label>
              <input class="form-input" id="rf-roll" type="text" placeholder="e.g. CS21B055" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input class="form-input" id="rf-email" type="email" placeholder="student@college.edu" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input class="form-input" id="rf-password" type="text" placeholder="Min 6 characters" required minlength="6">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Branch / Department *</label>
              <input class="form-input" id="rf-branch" type="text" placeholder="e.g. Computer Science" required>
            </div>
            <div class="form-group">
              <label class="form-label">Year *</label>
              <select class="form-select" id="rf-year" required>
                <option value="">Select Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Room Number</label>
              <input class="form-input" id="rf-room" type="text" placeholder="e.g. 302">
            </div>
            <div class="form-group">
              <label class="form-label">Student Phone</label>
              <input class="form-input" id="rf-phone" type="tel" placeholder="10-digit mobile">
            </div>
          </div>
          <div id="reg-error" style="display:none;color:var(--color-danger);font-size:.85rem;padding:.7rem 1rem;border-radius:var(--radius-md);background:var(--color-danger-light);margin-bottom:1rem"></div>
          <div style="display:flex;gap:.75rem;justify-content:flex-end;padding-top:.5rem;border-top:1px solid var(--border-light);margin-top:.5rem">
            <button type="reset" class="btn btn-secondary">Reset</button>
            <button type="submit" class="btn btn-primary">✅ Register Student</button>
          </div>
        </form>
      </div>
    </div>
    `;
  },

  async registerStudent(e) {
    e.preventDefault();
    const errEl = document.getElementById('reg-error');
    errEl.style.display = 'none';

    const email = document.getElementById('rf-email').value.trim();
    if (Storage.getUserByEmail(email)) {
      errEl.textContent = 'A user with this email already exists.';
      errEl.style.display = 'block'; return;
    }
    const name = document.getElementById('rf-name').value.trim();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Registering & Sending Email…'; }

    const newStudent = {
      id:          Storage.generateId('u_stu'),
      name,
      email,
      password:    document.getElementById('rf-password').value,
      role:        'student',
      status:      'approved', // Auto-approved by warden
      rollNo:      document.getElementById('rf-roll').value.trim(),
      branch:      document.getElementById('rf-branch').value.trim(),
      year:        document.getElementById('rf-year').value,
      roomNo:      document.getElementById('rf-room').value.trim(),
      phone:       document.getElementById('rf-phone').value.trim(),
      avatar:      name.charAt(0).toUpperCase(),
      createdAt:   new Date().toISOString(),
    };

    let emailDelivery = null;

    if (window.API && API.isOnline) {
      try {
        const resp = await API.post('/students/register', newStudent);
        if (resp && resp.id) newStudent.id = resp.id;
        if (resp && resp.email_delivery) emailDelivery = resp.email_delivery;
      } catch (err) {
        console.warn('Backend registration failed, saving locally:', err);
      }
    }

    // Save to local storage
    const users = Storage.getUsers();
    users.push(newStudent);
    Storage.saveUsers(users);

    Toast.success(`Student "${name}" registered successfully! Email notification dispatched.`);
    document.getElementById('reg-form').reset();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '✅ Register Student'; }

    // Display Email Received Preview Modal
    AdminController.showEmailModal(newStudent, emailDelivery);
  },

  showEmailModal(student, delivery) {
    const isLive = delivery && delivery.mode === 'live';
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'email-preview-modal';

    const fallbackHtml = `
      <div style="font-family:sans-serif;color:#1e293b;line-height:1.6">
        <h2 style="color:#6366f1;margin-top:0">Welcome to HostelEase, ${student.name}!</h2>
        <p>Your student account has been approved by the <strong>Chief Warden</strong>.</p>
        <div style="background:#f8fafc;padding:15px;border-radius:8px;border:1px solid #e2e8f0;margin:15px 0">
          <p style="margin:4px 0"><strong>Email:</strong> ${student.email}</p>
          <p style="margin:4px 0"><strong>Password:</strong> ${student.password}</p>
          <p style="margin:4px 0"><strong>Room:</strong> ${student.block} – Room ${student.roomNo}</p>
          <p style="margin:4px 0"><strong>Roll No:</strong> ${student.rollNo}</p>
        </div>
        <p>Login URL: <a href="http://localhost:3000" target="_blank" style="color:#6366f1">http://localhost:3000</a></p>
      </div>
    `;

    const emailContent = (delivery && delivery.html) ? delivery.html : fallbackHtml;

    modal.innerHTML = `
    <div class="modal animate-slide-up" style="max-width:680px;max-height:90vh;display:flex;flex-direction:column;padding:0;overflow:hidden">
      <div style="background:var(--bg-card);padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-light);display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:.6rem">
          <span style="font-size:1.5rem">✉️</span>
          <div>
            <h3 style="margin:0;font-size:1.1rem;font-weight:700;color:var(--text-main)">Student Registration Email</h3>
            <span style="font-size:.78rem;color:${isLive ? '#10b981' : 'var(--color-primary)'}">
              ${isLive ? '✅ Sent to student inbox via Live SMTP' : '⚡ Rendered Welcome Email (Inbox Preview)'}
            </span>
          </div>
        </div>
        <button class="btn btn-sm btn-ghost" onclick="document.getElementById('email-preview-modal').remove()">✕</button>
      </div>

      <div style="background:var(--bg-subtle);padding:.75rem 1.5rem;border-bottom:1px solid var(--border-light);font-size:.85rem;color:var(--text-muted);display:grid;grid-template-columns:auto 1fr;gap:.4rem 1rem">
        <strong>To:</strong> <span>${student.name} &lt;${student.email}&gt;</span>
        <strong>Subject:</strong> <span>Welcome to HostelEase – Your Hostel Account Credentials</span>
        <strong>Status:</strong> <span><span class="badge badge-approved">${isLive ? 'Delivered via SMTP' : 'Email Generated & Logged'}</span></span>
      </div>

      <div style="flex:1;overflow-y:auto;padding:1.5rem;background:#f8fafc">
        <div style="background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04)">
          <iframe id="email-frame" style="width:100%;height:460px;border:none" sandbox="allow-same-origin"></iframe>
        </div>
      </div>

      <div style="background:var(--bg-card);padding:1rem 1.5rem;border-top:1px solid var(--border-light);display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:.8rem;color:var(--text-muted)">Configure live SMTP in <code>backend/.env</code> for live inbox dispatch.</span>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('email-preview-modal').remove()">Done</button>
      </div>
    </div>
    `;

    document.body.appendChild(modal);

    const frame = document.getElementById('email-frame');
    if (frame) {
      setTimeout(() => {
        const doc = frame.contentWindow.document;
        doc.open();
        doc.write(emailContent);
        doc.close();
      }, 50);
    }
  },

  // =====================================================================
  // ALL STUDENTS
  // =====================================================================
  renderStudents() {
    const students = Storage.getStudents();
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">👥 All Students</div>
        <div class="page-header-sub">${students.length} student accounts registered</div>
      </div>
      <button class="btn btn-primary" onclick="AdminController.switchTab('register')">➕ Register New</button>
    </div>
    ${students.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <div class="empty-state-title">No students yet</div>
        <p>Use the "Register Student" option to add students.</p>
        <button class="btn btn-primary" style="margin-top:1rem" onclick="AdminController.switchTab('register')">➕ Register First Student</button>
      </div>
    ` : `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Branch / Year</th>
            <th>Room</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${students.map(s => `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:.75rem">
                  <div style="width:34px;height:34px;border-radius:50%;background:var(--gradient-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem;flex-shrink:0">${s.avatar||s.name.charAt(0)}</div>
                  <div>
                    <div style="font-weight:700">${s.name}</div>
                    <div style="font-size:.76rem;color:var(--text-muted)">${s.email}</div>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-tag">${s.rollNo||'—'}</span></td>
              <td><div style="font-size:.88rem">${s.branch||'—'}</div><div style="font-size:.76rem;color:var(--text-muted)">${s.year||'—'}</div></td>
              <td>${s.block ? `${s.block} · ` : ''}${s.roomNo ? `Room ${s.roomNo}` : '—'}</td>
              <td><span class="badge badge-${s.status==='approved'?'approved':'pending'}">${s.status==='approved'?'Active':'Pending'}</span></td>
              <td>
                <div style="display:flex;gap:.4rem">
                  <button class="btn btn-sm btn-outline" onclick="AdminController.viewStudent('${s.id}')">View</button>
                  <button class="btn btn-sm btn-danger" onclick="AdminController.deleteStudent('${s.id}','${s.name}')">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    `}
    `;
  },

  viewStudent(id) {
    const s = Storage.getUserById(id);
    if (!s) return;
    const passes = Storage.getPassesByStudent(id);
    const complaints = Storage.getComplaints().filter(c=>c.studentId===id);

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'view-student-modal';
    modal.innerHTML = `
    <div class="modal" style="max-width:560px">
      <div class="modal-header">
        <div class="modal-title">👤 Student Profile</div>
        <button class="modal-close" onclick="document.getElementById('view-student-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding:1rem;background:var(--bg-subtle);border-radius:var(--radius-lg)">
          <div style="width:60px;height:60px;border-radius:50%;background:var(--gradient-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:700">${s.avatar||s.name.charAt(0)}</div>
          <div>
            <div style="font-size:1.25rem;font-weight:800;color:var(--text-main)">${s.name}</div>
            <div style="color:var(--text-muted);font-size:.875rem">${s.email}</div>
            <span class="badge badge-${s.status==='approved'?'approved':'pending'}" style="margin-top:.35rem">${s.status==='approved'?'Active':'Pending'}</span>
          </div>
        </div>
        <div class="grid-2-col-sm" style="font-size:.875rem">
          ${[
            ['Roll No', s.rollNo||'—'],
            ['Branch', s.branch||'—'],
            ['Year', s.year||'—'],
            ['Room', s.roomNo ? `Room ${s.roomNo}` : '—'],
            ['Phone', s.phone||'—'],
            ...(s.block ? [['Block', s.block]] : []),
            ...(s.parentPhone ? [['Parent Phone', s.parentPhone]] : [])
          ].map(([k,v])=>`
            <div style="background:var(--bg-subtle);padding:.7rem 1rem;border-radius:var(--radius-md);border:1px solid var(--border-light)">
              <div style="font-size:.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em">${k}</div>
              <div style="font-weight:700;color:var(--text-main);margin-top:.2rem">${v}</div>
            </div>
          `).join('')}
        </div>
        <div class="grid-2-col-sm" style="margin-top:.75rem;text-align:center">
          <div style="background:var(--color-primary-light);padding:.85rem;border-radius:var(--radius-md)">
            <div style="font-size:1.5rem;font-weight:800;color:var(--color-primary)">${passes.length}</div>
            <div style="font-size:.75rem;color:var(--text-muted)">Total Passes</div>
          </div>
          <div style="background:var(--color-warning-light);padding:.85rem;border-radius:var(--radius-md)">
            <div style="font-size:1.5rem;font-weight:800;color:var(--color-warning)">${complaints.length}</div>
            <div style="font-size:.75rem;color:var(--text-muted)">Complaints</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('view-student-modal').remove()">Close</button>
      </div>
    </div>
    `;
    document.body.appendChild(modal);
  },

  deleteStudent(id, name) {
    if (!confirm(`Are you sure you want to delete student "${name}"? This cannot be undone.`)) return;
    Storage.deleteUser(id);
    Toast.warning(`Student "${name}" removed.`);
    AdminController.switchTab('students');
  },

  // =====================================================================
  // PASS REQUESTS
  // =====================================================================
  renderPasses() {
    const passes = Storage.getPasses();
    const pending = passes.filter(p=>p.status==='pending');

    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">🎟️ Gate Pass Requests</div>
        <div class="page-header-sub">${pending.length} pending approval</div>
      </div>
    </div>
    ${pending.length > 0 ? `
    <div class="notice-card">
      <div><strong style="color:var(--color-primary)">⏳ ${pending.length} request${pending.length>1?'s':''} awaiting your review.</strong></div>
    </div>
    ` : ''}
    <div class="tab-nav">
      <button class="tab-btn active" id="pass-tab-all" onclick="AdminController.filterPasses('all', this)">All (${passes.length})</button>
      <button class="tab-btn" id="pass-tab-pending" onclick="AdminController.filterPasses('pending', this)">Pending (${pending.length})</button>
      <button class="tab-btn" id="pass-tab-approved" onclick="AdminController.filterPasses('approved', this)">Approved</button>
      <button class="tab-btn" id="pass-tab-rejected" onclick="AdminController.filterPasses('rejected', this)">Rejected</button>
    </div>
    <div id="pass-list">
      ${AdminController.renderPassList(passes)}
    </div>
    `;
  },

  filterPasses(status, btn) {
    document.querySelectorAll('.tab-nav .tab-btn').forEach(b=>b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const all = Storage.getPasses();
    const filtered = status==='all' ? all : all.filter(p=>p.status===status);
    document.getElementById('pass-list').innerHTML = AdminController.renderPassList(filtered);
  },

  renderPassList(passes) {
    if (!passes.length) return `<div class="empty-state"><div class="empty-state-icon">🎟️</div><div class="empty-state-title">No passes found</div></div>`;
    return passes.map(p => `
    <div class="card" style="margin-bottom:1rem">
      <div class="card-body">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem">
          <div>
            <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.6rem">
              <span class="pass-badge ${p.type}">${p.type==='out-pass'?'🚶 Out Pass':'🏠 Home Pass'}</span>
              <span class="badge badge-${p.status}">${p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span>
            </div>
            <div style="font-weight:700;font-size:1rem;color:var(--text-main)">${p.studentName} &nbsp;·&nbsp; <span style="font-weight:500;font-size:.88rem;color:var(--text-muted)">${p.rollNo||''}</span></div>
            <div style="font-size:.85rem;color:var(--text-muted);margin-top:.25rem">📍 ${p.destination}</div>
            <div style="font-size:.82rem;color:var(--text-muted);margin-top:.2rem">📅 ${p.fromDate} → ${p.toDate} &nbsp;·&nbsp; Room: ${p.roomNo||'—'}</div>
            <div style="font-size:.82rem;color:var(--text-muted);margin-top:.2rem">📋 ${p.purpose}</div>
            ${p.idCardImage ? `<div style="margin-top:.5rem;font-size:.8rem;color:var(--color-success);font-weight:600">📷 ID Card uploaded</div>` : ''}
          </div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            <button class="btn btn-sm btn-outline" onclick="AdminController.viewPassDetail('${p.id}')">View Details</button>
            ${p.status==='pending' ? `
              <button class="btn btn-sm btn-success" onclick="AdminController.updatePassStatus('${p.id}','approved')">✅ Approve</button>
              <button class="btn btn-sm btn-danger"  onclick="AdminController.updatePassStatus('${p.id}','rejected')">❌ Reject</button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
    `).join('');
  },

  updatePassStatus(id, status) {
    const note = status === 'rejected' ? (prompt('Reason for rejection (optional):') || '') : (prompt('Add a note (optional):') || '');
    Storage.updatePass(id, { status, wardenNote: note });
    Toast[status==='approved'?'success':'warning'](`Pass ${status}.`);
    AdminController.switchTab('passes');
  },

  viewPassDetail(id) {
    const pass = Storage.getPassById(id);
    if (!pass) return;
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'pass-detail-modal';
    modal.innerHTML = `
    <div class="modal" style="max-width:660px">
      <div class="modal-header">
        <div class="modal-title">🎟️ Pass Request Detail</div>
        <button class="modal-close" onclick="document.getElementById('pass-detail-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="gate-pass-ticket" style="margin-bottom:1.25rem">
          <div class="gate-pass-header">
            <div>
              <div style="font-size:.7rem;text-transform:uppercase;color:#94a3b8">HostelEase Official</div>
              <div style="font-size:1.1rem;font-weight:800;margin-top:.2rem">${pass.type==='out-pass'?'🚶 OUT PASS':'🏠 HOME PASS'}</div>
            </div>
            <span class="badge badge-${pass.status}">${pass.status.toUpperCase()}</span>
          </div>
          <div class="gate-pass-body">
            <div class="gate-pass-details">
              <div><div class="detail-label">Student</div><div class="detail-val">${pass.studentName}</div></div>
              <div><div class="detail-label">Roll No</div><div class="detail-val">${pass.rollNo||'—'}</div></div>
              <div><div class="detail-label">Room</div><div class="detail-val">${pass.roomNo||'—'}</div></div>
              <div><div class="detail-label">Destination</div><div class="detail-val" style="font-size:.82rem">${pass.destination}</div></div>
              <div><div class="detail-label">From → To</div><div class="detail-val">${pass.fromDate} → ${pass.toDate}</div></div>
              <div><div class="detail-label">Return By</div><div class="detail-val">${pass.returnTime||'—'}</div></div>
            </div>
            <div class="qr-placeholder"><div class="qr-matrix">${generateQR()}</div></div>
          </div>
          <div class="gate-pass-footer">
            <div>Applied: ${new Date(pass.createdAt).toLocaleDateString('en-IN')}</div>
            ${pass.status==='approved'?'<div class="warden-seal">✅ Warden Approved</div>':''}
          </div>
        </div>
        <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:1rem;margin-bottom:1rem">
          <div style="font-weight:700;margin-bottom:.35rem">📋 Purpose</div>
          <div style="color:var(--text-muted);font-size:.9rem">${pass.purpose}</div>
        </div>
        ${pass.idCardImage ? `
          <div class="card" style="padding:1rem;margin-bottom:1rem">
            <div style="font-weight:700;margin-bottom:.75rem">📷 College ID Card (Uploaded)</div>
            <img src="${pass.idCardImage}" alt="College ID" style="max-width:100%;max-height:220px;border-radius:var(--radius-md);border:2px solid var(--color-success);object-fit:contain;display:block;margin:auto">
          </div>
        ` : `<div style="padding:.75rem 1rem;background:var(--color-warning-light);border-radius:var(--radius-md);font-size:.82rem;color:var(--text-muted);margin-bottom:1rem">ℹ️ No ID card image uploaded by student.</div>`}
        ${pass.wardenNote ? `
          <div style="background:var(--color-success-light);border:1px solid var(--color-success);border-radius:var(--radius-md);padding:1rem">
            <div style="font-weight:700;color:var(--color-success)">📝 Warden Note</div>
            <div style="font-size:.9rem;color:var(--text-main);margin-top:.3rem">${pass.wardenNote}</div>
          </div>
        `:''}
      </div>
      <div class="modal-footer">
        ${pass.status==='pending' ? `
          <button class="btn btn-success" onclick="AdminController.updatePassStatus('${pass.id}','approved');document.getElementById('pass-detail-modal').remove()">✅ Approve</button>
          <button class="btn btn-danger"  onclick="AdminController.updatePassStatus('${pass.id}','rejected');document.getElementById('pass-detail-modal').remove()">❌ Reject</button>
        ` : ''}
        <button class="btn btn-secondary" onclick="document.getElementById('pass-detail-modal').remove()">Close</button>
      </div>
    </div>
    `;
    document.body.appendChild(modal);
  },

  // =====================================================================
  // COMPLAINTS (from all students)
  // =====================================================================
  renderComplaints() {
    const complaints = Storage.getComplaints();
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">📣 Student Complaints</div>
        <div class="page-header-sub">${complaints.length} total · ${complaints.filter(c=>c.status==='pending').length} pending</div>
      </div>
    </div>
    ${complaints.length === 0 ? `<div class="empty-state"><div class="empty-state-icon">📣</div><div class="empty-state-title">No complaints yet</div></div>` :
      complaints.map(c => `
      <div class="complaint-card">
        <div class="complaint-header">
          <div>
            <div class="complaint-title">${c.title}</div>
            <div class="complaint-meta">
              👤 <strong>${c.studentName||'Unknown'}</strong> &nbsp;·&nbsp; 
              🏠 Room: <strong>${c.roomNo||'—'}</strong> &nbsp;·&nbsp; 
              📅 ${new Date(c.createdAt).toLocaleDateString('en-IN')} &nbsp;·&nbsp;
              📂 ${c.category}
              ${c.rollNo ? `&nbsp;·&nbsp; 🎓 ${c.rollNo}` : ''}
            </div>
          </div>
          <span class="badge badge-${c.status}">${c.status.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
        </div>
        <div class="complaint-body">${c.description}</div>
        ${c.adminNote ? `<div style="margin-top:.75rem;padding:.65rem 1rem;background:var(--color-success-light);border-radius:var(--radius-md);font-size:.85rem;color:var(--color-success)">📝 Admin Note: ${c.adminNote}</div>` : ''}
        <div class="complaint-footer">
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            ${c.status==='pending' ? `
              <button class="btn btn-sm btn-warning" onclick="AdminController.updateComplaint('${c.id}','in-progress')">🔄 Mark In Progress</button>
              <button class="btn btn-sm btn-success" onclick="AdminController.updateComplaint('${c.id}','resolved')">✅ Mark Resolved</button>
            ` : c.status==='in-progress' ? `
              <button class="btn btn-sm btn-success" onclick="AdminController.updateComplaint('${c.id}','resolved')">✅ Mark Resolved</button>
            ` : `<span style="font-size:.82rem;color:var(--color-success)">✅ Resolved</span>`}
            <button class="btn btn-sm btn-outline" onclick="AdminController.replyComplaint('${c.id}')">📝 Add Note</button>
          </div>
        </div>
      </div>
      `).join('')}
    `;
  },

  updateComplaint(id, status) {
    Storage.updateComplaint(id, { status });
    Toast.success(`Complaint marked as ${status.replace('-',' ')}.`);
    AdminController.switchTab('complaints');
  },

  replyComplaint(id) {
    const note = prompt('Add a note for this complaint:');
    if (note === null) return;
    Storage.updateComplaint(id, { adminNote: note });
    Toast.success('Note added.');
    AdminController.switchTab('complaints');
  },

  // =====================================================================
  // ATTENDANCE
  // =====================================================================
  renderAttendance() {
    const students = Storage.getApprovedStudents();
    const today = new Date().toISOString().split('T')[0];
    return `
    <div class="page-header">
      <div>
        <div class="page-header-title">📋 Attendance Management</div>
        <div class="page-header-sub">Mark attendance for today: ${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
      </div>
      <button class="btn btn-primary" onclick="AdminController.markAllPresent('${today}')">✅ Mark All Present</button>
    </div>
    ${students.length===0 ? `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">No students registered</div></div>` : `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr><th>Student</th><th>Room</th><th>Today's Status</th><th>Monthly %</th><th>Mark As</th></tr>
        </thead>
        <tbody>
          ${students.map(s => {
            const att = Storage.getStudentAttendance(s.id);
            const todayStatus = att[today] || '—';
            const entries = Object.values(att);
            const pct = entries.length ? Math.round((entries.filter(v=>v==='present').length/entries.length)*100) : 0;
            return `
            <tr>
              <td><div style="font-weight:700">${s.name}</div><div style="font-size:.76rem;color:var(--text-muted)">${s.rollNo||''}</div></td>
              <td>${s.roomNo||'—'}</td>
              <td><span class="badge badge-${todayStatus==='present'?'approved':todayStatus==='absent'?'rejected':todayStatus==='leave'?'in-progress':'tag'}">${todayStatus.charAt(0).toUpperCase()+todayStatus.slice(1)}</span></td>
              <td>
                <div style="display:flex;align-items:center;gap:.5rem">
                  <div style="width:60px;height:6px;background:var(--border-medium);border-radius:3px;overflow:hidden">
                    <div style="width:${pct}%;height:100%;background:${pct>=75?'var(--color-success)':pct>=50?'var(--color-warning)':'var(--color-danger)'};border-radius:3px"></div>
                  </div>
                  <span style="font-size:.82rem;font-weight:700">${pct}%</span>
                </div>
              </td>
              <td>
                <div class="att-toggle-group">
                  <button class="att-toggle-btn ${todayStatus==='present'?'active-present':''}" onclick="AdminController.markAtt('${s.id}','${today}','present')">P</button>
                  <button class="att-toggle-btn ${todayStatus==='absent'?'active-absent':''}"  onclick="AdminController.markAtt('${s.id}','${today}','absent')">A</button>
                  <button class="att-toggle-btn ${todayStatus==='leave'?'active-leave':''}"   onclick="AdminController.markAtt('${s.id}','${today}','leave')">L</button>
                </div>
              </td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    `}
    `;
  },

  markAtt(studentId, date, status) {
    Storage.setStudentAttendance(studentId, date, status);
    AdminController.switchTab('attendance');
  },
  markAllPresent(date) {
    Storage.markAttendanceForAll(date, 'present');
    Toast.success('All students marked present for today.');
    AdminController.switchTab('attendance');
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
        <div class="page-header-sub">Today: ${today} · Warden can edit any day's menu below</div>
      </div>
      <button class="btn btn-primary" onclick="AdminController.editFullDay('${today}')">✏️ Edit Today's Menu</button>
    </div>
    <div class="meal-day-pills" id="admin-day-pills">
      ${days.map(d=>`
        <button class="meal-day-btn ${d===today?'active':''}" onclick="AdminController.showMenuDay('${d}',this)">${d}</button>
      `).join('')}
    </div>
    <div id="admin-menu-day">${AdminController.renderMenuDay(menu[today],today)}</div>
    `;
  },
  showMenuDay(day,btn) {
    document.querySelectorAll('#admin-day-pills .meal-day-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    AdminController._currentMenuDay = day;
    const menu = Storage.getMessMenu();
    document.getElementById('admin-menu-day').innerHTML = AdminController.renderMenuDay(menu[day],day);
    // Update the "Edit Today's" button to show current day
    const hdr = document.querySelector('.page-header .btn-primary');
    if (hdr) hdr.onclick = () => AdminController.editFullDay(day);
  },
  renderMenuDay(dayMenu, day) {
    const _day = day || AdminController._currentMenuDay || '';
    if (!dayMenu) return `
      <div class="empty-state">
        <div class="empty-state-icon">🍽️</div>
        <div class="empty-state-title">No menu set for this day</div>
        <div class="empty-state-sub">Click ✏️ Edit to set up the menu</div>
        <button class="btn btn-primary" style="margin-top:1.2rem" onclick="AdminController.editFullDay('${_day}')">✏️ Set Menu for ${_day}</button>
      </div>`;
    const meals = [
      { key:'breakfast', icon:'🌅', label:'Breakfast' },
      { key:'lunch',     icon:'☀️',  label:'Lunch' },
      { key:'snacks',    icon:'🍵',  label:'Evening Snacks' },
      { key:'dinner',    icon:'🌙',  label:'Dinner' },
    ];
    const typeColor = { veg:'#10b981', 'non-veg':'#ef4444', special:'#f59e0b' };
    const typeLabel = { veg:'Veg','non-veg':'Non-Veg', special:'Special' };
    return `
    <div class="meal-cards-grid">
      ${meals.map(m => {
        const meal = dayMenu[m.key] || { items:[], type:'veg', time:'—' };
        return `
        <div class="meal-card">
          <div class="meal-card-header">
            <h3>${m.icon} ${m.label}</h3>
            <div style="display:flex;align-items:center;gap:.5rem">
              <span class="meal-timing">${meal.time}</span>
              <button class="btn btn-sm btn-outline" style="padding:.2rem .55rem;font-size:.72rem" onclick="AdminController.editMeal('${_day}','${m.key}')">✏️ Edit</button>
            </div>
          </div>
          <div class="meal-card-body">
            ${meal.items.length ? meal.items.map(item=>`
              <div style="display:flex;align-items:flex-start;gap:.5rem;margin-bottom:.4rem">
                <div class="diet-dot diet-${meal.type}" style="margin-top:6px"></div>
                <span style="font-size:.88rem;color:var(--text-main)">${item}</span>
              </div>
            `).join('') : '<div style="font-size:.83rem;color:var(--text-muted);padding:.4rem 0">No items — click Edit to add.</div>'}
          </div>
          <div class="meal-card-footer">
            <span style="font-size:.76rem;color:var(--text-muted)">🍽️ ${meal.items.length} items</span>
            <span style="display:inline-flex;align-items:center;gap:.3rem;font-size:.76rem;font-weight:700;color:${typeColor[meal.type]||'#64748b'}">
              <span style="width:8px;height:8px;border-radius:50%;background:${typeColor[meal.type]||'#64748b'};display:inline-block"></span>
              ${typeLabel[meal.type]||'—'}
            </span>
          </div>
        </div>
        `;
      }).join('')}
    </div>
    `;
  },

  // =====================================================================
  // MESS MENU EDITING (Warden only)
  // =====================================================================

  /** Edit a single meal (breakfast/lunch/snacks/dinner) for a day */
  editMeal(day, mealKey) {
    const menu = Storage.getMessMenu();
    const dayMenu = menu[day] || {};
    const meal = dayMenu[mealKey] || { items: [], type: 'veg', time: '' };
    const mealLabels = { breakfast:'Breakfast', lunch:'Lunch', snacks:'Evening Snacks', dinner:'Dinner' };
    const mealIcons  = { breakfast:'🌅', lunch:'☀️', snacks:'🍵', dinner:'🌙' };

    const existing = document.getElementById('edit-meal-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'edit-meal-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
    <div class="modal" style="max-width:520px">
      <div class="modal-header">
        <div class="modal-title">${mealIcons[mealKey]} Edit ${mealLabels[mealKey]} — ${day}</div>
        <button class="modal-close" onclick="document.getElementById('edit-meal-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom:1rem">
          <label class="form-label">Timing <span style="color:var(--text-muted);font-size:.8rem">(e.g. 7:30 AM – 9:00 AM)</span></label>
          <input id="emeal-time" class="form-control" value="${meal.time}" placeholder="7:30 AM – 9:00 AM" />
        </div>
        <div style="margin-bottom:1rem">
          <label class="form-label">Diet Type</label>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            ${['veg','non-veg','special'].map(t=>`
              <label style="display:flex;align-items:center;gap:.35rem;cursor:pointer;padding:.4rem .8rem;border-radius:999px;border:2px solid ${meal.type===t?'var(--color-primary)':'var(--border-medium)'};background:${meal.type===t?'rgba(99,102,241,.12)':'transparent'};font-size:.83rem;font-weight:600">
                <input type="radio" name="emeal-type" value="${t}" ${meal.type===t?'checked':''} style="accent-color:var(--color-primary)" />
                ${t==='veg'?'🥦 Veg':t==='non-veg'?'🍗 Non-Veg':'⭐ Special'}
              </label>
            `).join('')}
          </div>
        </div>
        <div>
          <label class="form-label">Menu Items <span style="color:var(--text-muted);font-size:.8rem">(one per line)</span></label>
          <textarea id="emeal-items" class="form-control" rows="6" placeholder="Idli Sambar&#10;Poha&#10;Bread Butter">${meal.items.join('\n')}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('edit-meal-modal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="AdminController.saveMeal('${day}','${mealKey}')">💾 Save Meal</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
  },

  async saveMeal(day, mealKey) {
    const time  = document.getElementById('emeal-time').value.trim();
    const items = document.getElementById('emeal-items').value.split('\n').map(s=>s.trim()).filter(Boolean);
    const type  = document.querySelector('input[name="emeal-type"]:checked')?.value || 'veg';

    const menu = Storage.getMessMenu();
    if (!menu[day]) menu[day] = {};
    menu[day][mealKey] = { time, items, type };

    await Storage.saveMessMenu(menu);

    document.getElementById('edit-meal-modal').remove();
    Toast.success(`${mealKey.charAt(0).toUpperCase()+mealKey.slice(1)} for ${day} updated! 🍽️`);

    // Refresh the displayed day
    const updatedMenu = Storage.getMessMenu();
    const container = document.getElementById('admin-menu-day');
    if (container) container.innerHTML = AdminController.renderMenuDay(updatedMenu[day], day);
  },

  /** Edit all 4 meals at once for a given day — tab-based full day editor */
  editFullDay(day) {
    const menu = Storage.getMessMenu();
    const dayMenu = menu[day] || {};
    const meals = [
      { key:'breakfast', icon:'🌅', label:'Breakfast',      defaultTime:'7:30 AM – 9:00 AM' },
      { key:'lunch',     icon:'☀️',  label:'Lunch',          defaultTime:'12:00 PM – 2:00 PM' },
      { key:'snacks',    icon:'🍵',  label:'Evening Snacks', defaultTime:'4:30 PM – 5:30 PM' },
      { key:'dinner',    icon:'🌙',  label:'Dinner',         defaultTime:'7:30 PM – 9:30 PM' },
    ];
    const existing = document.getElementById('edit-day-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'edit-day-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
    <div class="modal" style="max-width:680px;max-height:90vh">
      <div class="modal-header">
        <div class="modal-title">📅 Edit Full Menu — ${day}</div>
        <button class="modal-close" onclick="document.getElementById('edit-day-modal').remove()">✕</button>
      </div>
      <div class="modal-body" style="overflow-y:auto">
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1.2rem" id="edit-day-tabs">
          ${meals.map((m,i)=>`<button class="meal-day-btn ${i===0?'active':''}" onclick="AdminController._switchEditTab('${m.key}',this)">${m.icon} ${m.label}</button>`).join('')}
        </div>
        ${meals.map((m,i) => {
          const meal = dayMenu[m.key] || { items:[], type:'veg', time: m.defaultTime };
          return `
          <div id="edit-tab-${m.key}" style="display:${i===0?'block':'none'}">
            <div style="margin-bottom:1rem">
              <label class="form-label">⏰ Timing</label>
              <input id="eday-time-${m.key}" class="form-control" value="${meal.time}" placeholder="${m.defaultTime}" />
            </div>
            <div style="margin-bottom:1rem">
              <label class="form-label">Diet Type</label>
              <div style="display:flex;gap:.5rem;flex-wrap:wrap">
                ${['veg','non-veg','special'].map(t=>`
                  <label style="display:flex;align-items:center;gap:.35rem;cursor:pointer;padding:.4rem .8rem;border-radius:999px;border:2px solid ${meal.type===t?'var(--color-primary)':'var(--border-medium)'};background:${meal.type===t?'rgba(99,102,241,.12)':'transparent'};font-size:.83rem;font-weight:600">
                    <input type="radio" name="eday-type-${m.key}" value="${t}" ${meal.type===t?'checked':''} style="accent-color:var(--color-primary)" />
                    ${t==='veg'?'🥦 Veg':t==='non-veg'?'🍗 Non-Veg':'⭐ Special'}
                  </label>
                `).join('')}
              </div>
            </div>
            <div>
              <label class="form-label">Menu Items <span style="color:var(--text-muted);font-size:.8rem">(one per line)</span></label>
              <textarea id="eday-items-${m.key}" class="form-control" rows="6" placeholder="Enter each item on a new line">${meal.items.join('\n')}</textarea>
            </div>
          </div>
          `;
        }).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('edit-day-modal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="AdminController.saveFullDay('${day}')">💾 Save All Meals for ${day}</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
  },

  _switchEditTab(mealKey, btn) {
    document.querySelectorAll('#edit-day-tabs .meal-day-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['breakfast','lunch','snacks','dinner'].forEach(k => {
      const el = document.getElementById(`edit-tab-${k}`);
      if (el) el.style.display = k === mealKey ? 'block' : 'none';
    });
  },

  async saveFullDay(day) {
    const mealKeys = ['breakfast','lunch','snacks','dinner'];
    const menu = Storage.getMessMenu();
    if (!menu[day]) menu[day] = {};
    mealKeys.forEach(k => {
      const time  = (document.getElementById(`eday-time-${k}`)?.value || '').trim();
      const items = (document.getElementById(`eday-items-${k}`)?.value || '').split('\n').map(s=>s.trim()).filter(Boolean);
      const type  = document.querySelector(`input[name="eday-type-${k}"]:checked`)?.value || 'veg';
      menu[day][k] = { time, items, type };
    });

    await Storage.saveMessMenu(menu);
    document.getElementById('edit-day-modal').remove();
    Toast.success(`Full menu for ${day} saved! 🎉`);

    // Refresh view
    const updatedMenu = Storage.getMessMenu();
    const container = document.getElementById('admin-menu-day');
    if (container) container.innerHTML = AdminController.renderMenuDay(updatedMenu[day], day);
  },

  // =====================================================================
  // HELPERS
  // =====================================================================
  greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  },

  updateBadges() {
    const pending  = Storage.getPasses().filter(p=>p.status==='pending').length;
    const openComp = Storage.getComplaints().filter(c=>c.status==='pending').length;
    const pb = document.getElementById('anav-passes-badge');
    const cb = document.getElementById('anav-comp-badge');
    if (pb) { pb.textContent=pending;  pb.style.display=pending>0?'inline':'none'; }
    if (cb) { cb.textContent=openComp; cb.style.display=openComp>0?'inline':'none'; }
  },

  init() {
    AdminController.updateBadges();
  },
};

window.AdminController = AdminController;
