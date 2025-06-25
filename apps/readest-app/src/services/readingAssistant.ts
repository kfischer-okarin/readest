import { io, Socket } from 'socket.io-client';

type TextSelectedAction = {
  type: 'textSelected';
  text: string;
  cfi: string;
};

type HighlightCreatedAction = {
  type: 'highlightCreated';
  text: string;
  cfi: string;
};

export type UserAction = TextSelectedAction | HighlightCreatedAction;

type ServerMessages = object;

type ClientMessages = {
  userAction: (data: { action: UserAction; timestamp: string }) => void;
};

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
