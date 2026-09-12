import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = (userId?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('[Socket.IO Client] Connected to real-time telemetry server.');
      if (userId) {
        socket?.emit('join_user', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO Client] Disconnected from telemetry server.');
    });
  } else if (userId && socket.connected) {
    socket.emit('join_user', userId);
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
