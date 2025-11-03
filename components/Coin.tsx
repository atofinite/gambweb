
import React from 'react';
import { CoinSide } from '../types';
import { HeadsIcon } from './icons/HeadsIcon';
import { TailsIcon } from './icons/TailsIcon';
import { useGame } from '../contexts/GameContext';

const Coin: React.FC = () => {
  const { isGameInProgress, result } = useGame();
  
  const getCoinRotation = () => {
    if (!isGameInProgress) {
      if (result === CoinSide.TAILS) return 'transform rotate-y-180';
      return 'transform rotate-y-0';
    }
    return '';
  };

  return (
    <div className="perspective-1000 my-8">
      <div
        className={`relative w-48 h-48 md:w-56 md:h-56 preserve-3d transition-transform duration-1000 ${
          isGameInProgress ? 'animate-flip' : ''
        } ${getCoinRotation()}`}
        style={{ animationIterationCount: isGameInProgress ? 'infinite' : 1 }}
      >
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-gold">
          <HeadsIcon className="w-3/4 h-3/4" />
        </div>
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-gold rotate-y-180">
          <TailsIcon className="w-3/4 h-3/4" />
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes flip {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(1080deg); }
        }
        .animate-flip {
          animation: flip 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Coin;
