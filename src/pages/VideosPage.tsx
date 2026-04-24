import { useData } from '@/context/DataContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import gsap from 'gsap'

export default function VideosPage() {
  const { videos } = useData()
  const navigate = useNavigate()

  useEffect(() => {
    gsap.from('.page-title', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [])

  return (
    <div className="min-h-screen bg-cream-50">

      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-6"
        style={{
          background: 'linear-gradient(180deg, #f8f5f0 0%, #fdfbf7 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >

        {/* LEFT — Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="assets/logo.png" className="w-11 h-11 rounded-xl" />
          <span
            style={{
              fontSize: '22px',
              color: 'var(--navy-900)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.5px',
            }}
          >
            Vignesh Yoga
          </span>
        </div>

        {/* RIGHT — Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/photos')}
            className="px-6 py-2.5 rounded-full transition-all duration-300"
            style={{
              border: '1.5px solid var(--navy-300)',
              color: 'var(--navy-800)',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--navy-900)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--navy-800)'
            }}
          >
            Photos
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full transition-all duration-300"
            style={{
              border: '1.5px solid var(--navy-300)',
              color: 'var(--navy-800)',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--navy-900)'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--navy-800)'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* 🎨 Centered Title Section */}
      <div
        className="px-6 md:px-12 py-16 md:py-20"
        style={{
          background: 'linear-gradient(180deg, #fdfbf7 0%, rgba(253,251,247,0.5) 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.03)',
        }}
      >
        <div className="flex flex-col items-center">
          <h1
            className="page-title"
            style={{
              fontSize: '64px',
              fontFamily: 'var(--font-display)',
              color: 'var(--navy-900)',
              letterSpacing: '-1px',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Videos
          </h1>

          {/* Subtle divider */}
          <div
            className="mt-6 w-16 h-[2px]"
            style={{ backgroundColor: 'var(--gold-500)', opacity: 0.6 }}
          />
        </div>
      </div>

      {/* 🔹 Content */}
      <div className="section-container py-12 md:py-16">

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((item) => (
            <video
              key={item.id}
              src={item.public_url}
              controls
              className="w-full rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  )
}