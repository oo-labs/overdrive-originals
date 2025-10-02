import Image from 'next/image';
import { ShopifyProduct, formatPrice, getProductImageUrl, getProductImageAlt } from '../../lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product);
  const imageAlt = getProductImageAlt(product);
  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );

  const handleAddToCart = () => {
    // For now, redirect to Shopify product page
    // Later we can implement proper cart functionality
    const shopifyUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${product.handle}`;
    window.open(shopifyUrl, '_blank');
  };

  return (
    <div className="glass border border-white/20 rounded-xl overflow-hidden group hover:border-cyan-400/50 transition-all duration-300">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        {product.description && (
          <p className="text-white/70 text-sm mb-3 line-clamp-3">
            {product.description.replace(/<[^>]*>/g, '')} {/* Strip HTML tags */}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-bold text-xl">
            {price}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300 text-sm"
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
}
