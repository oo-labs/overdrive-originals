import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    hasStoreDomain: !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    hasAccessToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ? 
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN.substring(0, 10) + '...' : 'undefined',
    accessTokenLength: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.length || 0,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('SHOPIFY')).sort()
  };

  return NextResponse.json(debugInfo);
}
