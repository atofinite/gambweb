
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { CreditIcon } from './icons/CreditIcon';
import { HeadsIcon } from './icons/HeadsIcon';
import SoundToggle from './SoundToggle';
import Payment from './Payment';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { balance, isSoundOn, handleToggleSound } = useGame();
  const [showPayment, setShowPayment] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#100f15]/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center p-4 border-b border-slate-700/50">
          <h1 className="text-2xl font-bold text-white cursor-pointer animate-pulse" onClick={() => scrollTo('hero')}>
            gamb<span className="text-gold animate-bounce">web</span>
          </h1>
          <nav className="hidden md:flex items-center space-x-6 text-slate-300">
            <button onClick={() => scrollTo('about')} className="hover:text-gold transition hover:scale-110">Features</button>
            <button onClick={() => scrollTo('game')} className="hover:text-gold transition hover:scale-110">Play</button>
            <button onClick={() => scrollTo('leaderboard')} className="hover:text-gold transition hover:scale-110">Leaders</button>
          </nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPayment(true)}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition transform hover:scale-105 animate-pulse"
              >
                Buy Credits
              </button>
              <div className="flex items-center bg-slate-800/50 border border-slate-700 px-3 py-1 rounded-full shadow-inner animate-pulse">
                <CreditIcon className="w-5 h-5 text-gold mr-2" />
                <span className="text-md font-semibold text-slate-200">
                  {balance.toLocaleString()}
                </span>
              </div>
              <button onClick={logout} title="Logout" className="text-slate-400 hover:text-white transition hover:scale-110">
                <LogoutIcon className="w-6 h-6" />
              </button>
              <SoundToggle isSoundOn={isSoundOn} onToggle={handleToggleSound} />
            </div>
          ) : (
            <button onClick={() => scrollTo('join')} className="bg-gold-gradient text-slate-900 font-bold py-2 px-5 rounded-md hover:opacity-90 transition hover:scale-110 animate-pulse">
              Join Now
            </button>
          )}
        </div>
      </header>
      {showPayment && <Payment onClose={() => setShowPayment(false)} />}
    </>
  );
};

export default Header;
