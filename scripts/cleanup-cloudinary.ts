import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

interface CloudinaryResource {
  public_id: string;
  created_at: string;
  bytes: number;
  format: string;
  sha1: string;
}

interface DuplicateItem {
  public_id: string;
  created_at: string;
  bytes: number;
  format: string;
}

async function getGalleryData(): Promise<GalleryImage[]> {
  const dataFilePath = path.join(process.cwd(), 'app/data/gallery.json');
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

async function cleanupCloudinary() {
  try {
    console.log('Starting Cloudinary cleanup...');

    // Get all resources from Cloudinary
    const { resources } = await cloudinary.search
      .expression('folder:elite-fabworx/*')
      .execute();

    // Get gallery data to know which images are in use
    const galleryImages = await getGalleryData();
    const activePublicIds = new Set(
      galleryImages.map(img => {
        const matches = img.url.match(/\/upload\/.*?\/([^/]+)$/);
        return matches ? matches[1] : '';
      })
    );

    // Group resources by their SHA-1 hash to find duplicates
    const hashMap = new Map<string, DuplicateItem[]>();
    (resources as CloudinaryResource[]).forEach(resource => {
      const { bytes, format, public_id, created_at, sha1 } = resource;
      if (!hashMap.has(sha1)) {
        hashMap.set(sha1, []);
      }
      hashMap.get(sha1)?.push({ public_id, created_at, bytes, format });
    });

    // Process duplicates
    let totalDuplicates = 0;
    let totalBytesFreed = 0;

    for (const [sha1, items] of hashMap.entries()) {
      if (items.length > 1) {
        // Sort by creation date, keep the newest one
        items.sort((a: DuplicateItem, b: DuplicateItem) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Keep the first one (newest) if it's in use, otherwise keep the one that's in use
        const keepIndex = items.findIndex((item: DuplicateItem) => 
          activePublicIds.has(item.public_id)
        );
        const itemsToDelete = keepIndex === -1 ? 
          items.slice(1) : 
          items.filter((_: DuplicateItem, index: number) => index !== keepIndex);

        console.log(`\nFound ${items.length} duplicates with SHA1: ${sha1}`);
        console.log(`Keeping: ${items[keepIndex === -1 ? 0 : keepIndex].public_id}`);

        // Delete duplicates
        for (const item of itemsToDelete) {
          try {
            console.log(`Deleting: ${item.public_id}`);
            await cloudinary.uploader.destroy(item.public_id);
            totalDuplicates++;
            totalBytesFreed += item.bytes;
          } catch (error) {
            console.error(`Failed to delete ${item.public_id}:`, error);
          }
        }
      }
    }

    console.log('\nCleanup Summary:');
    console.log(`Total duplicates removed: ${totalDuplicates}`);
    console.log(`Total space freed: ${(totalBytesFreed / 1024 / 1024).toFixed(2)} MB`);

  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupCloudinary(); 