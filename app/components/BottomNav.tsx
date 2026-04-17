'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUtensils, FaShoppingBag, FaUser } from 'react-icons/fa';
import { useCart } from './CartContext';

export default function BottomNav() {
  const { getTotalItems } = useCart();
  const pathname = usePathname();
  const totalItems = getTotalItems();

  const links = [
    { href: '/', label: 'Home', Icon: FaHome },
    { href: '/menu', label: 'Menu', Icon: FaUtensils },
    { href: '/orders', label: 'Orders', Icon: FaShoppingBag, badge: totalItems },
    { href: '/profile', label: 'Profile', Icon: FaUser },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between text-sm">
        {links.map(({ href, label, Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center transition-colors p-2 relative ${
              pathname === href ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
            {badge != null && badge > 0 && (
              <span className="absolute -top-1 right-0 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
