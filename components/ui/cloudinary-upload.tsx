import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { uploadImage } from '@/lib/cloudinary';
import { useToast } from '@/components/ui/use-toast';

interface CloudinaryUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  className?: string;
  section?: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  multiple?: boolean;
}

export function CloudinaryUpload({ 
  onUploadComplete, 
  className = '', 
  section = 'hero',
  buttonText = 'Upload Image',
  buttonVariant = 'outline',
  buttonSize = 'default',
  multiple = false
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    try {
      console.log(`CloudinaryUpload: Starting upload for section "${section}"`);
      setIsUploading(true);
      
      if (multiple) {
        // Handle multiple files
        const uploadPromises = Array.from(files).map(file => uploadImage(file, section));
        const results = await Promise.all(uploadPromises);
        
        results.forEach(result => {
          if (!result || !result.secure_url) {
            throw new Error('Upload failed - no URL returned');
          }
          onUploadComplete(result.secure_url);
        });
        
        toast({
          title: "Images Uploaded",
          description: `Successfully uploaded ${files.length} images for ${section}`,
        });
      } else {
        // Handle single file
        const result = await uploadImage(files[0], section);
        console.log('CloudinaryUpload: Upload successful', result);
        
        if (!result || !result.secure_url) {
          throw new Error('Upload failed - no URL returned');
        }
        
        toast({
          title: "Image Uploaded",
          description: `Successfully uploaded image for ${section}`,
        });
        
        onUploadComplete(result.secure_url);
      }
    } catch (error) {
      console.error('CloudinaryUpload: Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image(s). Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      const fileInput = document.getElementById(uploadId) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const uploadId = `cloudinary-upload-${section}`;
  
  // Handle button click to open file selector
  const handleButtonClick = () => {
    console.log(`CloudinaryUpload: Button clicked for ${section}`);
    const fileInput = document.getElementById(uploadId) as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  return (
    <div className={className}>
      <input
        type="file"
        id={uploadId}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple={multiple}
      />
      <Button
        type="button"
        variant={buttonVariant}
        size={buttonSize}
        className="cursor-pointer"
        disabled={isUploading}
        onClick={handleButtonClick}
      >
        {isUploading ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
} 