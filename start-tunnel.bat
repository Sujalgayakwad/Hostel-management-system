@echo off
title HostelEase Cloudflare Tunnel
echo Starting Cloudflare Tunnel for HostelEase on http://localhost:3000...
echo.
cloudflared tunnel --url http://localhost:3000
pause
