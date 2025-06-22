import { useCallback } from 'react';

type TextSelectedAction = {
  type: 'textSelected';
  text: string;
  cfi: string;
};

type HighlightCreatedAction = {
  type: 'highlightCreated';
  text: string;
  cfi: string;
};

type UserAction = TextSelectedAction | HighlightCreatedAction;

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
