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
      theme: 'night',
      variables: {
        colorPrimary: '#f97316',
        colorBackground: '#18181b',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        borderRadius: '0.5rem',
        fontSizeBase: '16px',
        spacingUnit: '4px',
        fontWeightNormal: '500',
      },
      rules: {
        '.Input': {
          backgroundColor: '#27272a',
          border: '1px solid #3f3f46',
          boxShadow: 'none',
          padding: '12px',
        },
        '.Input:focus': {
          border: '1px solid #f97316',
          boxShadow: '0 0 0 1px #f97316',
        },
        '.Label': {
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
        },
        '.Tab': {
          border: '1px solid #3f3f46',
          backgroundColor: '#27272a',
        },
        '.Tab:hover': {
          border: '1px solid #f97316',
          color: '#f97316',
        },
        '.Tab--selected': {
          borderColor: '#f97316',
          backgroundColor: '#f9731610',
          color: '#f97316',
        },
        '.Button': {
          backgroundColor: '#f97316',
          border: 'none',
          padding: '14px 20px',
          fontWeight: '600',
          fontSize: '16px',
        },
        '.Button:hover': {
          backgroundColor: '#ea580c',
          transform: 'translateY(-1px)',
        },
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