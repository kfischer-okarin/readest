export type TextSelectedAction = {
  type: 'textSelected';
  text: string;
  cfi: string;
};

export type HighlightCreatedAction = {
  type: 'highlightCreated';
  text: string;
  cfi: string;
};

export type UserAction = TextSelectedAction | HighlightCreatedAction;

export type ClientMessages = {
  userAction: (data: { action: UserAction; timestamp: string }) => void;
};
