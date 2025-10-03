'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, ShopifyProduct } from '../../lib/shopify';
import ProductCard from '../components/ProductCard';
import StoreBackgroundVideo from '../components/StoreBackgroundVideo';

export default function StorePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedProducts = await getProducts(50);
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <StoreBackgroundVideo />
      <main className="relative z-10 w-full h-full flex items-center justify-center px-4 py-4">
      <div className="max-w-7xl w-full flex flex-col" style={{ height: 'calc(100vh - clamp(160px, 20vh, 240px))' }}>
        <div className="glass border border-black flex-1 flex flex-col min-h-0 max-h-full">
          {/* Fixed header */}
          <div className="flex-shrink-0 text-center p-8 sm:p-12 pb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Overdrive Originals Store
            </h1>
            <p className="text-white/80 text-lg">
              Parts, merch, and build-related items for automotive enthusiasts
            </p>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto content-scroll px-8 sm:px-12">
            <div className="pb-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-white/70 text-lg">Loading products...</div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-lg mb-4">{error}</div>
                  <p className="text-white/70">
                    Our store is being set up. Check back soon for parts, merch, and build-related items!
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-white/70 text-lg mb-4">
                    No products found
                  </div>
                  <p className="text-white/60 mb-4">
                    We&apos;re setting up parts, merch, and build-related items. Check back soon!
                  </p>
                  <div className="text-white/50 text-sm bg-black/20 p-4 rounded-lg border border-white/10">
                    <p className="mb-2">For store owners:</p>
                    <p>Make sure your products are published and available for sale in your Shopify admin.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Fixed footer */}
          <div className="flex-shrink-0 text-center p-8 sm:p-12 pt-4">
            <Link 
              href="/" 
              className="inline-block glass px-6 py-3 border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}

