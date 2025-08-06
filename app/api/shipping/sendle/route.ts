import { NextResponse } from 'next/server';

// Sendle API configuration from environment variables
const SENDLE_API_URL = process.env.SENDLE_API_URL || 'https://api.sendle.com/api/quotes';
const SENDLE_ID = process.env.SENDLE_ID;
const SENDLE_API_KEY = process.env.SENDLE_API_KEY;

// Default pickup location from environment variables
const PICKUP_LOCATION = {
  suburb: process.env.PICKUP_SUBURB || "SYDNEY",
  postcode: process.env.PICKUP_POSTCODE || "2000",
  country: process.env.PICKUP_COUNTRY || "AU"
};

// Smart packaging calculation function
function calculateOptimalPackaging(items: any[]) {
  let totalWeight = 0;
  let totalVolume = 0;
  let fragileItems = 0;
  let oversizedItems = 0;
  let specialHandlingRequired = false;
  let packagingType = 'box';
  let shippingClass = 'standard';
  
  // Analyze each item
  items.forEach(item => {
    const quantity = item.quantity || 1;
    const weight = item.weight || 0.5;
    const dimensions = item.dimensions || { length: 20, width: 20, height: 10 };
    
    totalWeight += weight * quantity;
    
    // Calculate volume for each item
    const itemVolume = (dimensions.length * dimensions.width * dimensions.height) / 1000000; // Convert to cubic meters
    totalVolume += itemVolume * quantity;
    
    // Check for special shipping requirements
    if (item.isFragile || item.shippingClass === 'fragile') {
      fragileItems += quantity;
      packagingType = 'box'; // Fragile items need boxes
    }
    
    if (item.shippingClass === 'oversized' || 
        dimensions.length > 120 || dimensions.width > 80 || dimensions.height > 80) {
      oversizedItems += quantity;
      shippingClass = 'oversized';
    }
    
    if (item.requiresSpecialHandling || 
        item.shippingClass === 'hazardous' || 
        item.shippingClass === 'heavy') {
      specialHandlingRequired = true;
      shippingClass = item.shippingClass || 'special';
    }
  });
  
  // Calculate dimensional weight (1 cubic meter = 250kg for most carriers)
  const dimensionalWeight = totalVolume * 250;
  const chargeableWeight = Math.max(totalWeight, dimensionalWeight);
  
  // Determine optimal package dimensions based on contents
  let packageDimensions;
  
  if (oversizedItems > 0) {
    // For oversized items, use larger package dimensions
    packageDimensions = {
      length: Math.min(150, Math.ceil(Math.pow(totalVolume * 1000000, 1/3) * 1.3)),
      width: Math.min(100, Math.ceil(Math.pow(totalVolume * 1000000, 1/3) * 1.2)),
      height: Math.min(100, Math.ceil(Math.pow(totalVolume * 1000000, 1/3) * 1.1)),
      units: "cm"
    };
  } else {
    // Calculate efficient packing dimensions
    const sideDimension = Math.ceil(Math.pow(totalVolume * 1000000, 1/3));
    packageDimensions = {
      length: Math.max(30, Math.min(80, sideDimension * 1.2)),
      width: Math.max(25, Math.min(60, sideDimension * 1.1)),
      height: Math.max(15, Math.min(50, sideDimension)),
      units: "cm"
    };
  }
  
  // Add padding for fragile items
  if (fragileItems > 0) {
    packageDimensions.length += 5;
    packageDimensions.width += 5;
    packageDimensions.height += 5;
  }
  
  return {
    totalWeight: Math.round(chargeableWeight * 10) / 10,
    actualWeight: Math.round(totalWeight * 10) / 10,
    dimensionalWeight: Math.round(dimensionalWeight * 10) / 10,
    dimensions: packageDimensions,
    shippingClass,
    packagingType,
    fragileItems,
    oversizedItems,
    specialHandlingRequired,
    totalVolume: Math.round(totalVolume * 1000000) // Convert back to cubic cm for display
  };
}

export async function POST(request: Request) {
  let totalWeight = 0;
  
  try {
    // Verify API credentials are configured
    if (!SENDLE_ID || !SENDLE_API_KEY) {
      throw new Error('Sendle API credentials not configured');
    }

    const { address, items } = await request.json();
    
    // Calculate smart packaging
    const packagingResult = calculateOptimalPackaging(items);
    totalWeight = packagingResult.totalWeight;
    const dimensions = packagingResult.dimensions;
    const shippingClass = packagingResult.shippingClass;

    console.log('Sending request to Sendle:', {
      pickup: PICKUP_LOCATION,
      delivery: address,
      weight: totalWeight,
      dimensions
    });

    // Get shipping quote from Sendle
    const response = await fetch(SENDLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${SENDLE_ID}:${SENDLE_API_KEY}`).toString('base64')}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        pickup_suburb: PICKUP_LOCATION.suburb,
        pickup_postcode: PICKUP_LOCATION.postcode,
        pickup_country: PICKUP_LOCATION.country,
        delivery_suburb: address.city,
        delivery_postcode: address.postcode,
        delivery_country: "AU",
        weight: {
          value: totalWeight,
          units: "kg"
        },
        cubic_metre: ((dimensions.length * dimensions.width * dimensions.height) / 1000000).toFixed(6),
        customer_reference: "Elite Fabworx Order"
      })
    });

    const responseData = await response.text();
    console.log('Sendle API response:', responseData);

    if (!response.ok) {
      console.error('Sendle API error:', responseData);
      throw new Error('Failed to get shipping quote');
    }

    const data = JSON.parse(responseData);
    
    // Format the response with enhanced packaging info
    let shippingOptions = data.map((quote: any) => ({
      name: quote.plan_name || 'Sendle Shipping',
      price: parseFloat(quote.quote_amount),
      estimatedDelivery: quote.eta_days ? `${quote.eta_days} business days` : 'Standard delivery',
      service: quote.service_level || 'standard',
      disclaimer: "Shipping rates are estimates only. Actual shipping method and carrier may vary."
    }));

    // Apply surcharges for special handling
    if (packagingResult.shippingClass !== 'standard') {
      shippingOptions = shippingOptions.map((option: any) => ({
        ...option,
        price: option.price + calculateSurcharge(packagingResult),
        name: `${option.name} (${packagingResult.shippingClass})`
      }));
    }

    if (!shippingOptions.length) {
      throw new Error('No shipping quotes available');
    }

    return NextResponse.json({
      shippingOptions,
      packageDetails: {
        totalWeight: packagingResult.totalWeight,
        actualWeight: packagingResult.actualWeight,
        dimensionalWeight: packagingResult.dimensionalWeight,
        dimensions: packagingResult.dimensions,
        shippingClass: packagingResult.shippingClass,
        packagingType: packagingResult.packagingType,
        fragileItems: packagingResult.fragileItems,
        oversizedItems: packagingResult.oversizedItems,
        specialHandlingRequired: packagingResult.specialHandlingRequired,
        totalVolume: packagingResult.totalVolume
      },
      disclaimer: "These shipping rates are estimates provided by Sendle for reference only. Elite Fabworx reserves the right to use alternative shipping methods and carriers for order fulfillment."
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    // Calculate fallback using smart packaging even if API fails
    const { address, items } = await request.json();
    const fallbackPackaging = calculateOptimalPackaging(items);
    
    // Return a fallback shipping option if the API fails
    return NextResponse.json({
      shippingOptions: [{
        name: fallbackPackaging.shippingClass !== 'standard' ? 
          `Standard Shipping (${fallbackPackaging.shippingClass})` : 'Standard Shipping',
        price: calculateFallbackShipping(fallbackPackaging),
        estimatedDelivery: 'Standard delivery',
        service: 'standard',
        disclaimer: "Using fallback shipping rates. Please contact us for accurate shipping costs."
      }],
      packageDetails: {
        totalWeight: fallbackPackaging.totalWeight,
        actualWeight: fallbackPackaging.actualWeight,
        dimensionalWeight: fallbackPackaging.dimensionalWeight,
        dimensions: fallbackPackaging.dimensions,
        shippingClass: fallbackPackaging.shippingClass,
        packagingType: fallbackPackaging.packagingType,
        fragileItems: fallbackPackaging.fragileItems,
        oversizedItems: fallbackPackaging.oversizedItems,
        specialHandlingRequired: fallbackPackaging.specialHandlingRequired,
        totalVolume: fallbackPackaging.totalVolume
      },
      disclaimer: "Unable to connect to shipping provider. Estimates shown are fallback rates."
    });
  }
}

// Calculate surcharge for special handling
function calculateSurcharge(packagingResult: any): number {
  let surcharge = 0;
  
  switch (packagingResult.shippingClass) {
    case 'fragile':
      surcharge += 10; // $10 fragile handling fee
      break;
    case 'oversized':
      surcharge += 25; // $25 oversized handling fee
      break;
    case 'hazardous':
      surcharge += 50; // $50 hazardous materials fee
      break;
    case 'heavy':
      surcharge += 15; // $15 heavy item fee
      break;
    default:
      surcharge = 0;
  }
  
  // Additional fees for fragile items
  if (packagingResult.fragileItems > 0) {
    surcharge += packagingResult.fragileItems * 3; // $3 per fragile item
  }
  
  return surcharge;
}

// Enhanced fallback shipping calculation
function calculateFallbackShipping(packagingResult: any): number {
  const baseRate = 15;
  const perKgRate = 2;
  const volumeRate = 0.05; // $0.05 per cubic cm
  
  let shippingCost = Math.max(baseRate, baseRate + (packagingResult.actualWeight * perKgRate));
  
  // Add dimensional weight cost if applicable
  if (packagingResult.dimensionalWeight > packagingResult.actualWeight) {
    const extraWeight = packagingResult.dimensionalWeight - packagingResult.actualWeight;
    shippingCost += extraWeight * perKgRate * 0.5; // 50% rate for dimensional weight difference
  }
  
  // Add volume-based cost for large items
  if (packagingResult.totalVolume > 50000) { // If over 50,000 cubic cm
    shippingCost += (packagingResult.totalVolume - 50000) * volumeRate;
  }
  
  // Add surcharges
  shippingCost += calculateSurcharge(packagingResult);
  
  return Math.round(shippingCost * 100) / 100;
} 