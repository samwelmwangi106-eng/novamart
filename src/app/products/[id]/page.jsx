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
