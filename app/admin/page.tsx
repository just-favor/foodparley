'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FaSignOutAlt, FaBox, FaUsers, FaMoneyBillWave, FaClock, FaCheckCircle, FaChevronDown, FaChevronUp, FaToggleOn, FaToggleOff, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  placed_at: string;
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
  grand_total: number;
  payment: string;
  status: 'pending' | 'preparing' | 'delivered';
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('fp_admin')) setAuthed(true);
  }, []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered'>('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: '', category: 'Food' });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [tab, setTab] = useState<'orders' | 'users' | 'menu'>('orders');

  useEffect(() => {
    if (!authed) return;

    // Initial fetch
    const fetchData = async () => {
      const { data: ordersData } = await supabase.from('orders').select('*').order('placed_at', { ascending: false });
      const { data: usersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      const { data: menuData } = await supabase.from('menu_items').select('*').order('category');
      if (ordersData) setOrders(ordersData);
      if (usersData) setUsers(usersData);
      if (menuData) setMenuItems(menuData);
    };
    fetchData();

    // Real-time subscription for new orders
    const channel = supabase
      .channel('orders-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => { fetchData(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [authed]);

  const updateStatus = async (id: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const toggleAvailable = async (id: string, available: boolean) => {
    await supabase.from('menu_items').update({ available: !available }).eq('id', id);
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, available: !available } : m));
  };

  const addMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: newItem.image,
      category: newItem.category,
      available: true,
    };
    await supabase.from('menu_items').insert(item);
    setMenuItems(prev => [...prev, item]);
    setNewItem({ name: '', description: '', price: '', image: '', category: 'Food' });
    setAddingItem(false);
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Delete this item permanently?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    setMenuItems(prev => prev.filter(m => m.id !== id));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await supabase.from('menu_items').update({
      name: editingItem.name,
      description: editingItem.description,
      price: editingItem.price,
      image: editingItem.image,
      category: editingItem.category,
    }).eq('id', editingItem.id);
    setMenuItems(prev => prev.map(m => m.id === editingItem.id ? editingItem : m));
    setEditingItem(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('fp_admin', '1');
      setError('');
    } else setError('Incorrect password');
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
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition cursor-pointer">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = orders.reduce((s, o) => s + o.grand_total, 0);

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
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Live
          </span>
          <button onClick={() => { setAuthed(false); sessionStorage.removeItem('fp_admin'); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm cursor-pointer">
            <FaSignOutAlt className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FaBox, label: 'Total Orders', value: orders.length, color: 'text-orange-400' },
            { icon: FaUsers, label: 'Customers', value: users.length, color: 'text-blue-400' },
            { icon: FaMoneyBillWave, label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, color: 'text-green-400' },
            { icon: FaClock, label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div className="text-2xl font-black">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['orders', 'users', 'menu'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer capitalize ${tab === t ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <>
            <div className="flex gap-2 mb-4">
              {(['all', 'pending', 'preparing', 'delivered'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer capitalize ${filter === f ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">No orders yet</div>
            ) : (
              <div className="space-y-3">
                {filtered.map(order => (
                  <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div
                      className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-800/50 transition"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-sm">#{order.id.slice(-6)}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                          <span className="text-gray-500 text-xs">{new Date(order.placed_at).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1 truncate">{order.customer.name} · {order.customer.phone}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-black text-orange-400">₦{order.grand_total.toLocaleString()}</div>
                        <div className="text-gray-600 text-xs capitalize">{order.payment}</div>
                      </div>
                      {expanded === order.id ? <FaChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <FaChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                    </div>

                    {expanded === order.id && (
                      <div className="border-t border-gray-800 px-5 py-5 grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Customer</h3>
                          <div className="space-y-1.5 text-sm">
                            <p><span className="text-gray-500">Delivery name:</span> <span className="font-medium">{order.customer.name}</span></p>
                            <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.customer.phone}</span></p>
                            <p><span className="text-gray-500">Address:</span> <span className="font-medium">{order.customer.address}</span></p>
                            {order.customer.accountName && <p><span className="text-gray-500">Account:</span> <span className="font-medium">{order.customer.accountName}</span></p>}
                            {order.customer.email && <p><span className="text-gray-500">Email:</span> <span className="font-medium">{order.customer.email}</span></p>}
                            {order.customer.accountPhone && <p><span className="text-gray-500">Account phone:</span> <span className="font-medium">{order.customer.accountPhone}</span></p>}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Items</h3>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-300">{item.name} <span className="text-gray-600">x{item.quantity}</span></span>
                                <span className="text-orange-400 font-semibold">₦{item.subtotal.toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-800 pt-2 mt-2 space-y-1 text-sm">
                              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₦{order.subtotal.toLocaleString()}</span></div>
                              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>₦{order.delivery.toLocaleString()}</span></div>
                              <div className="flex justify-between font-black text-white"><span>Total</span><span>₦{order.grand_total.toLocaleString()}</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Update Status</h3>
                          <div className="flex gap-2 flex-wrap">
                            {(['pending', 'preparing', 'delivered'] as const).map(s => (
                              <button key={s} onClick={() => updateStatus(order.id, s)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer capitalize ${order.status === s ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
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
          </>
        )}

        {/* Menu tab */}
        {tab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">{menuItems.length} items</p>
              <button
                onClick={() => setAddingItem(!addingItem)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                <FaPlus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {addingItem && (
              <form onSubmit={addMenuItem} className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-4 space-y-3">
                <h3 className="font-bold text-sm text-white mb-2">New Menu Item</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'name', placeholder: 'Name', type: 'text' },
                    { key: 'price', placeholder: 'Price (e.g. 5000)', type: 'number' },
                    { key: 'image', placeholder: 'Image URL', type: 'text' },
                    { key: 'description', placeholder: 'Description', type: 'text' },
                  ].map(({ key, placeholder, type }) => (
                    <input
                      key={key}
                      required={key !== 'image'}
                      type={type}
                      placeholder={placeholder}
                      value={newItem[key as keyof typeof newItem]}
                      onChange={e => setNewItem(p => ({ ...p, [key]: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 transition"
                    />
                  ))}
                </div>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 w-full cursor-pointer"
                >
                  {['Food', 'Drink', 'Snack'].map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">Save</button>
                  <button type="button" onClick={() => setAddingItem(false)} className="bg-gray-800 text-gray-400 hover:text-white px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {menuItems.map(item => (
                <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  {/* Item row */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <p className="text-gray-500 text-xs">₦{item.price.toLocaleString()} · {item.category}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditingItem(editingItem?.id === item.id ? null : item)} className="text-gray-500 hover:text-orange-400 transition cursor-pointer">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMenuItem(item.id)} className="text-gray-500 hover:text-red-400 transition cursor-pointer">
                        <FaTrash className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleAvailable(item.id, item.available)} className="cursor-pointer">
                        {item.available
                          ? <FaToggleOn className="w-7 h-7 text-green-400" />
                          : <FaToggleOff className="w-7 h-7 text-gray-600" />
                        }
                      </button>
                    </div>
                  </div>
                  {/* Inline edit form */}
                  {editingItem?.id === item.id && (
                    <form onSubmit={saveEdit} className="border-t border-gray-800 px-4 py-4 space-y-3 bg-gray-800/50">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'name', placeholder: 'Name', type: 'text' },
                          { key: 'price', placeholder: 'Price', type: 'number' },
                          { key: 'image', placeholder: 'Image URL', type: 'text' },
                          { key: 'description', placeholder: 'Description', type: 'text' },
                        ].map(({ key, placeholder, type }) => (
                          <input
                            key={key}
                            type={type}
                            placeholder={placeholder}
                            value={String(editingItem[key as keyof MenuItem])}
                            onChange={e => setEditingItem(p => p ? { ...p, [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value } : p)}
                            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 transition"
                          />
                        ))}
                      </div>
                      <select
                        value={editingItem.category}
                        onChange={e => setEditingItem(p => p ? { ...p, category: e.target.value } : p)}
                        className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 w-full cursor-pointer"
                      >
                        {['Food', 'Drink', 'Snack'].map(c => <option key={c}>{c}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">Save</button>
                        <button type="button" onClick={() => setEditingItem(null)} className="bg-gray-700 text-gray-400 hover:text-white px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-20 text-gray-600">No users yet</div>
            ) : (
              users.map(u => (
                <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-black text-lg shrink-0">
                    {(u.name || u.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{u.name || '—'}</p>
                    <p className="text-gray-500 text-xs truncate">{u.email || u.phone || '—'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-400 text-xs">{u.phone || '—'}</p>
                    <p className="text-gray-600 text-xs">{new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
