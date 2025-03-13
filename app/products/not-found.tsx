import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-zinc-400 mb-8">
          Sorry, we couldn't find the product you're looking for. It may have been removed or doesn't exist.
        </p>
        <Button asChild>
          <Link href="/products">
            Return to Products
          </Link>
        </Button>
      </div>
    </div>
  )
} 