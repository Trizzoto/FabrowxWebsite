import { Metadata } from 'next'
import { MurrayBridgeContent } from './murray-bridge-content'

export const metadata: Metadata = {
  title: 'Metal Fabrication Murray Bridge | Local Custom Automotive Fabrication',
  description: 'Professional metal fabrication in Murray Bridge. Custom exhausts, roll cages, 4WD accessories & expert TIG welding. Local workshop servicing Murray Bridge & surrounds. Book today!',
  keywords: 'metal fabrication Murray Bridge, custom exhaust Murray Bridge, roll cage fabrication Murray Bridge, 4x4 fabrication Murray Bridge, TIG welding Murray Bridge, automotive fabrication Murray Bridge, local metal fabrication',
  openGraph: {
    title: 'Metal Fabrication Murray Bridge | Local Custom Automotive Fabrication',
    description: 'Professional metal fabrication in Murray Bridge. Custom exhausts, roll cages, 4WD accessories & expert TIG welding. Local workshop servicing Murray Bridge & surrounds. Book today!',
    images: ['/Elitefabworx_Social.png'],
    type: 'website',
  },
  alternates: {
    canonical: '/metal-fabrication-murray-bridge',
  },
}

export default function MetalFabricationMurrayBridgePage() {
  return <MurrayBridgeContent />
} 