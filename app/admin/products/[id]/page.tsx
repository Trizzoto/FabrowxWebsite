"use client"

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
import { Loader2, ArrowLeft, Upload, X, GripVertical, Plus, Trash2 } from "lucide-react"
import { type Product, type ProductOption, type ProductVariant } from "@/types"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { uploadToCloudinary } from "@/lib/cloudinary"

export default function ProductForm({ params }: { params: { id: string } }) {
  const isEditing = params.id !== "new"
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)

  const [formData, setFormData] = useState<Product & { options: ProductOption[], variants: ProductVariant[], images: string[] }>({
    id: "",
    name: "",
    category: "",
    price: 0,
    description: "",
    images: [],
    options: [],
    variants: []
  })

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchProduct()
    }
  }, [isEditing])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const product = await response.json()
      
      if (product) {
        // Extract unique option values from variants
        const optionValues = new Set(product.variants?.map((v: ProductVariant) => v.option1).filter(Boolean) || [])
        
        // Create options structure if product has variants
        const options = product.variants?.length ? [{
          name: "Size", // Default name for existing variants
          values: Array.from(optionValues)
        }] : []

        setFormData({
          ...product,
          options: options || [],
          variants: product.variants || [],
          images: product.images || []
        })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive"
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i])
        uploadedUrls.push(url)
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }))

      toast({
        title: "Success",
        description: "Images uploaded successfully"
      })
    } catch (error) {
      console.error('Error uploading images:', error)
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageReorder = (result: any) => {
    if (!result.destination) return

    const items = Array.from(formData.images || [])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFormData(prev => ({
      ...prev,
      images: items
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (name, category, price)",
        variant: "destructive"
      })
      return
    }
    
    // Validate that at least one image is uploaded
    if (formData.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one product image",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)

    try {
      // If adding a new category
      if (showNewCategory && newCategory) {
        const categoryResponse = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: newCategory }),
        })

        if (!categoryResponse.ok) {
          const errorData = await categoryResponse.json()
          throw new Error(errorData.error || 'Failed to create category')
        }
        
        // Update formData with new category
        setFormData(prev => ({ ...prev, category: newCategory }))
      }

      // Generate a unique ID for new products
      if (!isEditing) {
        formData.id = `product-${Date.now()}`
      }

      // Ensure options and variants are properly formatted
      const productToSave = {
        ...formData,
        options: formData.options.filter(opt => opt.name && opt.values.length > 0),
        variants: formData.variants.map(variant => ({
          ...variant,
          price: variant.price || formData.price,
          inventory: variant.inventory || 0
        }))
      }

      const method = isEditing ? 'PUT' : 'POST'
      const url = isEditing ? `/api/products/${params.id}` : '/api/products'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSave),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save product')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: `Product ${isEditing ? 'updated' : 'created'} successfully`,
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} product`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleOptionChange = (index: number, field: 'name' | 'values', value: string) => {
    const newOptions = [...formData.options]
    if (field === 'name') {
      newOptions[index] = { ...newOptions[index], name: value }
    } else {
      newOptions[index] = { ...newOptions[index], values: value.split(',').map(v => v.trim()).filter(Boolean) }
    }
    setFormData(prev => ({ ...prev, options: newOptions }))
    generateVariants(newOptions)
  }

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: "", values: [] }]
    }))
  }

  const removeOption = (index: number) => {
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData(prev => ({ ...prev, options: newOptions }))
    generateVariants(newOptions)
  }

  const generateVariants = (options: ProductOption[]) => {
    const activeOptions = options.filter(opt => opt.name && opt.values.length > 0)
    if (activeOptions.length === 0) {
      setFormData(prev => ({ ...prev, variants: [] }))
      return
    }

    const generateCombinations = (arrays: string[][]): string[][] => {
      if (arrays.length === 0) return [[]]
      const result: string[][] = []
      const restCombinations = generateCombinations(arrays.slice(1))
      for (const item of arrays[0]) {
        for (const combination of restCombinations) {
          result.push([item, ...combination])
        }
      }
      return result
    }

    const optionValues = activeOptions.map(opt => opt.values)
    const combinations = generateCombinations(optionValues)
    
    const newVariants = combinations.map((combo) => ({
      sku: "",
      price: formData.price,
      option1: combo[0],
      option2: combo[1],
      option3: combo[2],
      inventory: 0
    }))

    setFormData(prev => ({ ...prev, variants: newVariants }))
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
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Enter the product details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="category">Category *</Label>
                <div className="flex gap-2">
                  {showNewCategory ? (
                    <div className="flex gap-2 w-full">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Enter new category name"
                        className="flex-1 bg-zinc-800 border-zinc-700"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowNewCategory(false)
                          setNewCategory("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={formData.category}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger className="flex-1 bg-zinc-800 border-zinc-700">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewCategory(true)}
                        className="whitespace-nowrap bg-zinc-800 border-zinc-700"
                      >
                        New Category
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Base Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleNumberChange}
                  placeholder="0.00"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Product Options & Variants</CardTitle>
            <CardDescription>Add options like size, color, etc. to generate variants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.options.length > 0 ? (
                <>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <Label>Option Name</Label>
                        <Input
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          placeholder="e.g., Size, Color"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Values (comma-separated)</Label>
                        <Input
                          value={option.values.join(', ')}
                          onChange={(e) => handleOptionChange(index, 'values', e.target.value)}
                          placeholder="e.g., Small, Medium, Large"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="mt-8"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="bg-zinc-800 border-zinc-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Option
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 border border-dashed border-zinc-700 rounded-lg">
                  <p className="text-zinc-400 mb-4">No options added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="bg-zinc-800 border-zinc-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Options
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {formData.variants.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>Manage variant prices and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 px-4">Option</th>
                        <th className="text-left py-2 px-4">SKU</th>
                        <th className="text-left py-2 px-4">Price ($)</th>
                        <th className="text-left py-2 px-4">Inventory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.variants.map((variant, index) => (
                        <tr key={index} className="border-b border-zinc-800">
                          <td className="py-2 px-4">
                            <div className="text-sm text-zinc-400">
                              {[variant.option1, variant.option2, variant.option3]
                                .filter(Boolean)
                                .join(' / ')}
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <Input
                              value={variant.sku}
                              onChange={(e) => {
                                const newVariants = [...formData.variants]
                                newVariants[index] = { ...variant, sku: e.target.value }
                                setFormData(prev => ({ ...prev, variants: newVariants }))
                              }}
                              placeholder="SKU"
                              className="bg-zinc-800 border-zinc-700"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => {
                                const newVariants = [...formData.variants]
                                newVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 }
                                setFormData(prev => ({ ...prev, variants: newVariants }))
                              }}
                              className="bg-zinc-800 border-zinc-700"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <Input
                              type="number"
                              min="0"
                              value={variant.inventory}
                              onChange={(e) => {
                                const newVariants = [...formData.variants]
                                newVariants[index] = { ...variant, inventory: parseInt(e.target.value) || 0 }
                                setFormData(prev => ({ ...prev, variants: newVariants }))
                              }}
                              className="bg-zinc-800 border-zinc-700"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Upload and manage product images.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-zinc-800 border-zinc-700"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                    </>
                  )}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {formData.images && formData.images.length > 0 && (
                <DragDropContext onDragEnd={handleImageReorder}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        {formData.images.map((image, index) => (
                          <Draggable key={image} draggableId={image} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="relative group"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute top-2 left-2 z-10 p-1 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <GripVertical className="h-4 w-4 text-white" />
                                </div>
                                <div className="relative aspect-square">
                                  <Image
                                    src={image}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-4 w-4 text-white" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            className="bg-zinc-800 border-zinc-700"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

