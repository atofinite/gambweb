
import React, { useState, useRef, useEffect } from 'react';
import { BotIcon } from './icons/BotIcon';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([{ role: 'assistant', text: "Hello! I'm Astro, your guide to gambweb. How can I help you? You can ask me about game rules or anything else on the site." }]);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '' || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: 'AIzaSyCcyI9b-rPL9ICnkb2DBMx0GjxDmiFgz4I' });
      
      const systemInstruction = `You are Astro, a friendly and helpful AI assistant for a gaming website called "gambweb".
      Your goal is to answer user questions about the website and its games, and help with navigation.
      The available games are:
      1.  Coin Flip: A simple game where the user bets on Heads or Tails. The payout is 2x.
      2.  Dice Roll: The user bets on the sum of two dice. They can bet on the sum being Under 7 (2x payout), Over 7 (2x payout), or Exactly 7 (5x payout). If the sum is 7, bets on 'Under 7' and 'Over 7' lose.
      3.  Nebula Numbers: A high-low card game. The user sees a card and must predict if the next card will be higher or lower. If the next card is the same value, it's a push and the bet is returned. The payout is 2x.
      4.  Romantic Hearts: Select 3 hearts to find love. Win if romance blooms (60% win rate).
      5.  Mind Bender: Match all pairs in a memory game. Win based on moves taken (fewer moves = higher payout).
      Navigation commands you can help with:
      - "go to games" or "play games" -> scroll to game section
      - "show leaderboard" -> scroll to leaderboard
      - "join" or "sign up" -> scroll to join section
      - "features" -> scroll to about section
      - "buy credits" -> help with payment
      Credits cost 1.5 rupees each. Users can buy credits to play games.
      This website is student-friendly with special discounts and educational insights. Universal access with UPI and crypto payments.
      Keep your answers concise, friendly, and to the point. If user asks to navigate, respond with navigation instructions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: userInput,
        config: { systemInstruction },
      });
      
      const botResponse = response.text;
      setMessages([...newMessages, { role: 'assistant', text: botResponse }]);

    } catch (error) {
      console.error('Error with Gemini API:', error);
      setMessages([...newMessages, { role: 'assistant', text: "Sorry, I'm having trouble connecting to my circuits right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`fixed bottom-24 right-4 sm:right-6 transition-all duration-300 z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl w-80 h-96 flex flex-col">
          <div className="p-3 border-b border-slate-700">
            <h3 className="font-bold text-white text-center">Astro Assistant</h3>
          </div>
          <div className="flex-grow p-3 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-white" /></div>}
                <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-gold-gradient text-slate-900 rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-white" /></div>
                    <div className="p-3 rounded-lg bg-slate-700 rounded-bl-none flex items-center space-x-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-700">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-gold focus:border-gold transition disabled:opacity-50"
            />
          </form>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg text-white transform hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Toggle Astro Bot"
        title="Astro Bot Assistant"
      >
        <BotIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-12' : ''}`} />
      </button>
    </>
  );
};

export default ChatBot;
