import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './button';
import { uploadImage } from '@/lib/cloudinary';

interface CloudinaryUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  className?: string;
  section?: string;
}

export function CloudinaryUpload({ onUploadComplete, className = '', section = 'hero' }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file, section);
      onUploadComplete(result.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadId = `cloudinary-upload-${section}`;

  return (
    <div className={className}>
      <input
        type="file"
        id={uploadId}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor={uploadId}>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span>
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </Button>
      </label>
    </div>
  );
} 