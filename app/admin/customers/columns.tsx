"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar } from "lucide-react"

export type Customer = {
  id: string
  email: string
  name: string
  phone?: string | null
  orders: number
  totalSpent: number
  lastOrder?: string | null
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-orange-500" />
          <span>{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-orange-500" />
          <span>{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null
      if (!phone) return null
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-orange-500" />
          <span>{phone}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => {
      const orders = row.getValue("orders") as number
      return (
        <Badge variant="secondary">
          {orders} orders
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => {
      const amount = row.getValue("totalSpent") as number
      const formatted = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "lastOrder",
    header: "Last Order",
    cell: ({ row }) => {
      const date = row.getValue("lastOrder") as string | null
      if (!date) return null
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )
    },
  },
] 