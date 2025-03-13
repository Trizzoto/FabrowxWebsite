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