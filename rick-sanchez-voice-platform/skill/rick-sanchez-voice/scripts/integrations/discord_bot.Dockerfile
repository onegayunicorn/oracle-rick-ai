FROM python:3.12-slim
WORKDIR /app
COPY skill/rick-sanchez-voice/scripts/fish_voice /app/fish_voice
COPY skill/rick-sanchez-voice/scripts/integrations/requirements.txt /app/requirements.txt
COPY skill/rick-sanchez-voice/scripts/integrations/discord_bot.py /app/
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir -e /app/fish_voice
EXPOSE 8001
CMD ["python", "discord_bot.py"]
