import sqlite3, json, os

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hostel.db")
conn = sqlite3.connect(db_path)
c = conn.cursor()
smtp_val = json.dumps({
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "sujalgayakwad119@gmail.com",
    "password": "iyhp ixuv fvqm sadb",
    "from_email": "HostelEase Administration <sujalgayakwad119@gmail.com>"
})
c.execute("""
INSERT INTO app_settings (key, value)
VALUES ('smtp_config', ?)
ON CONFLICT(key) DO UPDATE SET value = excluded.value
""", (smtp_val,))
conn.commit()
conn.close()
print("SQLite app_settings updated with live SMTP configuration!")
