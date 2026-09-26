// ============================================================
// HOSTELEASE - AUTH MODULE
// ============================================================

const Auth = {

  async login(email, password) {
    // If backend online, try login via API first
    if (window.API && API.isOnline) {
      try {
        const res = await fetch(`${API.BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          Storage.setCurrentUser(data.user);
          return { success: true, user: data.user };
        } else if (data.detail) {
          return { success: false, error: data.detail };
        }
      } catch (err) {
        console.warn('Backend login attempt failed, falling back to local storage:', err);
      }
    }

    // Local fallback
    const user = Storage.getUserByEmail(email);
    if (!user) return { success: false, error: 'No account found with this email.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password.' };
    if (user.role === 'student' && user.status !== 'approved') {
      return { success: false, error: 'Your account is pending approval by the Warden.' };
    }
    if (user.status === 'rejected') {
      return { success: false, error: 'Your account has been rejected. Please contact the Warden.' };
    }
    // Save session (without password)
    const session = { ...user };
    delete session.password;
    Storage.setCurrentUser(session);
    return { success: true, user: session };
  },

  logout() {
    Storage.clearCurrentUser();
  },

  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  isLoggedIn() {
    return !!Storage.getCurrentUser();
  },

  // Refresh session from storage (in case profile was updated)
  refreshSession() {
    const session = Storage.getCurrentUser();
    if (!session) return null;
    const fresh = Storage.getUserById(session.id);
    if (!fresh) { Storage.clearCurrentUser(); return null; }
    const updated = { ...fresh };
    delete updated.password;
    Storage.setCurrentUser(updated);
    return updated;
  },

  async changePassword(userId, oldPassword, newPassword) {
    if (newPassword.length < 6) return { success: false, error: 'New password must be at least 6 characters.' };
    const user = Storage.getUserById(userId);
    if (!user) return { success: false, error: 'User not found.' };
    if (user.password && user.password !== oldPassword) return { success: false, error: 'Current password is incorrect.' };
    await Storage.updateUser(userId, { password: newPassword });
    return { success: true };
  },

  async updateProfile(userId, updates) {
    await Storage.updateUser(userId, updates);
    Auth.refreshSession();
    return { success: true };
  },
};

window.Auth = Auth;
