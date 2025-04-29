'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const { clearCart } = useCart();

  useEffect(() => {
    if (paymentIntentId) {
      // Clear the cart when payment is confirmed
      clearCart();
      console.log('Cart cleared after successful payment');
    }
  }, [paymentIntentId, clearCart]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-zinc-400 mb-8">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-orange-500/30 hover:bg-orange-500/10">
            <Link href="/services">View Our Services</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-16 w-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Processing Payment...</h1>
          <p className="text-zinc-400">Please wait while we confirm your payment.</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 