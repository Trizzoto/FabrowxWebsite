"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Settings, Package, ExternalLink, MessageSquare,
  ShoppingBag, AlertCircle, Bell, Clock,
  Plus, Upload, ChevronRight
} from 'lucide-react'

interface WebsiteStats {
  products: number
  recentOrders: number
  lowStock: number
  pendingEnquiries: number
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
        // Fetch products to get the actual count
        const productsResponse = await fetch('/api/products')
        if (!productsResponse.ok) throw new Error('Failed to fetch products')
        const productsData = await productsResponse.json()
        
        setStats({
          products: productsData.length,
          recentOrders: 2,
          lowStock: 2,
          pendingEnquiries: 1,
          revenue: {
            today: 2899,
            thisWeek: 12499,
            thisMonth: 45890
          }
        })
        
        setRecentActivity([
          {
            id: '1',
            type: 'order',
            message: 'New order received for GTX4508R Series 80mm Turbo',
            timestamp: '5 minutes ago'
          },
          {
            id: '2',
            type: 'stock',
            message: 'Low stock alert: Female to Male Swivel Adapter (Out of Stock)',
            timestamp: '15 minutes ago'
          },
          {
            id: '3',
            type: 'enquiry',
            message: 'New enquiry received about Custom Turbo Installation',
            timestamp: '1 hour ago'
          }
        ])
        
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
              <span className="bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
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
          <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-400" />
              </div>
                <Button variant="ghost" size="sm" className="text-zinc-500" asChild>
                  <Link href="/admin/products">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-2xl font-semibold mb-1">{stats?.products || 0}</p>
              <p className="text-sm text-zinc-500">Products</p>
          </CardContent>
        </Card>
        
          <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-green-400" />
              </div>
                <Button variant="ghost" size="sm" className="text-zinc-500" asChild>
                  <Link href="/admin/orders">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-2xl font-semibold mb-1">{stats?.recentOrders || 0}</p>
              <p className="text-sm text-zinc-500">New Orders</p>
          </CardContent>
        </Card>
        
          <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
                <Button variant="ghost" size="sm" className="text-zinc-500" asChild>
                  <Link href="/admin/products?filter=low-stock">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-2xl font-semibold mb-1">{stats?.lowStock || 0}</p>
              <p className="text-sm text-zinc-500">Low Stock</p>
          </CardContent>
        </Card>
        
          <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
              </div>
                <Button variant="ghost" size="sm" className="text-zinc-500" asChild>
                  <Link href="/admin/enquiries">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-2xl font-semibold mb-1">{stats?.pendingEnquiries || 0}</p>
              <p className="text-sm text-zinc-500">Enquiries</p>
          </CardContent>
        </Card>
      </div>
      
        {/* Revenue & Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Today</p>
                  <p className="text-2xl font-semibold">${stats?.revenue.today.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">This Week</p>
                  <p className="text-2xl font-semibold">${stats?.revenue.thisWeek.toLocaleString()}</p>
              </div>
                <div>
                  <p className="text-sm text-zinc-500 mb-1">This Month</p>
                  <p className="text-2xl font-semibold">${stats?.revenue.thisMonth.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                        ${activity.type === 'order' ? 'bg-green-500/10 text-green-400' :
                          activity.type === 'stock' ? 'bg-red-500/10 text-red-400' :
                          activity.type === 'enquiry' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-orange-500/10 text-orange-400'}`}
                      >
                        {activity.type === 'order' && <ShoppingBag className="h-4 w-4" />}
                        {activity.type === 'stock' && <AlertCircle className="h-4 w-4" />}
                        {activity.type === 'enquiry' && <MessageSquare className="h-4 w-4" />}
                        {activity.type === 'system' && <Settings className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm text-zinc-300">{activity.message}</p>
                        <p className="text-xs text-zinc-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.timestamp}
                        </p>
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

