'use client';

import { createContext, useContext, useState } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  decrementFromCart: (id: string) => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartMap, setCartMap] = useState<Record<string, CartItem>>({});

  const addToCart = (item: MenuItem) => {
    setCartMap(prev => ({
      ...prev,
      [item.id]: {
        item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (id: string) => {
    setCartMap(prev => {
      const newMap = { ...prev };
      delete newMap[id];
      return newMap;
    });
  };

  const decrementFromCart = (id: string) => {
    setCartMap(prev => {
      if (!prev[id]) return prev;
      if (prev[id].quantity <= 1) {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      }
      return { ...prev, [id]: { ...prev[id], quantity: prev[id].quantity - 1 } };
    });
  };

  const getTotal = () =>
    Object.values(cartMap).reduce((total, ci) => total + ci.item.price * ci.quantity, 0);

  const getTotalItems = () =>
    Object.values(cartMap).reduce((sum, ci) => sum + ci.quantity, 0);

  const cartItems: CartItem[] = Object.values(cartMap);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decrementFromCart, getTotal, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
