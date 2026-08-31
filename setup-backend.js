const fs = require('fs');
const path = require('path');

const files = {
  'src/lib/db.js': `import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

const initialData = {
  products: [
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
    }
  ],
  orders: []
};

export function getDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

export function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
`,

  'src/app/api/products/route.js': `import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json(db.products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = getDB();

    const newProduct = {
      id: Date.now().toString(),
      name: body.name,
      price: parseFloat(body.price),
      category: body.category || 'General',
      description: body.description || '',
      image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
    };

    db.products.push(newProduct);
    saveDB(db);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
`,

  'src/app/api/orders/route.js': `import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json(db.orders);
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
      items: body.items || [],
      totalPrice: body.totalPrice || 0,
      customerName: body.customerName || 'Guest Customer',
      status: 'PAID',
      createdAt: new Date().toLocaleString()
    };

    db.orders.unshift(newOrder);
    saveDB(db);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}
`,

  'src/app/admin/page.jsx': `'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const prodRes = await fetch('/api/products');
    const prodData = await prodRes.json();
    setProducts(prodData);

    const ordRes = await fetch('/api/orders');
    const ordData = await ordRes.json();
    setOrders(ordData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, category, description, image })
    });

    setName('');
    setPrice('');
    setDescription('');
    setImage('');
    setLoading(false);
    fetchData();
    alert('Product added to Backend Database!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Backend Center</h1>
          <p className="text-sm text-gray-500">Manage database products and view incoming customer orders</p>
        </div>
        <Link href="/" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-xl text-sm">
          ← Back to Store
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">+ Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Product Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 4K OLED Monitor"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299.99"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm"
            >
              {loading ? 'Saving to Backend...' : 'Save Product'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">No orders placed yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600">{order.id}</span>
                      <p className="text-sm font-bold text-gray-900 mt-1">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items • {order.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-gray-900">
                        {'$' + Number(order.totalPrice).toFixed(2)}
                      </span>
                      <span className="block text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded mt-1">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Backend Products ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-600">{p.category}</p>
                    <p className="text-sm font-bold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{'$' + Number(p.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`
};

console.log('Adding backend routes...');
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Added: ' + filePath);
});

console.log('\nBackend added successfully!');
