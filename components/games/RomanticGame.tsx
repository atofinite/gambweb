import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';

const RomanticGame: React.FC = () => {
  const { balance, setBalance } = useGame();
  const [bet, setBet] = useState<number>(10);
  const [hearts, setHearts] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [selectedHearts, setSelectedHearts] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectHeart = (heart: number) => {
    if (selectedHearts.length < 3 && !selectedHearts.includes(heart)) {
      setSelectedHearts([...selectedHearts, heart]);
    }
  };

  const playGame = () => {
    if (bet > balance) {
      alert('Insufficient balance');
      return;
    }
    if (selectedHearts.length !== 3) {
      alert('Select exactly 3 hearts');
      return;
    }
    setIsPlaying(true);
    setBalance(balance - bet);

    // Simulate romance: 60% win rate
    const win = Math.random() < 0.6;
    setTimeout(() => {
      if (win) {
        const payout = bet * 2;
        setBalance(balance - bet + payout);
        setResult(`Romance blooms! You win ${payout} credits!`);
      } else {
        setResult('No romance this time. Better luck next time!');
      }
      setIsPlaying(false);
    }, 2000);
  };

  const resetGame = () => {
    setSelectedHearts([]);
    setResult(null);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
      <h2 className="text-2xl font-bold text-gold mb-4">Romantic Hearts</h2>
      <p className="text-slate-300 mb-4">Select 3 hearts to find love. Win if romance blooms!</p>

      <div className="mb-4">
        <label className="block text-slate-300 mb-2">Bet Amount</label>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          min="1"
          max={balance}
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-gold focus:border-gold transition"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {hearts.map(heart => (
          <button
            key={heart}
            onClick={() => handleSelectHeart(heart)}
            disabled={selectedHearts.includes(heart) || isPlaying}
            className={`w-16 h-16 rounded-full text-2xl transition-all ${
              selectedHearts.includes(heart)
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-700 hover:bg-red-400 text-red-300'
            }`}
          >
            ❤️
          </button>
        ))}
      </div>

      <button
        onClick={playGame}
        disabled={isPlaying || selectedHearts.length !== 3}
        className="w-full bg-gold-gradient text-slate-900 font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isPlaying ? 'Finding Love...' : 'Find Romance'}
      </button>

      {result && (
        <div className="mb-4">
          <p className="text-lg text-white">{result}</p>
          <button
            onClick={resetGame}
            className="mt-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition"
          >
            Play Again
          </button>
        </div>
      )}

      <button
        onClick={() => window.location.hash = '#games'}
        className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition"
      >
        Back to Games
      </button>
    </div>
  );
};

export default RomanticGame;
