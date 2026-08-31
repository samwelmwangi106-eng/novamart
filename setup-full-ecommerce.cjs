const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

function save(file, content) {
  const full = path.join(process.cwd(), file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim());
  console.log('✔ Created: ' + file);
}

console.log('Building Complete Real-World NovaMart E-Commerce System...\n');

// 1. Initial Database Seed Data
const initialDB = {
  users: [
    {
      id: 'usr_admin',
      name: 'NovaMart Admin',
      email: 'admin@novamart.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_customer',
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('user123', 10),
      role: 'CUSTOMER',
      createdAt: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 'prod_1',
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Active noise cancellation up to 35dB with 40-hour battery life and memory foam comfort cushions.',
      price: 199.99,
      stock: 40,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      name: 'Custom Mechanical Gaming Keyboard',
      id: 'prod_2',
      description: 'Hot-swappable tactile switches, per-key RGB lighting, and solid CNC aluminum construction.',
      price: 129.50,
      stock: 25,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod_3',
      name: 'Full-Grain Leather Everyday Backpack',
      description: 'Water-resistant vegetable-tanned leather featuring a dedicated 16-inch padded laptop compartment.',
      price: 149.00,
      stock: 18,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      featured: true
    },
    {
      id: 'prod_4',
      name: 'Smart Fitness Pro Watch',
      description: 'Continuous heart rate monitor, dual GPS, 50m water resistance, and AMOLED high-resolution screen.',
      price: 249.99,
      stock: 15,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      featured: true
    }
  ],
  orders: []
};

// 2. Database Helper Module (Database file saved in project root)
save('src/lib/db.js', `
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

export function getDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(${JSON.stringify(initialDB, null, 2)}, null, 2));
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

export function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
`);

// Write database.json immediately
const dbFile = path.join(process.cwd(), 'database.json');
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify(initialDB, null, 2));
  console.log('✔ Initialized database.json with products and users');
}

// 3. User Authentication Context
save('src/context/AuthContext.jsx', `
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('novamart_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('novamart_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('novamart_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
`);

// 4. Products APIs
save('src/app/api/products/route.js', `
import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export async function GET(req) {
  try {
    const db = getDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let list = db.products || [];

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = getDB();

    const newProduct = {
      id: 'prod_' + Date.now(),
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      stock: parseInt(body.stock) || 10,
      category: body.category || 'General',
      image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      featured: body.featured || false,
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    saveDB(db);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
`);

save('src/app/api/products/[id]/route.js', `
import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../../lib/db';

export async function GET(req, { params }) {
  try {
    const db = getDB();
    const product = db.products.find((p) => p.id === params.id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = getDB();
    db.products = db.products.filter((p) => p.id !== params.id);
    saveDB(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
`);

// 5. Orders APIs
save('src/app/api/orders/route.js', `
import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export async function GET(req) {
  try {
    const db = getDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let orders = db.orders || [];
    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = getDB();

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      userId: body.userId,
      customerName: body.customerName || 'Customer',
      totalAmount: parseFloat(body.totalAmount),
      items: body.items || [],
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDB(db);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
`);

save('src/app/api/orders/[id]/route.js', `
import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../../lib/db';

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const db = getDB();
    const order = db.orders.find((o) => o.id === params.id);

    if (order) {
      order.status = body.status;
      saveDB(db);
      return NextResponse.json(order);
    }
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
`);

// 6. User Auth APIs (Login & Register)
save('src/app/api/auth/register/route.js', `
import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const db = getDB();
    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: 'CUSTOMER',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
`);

save('src/app/api/auth/login/route.js', `
import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const db = getDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
`);

// 7. Stats API for Dashboard
save('src/app/api/stats/route.js', `
import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

export async function GET() {
  try {
    const db = getDB();
    const totalProducts = (db.products || []).length;
    const totalOrders = (db.orders || []).length;
    const totalUsers = (db.users || []).length;
    const totalRevenue = (db.orders || []).reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
`);

// 8. Root Layout
save('src/app/layout.jsx', `
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'NovaMart | Full-Stack E-Commerce',
  description: 'Full-Stack Next.js E-Commerce Store with Real Database, Orders, and Auth'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col justify-between">
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
`);

// 9. Navbar
save('src/components/Navbar.jsx', `
'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
          NOVA<span className="text-gray-900">MART</span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">
            Store
          </Link>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm font-bold text-indigo-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 flex items-center gap-1">
                <User className="w-4 h-4" /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} title="Log Out" className="text-gray-400 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 flex items-center gap-1">
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}
          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
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

// 10. Homepage with live search & category filter
save('src/app/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    let url = '/api/products?';
    if (category !== 'All') url += 'category=' + encodeURIComponent(category) + '&';
    if (search) url += 'search=' + encodeURIComponent(search);
    const res = await fetch(url);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center mb-10 shadow-lg">
        <h1 className="text-3xl sm:text-5xl font-black mb-3">Premium Hardware & Audio</h1>
        <p className="text-indigo-200 max-w-xl mx-auto text-sm sm:text-base mb-6">
          Real products saved directly in your database with live inventory tracking.
        </p>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white text-gray-900 rounded-full py-3 pl-11 pr-4 text-sm focus:outline-none shadow-md"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['All', 'Electronics', 'Audio', 'Accessories'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={'px-5 py-2 rounded-full text-xs font-bold transition ' + (category === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border text-gray-700 hover:bg-gray-50')}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading products from database...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400 text-sm">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
`);

// 11. Product Card
save('src/components/ProductCard.jsx', `
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <Link href={'/products/' + product.id}>
        <div className="relative aspect-square bg-gray-50">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-gray-700 uppercase">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={'/products/' + product.id}>
            <h3 className="text-sm font-bold text-gray-900 hover:text-indigo-600 line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-base font-black text-gray-900">{'$' + product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl flex items-center gap-1 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
`);

// 12. Product Detail Page
save('src/app/products/[id]/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products/' + id)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading product...</div>;
  if (!product || product.error) return <div className="text-center py-20 text-gray-400">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{product.category}</span>
          <h1 className="text-3xl font-black text-gray-900 mt-1">{product.name}</h1>
          <p className="text-3xl font-black text-gray-900 mt-4">{'$' + product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-xs text-gray-400 mt-2">Available Stock: {product.stock} units</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow"
          >
            <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart
          </button>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 text-xs text-gray-500">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-indigo-600" /> Free express delivery</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600" /> 2-year warranty included</div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// 13. Shopping Cart & Database Order Placement
save('src/app/cart/page.jsx', `
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
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
      alert('Please login or register to complete your order!');
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
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm mt-2">Explore our collection and add items to your cart.</p>
        <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">{'$' + item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 text-gray-600">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 text-gray-600">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-1">
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
            <span>{'$' + totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Shipping</span>
            <span className="text-emerald-600 font-bold">FREE</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-black text-lg mb-6">
            <span>Total</span>
            <span>{'$' + totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow"
          >
            {loading ? 'Processing Order...' : 'Place Order Now'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
`);

// 14. Checkout Success
save('src/app/checkout/success/page.jsx', `
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
        ✓
      </div>
      <h1 className="text-2xl font-black text-gray-900">Order Confirmed!</h1>
      <p className="text-sm text-gray-500 mt-2">
        Your order has been recorded into the database and is being processed.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="/profile" className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
          View Order in Profile
        </Link>
        <Link href="/" className="text-gray-600 font-semibold text-xs mt-2 hover:underline">
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}
`);

// 15. User Login & Register
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
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">Sign In to NovaMart</h1>
      {error && <p className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Need an account? <Link href="/register" className="text-indigo-600 font-bold">Register here</Link>
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1">
        <p className="font-bold">Test Credentials:</p>
        <p>Admin: <span className="font-mono">admin@novamart.com</span> / <span className="font-mono">admin123</span></p>
        <p>User: <span className="font-mono">john@example.com</span> / <span className="font-mono">user123</span></p>
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
      setError(data.error || 'Registration failed');
      setLoading(false);
    } else {
      login(data);
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <h1 className="text-2xl font-black text-gray-900 mb-6 text-center">Create Account</h1>
      {error && <p className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Already have an account? <Link href="/login" className="text-indigo-600 font-bold">Sign in</Link>
      </p>
    </div>
  );
}
`);

// 16. User Profile & Order History
save('src/app/profile/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

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

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-2">My Account</h1>
      <p className="text-gray-500 mb-8">{user?.name} • {user?.email} ({user?.role})</p>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Past Orders ({orders.length})</h2>
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400 text-sm">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs font-bold text-indigo-600">{order.id}</span>
                <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded">{order.status}</span>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name || 'Product'} x{item.quantity}</span>
                    <span className="font-bold">{'$' + (item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-black">
                <span>Total Paid</span>
                <span>{'$' + order.totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`);

// 17. Admin Dashboard
save('src/app/admin/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingBag, Package, Users, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('10');

  const loadData = async () => {
    const s = await (await fetch('/api/stats')).json();
    setStats(s);
    const p = await (await fetch('/api/products')).json();
    setProducts(Array.isArray(p) ? p : []);
    const o = await (await fetch('/api/orders')).json();
    setOrders(Array.isArray(o) ? o : []);
  };

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        alert('Access denied. Admin only.');
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
      body: JSON.stringify({ name, price, category, description, image, stock })
    });
    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setStock('10');
    loadData();
    alert('Product added to database!');
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
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
          <h1 className="text-3xl font-black text-gray-900">Admin Control Center</h1>
          <p className="text-sm text-gray-500">Live operational data and inventory management</p>
        </div>
        <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-xl text-sm">
          ← Back to Store
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-3">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-400 font-bold">REVENUE</p><p className="text-xl font-black">{'$' + stats.totalRevenue.toFixed(2)}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-400 font-bold">ORDERS</p><p className="text-xl font-black">{stats.totalOrders}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Package className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-400 font-bold">PRODUCTS</p><p className="text-xl font-black">{stats.totalProducts}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-400 font-bold">USERS</p><p className="text-xl font-black">{stats.totalUsers}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="w-full border rounded-lg p-2 text-sm" />
            <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price ($)" className="w-full border rounded-lg p-2 text-sm" />
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock quantity" className="w-full border rounded-lg p-2 text-sm" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg p-2 text-sm">
              <option>Electronics</option><option>Audio</option><option>Accessories</option>
            </select>
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (optional)" className="w-full border rounded-lg p-2 text-sm" />
            <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border rounded-lg p-2 text-sm" />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm">Save to Database</button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Orders ({orders.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-gray-400 uppercase">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 font-mono text-xs">{o.id}</td>
                      <td className="py-3 font-bold text-xs">{o.customerName || 'Customer'}</td>
                      <td className="py-3 font-bold text-xs">{'$' + o.totalAmount.toFixed(2)}</td>
                      <td className="py-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          className="border rounded px-2 py-1 text-xs"
                        >
                          <option>PAID</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="4" className="py-6 text-center text-gray-400 text-xs">No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Active Catalog ({products.length})</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {products.map((p) => (
                <div key={p.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category} • {'$' + p.price.toFixed(2)} • {p.stock} in stock</p>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
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

console.log('\nAll NovaMart full-stack files generated successfully!');
