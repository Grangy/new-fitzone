import HeroSection from '../components/HeroSection'
import AdvantagesSection from '../components/AdvantagesSection'
import DirectionsSection from '../components/DirectionsSection'
import SocialProofSection from '../components/SocialProofSection'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen prevent-overflow">
      <HeroSection />
      <AdvantagesSection />
      <DirectionsSection />
      <SocialProofSection />
      <ContactForm />
      <Footer />
    </main>
  )
}