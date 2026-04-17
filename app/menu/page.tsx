'use client';

import { useState } from 'react';
import MenuCard from '../components/MenuCard';
import { useCart } from '../components/CartContext';
import {
  FaSearch,
  FaWineBottle,
  FaCandyCane,
  FaHamburger,
  FaBorderAll,
} from 'react-icons/fa';
import { menuItems as sampleMenuItems } from '../data/menuItems';
import { toast } from 'react-hot-toast';

const tabs = [
  { id: 'all', label: 'All', icon: FaBorderAll },
  { id: 'food', label: 'Foods', icon: FaHamburger },
  { id: 'drink', label: 'Drinks', icon: FaWineBottle },
  { id: 'snack', label: 'Snacks', icon: FaCandyCane },
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { addToCart } = useCart();

  // ✅ ADD FUNCTION
  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart`);
  };

  const filteredItems = sampleMenuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === 'all' || item.category.toLowerCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-4 pb-24 md:pb-8">

      {/* 🔍 Search */}
      <div className="sticky top-0 z-20 -mx-4 px-4 pt-2 pb-3 bg-gradient-to-b from-gray-50 via-gray-50/90 to-transparent">
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-xl shadow-lg shadow-black/5 ring-1 ring-black/5 focus-within:ring-orange-400 focus-within:border-orange-300 transition-all">
            <FaSearch className="text-orange-400 w-4 h-4 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search foods, drinks, snacks..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🧭 Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-orange-900 text-white'
                : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500 shadow-sm'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 🍔 Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={() => handleAddToCart(item)} // ✅ FIXED
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">No items found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

    </div>
  );
}