'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (paymentIntentId) {
      // You could verify the payment status here if needed
      console.log('Payment Intent ID:', paymentIntentId);
    }
  }, [paymentIntentId]);

  const handleDownloadInvoice = async () => {
    if (!paymentIntentId) {
      toast.error('Payment information not found');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: `INV-${paymentIntentId.slice(-6)}`,
          date: new Date().toISOString(),
          customerInfo: JSON.parse(localStorage.getItem('checkoutInfo') || '{}'),
          items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
          total: parseFloat(localStorage.getItem('cartTotal') || '0'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentIntentId.slice(-6)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
          <Button
            onClick={handleDownloadInvoice}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
            disabled={isDownloading}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download Invoice'}
          </Button>
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