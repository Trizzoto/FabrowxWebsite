import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
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
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function ManageProducts() {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
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

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={isDeleting}
        className="border-red-500/30 hover:bg-red-500/10 text-red-500 hover:text-red-400"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete All
      </Button>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Products</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all products from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 