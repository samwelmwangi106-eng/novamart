const fs = require('fs');
const path = require('path');

function save(file, content) {
  const full = path.join(process.cwd(), file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
  console.log('✔ ' + file);
}

console.log('Upgrading NovaMart: PostgreSQL + dark theme + settings + discounts\n');

// Keep existing deps, add Prisma
const pkgPath = path.join(process.cwd(), 'package.json');
let pkg = {
  name: 'novamart',
  version: '1.0.0',
  private: true,
  scripts: {},
  dependencies: {},
  devDependencies: {}
};
if (fs.existsSync(pkgPath)) {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
}
pkg.scripts = Object.assign({}, pkg.scripts, {
  dev: 'next dev',
  build: 'npx prisma@5.22.0 generate && next build',
  start: 'next start',
  'db:generate': 'npx prisma@5.22.0 generate',
  'db:push': 'npx prisma@5.22.0 db push',
  'db:seed': 'node prisma/seed.cjs',
  'db:studio': 'npx prisma@5.22.0 studio'
});
pkg.dependencies = Object.assign({}, pkg.dependencies, {
  '@prisma/client': '5.22.0',
  bcryptjs: '^2.4.3',
  'lucide-react': pkg.dependencies['lucide-react'] || '^0.344.0',
  next: pkg.dependencies.next || '14.1.0',
  react: pkg.dependencies.react || '^18.2.0',
  'react-dom': pkg.dependencies['react-dom'] || '^18.2.0'
});
pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
  prisma: '5.22.0',
  autoprefixer: pkg.devDependencies.autoprefixer || '^10.4.18',
  postcss: pkg.devDependencies.postcss || '^8.4.35',
  tailwindcss: pkg.devDependencies.tailwindcss || '^3.4.1'
});
pkg.prisma = { seed: 'node prisma/seed.cjs' };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✔ package.json (scripts + prisma)');

save('prisma/schema.prisma', `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("CUSTOMER")
  phone     String?
  address   String?
  city      String?
  theme     String   @default("dark")
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id              String      @id @default(cuid())
  name            String
  description     String
  price           Float
  originalPrice   Float
  discountPercent Int         @default(0)
  onSale          Boolean     @default(false)
  stock           Int         @default(10)
  category        String      @default("General")
  image           String
  featured        Boolean     @default(false)
  orderItems      OrderItem[]
  createdAt       DateTime    @default(now())
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  totalAmount Float
  status      String      @default("PAID")
  items       OrderItem[]
  createdAt   DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}
`);

save('prisma/seed.cjs', `
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

function sale(original, percent) {
  const price = Math.round(original * (1 - percent / 100) * 100) / 100;
  return { price, originalPrice: original, discountPercent: percent, onSale: percent > 0 };
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'NovaMart Admin',
      email: 'admin@novamart.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
      theme: 'dark'
    }
  });

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('user123', 10),
      role: 'CUSTOMER',
      phone: '+254 700 000 000',
      address: '12 Kenyatta Avenue',
      city: 'Nairobi',
      theme: 'dark'
    }
  });

  const products = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Active noise cancellation, 40-hour battery, memory-foam cushions.',
      stock: 40,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(249.99, 20)
    },
    {
      name: 'Custom Mechanical Gaming Keyboard',
      description: 'Hot-swap switches, per-key RGB, CNC aluminum frame.',
      stock: 25,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(129.5, 0)
    },
    {
      name: 'Full-Grain Leather Everyday Backpack',
      description: 'Water-resistant leather with a padded 16-inch laptop sleeve.',
      stock: 18,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(189, 15)
    },
    {
      name: 'Smart Fitness Pro Watch',
      description: 'Heart-rate, dual GPS, 50m water resistance, AMOLED display.',
      stock: 15,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      featured: true,
      ...sale(329.99, 25)
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: '360° sound, IPX7 waterproof, 24-hour playtime.',
      stock: 50,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
      featured: false,
      ...sale(89.99, 10)
    },
    {
      name: 'USB-C Docking Station',
      description: 'Triple display, 100W power delivery, Gigabit Ethernet.',
      stock: 22,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80',
      featured: false,
      ...sale(189, 0)
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('PostgreSQL seeded: admin, customer, 6 products (some on sale).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
`);

save('.env.example', `
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
`);

if (!fs.existsSync(path.join(process.cwd(), '.env'))) {
  save('.env', `
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
`);
}

save('tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f4f5',
          900: '#121214',
          950: '#0b0b0d',
        },
      },
    },
  },
  plugins: [],
};
`);

save('src/app/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

html { color-scheme: dark; }
html.light { color-scheme: light; }

body {
  @apply bg-zinc-100 text-zinc-900 dark:bg-ink-950 dark:text-zinc-100 antialiased;
}

input, select, textarea {
  @apply bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700;
}
`);

save('src/lib/prisma.js', `
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`);

save('src/lib/pricing.js', `
export function getPricing(product) {
  const price = Number(product.price) || 0;
  const original = Number(product.originalPrice) || price;
  const percent = product.discountPercent
    || (original > price ? Math.round((1 - price / original) * 100) : 0);
  const hasDiscount = percent > 0 && original > price;
  return {
    price,
    original,
    percent,
    hasDiscount,
    save: hasDiscount ? original - price : 0
  };
}

export function money(n) {
  return '$' + Number(n || 0).toFixed(2);
}

export function applyDiscountFields(body) {
  let price = parseFloat(body.price);
  let originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : price;
  let discountPercent = parseInt(body.discountPercent, 10) || 0;

  if (discountPercent > 0 && (!body.originalPrice || originalPrice <= price)) {
    originalPrice = price;
    price = Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100;
  }

  if (originalPrice > price) {
    discountPercent = Math.round((1 - price / originalPrice) * 100);
  } else {
    originalPrice = price;
    discountPercent = 0;
  }

  return {
    price,
    originalPrice,
    discountPercent,
    onSale: discountPercent > 0
  };
}
`);

save('src/context/ThemeContext.jsx', `
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('novamart_theme') || 'dark';
    setTheme(saved);
    apply(saved);
  }, []);

  function apply(next) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(next === 'light' ? 'light' : 'dark');
    if (next === 'light') root.classList.remove('dark');
    else root.classList.add('dark');
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('novamart_theme', next);
    apply(next);
  }

  function setThemeName(next) {
    setTheme(next);
    localStorage.setItem('novamart_theme', next);
    apply(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
`);

save('src/app/providers.jsx', `
'use client';

import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
`);

save('src/app/layout.jsx', `
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Providers } from './providers';

export const metadata = {
  title: 'NovaMart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: \`(function(){try{var t=localStorage.getItem('novamart_theme')||'dark';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t==='light'?'light':'dark');}catch(e){}})();\`,
          }}
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col bg-zinc-100 text-zinc-900 dark:bg-[#0b0b0d] dark:text-zinc-100">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
`);

save('src/components/Footer.jsx', `
export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/40 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-black tracking-tight text-lg">
          <span className="text-amber-500">NOVA</span>MART
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          Hardware, audio and everyday gear. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
`);

save('src/components/Navbar.jsx', `
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
                <User className="w-4 h-4" /> {user.name.split(' ')[0]}
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
`);

save('src/components/ProductCard.jsx', `
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { getPricing, money } from '../lib/pricing';
import { Plus } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const deal = getPricing(product);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between">
      <Link href={'/products/' + product.id}>
        <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          <span className="absolute top-2.5 left-2.5 bg-black/70 text-zinc-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            {product.category}
          </span>
          {deal.hasDiscount && (
            <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white px-2 py-0.5 rounded text-[10px] font-black">
              -{deal.percent}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={'/products/' + product.id}>
            <h3 className="text-sm font-bold hover:text-amber-500 line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-end justify-between mt-4">
          <div>
            {deal.hasDiscount ? (
              <div>
                <p className="text-[11px] text-zinc-500 line-through">{money(deal.original)}</p>
                <p className="text-base font-black text-amber-500">{money(deal.price)}</p>
              </div>
            ) : (
              <p className="text-base font-black">{money(deal.price)}</p>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 p-2 rounded-xl flex items-center gap-1 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
`);

save('src/app/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Search, Tag } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [offersOnly, setOffersOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = '/api/products?';
    if (category !== 'All') url += 'category=' + encodeURIComponent(category) + '&';
    if (search) url += 'search=' + encodeURIComponent(search) + '&';
    if (offersOnly) url += 'onSale=true';
    fetch(url)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [category, search, offersOnly]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-3xl p-8 sm:p-12 text-center mb-10 bg-zinc-900 text-zinc-100 border border-zinc-800">
        <p className="text-[11px] font-bold tracking-[0.2em] text-amber-500 uppercase mb-3">NovaMart catalog</p>
        <h1 className="text-3xl sm:text-5xl font-black mb-3">Hardware. Quiet luxury.</h1>
        
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'Electronics', 'Audio', 'Accessories'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={'px-4 py-2 rounded-full text-xs font-bold border ' + (category === cat
              ? 'bg-amber-500 text-zinc-950 border-amber-500'
              : 'bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300')}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setOffersOnly(!offersOnly)}
          className={'px-4 py-2 rounded-full text-xs font-bold border flex items-centerPostgreS gap-1 ' + (offersOnly
            ? 'bg-rose-600 text-white border-rose-600'
            : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300')}
        >
          <Tag className="w-3.5 h-3.5" /> On sale
        </button>
      </div>

      {loading ? (
        <p className="text-center py-16 text-zinc-500 text-sm">Loading from QL...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-16 text-zinc-500 text-sm">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
`);

save('src/app/products/[id]/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import { getPricing, money } from '../../../lib/pricing';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products/' + id)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading...</div>;
  if (!product || product.error) return <div className="text-center py-20 text-zinc-500">Product not found.</div>;

  const deal = getPricing(product);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          {deal.hasDiscount && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-black">
              LIMITED OFFER · -{deal.percent}%
            </span>
          )}
        </div>
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{product.category}</span>
          <h1 className="text-3xl font-black mt-1">{product.name}</h1>

          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-black text-amber-500">{money(deal.price)}</p>
            {deal.hasDiscount && (
              <>
                <p className="text-lg text-zinc-500 line-through">{money(deal.original)}</p>
                <span className="text-xs font-bold bg-rose-600/20 text-rose-400 px-2 py-1 rounded">
                  Save {money(deal.save)}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-xs text-zinc-500 mt-2">Stock: {product.stock} units</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-8 w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" /> Add to cart
          </button>

          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-xs text-zinc-500">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-amber-500" /> Free express delivery</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-500" /> 2-year warranty</div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

save('src/app/cart/page.jsx', `
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getPricing, money } from '../../lib/pricing';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to complete your order.');
      router.push('/login');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        customerName: user.name,
        totalAmount: totalPrice,
        items: cart
      })
    });
    if (res.ok) {
      clearCart();
      router.push('/checkout/success');
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link href="/" className="mt-6 inline-block bg-amber-500 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => {
            const deal = getPricing(item);
            return (
              <div key={item.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-xs text-amber-500">{money(deal.price)}</p>
                    {deal.hasDiscount && (
                      <p className="text-[10px] text-rose-400">-{deal.percent}% offer applied</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-fit">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <div className="flex justify-between text-sm text-zinc-500 mb-2">
            <span>Subtotal</span><span>{money(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-500 mb-4">
            <span>Shipping</span><span className="text-emerald-500 font-bold">FREE</span>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between font-black text-lg mb-6">
            <span>Total</span><span>{money(totalPrice)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Saving order...' : 'Place order'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
`);

save('src/app/checkout/success/page.jsx', `
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
      <h1 className="text-2xl font-black">Order saved</h1>
      <p className="text-sm text-zinc-500 mt-2">This order is now in PostgreSQL.</p>
      <Link href="/profile" className="mt-6 inline-block bg-amber-500 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-sm">
        View in profile
      </Link>
    </div>
  );
}
`);

save('src/app/login/page.jsx', `
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Login failed');
      setLoading(false);
    } else {
      login(data);
      router.push(data.role === 'ADMIN' ? '/admin' : '/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-black mb-6 text-center">Sign in</h1>
      {error && <p className="bg-rose-500/10 text-rose-400 text-xs p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl p-3 text-sm" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl p-3 text-sm" />
        <button disabled={loading} className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">
          {loading ? 'Checking...' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-xs text-zinc-500 mt-4">
        New here? <Link href="/register" className="text-amber-500 font-bold">Register</Link>
      </p>
      <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs text-zinc-500 space-y-1">
        <p className="font-bold text-zinc-700 dark:text-zinc-300">Test logins</p>
        <p>admin@novamart.com / admin123</p>
        <p>john@example.com / user123</p>
      </div>
    </div>
  );
}
`);

save('src/app/register/page.jsx', `
'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed');
      setLoading(false);
    } else {
      login(data);
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-black mb-6 text-center">Create account</h1>
      {error && <p className="bg-rose-500/10 text-rose-400 text-xs p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border rounded-xl p-3 text-sm" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl p-3 text-sm" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)" className="w-full border rounded-xl p-3 text-sm" />
        <button disabled={loading} className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">
          {loading ? 'Saving...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-xs text-zinc-500 mt-4">
        Already have an account? <Link href="/login" className="text-amber-500 font-bold">Sign in</Link>
      </p>
    </div>
  );
}
`);

save('src/app/profile/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { money } from '../../lib/pricing';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user?.id) {
      fetch('/api/orders?userId=' + user.id)
        .then((res) => res.json())
        .then((data) => setOrders(Array.isArray(data) ? data : []));
    }
  }, [user, loading]);

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black">My account</h1>
          <p className="text-zinc-500">{user?.name} · {user?.email}</p>
        </div>
        <Link href="/settings" className="text-sm font-bold text-amber-500">Settings →</Link>
      </div>
      <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex justify-between mb-3">
                <span className="font-mono text-xs font-bold text-amber-500">{order.id}</span>
                <span className="text-xs bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded">{order.status}</span>
              </div>
              {(order.items || []).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product?.name || item.name} x{item.quantity}</span>
                  <span className="font-bold">{money(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-zinc-200 dark:border-zinc-800 mt-3 pt-3 flex justify-between font-black">
                <span>Total</span>
                <span>{money(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`);

save('src/app/settings/page.jsx', `
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { user, login, loading } = useAuth();
  const { theme, setThemeName } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user?.id) {
      fetch('/api/users/' + user.id)
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) {
            setForm({
              name: data.name || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || ''
            });
            if (data.theme) setThemeName(data.theme);
          }
        });
    }
  }, [user, loading]);

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users/' + user.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, theme })
    });
    const data = await res.json();
    if (res.ok) {
      login({ ...user, name: data.name, theme: data.theme });
      setMessage('Profile saved.');
    } else {
      setMessage(data.error || 'Could not save');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users/' + user.id + '/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwords)
    });
    const data = await res.json();
    setMessage(data.error || 'Password updated.');
    setPasswords({ currentPassword: '', newPassword: '' });
  };

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Settings</h1>
      <p className="text-zinc-500 text-sm mb-8">Account, address, appearance.</p>
      {message && <p className="mb-4 text-xs bg-amber-500/10 text-amber-500 p-3 rounded-lg">{message}</p>}

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-6">
        <h2 className="font-bold mb-4">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setThemeName('dark')}
            className={'flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 ' + (theme === 'dark' ? 'border-amber-500 text-amber-500' : 'border-zinc-300 dark:border-zinc-700')}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
          <button
            onClick={() => setThemeName('light')}
            className={'flex-1 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 ' + (theme === 'light' ? 'border-amber-500 text-amber-500' : 'border-zinc-300 dark:border-zinc-700')}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
        </div>
      </div>

      <form onSubmit={saveProfile} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-6 space-y-3">
        <h2 className="font-bold mb-2">Profile</h2>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full border rounded-xl p-3 text-sm" />
        <input value={user?.email || ''} disabled className="w-full border rounded-xl p-3 text-sm opacity-60" />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full border rounded-xl p-3 text-sm" />
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" className="w-full border rounded-xl p-3 text-sm" />
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="w-full border rounded-xl p-3 text-sm" />
        <button className="w-full bg-amber-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">Save profile</button>
      </form>

      <form onSubmit={changePassword} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
        <h2 className="font-bold mb-2">Password</h2>
        <input type="password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Current password" className="w-full border rounded-xl p-3 text-sm" />
        <input type="password" required minLength={6} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="New password" className="w-full border rounded-xl p-3 text-sm" />
        <button className="w-full border border-zinc-300 dark:border-zinc-700 font-bold py-3 rounded-xl text-sm">Update password</button>
      </form>
    </div>
  );
}
`);

save('src/app/admin/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingBag, Package, Users, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { money } from '../../lib/pricing';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: '', price: '', originalPrice: '', discountPercent: '', stock: '10',
    category: 'Electronics', description: '', image: ''
  });

  const loadData = async () => {
    setStats(await (await fetch('/api/stats')).json());
    const p = await (await fetch('/api/products')).json();
    setProducts(Array.isArray(p) ? p : []);
    const o = await (await fetch('/api/orders')).json();
    setOrders(Array.isArray(o) ? o : []);
  };

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        alert('Admin only');
        router.push('/');
        return;
      }
      loadData();
    }
  }, [user, loading]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', price: '', originalPrice: '', discountPercent: '', stock: '10', category: 'Electronics', description: '', image: '' });
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/products/' + id, { method: 'DELETE' });
    loadData();
  };

  const handleUpdateStatus = async (id, status) => {
    await fetch('/api/orders/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black">Admin</h1>
          <p className="text-sm text-zinc-500">PostgreSQL catalog, offers, orders</p>
        </div>
        <Link href="/" className="text-sm font-bold text-amber-500">← Store</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'REVENUE', value: money(stats.totalRevenue || 0), icon: DollarSign },
          { label: 'ORDERS', value: stats.totalOrders, icon: ShoppingBag },
          { label: 'PRODUCTS', value: stats.totalProducts, icon: Package },
          { label: 'USERS', value: stats.totalUsers, icon: Users }
        ].map((c) => (
          <div key={c.label} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><c.icon className="w-5 h-5" /></div>
            <div><p className="text-xs text-zinc-500 font-bold">{c.label}</p><p className="text-xl font-black">{c.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleAddProduct} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-fit space-y-3">
          <h2 className="font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Add product / offer</h2>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full border rounded-lg p-2 text-sm" />
          <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Selling price $" className="w-full border rounded-lg p-2 text-sm" />
          <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Original price $ (optional)" className="w-full border rounded-lg p-2 text-sm" />
          <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="% off (optional)" className="w-full border rounded-lg p-2 text-sm" />
          <p className="text-[10px] text-zinc-500">Tip: set original price higher than selling price, or type a % off.</p>
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" className="w-full border rounded-lg p-2 text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg p-2 text-sm">
            <option>Electronics</option><option>Audio</option><option>Accessories</option>
          </select>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="w-full border rounded-lg p-2 text-sm" />
          <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full border rounded-lg p-2 text-sm" />
          <button className="w-full bg-amber-500 text-zinc-950 font-bold py-2.5 rounded-lg text-sm">Save</button>
        </form>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
            <h2 className="font-bold mb-4">Orders ({orders.length})</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase">
                  <th className="pb-2">ID</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-mono text-xs">{String(o.id).slice(0, 8)}</td>
                    <td className="py-3 text-xs">{o.user?.name || o.customerName}</td>
                    <td className="py-3 text-xs font-bold">{money(o.totalAmount)}</td>
                    <td className="py-3">
                      <select value={o.status} onChange={(e) => handleUpdateStatus(o.id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                        <option>PAID</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <h2 className="font-bold mb-4">Catalog ({products.length})</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {products.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{p.name} {p.onSale ? <span className="text-rose-400 text-[10px]">-{p.discountPercent}%</span> : null}</p>
                    <p className="text-xs text-zinc-500">{p.category} · {money(p.price)} · stock {p.stock}</p>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

save('src/app/api/products/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { applyDiscountFields } from '../../../lib/pricing';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const onSale = searchParams.get('onSale');
    const where = {};
    if (category && category !== 'All') where.category = category;
    if (onSale === 'true') where.onSale = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products. Check DATABASE_URL.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const deal = applyDiscountFields(body);
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        stock: parseInt(body.stock, 10) || 10,
        category: body.category || 'General',
        image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        featured: !!body.featured,
        ...deal
      }
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create' }, { status: 500 });
  }
}
`);

save('src/app/api/products/[id]/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.orderItem.deleteMany({ where: { productId: params.id } });
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
`);

save('src/app/api/orders/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        totalAmount: parseFloat(body.totalAmount),
        status: 'PAID',
        items: {
          create: (body.items || []).map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
`);

save('src/app/api/orders/[id]/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: body.status }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
`);

save('src/app/api/auth/register/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: 'CUSTOMER',
        theme: 'dark'
      }
    });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role, theme: user.theme }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
`);

save('src/app/api/auth/login/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
`);

save('src/app/api/users/[id]/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, city: true, theme: true }
    });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: body.name,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        theme: body.theme || 'dark'
      },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, city: true, theme: true }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
`);

save('src/app/api/users/[id]/password/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return NextResponse.json({ error: 'Current password is wrong' }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: params.id },
      data: { password: bcrypt.hashSync(newPassword, 10) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
`);

save('src/app/api/stats/route.js', `
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalUsers, rev] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } })
    ]);
    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: rev._sum.totalAmount || 0
    });
  } catch (error) {
    return NextResponse.json({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0, error: error.message });
  }
}
`);

const gitignorePath = path.join(process.cwd(), '.gitignore');
let gi = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
['node_modules', '.next', '.env', 'database.json'].forEach((line) => {
  if (!gi.includes(line)) gi += '\\n' + line;
});
fs.writeFileSync(gitignorePath, gi);

console.log('\\nDone. Next: put Neon URL in .env, then db push + seed.');
