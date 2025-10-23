export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container px-4 py-8">
        {/* Hero Section Skeleton */}
        <div className="relative h-64 md:h-96 bg-zinc-900 rounded-lg overflow-hidden mb-8 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900"></div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 h-12 bg-zinc-900 rounded-lg animate-pulse"></div>
          <div className="h-12 w-32 bg-zinc-900 rounded-lg animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-zinc-800"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

