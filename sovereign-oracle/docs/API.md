# API

## HTTP
- GET /healthz -> { status, tick }
- GET /api/state -> NexusState

## WebSocket (ws://host:3000/socket.io/?token=...)
Server -> client: { type: 'state', state: NexusState } @ 20Hz
Client -> server: { type: 'sensor', payload: SensorPayload }
                  { type: 'cartridge', manifest: CartridgeManifest }
