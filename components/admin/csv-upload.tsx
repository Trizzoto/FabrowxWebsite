import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { Product } from '@/types'

interface DuplicateProduct {
  existing: Product
  new: Product
}

interface ValidationResponse {
  products: Product[]
  categories: string[]
  message: string
}

export function CSVUpload() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [duplicates, setDuplicates] = useState<DuplicateProduct[]>([])
  const [currentDuplicateIndex, setCurrentDuplicateIndex] = useState(0)
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch('/api/products', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete products')
      }

      toast({
        title: 'Success',
        description: 'All products have been deleted'
      })

      // Refresh the page to show empty state
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete products:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete products',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleDuplicateDecision = async (overwrite: boolean) => {
    try {
      const duplicate = duplicates[currentDuplicateIndex]
      const nextIndex = currentDuplicateIndex + 1

      // Update pending products based on decision
      if (overwrite) {
        setPendingProducts(prev => 
          prev.map(p => p.id === duplicate.existing.id ? duplicate.new : p)
        )
      }

      // Move to next duplicate or finish upload
      if (nextIndex < duplicates.length) {
        setCurrentDuplicateIndex(nextIndex)
      } else {
        // No more duplicates to handle, proceed with upload
        setUploadProgress(75) // Start final upload phase
        console.log('Uploading final products:', pendingProducts)
        const response = await fetch('/api/products/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            products: pendingProducts,
            categories: Array.from(new Set(pendingProducts.map(p => p.category)))
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to upload products')
        }

        const data = await response.json()
        setUploadProgress(100)
        toast({
          title: 'Success',
          description: `${data.count} products imported successfully`
        })

        // Reset states after a short delay to show 100%
        setTimeout(() => {
          setDuplicates([])
          setCurrentDuplicateIndex(0)
          setPendingProducts([])
          setUploadProgress(0)
          // Refresh the page to show new products
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      console.error('Failed to handle duplicate:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to handle duplicate product',
        variant: 'destructive'
      })
      setUploadProgress(0)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(25)

    try {
      // Create FormData and append file
      const formData = new FormData()
      formData.append('file', file)

      // Upload the file
      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      console.log('Upload response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload CSV')
      }

      setUploadProgress(100)
      toast({
        title: 'Success',
        description: data.message || 'Products imported successfully'
      })

      // Reset states and refresh the page
      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Failed to upload CSV:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload CSV file',
        variant: 'destructive'
      })
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
      // Reset the file input
      event.target.value = ''
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Import Products from CSV</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isUploading}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Products
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="relative"
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
                    Upload CSV
                  </>
                )}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                  id="csv-file-upload"
                  name="csv-file"
                  aria-label="Upload CSV file"
                />
              </Button>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file to import products. The file should match the Shopify export format.
              </p>
            </div>
            {uploadProgress > 0 && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {uploadProgress === 100 ? 'Complete!' : `Processing... ${uploadProgress}%`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all products from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All Products
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog 
        open={duplicates.length > 0} 
        onOpenChange={() => {
          setDuplicates([])
          setCurrentDuplicateIndex(0)
          setPendingProducts([])
          setUploadProgress(0)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Product Found</DialogTitle>
            <DialogDescription>
              A product with ID "{duplicates[currentDuplicateIndex]?.existing.id}" already exists.
              Would you like to overwrite it with the new data?
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Existing Product</h4>
              <div className="text-sm">
                <p><strong>Name:</strong> {duplicates[currentDuplicateIndex]?.existing.name}</p>
                <p><strong>Price:</strong> ${duplicates[currentDuplicateIndex]?.existing.price}</p>
                <p><strong>Category:</strong> {duplicates[currentDuplicateIndex]?.existing.category}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">New Product</h4>
              <div className="text-sm">
                <p><strong>Name:</strong> {duplicates[currentDuplicateIndex]?.new.name}</p>
                <p><strong>Price:</strong> ${duplicates[currentDuplicateIndex]?.new.price}</p>
                <p><strong>Category:</strong> {duplicates[currentDuplicateIndex]?.new.category}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleDuplicateDecision(false)}
            >
              Skip
            </Button>
            <Button
              variant="default"
              onClick={() => handleDuplicateDecision(true)}
            >
              Overwrite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 