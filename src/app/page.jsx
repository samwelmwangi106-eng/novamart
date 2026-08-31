'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../Components/ProductCard';
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
          className={'px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-1 ' + (offersOnly
            ? 'bg-rose-600 text-white border-rose-600'
            : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300')}
        >
          <Tag className="w-3.5 h-3.5" /> On sale
        </button>
      </div>

      {loading ? (
        <p className="text-center py-16 text-zinc-500 text-sm">Loading from Store..</p>
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
