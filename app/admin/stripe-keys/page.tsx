'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ExternalLink, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StripeKeysPage() {
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [status, setStatus] = useState<{
    keysConfigured: boolean;
    secretKey: string;
    publishableKey: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function checkStatus() {
      try {
        const response = await fetch('/api/stripe/keys');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        } else {
          setErrorMessage('Failed to check Stripe API keys status');
        }
      } catch (error) {
        setErrorMessage('Error checking Stripe API keys status');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  const saveApiKeys = async () => {
    if (!publishableKey || !secretKey) {
      setErrorMessage('Both Publishable Key and Secret Key are required');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch('/api/stripe/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publishableKey,
          secretKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Stripe API keys saved successfully');
        // Refresh status
        const statusResponse = await fetch('/api/stripe/keys');
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setStatus(statusData);
        }
        // Clear inputs
        setPublishableKey('');
        setSecretKey('');
      } else {
        setErrorMessage(data.error || 'Failed to save Stripe API keys');
      }
    } catch (error) {
      setErrorMessage('Error saving Stripe API keys');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Stripe API Keys</h1>
        <p className="text-muted-foreground">
          Configure your Stripe API keys for payment processing
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current API Keys Status</CardTitle>
              <CardDescription>
                These keys are used for payment processing with Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">Keys Configured:</span>
                    <span className="flex items-center">
                      {status.keysConfigured ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-600">Configured</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                          <span className="text-amber-600">Not Configured</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">Secret Key:</span>
                    <span>{status.secretKey}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Publishable Key:</span>
                    <span>{status.publishableKey}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href="/admin">Back to Admin</Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Stripe Dashboard
                </a>
              </Button>
            </CardFooter>
          </Card>

          {process.env.NODE_ENV !== 'production' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <KeyRound className="h-5 w-5 mr-2" />
                  Set API Keys (Development Only)
                </CardTitle>
                <CardDescription>
                  This feature is only available in development mode. In production, set keys as environment variables.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {successMessage && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publishable Key</label>
                    <Input
                      value={publishableKey}
                      onChange={(e) => setPublishableKey(e.target.value)}
                      placeholder="pk_test_..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secret Key</label>
                    <Input
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      type="password"
                      placeholder="sk_test_..."
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveApiKeys} disabled={saving} className="ml-auto">
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save API Keys'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How to Get Your Stripe API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  Log in to your{' '}
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Stripe Dashboard
                  </a>
                </li>
                <li>Go to Developers → API keys</li>
                <li>You will find your Publishable Key displayed and can reveal your Secret Key</li>
                <li>Make sure you are using the correct mode (Test/Live) depending on your needs</li>
                <li>For production, add these keys as environment variables in your hosting platform</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 