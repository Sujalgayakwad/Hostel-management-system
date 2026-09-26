import sqlite3
import json
import os
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hostel.db")

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        phone TEXT,
        parentPhone TEXT,
        designation TEXT,
        rollNo TEXT,
        branch TEXT,
        year TEXT,
        block TEXT,
        roomNo TEXT,
        avatar TEXT,
        createdAt TEXT,
        updatedAt TEXT
    )
    """)

    # Passes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS passes (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        studentName TEXT,
        rollNo TEXT,
        roomNo TEXT,
        type TEXT NOT NULL,
        purpose TEXT NOT NULL,
        destination TEXT NOT NULL,
        fromDate TEXT NOT NULL,
        toDate TEXT NOT NULL,
        returnTime TEXT,
        status TEXT NOT NULL,
        idCardImage TEXT,
        wardenNote TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        FOREIGN KEY (studentId) REFERENCES users(id)
    )
    """)

    # Complaints table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        studentName TEXT,
        rollNo TEXT,
        roomNo TEXT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        adminNote TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        FOREIGN KEY (studentId) REFERENCES users(id)
    )
    """)

    # Attendance table (studentId, date, status)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        studentId TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        PRIMARY KEY (studentId, date),
        FOREIGN KEY (studentId) REFERENCES users(id)
    )
    """)

    # Mess Menu table (key-value storage for day JSON)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mess_menu (
        day TEXT PRIMARY KEY,
        menu_json TEXT NOT NULL
    )
    """)

    # Notices table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL
    )
    """)

    # Settings / key-value store
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed if users table is empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        seed_initial_data(conn)

    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()

    # Seed Users
    users = [
        ('u_admin_01', 'Dr. R. Sharma', 'admin@hostel.com', 'admin123', 'admin', 'approved', '9876543210', None, 'Chief Warden', None, None, None, None, None, 'R', '2024-01-01T00:00:00', now_iso),
        ('u_sec_01', 'Ravi Kumar', 'security@hostel.com', 'security123', 'security', 'approved', '9876000111', None, 'Security Guard', None, None, None, None, None, 'R', '2024-01-02T00:00:00', now_iso),
        ('u_stu_01', 'Rahul Verma', 'rahul@hostel.com', 'student123', 'student', 'approved', '9876543220', '9876543219', None, 'CS21B001', 'Computer Science', '3rd Year', 'A Block', 'A-204', 'R', '2024-01-10T00:00:00', now_iso),
        ('u_stu_02', 'Priya Patel', 'priya@hostel.com', 'student123', 'student', 'approved', '9876543230', '9876543229', None, 'EC21B042', 'Electronics & Comm.', '2nd Year', 'B Block', 'B-108', 'P', '2024-01-11T00:00:00', now_iso),
    ]
    cursor.executemany("""
    INSERT INTO users (id, name, email, password, role, status, phone, parentPhone, designation, rollNo, branch, year, block, roomNo, avatar, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, users)

    # Seed Passes
    passes = [
        ('pass_001', 'u_stu_01', 'Rahul Verma', 'CS21B001', 'A-204', 'out-pass', 'Hospital visit – Dental appointment', 'City Hospital, MG Road', '2024-09-10', '2024-09-10', '18:00', 'approved', None, 'Approved. Please carry your ID.', '2024-09-09T10:30:00', '2024-09-09T11:00:00'),
        ('pass_002', 'u_stu_02', 'Priya Patel', 'EC21B042', 'B-108', 'home-pass', 'Diwali vacation', 'Rajkot, Gujarat', '2024-10-30', '2024-11-05', '20:00', 'pending', None, '', '2024-10-28T09:00:00', '2024-10-28T09:00:00'),
    ]
    cursor.executemany("""
    INSERT INTO passes (id, studentId, studentName, rollNo, roomNo, type, purpose, destination, fromDate, toDate, returnTime, status, idCardImage, wardenNote, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, passes)

    # Seed Complaints
    complaints = [
        ('comp_001', 'u_stu_01', 'Rahul Verma', 'CS21B001', 'A-204', 'Infrastructure', 'Water leakage in bathroom', 'There is continuous water leakage from the tap in our bathroom which is causing water wastage and slippery floor.', 'in-progress', 'Maintenance team scheduled for Friday.', '2024-09-15T08:00:00', '2024-09-16T10:00:00'),
        ('comp_002', 'u_stu_02', 'Priya Patel', 'EC21B042', 'B-108', 'Mess & Food', 'Food quality has deteriorated', 'The quality of food served in the mess has deteriorated significantly over the past week. Rice is undercooked and dal is too watery.', 'pending', '', '2024-09-18T12:00:00', '2024-09-18T12:00:00'),
    ]
    cursor.executemany("""
    INSERT INTO complaints (id, studentId, studentName, rollNo, roomNo, category, title, description, status, adminNote, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, complaints)

    # Seed Notices
    notices = [
        ('n1', 'Hostel Day Fest', 'Annual hostel day celebrations on October 15, 2024. All residents please participate!', '2024-09-20', 'event'),
        ('n2', 'Water Supply Interruption', 'Water supply will be interrupted on Sep 25 from 10 AM – 2 PM due to maintenance work.', '2024-09-22', 'warning'),
        ('n3', 'Room Inspection', 'Room inspection will be conducted on September 30th. Please keep your rooms clean and tidy.', '2024-09-19', 'info'),
    ]
    cursor.executemany("""
    INSERT INTO notices (id, title, content, date, type)
    VALUES (?, ?, ?, ?, ?)
    """, notices)

    # Seed Mess Menu
    menu_data = {
      "Monday": {
        "breakfast": { "items": ["Idli Sambar","Coconut Chutney","Boiled Egg","Tea/Coffee"], "type":"veg", "time":"7:30 – 9:00 AM" },
        "lunch":     { "items": ["Rice","Rajma Curry","Roti","Salad","Buttermilk"], "type":"veg", "time":"12:00 – 2:00 PM" },
        "snacks":    { "items": ["Samosa","Masala Chai"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Dal Makhani","Jeera Rice","Papad","Pickle"], "type":"veg", "time":"7:30 – 9:30 PM" }
      },
      "Tuesday": {
        "breakfast": { "items": ["Poha","Sprouts","Banana","Tea/Coffee"], "type":"veg", "time":"7:30 – 9:00 AM" },
        "lunch":     { "items": ["Rice","Chicken Curry","Roti","Raita","Salad"], "type":"non-veg", "time":"12:00 – 2:00 PM" },
        "snacks":    { "items": ["Bread Pakora","Green Chutney"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Paneer Bhurji","Dal","Rice","Pickle"], "type":"veg", "time":"7:30 – 9:30 PM" }
      },
      "Wednesday": {
        "breakfast": { "items": ["Paratha","Curd","Pickle","Tea/Coffee"], "type":"veg", "time":"7:30 – 9:00 AM" },
        "lunch":     { "items": ["Rice","Chhole","Roti","Salad","Lassi"], "type":"veg", "time":"12:00 – 2:00 PM" },
        "snacks":    { "items": ["Vada Pav","Tamarind Chutney"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Mutton Curry","Rice","Salad","Raita"], "type":"non-veg", "time":"7:30 – 9:30 PM" }
      },
      "Thursday": {
        "breakfast": { "items": ["Dosa","Sambar","Red Chutney","Tea/Coffee"], "type":"veg", "time":"7:30 – 9:00 AM" },
        "lunch":     { "items": ["Rice","Dal Fry","Aloo Gobi","Roti","Papad"], "type":"veg", "time":"12:00 – 2:00 PM" },
        "snacks":    { "items": ["Fried Rice","Sauce"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Egg Curry","Dal","Rice","Pickle"], "type":"non-veg", "time":"7:30 – 9:30 PM" }
      },
      "Friday": {
        "breakfast": { "items": ["Upma","Chutney","Banana","Tea/Coffee"], "type":"veg", "time":"7:30 – 9:00 AM" },
        "lunch":     { "items": ["Biryani (Special)","Raita","Salad","Papad"], "type":"special", "time":"12:00 – 2:00 PM" },
        "snacks":    { "items": ["Jalebi","Milk"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Paneer Matar","Dal","Rice","Kheer"], "type":"veg", "time":"7:30 – 9:30 PM" }
      },
      "Saturday": {
        "breakfast": { "items": ["Puri Bhaji","Tea/Coffee"], "type":"veg", "time":"8:00 – 9:30 AM" },
        "lunch":     { "items": ["Rice","Fish Curry","Roti","Dal","Salad"], "type":"non-veg", "time":"12:00 – 2:00 PM" },
        "snacks":    { "items": ["Maggi Noodles","Tea"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Mix Veg","Dal Makhani","Rice","Ice Cream"], "type":"veg", "time":"7:30 – 9:30 PM" }
      },
      "Sunday": {
        "breakfast": { "items": ["Chole Bhature","Sweet Lassi"], "type":"special", "time":"8:30 – 10:00 AM" },
        "lunch":     { "items": ["Chicken Biryani","Mutton Curry","Roti","Raita","Gulab Jamun"], "type":"special", "time":"12:30 – 2:30 PM" },
        "snacks":    { "items": ["Pakodas","Chutney","Chai"], "type":"veg", "time":"5:00 – 6:00 PM" },
        "dinner":    { "items": ["Roti","Paneer Butter Masala","Dal","Rice","Halwa"], "type":"veg", "time":"7:30 – 9:30 PM" }
      }
    }
    for day, m in menu_data.items():
        cursor.execute("INSERT INTO mess_menu (day, menu_json) VALUES (?, ?)", (day, json.dumps(m)))

    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_FILE)
