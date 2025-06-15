import React from 'react';
import { HiSparkles } from 'react-icons/hi';

import { useEnv } from '@/context/EnvContext';
import { useReaderStore } from '@/store/readerStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { useReadingAssistantStore } from '@/store/readingAssistantStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';
import Button from '@/components/Button';

interface ReadingAssistantTogglerProps {
  bookKey: string;
}

const ReadingAssistantToggler: React.FC<ReadingAssistantTogglerProps> = ({ bookKey }) => {
  const _ = useTranslation();
  const { appService } = useEnv();
  const { setHoveredBookKey } = useReaderStore();
  const { sideBarBookKey, setSideBarBookKey } = useSidebarStore();
  const { toggleReadingAssistant } = useReadingAssistantStore();
  const iconSize16 = useResponsiveSize(16);

  const handleToggleReadingAssistant = () => {
    if (appService?.isMobile) {
      setHoveredBookKey('');
    }
    if (sideBarBookKey !== bookKey) {
      setSideBarBookKey(bookKey);
    }
    toggleReadingAssistant();
  };

  return (
    <Button
      icon={<HiSparkles size={iconSize16} className='text-base-content' />}
      onClick={handleToggleReadingAssistant}
      tooltip={_('Reading Assistant')}
      tooltipDirection='bottom'
    />
  );
};

export default ReadingAssistantToggler;