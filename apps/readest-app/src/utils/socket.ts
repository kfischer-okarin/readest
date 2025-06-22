import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io({
      autoConnect: false,
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const connectSocket = (): void => {
  const socket = getSocket();
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = (): void => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const sendMessage = (message: string): void => {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit('message', { text: message });
  }
};

export const onMessage = (callback: (data: any) => void): void => {
  const socket = getSocket();
  if (socket) {
    socket.on('message', callback);
  }
};

export const offMessage = (callback?: (data: any) => void): void => {
  const socket = getSocket();
  if (socket) {
    if (callback) {
      socket.off('message', callback);
    } else {
      socket.off('message');
    }
  }
};
