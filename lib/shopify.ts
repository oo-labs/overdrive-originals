import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Check if Shopify is configured
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const isShopifyConfigured = SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Only create client if Shopify is configured
const client = isShopifyConfigured ? createStorefrontApiClient({
  storeDomain: SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-10',
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

const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
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
`;

export async function getProducts(count: number = 12): Promise<ShopifyProduct[]> {
  console.log('Shopify configuration check:', {
    storeDomain: SHOPIFY_STORE_DOMAIN,
    hasToken: !!SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    isConfigured: isShopifyConfigured,
    hasClient: !!client
  });

  if (!isShopifyConfigured || !client) {
    console.log('Shopify not configured, returning empty products array');
    return [];
  }

  try {
    console.log('Attempting to fetch products from Shopify...');
    const response = await client.request<ShopifyProductsResponse>(GET_PRODUCTS_QUERY, {
      variables: { first: count },
    });

    console.log('Shopify response:', response);
    const products = response.data?.products?.edges?.map(edge => edge.node) || [];
    console.log('Products found:', products.length);
    return products;
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
