import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './components/AuthContext';
import LayoutContent from './components/LayoutContent';
import NextAuthProvider from './components/NextAuthProvider';
import { Toaster } from "react-hot-toast";
import { CartProvider } from './components/CartContext';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodParley - Order Foods, Drinks & Snacks",
  description: "Modern food ordering app. Fresh meals, drinks, snacks delivered fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50">
      <Toaster position="bottom-left" />
        <NextAuthProvider>
        <AuthProvider>
        <CartProvider>
          <LayoutContent>{children}</LayoutContent>
        </CartProvider>
        </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
