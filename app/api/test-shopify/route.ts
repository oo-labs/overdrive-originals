import { NextResponse } from 'next/server';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export async function GET() {
  try {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      return NextResponse.json({ error: 'Missing environment variables' });
    }

    // Test different API versions
    const versions = ['2024-10', '2024-07', '2024-04', '2023-10'];
    const results = [];

    for (const version of versions) {
      try {
        const client = createStorefrontApiClient({
          storeDomain,
          apiVersion: version,
          publicAccessToken: accessToken,
        });

        const query = `
          query {
            shop {
              name
              id
            }
            products(first: 1) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        `;

        const response = await client.request(query);
        results.push({
          version,
          success: true,
          shopName: response.data?.shop?.name,
          productCount: response.data?.products?.edges?.length || 0,
          fullResponse: response.data,
          error: null
        });
      } catch (error: unknown) {
        results.push({
          version,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      storeDomain,
      accessTokenLength: accessToken.length,
      results
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
