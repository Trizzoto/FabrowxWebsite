import { NextResponse } from 'next/server';

// Shipping rates based on distance from Sydney (in km)
const SHIPPING_RATES = {
  LOCAL: { // Within 50km
    base: 10,
    perKg: 1
  },
  REGIONAL: { // 50-200km
    base: 15,
    perKg: 1.5
  },
  INTERSTATE: { // 200-1000km
    base: 20,
    perKg: 2
  },
  REMOTE: { // 1000+ km
    base: 25,
    perKg: 2.5
  }
};

// Approximate distances from Sydney to major cities
const CITY_DISTANCES = {
  'SYDNEY': 0,
  'MELBOURNE': 880,
  'BRISBANE': 920,
  'PERTH': 4000,
  'ADELAIDE': 1400,
  'HOBART': 1500,
  'DARWIN': 4000,
  'CANBERRA': 300
};

export async function POST(request: Request) {
  try {
    const { address, items } = await request.json();
    
    // Calculate total weight using actual product weights
    const totalWeight = items.reduce((sum: number, item: any) => {
      // If weight is not provided, use a default of 0.5kg for small items
      const itemWeight = item.weight || 0.5;
      return sum + (itemWeight * item.quantity);
    }, 0);
    
    // Get distance based on city
    const city = address.city.toUpperCase();
    const distance = CITY_DISTANCES[city as keyof typeof CITY_DISTANCES] || 1000; // Default to interstate if city not found
    
    // Determine shipping zone
    let zone;
    if (distance <= 50) {
      zone = 'LOCAL';
    } else if (distance <= 200) {
      zone = 'REGIONAL';
    } else if (distance <= 1000) {
      zone = 'INTERSTATE';
    } else {
      zone = 'REMOTE';
    }
    
    // Calculate shipping cost
    const rates = SHIPPING_RATES[zone as keyof typeof SHIPPING_RATES];
    const shippingCost = rates.base + (rates.perKg * totalWeight);
    
    // Add a minimum shipping cost
    const minimumShippingCost = 15;
    const finalShippingCost = Math.max(shippingCost, minimumShippingCost);
    
    return NextResponse.json({
      shippingCost: finalShippingCost,
      estimatedDelivery: getEstimatedDelivery(zone),
      zone,
      totalWeight: Math.round(totalWeight * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}

function getEstimatedDelivery(zone: string) {
  const days = {
    LOCAL: '1-2 business days',
    REGIONAL: '2-3 business days',
    INTERSTATE: '3-5 business days',
    REMOTE: '5-7 business days'
  };
  return days[zone as keyof typeof days] || '3-5 business days';
} 