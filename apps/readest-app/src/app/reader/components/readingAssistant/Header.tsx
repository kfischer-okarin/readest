import clsx from 'clsx';
import React from 'react';
import { HiSparkles } from 'react-icons/hi';
import { MdArrowBackIosNew, MdOutlinePushPin, MdPushPin } from 'react-icons/md';

import { useTranslation } from '@/hooks/useTranslation';
import { useResponsiveSize } from '@/hooks/useResponsiveSize';

interface HeaderProps {
  isPinned: boolean;
  handleClose: () => void;
  handleTogglePin: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPinned, handleClose, handleTogglePin }) => {
  const _ = useTranslation();
  const iconSize14 = useResponsiveSize(14);

  return (
    <div className='reading-assistant-header relative flex h-11 items-center px-3' dir='ltr'>
      <div className='absolute inset-0 z-[-1] flex items-center justify-center space-x-2'>
        <HiSparkles />
        <div className='reading-assistant-title hidden text-sm font-medium sm:flex'>{_('Reading Assistant')}</div>
      </div>
      <div className='flex w-full items-center gap-x-4'>
        <button
          onClick={handleTogglePin}
          className={clsx(
            'btn btn-ghost btn-circle hidden h-6 min-h-6 w-6 sm:flex',
            isPinned ? 'bg-base-300' : 'bg-base-300/65',
          )}
        >
          {isPinned ? <MdPushPin size={iconSize14} /> : <MdOutlinePushPin size={iconSize14} />}
        </button>
        <button
          onClick={handleClose}
          className={'btn btn-ghost btn-circle flex h-6 min-h-6 w-6 hover:bg-transparent sm:hidden'}
        >
          <MdArrowBackIosNew />
        </button>
      </div>
    </div>
  );
};

export default Header;