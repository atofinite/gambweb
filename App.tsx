
import React, { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider, useGame } from './contexts/GameContext';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { CreditIcon } from './components/icons/CreditIcon';
import { HeadsIcon } from './components/icons/HeadsIcon';
import { TailsIcon } from './components/icons/TailsIcon';
import CoinFlipGame from './components/games/CoinFlipGame';
import DiceRollGame from './components/games/DiceRollGame';
import NebulaNumbersGame from './components/games/NebulaNumbersGame';
import RomanticGame from './components/games/RomanticGame';
import MindGame from './components/games/MindGame';
import { DiceIcon } from './components/icons/DiceIcon';
import { CardsIcon } from './components/icons/CardsIcon';
import ChatBot from './components/ChatBot';

const LeaderboardSection: React.FC = () => {
    const leaderboardData = [
        { rank: 1, name: 'CosmoCrusher', score: 1_250_420, avatar: '🌠' },
        { rank: 2, name: 'GalaxyGambler', score: 980_150, avatar: '🚀' },
        { rank: 3, name: 'StardustSpinner', score: 750_900, avatar: '✨' },
        { rank: 4, name: 'NebulaNudger', score: 512_300, avatar: '🪐' },
        { rank: 5, name: 'QuasarQueen', score: 345_670, avatar: '👑' },
    ];
    return (
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white">Top Players</h2>
            <p className="text-slate-400">Join the ranks of the elite.</p>
          </div>
          <div className="space-y-3">
            {leaderboardData.map((player, index) => (
              <div
                key={player.rank}
                className={`flex items-center p-3 rounded-lg border backdrop-blur-sm ${
                  index === 0 ? 'bg-yellow-400/20 border-yellow-400 shadow-gold' :
                  index === 1 ? 'bg-slate-500/20 border-slate-500' :
                  index === 2 ? 'bg-orange-400/20 border-orange-500' :
                  'bg-slate-800/50 border-slate-700'
                }`}
              >
                <span className={`w-8 font-bold text-lg ${index < 3 ? 'text-white' : 'text-slate-400'}`}>{player.rank}</span>
                <span className="text-4xl mr-3">{player.avatar}</span>
                <div className="flex-grow">
                  <p className="font-semibold text-white">{player.name}</p>
                </div>
                <div className="flex items-center text-gold">
                  <span className="font-bold">{player.score.toLocaleString()}</span>
                  <CreditIcon className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}

const GameHub: React.FC = () => {
    const [activeGame, setActiveGame] = useState<'coin' | 'dice' | 'numbers' | 'romantic' | 'mind'>('coin');
    const { isGameOver, handleRestart } = useGame();

    const games = [
        { id: 'coin', name: 'Coin Flip', icon: <HeadsIcon className="w-6 h-6 text-gold" /> },
        { id: 'dice', name: 'Dice Roll', icon: <DiceIcon className="w-6 h-6" /> },
        { id: 'numbers', name: 'Nebula Numbers', icon: <CardsIcon className="w-6 h-6" /> },
        { id: 'romantic', name: 'Romantic Hearts', icon: <span className="text-red-500">❤️</span> },
        { id: 'mind', name: 'Mind Bender', icon: <span className="text-purple-500">🧠</span> },
    ];

    const renderGame = () => {
        switch (activeGame) {
            case 'coin': return <CoinFlipGame />;
            case 'dice': return <DiceRollGame />;
            case 'numbers': return <NebulaNumbersGame />;
            case 'romantic': return <RomanticGame />;
            case 'mind': return <MindGame />;
            default: return <CoinFlipGame />;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
             <div className="flex justify-center mb-8 border-b border-slate-700 w-full">
                {games.map(game => (
                    <button
                        key={game.id}
                        onClick={() => setActiveGame(game.id as any)}
                        className={`flex items-center space-x-2 px-4 md:px-6 py-3 font-semibold transition-colors duration-300 border-b-2 text-sm md:text-base ${activeGame === game.id ? 'text-gold border-gold' : 'text-slate-400 border-transparent hover:text-white'}`}
                    >
                        {game.icon}
                        <span>{game.name}</span>
                    </button>
                ))}
            </div>
            {isGameOver ? (
                <div className="text-center">
                    <button
                        onClick={handleRestart}
                        className="mt-8 bg-gold-gradient text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Play Again
                    </button>
                </div>
            ) : (
                renderGame()
            )}
        </div>
    );
};


const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const addSectionRef = (el: HTMLElement | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  return (
    <div className="bg-[#100f15]">
      <Header />
      <main className="container mx-auto px-4">
        <section
          id="hero"
          ref={addSectionRef}
          className="min-h-screen flex flex-col items-center justify-center text-center scroll-animate"
        >
          <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 perspective-1000">
              <div className="absolute w-full h-full preserve-3d animate-slow-spin">
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-gold">
                    <HeadsIcon className="w-3/4 h-3/4" />
                </div>
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl border-4 border-gold rotate-y-180">
                    <TailsIcon className="w-3/4 h-3/4" />
                </div>
              </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white animate-pulse">
            Welcome to gamb<span className="text-gold animate-bounce">web</span>
          </h1>
          <p className="text-xl text-slate-400 mt-4 max-w-2xl animate-fade-in">
            The ultimate destination for the discerning gambler. High stakes, high rewards. Your fortune awaits.
          </p>
          <button
            onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-10 bg-gold-gradient text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1 animate-pulse"
          >
            Play Now
          </button>
        </section>

        <section
          id="about"
          ref={addSectionRef}
          className="min-h-screen flex flex-col items-center justify-center py-20 scroll-animate"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Why Choose Us?</h2>
            <p className="text-slate-400 mt-2">An unparalleled gaming experience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center animate-float hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold text-gold mb-2">Fair Play</h3>
              <p>Utilizing provably fair algorithms to ensure transparency and trust in every game.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center animate-float hover:scale-105 transition-transform" style={{animationDelay: '0.5s'}}>
              <h3 className="text-2xl font-bold text-gold mb-2">Student Friendly</h3>
              <p>Special discounts for students. Learn while you play with educational insights.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center animate-float hover:scale-105 transition-transform" style={{animationDelay: '1s'}}>
              <h3 className="text-2xl font-bold text-gold mb-2">Universal Access</h3>
              <p>Accessible to everyone worldwide. Pay with UPI, Crypto, or traditional methods.</p>
            </div>
          </div>
        </section>

        <section
          id="game"
          ref={addSectionRef}
          className="min-h-screen flex flex-col items-center justify-center py-20 scroll-animate"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white">Choose Your Game</h2>
            <p className="text-slate-400">Three ways to win. One destiny to fulfill.</p>
          </div>
          {isAuthenticated ? <GameHub /> : <p className="text-lg text-slate-300">Please <a href="#join" className="text-gold underline">join</a> to play.</p>}
        </section>



        <section
          id="leaderboard"
          ref={addSectionRef}
          className="min-h-screen flex flex-col items-center justify-center py-20 scroll-animate"
        >
          <LeaderboardSection />
        </section>

        {!isAuthenticated && (
          <section
            id="join"
            ref={addSectionRef}
            className="min-h-screen flex flex-col items-center justify-center py-20 scroll-animate"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white">Join The Elite</h2>
              <p className="text-slate-400">Create your account and start winning.</p>
            </div>
            <LoginForm />
          </section>
        )}
      </main>
      <ChatBot />
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes slow-spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 15s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
    return (
      <AuthProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </AuthProvider>
    );
  };
  
export default App;
