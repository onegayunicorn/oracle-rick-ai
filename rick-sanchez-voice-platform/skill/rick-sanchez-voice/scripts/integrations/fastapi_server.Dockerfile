FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY skill/rick-sanchez-voice/scripts/fish_voice /app/fish_voice
COPY skill/rick-sanchez-voice/scripts/integrations/requirements.txt /app/requirements.txt
COPY skill/rick-sanchez-voice/scripts/integrations/fastapi_server.py /app/
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir -e /app/fish_voice
EXPOSE 8000
CMD ["python", "fastapi_server.py"]
