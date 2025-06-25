import { io, Socket } from 'socket.io-client';

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

export type UserAction = TextSelectedAction | HighlightCreatedAction;

type ClientMessages = {
  userAction: (data: { action: UserAction; timestamp: string }) => void;
};

export class ReadingAssistantClient {
  private _socket: Socket<{}, ClientMessages> | null = null;

  constructor() {
    this._socket = io();
  }

  sendUserAction(action: UserAction) {
    const timestamp = new Date().toISOString();

    if (!this._socket) {
      console.error('Socket is not initialized');
      return;
    }

    this._socket.emit('userAction', { action, timestamp });
  }

  disconnect() {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
  }
}
