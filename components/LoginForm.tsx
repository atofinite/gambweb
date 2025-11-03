import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Kept for UI, but not used for auth logic
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6 w-full max-w-sm">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-gold focus:border-gold transition"
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-gold focus:border-gold transition"
          placeholder="Any password will do!"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gold-gradient text-slate-900 font-bold py-3 rounded-lg shadow-lg shadow-yellow-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        disabled={!username.trim()}
      >
        Enter the Game
      </button>
    </form>
  );
};

export default LoginForm;
