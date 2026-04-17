'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useAuth } from './AuthContext';
import { FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
}

export default function AuthModal({ isOpen, onClose, onSignup }: AuthModalProps) {
  const [step, setStep] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { signup, login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'signup') {
      signup(name, phone);
      onSignup();
    } else {
      login(name, phone);
    }
    onClose();
  };

  const switchStep = (s: 'login' | 'signup') => {
    setStep(s);
    setName('');
    setPhone('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 pb-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'signup' ? 'Create Account' : 'Sign In'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Google Sign In */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/profile' })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-6 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200" />
            or
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Phone / Name form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="+1 234 567 8900"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg cursor-pointer"
            >
              {step === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => switchStep(step === 'signup' ? 'login' : 'signup')}
              className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer"
            >
              {step === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
