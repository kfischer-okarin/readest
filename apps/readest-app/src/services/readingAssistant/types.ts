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

export type PageTurnedAction = {
  type: 'pageTurned';
  cfi: string;
};

export type UserAction = TextSelectedAction | HighlightCreatedAction | PageTurnedAction;

export type ServerMessages = object;

export type ClientMessages = {
  userAction: (data: { action: UserAction; timestamp: string }) => void;
};
