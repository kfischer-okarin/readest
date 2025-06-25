import { useCallback, useRef, useEffect } from 'react';
import { ReadingAssistantClient, UserAction } from '@/services/readingAssistant';

export function useReadingAssistant() {
  const clientRef = useRef<ReadingAssistantClient | null>(null);

  useEffect(() => {
    const client = new ReadingAssistantClient();
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
