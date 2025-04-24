"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText, Calendar, User, DollarSign, Tag, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { OrderDetailsModal } from './order-details-modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchParams } from 'next/navigation'

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface StripeOrder {
  id: string;
  status: string;
  amount: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  created: string;
}

interface Order {
  id: string;
  reference: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "new")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
    
    // Set up automatic refresh - changed from 30 seconds to 3 minutes
    const refreshInterval = setInterval(fetchOrders, 180000)
    
    // Cleanup on unmount
    return () => clearInterval(refreshInterval)
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/stripe/orders')
      const data = await response.json()
      
      if (data.orders) {
        const formattedOrders: Order[] = data.orders.map((order: StripeOrder) => ({
          id: order.id,
          reference: `WEB-${order.id.slice(0, 8).toUpperCase()}`,
          customer: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
          date: order.created,
          status: order.status,
          total: order.amount / 100,
          items: order.items
        }))

        // Sort orders by date, newest first
        const sortedOrders = formattedOrders.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        
        setOrders(sortedOrders)
        setFilteredOrders(sortedOrders)
      }
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/stripe/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      // Update the order status in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )

      // Update the selected order if it's the one being changed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Processing</Badge>
      case 'new':
      default:
        return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">New</Badge>
    }
  }

  // Filter orders by status for tabs
  const newOrders = filteredOrders.filter(order => order.status === 'new')
  const completedOrders = filteredOrders.filter(order => order.status === 'completed')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Website Orders</CardTitle>
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

          <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="new" className="relative">
                New
                {newOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {newOrders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              {renderOrdersList(newOrders)}
            </TabsContent>
            
            <TabsContent value="completed">
              {renderOrdersList(completedOrders)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )

  function renderOrdersList(ordersToRender: Order[]) {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      )
    }
    
    if (ordersToRender.length === 0) {
      return (
        <div className="text-center py-8 text-zinc-500">
          {searchQuery ? "No orders found matching your search" : "No orders in this category"}
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {ordersToRender.map((order) => (
          <Card key={order.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Order #{order.reference}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <User className="h-3 w-3" />
                    <span>{order.customer}</span>
                    {order.email && <span className="text-zinc-500">({order.email})</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    <span>Date: {new Date(order.date).toLocaleDateString()}</span>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}

