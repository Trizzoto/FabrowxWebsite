import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Metal Fabrication Blog | Expert Tips & Industry Insights',
  description: 'Expert insights on metal fabrication, custom automotive parts, and 4WD modifications. Learn from Adelaide and Murray Bridge fabrication specialists at Elite Fabworx.',
  keywords: 'metal fabrication blog, custom exhaust tips, 4WD modification guide, TIG welding tips, automotive fabrication Adelaide',
  openGraph: {
    title: 'Metal Fabrication Blog | Expert Tips & Industry Insights',
    description: 'Expert insights on metal fabrication, custom automotive parts, and 4WD modifications. Learn from Adelaide and Murray Bridge fabrication specialists at Elite Fabworx.',
    images: ['/Elitefabworx_Social.png'],
    type: 'website',
  },
  alternates: {
    canonical: '/blog',
  },
}

const blogPosts = [
  {
    id: 1,
    title: 'What to look for in a metal fabricator in Adelaide',
    slug: 'what-to-look-for-metal-fabricator-adelaide',
    excerpt: 'Choosing the right metal fabricator is crucial for your project success. Here are the key factors Adelaide drivers should consider when selecting a fabrication specialist.',
    image: 'https://res.cloudinary.com/dxnlxp8vx/image/upload/f_auto,q_auto,dpr_auto,w_600/v1735554834/metal-fabricator-adelaide-workshop_ehkdjd.jpg',
    date: '2025-01-02',
    author: 'Elite Fabworx Team',
    category: 'Guides',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'Legal requirements for roll-cages in SA motorsport',
    slug: 'legal-requirements-roll-cages-sa-motorsport',
    excerpt: 'Understanding the legal requirements and safety standards for roll cage fabrication in South Australian motorsport, including CAMS regulations.',
    image: 'https://res.cloudinary.com/dxnlxp8vx/image/upload/f_auto,q_auto,dpr_auto,w_600/v1735554834/roll-cage-fabrication-adelaide_sjdhka.jpg',
    date: '2025-01-01',
    author: 'Elite Fabworx Team',
    category: 'Safety',
    readTime: '8 min read'
  },
  {
    id: 3,
    title: 'Strengthening your 79 Series chassis for outback touring',
    slug: 'strengthening-79-series-chassis-outback-touring',
    excerpt: 'Essential modifications and reinforcement techniques for Toyota 79 Series chassis to handle the demands of serious outback touring in South Australia.',
    image: 'https://res.cloudinary.com/dxnlxp8vx/image/upload/f_auto,q_auto,dpr_auto,w_600/v1735554834/79-series-chassis-modification_kjdhsa.jpg',
    date: '2024-12-30',
    author: 'Elite Fabworx Team',
    category: '4WD',
    readTime: '10 min read'
  },
  {
    id: 4,
    title: 'Stainless vs mild-steel exhausts: which lasts longer on SA roads?',
    slug: 'stainless-vs-mild-steel-exhausts-sa-roads',
    excerpt: 'Comparing stainless steel and mild steel exhaust systems for South Australian driving conditions, including coastal, urban, and outback environments.',
    image: 'https://res.cloudinary.com/dxnlxp8vx/image/upload/f_auto,q_auto,dpr_auto,w_600/v1735554834/exhaust-comparison-adelaide_jhdjks.jpg',
    date: '2024-12-28',
    author: 'Elite Fabworx Team',
    category: 'Exhaust Systems',
    readTime: '6 min read'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Metal Fabrication <span className="text-red-500">Blog</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expert insights, tips, and guides from our Adelaide and Murray Bridge fabrication specialists. 
              Learn about custom automotive parts, 4WD modifications, and industry best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-400 text-sm">{blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-red-500">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-300 mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href={`/blog/${blogPosts[0].slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-red-400">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need Custom Metal Fabrication?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our Adelaide and Murray Bridge team is ready to help with your project. 
            From custom exhausts to roll cages, we deliver quality fabrication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/contact">Get Your Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-red-500 text-red-400 hover:bg-red-950/50">
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 