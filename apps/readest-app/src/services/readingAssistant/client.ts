import { io, Socket } from 'socket.io-client';

import type { ServerMessages, ClientMessages, UserAction } from './types';

export interface Client {
  sendUserAction: (action: UserAction) => void;
  disconnect: () => void;
}

export const buildClient = (): Client => {
  const socket: Socket<ServerMessages, ClientMessages> = io();

  return {
    sendUserAction: (action: UserAction) => {
      const timestamp = new Date().toISOString();

      socket.emit('userAction', { action, timestamp });
    },
    disconnect: () => {
      if (socket) {
        socket.disconnect();
      }
    },
  };
};
