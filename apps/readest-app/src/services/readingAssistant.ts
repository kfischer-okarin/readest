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
