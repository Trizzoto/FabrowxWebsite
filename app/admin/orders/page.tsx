"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Eye, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orders] = useState(mockOrders)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-600">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-600">Shipped</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No orders found. Try adjusting your search.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{order.id}</div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                      {order.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${order.total.toFixed(2)}</div>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-4 w-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-500" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-zinc-500">Date</div>
                      <div>{new Date(order.date).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500">Items</div>
                      <div>{order.items}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block rounded-md border border-zinc-800 bg-zinc-900 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-800/50">
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="min-w-[200px]">Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                  No orders found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-zinc-800/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-[200px]">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

