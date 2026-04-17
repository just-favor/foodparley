'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUtensils, FaShoppingBag, FaUser } from 'react-icons/fa';
const navLinks = [
  { href: '/', label: 'Home', icon: FaHome },
  { href: '/menu', label: 'Menu', icon: FaUtensils },
  { href: '/orders', label: 'Orders', icon: FaShoppingBag },
  { href: '/profile', label: 'Profile', icon: FaUser },
];

function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white  shadow-sm fixed left-0 top-0">
      {/* Sidebar Logo */}
      <div className="h-16 flex items-center px-6 bg-orange-500">
        <span className="text-white text-2xl font-black tracking-tight">🍔 FoodParley</span>
      </div>
      <nav className="flex-1 py-8 px-4 space-y-2">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                active
                  ? 'bg-orange-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-orange-500' : 'text-gray-500 hover:text-orange-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarNav />
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 left-0 h-16 bg-orange-950 flex items-center px-6 shadow-md w-full">
          <span className="text-white text-2xl font-black tracking-tight md:hidden">🍔 FoodParley</span>
          <span className="hidden md:block text-white text-3xl font-extrabold tracking-tight">🍔 FoodParley</span>
        </header>

        <main className="flex-1 pb-20 md:pb-0 md:pl-64">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-6 px-6 text-center hidden md:block">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-orange-500">FoodParley</span> · Fresh foods, cool drinks &amp; tasty snacks delivered fast.
          </p>
        </footer>
      </div>
      <MobileBottomNav />
    </>
  );
}

