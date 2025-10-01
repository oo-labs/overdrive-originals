/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Modern device breakpoints based on 2024 best practices
        'xs': '375px',    // iPhone SE, small phones
        'sm': '640px',    // Small tablets, large phones
        'md': '768px',    // Tablets
        'lg': '1024px',   // Small laptops
        'xl': '1280px',   // Laptops, desktops
        '2xl': '1536px',  // Large desktops
        '3xl': '1920px',  // Ultra-wide monitors
        
        // Device-specific breakpoints
        'iphone-se': '375px',      // iPhone SE
        'iphone-12': '390px',      // iPhone 12/13/14/15
        'iphone-12-pro': '428px',  // iPhone 12/13/14/15 Pro Max
        'iphone-17-pro-max': '430px', // iPhone 17 Pro Max
        'galaxy-s24': '412px',     // Samsung Galaxy S24
        'pixel-8': '412px',        // Google Pixel 8
        'ipad-mini': '768px',      // iPad Mini
        'ipad': '820px',           // iPad
        'ipad-pro': '1024px',      // iPad Pro
        'surface': '912px',        // Microsoft Surface
        'macbook': '1280px',       // MacBook
        'imac': '1920px',          // iMac
        
        // Orientation-specific
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
        
        // Height-based breakpoints for mobile
        'h-xs': { 'raw': '(max-height: 667px)' },  // iPhone SE height
        'h-sm': { 'raw': '(max-height: 812px)' },  // iPhone X height
        'h-md': { 'raw': '(max-height: 896px)' },  // iPhone 11 Pro Max height
        'h-lg': { 'raw': '(max-height: 932px)' },  // iPhone 17 Pro Max height
      },
    },
  },
  plugins: [],
}
