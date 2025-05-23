import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft, CheckCircle, AlertTriangle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'What to Look for in a Metal Fabricator in Adelaide | Expert Guide',
  description: 'Essential guide to choosing the right metal fabricator in Adelaide. Learn the key factors, questions to ask, and red flags to avoid when selecting a fabrication specialist.',
  keywords: 'metal fabrication Adelaide, choosing metal fabricator Adelaide, custom exhaust Adelaide, 4WD fabrication Adelaide, TIG welding Adelaide, automotive fabrication Adelaide',
  openGraph: {
    title: 'What to Look for in a Metal Fabricator in Adelaide | Expert Guide',
    description: 'Essential guide to choosing the right metal fabricator in Adelaide. Learn the key factors, questions to ask, and red flags to avoid when selecting a fabrication specialist.',
    images: ['/Elitefabworx_Social.png'],
    type: 'article',
  },
  alternates: {
    canonical: '/blog/what-to-look-for-metal-fabricator-adelaide',
  },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Navigation */}
      <div className="container mx-auto max-w-4xl px-4 pt-8">
        <Button variant="ghost" asChild className="text-red-500 hover:text-red-400">
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
              Guides
            </span>
            <span className="text-gray-400 text-sm">5 min read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-500">
            What to Look for in a Metal Fabricator in Adelaide
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Elite Fabworx Team
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              January 2, 2025
            </div>
          </div>

          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dxnlxp8vx/image/upload/f_auto,q_auto,dpr_auto,w_800/v1735554834/metal-fabricator-adelaide-workshop_ehkdjd.jpg"
              alt="Professional metal fabrication workshop in Adelaide"
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <p className="text-xl text-gray-300 mb-8">
            Choosing the right <strong>metal fabricator in Adelaide</strong> can make the difference between a project that exceeds expectations and one that becomes a costly disappointment. Whether you need custom exhaust work, 4WD modifications, or motorsport fabrication, here's your comprehensive guide to selecting the best fabrication specialist for your needs.
          </p>

          <h2 className="text-2xl font-bold text-red-400 mb-4">Why Location Matters for Adelaide Drivers</h2>
          
          <p className="text-gray-300 mb-6">
            When searching for <strong>metal fabrication Adelaide</strong> services, proximity isn't just about convenience. Adelaide's unique driving conditions – from city commuting to Adelaide Hills adventures and trips to The Bend Motorsport Park – require fabricators who understand local needs.
          </p>

          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Pro Tip</h3>
                <p className="text-gray-300">
                  Look for fabricators who service both Adelaide metro and have experience with local motorsport venues like The Bend. They'll understand the specific requirements and conditions your vehicle will face.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-4">Essential Qualifications to Look For</h2>

          <h3 className="text-xl font-semibold text-red-300 mb-3">1. Certified Welding Expertise</h3>
          <p className="text-gray-300 mb-4">
            Quality <strong>metal fabrication in Adelaide</strong> starts with proper welding certification. Look for:
          </p>
          <ul className="list-none space-y-2 mb-6">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">TIG welding certification for precision work</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">MIG welding expertise for structural components</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">Stainless steel welding capabilities</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">Aluminium welding for lightweight applications</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-red-300 mb-3">2. Motorsport Safety Standards</h3>
          <p className="text-gray-300 mb-4">
            If you need roll cage work or motorsport modifications, ensure your Adelaide fabricator understands:
          </p>
          <ul className="list-none space-y-2 mb-6">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">CAMS (Confederation of Australian Motor Sport) regulations</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">FIA safety standards for international competition</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-gray-300">ADR (Australian Design Rules) compliance</span>
            </li>
          </ul>

          <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dxnlxp8vx/image/upload/f_auto,q_auto,dpr_auto,w_800/v1735554834/tig-welding-adelaide-workshop_kjdhsa.jpg"
              alt="Professional TIG welding in Adelaide metal fabrication workshop"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-4">Key Questions to Ask Potential Fabricators</h2>

          <h3 className="text-xl font-semibold text-red-300 mb-3">Portfolio and Experience</h3>
          <ul className="list-none space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">"Can you show me examples of similar projects you've completed for Adelaide customers?"</span>
            </li>
            <li className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">"Do you have experience with my vehicle make and model?"</span>
            </li>
            <li className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">"Have you worked on projects for The Bend Motorsport Park competitors?"</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-red-300 mb-3">Process and Timeline</h3>
          <ul className="list-none space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">"What's your typical turnaround time for projects like mine?"</span>
            </li>
            <li className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">"Do you provide progress updates during fabrication?"</span>
            </li>
            <li className="flex items-start gap-3">
              <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300">"Can you accommodate rush jobs for motorsport events?"</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-red-400 mb-4">Red Flags to Avoid</h2>

          <div className="bg-red-900/20 border border-red-800 p-6 rounded-lg mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">Warning Signs</h3>
                <ul className="space-y-2">
                  <li className="text-gray-300">• Reluctance to show previous work or customer references</li>
                  <li className="text-gray-300">• Significantly lower quotes without clear explanation</li>
                  <li className="text-gray-300">• No insurance or proper business registration</li>
                  <li className="text-gray-300">• Pressure to start immediately without proper planning</li>
                  <li className="text-gray-300">• Unclear terms regarding warranties or guarantees</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-4">Understanding Pricing in Adelaide</h2>

          <p className="text-gray-300 mb-4">
            <strong>Metal fabrication Adelaide</strong> pricing can vary significantly based on complexity, materials, and location. Here's what affects costs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-red-300 mb-3">Factors Increasing Cost</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Complex curves and bends</li>
                <li>• Premium materials (stainless steel, aluminium)</li>
                <li>• Tight deadlines</li>
                <li>• Motorsport certification requirements</li>
                <li>• Custom design work</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-400 mb-3">Cost-Saving Tips</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Flexible timing</li>
                <li>• Standard designs where possible</li>
                <li>• Bulk orders</li>
                <li>• Local fabricator (reduced transport)</li>
                <li>• Clear project specification</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-red-400 mb-4">The Adelaide Advantage</h2>

          <p className="text-gray-300 mb-6">
            Working with a local <strong>metal fabrication Adelaide</strong> specialist offers several benefits:
          </p>

          <ul className="list-none space-y-3 mb-8">
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-300">Understanding of local driving conditions and requirements</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-300">Easy access for consultations and progress checks</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-300">Reduced transport costs and logistics</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-300">Support for local motorsport community</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-300">Faster turnaround for urgent modifications</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-red-400 mb-4">Making Your Final Decision</h2>

          <p className="text-gray-300 mb-6">
            The best <strong>metal fabricator in Adelaide</strong> for your project will combine technical expertise, local knowledge, and excellent customer service. Don't just choose based on price – consider the total value including quality, timeline, and ongoing support.
          </p>

          <div className="bg-blue-900/20 border border-blue-800 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Ready to Start Your Project?</h3>
            <p className="text-gray-300 mb-4">
              At Elite Fabworx, we understand what Adelaide drivers need. From our Murray Bridge workshop, we've been serving the greater Adelaide area with <Link href="/metal-fabrication-adelaide" className="text-red-500 hover:text-red-400 underline">expert metal fabrication services</Link> including custom exhausts, roll cages, and 4WD accessories.
            </p>
            <p className="text-gray-300">
              We're just 45 minutes from Adelaide CBD and proud to support both local motorsport at The Bend and Adelaide's thriving 4WD community.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 p-8 rounded-lg mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Need Expert Metal Fabrication in Adelaide?</h3>
            <p className="text-gray-300 mb-6">
              Get a free consultation and quote for your project. We're here to help bring your vision to life with quality craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-red-500 text-red-400 hover:bg-red-950/50">
                <Link href="/metal-fabrication-adelaide">View Adelaide Services</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
              <h4 className="text-lg font-semibold text-red-400 mb-2">Legal requirements for roll-cages in SA motorsport</h4>
              <p className="text-gray-400 text-sm">Understanding CAMS regulations and safety standards for motorsport fabrication...</p>
            </Link>
            <Link href="/blog" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
              <h4 className="text-lg font-semibold text-red-400 mb-2">Strengthening your 79 Series chassis for outback touring</h4>
              <p className="text-gray-400 text-sm">Essential modifications for serious outback adventures in South Australia...</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
} 