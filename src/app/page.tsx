import HeroSection from '../components/HeroSection'
import PromoBanner from '../components/PromoBanner'
import AdvantagesSection from '../components/AdvantagesSection'
import DirectionsSection from '../components/DirectionsSection'
import IndividualTrainingsSection from '../components/IndividualTrainingsSection'
import ReviewsSection from '../components/ReviewsSection'
import ClubPhotos from '../components/ClubPhotos'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { ClubProvider } from '../contexts/ClubContext'

export default function Home() {
  return (
    <ClubProvider>
      <Header />
      <main className="min-h-screen prevent-overflow">
        <HeroSection />
        <PromoBanner />
        <AdvantagesSection />
        <DirectionsSection />
        <IndividualTrainingsSection />
        <ReviewsSection />
        <ClubPhotos />
        <ContactForm />
        <Footer />
      </main>
    </ClubProvider>
  )
}