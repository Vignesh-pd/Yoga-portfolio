import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { X, Play } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { GalleryItem as GalleryItemType } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  showAll?: boolean
}

export default function GallerySection({ showAll = false }: Props) {
  const navigate = useNavigate()
  const { photos, videos } = useData()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  const [lightbox, setLightbox] = useState({ open: false, index: 0 })

  // ✅ Build items safely
  const allItems: (GalleryItemType & { type: 'photo' | 'video' })[] = [
    ...photos.map((p) => ({
      ...p,
      type: 'photo' as const,
      url: p.public_url,
    })),
    ...videos.map((v) => ({
      ...v,
      type: 'video' as const,
      url: v.public_url,
      poster_url: v.poster_url,
      duration: v.duration,
    })),
  ]

  const displayItems = showAll ? allItems : allItems.slice(0, 9)

  // =========================
  // Lightbox
  // =========================
  const openLightbox = (index: number) => {
    setLightbox({ open: true, index })
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 })
    document.body.style.overflow = ''
  }

  const goNext = useCallback(() => {
    setLightbox((p) => ({
      ...p,
      index: (p.index + 1) % displayItems.length,
    }))
  }, [displayItems.length])

  const goPrev = useCallback(() => {
    setLightbox((p) => ({
      ...p,
      index: (p.index - 1 + displayItems.length) % displayItems.length,
    }))
  }, [displayItems.length])

  // Keyboard support
  useEffect(() => {
    if (!lightbox.open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox.open, goNext, goPrev])

  // =========================
  // ✅ SAFE GSAP ANIMATION
  // =========================
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      try {
        const label = section.querySelector('.gallery-label')
        const title = section.querySelector('.gallery-title')
        const items = section.querySelectorAll('.gallery-item')

        // 🔥 SAFE ELEMENT HANDLING
        const elements = [label, title, ...Array.from(items)].filter(Boolean)

        if (elements.length > 0) {
          gsap.set(elements, { opacity: 1, y: 0 })
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        })

        if (label) {
          tl.fromTo(
            label,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 }
          )
        }

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7 },
            '-=0.3'
          )
        }

        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power2.out',
            },
            '-=0.3'
          )
        }
      } catch (err) {
        console.error('GSAP Error:', err)
      }
    }, section)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [displayItems])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="bg-cream-50"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      <div className="section-container">

        {/* Label */}
        <p className="gallery-label mb-6" style={{ color: 'var(--gold-600)' }}>
          GALLERY
        </p>

        {/* Title */}
        <h2
          className="gallery-title mb-8"
          style={{
            color: 'var(--navy-900)',
            fontSize: isMobile ? '40px' : '80px',
          }}
        >
          My Yoga Journey
        </h2>

        {/* Grid */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {displayItems.map((item, idx) => (
            <div
              key={`${item.type}-${item.id}`}
              className="gallery-item group relative overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: item.type === 'video' ? '16/10' : '4/5' }}
              >
                <img
                  src={item.type === 'video' ? (item.poster_url || item.url) : item.url}
                  alt={item.caption || ''}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  {item.type === 'video' ? (
                    <Play size={20} />
                  ) : (
                    <span>View</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {!showAll && (
          <div className="mt-12 flex justify-center gap-6">
  {/* Photos */}
  <button
    onClick={() => navigate('/photos')}
    className="px-7 py-3.5 rounded-full font-medium transition-all duration-300"
    style={{
      background: 'var(--navy-900)',
      color: 'var(--cream-50)',
      boxShadow: '0 8px 24px rgba(15,29,50,0.18)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,29,50,0.25)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,29,50,0.18)'
    }}
  >
    View Photos
  </button>

  {/* Videos */}
  <button
    onClick={() => navigate('/videos')}
    className="px-7 py-3.5 rounded-full font-medium transition-all duration-300"
    style={{
      background: 'transparent',
      color: 'var(--navy-900)',
      border: '1px solid var(--navy-300)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'var(--navy-900)'
      e.currentTarget.style.color = 'var(--cream-50)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent'
      e.currentTarget.style.color = 'var(--navy-900)'
    }}
  >
    View Videos
  </button>
</div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && displayItems.length > 0 && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 z-[201]"
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
          >
            <X size={28} />
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            {displayItems[lightbox.index].type === 'video' ? (
              <video
                className="max-w-[90vw] max-h-[80vh] rounded-xl"
                autoPlay
                controls
                src={displayItems[lightbox.index].url}
              />
            ) : (
              <img
                className="max-w-[90vw] max-h-[80vh] rounded-xl"
                src={displayItems[lightbox.index].url}
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}