'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useAuth } from '../components/AuthContext';
import AuthModal from '../components/AuthModal';
import { FaPhone, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';

export default function ProfilePage() {
  const { data: session } = useSession();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const activeUser = session?.user
    ? { name: session.user.name ?? '', phone: '', avatar: session.user.image ?? '' }
    : user
    ? { name: user.name, phone: user.phone, avatar: '' }
    : null;

  const handleLogout = () => {
    if (session) signOut({ callbackUrl: '/profile' });
    else logout();
  };

  if (!activeUser) {
    return (
      <>
        <div className="h-[90vh] pt-20 pb-20 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-orange-50 to-white">
          <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FoodParley</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md">Sign up to save your orders and preferences.</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition shadow-xl cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSignup={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen pt-4 pb-20 px-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-2xl">
            {activeUser.avatar ? (
              <img src={activeUser.avatar} alt={activeUser.name} className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeUser.name}</h2>
              {activeUser.phone && <p className="text-gray-600">{activeUser.phone}</p>}
              {session?.user?.email && <p className="text-gray-500 text-sm">{session.user.email}</p>}
            </div>
          </div>

          <div className="space-y-4">
            {!session && (
              <>
                <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-left group cursor-pointer">
                  <FaPhone className="w-5 h-5 text-gray-500 group-hover:text-orange-500" />
                  <span className="font-semibold text-gray-900">Change Phone Number</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-left group cursor-pointer">
                  <FaUserEdit className="w-5 h-5 text-gray-500 group-hover:text-orange-500" />
                  <span className="font-semibold text-gray-900">Edit Profile</span>
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="w-fit flex items-center gap-3 p-3 px-5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition text-left group text-red-600 cursor-pointer"
            >
              <FaSignOutAlt className="w-5 h-5 group-hover:text-red-500" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-2">Recent Orders</h3>
        <div className="text-center py-12 text-gray-500">
          Your recent orders will appear here
        </div>
      </div>
    </div>
  );
}
