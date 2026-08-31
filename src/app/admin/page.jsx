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
