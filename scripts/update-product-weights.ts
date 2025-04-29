import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  images: string[];
  options: Array<{
    name: string;
    values: string[];
  }>;
  variants: Array<{
    sku: string;
    price: number;
    inventory: number;
    option1?: string;
    option2?: string;
    option3?: string;
    weight?: number;
  }>;
  weight?: number;
}

// Weight estimation rules
const weightRules = {
  // Intercoolers (kg)
  'Turbo Components': (product: Product) => {
    if (product.name.includes('INTERCOOLER')) {
      const dimensions = product.description.match(/(\d+)mm.*?(\d+)mm.*?(\d+)mm/);
      if (dimensions) {
        const [width, height, depth] = dimensions.slice(1).map(Number);
        // Calculate volume in cubic meters and estimate weight based on aluminum density (2700 kg/m³)
        const volume = (width * height * depth) / 1000000000; // Convert to m³
        return Math.round(volume * 2700 * 0.7); // 0.7 factor for hollow structure
      }
      return 5; // Default weight for small intercoolers
    }
    if (product.name.includes('BLOW OFF VALVE')) return 0.8;
    if (product.name.includes('TURBO FLANGE')) return 0.5;
    return 1; // Default weight for other turbo components
  },

  // Fuel Rails (kg)
  'Fuel Systems': (product: Product) => {
    if (product.name.includes('LS1')) return 1.5;
    if (product.name.includes('2JZ')) return 1.8;
    if (product.name.includes('RB25')) return 1.6;
    if (product.name.includes('SR20')) return 1.4;
    return 1.5; // Default weight
  },

  // Clamps & Fasteners (kg)
  'Clamps & Fasteners': (product: Product) => {
    if (product.name.includes('P CLAMP')) return 0.1;
    if (product.name.includes('QUICK RELEASE')) return 0.3;
    return 0.2; // Default weight
  },

  // Engine Components (kg)
  'Engine Components': (product: Product) => {
    if (product.name.includes('THROTTLE BODY')) return 2.5;
    if (product.name.includes('HARNESS')) return 3; // As specified in description
    if (product.name.includes('BONNET PIN')) return 0.2;
    if (product.name.includes('STUBBY HOLDER')) return 0.1;
    return 1; // Default weight
  },

  // Cooling Systems (kg)
  'Cooling Systems': (product: Product) => {
    if (product.name.includes('OIL COOLER')) {
      if (product.description.includes('15 Row')) return 3.5;
      if (product.description.includes('7 Row')) return 2;
      return 2.5;
    }
    if (product.name.includes('INTERCOOLER')) {
      const dimensions = product.description.match(/(\d+)x(\d+)x(\d+)mm/);
      if (dimensions) {
        const [width, height, depth] = dimensions.slice(1).map(Number);
        const volume = (width * height * depth) / 1000000000;
        return Math.round(volume * 2700 * 0.7);
      }
    }
    return 2; // Default weight
  },

  // Services (no physical weight)
  'Services': () => 0,
};

// Read products file
const productsPath = join(process.cwd(), 'data', 'products.json');
const products: Product[] = JSON.parse(readFileSync(productsPath, 'utf-8'));

// Update weights
const updatedProducts = products.map(product => {
  const weightEstimator = weightRules[product.category as keyof typeof weightRules];
  if (weightEstimator) {
    const estimatedWeight = weightEstimator(product);
    product.weight = estimatedWeight;
    
    // Update variants if they don't have weights
    product.variants = product.variants.map(variant => ({
      ...variant,
      weight: variant.weight || estimatedWeight
    }));
  }
  return product;
});

// Write updated products
writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log('Product weights updated successfully!'); 