"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash, MoreHorizontal, Eye, RefreshCw, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Product, ProductOption, ProductVariant } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Loader2, 
  Save,
  X
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toaster } from '@/components/ui/toaster'
import { CSVUpload } from '@/components/admin/csv-upload'
import { productCategories } from '@/app/data'
import { cn } from '@/lib/utils'

interface ProductImage {
  url: string
  alt?: string
}

export default function ProductsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'> & { id: string }>({
    id: 'FABWORX-0001',
    name: '',
    category: '',
    price: 0,
    description: '',
    images: []
  })
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [productOptions, setProductOptions] = useState<ProductOption[]>([])
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([])
  const [newOptionValue, setNewOptionValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])
        
        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const productsData = await productsResponse.json()
        const categoriesData = await categoriesResponse.json() as string[]
        
        setProducts(productsData)
        setCategories(categoriesData)
        setFilteredProducts(productsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => {
        return product.category === selectedCategory
      })
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, products])

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Update existing product via API
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        })

        if (!response.ok) throw new Error('Failed to update product')
        
        const updatedProduct = await response.json()
        
        // Update local state
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === editingProduct.id ? updatedProduct.product : p)
        )
        
        toast({
          title: "Product Updated",
          description: `${editingProduct.name} has been updated`,
        })
        
        setEditingProduct(null)
      } else if (isCreatingProduct && newProduct.name && newProduct.category) {
        // Create new product via API
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newProduct,
            price: Number(newProduct.price),
            originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
            images: newProduct.images?.length ? newProduct.images : ["/placeholder.png"],
            options: productOptions.filter(opt => opt.name && opt.values.length > 0),
            variants: productVariants
          })
        })

        if (!response.ok) throw new Error('Failed to create product')
        
        const { products: createdProduct } = await response.json()
        
        // Update local state
        setProducts(prevProducts => [...prevProducts, createdProduct])
        
        toast({
          title: "Product Created",
          description: `${newProduct.name} has been created`,
        })
        
        setIsCreatingProduct(false)
        setNewProduct({
          id: 'FABWORX-0001',
          name: '',
          category: '',
          price: 0,
          description: '',
          images: []
        })
        setProductOptions([])
        setProductVariants([])
      } else {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      // Optimistically remove from UI first
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id))
      
      // Delete product via API
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        // If API call fails, revert the UI change
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
        throw new Error('Failed to delete product')
      }
      
      toast({
        title: "Product Deleted",
        description: "The product has been removed",
      })
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Changes reverted.",
        variant: "destructive"
      })
    }
  }

  const handleProductImageUpload = (imageUrl: string) => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...(editingProduct.images || []), imageUrl]
      });
    } else if (isCreatingProduct) {
      setNewProduct({
        ...newProduct,
        images: [...(newProduct.images || []), imageUrl]
      });
    }
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id)
  }

  const handleConfirmedDelete = async () => {
    if (productToDelete) {
      await handleDeleteProduct(productToDelete)
      setProductToDelete(null)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategoryName }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create category')
      }

      // Add the new category to the list and select it
      setCategories(prev => [...prev, newCategoryName])
      setNewProduct(prev => ({ ...prev, category: newCategoryName }))
      setNewCategoryName("")
      setShowNewCategory(false)

      toast({
        title: "Success",
        description: "New category created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive"
      })
    }
  }

  const handleOptionChange = (index: number, field: 'name' | 'values', value: string | string[]) => {
    const newOptions = [...productOptions]
    if (field === 'name') {
      newOptions[index] = { ...newOptions[index], name: value as string }
    } else {
      newOptions[index] = { 
        ...newOptions[index], 
        values: value as string[]
      }
    }
    setProductOptions(newOptions)
    generateVariants(newOptions)
  }

  const generateVariants = (options: ProductOption[]) => {
    const activeOptions = options.filter(opt => opt.name && opt.values.length > 0)
    if (activeOptions.length === 0) {
      setProductVariants([])
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
    
    // Generate base SKU from product ID
    const baseSku = newProduct.id.replace('FABWORX-', '')
    
    const newVariants = combinations.map((combo, index) => {
      // Create SKU by combining base SKU with variant index
      const variantSku = `${baseSku}-${(index + 1).toString().padStart(2, '0')}`
      
      // Create variant name for price calculation
      const variantName = combo.join(' / ').toLowerCase()
      
      // Calculate price based on variant options
      let variantPrice = newProduct.price
      
      // Add price modifiers based on keywords in variant name
      if (variantName.includes('large') || variantName.includes('xl')) {
        variantPrice *= 1.2 // 20% more for large sizes
      }
      if (variantName.includes('premium') || variantName.includes('deluxe')) {
        variantPrice *= 1.3 // 30% more for premium options
      }
      if (variantName.includes('custom')) {
        variantPrice *= 1.5 // 50% more for custom options
      }
      
      // Round price to 2 decimal places
      variantPrice = Math.round(variantPrice * 100) / 100

      return {
        sku: variantSku,
        price: variantPrice,
        inventory: 0,
        option1: combo[0],
        option2: combo[1],
        option3: combo[2]
      }
    })

    setProductVariants(newVariants)
  }

  const addOption = () => {
    setProductOptions(prev => [...prev, { name: "", values: [] }])
  }

  const removeOption = (index: number) => {
    const newOptions = [...productOptions]
    newOptions.splice(index, 1)
    setProductOptions(newOptions)
    generateVariants(newOptions)
  }

  const handleAddOptionValue = (optionIndex: number, value: string) => {
    if (!newOptionValue.trim()) return
    
    const newOptions = [...productOptions]
    const currentValues = newOptions[optionIndex].values || []
    if (!currentValues.includes(newOptionValue.trim())) {
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        values: [...currentValues, newOptionValue.trim()]
      }
      setProductOptions(newOptions)
      generateVariants(newOptions)
    }
    setNewOptionValue("")
  }

  const handleRemoveOptionValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...productOptions]
    newOptions[optionIndex].values.splice(valueIndex, 1)
    setProductOptions(newOptions)
    generateVariants(newOptions)
  }

  const generateProductId = () => {
    // Get the highest existing product ID number
    const existingIds = products.map(p => {
      const match = p.id.match(/FABWORX-(\d+)/)
      return match ? parseInt(match[1]) : 0
    })
    const highestId = Math.max(0, ...existingIds)
    // Format the new ID with leading zeros
    const newIdNumber = (highestId + 1).toString().padStart(4, '0')
    return `FABWORX-${newIdNumber}`
  }

  const ProductViewDialog = ({ product }: { product: Product }) => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    // Group variants by option types
    const optionGroups = product.variants?.reduce((acc, variant) => {
      if (variant.option1) {
        acc.option1 = acc.option1 || new Set()
        acc.option1.add(variant.option1)
      }
      if (variant.option2) {
        acc.option2 = acc.option2 || new Set()
        acc.option2.add(variant.option2)
      }
      if (variant.option3) {
        acc.option3 = acc.option3 || new Set()
        acc.option3.add(variant.option3)
      }
      return acc
    }, {} as Record<string, Set<string>>) || {}

    // Get option names from the first variant that has them
    const optionNames = product.variants?.reduce((acc, variant) => {
      if (variant.option1Name && !acc.option1) acc.option1 = variant.option1Name
      if (variant.option2Name && !acc.option2) acc.option2 = variant.option2Name
      if (variant.option3Name && !acc.option3) acc.option3 = variant.option3Name
      return acc
    }, {} as Record<string, string>) || {}

    // Find the selected variant based on chosen options
    const selectedVariant = product.variants?.find(variant => {
      return (!selectedOptions.option1 || variant.option1 === selectedOptions.option1) &&
             (!selectedOptions.option2 || variant.option2 === selectedOptions.option2) &&
             (!selectedOptions.option3 || variant.option3 === selectedOptions.option3)
    })

  return (
      <DialogContent className="max-w-4xl w-full h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-md border border-zinc-800",
                      selectedImage === index ? "ring-2 ring-orange-500" : "hover:border-orange-500/50"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-orange-400 block mb-1">{product.category}</span>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedProduct(null)
                      setEditingProduct(product)
                    }}
                    className="h-8 w-8 border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/catalogue/${product.id}`, '_blank')}
                    className="h-8 border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View on Website
                  </Button>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-orange-400">
                  ${(selectedVariant?.price || product.price).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-zinc-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Options */}
            {Object.entries(optionGroups).map(([optionKey, values]) => (
              <div key={optionKey} className="space-y-3">
                <h3 className="font-medium">{optionNames[optionKey] || optionKey}</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(values).map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-zinc-800",
                        selectedOptions[optionKey] === value
                          ? "bg-orange-500/10 border-orange-500 text-orange-400"
                          : "hover:border-orange-500/30 hover:bg-orange-500/5"
                      )}
                      onClick={() => {
                        setSelectedOptions(prev => ({
                          ...prev,
                          [optionKey]: value
                        }))
                      }}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            {selectedVariant && (
              <div className="p-4 rounded-lg border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Selected Variant</span>
                  <span className="text-orange-400 font-medium">${selectedVariant.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">SKU:</span>
                  <span>{selectedVariant.sku}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Stock:</span>
                  <span>{selectedVariant.inventory} units</span>
                </div>
              </div>
            )}

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Product ID</span>
                    <span className="font-medium">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-zinc-400">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  {product.variants && (
                    <div className="flex justify-between py-2 border-b border-zinc-800">
                      <span className="text-zinc-400">Variants</span>
                      <span className="font-medium">{product.variants.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    )
  }

  const handleEditOptionChange = (index: number, field: 'name' | 'values', value: string | string[]) => {
    if (!editingProduct) return
    
    const newOptions = [...(editingProduct.options || [])]
    if (field === 'name') {
      newOptions[index] = { ...newOptions[index], name: value as string }
    } else {
      newOptions[index] = { 
        ...newOptions[index], 
        values: value as string[]
      }
    }
    setEditingProduct({
      ...editingProduct,
      options: newOptions
    })
    generateEditVariants(newOptions)
  }

  const generateEditVariants = (options: ProductOption[]) => {
    if (!editingProduct) return
    
    const activeOptions = options.filter(opt => opt.name && opt.values.length > 0)
    if (activeOptions.length === 0) {
      setEditingProduct({
        ...editingProduct,
        variants: []
      })
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
    
    // Generate base SKU from product ID
    const baseSku = editingProduct.id.replace('FABWORX-', '')
    
    const newVariants = combinations.map((combo, index) => {
      // Try to find existing variant with same options to preserve its data
      const existingVariant = editingProduct.variants?.find(v => 
        v.option1 === combo[0] && 
        v.option2 === combo[1] && 
        v.option3 === combo[2]
      )

      if (existingVariant) {
        return existingVariant
      }

      // Create new variant if no existing one found
      const variantSku = `${baseSku}-${(index + 1).toString().padStart(2, '0')}`
      const variantName = combo.join(' / ').toLowerCase()
      
      let variantPrice = editingProduct.price
      
      if (variantName.includes('large') || variantName.includes('xl')) {
        variantPrice *= 1.2
      }
      if (variantName.includes('premium') || variantName.includes('deluxe')) {
        variantPrice *= 1.3
      }
      if (variantName.includes('custom')) {
        variantPrice *= 1.5
      }
      
      variantPrice = Math.round(variantPrice * 100) / 100

      return {
        sku: variantSku,
        price: variantPrice,
        inventory: 0,
        option1: combo[0],
        option2: combo[1],
        option3: combo[2]
      }
    })

    setEditingProduct({
      ...editingProduct,
      variants: newVariants
    })
  }

  const addEditOption = () => {
    if (!editingProduct) return
    const newOptions = [...(editingProduct.options || []), { name: "", values: [] }]
    setEditingProduct({
      ...editingProduct,
      options: newOptions
    })
  }

  const removeEditOption = (index: number) => {
    if (!editingProduct) return
    const newOptions = [...(editingProduct.options || [])]
    newOptions.splice(index, 1)
    setEditingProduct({
      ...editingProduct,
      options: newOptions
    })
    generateEditVariants(newOptions)
  }

  const handleAddEditOptionValue = (optionIndex: number, value: string) => {
    if (!editingProduct || !value.trim()) return
    
    const newOptions = [...(editingProduct.options || [])]
    const currentValues = newOptions[optionIndex].values || []
    if (!currentValues.includes(value.trim())) {
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        values: [...currentValues, value.trim()]
      }
      setEditingProduct({
        ...editingProduct,
        options: newOptions
      })
      generateEditVariants(newOptions)
    }
  }

  const handleRemoveEditOptionValue = (optionIndex: number, valueIndex: number) => {
    if (!editingProduct) return
    const newOptions = [...(editingProduct.options || [])]
    newOptions[optionIndex].values.splice(valueIndex, 1)
    setEditingProduct({
      ...editingProduct,
      options: newOptions
    })
    generateEditVariants(newOptions)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsCreatingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="import">Import Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {editingProduct ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Edit Product: {editingProduct.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product ID</label>
                      <Input
                        value={editingProduct.id}
                        disabled
                        className="w-full bg-zinc-800"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Product ID cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name</label>
                      <Input
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                        placeholder="Enter product name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select
                        value={editingProduct.category}
                        onValueChange={(value) => {
                          setEditingProduct({
                            ...editingProduct,
                            category: value,
                          })
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price *</label>
                      <Input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                        placeholder="Enter price"
                        className="w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Original Price (optional)</label>
                      <Input
                        type="number"
                        value={editingProduct.originalPrice || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, originalPrice: parseFloat(e.target.value) || undefined})}
                        placeholder="Enter original price for discount display"
                        className="w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description *</label>
                      <Textarea
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        placeholder="Enter product description"
                        className="w-full"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Product Options</label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addEditOption}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option Type
                        </Button>
                      </div>
                      <div className="space-y-6">
                        {(editingProduct.options || []).map((option, optionIndex) => (
                          <div key={optionIndex} className="rounded-lg border border-zinc-800 overflow-hidden">
                            <div className="bg-zinc-800/50 p-4 flex items-center justify-between">
                              <div className="flex-1">
                                <Input
                                  value={option.name}
                                  onChange={(e) => handleEditOptionChange(optionIndex, 'name', e.target.value)}
                                  placeholder="Option name (e.g., Size, Color)"
                                  className="bg-zinc-900 border-zinc-700"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeEditOption(optionIndex)}
                                className="h-8 w-8 ml-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-2 mb-4">
                                {option.values.map((value, valueIndex) => (
                                  <div
                                    key={valueIndex}
                                    className="group relative bg-zinc-800 rounded-md px-3 py-1.5 text-sm flex items-center gap-2"
                                  >
                                    <span>{value}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveEditOptionValue(optionIndex, valueIndex)}
                                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Enter new value"
                                  className="bg-zinc-900 border-zinc-700"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      const input = e.currentTarget
                                      handleAddEditOptionValue(optionIndex, input.value)
                                      input.value = ''
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                    handleAddEditOptionValue(optionIndex, input.value)
                                    input.value = ''
                                  }}
                                  className="shrink-0"
                                >
                                  Add Value
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {editingProduct.variants && editingProduct.variants.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Variants</label>
                        <div className="rounded-md border border-zinc-700">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-zinc-700">
                                <th className="px-4 py-2 text-left text-sm">Variant</th>
                                <th className="px-4 py-2 text-left text-sm">SKU</th>
                                <th className="px-4 py-2 text-left text-sm">Price</th>
                                <th className="px-4 py-2 text-left text-sm">Inventory</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editingProduct.variants.map((variant, index) => (
                                <tr key={index} className="border-b border-zinc-700 last:border-0">
                                  <td className="px-4 py-2">
                                    {[variant.option1, variant.option2, variant.option3]
                                      .filter(Boolean)
                                      .join(' / ')}
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      value={variant.sku}
                                      onChange={(e) => {
                                        const newVariants = [...editingProduct.variants]
                                        newVariants[index] = { ...variant, sku: e.target.value }
                                        setEditingProduct({...editingProduct, variants: newVariants})
                                      }}
                                      placeholder="SKU"
                                      className="h-8"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      type="number"
                                      value={variant.price}
                                      onChange={(e) => {
                                        const newVariants = [...editingProduct.variants]
                                        newVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 }
                                        setEditingProduct({...editingProduct, variants: newVariants})
                                      }}
                                      placeholder="Price"
                                      className="h-8"
                                      min="0"
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      type="number"
                                      value={variant.inventory}
                                      onChange={(e) => {
                                        const newVariants = [...editingProduct.variants]
                                        newVariants[index] = { ...variant, inventory: parseInt(e.target.value) || 0 }
                                        setEditingProduct({...editingProduct, variants: newVariants})
                                      }}
                                      placeholder="Stock"
                                      className="h-8"
                                      min="0"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">Product Images</label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {(editingProduct.images || []).map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-zinc-800">
                            <img 
                              src={image} 
                              alt={`Product ${index + 1}`} 
                              className="object-cover w-full h-full"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                const updatedImages = [...(editingProduct.images || [])];
                                updatedImages.splice(index, 1);
                                setEditingProduct({...editingProduct, images: updatedImages});
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <CloudinaryUpload
                        onUploadComplete={handleProductImageUpload}
                        section={`product-${editingProduct.id}`}
                        buttonText="Upload Product Image"
                      />
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button 
                        onClick={handleSaveProduct}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingProduct(null)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : isCreatingProduct ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product ID *</label>
                      <div className="flex gap-2">
                        <Input
                          value={newProduct.id}
                          onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                          placeholder="Enter product ID"
                          className="flex-1"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setNewProduct({...newProduct, id: generateProductId()})}
                          className="shrink-0"
                          title="Generate new ID"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        Product ID must be unique. Click the refresh button to generate a new one.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name *</label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category *</label>
                      {showNewCategory ? (
                        <div className="flex gap-2">
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter new category name"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCreateCategory}
                            className="whitespace-nowrap"
                          >
                            Add Category
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setShowNewCategory(false)
                              setNewCategoryName("")
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                      <Select
                        value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
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
                            className="whitespace-nowrap"
                          >
                            New Category
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price *</label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                        placeholder="Enter price"
                        className="w-full"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Original Price (optional)</label>
                      <Input
                        type="number"
                        value={newProduct.originalPrice || ''}
                        onChange={(e) => setNewProduct({...newProduct, originalPrice: parseFloat(e.target.value) || undefined})}
                        placeholder="Enter original price for discount display"
                        className="w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Product Options</label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addOption}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option Type
                        </Button>
                      </div>
                      <div className="space-y-6">
                        {productOptions.map((option, optionIndex) => (
                          <div key={optionIndex} className="rounded-lg border border-zinc-800 overflow-hidden">
                            <div className="bg-zinc-800/50 p-4 flex items-center justify-between">
                              <div className="flex-1">
                                <Input
                                  value={option.name}
                                  onChange={(e) => handleOptionChange(optionIndex, 'name', e.target.value)}
                                  placeholder="Option name (e.g., Size, Color)"
                                  className="bg-zinc-900 border-zinc-700"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeOption(optionIndex)}
                                className="h-8 w-8 ml-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-2 mb-4">
                                {option.values.map((value, valueIndex) => (
                                  <div
                                    key={valueIndex}
                                    className="group relative bg-zinc-800 rounded-md px-3 py-1.5 text-sm flex items-center gap-2"
                                  >
                                    <span>{value}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveOptionValue(optionIndex, valueIndex)}
                                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={newOptionValue}
                                  onChange={(e) => setNewOptionValue(e.target.value)}
                                  placeholder="Enter new value"
                                  className="bg-zinc-900 border-zinc-700"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      handleAddOptionValue(optionIndex, e.target.value)
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleAddOptionValue(optionIndex, e.target.value)
                                  }}
                                  className="shrink-0"
                                >
                                  Add Value
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {productOptions.length === 0 && (
                          <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
                            <p className="text-zinc-400 mb-2">No options added yet</p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addOption}
                              className="h-8"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Option Type
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Images</label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {(newProduct.images || []).map((image, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-zinc-800">
                            <img 
                              src={image} 
                              alt={`Product ${index + 1}`} 
                              className="object-cover w-full h-full"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => {
                                const updatedImages = [...(newProduct.images || [])];
                                updatedImages.splice(index, 1);
                                setNewProduct({...newProduct, images: updatedImages});
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <CloudinaryUpload
                        onUploadComplete={handleProductImageUpload}
                        section="new-product"
                        buttonText="Upload Product Image"
                      />
                    </div>
                    
                    {productVariants.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Variants</label>
                        <div className="rounded-md border border-zinc-700">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-zinc-700">
                                <th className="px-4 py-2 text-left text-sm">Variant</th>
                                <th className="px-4 py-2 text-left text-sm">SKU</th>
                                <th className="px-4 py-2 text-left text-sm">Price</th>
                                <th className="px-4 py-2 text-left text-sm">Inventory</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productVariants.map((variant, index) => (
                                <tr key={index} className="border-b border-zinc-700 last:border-0">
                                  <td className="px-4 py-2">
                                    {[variant.option1, variant.option2, variant.option3]
                                      .filter(Boolean)
                                      .join(' / ')}
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      value={variant.sku}
                                      onChange={(e) => {
                                        const newVariants = [...productVariants]
                                        newVariants[index] = { ...variant, sku: e.target.value }
                                        setProductVariants(newVariants)
                                      }}
                                      placeholder="SKU"
                                      className="h-8"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      type="number"
                                      value={variant.price}
                                      onChange={(e) => {
                                        const newVariants = [...productVariants]
                                        newVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 }
                                        setProductVariants(newVariants)
                                      }}
                                      placeholder="Price"
                                      className="h-8"
                                      min="0"
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <Input
                                      type="number"
                                      value={variant.inventory}
                                      onChange={(e) => {
                                        const newVariants = [...productVariants]
                                        newVariants[index] = { ...variant, inventory: parseInt(e.target.value) || 0 }
                                        setProductVariants(newVariants)
                                      }}
                                      placeholder="Stock"
                                      className="h-8"
                                      min="0"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8 border-t border-zinc-800 pt-8">
                      <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                      <div className="bg-zinc-900 rounded-lg overflow-hidden max-w-md mx-auto shadow-lg">
                        <div className="aspect-video relative bg-zinc-800">
                          {newProduct.images && newProduct.images.length > 0 ? (
                            <img
                              src={newProduct.images[0]}
                              alt={newProduct.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-zinc-600">
                              <ImageIcon className="h-12 w-12" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          {newProduct.category && (
                            <span className="text-sm text-orange-400 block mb-1">{newProduct.category}</span>
                          )}
                          <h3 className="font-semibold text-lg mb-2">
                            {newProduct.name || "Product Name"}
                          </h3>
                          <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                            {newProduct.description || "Product description will appear here"}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-orange-400">
                                ${newProduct.price.toFixed(2)}
                              </span>
                              {newProduct.originalPrice && (
                                <span className="text-sm text-zinc-500 line-through">
                                  ${newProduct.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {productVariants.length > 0 && (
                              <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                                {productOptions.length} {productOptions.length === 1 ? 'Option' : 'Options'}
                              </Badge>
                            )}
                          </div>
                          {productVariants.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-zinc-800">
                              <span className="text-sm text-zinc-400 block mb-2">Available Variants:</span>
                              <div className="flex flex-wrap gap-2">
                                {productVariants.slice(0, 3).map((variant, index) => (
                                  <Badge key={index} variant="secondary" className="bg-zinc-800">
                                    {[variant.option1, variant.option2, variant.option3]
                                      .filter(Boolean)
                                      .join(' / ')}
                                  </Badge>
                                ))}
                                {productVariants.length > 3 && (
                                  <Badge variant="secondary" className="bg-zinc-800">
                                    +{productVariants.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-8">
                      <Button 
                        onClick={handleSaveProduct}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                        disabled={!newProduct.name || !newProduct.category || newProduct.price <= 0}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Create Product
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreatingProduct(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-60">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden cursor-pointer group" onClick={() => setSelectedProduct(product)}>
                      <div className="aspect-video relative bg-zinc-800">
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <span className="text-sm text-orange-400 block">{product.category}</span>
                          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-orange-400 transition-colors">{product.name}</h3>
                        </div>
                        <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-orange-400">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-zinc-500 line-through ml-2">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingProduct(product)
                              }}
                              className="h-8 w-8 border-orange-500/30 hover:bg-orange-500/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmDelete(product.id)
                              }}
                              className="h-8 w-8"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-900 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-zinc-400 mb-6">Try adjusting your search or filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="import">
          {showImport && <CSVUpload />}
        </TabsContent>
      </Tabs>
      <Dialog open={productToDelete !== null} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmedDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={selectedProduct !== null} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && <ProductViewDialog product={selectedProduct} />}
      </Dialog>
      <Toaster />
    </div>
  )
}

