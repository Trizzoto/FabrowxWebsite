import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-orange-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        
        <p className="text-zinc-300 mb-8">
          Your message has been successfully sent. We'll get back to you as soon as possible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white">
              Return to Home
            </Button>
          </Link>
          
          <Link href="/shop">
            <Button variant="outline" className="w-full sm:w-auto border-orange-600/50 text-orange-300 hover:bg-orange-600/10">
              Browse Our Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 