
import React from 'react';
import { CoinSide } from '../../types';
import { useGame } from '../../contexts/GameContext';
import Coin from '../Coin';
import ResultDisplay from '../ResultDisplay';
import BettingInput from '../BettingInput';

const FLIP_DURATION = 2000;

const CoinFlipGame: React.FC = () => {
    const { betAmount, isGameInProgress, setResult, startGame, resolveBet, endGame } = useGame();

    const handleFlip = (choice: CoinSide) => {
        const numericBet = Number(betAmount);
        if (!startGame(numericBet, 'Flipping...', 'flip')) return;
    
        setTimeout(() => {
          const flipResult: CoinSide = Math.random() < 0.5 ? CoinSide.HEADS : CoinSide.TAILS;
          setResult(flipResult);
          const isWin = flipResult === choice;
          
          resolveBet(isWin, numericBet, {
            win: `It's ${flipResult}! You won ${numericBet.toLocaleString()} credits!`,
            lose: `It's ${flipResult}! You lost ${numericBet.toLocaleString()} credits.`
          });
          
          endGame(0);
        }, FLIP_DURATION);
      };

    return (
        <div className="w-full flex flex-col items-center">
            <Coin />
            <ResultDisplay />
            <div className="w-full flex flex-col items-center mt-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl max-w-md">
                <BettingInput />
                <p className="text-slate-400 mt-2 mb-4 text-md">Choose a side:</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <button
                        onClick={() => handleFlip(CoinSide.HEADS)}
                        disabled={isGameInProgress}
                        className="w-full py-3 px-6 text-lg font-bold rounded-lg bg-gold-gradient text-slate-900 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                    >
                        Heads
                    </button>
                    <button
                        onClick={() => handleFlip(CoinSide.TAILS)}
                        disabled={isGameInProgress}
                        className="w-full py-3 px-6 text-lg font-bold rounded-lg bg-gold-gradient text-slate-900 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                    >
                        Tails
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoinFlipGame;
