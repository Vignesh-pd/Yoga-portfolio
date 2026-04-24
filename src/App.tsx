import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { DataProvider } from '@/context/DataContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import HeroSection from '@/sections/HeroSection'
import ServicesSection from '@/sections/ServicesSection'
import GallerySection from '@/sections/GallerySection'
import SessionFlowSection from '@/sections/SessionFlowSection'
import AboutSection from '@/sections/AboutSection'
import CertificationsSection from '@/sections/CertificationsSection'
import ContactSection from '@/sections/ContactSection'
import AdminLogin from '@/admin/AdminLogin'
import AdminDashboard from '@/admin/AdminDashboard'
import AdminLayout from '@/admin/AdminLayout'
import ProtectedRoute from '@/admin/ProtectedRoute'
import PhotosPage from '@/pages/PhotosPage'
import VideosPage from '@/pages/VideosPage'
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function Home() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <SessionFlowSection />
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

function App() {

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 300)
    }

    window.addEventListener('load', handleLoad)

    return () => window.removeEventListener('load', handleLoad)
  }, [])

  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="photos" element={<AdminDashboard />} />
            <Route path="videos" element={<AdminDashboard />} />
            <Route path="certificates" element={<AdminDashboard />} />
            <Route path="about" element={<AdminDashboard />} />
            <Route path="contact" element={<AdminDashboard />} />
            <Route path="services" element={<AdminDashboard />} />
            <Route path="messages" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1A2E4D',
              borderRadius: '8px',
              boxShadow: '0 12px 40px rgba(15,29,50,0.12)',
            },
          }}
        />
      </DataProvider>
    </AuthProvider>
  )
}


export default App
