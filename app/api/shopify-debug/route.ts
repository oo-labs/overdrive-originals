import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    return NextResponse.json({
      hasStoreDomain: !!storeDomain,
      hasAccessToken: !!accessToken,
      storeDomain: storeDomain ? `${storeDomain.substring(0, 10)}...` : 'undefined',
      accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : 'undefined',
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
