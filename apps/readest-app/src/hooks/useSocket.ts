'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface EventsMap {
  [event: string]: any; // eslint-disable-line
}

type EventHandlers<T extends EventsMap> = {
  [K in keyof T]?: T[K];
};

type EventName<T extends EventsMap> = keyof T & string;

type EmitFunction<T extends EventsMap> = <E extends EventName<T>>(event: E, ...data: Parameters<T[E]>) => void;

export function useSocket<ServerMessages extends EventsMap, ClientMessages extends EventsMap>(
  handlers: EventHandlers<ServerMessages>,
) {
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

  // Register/unregister event handlers
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !handlers) {
      return;
    }

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      if (handler) {
        socket.on(event, handler);
      }
    });

    // Cleanup: unregister all handlers
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        if (handler) {
          socket.off(event, handler);
        }
      });
    };
  }, [handlers]);

  const emit = useCallback<EmitFunction<ClientMessages>>(
    (event, ...data) => {
      const socket = socketRef.current;
      if (socket) {
        socket.emit(event, ...data);
      }
    },
    [socketRef],
  );


  return {
    connected,
    emit,
  };
}
