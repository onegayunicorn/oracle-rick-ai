"""Discord bot: /rick slash command -> TTS MP3 attachment. Includes OAuth invite server."""
import os
import asyncio
import aiohttp
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse

import discord
from discord import app_commands

try:
    from fish_voice import FishVoiceClient
except ImportError:
    FishVoiceClient = None

DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID", "")
DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET", "")
DISCORD_REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI", "http://localhost:8001/callback")
oauth_states: set = set()

# ---- FastAPI auth server ----
auth_app = FastAPI(docs_url=None, redoc_url=None)


@auth_app.get("/invite")
async def invite():
    state = os.urandom(16).hex()
    oauth_states.add(state)
    if len(oauth_states) > 1000:
        oauth_states.clear()
        oauth_states.add(state)
    url = (
        "https://discord.com/oauth2/authorize"
        f"?client_id={DISCORD_CLIENT_ID}"
        "&permissions=274877993088"  # Send Messages, Attach Files
        "&scope=bot%20applications.commands"
        f"&redirect_uri={DISCORD_REDIRECT_URI}"
        "&response_type=code"
        f"&state={state}"
    )
    return RedirectResponse(url)


@auth_app.get("/callback")
async def callback(code: str, state: str, request: Request):
    if state not in oauth_states:
        raise HTTPException(status_code=403, detail="Invalid state")
    oauth_states.discard(state)
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": DISCORD_CLIENT_ID,
                "client_secret": DISCORD_CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": DISCORD_REDIRECT_URI,
            },
        ) as resp:
            if resp.status != 200:
                raise HTTPException(status_code=400, detail="Token exchange failed")
    return {"status": "ok", "message": "Bot authorized. You may close this window."}


# ---- Discord bot ----
class RickBot(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)

    async def setup_hook(self):
        await self.tree.sync()


bot = RickBot()


@bot.tree.command(name="rick", description="Generate a Rick Sanchez voice line")
@app_commands.describe(text="Text to speak (use [laugh] [whisper] etc.)")
async def rick(interaction: discord.Interaction, text: str):
    await interaction.response.defer()
    try:
        if FishVoiceClient is None:
            await interaction.followup.send("TTS client unavailable.", ephemeral=True)
            return
        client = FishVoiceClient()
        audio = client.synthesize(text)
        f = discord.File(
            discord.utils._io.BytesIO(audio) if hasattr(discord.utils, "_io") else __import__("io").BytesIO(audio),
            filename="rick.mp3",
        )
        await interaction.followup.send(content=f'"{text}"', file=f)
    except Exception as e:
        await interaction.followup.send(f"TTS failed: {e}", ephemeral=True)


@bot.tree.command(name="rick_status", description="Check TTS connectivity")
async def rick_status(interaction: discord.Interaction):
    ok = FishVoiceClient is not None and bool(os.getenv("FISH_API_KEY"))
    await interaction.response.send_message(f"TTS: {'online' if ok else 'offline'}", ephemeral=True)


async def run():
    import uvicorn
    config = uvicorn.Config(auth_app, host="0.0.0.0", port=8001, log_level="warning")
    server = uvicorn.Server(config)
    await asyncio.gather(
        server.serve(),
        bot.start(os.getenv("DISCORD_BOT_TOKEN", "")),
    )


if __name__ == "__main__":
    asyncio.run(run())
