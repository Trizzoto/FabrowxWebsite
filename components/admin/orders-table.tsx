"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Order {
  id: number
  customerName: string
  items: string[]
  total: number
  status: string
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo purposes, simulate loading orders
    const demoOrders: Order[] = [
      {
        id: 1,
        customerName: "John Doe",
        items: ["Product 1", "Product 2"],
        total: 299.99,
        status: "Pending"
      },
      {
        id: 2,
        customerName: "Jane Smith",
        items: ["Product 3"],
        total: 149.99,
        status: "Completed"
      }
    ]
    
    setTimeout(() => {
      setOrders(demoOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b">Order ID</th>
            <th className="px-6 py-3 border-b">Customer</th>
            <th className="px-6 py-3 border-b">Items</th>
            <th className="px-6 py-3 border-b">Total</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 border-b">{order.id}</td>
              <td className="px-6 py-4 border-b">{order.customerName}</td>
              <td className="px-6 py-4 border-b">{order.items.join(", ")}</td>
              <td className="px-6 py-4 border-b">${order.total}</td>
              <td className="px-6 py-4 border-b">{order.status}</td>
              <td className="px-6 py-4 border-b">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

