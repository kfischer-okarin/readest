'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

export type Message = {
  text: string;
  timestamp: string;
};

// Define your app's socket message types here
export interface ServerMessages {
  message: (message: Message) => void;
  // Add more server-to-client events here
}

export interface ClientMessages {
  message: (message: Message) => void;
  // Add more client-to-server events here
}

interface SocketContextValue {
  connected: boolean;
  socket: Socket<ServerMessages, ClientMessages> | null;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket<ServerMessages, ClientMessages> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const socket: Socket<ServerMessages, ClientMessages> = io({ autoConnect: false });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      connected,
      socket: socketRef.current,
    }),
    [connected],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext(): SocketContextValue {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
}
