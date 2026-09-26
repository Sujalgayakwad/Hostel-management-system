// ============================================================
// HOSTELEASE - SETTINGS CONTROLLER (Profile, Password, Theme)
// ============================================================

const SettingsController = {

  openSettingsModal(fromRole) {
    const user = Auth.getCurrentUser();
    const isAdmin = user.role === 'admin';
    const tabs = [
      { id:'profile',  icon:'👤', label:'Profile' },
      { id:'password', icon:'🔐', label:'Password' },
      { id:'theme',    icon:'🎨', label:'Appearance' },
    ];
    if (isAdmin) {
      tabs.push({ id:'email', icon:'✉️', label:'Email / SMTP' });
    }

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'settings-modal';
    modal.innerHTML = `
    <div class="modal" style="max-width:680px">
      <div class="modal-header">
        <div class="modal-title">⚙️ Settings & Configuration</div>
        <button class="modal-close" onclick="document.getElementById('settings-modal').remove()">✕</button>
      </div>
      <div class="modal-body" style="padding:0">
        <div class="settings-modal-grid">
          <!-- Sidebar / Top tabs on mobile -->
          <div class="settings-modal-nav">
            <div class="settings-modal-tabs">
              ${tabs.map((item,idx) => `
                <button class="settings-nav-item ${idx===0?'active':''}"
                        id="snav-${item.id}" onclick="SettingsController.switchTab('${item.id}')">
                  ${item.icon} ${item.label}
                </button>
              `).join('')}
            </div>
          </div>
          <!-- Content -->
          <div id="settings-tab-content" style="padding:1.5rem;overflow-y:auto;max-height:540px">
            ${SettingsController.renderProfileTab(user)}
          </div>
        </div>
      </div>
    </div>
    `;
    document.body.appendChild(modal);
  },

  async switchTab(tab) {
    document.querySelectorAll('.settings-nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.getElementById(`snav-${tab}`);
    if (navEl) navEl.classList.add('active');

    const user = Auth.getCurrentUser();
    const content = document.getElementById('settings-tab-content');
    if (tab === 'profile')  content.innerHTML = SettingsController.renderProfileTab(user);
    if (tab === 'password') content.innerHTML = SettingsController.renderPasswordTab();
    if (tab === 'theme')    content.innerHTML = SettingsController.renderThemeTab();
    if (tab === 'email')    content.innerHTML = await SettingsController.renderEmailTab();
  },

  // ---- PROFILE TAB ----
  renderProfileTab(user) {
    const isStudent = user.role === 'student';
    return `
    <div class="animate-fade-in">
      <h3 style="margin-bottom:1.25rem">👤 Edit Profile</h3>
      <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.75rem">
        <div class="profile-avatar-edit" id="profile-avatar-display" title="Avatar is auto-generated">
          ${user.avatar || user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-weight:700;font-size:1.1rem;color:var(--text-main)">${user.name}</div>
          <div style="font-size:.8rem;color:var(--text-muted);text-transform:capitalize">${user.role} • ${user.email}</div>
        </div>
      </div>
      <form onsubmit="SettingsController.saveProfile(event)">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input class="form-input" type="text" id="sp-name" value="${user.name}" required placeholder="Your full name">
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input class="form-input" type="tel" id="sp-phone" value="${user.phone||''}" placeholder="+91 XXXXX XXXXX">
        </div>
        ${isStudent ? `
        <div class="form-group">
          <label class="form-label">Parent/Guardian Phone</label>
          <input class="form-input" type="tel" id="sp-parentPhone" value="${user.parentPhone||''}" placeholder="+91 XXXXX XXXXX">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Branch / Dept.</label>
            <input class="form-input" type="text" id="sp-branch" value="${user.branch||''}" placeholder="Computer Science">
          </div>
          <div class="form-group">
            <label class="form-label">Year</label>
            <select class="form-select" id="sp-year">
              ${['1st Year','2nd Year','3rd Year','4th Year'].map(y=>`<option ${user.year===y?'selected':''}>${y}</option>`).join('')}
            </select>
          </div>
        </div>
        ` : ''}
        <div style="padding:.75rem 1rem;background:var(--color-warning-light);border-radius:var(--radius-md);border:1px solid var(--color-warning-glow);font-size:.8rem;color:var(--text-muted);margin-bottom:1rem">
          ⚠️ Email and Roll No. cannot be changed. Contact Warden for changes.
        </div>
        <div style="display:flex;gap:.75rem;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('settings-modal').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
    `;
  },

  saveProfile(e) {
    e.preventDefault();
    const user = Auth.getCurrentUser();
    const updates = {
      name:  document.getElementById('sp-name').value.trim(),
      phone: document.getElementById('sp-phone').value.trim(),
      avatar: document.getElementById('sp-name').value.trim().charAt(0).toUpperCase(),
    };
    if (user.role === 'student') {
      updates.parentPhone = document.getElementById('sp-parentPhone').value.trim();
      updates.branch      = document.getElementById('sp-branch').value.trim();
      updates.year        = document.getElementById('sp-year').value;
    }
    if (!updates.name) { Toast.error('Name cannot be empty.'); return; }
    Auth.updateProfile(user.id, updates);
    Toast.success('Profile updated successfully!');
    document.getElementById('settings-modal').remove();
    // Re-render sidebar name
    const sidebar = document.querySelector('.sidebar-user-name');
    if (sidebar) sidebar.textContent = updates.name;
  },

  // ---- PASSWORD TAB ----
  renderPasswordTab() {
    return `
    <div class="animate-fade-in">
      <h3 style="margin-bottom:1.25rem">🔐 Change Password</h3>
      <form onsubmit="SettingsController.savePassword(event)">
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <input class="form-input" type="password" id="sp-old-pw" placeholder="Your current password" required>
        </div>
        <div class="form-group">
          <label class="form-label">New Password</label>
          <input class="form-input" type="password" id="sp-new-pw" placeholder="At least 6 characters" required>
        </div>
        <div class="form-group">
          <label class="form-label">Confirm New Password</label>
          <input class="form-input" type="password" id="sp-confirm-pw" placeholder="Repeat new password" required>
        </div>
        <div id="pw-error" style="display:none;color:var(--color-danger);font-size:.85rem;padding:.7rem 1rem;border-radius:var(--radius-md);background:var(--color-danger-light);margin-bottom:1rem"></div>
        <div style="display:flex;gap:.75rem;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('settings-modal').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Password</button>
        </div>
      </form>
    </div>
    `;
  },

  savePassword(e) {
    e.preventDefault();
    const errEl = document.getElementById('pw-error');
    errEl.style.display = 'none';
    const user    = Auth.getCurrentUser();
    const oldPw   = document.getElementById('sp-old-pw').value;
    const newPw   = document.getElementById('sp-new-pw').value;
    const confirm = document.getElementById('sp-confirm-pw').value;

    if (newPw !== confirm) {
      errEl.textContent = 'New passwords do not match.';
      errEl.style.display = 'block'; return;
    }
    const result = Auth.changePassword(user.id, oldPw, newPw);
    if (!result.success) {
      errEl.textContent = result.error;
      errEl.style.display = 'block'; return;
    }
    Toast.success('Password changed successfully!');
    document.getElementById('settings-modal').remove();
  },

  // ---- THEME TAB ----
  renderThemeTab() {
    const current = Storage.getTheme();
    return `
    <div class="animate-fade-in">
      <h3 style="margin-bottom:1.25rem">🎨 Appearance</h3>
      <div class="form-group">
        <label class="form-label">Color Theme</label>
        <div class="grid-2-col-sm" style="gap:1rem;margin-top:.5rem">
          <button onclick="SettingsController.setTheme('dark')"
                  style="padding:1.5rem;border-radius:var(--radius-lg);border:2px solid ${current==='dark'?'var(--color-primary)':'var(--border-medium)'};background:#0b0f19;color:#f1f5f9;cursor:pointer;text-align:center;transition:all .2s">
            <div style="font-size:2rem;margin-bottom:.5rem">🌙</div>
            <div style="font-weight:700">Dark Mode</div>
            <div style="font-size:.75rem;color:#94a3b8;margin-top:.2rem">Easy on the eyes</div>
            ${current==='dark' ? '<div style="margin-top:.75rem;color:var(--color-primary);font-weight:700;font-size:.8rem">✓ Active</div>' : ''}
          </button>
          <button onclick="SettingsController.setTheme('light')"
                  style="padding:1.5rem;border-radius:var(--radius-lg);border:2px solid ${current==='light'?'var(--color-primary)':'var(--border-medium)'};background:#ffffff;color:#0f172a;cursor:pointer;text-align:center;transition:all .2s">
            <div style="font-size:2rem;margin-bottom:.5rem">☀️</div>
            <div style="font-weight:700">Light Mode</div>
            <div style="font-size:.75rem;color:#64748b;margin-top:.2rem">Classic bright look</div>
            ${current==='light' ? '<div style="margin-top:.75rem;color:#4f46e5;font-weight:700;font-size:.8rem">✓ Active</div>' : ''}
          </button>
        </div>
      </div>
      <div style="margin-top:1.5rem;padding:1rem;background:var(--bg-subtle);border-radius:var(--radius-md);border:1px solid var(--border-light)">
        <div style="font-weight:600;margin-bottom:.5rem;color:var(--text-main)">Quick Toggle</div>
        <div class="theme-switch-wrapper">
          <span>🌙 Dark</span>
          <label class="theme-switch">
            <input type="checkbox" ${current==='light'?'checked':''} onchange="SettingsController.setTheme(this.checked?'light':'dark')">
            <span class="theme-switch-slider"></span>
          </label>
          <span>☀️ Light</span>
        </div>
      </div>
    </div>
    `;
  },

  setTheme(theme) {
    App.applyTheme(theme);
    // Re-render theme tab to update active state
    const content = document.getElementById('settings-tab-content');
    if (content) content.innerHTML = SettingsController.renderThemeTab();
  },

  // ---- EMAIL / SMTP CONFIGURATION TAB ----
  async renderEmailTab() {
    let cfg = { host: 'smtp.gmail.com', port: 587, user: '', has_password: false, from_email: '' };
    if (window.API && API.isOnline) {
      try {
        const fetched = await API.get('/smtp-config');
        if (fetched) cfg = fetched;
      } catch (e) {}
    }

    const isConnected = !!(cfg.user && cfg.has_password);

    return `
    <div class="animate-fade-in">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem">
        <h3 style="margin:0">✉️ Email & SMTP Setup</h3>
        <span class="badge ${isConnected ? 'badge-approved' : 'badge-pending'}">
          ${isConnected ? '🟢 Live SMTP Active' : '🟡 Preview Mode (No Real Email)'}
        </span>
      </div>

      <div style="background:var(--color-primary-light);border:1px solid var(--color-primary-glow);border-radius:var(--radius-md);padding:.9rem 1rem;font-size:.82rem;color:var(--text-muted);margin-bottom:1.25rem;line-height:1.5">
        <strong style="color:var(--color-primary)">Why emails were not arriving:</strong><br>
        HostelEase needs your SMTP email credentials (e.g. Gmail App Password) to deliver real emails to actual inboxes. Without this, it runs in <strong>safe preview mode</strong> and renders the email inside the app.
      </div>

      <form id="smtp-settings-form" onsubmit="SettingsController.saveSmtpSettings(event)">
        <div class="form-row">
          <div class="form-group" style="flex:2">
            <label class="form-label">SMTP Server Host</label>
            <input class="form-input" type="text" id="smtp-host" value="${cfg.host || 'smtp.gmail.com'}" placeholder="smtp.gmail.com" required>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Port</label>
            <input class="form-input" type="number" id="smtp-port" value="${cfg.port || 587}" placeholder="587" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Sender Email / Username</label>
          <input class="form-input" type="email" id="smtp-user" value="${cfg.user || ''}" placeholder="yourhostel@gmail.com" required>
        </div>

        <div class="form-group">
          <label class="form-label">Email App Password</label>
          <input class="form-input" type="password" id="smtp-pass" placeholder="${cfg.has_password ? '•••••••••••• (Leave blank to keep existing)' : 'Enter 16-character App Password'}" ${cfg.has_password ? '' : 'required'}>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:.3rem">
            For Gmail: Generate a 16-character <strong>App Password</strong> in Google Account &rarr; Security &rarr; 2-Step Verification &rarr; App Passwords.
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Sender Display Name / From Header (Optional)</label>
          <input class="form-input" type="text" id="smtp-from" value="${cfg.from_email || ''}" placeholder="HostelEase Administration <yourhostel@gmail.com>">
        </div>

        <div id="smtp-status-msg" style="display:none;margin-bottom:1rem;padding:.7rem 1rem;border-radius:var(--radius-md);font-size:.85rem"></div>

        <div style="display:flex;gap:.75rem;margin-top:1.25rem">
          <button type="submit" class="btn btn-primary" id="save-smtp-btn">💾 Save SMTP Settings</button>
          <button type="button" class="btn btn-outline" id="test-smtp-btn" onclick="SettingsController.testSmtp()">🚀 Send Test Email</button>
        </div>
      </form>
    </div>
    `;
  },

  async saveSmtpSettings(e) {
    e.preventDefault();
    const btn = document.getElementById('save-smtp-btn');
    const msg = document.getElementById('smtp-status-msg');
    btn.disabled = true; btn.textContent = 'Saving…';

    const host = document.getElementById('smtp-host').value.trim();
    const port = parseInt(document.getElementById('smtp-port').value.trim()) || 587;
    const user = document.getElementById('smtp-user').value.trim();
    const passInput = document.getElementById('smtp-pass').value;
    const from_email = document.getElementById('smtp-from').value.trim() || `HostelEase <${user}>`;

    const payload = { host, port, user, from_email, password: passInput };

    try {
      const res = await API.post('/smtp-config', payload);
      if (res && res.success) {
        msg.style.display = 'block';
        msg.style.background = 'rgba(16, 185, 129, 0.15)';
        msg.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        msg.style.color = '#10b981';
        msg.innerHTML = '✅ SMTP configuration saved! Real emails will now be sent when registering students.';
        Toast.success('SMTP settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      msg.style.display = 'block';
      msg.style.background = 'rgba(239, 68, 68, 0.15)';
      msg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      msg.style.color = '#ef4444';
      msg.innerHTML = '❌ Failed to save SMTP configuration. Is the backend running?';
    } finally {
      btn.disabled = false; btn.textContent = '💾 Save SMTP Settings';
    }
  },

  async testSmtp() {
    const testBtn = document.getElementById('test-smtp-btn');
    const msg = document.getElementById('smtp-status-msg');
    const targetEmail = prompt('Enter recipient email address to send test email to:', document.getElementById('smtp-user').value.trim());
    if (!targetEmail) return;

    testBtn.disabled = true; testBtn.textContent = 'Sending test…';
    msg.style.display = 'block';
    msg.style.background = 'var(--bg-subtle)';
    msg.style.border = '1px solid var(--border-light)';
    msg.style.color = 'var(--text-main)';
    msg.innerHTML = `⏳ Attempting delivery to <strong>${targetEmail}</strong>…`;

    try {
      const res = await API.post(`/smtp-config/test?test_email=${encodeURIComponent(targetEmail)}`, {});
      if (res && res.success && res.mode === 'live') {
        msg.style.background = 'rgba(16, 185, 129, 0.15)';
        msg.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        msg.style.color = '#10b981';
        msg.innerHTML = `🎉 <strong>Success!</strong> Real test email sent to <strong>${targetEmail}</strong>! Check your inbox (or spam folder).`;
        Toast.success('Test email delivered successfully!');
      } else if (res && res.mode === 'preview') {
        msg.style.background = 'rgba(245, 158, 11, 0.15)';
        msg.style.border = '1px solid rgba(245, 158, 11, 0.3)';
        msg.style.color = '#f59e0b';
        msg.innerHTML = `⚠️ Running in Preview mode. Please save valid SMTP credentials above first.`;
      } else {
        msg.style.background = 'rgba(239, 68, 68, 0.15)';
        msg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        msg.style.color = '#ef4444';
        msg.innerHTML = `❌ Delivery failed: ${res ? res.message : 'Unknown error'}. Check credentials and port.`;
      }
    } catch (e) {
      msg.style.background = 'rgba(239, 68, 68, 0.15)';
      msg.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      msg.style.color = '#ef4444';
      msg.innerHTML = `❌ Error testing SMTP: ${e.message}`;
    } finally {
      testBtn.disabled = false; testBtn.textContent = '🚀 Send Test Email';
    }
  },
};

window.SettingsController = SettingsController;
