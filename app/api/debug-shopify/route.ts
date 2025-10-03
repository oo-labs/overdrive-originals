import { NextResponse } from 'next/server';
import { getProducts } from '../../../lib/shopify';

export async function GET() {
  try {
    console.log('=== DEBUG: Starting Shopify product fetch ===');
    
    const products = await getProducts(12);
    
    console.log('=== DEBUG: Product fetch completed ===');
    console.log('Products found:', products.length);
    
    return NextResponse.json({
      success: true,
      productCount: products.length,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('=== DEBUG: Error in product fetch ===', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}
