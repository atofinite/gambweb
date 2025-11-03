
import React from 'react';
import { useGame } from '../contexts/GameContext';

const BettingInput: React.FC = () => {
  const { 
    betAmount, 
    setBetAmount, 
    isGameInProgress, 
    balance 
  } = useGame();

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
        setBetAmount(value === '' ? '' : Number(value));
    }
  };

  const setBetPreset = (multiplier: number) => {
    setBetAmount(Math.floor(balance * multiplier));
  }

  return (
    <div className="w-full flex flex-col items-center mb-6">
      <label htmlFor="bet-amount" className="text-lg font-semibold text-slate-300 mb-2">
        Bet Amount
      </label>
      <input
        id="bet-amount"
        type="text"
        value={betAmount}
        onChange={handleBetChange}
        disabled={isGameInProgress}
        className="w-full max-w-xs bg-slate-900 border-2 border-slate-600 rounded-lg text-center text-2xl font-bold py-2 px-4 text-gold focus:ring-2 focus:ring-gold focus:border-gold transition disabled:opacity-50"
      />
      <div className="flex space-x-2 mt-3">
          <button onClick={() => setBetPreset(0.25)} disabled={isGameInProgress} className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition disabled:opacity-50">25%</button>
          <button onClick={() => setBetPreset(0.5)} disabled={isGameInProgress} className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition disabled:opacity-50">50%</button>
          <button onClick={() => setBetPreset(0.75)} disabled={isGameInProgress} className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition disabled:opacity-50">75%</button>
          <button onClick={() => setBetAmount(balance)} disabled={isGameInProgress} className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition disabled:opacity-50">Max</button>
      </div>
    </div>
  );
};

export default BettingInput;
