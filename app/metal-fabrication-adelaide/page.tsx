import { Metadata } from 'next'
import { AdelaideContent } from './adelaide-content'

export const metadata: Metadata = {
  title: 'Metal Fabrication Adelaide | Custom 4WD & Automotive Fabrication',
  description: 'Expert metal fabrication services in Adelaide. Custom exhausts, roll cages, 4WD accessories & TIG welding. Based in Murray Bridge, servicing all Adelaide metro. Get a quote today!',
  keywords: 'metal fabrication Adelaide, custom exhaust Adelaide, roll cage fabrication Adelaide, 4x4 fabrication Adelaide, TIG welding Adelaide, automotive fabrication Adelaide, motorsport fabrication Adelaide',
  openGraph: {
    title: 'Metal Fabrication Adelaide | Custom 4WD & Automotive Fabrication',
    description: 'Expert metal fabrication services in Adelaide. Custom exhausts, roll cages, 4WD accessories & TIG welding. Based in Murray Bridge, servicing all Adelaide metro. Get a quote today!',
    images: ['/Elitefabworx_Social.png'],
    type: 'website',
  },
  alternates: {
    canonical: '/metal-fabrication-adelaide',
  },
}

export default function MetalFabricationAdelaidePage() {
  return <AdelaideContent />
} 