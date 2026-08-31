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
