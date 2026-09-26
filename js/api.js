// ============================================================
// HOSTELEASE - API CONNECTOR (Syncs with FastAPI + SQLite Backend)
// ============================================================

const API = {
  BASE_URL: 'http://127.0.0.1:8000/api',
  isOnline: false,

  async checkHealth() {
    try {
      const res = await fetch(`${this.BASE_URL}/health`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        this.isOnline = true;
        this.updateBadge(true);
        return true;
      }
    } catch (e) {
      // Backend not running or unreachable
    }
    this.isOnline = false;
    this.updateBadge(false);
    return false;
  },

  updateBadge(online) {
    const badge = document.getElementById('backend-status-badge');
    if (!badge) return;
    if (online) {
      badge.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981"></span> Backend: Connected (SQLite)`;
      badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      badge.style.color = '#10b981';
      badge.title = 'FastAPI + SQLite backend active on http://127.0.0.1:8000';
    } else {
      badge.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f59e0b"></span> Backend: Offline (Local Mode)`;
      badge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      badge.style.color = '#f59e0b';
      badge.title = 'Running on browser storage fallback. Start backend with backend/run.bat';
    }
  },

  async get(endpoint) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}${endpoint}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API GET error:', endpoint, e);
    }
    return null;
  },

  async post(endpoint, data) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API POST error:', endpoint, e);
    }
    return null;
  },

  async put(endpoint, data) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API PUT error:', endpoint, e);
    }
    return null;
  },

  async delete(endpoint) {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API DELETE error:', endpoint, e);
    }
    return null;
  }
};

window.API = API;
