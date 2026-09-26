// ============================================================
// HOSTELEASE - STORAGE & API SYNC MODULE
// ============================================================

const Storage = {

  // -- KEYS --
  KEYS: {
    USERS:       'he_users',
    PASSES:      'he_passes',
    COMPLAINTS:  'he_complaints',
    ATTENDANCE:  'he_attendance',
    MESS_MENU:   'he_mess_menu',
    THEME:       'he_theme',
    CURRENT_USER:'he_current_user',
    NOTICES:     'he_notices',
  },

  // ---- READ / WRITE HELPERS ----
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },

  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.error('Storage.set:', e); }
  },

  // ---- INIT & SYNC ----
  async init() {
    // Check if backend is available
    if (window.API) {
      const online = await API.checkHealth();
      if (online) {
        await this.syncFromBackend();
        return;
      }
    }

    // Only seed locally if storage is completely empty
    if (!this.get(this.KEYS.USERS)) {
      this.seedLocalData();
    }
  },

  async syncFromBackend() {
    try {
      const [users, passes, complaints, attendance, messMenu, notices] = await Promise.all([
        API.get('/users'),
        API.get('/passes'),
        API.get('/complaints'),
        API.get('/attendance'),
        API.get('/mess-menu'),
        API.get('/notices')
      ]);

      if (users && users.length) this.set(this.KEYS.USERS, users);
      if (passes) this.set(this.KEYS.PASSES, passes);
      if (complaints) this.set(this.KEYS.COMPLAINTS, complaints);
      if (attendance) this.set(this.KEYS.ATTENDANCE, attendance);
      if (messMenu && Object.keys(messMenu).length) this.set(this.KEYS.MESS_MENU, messMenu);
      if (notices) this.set(this.KEYS.NOTICES, notices);

      console.log('⚡ HostelEase synced data from SQLite backend successfully.');
    } catch (e) {
      console.warn('Backend sync failed, using cached storage:', e);
    }
  },

  seedLocalData() {
    const users = [
      {
        id: 'u_admin_01',
        name: 'Dr. R. Sharma',
        email: 'admin@hostel.com',
        password: 'admin123',
        role: 'admin',
        status: 'approved',
        phone: '9876543210',
        designation: 'Chief Warden',
        avatar: 'R',
        createdAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: 'u_sec_01',
        name: 'Ravi Kumar',
        email: 'security@hostel.com',
        password: 'security123',
        role: 'security',
        status: 'approved',
        phone: '9876000111',
        designation: 'Security Guard',
        avatar: 'R',
        createdAt: new Date('2024-01-02').toISOString(),
      },
      {
        id: 'u_stu_01',
        name: 'Rahul Verma',
        email: 'rahul@hostel.com',
        password: 'student123',
        role: 'student',
        status: 'approved',
        phone: '9876543220',
        parentPhone: '9876543219',
        rollNo: 'CS21B001',
        branch: 'Computer Science',
        year: '3rd Year',
        block: 'A Block',
        roomNo: 'A-204',
        avatar: 'R',
        createdAt: new Date('2024-01-10').toISOString(),
      },
      {
        id: 'u_stu_02',
        name: 'Priya Patel',
        email: 'priya@hostel.com',
        password: 'student123',
        role: 'student',
        status: 'approved',
        phone: '9876543230',
        parentPhone: '9876543229',
        rollNo: 'EC21B042',
        branch: 'Electronics & Comm.',
        year: '2nd Year',
        block: 'B Block',
        roomNo: 'B-108',
        avatar: 'P',
        createdAt: new Date('2024-01-11').toISOString(),
      },
    ];
    this.set(this.KEYS.USERS, users);

    const passes = [
      {
        id: 'pass_001',
        studentId: 'u_stu_01',
        studentName: 'Rahul Verma',
        rollNo: 'CS21B001',
        roomNo: 'A-204',
        type: 'out-pass',
        purpose: 'Hospital visit – Dental appointment',
        destination: 'City Hospital, MG Road',
        fromDate: '2024-09-10',
        toDate: '2024-09-10',
        returnTime: '18:00',
        status: 'approved',
        idCardImage: null,
        wardenNote: 'Approved. Please carry your ID.',
        createdAt: new Date('2024-09-09T10:30:00').toISOString(),
        updatedAt: new Date('2024-09-09T11:00:00').toISOString(),
      },
      {
        id: 'pass_002',
        studentId: 'u_stu_02',
        studentName: 'Priya Patel',
        rollNo: 'EC21B042',
        roomNo: 'B-108',
        type: 'home-pass',
        purpose: 'Diwali vacation',
        destination: 'Rajkot, Gujarat',
        fromDate: '2024-10-30',
        toDate: '2024-11-05',
        returnTime: '20:00',
        status: 'pending',
        idCardImage: null,
        wardenNote: '',
        createdAt: new Date('2024-10-28T09:00:00').toISOString(),
        updatedAt: new Date('2024-10-28T09:00:00').toISOString(),
      },
    ];
    this.set(this.KEYS.PASSES, passes);

    const complaints = [
      {
        id: 'comp_001',
        studentId: 'u_stu_01',
        studentName: 'Rahul Verma',
        rollNo: 'CS21B001',
        roomNo: 'A-204',
        category: 'Infrastructure',
        title: 'Water leakage in bathroom',
        description: 'There is continuous water leakage from the tap in our bathroom which is causing water wastage and slippery floor.',
        status: 'in-progress',
        adminNote: 'Maintenance team scheduled for Friday.',
        createdAt: new Date('2024-09-15T08:00:00').toISOString(),
        updatedAt: new Date('2024-09-16T10:00:00').toISOString(),
      },
      {
        id: 'comp_002',
        studentId: 'u_stu_02',
        studentName: 'Priya Patel',
        rollNo: 'EC21B042',
        roomNo: 'B-108',
        category: 'Mess & Food',
        title: 'Food quality has deteriorated',
        description: 'The quality of food served in the mess has deteriorated significantly over the past week. Rice is undercooked and dal is too watery.',
        status: 'pending',
        adminNote: '',
        createdAt: new Date('2024-09-18T12:00:00').toISOString(),
        updatedAt: new Date('2024-09-18T12:00:00').toISOString(),
      },
    ];
    this.set(this.KEYS.COMPLAINTS, complaints);

    const attendance = {};
    ['u_stu_01','u_stu_02'].forEach(uid => {
      attendance[uid] = {};
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const r = Math.random();
        attendance[uid][key] = r > 0.85 ? 'absent' : r > 0.78 ? 'leave' : 'present';
      }
    });
    this.set(this.KEYS.ATTENDANCE, attendance);

    const menu = {
      Monday: {
        breakfast: { items: ['Idli Sambar','Coconut Chutney','Boiled Egg','Tea/Coffee'], type:'veg', time:'7:30 – 9:00 AM' },
        lunch:     { items: ['Rice','Rajma Curry','Roti','Salad','Buttermilk'], type:'veg', time:'12:00 – 2:00 PM' },
        snacks:    { items: ['Samosa','Masala Chai'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Dal Makhani','Jeera Rice','Papad','Pickle'], type:'veg', time:'7:30 – 9:30 PM' },
      },
      Tuesday: {
        breakfast: { items: ['Poha','Sprouts','Banana','Tea/Coffee'], type:'veg', time:'7:30 – 9:00 AM' },
        lunch:     { items: ['Rice','Chicken Curry','Roti','Raita','Salad'], type:'non-veg', time:'12:00 – 2:00 PM' },
        snacks:    { items: ['Bread Pakora','Green Chutney'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Paneer Bhurji','Dal','Rice','Pickle'], type:'veg', time:'7:30 – 9:30 PM' },
      },
      Wednesday: {
        breakfast: { items: ['Paratha','Curd','Pickle','Tea/Coffee'], type:'veg', time:'7:30 – 9:00 AM' },
        lunch:     { items: ['Rice','Chhole','Roti','Salad','Lassi'], type:'veg', time:'12:00 – 2:00 PM' },
        snacks:    { items: ['Vada Pav','Tamarind Chutney'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Mutton Curry','Rice','Salad','Raita'], type:'non-veg', time:'7:30 – 9:30 PM' },
      },
      Thursday: {
        breakfast: { items: ['Dosa','Sambar','Red Chutney','Tea/Coffee'], type:'veg', time:'7:30 – 9:00 AM' },
        lunch:     { items: ['Rice','Dal Fry','Aloo Gobi','Roti','Papad'], type:'veg', time:'12:00 – 2:00 PM' },
        snacks:    { items: ['Fried Rice','Sauce'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Egg Curry','Dal','Rice','Pickle'], type:'non-veg', time:'7:30 – 9:30 PM' },
      },
      Friday: {
        breakfast: { items: ['Upma','Chutney','Banana','Tea/Coffee'], type:'veg', time:'7:30 – 9:00 AM' },
        lunch:     { items: ['Biryani (Special)','Raita','Salad','Papad'], type:'special', time:'12:00 – 2:00 PM' },
        snacks:    { items: ['Jalebi','Milk'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Paneer Matar','Dal','Rice','Kheer'], type:'veg', time:'7:30 – 9:30 PM' },
      },
      Saturday: {
        breakfast: { items: ['Puri Bhaji','Tea/Coffee'], type:'veg', time:'8:00 – 9:30 AM' },
        lunch:     { items: ['Rice','Fish Curry','Roti','Dal','Salad'], type:'non-veg', time:'12:00 – 2:00 PM' },
        snacks:    { items: ['Maggi Noodles','Tea'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Mix Veg','Dal Makhani','Rice','Ice Cream'], type:'veg', time:'7:30 – 9:30 PM' },
      },
      Sunday: {
        breakfast: { items: ['Chole Bhature','Sweet Lassi'], type:'special', time:'8:30 – 10:00 AM' },
        lunch:     { items: ['Chicken Biryani','Mutton Curry','Roti','Raita','Gulab Jamun'], type:'special', time:'12:30 – 2:30 PM' },
        snacks:    { items: ['Pakodas','Chutney','Chai'], type:'veg', time:'5:00 – 6:00 PM' },
        dinner:    { items: ['Roti','Paneer Butter Masala','Dal','Rice','Halwa'], type:'veg', time:'7:30 – 9:30 PM' },
      },
    };
    this.set(this.KEYS.MESS_MENU, menu);

    const notices = [
      { id:'n1', title:'Hostel Day Fest', content:'Annual hostel day celebrations on October 15, 2024. All residents please participate!', date:'2024-09-20', type:'event' },
      { id:'n2', title:'Water Supply Interruption', content:'Water supply will be interrupted on Sep 25 from 10 AM – 2 PM due to maintenance work.', date:'2024-09-22', type:'warning' },
      { id:'n3', title:'Room Inspection', content:'Room inspection will be conducted on September 30th. Please keep your rooms clean and tidy.', date:'2024-09-19', type:'info' },
    ];
    this.set(this.KEYS.NOTICES, notices);
  },

  // ---- USER METHODS ----
  getUsers()    { return this.get(this.KEYS.USERS, []); },
  saveUsers(u)  { this.set(this.KEYS.USERS, u); },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  },
  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  getStudents() {
    return this.getUsers().filter(u => u.role === 'student');
  },
  getApprovedStudents() {
    return this.getUsers().filter(u => u.role === 'student' && u.status === 'approved');
  },
  getPendingStudents() {
    return this.getUsers().filter(u => u.role === 'student' && u.status === 'pending');
  },

  async createUser(data) {
    const users = this.getUsers();
    users.push(data);
    this.saveUsers(users);

    if (window.API && API.isOnline) {
      await API.post('/auth/register', data);
    }
  },

  async updateUser(id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) { 
      users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() }; 
      this.saveUsers(users);
    }

    if (window.API && API.isOnline) {
      await API.put(`/users/${id}`, updates);
    }
    return idx >= 0;
  },

  async deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);

    if (window.API && API.isOnline) {
      await API.delete(`/users/${id}`);
    }
  },

  // ---- SESSION ----
  getCurrentUser() { return this.get(this.KEYS.CURRENT_USER, null); },
  setCurrentUser(user) { this.set(this.KEYS.CURRENT_USER, user); },
  clearCurrentUser() { localStorage.removeItem(this.KEYS.CURRENT_USER); },

  // ---- PASS METHODS ----
  getPasses()         { return this.get(this.KEYS.PASSES, []); },
  savePasses(passes)  { this.set(this.KEYS.PASSES, passes); },

  getPassesByStudent(studentId) {
    return this.getPasses().filter(p => p.studentId === studentId);
  },
  getPassById(id) { return this.getPasses().find(p => p.id === id) || null; },

  async createPass(data) {
    const passes = this.getPasses();
    passes.unshift(data);
    this.savePasses(passes);

    if (window.API && API.isOnline) {
      await API.post('/passes', data);
    }
  },

  async updatePass(id, updates) {
    const passes = this.getPasses();
    const idx = passes.findIndex(p => p.id === id);
    if (idx >= 0) { 
      passes[idx] = { ...passes[idx], ...updates, updatedAt: new Date().toISOString() }; 
      this.savePasses(passes);
    }

    if (window.API && API.isOnline) {
      await API.put(`/passes/${id}`, updates);
    }
  },

  // ---- COMPLAINT METHODS ----
  getComplaints()         { return this.get(this.KEYS.COMPLAINTS, []); },
  saveComplaints(c)       { this.set(this.KEYS.COMPLAINTS, c); },
  getComplaintsByStudent(id) {
    return this.getComplaints().filter(c => c.studentId === id);
  },
  getComplaintById(id) { return this.getComplaints().find(c => c.id === id) || null; },

  async createComplaint(data) {
    const list = this.getComplaints();
    list.unshift(data);
    this.saveComplaints(list);

    if (window.API && API.isOnline) {
      await API.post('/complaints', data);
    }
  },

  async updateComplaint(id, updates) {
    const list = this.getComplaints();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) { 
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() }; 
      this.saveComplaints(list);
    }

    if (window.API && API.isOnline) {
      await API.put(`/complaints/${id}`, updates);
    }
  },

  // ---- ATTENDANCE ----
  getAttendance()          { return this.get(this.KEYS.ATTENDANCE, {}); },
  saveAttendance(att)      { this.set(this.KEYS.ATTENDANCE, att); },
  getStudentAttendance(id) {
    const att = this.getAttendance();
    return att[id] || {};
  },

  async setStudentAttendance(studentId, date, status) {
    const att = this.getAttendance();
    if (!att[studentId]) att[studentId] = {};
    att[studentId][date] = status;
    this.saveAttendance(att);

    if (window.API && API.isOnline) {
      await API.post('/attendance', { studentId, date, status });
    }
  },

  async markAttendanceForAll(date, defaultStatus = 'present') {
    const att = this.getAttendance();
    const promises = [];
    this.getApprovedStudents().forEach(s => {
      if (!att[s.id]) att[s.id] = {};
      if (!att[s.id][date]) {
        att[s.id][date] = defaultStatus;
        if (window.API && API.isOnline) {
          promises.push(API.post('/attendance', { studentId: s.id, date, status: defaultStatus }));
        }
      }
    });
    this.saveAttendance(att);
    if (promises.length) await Promise.all(promises);
  },

  // ---- MESS MENU ----
  getMessMenu()       { return this.get(this.KEYS.MESS_MENU, {}); },
  async saveMessMenu(m)     { 
    this.set(this.KEYS.MESS_MENU, m); 
    if (window.API && API.isOnline) {
      const promises = Object.keys(m).map(day => API.put(`/mess-menu/${day}`, m[day]));
      await Promise.all(promises);
    }
  },

  // ---- NOTICES ----
  getNotices()   { return this.get(this.KEYS.NOTICES, []); },

  async createNotice(notice) {
    const notices = this.getNotices();
    notices.unshift(notice);
    this.set(this.KEYS.NOTICES, notices);

    if (window.API && API.isOnline) {
      await API.post('/notices', notice);
    }
  },

  async deleteNotice(noticeId) {
    const notices = this.getNotices().filter(n => n.id !== noticeId);
    this.set(this.KEYS.NOTICES, notices);

    if (window.API && API.isOnline) {
      await API.delete(`/notices/${noticeId}`);
    }
  },

  // ---- THEME ----
  getTheme()         { return this.get(this.KEYS.THEME, 'dark'); },
  saveTheme(theme)   { this.set(this.KEYS.THEME, theme); },

  // ---- UTILS ----
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2,6)}`;
  },
};

window.Storage = Storage;
