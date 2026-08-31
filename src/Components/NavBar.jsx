'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, User, LogOut, ShieldCheck, Settings, Moon, Sun } from 'lucide-react';

export function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0b0b0d]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="text-amber-500">NOVA</span>
          <span className="text-zinc-900 dark:text-zinc-100">MART</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-amber-500">
            Store
          </Link>

          <button
            onClick={toggleTheme}
            title="Toggle light / dark"
            className="p-2 rounded-lg text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm font-bold text-amber-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-amber-500 flex items-center gap-1">
                <User className="w-4 h-4" /> {user?.name?.split(" ")[0] || "User"}
              </Link>
              <Link href="/settings" title="Settings" className="text-zinc-500 hover:text-amber-500">
                <Settings className="w-4 h-4" />
              </Link>
              <button onClick={logout} title="Log out" className="text-zinc-500 hover:text-rose-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-amber-500 flex items-center gap-1">
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}

          <Link href="/cart" className="relative p-2 text-zinc-700 dark:text-zinc-200 hover:text-amber-500">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-amber-500 text-zinc-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
