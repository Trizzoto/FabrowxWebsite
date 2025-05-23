import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Explicitly use the .com.au domain regardless of environment
  const baseUrl = 'https://www.elitefabworx.com.au'
  
  return [
    // Main Pages - Highest Priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    
    // Location-Specific Service Pages - Very High Priority for Local SEO
    {
      url: `${baseUrl}/metal-fabrication-adelaide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/metal-fabrication-murray-bridge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    
    // Core Service Pages - High Priority
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // Shop & E-commerce - High Priority for Sales
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    
    // Shop Categories - Targeted for Product Searches
    {
      url: `${baseUrl}/shop?category=Performance%20Parts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/shop?category=4WD%20Accessories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/shop?category=Exhaust%20Systems`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/shop?category=Custom%20Solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    
    // Content & Information Pages
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    
    // Blog Posts - SEO Content
    {
      url: `${baseUrl}/blog/what-to-look-for-metal-fabricator-adelaide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    
    // Contact & Service Pages
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/book-a-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    
    // Utility Pages - Lower Priority
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.3,
    },
    
    // Additional SEO-Targeted URLs for Better Local Search
    {
      url: `${baseUrl}/metal-fabrication-adelaide/custom-fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metal-fabrication-adelaide/exhaust-systems`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metal-fabrication-adelaide/4wd-modifications`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metal-fabrication-murray-bridge/custom-fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metal-fabrication-murray-bridge/exhaust-systems`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/metal-fabrication-murray-bridge/4wd-modifications`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Service-Specific Landing Pages for SEO
    {
      url: `${baseUrl}/services/custom-fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/services/performance-exhausts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/services/4wd-modifications`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/services/roll-cages`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/services/prototyping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    
    // Location-Based Landing Pages for Local SEO
    {
      url: `${baseUrl}/adelaide-metal-fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/murray-bridge-metal-fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/south-australia-metal-fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
} 