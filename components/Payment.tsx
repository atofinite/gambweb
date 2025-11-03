import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { CreditIcon } from './icons/CreditIcon';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const Payment: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { balance, setBalance } = useGame();
  const [amount, setAmount] = useState<number>(10); // INR amount
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto'>('upi');

  const creditsToGet = Math.floor(amount / 1.5);

  const handlePayment = async () => {
    if (amount < 1.5) {
      alert('Minimum payment is 1.5 rupees for 1 credit');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'upi') {
      // Razorpay UPI integration
      if (window.Razorpay) {
        const options = {
          key: 'YOUR_RAZORPAY_KEY_ID', // Replace with actual key
          amount: amount * 100, // Amount in paisa
          currency: 'INR',
          name: 'Gambweb',
          description: `Buy ${creditsToGet} credits`,
          handler: function (response: any) {
            setBalance(balance + creditsToGet);
            setIsProcessing(false);
            alert(`Payment successful! ${creditsToGet} credits added to your account.`);
            onClose();
          },
          prefill: {
            email: 'user@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#FFD700'
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for demo
        setTimeout(() => {
          setBalance(balance + creditsToGet);
          setIsProcessing(false);
          alert(`UPI Payment successful! ${creditsToGet} credits added to your account.`);
          onClose();
        }, 2000);
      }
    } else if (paymentMethod === 'crypto') {
      // Mock crypto payment
      setTimeout(() => {
        setBalance(balance + creditsToGet);
        setIsProcessing(false);
        alert(`Crypto payment successful! ${creditsToGet} credits added to your account.`);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Buy Credits</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2">Payment Method</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${paymentMethod === 'upi' ? 'bg-gold-gradient text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                UPI
              </button>
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${paymentMethod === 'crypto' ? 'bg-gold-gradient text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                Crypto
              </button>
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Amount in Rupees (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1.5"
              step="0.5"
              className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-gold focus:border-gold transition"
            />
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Credits you'll get:</span>
              <div className="flex items-center text-gold">
                <span className="font-bold text-lg">{creditsToGet}</span>
                <CreditIcon className="w-5 h-5 ml-1" />
              </div>
            </div>
            <p className="text-sm text-slate-400">Rate: 1.5 ₹ = 1 credit</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || amount < 1.5}
              className="flex-1 bg-gold-gradient text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${amount} via ${paymentMethod.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
