'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useAuth } from '../components/AuthContext';
import AuthModal from '../components/AuthModal';
import { supabase } from '../lib/supabase';
import { FaSignOutAlt, FaChevronDown, FaChevronUp, FaBoxOpen } from 'react-icons/fa';

interface OrderItem {
  name: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  placed_at: string;
  items: OrderItem[];
  grand_total: number;
  status: 'pending' | 'preparing' | 'delivered';
  payment: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const activeUser = session?.user
    ? { name: session.user.name ?? '', phone: '', avatar: session.user.image ?? '', email: session.user.email ?? '' }
    : user
    ? { name: user.name, phone: user.phone, avatar: '', email: '' }
    : null;

  useEffect(() => {
    if (!activeUser) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      // Match by email (Google) or phone (local auth)
      const identifier = activeUser.email || activeUser.phone;
      if (!identifier) { setLoadingOrders(false); return; }

      const field = activeUser.email ? 'customer->>email' : 'customer->>accountPhone';
      const { data } = await supabase
        .from('orders')
        .select('id, placed_at, items, grand_total, status, payment')
        .eq(field, identifier)
        .order('placed_at', { ascending: false });

      if (data) setOrders(data);
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [activeUser?.email, activeUser?.phone]);

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
            <button onClick={() => setModalOpen(true)} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition shadow-xl cursor-pointer">
              Create Account
            </button>
            <button onClick={() => setModalOpen(true)} className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition cursor-pointer">
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

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4">
          {activeUser.avatar ? (
            <img src={activeUser.avatar} alt={activeUser.name} className="w-16 h-16 rounded-2xl object-cover" />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
              {activeUser.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">{activeUser.name}</h2>
            {activeUser.phone && <p className="text-gray-500 text-sm">{activeUser.phone}</p>}
            {activeUser.email && <p className="text-gray-500 text-sm truncate">{activeUser.email}</p>}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold cursor-pointer shrink-0">
            <FaSignOutAlt className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Order history */}
      <div>
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="text-lg font-bold text-gray-900">Order History</h3>
          {orders.length > 0 && (
            <span className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {loadingOrders ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <FaBoxOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Row */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-gray-900 text-sm">#{order.id.slice(-6)}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{new Date(order.placed_at).toLocaleString()}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">
                      {order.items.map(i => i.name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-orange-500 text-sm">₦{order.grand_total.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs capitalize">{order.payment}</p>
                  </div>
                  {expanded === order.id
                    ? <FaChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    : <FaChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  }
                </div>

                {/* Expanded items */}
                {expanded === order.id && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                        <span className="font-semibold text-gray-800">₦{item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-gray-900 text-sm">
                      <span>Total</span>
                      <span>₦{order.grand_total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
