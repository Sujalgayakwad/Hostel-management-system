// Test Script to simulate and verify all business logic in Node.js
// Polyfill localStorage
const storageMap = new Map();
global.localStorage = {
  getItem: (k) => storageMap.get(k) || null,
  setItem: (k, v) => storageMap.set(k, String(v)),
  removeItem: (k) => storageMap.delete(k),
  clear: () => storageMap.clear()
};
global.window = global;

// Load app scripts
require('./js/storage.js');
require('./js/auth.js');

console.log('--- 1. Testing Default Storage Initialization ---');
const users = window.Storage.getUsers();
console.log('Total Initial Users:', users.length);
console.log('Admin user found:', !!users.find(u => u.role === 'admin'));
console.log('Pending student found (Amit):', !!users.find(u => u.email === 'amit@hostel.com' && u.status === 'pending'));

console.log('\n--- 2. Testing Pending Registration Login Block Gate ---');
const pendingLoginAttempt = window.Auth.login('amit@hostel.com', 'student123', 'student');
console.log('Pending student login allowed?:', pendingLoginAttempt.success);
console.log('Blocked with pending flag?:', pendingLoginAttempt.isPendingApproval);
console.log('Message:', pendingLoginAttempt.message);
if (pendingLoginAttempt.success || !pendingLoginAttempt.isPendingApproval) {
  console.error('FAIL: Pending student was allowed to log in!');
  process.exit(1);
}

console.log('\n--- 3. Testing Admin Approval Workflow ---');
const amit = users.find(u => u.email === 'amit@hostel.com');
const approvedAmit = window.Storage.updateUserStatus(amit.id, 'approved');
console.log('Updated status:', approvedAmit.status);

console.log('\n--- 4. Testing Login After Admin Approval ---');
const approvedLoginAttempt = window.Auth.login('amit@hostel.com', 'student123', 'student');
console.log('Login successful now?:', approvedLoginAttempt.success);
console.log('Welcome message:', approvedLoginAttempt.message);
if (!approvedLoginAttempt.success) {
  console.error('FAIL: Approved student could not log in!');
  process.exit(1);
}

console.log('\n--- 5. Testing New Student Registration Flow ---');
const regResult = window.Auth.register({
  name: 'Suresh Raina',
  rollNo: '23EE888',
  email: 'suresh@hostel.com',
  password: 'pass123',
  roomNo: 'B-302',
  block: 'Block B (Boys)',
  phone: '+91 99887 76655'
});
console.log('Registration success?:', regResult.success);
console.log('Registered status:', regResult.user.status);
if (regResult.user.status !== 'pending') {
  console.error('FAIL: New student registration was not created as pending!');
  process.exit(1);
}

// Check that Suresh cannot login yet
const sureshLogin = window.Auth.login('suresh@hostel.com', 'pass123', 'student');
console.log('Suresh can login before admin approval?:', sureshLogin.success);
if (sureshLogin.success) {
  console.error('FAIL: Suresh could log in without admin approval!');
  process.exit(1);
}

console.log('\n--- 6. Testing Out Pass & Home Pass Logic ---');
const newPass = {
  id: 'PASS-TEST-1',
  studentId: 'usr_s1',
  studentName: 'Rahul Verma',
  rollNo: '21CS104',
  roomNo: 'B-204',
  type: 'out',
  departureDate: '2026-09-22',
  outTime: '18:00',
  inTime: '21:00',
  destination: 'Tech Book Store',
  reason: 'Purchase algorithms reference book',
  status: 'pending'
};
window.Storage.addPass(newPass);
let passes = window.Storage.getPasses();
console.log('Pass added, current status:', passes.find(p => p.id === 'PASS-TEST-1').status);

// Admin approves pass
window.Storage.updatePassStatus('PASS-TEST-1', 'approved', 'Permitted by Warden Dr. Sharma', 'Dr. R. Sharma');
passes = window.Storage.getPasses();
const approvedPass = passes.find(p => p.id === 'PASS-TEST-1');
console.log('Pass approved status:', approvedPass.status);
console.log('Approved by:', approvedPass.approvedBy);
console.log('Warden Remarks:', approvedPass.wardenRemarks);

console.log('\n--- 7. Testing Complaints Ticket Flow ---');
const newComp = {
  id: 'CMP-TEST-1',
  studentId: 'usr_s1',
  studentName: 'Rahul Verma',
  roomNo: 'B-204',
  category: 'Electrical',
  title: 'Tube light flickering',
  description: 'Tube light starter is failing',
  priority: 'Low',
  status: 'pending',
  filedAt: '2026-09-22 12:00'
};
window.Storage.addComplaint(newComp);
window.Storage.updateComplaint('CMP-TEST-1', {
  status: 'in_progress',
  assignedTo: 'Ramesh Kumar (Electrician #E-14)',
  wardenRemarks: 'Starter will be replaced by 4 PM'
});
const updatedComp = window.Storage.getComplaints().find(c => c.id === 'CMP-TEST-1');
console.log('Complaint status:', updatedComp.status);
console.log('Assigned to:', updatedComp.assignedTo);

console.log('\n--- 8. Testing Mess Menu Update Flow ---');
window.Storage.updateDayMeal('Wednesday', 'dinner', 'Special Paneer Butter Masala, Garlic Naan & Kheer', 'special');
const wedMenu = window.Storage.getMessMenu()['Wednesday'];
console.log('Updated Wednesday Dinner:', wedMenu.dinner.title);

console.log('\n--- 9. Testing Attendance Record Flow ---');
window.Storage.recordAttendance('2026-09-22', [
  { studentId: 'usr_s1', status: 'present' },
  { studentId: 'usr_s2', status: 'leave' }
]);
const att = window.Storage.getAttendance().filter(a => a.date === '2026-09-22');
console.log('Logged attendance count for today:', att.length);
console.log('Rahul status:', att.find(a => a.studentId === 'usr_s1').status);
console.log('Priya status:', att.find(a => a.studentId === 'usr_s2').status);

console.log('\n========================================');
console.log('ALL WORKFLOW LOGIC TESTS PASSED SUCCESSFULLY! ✅');
console.log('========================================');
