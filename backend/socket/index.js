import { Server as SocketIOServer } from 'socket.io';

export const initSocketServer = (httpServer, clientUrl) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: clientUrl || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', socket => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_user', userId => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room user:${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
