# Discord Bot Setup

1. Create app at discord.com/developers -> Bot -> copy token.
2. OAuth2 redirect: `http://localhost:8001/callback`; scopes: `bot`, `applications.commands`.
3. Bot permissions: Send Messages, Attach Files.
4. `cp .env.example .env` -> fill DISCORD_* vars.
5. `docker compose up -d discord-bot`.
6. Visit `http://localhost:8001/invite` -> select server -> Authorize.
7. Commands: `/rick "text"` -> generates + sends MP3; `/rick_status` -> connectivity check.
