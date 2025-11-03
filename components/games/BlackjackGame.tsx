import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { CreditIcon } from '../icons/CreditIcon';

interface Card {
  suit: string;
  value: string;
  numericValue: number;
}

const BlackjackGame: React.FC = () => {
  const { balance, betAmount, isGameInProgress, gameMessage, startGame, resolveBet, endGame, setResult } = useGame();
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [deck, setDeck] = useState<Card[]>([]);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createDeck = () => {
    const newDeck: Card[] = [];
    suits.forEach(suit => {
      values.forEach(value => {
        const numericValue = value === 'A' ? 11 : ['J', 'Q', 'K'].includes(value) ? 10 : parseInt(value);
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

  const calculateHandValue = (hand: Card[]) => {
    let value = 0;
    let aces = 0;
    hand.forEach(card => {
      if (card.value === 'A') {
        aces += 1;
        value += 11;
      } else {
        value += card.numericValue;
      }
    });
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    return value;
  };

  const dealCard = () => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    setDeck(newDeck);
    return card!;
  };

  const startNewGame = () => {
    const numericBet = Number(betAmount);
    if (startGame(numericBet, 'Dealing cards...', 'blackjack')) {
      const newDeck = createDeck();
      setDeck(newDeck);
      const playerCards = [dealCard(), dealCard()];
      const dealerCards = [dealCard(), dealCard()];
      setPlayerHand(playerCards);
      setDealerHand(dealerCards);
      setGameState('playing');
    }
  };

  const hit = () => {
    const newCard = dealCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    if (calculateHandValue(newHand) > 21) {
      stand();
    }
  };

  const stand = () => {
    setGameState('dealer');
    let currentDealerHand = [...dealerHand];
    while (calculateHandValue(currentDealerHand) < 17) {
      currentDealerHand.push(dealCard());
      setDealerHand([...currentDealerHand]);
    }
    setTimeout(() => {
      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(currentDealerHand);
      const numericBet = Number(betAmount);

      let isWin = false;
      let payout = 0;

      if (playerValue > 21) {
        // Bust - house wins
      } else if (dealerValue > 21 || playerValue > dealerValue) {
        isWin = true;
        payout = numericBet * 2; // Even money
      } else if (playerValue === dealerValue) {
        isWin = true;
        payout = numericBet; // Push - return bet
      }

      resolveBet(isWin, payout, {
        win: `You win! Player: ${playerValue}, Dealer: ${dealerValue}`,
        lose: `Dealer wins! Player: ${playerValue}, Dealer: ${dealerValue}`
      });
      setGameState('finished');
      endGame(2000);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <h3 className="text-gold text-xl font-bold mb-2">Dealer</h3>
            <div className="flex justify-center space-x-2">
              {dealerHand.map((card, index) => (
                <div key={index} className="w-16 h-24 bg-white rounded-lg border-2 border-gold flex flex-col items-center justify-center text-black font-bold">
                  <span>{card.value}</span>
                  <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>{card.suit}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-400 mt-2">Value: {gameState === 'playing' ? dealerHand[0]?.numericValue || 0 : calculateHandValue(dealerHand)}</p>
          </div>
          <div>
            <h3 className="text-gold text-xl font-bold mb-2">Player</h3>
            <div className="flex justify-center space-x-2">
              {playerHand.map((card, index) => (
                <div key={index} className="w-16 h-24 bg-white rounded-lg border-2 border-gold flex flex-col items-center justify-center text-black font-bold">
                  <span>{card.value}</span>
                  <span className={card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'}>{card.suit}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-400 mt-2">Value: {calculateHandValue(playerHand)}</p>
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
          Deal Cards
        </button>
      )}

      {gameState === 'playing' && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={hit}
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Hit
          </button>
          <button
            onClick={stand}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Stand
          </button>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;
