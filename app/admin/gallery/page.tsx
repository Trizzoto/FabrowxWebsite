"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryUpload } from '@/components/ui/cloudinary-upload'
import { useToast } from '@/components/ui/use-toast'
import { 
  Loader2, 
  Plus, 
  Trash, 
  Edit,
  Save,
  X,
  Move,
  Search
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toaster } from '@/components/ui/toaster'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'> & { id?: string }>({
    url: '',
    caption: '',
    category: ''
  });

  // Fetch real gallery data from gallery API
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const images: GalleryImage[] = await response.json();
        setGalleryImages(images);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(images.map(img => img.category).filter(Boolean))
        );
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load gallery:', error);
        toast({
          title: "Error",
          description: "Failed to load gallery images",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchGalleryData();
  }, [toast]);

  // Save gallery image updates
  const updateGalleryImage = async (updatedImage: GalleryImage) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/gallery/${updatedImage.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedImage),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update gallery image');
      }
      
      toast({
        title: "Image Updated",
        description: "Gallery image has been updated successfully",
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Failed to update gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to update gallery image",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  };

  // Delete gallery image
  const deleteGalleryImage = async (id: string) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery image');
      }
      
      toast({
        title: "Image Deleted",
        description: "Gallery image has been removed",
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Failed to delete gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery image",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  };

  // Add new gallery image
  const addGalleryImage = async (image: Omit<GalleryImage, 'id'>) => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          images: [image] 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add gallery image');
      }
      
      const newImages = await response.json();
      
      toast({
        title: "Image Added",
        description: "New gallery image has been added",
      });
      
      setIsSaving(false);
      return newImages[0];
    } catch (error) {
      console.error('Failed to add gallery image:', error);
      toast({
        title: "Error",
        description: "Failed to add gallery image",
        variant: "destructive"
      });
      setIsSaving(false);
      return null;
    }
  };

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = 
      (image.caption?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (image.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleImageUpload = (imageUrl: string) => {
    setNewImage({
      ...newImage,
      url: imageUrl
    });
  };

  const handleSaveImage = async () => {
    if (newImage.url) {
      const category = newImage.category || 'general';
      
      const imageToAdd = {
        url: newImage.url,
        caption: newImage.caption || '',
        category: category
      };
      
      const addedImage = await addGalleryImage(imageToAdd);
      
      if (addedImage) {
        setGalleryImages([...galleryImages, addedImage]);
        
        // Add category if it's new
        if (!categories.includes(category)) {
          setCategories([...categories, category]);
        }
        
        // Reset form
        setNewImage({
          url: '',
          caption: '',
          category: ''
        });
        
        setIsDialogOpen(false);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please provide an image",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdits = async () => {
    if (editingImage) {
      const success = await updateGalleryImage(editingImage);
      
      if (success) {
        const updatedImages = galleryImages.map(img => 
          img.id === editingImage.id ? editingImage : img
        );
        
        setGalleryImages(updatedImages);
        
        // Add category if it's new
        if (editingImage.category && !categories.includes(editingImage.category)) {
          setCategories([...categories, editingImage.category]);
        }
        
        setEditingImage(null);
      }
    }
  };

  const handleDeleteImage = async (id: string) => {
    const success = await deleteGalleryImage(id);
    
    if (success) {
      const updatedImages = galleryImages.filter(img => img.id !== id);
      setGalleryImages(updatedImages);
      setDeleteImageId(null);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
              <DialogDescription>
                Upload a new image to your gallery with details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Upload</label>
                {newImage.url ? (
                  <div className="relative w-full h-48 rounded-md overflow-hidden">
                    <img
                      src={newImage.url}
                      alt="New gallery image"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => setNewImage({...newImage, url: ''})}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <CloudinaryUpload
                    onUploadComplete={handleImageUpload}
                    section="gallery"
                    buttonText="Upload Gallery Image"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Caption</label>
                <Input 
                  value={newImage.caption}
                  onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
                  placeholder="Brief description of the image"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <div className="flex gap-2">
                  <Select 
                    value={newImage.category}
                    onValueChange={(value) => setNewImage({...newImage, category: value})}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="general">General</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or add new category"
                    className="bg-zinc-800 border-zinc-700"
                    onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleSaveImage}
                disabled={!newImage.url || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                Add Gallery Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters for gallery */}
      <Card className="mb-6 bg-zinc-900 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search gallery..."
                className="pl-9 bg-zinc-800 border-zinc-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Gallery Preview */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map(image => (
            <Card 
              key={image.id} 
              className={`bg-zinc-900 border-zinc-800 group hover:border-orange-500/50 transition-colors ${editingImage?.id === image.id ? 'ring-2 ring-orange-500' : ''}`}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.caption || 'Gallery image'}
                  fill
                  className="object-cover"
                />
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="self-end flex gap-1">
                    {editingImage?.id === image.id ? (
                      <Button 
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-green-600 hover:bg-green-700"
                        onClick={handleSaveEdits}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                      </Button>
                    ) : (
                      <Button 
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => setEditingImage(image)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => setDeleteImageId(image.id)}
                      disabled={isSaving}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="bg-black/80 p-2 rounded">
                    {editingImage?.id === image.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editingImage.caption}
                          onChange={(e) => setEditingImage({...editingImage, caption: e.target.value})}
                          className="bg-zinc-800 border-zinc-700 text-xs h-7"
                        />
                        <Input
                          value={editingImage.category}
                          onChange={(e) => setEditingImage({...editingImage, category: e.target.value})}
                          className="bg-zinc-800 border-zinc-700 text-xs h-7"
                          placeholder="Category"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium line-clamp-2 mb-1">{image.caption || 'Gallery image'}</p>
                        <span className="text-xs px-2 py-0.5 bg-orange-600/20 text-orange-400 rounded-full">{image.category || 'general'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-zinc-400">No gallery images found.</p>
          <p className="text-zinc-500 text-sm mt-1">Add new images or adjust your filters.</p>
        </div>
      )}
      
      {/* Confirmation dialog for delete */}
      <AlertDialog open={!!deleteImageId} onOpenChange={(open) => !open && setDeleteImageId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this gallery image. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteImageId && handleDeleteImage(deleteImageId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Toaster />
    </div>
  );
} 