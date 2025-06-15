import clsx from 'clsx';
import React, { useEffect } from 'react';

import { useEnv } from '@/context/EnvContext';
import { useThemeStore } from '@/store/themeStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { useReadingAssistantStore } from '@/store/readingAssistantStore';
import { useDrag } from '@/hooks/useDrag';
import Header from './Header';

const MIN_WIDTH = 0.15;
const MAX_WIDTH = 0.45;

const ReadingAssistant: React.FC = () => {
  const { appService } = useEnv();
  const { updateAppTheme } = useThemeStore();
  const { sideBarBookKey } = useSidebarStore();
  const { 
    readingAssistantWidth, 
    isReadingAssistantVisible, 
    isReadingAssistantPinned,
    setReadingAssistantWidth,
    setReadingAssistantVisible,
    toggleReadingAssistantPin
  } = useReadingAssistantStore();

  useEffect(() => {
    if (isReadingAssistantVisible) {
      updateAppTheme('base-200');
    } else {
      updateAppTheme('base-100');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReadingAssistantVisible]);

  const handleResize = (newWidth: string) => {
    setReadingAssistantWidth(newWidth);
  };

  const handleTogglePin = () => {
    toggleReadingAssistantPin();
  };

  const handleClickOverlay = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setReadingAssistantVisible(false);
  };

  const onDragMove = (data: { clientX: number }) => {
    const widthFraction = 1 - data.clientX / window.innerWidth;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, widthFraction));
    handleResize(`${Math.round(newWidth * 10000) / 100}%`);
  };

  const { handleDragStart } = useDrag(onDragMove);

  if (!isReadingAssistantVisible || !sideBarBookKey) return null;

  return (
    <>
      {!isReadingAssistantPinned && (
        <div className='overlay fixed inset-0 z-10 bg-black/20' onClick={handleClickOverlay} />
      )}
      <div
        className={clsx(
          'reading-assistant-container bg-base-200 right-0 z-20 flex min-w-60 select-none flex-col',
          'font-sans text-base font-normal sm:text-sm',
          appService?.isIOSApp ? 'h-[100vh]' : 'h-full',
          appService?.hasSafeAreaInset && 'pt-[env(safe-area-inset-top)]',
          appService?.hasRoundedWindow && 'rounded-window-top-right rounded-window-bottom-right',
          !isReadingAssistantPinned && 'shadow-2xl',
        )}
        style={{
          width: readingAssistantWidth,
          maxWidth: `${MAX_WIDTH * 100}%`,
          position: isReadingAssistantPinned ? 'relative' : 'absolute',
        }}
      >
        <style jsx>{`
          @media (max-width: 640px) {
            .reading-assistant-container {
              width: 100%;
              min-width: 100%;
            }
          }
        `}</style>
        <div
          className='drag-bar absolute left-0 top-0 h-full w-0.5 cursor-col-resize'
          onMouseDown={handleDragStart}
        />
        <div className='flex-shrink-0'>
          <Header
            isPinned={isReadingAssistantPinned}
            handleClose={() => setReadingAssistantVisible(false)}
            handleTogglePin={handleTogglePin}
          />
        </div>
        <div className='flex-grow overflow-y-auto px-3'>
          <div className='flex h-full items-center justify-center text-gray-500'>
            <p className='text-center'>Reading Assistant content will appear here</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadingAssistant;