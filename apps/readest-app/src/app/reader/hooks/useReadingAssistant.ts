import { useCallback } from 'react';
import { UserAction, ClientMessages } from '@/services/readingAssistant';
import { useSocket } from '@/hooks/useSocket';

export function useReadingAssistant() {
  const { emit, connected } = useSocket<{}, ClientMessages>({});

  const onUserAction = useCallback(
    (action: UserAction) => {
      const timestamp = new Date().toISOString();

      if (connected) {
        emit('userAction', { action, timestamp });
      }
    },
    [emit, connected],
  );

  return { onUserAction };
}
