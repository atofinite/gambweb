import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { CreditIcon } from '../icons/CreditIcon';

const SlotsGame: React.FC = () => {
  const { balance, betAmount, isGameInProgress, gameMessage, startGame, resolveBet, endGame, setResult } = useGame();
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [jackpot, setJackpot] = useState(10000);

  const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '🔔', '⭐'];

  const spin = () => {
    const numericBet = Number(betAmount);
    if (startGame(numericBet, 'Spinning reels...', 'slots')) {
      setSpinning(true);
      setJackpot(prev => prev + numericBet * 0.1); // Add to jackpot

      const newReels = reels.map(() => Math.floor(Math.random() * symbols.length));
      setReels(newReels);

      setTimeout(() => {
        setSpinning(false);
        const [reel1, reel2, reel3] = newReels;

        let isWin = false;
        let payout = 0;

        if (reel1 === reel2 && reel2 === reel3) {
          // Three of a kind
          if (reel1 === 5) { // Jackpot symbol
            payout = jackpot;
            setJackpot(10000); // Reset jackpot
          } else {
            payout = numericBet * (reel1 + 1) * 10; // Higher payout for higher symbols
          }
          isWin = true;
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
          // Two of a kind
          payout = numericBet * 2;
          isWin = true;
        }

        // House edge: 5% of bet goes to house
        const houseEdge = numericBet * 0.05;
        payout = Math.max(0, payout - houseEdge);

        resolveBet(isWin, payout, {
          win: `Winner! ${symbols[reel1]} ${symbols[reel2]} ${symbols[reel3]} - You win ${payout} credits!`,
          lose: `${symbols[reel1]} ${symbols[reel2]} ${symbols[reel3]} - Try again!`
        });
        endGame(2000);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="text-4xl font-bold text-gold mb-4">JACKPOT: {jackpot.toLocaleString()}</div>
        <div className="flex justify-center space-x-4 mb-4">
          {reels.map((reel, index) => (
            <div
              key={index}
              className={`w-20 h-20 bg-slate-800 border-4 border-gold rounded-lg flex items-center justify-center text-4xl transition-all duration-300 ${spinning ? 'animate-bounce' : ''}`}
            >
              {symbols[reel]}
            </div>
          ))}
        </div>
        <p className="text-gold text-xl font-bold">{gameMessage}</p>
      </div>

      <button
        onClick={spin}
        disabled={isGameInProgress || Number(betAmount) > balance}
        className="bg-gold-gradient text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
      >
        Spin ({betAmount} credits)
      </button>
    </div>
  );
};

export default SlotsGame;
