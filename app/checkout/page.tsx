'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { PaymentProvider } from '@/components/payment/payment-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, CreditCard, Truck, User, MapPin, FileDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    }
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    phone: false,
    street: false,
    city: false,
    state: false,
    postcode: false
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  useEffect(() => {
    // Try to get saved customer info from localStorage
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    const savedPhone = localStorage.getItem('userPhone');
    
    console.log('Saved email from localStorage:', savedEmail);
    
    if (savedEmail || savedName || savedPhone) {
      setCustomerInfo(prev => ({
        ...prev,
        email: savedEmail || '',
        name: savedName || '',
        phone: savedPhone || ''
      }));
    }
  }, []);

  useEffect(() => {
    console.log('Current customer info:', customerInfo);
  }, [customerInfo]);

  const validateStep = (step: number) => {
    const errors = { ...formErrors };
    let isValid = true;

    if (step === 1) {
      if (!customerInfo.name.trim()) {
        errors.name = true;
        isValid = false;
      } else {
        errors.name = false;
      }
      
      if (!customerInfo.email.trim() || !/^\S+@\S+\.\S+$/.test(customerInfo.email)) {
        errors.email = true;
        isValid = false;
      } else {
        errors.email = false;
      }
      
      if (!customerInfo.phone.trim()) {
        errors.phone = true;
        isValid = false;
      } else {
        errors.phone = false;
      }
    } else if (step === 2) {
      if (!customerInfo.address.street.trim()) {
        errors.street = true;
        isValid = false;
      } else {
        errors.street = false;
      }
      
      if (!customerInfo.address.city.trim()) {
        errors.city = true;
        isValid = false;
      } else {
        errors.city = false;
      }
      
      if (!customerInfo.address.state.trim()) {
        errors.state = true;
        isValid = false;
      } else {
        errors.state = false;
      }
      
      if (!customerInfo.address.postcode.trim()) {
        errors.postcode = true;
        isValid = false;
      } else {
        errors.postcode = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      if (activeStep === 1) {
        // Save customer info to localStorage when moving past step 1
        localStorage.setItem('userEmail', customerInfo.email);
        localStorage.setItem('userName', customerInfo.name);
        localStorage.setItem('userPhone', customerInfo.phone);
      }
      
      // If moving from step 2 (shipping) to step 3, automatically initiate payment
      if (activeStep === 2) {
        handleInitiatePayment();
      } else {
        setActiveStep(activeStep + 1);
      }
    } else {
      toast.error('Please fill in all required fields correctly');
    }
  };

  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInitiatePayment = async () => {
    if (!validateStep(2)) {
      toast.error('Please fill in all required information');
      return;
    }

    setIsLoading(true);
    try {
      // Save checkout information to localStorage
      localStorage.setItem('checkoutInfo', JSON.stringify(customerInfo));
      localStorage.setItem('cartItems', JSON.stringify(cart));
      localStorage.setItem('cartTotal', totalPrice.toString());

      const response = await fetch('/api/stripe/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          customer: customerInfo,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Payment initiation error:', error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setPaymentSuccess(true);
    // Generate a unique order number (you might want to get this from your backend)
    const uniqueOrderNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setOrderNumber(uniqueOrderNumber);
    toast.success('Payment successful! Thank you for your purchase.');
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          customerInfo,
          items: cart,
          total: totalPrice,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Checkout
      </h1>

      {/* Progress Steps - only show two steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 1 ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            <User className="h-5 w-5" />
          </div>
          <div className={`h-1 w-16 ${activeStep >= 2 ? 'bg-orange-600' : 'bg-zinc-800'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 2 ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
            <MapPin className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Mobile: Stack vertically, Desktop: 2 columns with order on right */}
      <div className="grid md:grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form column - takes 7/12 of space on desktop */}
        <div className="lg:col-span-7">
          {/* Step 1: Customer Information */}
          {activeStep === 1 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className={formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.name && <p className="text-sm text-red-500 mt-1">Name is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    autoComplete="email"
                    name="email"
                    inputMode="email"
                    spellCheck="false"
                    autoCapitalize="off"
                  />
                  {formErrors.email && <p className="text-sm text-red-500 mt-1">Valid email is required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                    className={formErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-sm text-red-500 mt-1">Phone number is required</p>}
                </div>
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/cart')}
                    className="border-orange-500/30 hover:bg-orange-500/10"
                  >
                    Back to Cart
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Continue to Shipping
                    <Truck className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping Information */}
          {activeStep === 2 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address <span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    value={customerInfo.address.street}
                    onChange={(e) => setCustomerInfo(prev => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    placeholder="Street address"
                    className={formErrors.street ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {formErrors.street && <p className="text-sm text-red-500 mt-1">Street address is required</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={customerInfo.address.city}
                      onChange={(e) => setCustomerInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      placeholder="City"
                      className={formErrors.city ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.city && <p className="text-sm text-red-500 mt-1">City is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={customerInfo.address.state}
                      onChange={(e) => setCustomerInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value }
                      }))}
                      placeholder="State"
                      className={formErrors.state ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.state && <p className="text-sm text-red-500 mt-1">State is required</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Postcode <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={customerInfo.address.postcode}
                      onChange={(e) => setCustomerInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, postcode: e.target.value }
                      }))}
                      placeholder="Postcode"
                      className={formErrors.postcode ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.postcode && <p className="text-sm text-red-500 mt-1">Postcode is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      type="text"
                      value={customerInfo.address.country}
                      disabled
                      className="bg-zinc-800"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline"
                    onClick={handlePrevStep}
                    className="border-orange-500/30 hover:bg-orange-500/10"
                  >
                    Back
                  </Button>
                  {!clientSecret && (
                    <Button 
                      onClick={handleNextStep}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Proceed to Payment"}
                      <CreditCard className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order summary column - takes 5/12 of space on desktop */}
        <div className="lg:col-span-5">
          <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle2 className="h-6 w-6 text-orange-500" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-zinc-400">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator className="bg-zinc-800" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <Separator className="bg-zinc-800" />
                
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                
                {clientSecret && (
                  <div className="mt-6 space-y-4">
                    <PaymentProvider
                      clientSecret={clientSecret}
                      amount={totalPrice}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                    {paymentSuccess && (
                      <Button
                        onClick={handleDownloadInvoice}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                        variant="outline"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 