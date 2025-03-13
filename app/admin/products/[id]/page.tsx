"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft, Upload, X } from "lucide-react"
import { mockProducts, productCategories } from "@/lib/mock-data"

export default function ProductForm({ params }: { params: { id: string } }) {
  const isEditing = params.id !== "new"
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    price: "",
    stockCount: "",
    featured: false,
    // In a real app, you would handle multiple images
    image: "",
    // Simplified specifications for this example
    material: "",
    finish: "",
    fitment: "",
    warranty: "",
    // Simplified compatible vehicles for this example
    compatibleVehicles: "",
  })

  useEffect(() => {
    if (isEditing) {
      // Find the product in our mock data
      const product = mockProducts.find((p) => p.id === params.id)

      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          category: product.category,
          price: product.price.toString(),
          stockCount: product.stockCount.toString(),
          featured: product.featured,
          image: product.images[0],
          material: product.specifications.material,
          finish: product.specifications.finish,
          fitment: product.specifications.fitment,
          warranty: product.specifications.warranty,
          compatibleVehicles: product.compatibleVehicles.join(", "),
        })

        setImagePreview(product.images[0])
      }
    }
  }, [isEditing, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from name
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Log for debugging
    console.log('File selected:', file.name, file.type)

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      console.log('File loaded, length:', result.length)
      setImagePreview(result)
      setFormData((prev) => ({ ...prev, image: result }))
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: isEditing
          ? "The product has been updated successfully."
          : "The product has been created successfully.",
      })

      router.push("/admin/products")
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
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/products")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Product" : "Add New Product"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details of the product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="product-slug"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
                <p className="text-xs text-zinc-500">
                  This will be used in the URL: /shop/{formData.slug || "product-slug"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="min-h-[120px] bg-zinc-800 border-zinc-700"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured">Featured Product</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Display this product on the homepage
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockCount">Stock Count</Label>
                <Input
                  id="stockCount"
                  name="stockCount"
                  type="number"
                  min="0"
                  value={formData.stockCount}
                  onChange={handleChange}
                  placeholder="0"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
            <CardDescription>Upload an image for the product.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-md p-12"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const file = e.dataTransfer.files?.[0]
                    if (file && file.type.startsWith('image/')) {
                      handleImageChange({ target: { files: [file] } } as React.ChangeEvent<HTMLInputElement>)
                    }
                  }}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <Upload className="h-8 w-8 text-zinc-500 mb-4" />
                  <p className="text-sm text-zinc-500 mb-2">Drag and drop an image, or click to browse</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="cursor-pointer"
                  >
                    Browse
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>Enter the specifications of the product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g., Stainless Steel"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finish">Finish</Label>
                <Input
                  id="finish"
                  name="finish"
                  value={formData.finish}
                  onChange={handleChange}
                  placeholder="e.g., Polished"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fitment">Fitment</Label>
                <Input
                  id="fitment"
                  name="fitment"
                  value={formData.fitment}
                  onChange={handleChange}
                  placeholder="e.g., Vehicle Specific"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="e.g., 2 Years"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Compatible Vehicles</CardTitle>
            <CardDescription>Enter the vehicles compatible with this product.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="compatibleVehicles">Compatible Vehicles</Label>
              <Textarea
                id="compatibleVehicles"
                name="compatibleVehicles"
                value={formData.compatibleVehicles}
                onChange={handleChange}
                placeholder="Enter compatible vehicles, separated by commas"
                className="min-h-[80px] bg-zinc-800 border-zinc-700"
              />
              <p className="text-xs text-zinc-500">
                Enter vehicle makes and models separated by commas (e.g., Toyota 86, Subaru BRZ)
              </p>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end space-x-4 px-0">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </CardFooter>
      </form>
    </div>
  )
}

