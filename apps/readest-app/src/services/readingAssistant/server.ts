import { Server as HttpServer } from 'http';

import { Server as SocketIOServer } from 'socket.io';

import type { ClientMessages, ServerMessages } from './types';

if (typeof window !== 'undefined') {
  throw new Error('This module cannot be imported from a Client Component module.');
}

export interface Server {
  io: SocketIOServer<ClientMessages, ServerMessages>;
}

export const buildServer = (httpServer: HttpServer, isDev: boolean = false): Server => {
  const io = new SocketIOServer<ClientMessages, ServerMessages>(httpServer, {
    cors: {
      origin: isDev ? 'http://localhost:3000' : false,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('userAction', (data) => {
      console.log('Received user action:', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return {
    io,
  };
};
