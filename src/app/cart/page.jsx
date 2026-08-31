'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getPricing, money } from '../../lib/pricing';
import { safeImageSrc, FALLBACK_IMAGE } from '../../lib/imageSrc';
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
                    <img
                      src={safeImageSrc(item.image)}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    />
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
