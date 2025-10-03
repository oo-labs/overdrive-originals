import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import collectionsConfig from '../config/shopify-collections.json';

// Check if Shopify is configured
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const isShopifyConfigured = SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Only create client if Shopify is configured
const client = isShopifyConfigured ? createStorefrontApiClient({
  storeDomain: SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2025-01',
  publicAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
}) : null;

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

const GET_PRODUCTS_BY_COLLECTIONS_QUERY = `
  query getProductsByCollections($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          products(first: $first, sortKey: $sortKey, reverse: $reverse) {
            edges {
              node {
                id
                title
                handle
                description
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                variants(first: 5) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Helper function to convert collection names to handles
function collectionNameToHandle(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function getProducts(count: number = 12): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured || !client) {
    console.log('Shopify not configured, returning empty products array');
    return [];
  }

  try {
    // Get enabled collections from config
    const enabledCollections = collectionsConfig.enabledCollections;
    const collectionHandles = enabledCollections.map(collectionNameToHandle);
    
    console.log('Fetching products for collections:', enabledCollections);
    console.log('Collection handles:', collectionHandles);
    
    const response = await client.request(GET_PRODUCTS_BY_COLLECTIONS_QUERY, {
      variables: { 
        first: count,
        sortKey: collectionsConfig.displaySettings.sortBy,
        reverse: collectionsConfig.displaySettings.sortOrder === 'DESC'
      },
    });

    console.log('Shopify API response:', response);

    // Extract products from enabled collections only
    const allProducts: ShopifyProduct[] = [];
    
    if (response.data?.collections?.edges) {
      console.log('Found collections:', response.data.collections.edges.length);
      
      for (const collectionEdge of response.data.collections.edges) {
        const collection = collectionEdge.node;
        console.log(`Collection: ${collection.title} (${collection.handle})`);
        
        // Only include products from enabled collections
        if (collectionHandles.includes(collection.handle) && collection.products?.edges) {
          console.log(`Found ${collection.products.edges.length} products in ${collection.title}`);
          for (const productEdge of collection.products.edges) {
            allProducts.push(productEdge.node);
          }
        } else {
          console.log(`Skipping collection ${collection.title} - not in enabled list or no products`);
        }
      }
    }

    console.log(`Total products found: ${allProducts.length}`);

    // Remove duplicates based on product ID
    const uniqueProducts = allProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    console.log(`Unique products after deduplication: ${uniqueProducts.length}`);

    // Limit to requested count
    const finalProducts = uniqueProducts.slice(0, count);
    console.log(`Returning ${finalProducts.length} products`);
    
    return finalProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function getProductImageUrl(product: ShopifyProduct): string {
  return product.images.edges[0]?.node.url || '/placeholder-product.jpg';
}

export function getProductImageAlt(product: ShopifyProduct): string {
  return product.images.edges[0]?.node.altText || product.title;
}

// Get enabled collections info
export function getEnabledCollections(): string[] {
  return collectionsConfig.enabledCollections;
}

// Get collection display settings
export function getCollectionDisplaySettings() {
  return collectionsConfig.displaySettings;
}
