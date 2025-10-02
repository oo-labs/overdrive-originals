import { NextResponse } from 'next/server';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export async function GET() {
  try {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      return NextResponse.json({ error: 'Missing environment variables' });
    }

    const client = createStorefrontApiClient({
      storeDomain,
      apiVersion: '2024-10',
      publicAccessToken: accessToken,
    });

    // Test basic shop info
    const shopQuery = `
      query {
        shop {
          name
          id
        }
      }
    `;

    const shopResponse = await client.request(shopQuery);
    
    // Test products query
    const productsQuery = `
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              status
              availableForSale
              publishedAt
              collections(first: 5) {
                edges {
                  node {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    `;

    const productsResponse = await client.request(productsQuery);

    return NextResponse.json({
      shop: shopResponse.data?.shop,
      products: productsResponse.data?.products?.edges?.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        status: edge.node.status,
        availableForSale: edge.node.availableForSale,
        publishedAt: edge.node.publishedAt,
        collections: edge.node.collections?.edges?.map(c => c.node) || []
      })) || []
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
