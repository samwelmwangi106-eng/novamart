const fs = require('fs');
const path = require('path');

function save(file, content) {
  const full = path.join(process.cwd(), file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
  console.log('✔ Created: ' + file);
}

// 1. Safe image utility
save('src/lib/imageSrc.js', `
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export function safeImageSrc(src) {
  if (!src || typeof src !== 'string') return FALLBACK_IMAGE;
  const cleaned = src.trim().replace(/^["']+|["']+$/g, '');
  if (cleaned.startsWith('https://') || cleaned.startsWith('http://') || cleaned.startsWith('/')) {
    return cleaned;
  }
  return FALLBACK_IMAGE;
}
`);

// 2. ProductCard with bulletproof regular <img> tag (prevents Next.js URL crash)
save('src/components/ProductCard.jsx', `
'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { getPricing, money } from '../lib/pricing';
import { safeImageSrc, FALLBACK_IMAGE } from '../lib/imageSrc';
import { Plus } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const deal = getPricing(product);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between">
      <Link href={'/products/' + product.id}>
        <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <img
            src={safeImageSrc(product.image)}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
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

// 3. Product detail page with safe image
save('src/app/products/[id]/page.jsx', `
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { getPricing, money } from '../../../lib/pricing';
import { safeImageSrc, FALLBACK_IMAGE } from '../../../lib/imageSrc';
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
          <img
            src={safeImageSrc(product.image)}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          />
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

// 4. Cart page with safe image
save('src/app/cart/page.jsx', `
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
`);

console.log('\nAll image safeguards installed.');
