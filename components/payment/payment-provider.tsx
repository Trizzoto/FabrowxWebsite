'use client';

import { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe-client';
import { PaymentForm } from './payment-form';
import type { StripeElementsOptions } from '@stripe/stripe-js';

interface PaymentProviderProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentProvider({
  clientSecret,
  amount,
  onSuccess,
  onError,
}: PaymentProviderProps) {
  useEffect(() => {
    console.log('PaymentProvider mounted with client secret:', clientSecret);
  }, [clientSecret]);

  const stripePromise = getStripe();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#f97316',
        colorBackground: '#18181b',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      },
    },
  };

  return (
    <div className="relative">
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
} 