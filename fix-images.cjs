const fs = require('fs');
const path = require('path');

function save(file, content) {
  const full = path.join(process.cwd(), file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
  console.log('✔ ' + file);
}

save('src/lib/imageSrc.js', `
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export function safeImageSrc(src) {
  if (!src || typeof src !== 'string') return FALLBACK_IMAGE;
  const cleaned = src.trim().replace(/^["']+|["']+$/g, '');
  if (
    cleaned.startsWith('https://') ||
    cleaned.startsWith('http://') ||
    cleaned.startsWith('/')
  ) {
    return cleaned;
  }
  return FALLBACK_IMAGE;
}
`);

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
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
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

save('fix-bad-db-images.cjs', `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FALLBACK =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';

function isWebUrl(src) {
  const s = String(src || '').trim().replace(/^["']+|["']+$/g, '');
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/');
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, image: true } });
  let fixed = 0;
  for (const p of products) {
    if (!isWebUrl(p.image)) {
      await prisma.product.update({
        where: { id: p.id },
        data: { image: FALLBACK }
      });
      console.log('Fixed image for:', p.name);
      console.log('  was:', p.image);
      fixed += 1;
    }
  }
  console.log(fixed ? 'Updated ' + fixed + ' product(s).' : 'All product images were already valid URLs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
`);

console.log('\\nImage crash fix written.');
ENDcat << 'END' > fix-images.cjs
const fs = require('fs');
const path = require('path');

function save(file, content) {
  const full = path.join(process.cwd(), file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
  console.log('✔ ' + file);
}

save('src/lib/imageSrc.js', `
export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export function safeImageSrc(src) {
  if (!src || typeof src !== 'string') return FALLBACK_IMAGE;
  const cleaned = src.trim().replace(/^["']+|["']+$/g, '');
  if (
    cleaned.startsWith('https://') ||
    cleaned.startsWith('http://') ||
    cleaned.startsWith('/')
  ) {
    return cleaned;
  }
  return FALLBACK_IMAGE;
}
`);

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
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
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

save('fix-bad-db-images.cjs', `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FALLBACK =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';

function isWebUrl(src) {
  const s = String(src || '').trim().replace(/^["']+|["']+$/g, '');
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/');
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, image: true } });
  let fixed = 0;
  for (const p of products) {
    if (!isWebUrl(p.image)) {
      await prisma.product.update({
        where: { id: p.id },
        data: { image: FALLBACK }
      });
      console.log('Fixed image for:', p.name);
      console.log('  was:', p.image);
      fixed += 1;
    }
  }
  console.log(fixed ? 'Updated ' + fixed + ' product(s).' : 'All product images were already valid URLs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
`);

console.log('\\nImage crash fix written.');
