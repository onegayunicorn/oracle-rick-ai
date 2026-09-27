// Socket.io / WebSocket server with JWT auth (production hardening).
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.AUTH_TOKEN || 'dev-secret-change-me';

export function attachWs(server: any) {
  const io = new Server(server, { path: '/socket.io/', cors: { origin: '*' } });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.emit('hello', { id: socket.id });
  });

  return io;
}
