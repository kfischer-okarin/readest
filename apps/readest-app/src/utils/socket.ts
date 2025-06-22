import { io, Socket } from 'socket.io-client';

export type Message = {
  text: string;
  timestamp: string;
};

// TypeScript interfaces for Socket.IO message types
export interface ServerMessages {
  message: (message: Message) => void;
}

export interface ClientMessages {
  message: (message: Message) => void;
}

let socket: Socket<ServerMessages, ClientMessages> | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io({
      autoConnect: false,
    });
  }
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const sendMessage = (message: string) => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('message', {
      text: message,
      timestamp: new Date().toISOString(),
    });
  }
};

export const onMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  if (socket) {
    socket.on('message', callback);
  }
};

export const offMessage = (callback?: (message: Message) => void) => {
  const socket = getSocket();
  if (socket) {
    if (callback) {
      socket.off('message', callback);
    } else {
      socket.off('message');
    }
  }
};
