const { v2: cloudinary } = require('cloudinary');
const fs = require('fs').promises;
const path = require('path');

// Configure Cloudinary with known values
cloudinary.config({
  cloud_name: 'dz8iqfdvf',
  api_key: '533469477878659',
  api_secret: process.env.CLOUDINARY_API_SECRET // You'll need to provide this
});

async function getGalleryData() {
  const dataFilePath = path.join(process.cwd(), 'app/data/gallery.json');
  const data = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

async function cleanupCloudinary() {
  try {
    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error('Error: CLOUDINARY_API_SECRET environment variable is required');
      console.log('Please set it using:');
      console.log('$env:CLOUDINARY_API_SECRET="your_api_secret"  # PowerShell');
      console.log('export CLOUDINARY_API_SECRET="your_api_secret" # Bash');
      return;
    }

    console.log('Starting Cloudinary cleanup...');

    // Get all resources from Cloudinary
    const { resources } = await cloudinary.search
      .expression('folder:elite-fabworx/*')
      .execute();

    console.log(`Found ${resources.length} total images in Cloudinary`);

    // Get gallery data to know which images are in use
    const galleryImages = await getGalleryData();
    const activePublicIds = new Set(
      galleryImages.map(img => {
        const matches = img.url.match(/\/upload\/.*?\/([^/]+)$/);
        return matches ? matches[1] : '';
      })
    );

    console.log(`Found ${galleryImages.length} images in gallery.json`);
    console.log(`Found ${activePublicIds.size} unique active public IDs`);

    // Group resources by their SHA-1 hash to find duplicates
    const hashMap = new Map();
    resources.forEach(resource => {
      const { bytes, format, public_id, created_at, sha1 } = resource;
      if (!hashMap.has(sha1)) {
        hashMap.set(sha1, []);
      }
      hashMap.get(sha1).push({ public_id, created_at, bytes, format });
    });

    // Process duplicates
    let totalDuplicates = 0;
    let totalBytesFreed = 0;

    for (const [sha1, items] of hashMap.entries()) {
      if (items.length > 1) {
        // Sort by creation date, keep the newest one
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        // Keep the first one (newest) if it's in use, otherwise keep the one that's in use
        const keepIndex = items.findIndex(item => activePublicIds.has(item.public_id));
        const itemsToDelete = keepIndex === -1 ? items.slice(1) : items.filter((_, index) => index !== keepIndex);

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