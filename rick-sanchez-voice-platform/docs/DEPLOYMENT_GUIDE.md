# Deployment Guide

## Local / dev
docker compose -f docker-compose.yml up --build

## Production checklist
- Rotate API keys; use s2.1-pro (not -free).
- Put Caddy/Nginx in front with HTTPS; expose only 80/443.
- Set VITE_ORCHESTRATOR_URL to the public https URL at build time.
- Swap in-memory job store for Redis.
- Enable log rotation; set restart: unless-stopped (already set).
- Monitor Fish credit balance.

## Resource allocation
Orchestrator 0.5-1 core / 256-512MB; PWA/Nginx 0.25 core / 64-128MB;
FastAPI TTS 0.5 core / 256MB; Discord bot 0.25 core / 128MB.
