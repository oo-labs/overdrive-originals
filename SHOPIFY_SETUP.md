# Shopify Integration Setup

## Required Environment Variables

Add these environment variables to your deployment platform (Vercel, Netlify, etc.) and local `.env.local` file:

### Shopify Configuration
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

## How to Get Shopify Credentials

### 1. Store Domain
- Your store domain is in the format: `your-store-name.myshopify.com`
- You can find this in your Shopify admin dashboard URL

### 2. Storefront Access Token
1. Log into your Shopify admin dashboard
2. Go to **Apps** → **App and sales channel settings**
3. Click **Develop apps** (at the bottom)
4. Click **Create an app**
5. Name your app (e.g., "Overdrive Originals Website")
6. Click **Configure Storefront API scopes**
7. Enable these permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_pickup_locations`
8. Click **Save**
9. Go to **API credentials** tab
10. Click **Install app**
11. Copy the **Storefront access token**

## Features

### ✅ What the integration includes:
- Product listing with images, titles, descriptions, and prices
- Responsive grid layout matching site design
- Glass morphism styling consistent with site theme
- Loading states and error handling
- Direct links to Shopify product pages for purchase
- Automatic currency formatting
- Image optimization with Next.js Image component

### 🎯 Store Page Features:
- **Product Grid**: Responsive layout (1-4 columns based on screen size)
- **Product Cards**: Glass-styled cards with hover effects
- **Product Images**: Optimized images with hover zoom
- **Pricing**: Formatted currency display
- **Call-to-Action**: "View Product" buttons linking to Shopify
- **Error Handling**: Graceful fallbacks for API issues
- **Loading States**: User-friendly loading indicators

### 🛒 Purchase Flow:
- Clicking "View Product" opens the Shopify product page in a new tab
- Users complete purchase on your Shopify store
- Future enhancement: Add cart functionality directly on site

## Store Tile

The store tile has been added to the main page with:
- **Title**: "Store"
- **Subtitle**: "Parts & Merch"
- **Icon**: Uses the existing merch.svg icon
- **Link**: Directs to `/store` page

## Testing

1. Set up environment variables
2. Add some products to your Shopify store
3. Deploy the application
4. Visit the store page to see products
5. Test product links to ensure they redirect to Shopify

## Troubleshooting

### Common Issues:
1. **"Failed to load products"** - Check environment variables and API permissions
2. **"Store coming soon"** - No products in Shopify store yet
3. **Images not loading** - Check product images are uploaded in Shopify
4. **API errors** - Verify Storefront API permissions are enabled

### Debug Mode:
Check browser console for detailed error messages during product fetching.

## Future Enhancements

### Potential additions:
- Shopping cart functionality
- Checkout integration
- Product search and filtering
- Product categories
- Inventory tracking
- Customer reviews
- Wishlist functionality
