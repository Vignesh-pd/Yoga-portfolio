import { useState, useEffect, useRef } from 'react'
import { useData } from '@/context/DataContext'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

export default function PhotosPage() {
  const { photos } = useData()
  const navigate = useNavigate()

  const [visible, setVisible] = useState(6)
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const visibleItems = photos.slice(0, visible)

  // 🔓 Lightbox controls
  const openLightbox = (index: number) => {
    setLightbox({ open: true, index })
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 })
    document.body.style.overflow = ''
  }

  const next = () => {
    setLightbox((p) => ({
      ...p,
      index: (p.index + 1) % photos.length,
    }))
  }

  const prev = () => {
    setLightbox((p) => ({
      ...p,
      index: (p.index - 1 + photos.length) % photos.length,
    }))
  }

  // ⌨️ Keyboard navigation
  useEffect(() => {
    if (!lightbox.open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox.open])

  // 📱 Swipe support
  useEffect(() => {
    if (!lightbox.open) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX
      const diff = touchStartX.current - touchEndX.current

      if (diff > 50) next()
      if (diff < -50) prev()
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [lightbox.open])

  // 🎬 Animation
  useEffect(() => {
    if (!lightbox.open) return

    gsap.fromTo(
      '.lightbox-img',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4 }
    )
  }, [lightbox.open])

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
            onClick={() => navigate('/videos')}
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
            Videos
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
            Photos
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

        {/* 🧱 Masonry */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {visibleItems.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <div className="relative">
                <img
                  src={item.public_url}
                  loading="lazy"
                  className="w-full rounded-xl mb-4 transition-all duration-700 
                             blur-sm scale-105 opacity-80
                             group-hover:scale-[1.03] group-hover:shadow-xl"
                  onLoad={(e) => {
                    e.currentTarget.classList.remove('blur-sm', 'scale-105', 'opacity-80')
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                  <span className="text-white">View</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 📦 Load more */}
        {visible < photos.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + 6)}
              className="px-6 py-3 rounded-full border"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* 🔥 LIGHTBOX */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button className="absolute top-6 right-6 text-white text-2xl" onClick={closeLightbox}>
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 text-white text-sm">
            {lightbox.index + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-6 text-white text-4xl"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={photos[lightbox.index].public_url}
            className="lightbox-img max-h-[80vh] max-w-[90vw] rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="absolute right-6 text-white text-4xl"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            ›
          </button>

          {/* Caption */}
          {photos[lightbox.index].caption && (
            <p className="absolute bottom-10 text-white text-sm text-center px-6">
              {photos[lightbox.index].caption}
            </p>
          )}
        </div>
      )}
    </div>
  )
}