'use client';

import { useAuth } from '../components/AuthContext';
import { useCart } from '../components/CartContext';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

export default function OrdersPage() {
  const { user } = useAuth();
  const { cartItems, addToCart, decrementFromCart, removeFromCart, getTotal, getTotalItems } = useCart();
  const router = useRouter();

  const displayName = user ? user.name : 'Guest';
  const totalItems = getTotalItems();
  const total = getTotal();

  return (
    <div className="min-h-screen pt-4 pb-32 px-4 bg-gray-50">

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5 border border-gray-100">
        <p className="text-gray-500 text-sm">Hi, {displayName}!</p>
        <div className="flex items-center justify-between mt-0.5">
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          {totalItems > 0 && (
            <span className="bg-orange-100 text-orange-600 text-sm font-bold px-3 py-1 rounded-full">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="space-y-3">
            {cartItems.map(({ item, quantity }) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                  <p className="text-orange-500 font-black text-sm mt-1">
                    ₦{(item.price * quantity).toLocaleString()}
                    <span className="text-gray-400 font-normal text-xs ml-1">(₦{item.price.toLocaleString()} each)</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition">
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1">
                    <button
                      onClick={() => decrementFromCart(item.id)}
                      className="w-6 h-6 rounded-lg bg-white text-orange-500 shadow-sm flex items-center justify-center hover:bg-orange-50 transition"
                    >
                      <FaMinus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded-lg bg-orange-500 text-white shadow-sm flex items-center justify-center hover:bg-orange-600 transition"
                    >
                      <FaPlus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary + Checkout */}
          <div className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 px-4 pb-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-sm">Total ({totalItems} items)</span>
                <span className="text-xl font-black text-gray-900">₦{total.toLocaleString()}</span>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-orange-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <FaTrash className="w-8 h-8 text-orange-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-8">Add items from the menu to get started</p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition"
          >
            Browse Menu
          </button>
        </div>
      )}
    </div>
  );
}
