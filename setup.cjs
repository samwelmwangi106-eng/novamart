const fs = require('fs');
const path = require('path');

const files = {
  'package.json': JSON.stringify({
    name: 'novamart',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start'
    },
    dependencies: {
      'lucide-react': '^0.344.0',
      next: '14.1.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      autoprefixer: '^10.4.18',
      postcss: '^8.4.35',
      tailwindcss: '^3.4.1'
    }
  }, null, 2),

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
`,

  'src/data/products.js': `export const products = [
  {
    id: '1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 199.99,
    category: 'Audio',
    description: 'Premium sound with 40-hour battery life and memory foam comfort.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    price: 129.50,
    category: 'Electronics',
    description: 'Custom tactile switches, RGB lighting, and solid aluminum frame.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Leather Everyday Backpack',
    price: 149.00,
    category: 'Accessories',
    description: 'Water-resistant genuine leather with 16-inch laptop compartment.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Smart Fitness Watch',
    price: 249.99,
    category: 'Electronics',
    description: 'Heart rate tracker, GPS, sleep monitor, and waterproof display.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  },
];
`,

  'src/context/CartContext.jsx': `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('novamart_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Cart load error', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('novamart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
`,

  'src/components/Navbar.jsx': `'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
          NOVA<span className="text-gray-900">MART</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
`,

  'src/components/Footer.jsx': `export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-white font-bold text-lg mb-2">NOVAMART</p>
        <p className="text-xs">All rights reserved &copy; {new Date().getFullYear()} NovaMart Store.</p>
      </div>
    </footer>
  );
}
`,

  'src/components/ProductCard.jsx': `'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div className="relative aspect-square bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-black text-gray-900">$\{product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl flex items-center gap-1 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f8fafc;
  color: #0f172a;
}
`,

  'src/app/layout.jsx': `import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'NovaMart | Store',
  description: 'NovaMart JavaScript E-Commerce Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
`,

  'src/app/page.jsx': `import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-white text-center mb-12 shadow-md">
        <h1 className="text-3xl sm:text-5xl font-black mb-4">Welcome to NovaMart</h1>
        <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
          Find the latest electronics, premium accessories, and audio gear at the best prices.
        </p>
      </div>

      <h2 className="text-2xl font-black text-gray-900 mb-6">Popular Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
`,

  'src/app/cart/page.jsx': `'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Link
          href="/"
          className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">$\{item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4">Summary</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>$\{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Shipping</span>
            <span className="text-emerald-600 font-bold">FREE</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-black text-lg mb-6">
            <span>Total</span>
            <span>$\{totalPrice.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout/success"
            className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
`,

  'src/app/checkout/success/page.jsx': `'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '../../../context/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        ✓
      </div>
      <h1 className="text-2xl font-black text-gray-900">Order Placed!</h1>
      <p className="text-sm text-gray-500 mt-2">
        Thank you for shopping with NovaMart. Your order is confirmed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 text-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}
`,

  'CHANGELOG.md': `# NovaMart - Full JavaScript Edition

## What was created:
- Pure JavaScript and JSX frontend.
- Persistent Cart with browser local storage.
- Interactive Storefront (Homepage, Cart, Checkout confirmation).
- Pre-styled with Tailwind CSS.
`
};

console.log('Generating complete JavaScript NovaMart folder...');

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Created: ' + filePath);
});

console.log('\nAll NovaMart files created successfully!');
