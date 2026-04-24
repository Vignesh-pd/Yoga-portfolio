import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import HeroSection from '@/sections/HeroSection'
import ServicesSection from '@/sections/ServicesSection'
import GallerySection from '@/sections/GallerySection'
import AboutSection from '@/sections/AboutSection'
import CertificationsSection from '@/sections/CertificationsSection'
import ContactSection from '@/sections/ContactSection'

export default function Home() {
  useEffect(() => {
    document.title = 'Vignesh Yoga | Strength · Balance · Soul'
  }, [])

  return (
    <div className="relative">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <AboutSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
    </div>
  )
}
