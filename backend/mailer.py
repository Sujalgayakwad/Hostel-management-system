import smtplib
import os
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

from database import get_db

def get_smtp_config() -> Dict[str, Any]:
    # 1. First check SQLite app_settings
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT value FROM app_settings WHERE key = 'smtp_config'")
        row = cursor.fetchone()
        conn.close()
        if row and row[0]:
            cfg = json.loads(row[0])
            if cfg.get("user") and cfg.get("password"):
                return {
                    "host": cfg.get("host", "smtp.gmail.com"),
                    "port": int(cfg.get("port", 587)),
                    "user": cfg.get("user", ""),
                    "password": cfg.get("password", ""),
                    "from_email": cfg.get("from_email", f"HostelEase <{cfg.get('user')}>")
                }
    except Exception as e:
        pass

    # 2. Check backend/.env or environment variables
    env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_file):
        try:
            with open(env_file, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip().strip("'\"")
        except Exception:
            pass

    return {
        "host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASSWORD", ""),
        "from_email": os.getenv("SMTP_FROM", "HostelEase <no-reply@hostel.com>")
    }

def generate_welcome_email_html(student: Dict[str, Any]) -> str:
    name = student.get("name", "Student")
    email = student.get("email", "")
    password = student.get("password", "student123")
    roll_no = student.get("rollNo", "—")
    room_no = student.get("roomNo", "—")
    block = student.get("block", "—")
    branch = student.get("branch", "—")
    portal_url = "http://localhost:3000"

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to HostelEase</title>
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }}
        .email-container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 36px 30px; text-align: center; color: #ffffff; }}
        .logo {{ font-size: 42px; margin-bottom: 8px; }}
        .title {{ font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.02em; }}
        .subtitle {{ font-size: 14px; opacity: 0.9; margin-top: 6px; }}
        .body-content {{ padding: 32px 30px; color: #334155; line-height: 1.6; }}
        .greeting {{ font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }}
        .credential-box {{ background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 24px 0; }}
        .cred-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }}
        .cred-row:last-child {{ border-bottom: none; }}
        .cred-label {{ color: #64748b; font-weight: 500; }}
        .cred-val {{ font-weight: 700; color: #0f172a; font-family: monospace, monospace; }}
        .btn {{ display: inline-block; background: #6366f1; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 16px 0; text-align: center; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }}
        .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; }}
        .highlight {{ color: #6366f1; font-weight: 600; }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">🏨</div>
          <h1 class="title">HostelEase</h1>
          <div class="subtitle">Official Hostel Management System</div>
        </div>
        <div class="body-content">
          <div class="greeting">Hello {name},</div>
          <p>Congratulations! Your hostel registration has been approved by the <strong>Chief Warden</strong>. Your student account has been created and you can now access the HostelEase portal.</p>
          
          <div class="credential-box">
            <div style="font-weight: 700; color: #475569; margin-bottom: 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">🔑 Your Account Credentials</div>
            <div class="cred-row">
              <span class="cred-label">Login Email:</span>
              <span class="cred-val">{email}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Password:</span>
              <span class="cred-val">{password}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Roll Number:</span>
              <span class="cred-val">{roll_no}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Allocated Room:</span>
              <span class="cred-val">{block} – Room {room_no}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Department:</span>
              <span class="cred-val">{branch}</span>
            </div>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="{portal_url}" class="btn" target="_blank">Sign in to Student Portal &rarr;</a>
          </div>

          <p style="font-size: 13px; color: #64748b;">
            <strong>Important Tips:</strong><br>
            • Please log in and change your default password from the Settings menu.<br>
            • You can apply for Day Out-Passes & Home-Passes directly from your dashboard.<br>
            • Daily mess menu and notice board updates are accessible 24/7.
          </p>
        </div>
        <div class="footer">
          HostelEase Management · Chief Warden Office<br>
          This is an automated notification. If you did not request this, please contact hostel administration.
        </div>
      </div>
    </body>
    </html>
    """

def send_registration_email(student: Dict[str, Any]) -> Dict[str, Any]:
    recipient = student.get("email")
    student_name = student.get("name", "Student")
    html_content = generate_welcome_email_html(student)
    subject = f"Welcome to HostelEase – Your Hostel Account Credentials ({student_name})"

    cfg = get_smtp_config()
    smtp_user = cfg.get("user")
    smtp_password = cfg.get("password")
    smtp_host = cfg.get("host")
    smtp_port = cfg.get("port")
    smtp_from = cfg.get("from_email")

    # Check if SMTP credentials are provided
    if not smtp_user or smtp_user == "your_email@gmail.com" or not smtp_password:
        # Fallback to simulated delivery
        print(f"[Preview Mode] Rendered welcome email for {recipient} (SMTP credentials not configured yet)")
        return {
            "success": True,
            "mode": "preview",
            "recipient": recipient,
            "subject": subject,
            "html": html_content,
            "message": f"SMTP not configured. Email preview generated for {recipient}."
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_from
        msg["To"] = recipient

        part = MIMEText(html_content, "html")
        msg.attach(part)

        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=12)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=12)
            server.ehlo()
            server.starttls()
            server.ehlo()

        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_from, [recipient], msg.as_string())
        server.quit()

        print(f"[Live SMTP] Welcome email successfully sent to {recipient}")
        return {
            "success": True,
            "mode": "live",
            "recipient": recipient,
            "subject": subject,
            "html": html_content,
            "message": f"Welcome email sent successfully to {recipient} via live SMTP ({smtp_host})."
        }
    except Exception as e:
        print(f"[SMTP Error] Failed to send email to {recipient}: {e}")
        return {
            "success": False,
            "mode": "error_preview",
            "recipient": recipient,
            "subject": subject,
            "html": html_content,
            "error": str(e),
            "message": f"SMTP delivery failed: {str(e)}"
        }
