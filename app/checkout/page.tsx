'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { PaymentProvider } from '@/components/payment/payment-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, CreditCard, Truck, User, MapPin, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, totalPriceWithGST, clearCart, updateQuantity, removeFromCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isPickup, setIsPickup] = useState(false);
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

  const calculateShipping = async () => {
    if (isPickup) {
      setShippingCost(0);
      setEstimatedDelivery('Available for pickup in Murray Bridge');
      return;
    }

    if (!customerInfo.address.city || !customerInfo.address.state || !customerInfo.address.postcode) {
      return;
    }

    setIsCalculatingShipping(true);
    try {
      const response = await fetch('/api/shipping/sendle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: customerInfo.address,
          items: cart.map(item => ({
            quantity: item.quantity,
            weight: item.weight || 0.5 // Use product weight or default to 0.5kg
          }))
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Set the cheapest shipping option by default
      const cheapestOption = data.shippingOptions.reduce((min: any, option: any) => 
        option.price < min.price ? option : min
      );

      setShippingCost(cheapestOption.price);
      setEstimatedDelivery(cheapestOption.estimatedDelivery);
    } catch (error) {
      console.error('Shipping calculation error:', error);
      toast.error('Failed to calculate shipping costs');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Calculate shipping when address changes or pickup option changes
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateShipping();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [customerInfo.address.city, customerInfo.address.state, customerInfo.address.postcode, isPickup]);

  const validateForm = () => {
    const errors = { ...formErrors };
    let isValid = true;

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

    // Only validate address fields if not picking up
    if (!isPickup) {
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

  const handleInitiatePayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      // Save customer info to localStorage
      localStorage.setItem('userEmail', customerInfo.email);
      localStorage.setItem('userName', customerInfo.name);
      localStorage.setItem('userPhone', customerInfo.phone);

      // Calculate total with GST
      const totalWithGST = (totalPrice + (shippingCost || 0)) * 1.1;

      const response = await fetch('/api/stripe/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalWithGST,
          customer: {
            ...customerInfo,
            isPickup,
            pickupLocation: isPickup ? 'Murray Bridge' : null
          },
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            variant: item.selectedVariant ? {
              sku: item.selectedVariant.sku,
              options: [
                item.selectedVariant.option1,
                item.selectedVariant.option2,
                item.selectedVariant.option3
              ].filter(Boolean).join(' / ')
            } : null
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
    toast.success('Payment successful! Thank you for your purchase.');
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="container px-4 md:px-6 py-24 mt-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Checkout
      </h1>

      <div className="grid md:grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form column - takes 7/12 of space on desktop */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Information */}
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
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pickup"
                    checked={isPickup}
                    onChange={(e) => setIsPickup(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="pickup" className="text-sm font-medium">
                    Pick up from Murray Bridge (Free)
                  </label>
                </div>

                {!isPickup && (
                  <>
                    <div className="grid gap-4">
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium mb-1">
                          Street Address
                        </label>
                        <Input
                          id="street"
                          value={customerInfo.address.street}
                          onChange={(e) => setCustomerInfo(prev => ({
                            ...prev,
                            address: { ...prev.address, street: e.target.value }
                          }))}
                          className={formErrors.street ? "border-red-500" : ""}
                          placeholder="Enter your street address"
                        />
                        {formErrors.street && (
                          <p className="text-sm text-red-500 mt-1">Street address is required</p>
                        )}
                      </div>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          {clientSecret ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentProvider
                  clientSecret={clientSecret}
                  amount={(totalPrice + (shippingCost || 0)) * 1.1}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => router.push('/cart')}
                className="border-orange-500/30 hover:bg-orange-500/10"
              >
                Back to Cart
              </Button>
              <Button 
                onClick={handleInitiatePayment}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Payment"}
                <CreditCard className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary column - takes 5/12 of space on desktop */}
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
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.selectedVariant && (
                            <div className="text-xs text-zinc-400">
                              {[
                                item.selectedVariant.option1,
                                item.selectedVariant.option2,
                                item.selectedVariant.option3
                              ]
                                .filter(Boolean)
                                .join(' / ')}
                            </div>
                          )}
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-zinc-800"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            <span className="sr-only">Decrease quantity</span>
                            <span className="text-sm">−</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-zinc-800"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <span className="sr-only">Increase quantity</span>
                            <span className="text-sm">+</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 -mr-2"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4 bg-zinc-800" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Shipping</span>
                  {isCalculatingShipping ? (
                    <span className="text-zinc-400">Calculating...</span>
                  ) : shippingCost !== null ? (
                    <div className="text-right">
                      <span>${shippingCost.toFixed(2)}</span>
                      {estimatedDelivery && (
                        <div className="text-xs text-zinc-400">
                          {estimatedDelivery}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-zinc-400">Enter shipping address</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">GST (10%)</span>
                  <span>${((totalPrice + (shippingCost || 0)) * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2 bg-zinc-800" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">
                    ${((totalPrice + (shippingCost || 0)) * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 