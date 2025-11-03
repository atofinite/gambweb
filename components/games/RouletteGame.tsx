import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { CreditIcon } from '../icons/CreditIcon';

const RouletteGame: React.FC = () => {
  const { balance, betAmount, isGameInProgress, gameMessage, startGame, resolveBet, endGame, setResult } = useGame();
  const [selectedBet, setSelectedBet] = useState<'red' | 'black' | 'green' | 'even' | 'odd' | '1-18' | '19-36' | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

  const spinWheel = () => {
    if (selectedBet && !isGameInProgress) {
      const numericBet = Number(betAmount);
      if (startGame(numericBet, 'Spinning the wheel...', 'roulette')) {
        setSpinning(true);
        const result = Math.floor(Math.random() * 37); // 0-36, 0 is green
        const rotations = 5 + Math.random() * 5; // 5-10 full rotations
        const finalRotation = rotations * 360 + (result * (360 / 37));

        setWheelRotation(finalRotation);

        setTimeout(() => {
          setResult(result);
          setSpinning(false);

          let isWin = false;
          let payout = 0;

          if (result === 0) {
            if (selectedBet === 'green') {
              isWin = true;
              payout = numericBet * 35; // House edge: 0 pays 35:1 instead of 36:1
            }
          } else if (selectedBet === 'red' && redNumbers.includes(result)) {
            isWin = true;
            payout = numericBet * 2;
          } else if (selectedBet === 'black' && blackNumbers.includes(result)) {
            isWin = true;
            payout = numericBet * 2;
          } else if (selectedBet === 'even' && result % 2 === 0) {
            isWin = true;
            payout = numericBet * 2;
          } else if (selectedBet === 'odd' && result % 2 === 1) {
            isWin = true;
            payout = numericBet * 2;
          } else if (selectedBet === '1-18' && result >= 1 && result <= 18) {
            isWin = true;
            payout = numericBet * 2;
          } else if (selectedBet === '19-36' && result >= 19 && result <= 36) {
            isWin = true;
            payout = numericBet * 2;
          }

          resolveBet(isWin, payout, {
            win: `The wheel landed on ${result}! You win ${payout} credits!`,
            lose: `The wheel landed on ${result}. Better luck next time!`
          });
          endGame(2000);
        }, 3000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="relative w-64 h-64 mx-auto mb-4">
          <div
            className="w-full h-full rounded-full border-8 border-gold bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: spinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
            }}
          >
            {/* Wheel numbers - simplified for demo */}
            {Array.from({length: 37}, (_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full ${i === 0 ? 'bg-green-500' : redNumbers.includes(i) ? 'bg-red-500' : 'bg-black'} border border-white`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * (360/37)}deg) translateY(-120px)`
                }}
              >
                <span className="text-xs text-white font-bold">{i}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-gold"></div>
        </div>
        <p className="text-gold text-xl font-bold">{gameMessage}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { key: 'red', label: 'Red', color: 'bg-red-500' },
          { key: 'black', label: 'Black', color: 'bg-black' },
          { key: 'green', label: 'Green (0)', color: 'bg-green-500' },
          { key: 'even', label: 'Even', color: 'bg-blue-500' },
          { key: 'odd', label: 'Odd', color: 'bg-purple-500' },
          { key: '1-18', label: '1-18', color: 'bg-yellow-500' },
          { key: '19-36', label: '19-36', color: 'bg-pink-500' },
        ].map(bet => (
          <button
            key={bet.key}
            onClick={() => setSelectedBet(bet.key as any)}
            disabled={isGameInProgress}
            className={`py-3 px-4 rounded-lg font-bold transition-all ${selectedBet === bet.key ? 'ring-4 ring-gold' : ''} ${bet.color} text-white hover:scale-105 disabled:opacity-50`}
          >
            {bet.label}
          </button>
        ))}
      </div>

      <button
        onClick={spinWheel}
        disabled={!selectedBet || isGameInProgress || Number(betAmount) > balance}
        className="bg-gold-gradient text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
      >
        Spin the Wheel
      </button>
    </div>
  );
};

export default RouletteGame;
