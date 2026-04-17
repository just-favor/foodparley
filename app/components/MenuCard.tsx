'use client';

import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from './CartContext';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: () => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const { cartItems, decrementFromCart } = useCart();
  const cartItem = cartItems.find(c => c.item.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 flex flex-col">
      <div className="relative overflow-hidden aspect-3/3">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          {item.category}
        </span>
        {qty > 0 && (
          <span className="absolute top-2 left-2 bg-white text-orange-500 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow">
            {qty}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-base font-black text-orange-500">₦{item.price.toLocaleString()}</span>

          {qty > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrementFromCart(item.id)}
                className="w-7 h-7 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-200 transition"
              >
                <FaMinus className="w-2.5 h-2.5" />
              </button>
              <span className="text-sm font-bold text-gray-800 w-4 text-center">{qty}</span>
              <button
                onClick={onAddToCart}
                className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition"
              >
                <FaPlus className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAddToCart}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
            >
              <FaPlus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
