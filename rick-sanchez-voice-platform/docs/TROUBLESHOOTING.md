# Troubleshooting

- HTTP 402: out of credit -> use s2.1-pro-free or top up.
- HTTP 403: bad/expired API key -> rotate FISH_API_KEY.
- Timeout: long text -> split into chunks or use WebSocket streaming.
- PWA can't reach orchestrator: check VITE_ORCHESTRATOR_URL (build-time var).
- Discord slash commands missing: re-invite with applications.commands scope.
