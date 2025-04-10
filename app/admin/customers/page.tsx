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
import { Search, MoreHorizontal, User, Mail, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react"
import { mockCustomers } from "@/lib/mock-data"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers] = useState(mockCustomers)
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleCustomerExpansion = (customerId: string) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search customers..."
            className="pl-10 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No customers found. Try adjusting your search.
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleCustomerExpansion(customer.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{customer.id}</div>
                  {customer.status === "active" ? (
                    <Badge className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                      {customer.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{customer.orders} orders</div>
                    {expandedCustomer === customer.id ? (
                      <ChevronUp className="h-4 w-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-500" />
                    )}
                  </div>
                </div>
              </div>

              {expandedCustomer === customer.id && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-zinc-500">Join Date</div>
                      <div>{new Date(customer.joinDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500">Total Spent</div>
                      <div>${customer.totalSpent.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Orders
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
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                  No customers found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-zinc-800/50">
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-[200px]">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(customer.joinDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}</TableCell>
                  <TableCell>
                    {customer.status === "active" ? (
                      <Badge className="bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
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
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          View Orders
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

