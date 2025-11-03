import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import ResultDisplay from '../ResultDisplay';
import BettingInput from '../BettingInput';

interface Card {
    id: number;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MindGame: React.FC = () => {
    const { betAmount, isGameInProgress, setResult, startGame, resolveBet, endGame } = useGame();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [gamePhase, setGamePhase] = useState<'betting' | 'playing' | 'result'>('betting');
    const [moves, setMoves] = useState(0);

    const symbols = ['🧠', '💭', '🔮', '🎯', '⚡', '🌟'];

    const initializeGame = () => {
        const gameCards = symbols.flatMap((symbol, index) => [
            { id: index * 2, value: symbol, isFlipped: false, isMatched: false },
            { id: index * 2 + 1, value: symbol, isFlipped: false, isMatched: false }
        ]);
        // Shuffle cards
        for (let i = gameCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
        }
        setCards(gameCards);
        setFlippedCards([]);
        setMoves(0);
        setGamePhase('playing');
    };

    const handleCardClick = (cardId: number) => {
        if (gamePhase !== 'playing' || flippedCards.length >= 2) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        setCards(prev => prev.map(c =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [firstId, secondId] = newFlipped;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
                // Match found
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isMatched: true }
                            : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            } else {
                // No match
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (gamePhase === 'playing' && cards.every(card => card.isMatched)) {
            // Game won
            const numericBet = Number(betAmount);
            const winMultiplier = moves <= 12 ? 2 : moves <= 18 ? 1.5 : 1; // Bonus for fewer moves
            const winAmount = Math.floor(numericBet * winMultiplier);

            setResult(`Mind Master! Completed in ${moves} moves.`);
            resolveBet(true, winAmount, {
                win: `Brilliant! You won ${winAmount.toLocaleString()} credits in ${moves} moves!`,
                lose: '' // Not used since it's a win
            });

            setGamePhase('result');
            setTimeout(() => endGame(0), 3000);
        }
    }, [cards, gamePhase, moves, betAmount, resolveBet, endGame, setResult]);

    const handlePlay = () => {
        const numericBet = Number(betAmount);
        if (!startGame(numericBet, 'Sharpening your mind...', 'mind')) return;
        initializeGame();
    };

    const handleRestart = () => {
        setCards([]);
        setFlippedCards([]);
        setMoves(0);
        setGamePhase('betting');
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Mind Bender</h3>
                <p className="text-slate-300">Match all pairs to bend your mind and win big!</p>
                {gamePhase === 'playing' && (
                    <p className="text-sm text-slate-400 mt-2">Moves: {moves}</p>
                )}
            </div>

            <ResultDisplay />

            {gamePhase === 'betting' && (
                <div className="w-full flex flex-col items-center mt-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl max-w-md">
                    <BettingInput />
                    <button
                        onClick={handlePlay}
                        disabled={isGameInProgress}
                        className="mt-4 w-full py-3 px-6 text-lg font-bold rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                    >
                        Bend Your Mind
                    </button>
                </div>
            )}

            {gamePhase === 'playing' && (
                <div className="w-full max-w-lg">
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                disabled={card.isMatched}
                                className={`w-16 h-16 rounded-lg border-2 transition-all duration-300 transform ${
                                    card.isFlipped || card.isMatched
                                        ? 'bg-slate-600 border-purple-400 shadow-lg shadow-purple-500/30 scale-105'
                                        : 'bg-slate-700 border-slate-600 hover:bg-purple-600 hover:border-purple-400'
                                } flex items-center justify-center text-2xl`}
                            >
                                {card.isFlipped || card.isMatched ? card.value : '?'}
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-slate-300">
                        Matched: {cards.filter(c => c.isMatched).length / 2}/6 pairs
                    </p>
                </div>
            )}

            {gamePhase === 'result' && (
                <button
                    onClick={handleRestart}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    Bend Again
                </button>
            )}
        </div>
    );
};

export default MindGame;
