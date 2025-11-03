import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { CreditIcon } from '../icons/CreditIcon';

interface Card {
  suit: string;
  value: string;
  numericValue: number;
}

const PokerGame: React.FC = () => {
  const { balance, betAmount, isGameInProgress, gameMessage, startGame, resolveBet, endGame, setResult } = useGame();
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [deck, setDeck] = useState<Card[]>([]);
  const [pot, setPot] = useState(0);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const createDeck = () => {
    const newDeck: Card[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        const numericValue = ['J', 'Q', 'K'].includes(value) ? 10 + ['J', 'Q', 'K'].indexOf(value) + 1 : value === 'A' ? 14 : parseInt(value);
        newDeck.push({ suit, value, numericValue });
      });
    });
    return shuffle(newDeck);
  };

  const shuffle = (array: Card[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const evaluateHand = (hand: Card[]) => {
    // Simplified poker hand evaluation
    const sorted = hand.sort((a, b) => b.numericValue - a.numericValue);
    const values = sorted.map(c => c.numericValue);
    const suits = sorted.map(c => c.suit);

    // Check for flush
    const isFlush = suits.every(s => s === suits[0]);

    // Check for straight
    let isStraight = true;
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== values[i-1] - 1) {
        isStraight = false;
        break;
      }
    }

    if (isFlush && isStraight) return { rank: 8, name: 'Straight Flush' };
    if (values[0] === values[3]) return { rank: 7, name: 'Four of a Kind' };
    if (values[0] === values[2] && values[3] === values[4]) return { rank: 6, name: 'Full House' };
    if (isFlush) return { rank: 5, name: 'Flush' };
    if (isStraight) return { rank: 4, name: 'Straight' };
    if (values[0] === values[2]) return { rank: 3, name: 'Three of a Kind' };
    if (values[0] === values[1] && values[2] === values[3]) return { rank: 2, name: 'Two Pair' };
    if (values[0] === values[1]) return { rank: 1, name: 'One Pair' };
    return { rank: 0, name: 'High Card' };
  };

  const dealCard = () => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    setDeck(newDeck);
    return card!;
  };

  const startNewGame = () => {
    const numericBet = Number(betAmount);
    if (startGame(numericBet, 'Dealing cards...', 'poker')) {
      const newDeck = createDeck();
      setDeck(newDeck);
      const playerCards = [dealCard(), dealCard(), dealCard(), dealCard(), dealCard()];
      const dealerCards = [dealCard(), dealCard(), dealCard(), dealCard(), dealCard()];
      setPlayerHand(playerCards);
      setDealerHand(dealerCards);
      setPot(numericBet * 2); // Ante
      setGameState('playing');
    }
  };

  const fold = () => {
    resolveBet(false, 0, {
      win: '',
      lose: 'You folded. Dealer wins the pot.'
    });
    setGameState('finished');
    endGame(2000);
  };

  const call = () => {
    const playerEval = evaluateHand(playerHand);
    const dealerEval = evaluateHand(dealerHand);

    let isWin = false;
    let payout = 0;

    if (playerEval.rank > dealerEval.rank) {
      isWin = true;
      payout = pot;
    } else if (playerEval.rank === dealerEval.rank) {
      // Simplified tie - split pot
      isWin = true;
      payout = pot / 2;
    }

    // House rake: 5% of pot
    payout *= 0.95;

    resolveBet(isWin, payout, {
      win: `You win with ${playerEval.name}!`,
      lose: `Dealer wins with ${dealerEval.name}.`
    });
    setGameState('finished');
    endGame(2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="text-2xl font-bold text-gold mb-4">Pot: {pot} credits</div>
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <h3 className="text-gold text-xl font-bold mb-2">Dealer</h3>
            <div className="flex justify-center space-x-1 flex-wrap">
              {dealerHand.map((card, index) => (
                <div key={index} className="w-12 h-16 bg-white rounded border border-gold flex flex-col items-center justify-center text-xs text-black font-bold">
                  <span>{card.value}</span>
                  <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>{card.suit}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-gold text-xl font-bold mb-2">Player</h3>
            <div className="flex justify-center space-x-1 flex-wrap">
              {playerHand.map((card, index) => (
                <div key={index} className="w-12 h-16 bg-white rounded border border-gold flex flex-col items-center justify-center text-xs text-black font-bold">
                  <span>{card.value}</span>
                  <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>{card.suit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gold text-xl font-bold">{gameMessage}</p>
      </div>

      {gameState === 'betting' && (
        <button
          onClick={startNewGame}
          disabled={Number(betAmount) > balance}
          className="bg-gold-gradient text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          Deal Hand
        </button>
      )}

      {gameState === 'playing' && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={fold}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Fold
          </button>
          <button
            onClick={call}
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Call
          </button>
        </div>
      )}
    </div>
  );
};

export default PokerGame;
