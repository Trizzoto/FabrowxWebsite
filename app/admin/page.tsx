import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-zinc-500">4 added this month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-zinc-500">12 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-zinc-500">8 new this month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,456</div>
            <p className="text-xs text-zinc-500">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Recently added products to your catalogue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Performance Exhaust Header</p>
                  <p className="text-sm text-zinc-500">Added 2 days ago</p>
                </div>
                <div className="ml-auto font-medium">$899</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">4WD Snorkel Kit</p>
                  <p className="text-sm text-zinc-500">Added 3 days ago</p>
                </div>
                <div className="ml-auto font-medium">$349</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Roll Cage Kit</p>
                  <p className="text-sm text-zinc-500">Added 5 days ago</p>
                </div>
                <div className="ml-auto font-medium">$1,299</div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/admin/products">View All Products</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Order #1234</p>
                  <p className="text-sm text-zinc-500">John Smith • 1 hour ago</p>
                </div>
                <div className="ml-auto font-medium">$349</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Order #1233</p>
                  <p className="text-sm text-zinc-500">Sarah Johnson • 3 hours ago</p>
                </div>
                <div className="ml-auto font-medium">$1,299</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Order #1232</p>
                  <p className="text-sm text-zinc-500">Mike Williams • 5 hours ago</p>
                </div>
                <div className="ml-auto font-medium">$899</div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

