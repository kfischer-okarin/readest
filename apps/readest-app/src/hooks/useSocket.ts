'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type MessageTypes = Record<string, any>;

type ServerMessageHandlers<T extends MessageTypes> = Partial<T>;

type MessageName<T extends MessageTypes> = keyof T & string;

type EmitFunction<T extends MessageTypes> = <E extends MessageName<T>>(
  event: E,
  ...data: Parameters<T[E]>
) => void;

export function useSocket<ServerMessages extends MessageTypes, ClientMessages extends MessageTypes>(
  handlers: ServerMessageHandlers<ServerMessages>,
) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket<ServerMessages, ClientMessages> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Create socket instance
    const socket: Socket<ServerMessages, ClientMessages> = io();
    socketRef.current = socket;

    // Set up connection handlers
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Register/unregister event handlers
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !handlers) {
      return;
    }

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup: unregister all handlers
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [handlers]);

  const emit = useCallback<EmitFunction<ClientMessages>>((event, ...data) => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit(event, ...data);
    }
  }, []);

  return {
    connected,
    emit,
    socket: socketRef.current,
  };
}
