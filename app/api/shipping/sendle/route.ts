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

export async function POST(request: Request) {
  let totalWeight = 0;
  
  try {
    // Verify API credentials are configured
    if (!SENDLE_ID || !SENDLE_API_KEY) {
      throw new Error('Sendle API credentials not configured');
    }

    const { address, items } = await request.json();
    
    // Calculate total weight
    totalWeight = items.reduce((sum: number, item: any) => {
      const itemWeight = item.weight || 0.5;
      return sum + (itemWeight * item.quantity);
    }, 0);

    // Calculate package dimensions (you can adjust these based on your typical package sizes)
    const dimensions = {
      width: 30,
      length: 30,
      height: 30,
      units: "cm"
    };

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
    
    // Format the response
    const shippingOptions = data.map((quote: any) => ({
      name: quote.plan_name || 'Sendle Shipping',
      price: parseFloat(quote.quote_amount),
      estimatedDelivery: quote.eta_days ? `${quote.eta_days} business days` : '3-5 business days',
      service: quote.service_level || 'standard',
      disclaimer: "Shipping rates are estimates only. Actual shipping method and carrier may vary."
    }));

    if (!shippingOptions.length) {
      throw new Error('No shipping quotes available');
    }

    return NextResponse.json({
      shippingOptions,
      totalWeight: Math.round(totalWeight * 10) / 10,
      disclaimer: "These shipping rates are estimates provided by Sendle for reference only. Elite Fabworx reserves the right to use alternative shipping methods and carriers for order fulfillment."
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    // Return a fallback shipping option if the API fails
    return NextResponse.json({
      shippingOptions: [{
        name: 'Standard Shipping',
        price: calculateFallbackShipping(totalWeight),
        estimatedDelivery: '3-5 business days',
        service: 'standard',
        disclaimer: "Using fallback shipping rates. Please contact us for accurate shipping costs."
      }],
      totalWeight: Math.round(totalWeight * 10) / 10,
      disclaimer: "Using fallback shipping rates. Please contact us for accurate shipping costs."
    });
  }
}

// Calculate fallback shipping based on weight
function calculateFallbackShipping(weight: number): number {
  const baseRate = 15;
  const perKgRate = 2;
  return Math.max(baseRate, baseRate + (weight * perKgRate));
} 