'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPhone, FaUser } from 'react-icons/fa';

export default function SignupPage() {
  const [step, setStep] = useState<'name' | 'phone' | 'otp'>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/profile');
    }, 1500);
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-orange-50 to-white pt-20">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Verify Phone</h1>
          <p className="text-gray-600 text-center mb-8">Enter the 6-digit code sent to {phone}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3">
              {Array(6).fill(0).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const newOtp = otp.split('');
                    newOtp[i] = e.target.value;
                    setOtp(newOtp.join(''));
                  }}
                  className="w-14 h-16 border-2 border-gray-200 rounded-xl text-2xl font-bold text-center focus:ring-4 focus:ring-orange-500 focus:border-orange-500 transition flex-1"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-orange-600 transition shadow-xl disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {step === 'name' ? (
              <FaUser className="w-10 h-10 text-white" />
            ) : (
              <FaPhone className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{step === 'name' ? 'Create Account' : 'Confirm Phone'}</h1>
          <p className="text-gray-600 mt-2">
            {step === 'name' ? 'Enter your details to get started' : `Enter your phone number for verification`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 'name' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          
          {step === 'phone' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition shadow-sm"
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl transform hover:scale-[1.02] disabled:opacity-50"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              if (step === 'name') {
                setStep('phone');
              } else {
                handleSubmit(e as any);
              }
            }}
          >
            {loading ? 'Loading...' : step === 'name' ? 'Continue' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}

