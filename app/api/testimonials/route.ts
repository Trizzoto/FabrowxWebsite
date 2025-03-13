import { NextResponse } from 'next/server'

// Static testimonials data
const staticTestimonials = [
  {
    name: "John Smith",
    avatar: "/default-avatar.png",
    content: "Elite FabWorx did an amazing job on my 4WD build. The quality of work is outstanding and their attention to detail is second to none.",
    rating: 5,
    date: "2024-02-15"
  },
  {
    name: "Sarah Johnson",
    avatar: "/default-avatar.png",
    content: "Fantastic custom fabrication work on my vehicle. The team was professional, knowledgeable, and delivered exactly what I wanted.",
    rating: 5,
    date: "2024-02-10"
  },
  {
    name: "Mike Thompson",
    avatar: "/default-avatar.png",
    content: "Great experience working with Elite FabWorx. They helped me design and build custom parts for my truck. Highly recommended!",
    rating: 5,
    date: "2024-02-05"
  }
]

export async function GET() {
  try {
    // Return static testimonials for now
    // We can switch to Facebook integration later when we have access
    return NextResponse.json(staticTestimonials)
  } catch (error) {
    console.error('Error serving testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to load testimonials', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 