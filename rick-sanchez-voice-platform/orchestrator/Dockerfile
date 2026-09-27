FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && rm -rf /var/lib/apt/lists/*

COPY orchestrator/ /app/
COPY skill/rick-sanchez-voice/scripts/fish_voice /app/fish_voice

RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -e /app/fish_voice

EXPOSE 8002

ENV FISH_API_KEY=""
ENV FISH_VOICE_ID="d2e75a3e3fd6419893057c02a375a113"
ENV FISH_MODEL="s2.1-pro-free"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
