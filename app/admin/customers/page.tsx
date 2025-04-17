"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/stripe/customers')
        if (!response.ok) {
          throw new Error('Failed to fetch customers')
        }
        
        const data = await response.json()
        setCustomers(data.customers || [])
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast.error('Failed to fetch customers', {
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Loading customer data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>View and manage your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={customers} />
      </CardContent>
    </Card>
  )
}

