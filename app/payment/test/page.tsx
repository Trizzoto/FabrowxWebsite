'use client';

import { useState, useEffect } from 'react';
import { PaymentProvider } from '@/components/payment/payment-provider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TestPaymentPage() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log when component mounts
    console.log('Payment test page mounted');
    return () => console.log('Payment test page unmounted');
  }, []);

  const handleInitiatePayment = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Initiating payment...');
    
    try {
      const response = await fetch('/api/stripe/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10.00, // Test amount: $10
          customer: {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '0400000000',
          },
          items: [
            {
              name: 'Test Product',
              quantity: 1,
              price: 10.00,
            },
          ],
        }),
      });

      const data = await response.json();
      console.log('Payment response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
      console.log('Client secret set');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Payment initiation error:', error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Test Payment</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {!clientSecret ? (
        <Button
          onClick={handleInitiatePayment}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Initiating payment...' : 'Pay $10.00'}
        </Button>
      ) : (
        <PaymentProvider
          clientSecret={clientSecret}
          amount={10.00}
          onSuccess={() => {
            console.log('Payment successful');
            toast.success('Payment successful!');
          }}
          onError={(error) => {
            console.error('Payment error:', error);
            toast.error(error);
          }}
        />
      )}
    </div>
  );
} 