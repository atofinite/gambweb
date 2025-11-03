
import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { CardBetType } from '../../types';
import BettingInput from '../BettingInput';
import ResultDisplay from '../ResultDisplay';

const Card: React.FC<{ value: number | null, isFlipping: boolean }> = ({ value, isFlipping }) => {
    const ranks: { [key: number]: string } = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    const displayValue = value ? (ranks[value] || value) : '?';
    
    return (
        <div className="perspective-1000">
            <div className={`w-32 h-48 md:w-40 md:h-56 rounded-lg preserve-3d transition-transform duration-500 ${isFlipping ? 'rotate-y-180' : ''}`}>
                {/* Card Back */}
                <div className="absolute w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2 flex items-center justify-center border-2 border-slate-400">
                    <div className="w-full h-full border-2 border-slate-400 rounded-md flex items-center justify-center">
                        <span className="text-5xl text-slate-300 font-bold">G</span>
                    </div>
                </div>
                {/* Card Front */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg bg-slate-200 p-2 flex flex-col justify-between border-2 border-slate-400">
                    <span className="text-2xl font-bold text-slate-800 self-start">{displayValue}</span>
                    <span className="text-6xl font-bold text-slate-800 self-center">{displayValue}</span>
                    <span className="text-2xl font-bold text-slate-800 self-end rotate-180">{displayValue}</span>
                </div>
            </div>
             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

const NebulaNumbersGame: React.FC = () => {
    const { betAmount, isGameInProgress, setGameMessage, startGame, resolveBet, endGame } = useGame();
    const [card, setCard] = useState<number | null>(null);

    const drawCard = () => Math.floor(Math.random() * 13) + 1;

    useEffect(() => {
        setCard(drawCard());
    }, []);

    const handleBet = (choice: CardBetType) => {
        const numericBet = Number(betAmount);
        if (!startGame(numericBet, 'Dealing next card...', 'card')) return;

        setTimeout(() => {
            const currentCard = card || drawCard();
            const nextCard = drawCard();
            setCard(nextCard);

            let isWin = false;
            if (nextCard > currentCard && choice === 'higher') isWin = true;
            if (nextCard < currentCard && choice === 'lower') isWin = true;
            
            if (nextCard === currentCard) {
                setGameMessage(`It's a ${nextCard}! A push, bet returned.`);
                endGame(500);
                return;
            }

            resolveBet(isWin, numericBet, {
                win: `Next card is ${nextCard}! You won ${numericBet.toLocaleString()} credits!`,
                lose: `Next card is ${nextCard}! You lost ${numericBet.toLocaleString()} credits.`
            });

            endGame(500);
        }, 1500);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex space-x-4 md:space-x-8 my-8 items-center">
                <div>
                    <p className="text-center text-slate-400 mb-2 font-semibold">Current Card</p>
                    <Card value={card} isFlipping={false} />
                </div>
            </div>
            <ResultDisplay />
            <div className="w-full flex flex-col items-center mt-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl max-w-md">
                <BettingInput />
                <p className="text-slate-400 mt-2 mb-4 text-md">Will the next card be higher or lower?</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <button onClick={() => handleBet('lower')} disabled={isGameInProgress} className="bet-button">Lower</button>
                    <button onClick={() => handleBet('higher')} disabled={isGameInProgress} className="bet-button">Higher</button>
                </div>
            </div>
            <style>{`
                .bet-button {
                    padding: 0.75rem 1.5rem;
                    font-weight: 700;
                    font-size: 1.125rem;
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
            `}</style>
        </div>
    );
};

export default NebulaNumbersGame;
