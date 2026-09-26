from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import uuid

from database import get_db, init_db
from mailer import send_registration_email

app = FastAPI(title="HostelEase API", version="1.0.0", description="Backend API for HostelEase Management System")

# Enable CORS for frontend applications (localhost:3000, 127.0.0.1, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# ----------------- PYDANTIC SCHEMAS -----------------

class LoginRequest(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    phone: Optional[str] = None
    parentPhone: Optional[str] = None
    rollNo: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    block: Optional[str] = None
    roomNo: Optional[str] = None
    designation: Optional[str] = None
    status: Optional[str] = "pending"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    parentPhone: Optional[str] = None
    status: Optional[str] = None
    rollNo: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    block: Optional[str] = None
    roomNo: Optional[str] = None
    designation: Optional[str] = None
    password: Optional[str] = None

class PassCreate(BaseModel):
    studentId: str
    studentName: Optional[str] = None
    rollNo: Optional[str] = None
    roomNo: Optional[str] = None
    type: str
    purpose: str
    destination: str
    fromDate: str
    toDate: str
    returnTime: Optional[str] = None
    idCardImage: Optional[str] = None

class PassUpdate(BaseModel):
    status: Optional[str] = None
    wardenNote: Optional[str] = None
    purpose: Optional[str] = None
    destination: Optional[str] = None
    fromDate: Optional[str] = None
    toDate: Optional[str] = None
    returnTime: Optional[str] = None

class ComplaintCreate(BaseModel):
    studentId: str
    studentName: Optional[str] = None
    rollNo: Optional[str] = None
    roomNo: Optional[str] = None
    category: str
    title: str
    description: str

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    adminNote: Optional[str] = None

class AttendanceMark(BaseModel):
    studentId: str
    date: str
    status: str

class NoticeCreate(BaseModel):
    title: str
    content: str
    date: Optional[str] = None
    type: str = "info"

class SmtpConfigRequest(BaseModel):
    host: str = "smtp.gmail.com"
    port: int = 587
    user: str
    password: str
    from_email: Optional[str] = None

# ----------------- HEALTH & SYSTEM -----------------

@app.get("/api/health")
def health_check():
    from mailer import get_smtp_config
    cfg = get_smtp_config()
    has_smtp = bool(cfg.get("user") and cfg.get("password") and cfg.get("user") != "your_email@gmail.com")
    return {
        "status": "ok", 
        "service": "HostelEase Backend (FastAPI + SQLite)", 
        "timestamp": datetime.now().isoformat(),
        "smtp_configured": has_smtp,
        "smtp_user": cfg.get("user") if has_smtp else None
    }

@app.get("/api/smtp-config")
def get_smtp_settings():
    from mailer import get_smtp_config
    cfg = get_smtp_config()
    return {
        "host": cfg.get("host", "smtp.gmail.com"),
        "port": cfg.get("port", 587),
        "user": cfg.get("user", ""),
        "has_password": bool(cfg.get("password")),
        "from_email": cfg.get("from_email", "")
    }

@app.post("/api/smtp-config")
def save_smtp_settings(req: SmtpConfigRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO app_settings (key, value)
    VALUES ('smtp_config', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
    """, (req.json(),))
    conn.commit()
    conn.close()
    return {"success": True, "message": "SMTP settings saved successfully"}

@app.post("/api/smtp-config/test")
def test_smtp_settings(test_email: Optional[str] = None):
    from mailer import send_registration_email
    dummy_student = {
        "id": "u_test",
        "name": "Test Recipient",
        "email": test_email or "test@example.com",
        "password": "testPassword123",
        "rollNo": "TEST01",
        "block": "A Block",
        "roomNo": "101",
        "branch": "Computer Science"
    }
    result = send_registration_email(dummy_student)
    return result

# ----------------- AUTH ROUTER -----------------

@app.post("/api/auth/login")
def login(req: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (req.email.strip(),))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=400, detail="No account found with this email.")

    user = dict(row)
    if user["password"] != req.password:
        raise HTTPException(status_code=400, detail="Incorrect password.")

    if user["role"] == "student" and user["status"] != "approved":
        raise HTTPException(status_code=403, detail="Your account is pending approval by the Warden.")

    if user["status"] == "rejected":
        raise HTTPException(status_code=403, detail="Your account has been rejected. Please contact the Warden.")

    del user["password"]
    return {"success": True, "user": user}

@app.post("/api/auth/register")
def register(req: UserCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (req.email.strip(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = f"u_stu_{uuid.uuid4().hex[:6]}"
    now_iso = datetime.now().isoformat()
    avatar = req.name[0].upper() if req.name else "U"

    cursor.execute("""
    INSERT INTO users (id, name, email, password, role, status, phone, parentPhone, designation, rollNo, branch, year, block, roomNo, avatar, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, req.name, req.email.strip(), req.password, req.role,
        req.status or ("pending" if req.role == "student" else "approved"),
        req.phone, req.parentPhone, req.designation, req.rollNo, req.branch, req.year,
        req.block, req.roomNo, avatar, now_iso, now_iso
    ))
    conn.commit()
    conn.close()

    # Trigger email if student is registered/approved
    email_result = None
    if req.role == "student":
        student_dict = req.dict()
        student_dict["id"] = user_id
        email_result = send_registration_email(student_dict)

    return {
        "success": True, 
        "id": user_id,
        "message": f"Student '{req.name}' registered successfully.",
        "email_delivery": email_result
    }

@app.post("/api/students/register")
def warden_register_student(req: UserCreate):
    # Warden directly registers approved student
    req.status = "approved"
    return register(req)

# ----------------- USERS ROUTER -----------------

@app.get("/api/users")
def get_users(role: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if role:
        cursor.execute("SELECT * FROM users WHERE role = ?", (role,))
    else:
        cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()

    users = []
    for r in rows:
        d = dict(r)
        d.pop("password", None)
        users.append(d)
    return users

@app.get("/api/users/{user_id}")
def get_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    user = dict(row)
    user.pop("password", None)
    return user

@app.put("/api/users/{user_id}")
def update_user(user_id: str, updates: UserUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    fields = []
    values = []
    data = updates.dict(exclude_unset=True)
    for k, v in data.items():
        fields.append(f"{k} = ?")
        values.append(v)

    if fields:
        fields.append("updatedAt = ?")
        values.append(datetime.now().isoformat())
        values.append(user_id)
        sql = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(sql, tuple(values))
        conn.commit()

    conn.close()
    return {"success": True, "message": "User updated successfully"}

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"success": True}

# ----------------- PASSES ROUTER -----------------

@app.get("/api/passes")
def get_passes(studentId: Optional[str] = None, status: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM passes WHERE 1=1"
    params = []
    if studentId:
        query += " AND studentId = ?"
        params.append(studentId)
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY createdAt DESC"

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/passes")
def create_pass(req: PassCreate):
    pass_id = f"pass_{uuid.uuid4().hex[:6]}"
    now_iso = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO passes (id, studentId, studentName, rollNo, roomNo, type, purpose, destination, fromDate, toDate, returnTime, status, idCardImage, wardenNote, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        pass_id, req.studentId, req.studentName, req.rollNo, req.roomNo,
        req.type, req.purpose, req.destination, req.fromDate, req.toDate,
        req.returnTime, "pending", req.idCardImage, "", now_iso, now_iso
    ))
    conn.commit()
    conn.close()

    return {"success": True, "id": pass_id, "message": "Pass application submitted successfully"}

@app.put("/api/passes/{pass_id}")
def update_pass(pass_id: str, updates: PassUpdate):
    conn = get_db()
    cursor = conn.cursor()
    fields = []
    values = []
    for k, v in updates.dict(exclude_unset=True).items():
        fields.append(f"{k} = ?")
        values.append(v)

    if fields:
        fields.append("updatedAt = ?")
        values.append(datetime.now().isoformat())
        values.append(pass_id)
        cursor.execute(f"UPDATE passes SET {', '.join(fields)} WHERE id = ?", tuple(values))
        conn.commit()

    conn.close()
    return {"success": True, "message": "Pass updated"}

# ----------------- COMPLAINTS ROUTER -----------------

@app.get("/api/complaints")
def get_complaints(studentId: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if studentId:
        cursor.execute("SELECT * FROM complaints WHERE studentId = ? ORDER BY createdAt DESC", (studentId,))
    else:
        cursor.execute("SELECT * FROM complaints ORDER BY createdAt DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/complaints")
def create_complaint(req: ComplaintCreate):
    cid = f"comp_{uuid.uuid4().hex[:6]}"
    now_iso = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO complaints (id, studentId, studentName, rollNo, roomNo, category, title, description, status, adminNote, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cid, req.studentId, req.studentName, req.rollNo, req.roomNo,
        req.category, req.title, req.description, "pending", "", now_iso, now_iso
    ))
    conn.commit()
    conn.close()
    return {"success": True, "id": cid, "message": "Complaint lodged successfully"}

@app.put("/api/complaints/{comp_id}")
def update_complaint(comp_id: str, updates: ComplaintUpdate):
    conn = get_db()
    cursor = conn.cursor()
    fields = []
    values = []
    for k, v in updates.dict(exclude_unset=True).items():
        fields.append(f"{k} = ?")
        values.append(v)

    if fields:
        fields.append("updatedAt = ?")
        values.append(datetime.now().isoformat())
        values.append(comp_id)
        cursor.execute(f"UPDATE complaints SET {', '.join(fields)} WHERE id = ?", tuple(values))
        conn.commit()

    conn.close()
    return {"success": True, "message": "Complaint updated"}

# ----------------- ATTENDANCE ROUTER -----------------

@app.get("/api/attendance")
def get_attendance(studentId: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if studentId:
        cursor.execute("SELECT date, status FROM attendance WHERE studentId = ?", (studentId,))
        rows = cursor.fetchall()
        result = {r["date"]: r["status"] for r in rows}
    else:
        cursor.execute("SELECT studentId, date, status FROM attendance")
        rows = cursor.fetchall()
        result = {}
        for r in rows:
            sid = r["studentId"]
            if sid not in result:
                result[sid] = {}
            result[sid][r["date"]] = r["status"]

    conn.close()
    return result

@app.post("/api/attendance")
def mark_attendance(req: AttendanceMark):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO attendance (studentId, date, status)
    VALUES (?, ?, ?)
    ON CONFLICT(studentId, date) DO UPDATE SET status=excluded.status
    """, (req.studentId, req.date, req.status))
    conn.commit()
    conn.close()
    return {"success": True}

# ----------------- MESS MENU ROUTER -----------------

@app.get("/api/mess-menu")
def get_mess_menu():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT day, menu_json FROM mess_menu")
    rows = cursor.fetchall()
    conn.close()
    menu = {}
    for r in rows:
        menu[r["day"]] = json.loads(r["menu_json"])
    return menu

@app.put("/api/mess-menu/{day}")
def update_mess_menu_day(day: str, menu_data: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO mess_menu (day, menu_json)
    VALUES (?, ?)
    ON CONFLICT(day) DO UPDATE SET menu_json=excluded.menu_json
    """, (day, json.dumps(menu_data)))
    conn.commit()
    conn.close()
    return {"success": True}

# ----------------- NOTICES ROUTER -----------------

@app.get("/api/notices")
def get_notices():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notices ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/notices")
def create_notice(req: NoticeCreate):
    nid = f"n_{uuid.uuid4().hex[:4]}"
    date_str = req.date or datetime.now().strftime("%Y-%m-%d")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO notices (id, title, content, date, type)
    VALUES (?, ?, ?, ?, ?)
    """, (nid, req.title, req.content, date_str, req.type))
    conn.commit()
    conn.close()
    return {"success": True, "id": nid}

@app.delete("/api/notices/{notice_id}")
def delete_notice(notice_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notices WHERE id = ?", (notice_id,))
    conn.commit()
    conn.close()
    return {"success": True}
