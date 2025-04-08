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
}

export function CloudinaryUpload({ 
  onUploadComplete, 
  className = '', 
  section = 'hero',
  buttonText = 'Upload Image',
  buttonVariant = 'outline',
  buttonSize = 'default'
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      console.log(`CloudinaryUpload: Starting upload for section "${section}"`);
      setIsUploading(true);
      
      const result = await uploadImage(file, section);
      console.log('CloudinaryUpload: Upload successful', result);
      
      if (!result || !result.secure_url) {
        throw new Error('Upload failed - no URL returned');
      }
      
      toast({
        title: "Image Uploaded",
        description: `Successfully uploaded image for ${section}`,
      });
      
      onUploadComplete(result.secure_url);
    } catch (error) {
      console.error('CloudinaryUpload: Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image. Please try again.",
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