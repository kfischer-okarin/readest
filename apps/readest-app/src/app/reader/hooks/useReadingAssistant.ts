import type { TextSelection } from '../hooks/useTextSelector';

type TextSelectedAction = {
  type: 'textSelected';
  textSelection: TextSelection;
};

type UserAction = TextSelectedAction;

export function useReadingAssistant() {
  const onUserEvent = (action: UserAction) => {
    const eventWithTimestamp = {
      ...action,
      timestamp: new Date().toISOString(),
    };

    console.log('Reading Assistant Event:', eventWithTimestamp);
  };

  return { onUserEvent };
}
