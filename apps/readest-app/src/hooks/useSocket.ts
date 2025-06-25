'use client';

import { useCallback, useEffect } from 'react';
import { useSocketContext, ServerMessages, ClientMessages } from '@/context/SocketContext';

type ServerEventType = keyof ServerMessages;

type ServerEventHandlers = Partial<ServerMessages>;

type ClientEventType = keyof ClientMessages;

type EmitFunction = <E extends ClientEventType>(
  event: E,
  ...data: Parameters<ClientMessages[E]>
) => void;

export function useSocket(handlers: ServerEventHandlers) {
  const { connected, socket } = useSocketContext();

  // Register/unregister event handlers
  useEffect(() => {
    if (!socket || !handlers) {
      return;
    }

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event as ServerEventType, handler);
    });

    // Cleanup: unregister all handlers
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event as ServerEventType, handler);
      });
    };
  }, [socket, handlers]);

  const emit = useCallback<EmitFunction>(
    (event, ...data) => {
      if (socket) {
        socket.emit(event, ...data);
      }
    },
    [socket],
  );

  return {
    connected,
    emit,
  };
}
