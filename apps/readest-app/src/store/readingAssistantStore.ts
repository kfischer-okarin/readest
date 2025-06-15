import { create } from 'zustand';

interface ReadingAssistantState {
  readingAssistantWidth: string;
  isReadingAssistantVisible: boolean;
  isReadingAssistantPinned: boolean;
  toggleReadingAssistant: () => void;
  toggleReadingAssistantPin: () => void;
  setReadingAssistantWidth: (width: string) => void;
  setReadingAssistantVisible: (visible: boolean) => void;
  setReadingAssistantPin: (pinned: boolean) => void;
}

export const useReadingAssistantStore = create<ReadingAssistantState>((set) => ({
  readingAssistantWidth: '25%',
  isReadingAssistantVisible: false,
  isReadingAssistantPinned: false,
  toggleReadingAssistant: () => set((state) => ({ isReadingAssistantVisible: !state.isReadingAssistantVisible })),
  toggleReadingAssistantPin: () => set((state) => ({ isReadingAssistantPinned: !state.isReadingAssistantPinned })),
  setReadingAssistantWidth: (width: string) => set({ readingAssistantWidth: width }),
  setReadingAssistantVisible: (visible: boolean) => set({ isReadingAssistantVisible: visible }),
  setReadingAssistantPin: (pinned: boolean) => set({ isReadingAssistantPinned: pinned }),
}));