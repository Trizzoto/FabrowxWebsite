"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Settings, Package, ExternalLink, MessageSquare,
  ShoppingBag, AlertCircle, Bell, Clock,
  Plus, Upload, ChevronRight, CheckCircle
} from 'lucide-react'

interface WebsiteStats {
  products: number
  newOrders: number
  completedOrders: number
  unrepliedEnquiries: number
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
  }
}

interface RecentActivity {
  id: string
  type: 'order' | 'enquiry' | 'stock' | 'system'
  message: string
  timestamp: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<WebsiteStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all required data in parallel
        const [productsResponse, ordersResponse, enquiriesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/stripe/orders'),
          fetch('/api/contact')
        ])

        if (!productsResponse.ok) throw new Error('Failed to fetch products')
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders')
        if (!enquiriesResponse.ok) throw new Error('Failed to fetch enquiries')

        const [productsData, ordersData, enquiriesData] = await Promise.all([
          productsResponse.json(),
          ordersResponse.json(),
          enquiriesResponse.json()
        ])

        // Count new orders (orders with status 'new')
        const newOrdersCount = ordersData.orders.filter((order: any) => order.status === 'new').length
        
        // Count completed orders
        const completedOrdersCount = ordersData.orders.filter((order: any) => order.status === 'completed').length

        // Count unreplied enquiries (enquiries with status not 'replied')
        const unrepliedEnquiriesCount = enquiriesData.filter((enquiry: any) => enquiry.status !== 'replied').length
        
        // Calculate revenue from orders
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const oneWeekAgo = new Date(today)
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const oneMonthAgo = new Date(today)
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        
        // Helper function to calculate revenue for a time period
        const calculateRevenue = (orders: any[], startDate: Date) => {
          return orders
            .filter(order => new Date(order.created) >= startDate)
            .reduce((total, order) => total + (order.amount / 100), 0)
        }
        
        // Calculate revenue for different time periods
        const todayRevenue = calculateRevenue(ordersData.orders, today)
        const weekRevenue = calculateRevenue(ordersData.orders, oneWeekAgo)
        const monthRevenue = calculateRevenue(ordersData.orders, oneMonthAgo)
        
        setStats({
          products: productsData.length,
          newOrders: newOrdersCount,
          completedOrders: completedOrdersCount,
          unrepliedEnquiries: unrepliedEnquiriesCount,
          revenue: {
            today: todayRevenue,
            thisWeek: weekRevenue,
            thisMonth: monthRevenue
          }
        })
        
        // Create recent activity feed from actual data
        const recentActivities: RecentActivity[] = []

        // Add recent orders
        ordersData.orders
          .filter((order: any) => order.status === 'new')
          .slice(0, 3)
          .forEach((order: any) => {
            recentActivities.push({
              id: order.id,
              type: 'order',
              message: `New order received from ${order.customer.name}`,
              timestamp: new Date(order.created).toLocaleString()
            })
          })

        // Add recent enquiries
        enquiriesData
          .filter((enquiry: any) => enquiry.status === 'new')
          .slice(0, 3)
          .forEach((enquiry: any) => {
            recentActivities.push({
              id: enquiry.id,
              type: 'enquiry',
              message: `New enquiry received: ${enquiry.title}`,
              timestamp: new Date(enquiry.date).toLocaleString()
            })
          })

        // Sort by timestamp, newest first
        recentActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        setRecentActivity(recentActivities.slice(0, 5))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="border-b border-zinc-800">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {(stats?.newOrders || 0) + (stats?.unrepliedEnquiries || 0)}
              </span>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/" target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-orange-500/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.products || 0}</div>
                <p className="text-xs text-zinc-400">Total products in catalog</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-orange-500/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.newOrders || 0}</div>
                <p className="text-xs text-zinc-400">Orders in "New" category</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders?tab=completed">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-orange-500/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedOrders || 0}</div>
                <p className="text-xs text-zinc-400">Successfully fulfilled</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/contact">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-orange-500/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enquiries</CardTitle>
                <MessageSquare className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.unrepliedEnquiries || 0}</div>
                <p className="text-xs text-zinc-400">Awaiting response</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Revenue & Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Card */}
          <Link href="/admin/orders">
            <Card className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-orange-500/50 transition-colors">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">Today</p>
                    <p className="text-2xl font-semibold">${stats?.revenue.today.toLocaleString() || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">This Week</p>
                    <p className="text-2xl font-semibold">${stats?.revenue.thisWeek.toLocaleString() || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">This Month</p>
                    <p className="text-2xl font-semibold">${stats?.revenue.thisMonth.toLocaleString() || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          {/* Activity Feed */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-zinc-800 animate-pulse rounded mb-2"></div>
                        <div className="h-3 w-1/4 bg-zinc-800 animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'order' ? 'bg-orange-500/10 text-orange-500' :
                        activity.type === 'enquiry' ? 'bg-blue-500/10 text-blue-500' :
                        activity.type === 'stock' ? 'bg-red-500/10 text-red-500' :
                        'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        {activity.type === 'order' && <ShoppingBag className="h-4 w-4" />}
                        {activity.type === 'enquiry' && <MessageSquare className="h-4 w-4" />}
                        {activity.type === 'stock' && <AlertCircle className="h-4 w-4" />}
                        {activity.type === 'system' && <Settings className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-zinc-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

