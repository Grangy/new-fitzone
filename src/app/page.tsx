import dynamic from 'next/dynamic'
import HeroSection from '../components/HeroSection'
import Header from '../components/Header'
import { ClubProvider } from '../contexts/ClubContext'

// Lazy load non-critical components
const PromoBanner = dynamic(() => import('../components/PromoBanner'), { ssr: true })
const AboutUsSection = dynamic(() => import('../components/AboutUsSection'), { ssr: true })
const DirectionsSection = dynamic(() => import('../components/DirectionsSection'), { ssr: true })
const SubscriptionsSection = dynamic(() => import('../components/SubscriptionsSection'), { ssr: true })
const ReviewsSection = dynamic(() => import('../components/ReviewsSection'), { ssr: true })
const ContactForm = dynamic(() => import('../components/ContactForm'), { ssr: true })
const Footer = dynamic(() => import('../components/Footer'), { ssr: true })

export default function Home() {
  return (
    <ClubProvider>
      <Header />
      <main className="min-h-screen prevent-overflow">
        <HeroSection />
        <PromoBanner />
        <DirectionsSection />
        <SubscriptionsSection />
        <ReviewsSection />
        <ContactForm />
        <AboutUsSection />
        <Footer />
      </main>
    </ClubProvider>
  )
}