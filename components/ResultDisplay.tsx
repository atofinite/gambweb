import React from 'react';
import { useGame } from '../contexts/GameContext';

const ResultDisplay: React.FC = () => {
  const { gameMessage } = useGame();

  const getMessageColor = () => {
    if (gameMessage.toLowerCase().includes('won')) return 'text-green-400';
    if (gameMessage.toLowerCase().includes('lost') || gameMessage.toLowerCase().includes('game over')) return 'text-red-400';
    if (gameMessage.toLowerCase().includes('flipping')) return 'text-yellow-400';
    return 'text-slate-300';
  };

  return (
    <div className="h-12 flex items-center justify-center mt-4">
      <p className={`text-xl font-semibold text-center transition-colors duration-300 ${getMessageColor()}`}>
        {gameMessage}
      </p>
    </div>
  );
};

export default ResultDisplay;
