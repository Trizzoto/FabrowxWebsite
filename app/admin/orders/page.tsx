"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText, Calendar, User, DollarSign, Tag, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  reference: string;
  customer: string;
  email: string;
  date: string;
  dueDate: string;
  status: string;
  type: 'online' | 'workshop' | 'other';
  total: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      
      // Try to fetch Xero orders
      let xeroOrders: Order[] = []
      try {
        const xeroResponse = await fetch('/api/xero/data')
        const xeroData = await xeroResponse.json()
        if (xeroData.orders) {
          xeroOrders = xeroData.orders
        }
      } catch (error) {
        console.warn('Could not fetch Xero orders:', error)
      }

      // Try to fetch Stripe orders
      let stripeOrders: Order[] = []
      try {
        const stripeResponse = await fetch('/api/stripe/orders')
        const stripeData = await stripeResponse.json()
        if (stripeData.orders) {
          stripeOrders = stripeData.orders.map(order => ({
            id: order.id,
            reference: order.id.slice(0, 8).toUpperCase(),
            customer: order.customer.name,
            email: order.customer.email,
            date: new Date().toISOString(),
            dueDate: new Date().toISOString(),
            status: order.status,
            type: 'online',
            total: order.amount / 100,
            items: order.items
          }))
        }
      } catch (error) {
        console.warn('Could not fetch Stripe orders:', error)
      }

      // Combine and sort all orders by date
      const allOrders = [...xeroOrders, ...stripeOrders].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setOrders(allOrders)
      setFilteredOrders(allOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter(order => 
        order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [searchQuery, orders])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Paid</Badge>
      case 'AUTHORISED':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Authorised</Badge>
      case 'DRAFT':
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Draft</Badge>
      case 'VOIDED':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Voided</Badge>
      default:
        return <Badge className="bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'online':
        return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Online Store</Badge>
      case 'workshop':
        return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Workshop</Badge>
      default:
        return <Badge className="bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20">Other</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Orders</CardTitle>
            <Button onClick={fetchOrders} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              {searchQuery ? "No orders found matching your search" : "No orders found"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">Invoice #{order.reference}</span>
                          {getStatusBadge(order.status)}
                          {getTypeBadge(order.type)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <User className="h-3 w-3" />
                          <span>{order.customer}</span>
                          {order.email && <span className="text-zinc-500">({order.email})</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar className="h-3 w-3" />
                          <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                          <span className="text-zinc-500">|</span>
                          <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <DollarSign className="h-3 w-3" />
                          <span>Total: ${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {order.items.map((item, index) => (
                            <Badge key={index} variant="outline" className="bg-zinc-800/50">
                              <Tag className="h-3 w-3 mr-1" />
                              {item.quantity}x {item.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Download PDF</Button>
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

