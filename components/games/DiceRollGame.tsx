
import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { DiceRollBetType } from '../../types';
import BettingInput from '../BettingInput';
import ResultDisplay from '../ResultDisplay';

const Dice: React.FC<{ value: number }> = ({ value }) => {
    const dots = Array.from({ length: value }, (_, i) => i);
    const positions: { [key: number]: string[] } = {
        1: ['justify-center items-center'],
        2: ['justify-start items-start', 'justify-end items-end'],
        3: ['justify-start items-start', 'justify-center items-center', 'justify-end items-end'],
        4: ['justify-start items-start', 'justify-end items-start', 'justify-start items-end', 'justify-end items-end'],
        5: ['justify-start items-start', 'justify-end items-start', 'justify-center items-center', 'justify-start items-end', 'justify-end items-end'],
        6: ['justify-start items-start', 'justify-end items-start', 'justify-start items-center', 'justify-end items-center', 'justify-start items-end', 'justify-end items-end'],
    };

    return (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-200 rounded-lg p-2 flex flex-wrap relative">
            {dots.map((_, i) => (
                <div key={i} className={`w-full h-full absolute top-0 left-0 p-2 flex ${positions[value][i]}`}>
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-slate-800 rounded-full"></div>
                </div>
            ))}
        </div>
    );
};


const DiceRollGame: React.FC = () => {
    const { betAmount, isGameInProgress, setGameMessage, startGame, resolveBet, endGame } = useGame();
    const [dice, setDice] = useState({ d1: 1, d2: 6 });
    // Fix: Changed NodeJS.Timeout to number, as setInterval in the browser returns a number.
    const [rollInterval, setRollInterval] = useState<number | null>(null);

    useEffect(() => {
        if (!isGameInProgress && rollInterval) {
            clearInterval(rollInterval);
            setRollInterval(null);
        }
        return () => {
            if (rollInterval) clearInterval(rollInterval);
        };
    }, [isGameInProgress, rollInterval]);

    const handleRoll = (choice: DiceRollBetType) => {
        const numericBet = Number(betAmount);
        if (!startGame(numericBet, 'Rolling the dice...', 'dice')) return;
        
        const interval = setInterval(() => {
            setDice({
                d1: Math.floor(Math.random() * 6) + 1,
                d2: Math.floor(Math.random() * 6) + 1,
            });
        }, 100);
        setRollInterval(interval);

        setTimeout(() => {
            clearInterval(interval);
            setRollInterval(null);

            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const sum = d1 + d2;
            setDice({ d1, d2 });

            let isWin = false;
            let payoutMultiplier = 1;
            switch (choice) {
                case 'under': isWin = sum < 7; break;
                case 'over': isWin = sum > 7; break;
                case 'exact':
                    isWin = sum === 7;
                    payoutMultiplier = 4;
                    break;
            }

            const winAmount = numericBet * payoutMultiplier;
            
            resolveBet(isWin, winAmount, {
                win: `You rolled ${sum}! You won ${winAmount.toLocaleString()} credits!`,
                lose: `You rolled ${sum}! You lost ${numericBet.toLocaleString()} credits.`
            });
            if(sum === 7 && choice !== 'exact') {
                setGameMessage(`You rolled a 7! House wins.`);
            }

            endGame(500);
        }, 2000);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex space-x-4 md:space-x-8 my-8">
                <Dice value={dice.d1} />
                <Dice value={dice.d2} />
            </div>
            <ResultDisplay />
            <div className="w-full flex flex-col items-center mt-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl max-w-md">
                <BettingInput />
                <p className="text-slate-400 mt-2 mb-4 text-md">Place your prediction:</p>
                <div className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-md">
                    <button onClick={() => handleRoll('under')} disabled={isGameInProgress} className="bet-button">Under 7 <span className="payout-label">2x Payout</span></button>
                    <button onClick={() => handleRoll('exact')} disabled={isGameInProgress} className="bet-button">Exactly 7 <span className="payout-label text-yellow-400">5x Payout</span></button>
                    <button onClick={() => handleRoll('over')} disabled={isGameInProgress} className="bet-button">Over 7 <span className="payout-label">2x Payout</span></button>
                </div>
            </div>
             <style>{`
                .bet-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0.75rem 0.5rem;
                    font-weight: 700;
                    border-radius: 0.5rem;
                    background-image: linear-gradient(to right, #fde047, #eab308);
                    color: #1e293b;
                    transition: all 0.3s ease-in-out;
                }
                .bet-button:hover {
                    transform: scale(1.05);
                }
                .bet-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .payout-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #475569;
                    margin-top: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default DiceRollGame;