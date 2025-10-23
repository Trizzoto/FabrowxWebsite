export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  featured?: boolean
}

export async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
      ? (process.env.NEXT_PUBLIC_BASE_URL.startsWith('http') 
          ? process.env.NEXT_PUBLIC_BASE_URL 
          : `https://${process.env.NEXT_PUBLIC_BASE_URL}`)
      : (process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'http://localhost:3000');
    
    console.log(`Fetching products from: ${baseUrl}/api/products`);
    
    const response = await fetch(`${baseUrl}/api/products`, { 
      next: { revalidate: 30 } // Revalidate every 30 seconds
    });
    
    if (!response.ok) {
      // Instead of throwing, log the error and return an empty array
      const errorText = await response.text();
      console.error(`Error fetching products: ${response.status} ${response.statusText}`, errorText);
      return []; // Return empty array instead of throwing
    }
    
    // Check if the response is valid JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Expected JSON but got ${contentType}. Response:`, await response.text());
      return []; // Return empty array
    }
    
    const products = await response.json();
    
    if (!Array.isArray(products)) {
      console.error('API returned non-array response:', products);
      return []; // Return empty array if response is not an array
    }
    
    return products;
  } catch (error) {
    // Log the error but don't throw
    console.error('Error in getProducts:', error);
    return []; // Return empty array on any error
  }
} 