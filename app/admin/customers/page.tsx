"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Mail, Phone, MapPin, User, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { RefreshCw } from 'lucide-react'

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  status: string;
  lastUpdated: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/xero/data')
      
      if (!response.ok) {
        const errorData = await response.json()
        
        if (response.status === 401) {
          toast({
            title: "Authentication Required",
            description: (
              <div className="flex flex-col gap-2">
                <p>Xero authentication is required.</p>
                <Button asChild variant="outline" size="sm">
                  <a href="/api/xero/auth" target="_blank" rel="noopener noreferrer">
                    Connect to Xero
                  </a>
                </Button>
              </div>
            ),
            duration: 10000,
          })
        } else {
          throw new Error(errorData.error || 'Failed to fetch customers')
        }
        return;
      }
      
      const data = await response.json()
      
      if (data.customers) {
        setCustomers(data.customers)
        setFilteredCustomers(data.customers)
      } else {
        throw new Error('Failed to fetch customers')
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch customers from Xero",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchQuery, customers])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
      case 'ARCHIVED':
        return <Badge className="bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20">Archived</Badge>
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customers</CardTitle>
            <Button onClick={fetchCustomers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              {searchQuery ? "No customers found matching your search" : "No customers found"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{customer.name}</span>
                          {getStatusBadge(customer.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Mail className="h-3 w-3" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {(customer.address || customer.city || customer.state || customer.postcode) && (
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {[
                                customer.address,
                                customer.city,
                                customer.state,
                                customer.postcode,
                                customer.country
                              ].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          <span>Last updated: {new Date(customer.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

