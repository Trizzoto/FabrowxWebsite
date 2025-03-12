"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Elite FabWorx",
    siteDescription: "Precision metal fabrication for performance vehicles and 4WDs",
    contactEmail: "info@elitefabworx.com.au",
    contactPhone: "(07) 1234 5678",
    address: "123 Fabrication Way, Industrial District, Brisbane, QLD 4000",
  })

  const [ecommerceSettings, setEcommerceSettings] = useState({
    enableStore: true,
    currencySymbol: "$",
    taxRate: "10",
    shippingFlatRate: "15",
    freeShippingThreshold: "150",
    enableInventoryTracking: true,
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEcommerceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEcommerceSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEcommerceSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-zinc-800 border-zinc-700">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your website's general information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralChange}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>E-commerce Settings</CardTitle>
              <CardDescription>Configure your online store settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableStore">Enable Online Store</Label>
                  <p className="text-sm text-zinc-500">Turn your online store on or off</p>
                </div>
                <Switch
                  id="enableStore"
                  checked={ecommerceSettings.enableStore}
                  onCheckedChange={(checked) => handleSwitchChange("enableStore", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input
                    id="currencySymbol"
                    name="currencySymbol"
                    value={ecommerceSettings.currencySymbol}
                    onChange={handleEcommerceChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={ecommerceSettings.taxRate}
                    onChange={handleEcommerceChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingFlatRate">Flat Rate Shipping ($)</Label>
                  <Input
                    id="shippingFlatRate"
                    name="shippingFlatRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={ecommerceSettings.shippingFlatRate}
                    onChange={handleEcommerceChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    type="number"
                    min="0"
                    step="0.01"
                    value={ecommerceSettings.freeShippingThreshold}
                    onChange={handleEcommerceChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="enableInventoryTracking">Inventory Tracking</Label>
                  <p className="text-sm text-zinc-500">Track product inventory and prevent overselling</p>
                </div>
                <Switch
                  id="enableInventoryTracking"
                  checked={ecommerceSettings.enableInventoryTracking}
                  onCheckedChange={(checked) => handleSwitchChange("enableInventoryTracking", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how your website looks.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-500">Appearance settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced options for your website.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-500">Advanced settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

