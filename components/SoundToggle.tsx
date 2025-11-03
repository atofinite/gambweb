
import React from 'react';
import { SoundOnIcon } from './icons/SoundOnIcon';
import { SoundOffIcon } from './icons/SoundOffIcon';

interface SoundToggleProps {
  isSoundOn: boolean;
  onToggle: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isSoundOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="text-slate-400 hover:text-white transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gold"
      aria-label={isSoundOn ? 'Mute sounds' : 'Unmute sounds'}
      title={isSoundOn ? 'Mute sounds' : 'Unmute sounds'}
    >
      {isSoundOn ? (
        <SoundOnIcon className="w-6 h-6" />
      ) : (
        <SoundOffIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default SoundToggle;