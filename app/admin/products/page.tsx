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
import { Plus, Search, Edit, Trash, MoreHorizontal, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Product, Category } from "@/types"
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

interface ProductImage {
  url: string
  alt?: string
}

// Define categories directly in the component
const productCategories = [
  "Clothing",
  "Clothing > T-Shirts",
  "Clothing > Hoodies",
  "Vehicles & Parts",
  "Vehicles & Parts > Vehicle Parts & Accessories",
  "Vehicles & Parts > Vehicle Parts & Accessories > Vehicle Maintenance, Care & Decor > Vehicle Cleaning > Car Wash Solutions"
]

export default function ProductsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'> & { id?: string }>({
    name: '',
    category: '',
    subcategory: '',
    price: 0,
    description: '',
    images: []
  })
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
        
        // Get categories from data.ts
        const { productCategories } = await import('@/app/data')
        setCategories(productCategories as Category[])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  useEffect(() => {
    let filtered = [...products]

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => {
        return product.category.startsWith(selectedCategory)
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
        const response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        })

        if (!response.ok) throw new Error('Failed to update product')
        
        // Update local state
        setProducts(prevProducts => 
          prevProducts.map(p => p.id === editingProduct.id ? editingProduct : p)
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
            images: newProduct.images?.length ? newProduct.images : ["/placeholder.png"]
          })
        })

        if (!response.ok) throw new Error('Failed to create product')
        
        const createdProduct = await response.json()
        
        // Update local state
        setProducts(prevProducts => [...prevProducts, createdProduct])
        
        toast({
          title: "Product Created",
          description: `${newProduct.name} has been created`,
        })
        
        setIsCreatingProduct(false)
        setNewProduct({
          name: '',
          category: '',
          subcategory: '',
          price: 0,
          description: '',
          images: []
        })
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
        const { products: currentProducts } = await import('@/app/data')
        setProducts(currentProducts)
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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreatingProduct(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImport(!showImport)}
          >
            {showImport ? 'Hide Import' : 'Import Products'}
          </Button>
        </div>
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
                            subcategory: '' // Reset subcategory when category changes
                          })
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {editingProduct.category && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Subcategory</label>
                        <Select
                          value={editingProduct.subcategory || ''}
                          onValueChange={(value) => setEditingProduct({...editingProduct, subcategory: value})}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find(c => c.name === editingProduct.category)
                              ?.subcategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
                  </div>
                  
                  <div className="space-y-4">
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
          ) : (
            <>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                        <Input
                          placeholder="Search products..."
                          className="pl-10 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-64">
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          setSelectedCategory(value)
                          setSelectedSubcategory('all') // Reset subcategory when category changes
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedCategory !== 'all' && (
                      <div className="w-full md:w-64">
                        <Select
                          value={selectedSubcategory}
                          onValueChange={setSelectedSubcategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Subcategories</SelectItem>
                            {categories
                              .find(c => c.name === selectedCategory)
                              ?.subcategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="flex items-center justify-center h-60">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
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
                          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
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
                              onClick={() => setEditingProduct(product)}
                              className="h-8 w-8 border-orange-500/30 hover:bg-orange-500/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => confirmDelete(product.id)}
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
      <Toaster />
    </div>
  )
}

