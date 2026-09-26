@echo off
title HostelEase Python Backend (FastAPI + SQLite)
echo Starting HostelEase Backend on http://127.0.0.1:8000...
echo Interactive API docs available at http://127.0.0.1:8000/docs
echo.
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
