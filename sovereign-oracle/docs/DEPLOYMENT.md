# Deployment

## Dev
`docker compose -f deploy/docker-compose.dev.yml up --build`

## Prod
Push a `v*.*.*` tag -> GHCR builds backend/frontend images -> SSH deploy via
`deploy-backend.yml` / `deploy-frontend.yml`. Caddy terminates TLS at the edge.

## Android
`cd android-bridge && ./gradlew assembleRelease` -> sideload APK. Foreground
service survives Samsung One UI process killer via
`FOREGROUND_SERVICE_CONNECTED_DEVICE` + battery-optimization exemption.
