import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Upload, Loader2 } from 'lucide-react'
import { Product } from '@/types'

export function ImportProducts() {
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importedProducts, setImportedProducts] = useState<Product[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      setProgress(10)

      if (!file.name.endsWith('.csv')) {
        throw new Error('Please upload a CSV file')
      }

      const formData = new FormData()
      formData.append('file', file)

      setProgress(30)
      
      // Upload the CSV file for processing
      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to import CSV')
      }

      setProgress(70)
      
      const data = await response.json()
      setImportedProducts(data.products || [])
      
      setProgress(100)
      
      toast({
        title: 'Success',
        description: `Successfully imported ${data.products.length} products`
      })

      // Close dialog and reset state after a short delay
      setTimeout(() => {
        setShowImportDialog(false)
        setProgress(0)
        setIsImporting(false)
        
        // Reload the page to show the new products
        window.location.reload()
      }, 1500)
      
    } catch (error) {
      console.error('Import failed:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import products',
        variant: 'destructive'
      })
      setIsImporting(false)
      setProgress(0)
    }
    
    // Reset the file input
    event.target.value = ''
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setShowImportDialog(true)}
      >
        <Upload className="mr-2 h-4 w-4" />
        Import CSV
      </Button>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Products</DialogTitle>
            <DialogDescription>
              Upload a CSV file in Shopify export format to import products. 
              Products with the same handle will be grouped together.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isImporting ? (
              <div className="space-y-4">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {progress < 100 ? 'Processing CSV file...' : 'Import complete!'}
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                  className="w-full py-8 border-dashed"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Click to upload CSV file
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 