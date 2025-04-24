const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '533469477878659'

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary configuration is missing')
  }

  try {
    // Create a simple form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', CLOUDINARY_API_KEY)
    formData.append('timestamp', Math.round(new Date().getTime() / 1000).toString())
    formData.append('upload_preset', 'elite-fabworx') // Use an unsigned upload preset

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
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
  }

  const finalOptions = { ...defaultOptions, ...options }
  const transformations = Object.entries(finalOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',')

  return `https://res.cloudinary.com/${
    CLOUDINARY_CLOUD_NAME
  }/image/upload/${transformations}/${publicId}`
}

export async function uploadImage(file: File, section: string = 'general') {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is missing')
  }

  try {
    console.log('Starting upload...', { fileName: file.name, fileSize: file.size, section })

    // Create a simple form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'elite-fabworx') // Use an unsigned upload preset 
    formData.append('folder', `elite-fabworx/${section}`)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      console.error('Upload failed with status:', response.status)
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`Upload failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('Upload successful:', data)
    return data
  } catch (error) {
    console.error('Error uploading:', error)
    throw error
  }
} 