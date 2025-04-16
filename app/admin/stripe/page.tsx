"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { RefreshCw, Link as LinkIcon, Unlink, CreditCard, FileText } from 'lucide-react'
import Link from 'next/link'

// Get the base URL from window location in client component
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export default function StripeIntegrationPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [connectionMethod, setConnectionMethod] = useState<string | null>(null)
  const { toast } = useToast()
  const baseUrl = getBaseUrl()

  useEffect(() => {
    checkStripeConnection()
  }, [])

  const checkStripeConnection = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/stripe/status`)
      const data = await response.json()
      setIsConnected(data.connected)
      setAccountId(data.accountId)
      setConnectionMethod(data.method)
    } catch (error) {
      console.error('Error checking Stripe connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${baseUrl}/api/stripe/disconnect`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setIsConnected(false)
        setAccountId(null)
        toast({
          title: "Success",
          description: "Successfully disconnected from Stripe"
        })
      } else {
        throw new Error(data.error || 'Failed to disconnect')
      }
    } catch (error) {
      console.error('Error disconnecting from Stripe:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect from Stripe",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    window.location.href = `${baseUrl}/api/stripe/auth?returnUrl=${encodeURIComponent(`${baseUrl}/admin/stripe`)}`
  }

  // Development helper to bypass Stripe OAuth for testing
  const handleDevModeConnect = async () => {
    try {
      setIsLoading(true);
      
      // Store a mock publishable key in localStorage for client-side
      localStorage.setItem('stripe_publishable_key', 'pk_test_mock_key_for_development');
      
      // Call the mock connect API to set server-side cookies
      const response = await fetch(`${baseUrl}/api/stripe/mock-connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsConnected(true);
        setAccountId('dev_mode');
        toast({
          title: "Development Mode",
          description: "Successfully connected in development mode (mock Stripe)"
        });
      } else {
        throw new Error(data.error || 'Failed to create mock connection');
      }
    } catch (error) {
      console.error('Error in dev mode connection:', error);
      toast({
        title: "Error",
        description: "Failed to setup development mode",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration</CardTitle>
          <CardDescription>
            Connect your Stripe account to process payments without needing API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
              </div>
            ) : isConnected ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-green-500">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>
                    Connected to Stripe {connectionMethod === 'direct' ? '(Direct API Keys)' : accountId && `(OAuth Account: ${accountId})`}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                    <Unlink className="mr-2 h-4 w-4" />
                    Disconnect from Stripe
                  </Button>
                </div>
                
                <div className="rounded-md bg-amber-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Note</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        {connectionMethod === 'direct' ? (
                          <p>
                            You are using direct API keys for Stripe integration. 
                            To update your keys, visit the <Link href="/admin/stripe-keys" className="underline">API Keys page</Link>.
                          </p>
                        ) : (
                          <p>
                            Your Stripe connection is secure and will persist until you disconnect.
                            No secret keys need to be managed or updated.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md bg-amber-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Action Required</h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          To process payments, please either connect your Stripe account using OAuth or
                          set up direct API keys on the <Link href="/admin/stripe-keys" className="underline">API Keys page</Link>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button onClick={handleConnect} className="w-full bg-orange-600 hover:bg-orange-700">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Connect with OAuth
                  </Button>
                  
                  <Button asChild className="w-full">
                    <Link href="/admin/stripe-keys">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Set Up API Keys
                    </Link>
                  </Button>
                </div>
                
                {process.env.NODE_ENV !== 'production' && (
                  <div className="mt-2">
                    <Button 
                      onClick={handleDevModeConnect} 
                      variant="outline" 
                      className="w-full text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
                    >
                      <span className="flex items-center">
                        <code className="mr-2">DEV</code>
                        Development Mode (No Stripe OAuth)
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Features</CardTitle>
          <CardDescription>
            Features enabled with your Stripe integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-600">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Credit Card Payments</p>
                <p className="text-sm text-gray-500">Accept all major credit and debit cards</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-600">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Secure Checkout</p>
                <p className="text-sm text-gray-500">PCI compliant payment processing</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-600">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Automatic Receipts</p>
                <p className="text-sm text-gray-500">Email receipts sent to customers</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 