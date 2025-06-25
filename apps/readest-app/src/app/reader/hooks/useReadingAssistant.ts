import { useCallback, useRef, useEffect } from 'react';
import { buildClient, Client } from '@/services/readingAssistant/client';
import type { UserAction } from '@/services/readingAssistant/types';

export function useReadingAssistant() {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = buildClient();
    clientRef.current = client;

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, []);

  const onUserAction = useCallback((action: UserAction) => {
    if (clientRef.current) {
      clientRef.current.sendUserAction(action);
    }
  }, []);

  return { onUserAction };
}
