import { NextResponse } from 'next/server'

// Static testimonials data from Facebook
const staticTestimonials = [
  {
    id: "1",
    name: "Guy Jackson",
    avatar: "/default-avatar.png",
    content: "Had some work done by Elite Fabworx, was prompt & aftersales service was good!",
    rating: 5,
    date: "18 September 2019",
    platform: "facebook",
    comments: 1,
    likes: 1
  },
  {
    id: "2",
    name: "Steve Rosewall",
    avatar: "/default-avatar.png",
    content: "Amazing customer service and amazing quality of work",
    rating: 5,
    date: "14 May 2019",
    platform: "facebook",
    comments: 0,
    likes: 1
  },
  {
    id: "3",
    name: "Ognjen Saran",
    avatar: "/default-avatar.png",
    content: "Good quality work with excellent custom work skills. Top quality stainless steel and aluminum welding skills. Can't speak highly enough of Steven.",
    rating: 5,
    date: "5 April 2019",
    platform: "facebook",
    comments: 1,
    likes: 2
  },
  {
    id: "4",
    name: "Kurt Keesing",
    avatar: "/default-avatar.png",
    content: "absolutely fabulous work 💯",
    rating: 5,
    date: "31 January 2019",
    platform: "facebook",
    comments: 0,
    likes: 1
  }
]

export async function GET() {
  try {
    return NextResponse.json(staticTestimonials)
  } catch (error) {
    console.error('Error serving testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to load testimonials' },
      { status: 500 }
    )
  }
} 