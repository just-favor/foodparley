'use client';

import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBox, FaUsers, FaMoneyBillWave, FaClock, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ADMIN_PASSWORD = 'parley2024';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  placedAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    accountName: string;
    accountPhone: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  grandTotal: number;
  payment: string;
  status: 'pending' | 'preparing' | 'delivered';
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered'>('all');

  useEffect(() => {
    if (authed) {
      const stored = JSON.parse(localStorage.getItem('fp_orders') || '[]');
      setOrders(stored);
    }
  }, [authed]);

  const updateStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('fp_orders', JSON.stringify(updated));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm border border-gray-800">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🍔</div>
            <h1 className="text-2xl font-black text-white">FoodParley Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = orders.reduce((s, o) => s + o.grandTotal, 0);
  const uniqueUsers = new Set(orders.map(o => o.customer.phone || o.customer.accountPhone)).size;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍔</span>
          <div>
            <h1 className="font-black text-lg leading-none">FoodParley</h1>
            <p className="text-gray-500 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm cursor-pointer"
        >
          <FaSignOutAlt className="w-4 h-4" />
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FaBox, label: 'Total Orders', value: orders.length, color: 'text-orange-400' },
            { icon: FaUsers, label: 'Unique Customers', value: uniqueUsers, color: 'text-blue-400' },
            { icon: FaMoneyBillWave, label: 'Total Revenue', value: totalRevenue.toLocaleString(), color: 'text-green-400' },
            { icon: FaClock, label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div className="text-2xl font-black">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'preparing', 'delivered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer capitalize ${
                filter === f ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">No orders yet</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

                {/* Order row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-800/50 transition"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-sm">#{order.id.slice(-6)}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="text-gray-500 text-xs">{new Date(order.placedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 truncate">
                      {order.customer.name} · {order.customer.phone}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-orange-400">{order.grandTotal.toLocaleString()}</div>
                    <div className="text-gray-600 text-xs capitalize">{order.payment}</div>
                  </div>
                  {expanded === order.id ? (
                    <FaChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                  ) : (
                    <FaChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </div>

                {/* Expanded detail */}
                {expanded === order.id && (
                  <div className="border-t border-gray-800 px-5 py-5 grid md:grid-cols-2 gap-6">

                    {/* Customer info */}
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Customer</h3>
                      <div className="space-y-1.5 text-sm">
                        <p><span className="text-gray-500">Delivery name:</span> <span className="text-white font-medium">{order.customer.name}</span></p>
                        <p><span className="text-gray-500">Phone:</span> <span className="text-white font-medium">{order.customer.phone}</span></p>
                        <p><span className="text-gray-500">Address:</span> <span className="text-white font-medium">{order.customer.address}</span></p>
                        {order.customer.accountName && (
                          <p><span className="text-gray-500">Account:</span> <span className="text-white font-medium">{order.customer.accountName}</span></p>
                        )}
                        {order.customer.email && (
                          <p><span className="text-gray-500">Email:</span> <span className="text-white font-medium">{order.customer.email}</span></p>
                        )}
                        {order.customer.accountPhone && (
                          <p><span className="text-gray-500">Account phone:</span> <span className="text-white font-medium">{order.customer.accountPhone}</span></p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Items</h3>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.name} <span className="text-gray-600">x{item.quantity}</span></span>
                            <span className="text-orange-400 font-semibold">{item.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-800 pt-2 mt-2 space-y-1 text-sm">
                          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{order.subtotal.toLocaleString()}</span></div>
                          <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{order.delivery.toLocaleString()}</span></div>
                          <div className="flex justify-between font-black text-white"><span>Total</span><span>{order.grandTotal.toLocaleString()}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Status update */}
                    <div className="md:col-span-2">
                      <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Update Status</h3>
                      <div className="flex gap-2 flex-wrap">
                        {(['pending', 'preparing', 'delivered'] as const).map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer capitalize ${
                              order.status === s
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                          >
                            {s === 'delivered' && <FaCheckCircle className="w-3.5 h-3.5" />}
                            {s === 'preparing' && <FaClock className="w-3.5 h-3.5" />}
                            {s}
                          </button>
                        ))}
                      </div>
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
