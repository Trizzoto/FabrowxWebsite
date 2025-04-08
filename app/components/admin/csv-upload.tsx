import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Papa, { ParseResult, ParseError } from 'papaparse'

interface CSVRow {
  Handle: string
  Title: string
  Description: string
  Type: string
  Price: string
  'Compare At Price'?: string
  Variant?: string
  'Image Src'?: string
  [key: string]: string | undefined
}

export function CSVUpload() {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setIsUploading(true)
    
    try {
      // Read the file as text
      const reader = new FileReader()
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const csvText = e.target?.result as string
          
          // Parse CSV using PapaParse
          Papa.parse<CSVRow>(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: async (results: ParseResult<CSVRow>) => {
              try {
                if (results.errors.length > 0) {
                  console.error('CSV parsing errors:', results.errors)
                  toast.error('Error parsing CSV file')
                  return
                }

                // Send the parsed data to our API
                const response = await fetch('/api/products/upload', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(results.data),
                })

                const data = await response.json()

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to upload products')
                }

                toast.success(data.message || 'Products imported successfully')
                
                // Refresh the page to show new products
                window.location.reload()
              } catch (error) {
                console.error('Upload error:', error)
                toast.error(error instanceof Error ? error.message : 'Failed to upload products')
              }
            },
            error: (error: Error, file?: Papa.LocalFile) => {
              console.error('CSV parsing error:', error)
              toast.error('Failed to parse CSV file')
            }
          })
        } catch (error) {
          console.error('CSV processing error:', error)
          toast.error('Failed to process CSV file')
        }
      }

      reader.onerror = () => {
        toast.error('Failed to read CSV file')
      }

      // Start reading the file
      reader.readAsText(file)
    } catch (error) {
      console.error('File handling error:', error)
      toast.error('Failed to handle CSV file')
    } finally {
      setIsUploading(false)
      // Clear the file input
      event.target.value = ''
    }
  }

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete products')
      }

      toast.success('All products deleted')
      
      // Refresh the page to show changes
      window.location.reload()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete products')
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Import Products from CSV</h2>
        <Button 
          variant="destructive" 
          onClick={handleDeleteAll}
          className="bg-red-900/50 hover:bg-red-900"
        >
          Delete All Products
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </Button>
        <p className="text-sm text-zinc-400">
          Upload a CSV file to import products. The file should match the Shopify export format.
        </p>
      </div>
    </div>
  )
} 