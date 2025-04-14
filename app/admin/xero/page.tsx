"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { RefreshCw, Link as LinkIcon, Unlink, Users, FileText, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SyncData {
  contacts: number;
  invoices: number;
}

interface WorkshopInvoiceItem {
  description: string;
  quantity: number;
  unitAmount: number;
}

// Get the base URL from window location in client component
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
}

export default function XeroIntegrationPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [syncData, setSyncData] = useState<SyncData | null>(null)
  const [showWorkshopForm, setShowWorkshopForm] = useState(false)
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const { toast } = useToast()
  const baseUrl = getBaseUrl()

  // Workshop invoice form state
  const [workshopInvoice, setWorkshopInvoice] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
    },
    items: [
      {
        description: '',
        quantity: 1,
        unitAmount: 0,
      },
    ],
  })

  useEffect(() => {
    checkXeroConnection()
  }, [])

  const checkXeroConnection = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/xero/status`)
      const data = await response.json()
      setIsConnected(data.connected)
    } catch (error) {
      console.error('Error checking Xero connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${baseUrl}/api/xero/sync`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.summary) {
        setSyncData(data.summary)
      }
      
      toast({
        title: "Success",
        description: "Successfully synced with Xero"
      })
    } catch (error) {
      console.error('Error syncing with Xero:', error)
      toast({
        title: "Error",
        description: "Failed to sync with Xero",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${baseUrl}/api/xero/disconnect`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        setIsConnected(false)
        setSyncData(null)
        toast({
          title: "Success",
          description: "Successfully disconnected from Xero"
        })
      } else {
        throw new Error(data.error || 'Failed to disconnect')
      }
    } catch (error) {
      console.error('Error disconnecting from Xero:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect from Xero",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addInvoiceItem = () => {
    setWorkshopInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitAmount: 0 }]
    }))
  }

  const removeInvoiceItem = (index: number) => {
    setWorkshopInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateInvoiceItem = (index: number, field: keyof WorkshopInvoiceItem, value: string | number) => {
    setWorkshopInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleCreateWorkshopInvoice = async () => {
    try {
      setIsCreatingInvoice(true)
      const response = await fetch(`${baseUrl}/api/xero/workshop-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workshopInvoice),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Workshop invoice ${data.invoiceNumber} created successfully`
        })
        setShowWorkshopForm(false)
        setWorkshopInvoice({
          customer: { name: '', email: '', phone: '' },
          items: [{ description: '', quantity: 1, unitAmount: 0 }],
        })
      } else {
        throw new Error(data.error || 'Failed to create invoice')
      }
    } catch (error) {
      console.error('Error creating workshop invoice:', error)
      toast({
        title: "Error",
        description: "Failed to create workshop invoice",
        variant: "destructive"
      })
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Xero Integration</CardTitle>
          <CardDescription>
            Connect your Xero account to sync invoices and financial data
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
                  <span>Connected to Xero</span>
                </div>
                
                {/* Sync Status */}
                {syncData && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Contacts</p>
                            <p className="text-2xl font-bold">{syncData.contacts}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Invoices</p>
                            <p className="text-2xl font-bold">{syncData.invoices}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="space-y-2">
                  <Button onClick={handleSync} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync with Xero
                  </Button>
                  <Button onClick={() => setShowWorkshopForm(!showWorkshopForm)} className="w-full" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    {showWorkshopForm ? 'Hide Workshop Invoice Form' : 'Create Workshop Invoice'}
                  </Button>
                  <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                    <Unlink className="mr-2 h-4 w-4" />
                    Disconnect from Xero
                  </Button>
                </div>

                {/* Workshop Invoice Form */}
                {showWorkshopForm && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Create Workshop Invoice</CardTitle>
                      <CardDescription>
                        Create a new invoice for workshop services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Customer Details */}
                        <div className="space-y-4">
                          <h3 className="font-medium">Customer Details</h3>
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="customer-name">Name</Label>
                              <Input
                                id="customer-name"
                                value={workshopInvoice.customer.name}
                                onChange={(e) => setWorkshopInvoice(prev => ({
                                  ...prev,
                                  customer: { ...prev.customer, name: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="customer-email">Email</Label>
                              <Input
                                id="customer-email"
                                type="email"
                                value={workshopInvoice.customer.email}
                                onChange={(e) => setWorkshopInvoice(prev => ({
                                  ...prev,
                                  customer: { ...prev.customer, email: e.target.value }
                                }))}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="customer-phone">Phone</Label>
                              <Input
                                id="customer-phone"
                                value={workshopInvoice.customer.phone}
                                onChange={(e) => setWorkshopInvoice(prev => ({
                                  ...prev,
                                  customer: { ...prev.customer, phone: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Invoice Items</h3>
                            <Button
                              onClick={addInvoiceItem}
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Item
                            </Button>
                          </div>
                          
                          {workshopInvoice.items.map((item, index) => (
                            <div key={index} className="grid gap-4 p-4 border border-zinc-800 rounded-lg">
                              <div className="grid gap-2">
                                <Label>Description</Label>
                                <Input
                                  value={item.description}
                                  onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label>Quantity</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value))}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Unit Price</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.unitAmount}
                                    onChange={(e) => updateInvoiceItem(index, 'unitAmount', parseFloat(e.target.value))}
                                  />
                                </div>
                              </div>
                              {workshopInvoice.items.length > 1 && (
                                <Button
                                  onClick={() => removeInvoiceItem(index)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Minus className="h-4 w-4 mr-2" />
                                  Remove Item
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={handleCreateWorkshopInvoice}
                          className="w-full"
                          disabled={isCreatingInvoice}
                        >
                          {isCreatingInvoice ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Creating Invoice...
                            </>
                          ) : (
                            <>
                              <FileText className="mr-2 h-4 w-4" />
                              Create Invoice
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href={`${baseUrl}/api/xero/auth`}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect to Xero
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 