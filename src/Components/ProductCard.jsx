'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from './ui/Button';
import { formatKES } from '@/lib/currency/format';

export default function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push('/checkout'), 500);
  };

  const inStock = product.stock > 0;
  const discount = product.onSale ? product.discountPercent : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={product.image || '/placeholder-product.jpg'} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{discount}%
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase">{product.category}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-600">
              {formatKES(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm">
                {formatKES(product.originalPrice)}
              </span>
            )}
          </div>
          {inStock && (
            <span className="text-sm text-gray-500">
              {product.stock} in stock
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={isAdding || !inStock}
          >
            {isAdding ? '✓ Added to Cart!' : inStock ? '🛒 Add to Cart' : 'Out of Stock'}
          </Button>

          {inStock && (
            <Button
              variant="secondary"
              fullWidth
              onClick={handleBuyNow}
            >
              Buy Now →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
