'use client';

import { useState } from 'react';
import { useCart } from '../components/CartContext';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaCheckCircle } from 'react-icons/fa';

export default function CheckoutPage() {
  const { cartItems, getTotal, getTotalItems } = useCart();
  const router = useRouter();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: '', address: '',Phone: '', payment: 'card' });

  const total = getTotal();
  const delivery = 4200;
  const grandTotal = total + delivery;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <FaCheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 text-sm mb-8">Your food is being prepared. Estimated delivery: 30–40 min.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-md shadow-orange-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 px-4 pt-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => router.back()} className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-500 transition border border-gray-100">
          <FaChevronLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Checkout</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <h2 className="font-bold text-gray-700 text-sm mb-3">Order Summary ({getTotalItems()} items)</h2>
        <div className="space-y-3">
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <span className="flex-1 text-sm text-gray-800 font-medium truncate">{item.name}</span>
              <span className="text-xs text-gray-400 mr-1">x{quantity}</span>
              <span className="text-sm font-bold text-orange-500">₦{(item.price * quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery</span>
            <span>₦{delivery.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-black text-gray-900 text-base pt-1">
            <span>Total</span>
            <span>₦{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <form onSubmit={handleOrder} className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Delivery Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Full Name</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Delivery Address</label>
              <input
                required
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Your address"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Phone number</label>
              <input
                required
                value={form.Phone}
                onChange={e => setForm(f => ({ ...f, Phone: e.target.value }))}
                placeholder="Phone number"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Payment Method</h2>
          <div className="flex gap-3">
            {['card', 'cash'].map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setForm(f => ({ ...f, payment: method }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${
                  form.payment === method
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                }`}
              >
                {method === 'card' ? '💳 Card' : '💵 Cash'}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition shadow-md shadow-orange-200 text-base"
        >
          Place Order · ₦{grandTotal.toLocaleString()}
        </button>
      </form>
    </div>
  );
}
