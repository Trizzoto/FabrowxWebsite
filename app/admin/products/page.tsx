"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
import { productCategories } from '@/app/data'
import { cn } from '@/lib/utils'
import { ManageProducts } from '@/components/admin/manage-products'
import { ImportProducts } from '@/components/admin/import-products'

interface ProductImage {
  url: string
  alt?: string
}

export default function ProductsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Product>({
    id: 'FABWORX-0001',
    name: '',
    category: '',
    price: 0,
    description: '',
    images: [],
    brand: 'Zoo Performance'
  })
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [productOptions, setProductOptions] = useState<ProductOption[]>([])
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([])
  const [newOptionValue, setNewOptionValue] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
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

  // Force a fetch of latest categories whenever the product page is loaded or focused
  useEffect(() => {
    // Fetch latest categories
    const refreshCategories = async () => {
      try {
        const response = await fetch('/api/categories', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error refreshing categories:', error)
      }
    }

    // Call immediately when component mounts
    refreshCategories()

    // Also refresh when window gets focus (user returns to page)
    const handleFocus = () => refreshCategories()
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }

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
  }, [selectedCategory, selectedBrand, searchQuery, products])

  const handleSaveProduct = async () => {
    try {
      // Check if we need to create a new category
      const processCategory = async (categoryName: string | number) => {
        if (!categoryName) return true;
        
        const categoryString = String(categoryName);
        if (categoryString && !categories.includes(categoryString)) {
          // Create the category via API
          const categoryResponse = await fetch('/api/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: categoryString }),
          });
          
          if (categoryResponse.ok) {
            // Fetch updated categories list
            const updatedCategoriesResponse = await fetch('/api/categories');
            if (updatedCategoriesResponse.ok) {
              const updatedCategories = await updatedCategoriesResponse.json();
              setCategories(updatedCategories);
            }
            
            console.log(`New category created: ${categoryString}`);
            return true;
          } else {
            console.error('Failed to create category:', categoryString);
            return false;
          }
        }
        return true; // Category already exists or is empty
      };
      
      if (editingProduct) {
        // Check if we need to create a new category
        await processCategory(editingProduct.category);
        
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
      } else if (newProduct.name && newProduct.category) {
        // Check if we need to create a new category
        await processCategory(newProduct.category);
        
        // Create new product via API
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newProduct,
            price: Number(newProduct.price),
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
        
        setNewProduct({
          id: 'FABWORX-0001',
          name: '',
          category: '',
          price: 0,
          description: '',
          images: [],
          brand: 'Zoo Performance'
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
    } else if (newProduct.name && newProduct.category) {
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
    if (!activeOptions.length) return []

    // Helper function to generate combinations
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

    // Get all option values
    const optionValues = activeOptions.map(opt => opt.values)

    // Generate all combinations
    const combinations = generateCombinations(optionValues)
    
    // Generate a base SKU
    const baseId = newProduct.id || 'TEMP'
    const baseSku = baseId.replace('FABWORX-', '')
    
    // Create variants for each combination
    const newVariants = combinations.map((combo, index) => {
      const variantSku = `${baseSku}-${(index + 1).toString().padStart(2, '0')}`
      const variantName = combo.join(' / ').toLowerCase()
      
      // Adjust price based on option values
      let variantPrice = newProduct.price || 0
      
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

      // Map options to the correct positions
      return {
        sku: variantSku,
        price: variantPrice,
        inventory: 0,
        option1: activeOptions[0]?.name ? `${activeOptions[0].name}: ${combo[0]}` : combo[0],
        option2: activeOptions[1]?.name ? `${activeOptions[1].name}: ${combo[1]}` : combo[1],
        option3: activeOptions[2]?.name ? `${activeOptions[2].name}: ${combo[2]}` : combo[2]
      }
    })

    setProductVariants(newVariants)
    return newVariants
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
      if (variant.option1 && !acc.option1) acc.option1 = variant.option1
      if (variant.option2 && !acc.option2) acc.option2 = variant.option2
      if (variant.option3 && !acc.option3) acc.option3 = variant.option3
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
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/products/${product.id}`)
                    }}
                    className="h-8 w-8 border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/shop/${product.id}`, '_blank')}
                    className="h-8 border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View on Website
                  </Button>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-orange-400">
                  ${(() => {
                    // Ensure we have a valid number
                    let price = selectedVariant?.price || product.price;
                    if (typeof price !== 'number') price = Number(price);
                    if (isNaN(price)) return '0';
                    
                    // Format the price properly
                    if (price % 1 === 0) {
                      return Math.round(price).toString();
                    } else {
                      return price.toFixed(2).replace(/\.?0+$/, '');
                    }
                  })()}
                </span>
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
                <div>
                  <p>Option 1: {selectedVariant?.option1 || 'N/A'}</p>
                  <p>Option 2: {selectedVariant?.option2 || 'N/A'}</p>
                  <p>Option 3: {selectedVariant?.option3 || 'N/A'}</p>
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
    
    // Create a map of existing variants for quick lookup
    const existingVariantMap = new Map<string, ProductVariant>()
    editingProduct.variants?.forEach(variant => {
      const key = [variant.option1, variant.option2, variant.option3]
        .filter(Boolean)
        .join('|')
      existingVariantMap.set(key, variant)
    })
    
    const newVariants = combinations.map((combo, index) => {
      // Create the variant key for lookup
      const variantKey = combo.join('|')
      
      // Try to find existing variant
      const existingVariant = existingVariantMap.get(variantKey)
      if (existingVariant) {
        return {
          ...existingVariant,
          option1: combo[0] || undefined,
          option2: combo[1] || undefined,
          option3: combo[2] || undefined
        }
      }

      // Create new variant
      const variantSku = `${baseSku}-${(index + 1).toString().padStart(2, '0')}`
      const variantName = combo.join(' / ').toLowerCase()
      
      let variantPrice = editingProduct.price
      
      // Apply price adjustments based on variant options
      combo.forEach(value => {
        const lowerValue = value.toLowerCase()
        if (lowerValue.includes('large') || lowerValue.includes('xl')) {
        variantPrice *= 1.2
      }
        if (lowerValue.includes('premium') || lowerValue.includes('deluxe')) {
        variantPrice *= 1.3
      }
        if (lowerValue.includes('custom')) {
        variantPrice *= 1.5
      }
      })
      
      variantPrice = Math.round(variantPrice * 100) / 100

      return {
        sku: variantSku,
        price: variantPrice,
        inventory: 0,
        option1: combo[0] || undefined,
        option2: combo[1] || undefined,
        option3: combo[2] || undefined
      }
    })

    // Update the product with new variants
    setEditingProduct({
      ...editingProduct,
      variants: newVariants
    })
  }

  const handleEditOptionChange = (index: number, field: 'name' | 'values', value: string | string[]) => {
    if (!editingProduct) return
    
    const newOptions = [...(editingProduct.options || [])]
    if (field === 'name') {
      newOptions[index] = { ...newOptions[index], name: value as string }
    } else {
      // Ensure values are unique and trimmed
      const values = Array.isArray(value) ? value : [value]
      const uniqueValues = [...new Set(values.map(v => v.trim()))]
      newOptions[index] = { 
        ...newOptions[index], 
        values: uniqueValues
      }
    }
    
    setEditingProduct({
      ...editingProduct,
      options: newOptions
    })
    
    // Regenerate variants when options change
    generateEditVariants(newOptions)
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
    const trimmedValue = value.trim()
    
    // Only add if value doesn't already exist (case-insensitive)
    if (!currentValues.some(v => v.toLowerCase() === trimmedValue.toLowerCase())) {
      // Extract all existing values from variants for this option
      const existingValues = new Set<string>()
      editingProduct.variants?.forEach(variant => {
        const optionKey = `option${optionIndex + 1}` as keyof ProductVariant
        const variantValue = variant[optionKey]
        if (variantValue) {
          existingValues.add(String(variantValue))
        }
      })
      
      // Add the new value
      existingValues.add(trimmedValue)
      
      // Update the option with all values
      newOptions[optionIndex] = {
        ...newOptions[optionIndex],
        values: Array.from(existingValues)
      }
      
      setEditingProduct({
        ...editingProduct,
        options: newOptions
      })
      generateEditVariants(newOptions)
    }
  }

  const initializeEditOptions = (variants: ProductVariant[], product: Product) => {
    // Create a map for all options
    const optionMap: Record<string, Set<string>> = {
      'Size': new Set<string>()
    }
    
    // Extract all option values from variants
    variants.forEach(variant => {
      // For each option, collect the unique values - ensure all values are strings
      if (variant.option1) optionMap['Size'].add(String(variant.option1))
      if (variant.option2) {
        const opt2 = String(variant.option2 || '')
        if (opt2 && !opt2.includes('undefined')) optionMap['Size'].add(opt2)
      }
      if (variant.option3) {
        const opt3 = String(variant.option3 || '')
        if (opt3 && !opt3.includes('undefined')) optionMap['Size'].add(opt3)
      }
    })
    
    // Generate options array from the collected values
    const options = Object.entries(optionMap)
      .filter(([_, values]) => values.size > 0)
      .map(([name, values]) => ({
        name,
        values: Array.from(values)
      }))
    
    // Set the options on the product directly
    setEditingProduct({
      ...product,
      options: options
    })
    
    console.log("Initialized product options:", options)
  }

  // When setting editingProduct, immediately initialize options
  const handleEditProduct = (product: Product) => {
    // If product has variants but no options, generate them
    if (product.variants?.length && (!product.options || product.options.length === 0)) {
      // Clone the product to avoid reference issues
      const productCopy = JSON.parse(JSON.stringify(product)) as Product
      
      // Initialize options directly
      initializeEditOptions(productCopy.variants || [], productCopy)
    } else {
      // Otherwise just set the product as is
      setEditingProduct(product)
    }
  }

  useEffect(() => {
    // Force re-initialization of options any time a product is set for editing
    if (editingProduct && editingProduct.variants && editingProduct.variants.length > 0) {
      const variantCount = editingProduct.variants.length
      const optionsEmpty = !editingProduct.options || editingProduct.options.length === 0
      const optionsIncomplete = editingProduct.options && 
                               editingProduct.options[0] && 
                               editingProduct.options[0].values.length < variantCount
      
      if (optionsEmpty || optionsIncomplete) {
        initializeEditOptions(editingProduct.variants, editingProduct)
      }
    }
  }, [editingProduct?.id])

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
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-6">
        {/* Header with Manage Products */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="flex gap-4">
            <ImportProducts />
            <ManageProducts />
            <Button onClick={() => router.push("/admin/products/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
        <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
                className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
            </div>
        </div>
          <Select
            value={selectedBrand}
            onValueChange={setSelectedBrand}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Elite Fabworx">Elite Fabworx</SelectItem>
              <SelectItem value="Zoo Performance">Zoo Performance</SelectItem>
            </SelectContent>
          </Select>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
            <SelectTrigger className="w-[180px]">
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

        {/* Products Table */}
        <Card>
              <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found
                        </div>
                      ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand || "Zoo Performance"}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/admin/products/${product.id}`)
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                        </div>
            )}
                      </CardContent>
                    </Card>
                </div>
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
      <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
        {editingProduct && (
          <DialogContent className="max-w-4xl w-full h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product information and variants.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="general" className="mt-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="options">Options & Variants</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Product Name</label>
                      <Input
                    id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="Product name"
                      />
                    </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-brand" className="text-sm font-medium">Brand</label>
                  <Select
                    value={editingProduct.brand || "Zoo Performance"}
                    onValueChange={(value) => setEditingProduct({...editingProduct, brand: value})}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zoo Performance">Zoo Performance</SelectItem>
                      <SelectItem value="Elite Fabworx">Elite Fabworx</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-zinc-400 mt-1">
                    Select which brand this product belongs to
                  </p>
                    </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
                  <Select
                        value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({...editingProduct, category: value as string})}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
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
                    </div>
              </TabsContent>
              
              <TabsContent value="options" className="space-y-4 mt-4">
                {editingProduct.options?.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <label htmlFor={`edit-option-${index}-name`} className="text-sm font-medium">Option Name</label>
                                <Input
                      id={`edit-option-${index}-name`}
                                  value={option.name}
                            onChange={(e) => handleEditOptionChange(index, 'name', e.target.value)}
                    />
                            </div>
                ))}
                {editingProduct.options?.map((option, index) => (
                  <div key={`${index}-values`} className="space-y-2">
                    <label htmlFor={`edit-option-${index}-values`} className="text-sm font-medium">Values</label>
                                <Input
                      id={`edit-option-${index}-values`}
                      value={option.values.join(', ')}
                      onChange={(e) => handleEditOptionChange(index, 'values', e.target.value.split(', '))}
                    />
                              </div>
                ))}
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4 mt-4">
                {editingProduct.images?.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <label htmlFor={`edit-image-${index}`} className="text-sm font-medium">Image URL</label>
                                    <Input
                      id={`edit-image-${index}`}
                      value={image}
                                      onChange={(e) => {
                        const newImages = [...(editingProduct.images || []).slice(0, index), e.target.value, ...(editingProduct.images || []).slice(index + 1)]
                        setEditingProduct({...editingProduct, images: newImages})
                      }}
                    />
                          </div>
                        ))}
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}