const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary')
  }

  const data = await response.json()
  return data.secure_url
}

export function getCloudinaryPublicId(url: string): string {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('.')[0]
}

export function generateCloudinaryUrl(publicId: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: string
} = {}): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is missing')
  }

  const transformations = []

  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  
  const format = options.format || 'auto'
  transformations.push(`f_${format}`)

  const transformationString = transformations.length > 0 
    ? transformations.join(',') + '/'
    : ''

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`
}

export const getCloudinaryUrl = (publicId: string, options: Record<string, any> = {}) => {
  const defaultOptions = {
    width: 800,
    quality: 'auto',
    format: 'auto',
  };

  const finalOptions = { ...defaultOptions, ...options };
  const transformations = Object.entries(finalOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `https://res.cloudinary.com/${
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }/image/upload/${transformations}/${publicId}`;
};

export const uploadImage = async (file: File, section: string = 'hero') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('section', section);

  try {
    console.log('Starting upload...', { fileName: file.name, fileSize: file.size, section });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error uploading:', error);
    throw error;
  }
}; 