// ============================================================
// HOSTELEASE - MAIN APP (routing + login + theme)
// ============================================================

const App = {
  currentRole: 'student', // 'student' | 'admin' | 'security'

  async init() {
    await Storage.init();
    App.applyTheme(Storage.getTheme());

    if (Auth.isLoggedIn()) {
      App.routeToRole(Auth.getCurrentUser());
    } else {
      App.showLogin();
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.saveTheme(theme);
    // Update all theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  },

  toggleTheme() {
    const current = Storage.getTheme();
    App.applyTheme(current === 'dark' ? 'light' : 'dark');
  },

  routeToRole(user) {
    if (user.role === 'admin') {
      document.getElementById('app').innerHTML = AdminController.render();
      AdminController.init();
    } else if (user.role === 'security') {
      document.getElementById('app').innerHTML = SecurityController.render();
      SecurityController.init();
    } else {
      document.getElementById('app').innerHTML = StudentController.render();
      StudentController.init();
    }
    // Restore theme toggle after re-render
    App.applyTheme(Storage.getTheme());
    if (window.API) API.checkHealth();
  },

  logout() {
    if (!confirm('Are you sure you want to log out?')) return;
    App.closeSidebar();
    Auth.logout();
    App.showLogin();
  },

  // =====================================================================
  // MOBILE NAVIGATION DRAWER CONTROLS
  // =====================================================================
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    if (sidebar.classList.contains('open')) {
      App.closeSidebar();
    } else {
      App.openSidebar();
    }
  },

  openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      backdrop.onclick = () => App.closeSidebar();
      document.body.appendChild(backdrop);
    }
    sidebar.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  },

  // =====================================================================
  // LOGIN SCREEN
  // =====================================================================
  showLogin() {
    App.closeSidebar();
    document.getElementById('app').innerHTML = App.renderLogin();
    App.initLogin();
  },

  renderLogin() {
    return `
    <div class="auth-container">
      <!-- Theme toggle & backend badge in corner -->
      <div style="position:fixed;top:1rem;right:1rem;z-index:200;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 2rem)">
        <div id="backend-status-badge" style="font-size:.78rem;font-weight:600;padding:.35rem .75rem;border-radius:var(--radius-full);background:var(--bg-surface);border:1px solid var(--border-light);display:flex;align-items:center;gap:.4rem;cursor:help;box-shadow:var(--shadow-sm)">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b"></span> Backend: Connecting…
        </div>
        <button class="theme-toggle-btn" onclick="App.toggleTheme()" id="auth-theme-btn" title="Toggle Theme">
          ${Storage.getTheme() === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div class="auth-card animate-fade-in">
        <div class="auth-header">
          <div class="auth-logo">🏨</div>
          <h1 style="font-size:1.65rem;font-weight:800;letter-spacing:-0.02em;color:var(--text-main)">HostelEase</h1>
          <p style="margin-top:.35rem;color:var(--text-muted);font-size:.9rem">Hostel Management System</p>
        </div>

        <div class="auth-body">
          <!-- 3 Role Tabs -->
          <div class="auth-role-tabs">
            <button class="auth-role-tab active" data-role="student" onclick="App.switchRole('student')">
              🎓 Student
            </button>
            <button class="auth-role-tab" data-role="admin" onclick="App.switchRole('admin')">
              🏫 Warden
            </button>
            <button class="auth-role-tab" data-role="security" onclick="App.switchRole('security')">
              🛡️ Security
            </button>
          </div>

          <!-- Hint banner -->
          <div id="role-hint" style="margin-bottom:1.25rem;padding:.7rem 1rem;border-radius:var(--radius-md);
               background:var(--color-primary-light);border:1px solid var(--color-primary-glow);
               font-size:.8rem;color:var(--text-muted);">
            <strong style="color:var(--color-primary)">Demo:</strong> 
            <span id="role-hint-text">rahul@hostel.com / student123</span>
          </div>

          <form id="login-form" onsubmit="App.handleLogin(event)" autocomplete="off">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <input class="form-input" type="email" id="login-email" placeholder="your@email.com" required autocomplete="username">
            </div>
            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input class="form-input" type="password" id="login-password" placeholder="Enter your password" required autocomplete="current-password">
            </div>
            <div id="login-error" style="display:none;color:var(--color-danger);font-size:.85rem;
                 padding:.7rem 1rem;border-radius:var(--radius-md);background:var(--color-danger-light);
                 border:1px solid rgba(239,68,68,.3);margin-bottom:1rem;"></div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">
              Sign In
            </button>
          </form>

          <p style="text-align:center;margin-top:1.15rem;font-size:.8rem;color:var(--text-muted)">
            Don't have an account? Contact the <strong style="color:var(--text-main)">Warden</strong> to get registered.
          </p>
        </div>
      </div>
    </div>
    `;
  },

  switchRole(role) {
    App.currentRole = role;
    document.querySelectorAll('.auth-role-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.role === role);
    });
    const hints = {
      student:  'rahul@hostel.com / student123',
      admin:    'admin@hostel.com / admin123',
      security: 'security@hostel.com / security123',
    };
    document.getElementById('role-hint-text').textContent = hints[role] || '';
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
  },

  initLogin() {
    App.applyTheme(Storage.getTheme());
    if (window.API) API.checkHealth();
  },

  async handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl    = document.getElementById('login-error');
    const btn      = document.getElementById('login-btn');

    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    try {
      const result = await Auth.login(email, password);
      if (result.success) {
        const user = result.user;
        // Role mismatch check
        const expectedRole = App.currentRole;
        if (expectedRole === 'security' && user.role !== 'security') {
          errEl.textContent = 'This account is not a Security Guard account.';
          errEl.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Sign In'; return;
        }
        if (expectedRole === 'admin' && user.role !== 'admin') {
          errEl.textContent = 'This account is not a Warden/Admin account.';
          errEl.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Sign In'; return;
        }
        if (expectedRole === 'student' && user.role !== 'student') {
          errEl.textContent = 'This account is not a Student account.';
          errEl.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Sign In'; return;
        }
        Toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
        App.routeToRole(user);
      } else {
        errEl.textContent = result.error;
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    } catch (err) {
      errEl.textContent = 'Login failed. Please try again.';
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  },
};

// ============================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================
const Toast = {
  show(msg, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="font-size:1.1rem">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(100%)'; toast.style.transition='all .35s ease'; setTimeout(()=>toast.remove(),350); }, duration);
  },
  success(msg) { Toast.show(msg,'success'); },
  error(msg)   { Toast.show(msg,'error',4500); },
  warning(msg) { Toast.show(msg,'warning',4000); },
  info(msg)    { Toast.show(msg,'info'); },
};

window.Toast = Toast;

// Generate random QR-like pattern
function generateQR() {
  let cells = '';
  for (let i=0;i<49;i++) {
    const isWhite = Math.random() > 0.55;
    cells += `<div class="qr-cell ${isWhite?'white':''}"></div>`;
  }
  return cells;
}

// Global keyboard and resize handlers for responsive drawer and modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    App.closeSidebar();
    const modal = document.querySelector('.modal-backdrop');
    if (modal) modal.remove();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    App.closeSidebar();
  }
});

// Wait for DOM then boot
document.addEventListener('DOMContentLoaded', () => App.init());
