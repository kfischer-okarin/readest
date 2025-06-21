import type { TextSelection } from '@/utils/sel';

type TextSelectedAction = {
  type: 'textSelected';
  textSelection: TextSelection;
};

type HighlightCreatedAction = {
  type: 'highlightCreated';
  textSelection: TextSelection;
};

type UserAction = TextSelectedAction | HighlightCreatedAction;

export function useReadingAssistant() {
  const onUserAction = (action: UserAction) => {
    const eventWithTimestamp = {
      ...action,
      timestamp: new Date().toISOString(),
    };

    console.log('Reading Assistant Event:', eventWithTimestamp);
  };

  return { onUserAction };
}
