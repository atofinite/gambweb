
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import { CoinSide } from '../types';
import * as sound from '../utils/soundEffects';
import { useAuth } from './AuthContext';

const STARTING_BALANCE = 1000;

interface GameStats {
  wins: number;
  losses: number;
  totalWagered: number;
  netGainLoss: number;
}

const defaultStats: GameStats = { wins: 0, losses: 0, totalWagered: 0, netGainLoss: 0 };

interface GameContextType {
  balance: number;
  betAmount: number | string;
  isGameInProgress: boolean;
  result: any;
  gameMessage: string;
  isGameOver: boolean;
  isSoundOn: boolean;
  stats: GameStats;
  setBetAmount: (value: number | string) => void;
  setResult: (result: any) => void;
  setGameMessage: (message: string) => void;
  setBalance: (balance: number) => void;
  startGame: (bet: number, startMessage: string, soundType: 'flip' | 'dice' | 'card' | 'romantic' | 'mind') => boolean;
  resolveBet: (isWin: boolean, bet: number, messages: { win: string; lose: string }) => void;
  endGame: (delay: number) => void;
  handleRestart: () => void;
  handleToggleSound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(STARTING_BALANCE);
  const [betAmount, setBetAmount] = useState<number | string>(10);
  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [gameMessage, setGameMessage] = useState<string>('Place your bet!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getStorageKey = useCallback(() => `cosmic-gamestate-${user?.username}`, [user]);

  useEffect(() => {
    if (user) {
      try {
        const savedState = localStorage.getItem(getStorageKey());
        if (savedState) {
          const { balance: savedBalance, stats: savedStats } = JSON.parse(savedState);
          if (typeof savedBalance === 'number' && savedStats && typeof savedStats.wins === 'number') {
            setBalance(savedBalance);
            setStats(savedStats);
          } else {
            setBalance(STARTING_BALANCE);
            setStats(defaultStats);
          }
        } else {
          setBalance(STARTING_BALANCE);
          setStats(defaultStats);
        }
      } catch (error) {
        console.error("Failed to parse game state from localStorage, resetting state.", error);
        setBalance(STARTING_BALANCE);
        setStats(defaultStats);
      }
    }
  }, [user, getStorageKey]);

  useEffect(() => {
    if (user) {
      const gameState = JSON.stringify({ balance, stats });
      localStorage.setItem(getStorageKey(), gameState);
    }
  }, [balance, stats, user, getStorageKey]);
  
  const playSound = useCallback((soundType: 'flip' | 'win' | 'lose' | 'click' | 'dice' | 'card' | 'romantic' | 'mind') => {
    if (!isSoundOn) return;
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        return;
      }
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    switch (soundType) {
      case 'flip': sound.playFlipSound(ctx); break;
      case 'win': sound.playWinSound(ctx); break;
      case 'lose': sound.playLoseSound(ctx); break;
      case 'click': sound.playClickSound(ctx); break;
      case 'dice': sound.playDiceSound(ctx); break;
      case 'card': sound.playCardSound(ctx); break;
      case 'romantic': sound.playCardSound(ctx); break; // Reuse card sound for romantic
      case 'mind': sound.playDiceSound(ctx); break; // Reuse dice sound for mind
    }
  }, [isSoundOn]);

  useEffect(() => {
    if (balance <= 0 && !isGameInProgress) {
      setIsGameOver(true);
      setGameMessage("Game Over! You've run out of credits.");
    }
  }, [balance, isGameInProgress]);

  const startGame = useCallback((numericBetAmount: number, startMessage: string, soundType: 'flip' | 'dice' | 'card'): boolean => {
    if (isNaN(numericBetAmount) || numericBetAmount <= 0) {
      setGameMessage('Please enter a valid bet amount.');
      return false;
    }
    if (numericBetAmount > balance) {
      setGameMessage('Your bet cannot exceed your balance.');
      return false;
    }

    setIsGameInProgress(true);
    setResult(null);
    setGameMessage(startMessage);
    playSound(soundType);
    setStats(prev => ({ ...prev, totalWagered: prev.totalWagered + numericBetAmount }));
    return true;
  }, [balance, playSound]);

  const resolveBet = useCallback((isWin: boolean, winAmount: number, messages: { win: string; lose: string }) => {
    const numericBetAmount = Number(betAmount);
    if (isWin) {
      setBalance(prev => prev + winAmount);
      setGameMessage(messages.win);
      playSound('win');
      setStats(prev => ({ ...prev, wins: prev.wins + 1, netGainLoss: prev.netGainLoss + winAmount }));
    } else {
      setBalance(prev => prev - numericBetAmount);
      setGameMessage(messages.lose);
      playSound('lose');
      setStats(prev => ({ ...prev, losses: prev.losses + 1, netGainLoss: prev.netGainLoss - numericBetAmount }));
    }
  }, [playSound, betAmount]);

  const endGame = useCallback((delay: number) => {
    setTimeout(() => {
        setIsGameInProgress(false);
    }, delay);
  }, []);
  
  const handleRestart = () => {
    playSound('click');
    setBalance(STARTING_BALANCE);
    setBetAmount(10);
    setIsGameInProgress(false);
    setResult(null);
    setGameMessage('Place your bet!');
    setIsGameOver(false);
  };

  const handleToggleSound = () => {
    setIsSoundOn(prev => {
        if(!prev) playSound('click');
        return !prev;
    });
  };

  const setBalanceDirect = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <GameContext.Provider value={{
      balance, betAmount, isGameInProgress, result, gameMessage, isGameOver, isSoundOn, stats,
      setBetAmount, setResult, setGameMessage, setBalance: setBalanceDirect, startGame, resolveBet, endGame, handleRestart, handleToggleSound
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
