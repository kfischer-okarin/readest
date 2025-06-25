import { useCallback } from 'react';
import { UserAction } from '@/services/readingAssistant';

export function useReadingAssistant() {
  const onUserAction = useCallback((action: UserAction) => {
    const eventWithTimestamp = {
      ...action,
      timestamp: new Date().toISOString(),
    };

    console.log('Reading Assistant Event:', eventWithTimestamp);
  }, []);

  return { onUserAction };
}
