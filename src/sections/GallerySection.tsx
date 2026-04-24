import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { GalleryItem as GalleryItemType } from '@/types/database'

gsap.registerPlugin(ScrollTrigger)

type CategoryFilter = 'all' | 'yoga' | 'strength' | 'lifestyle'

type Props = {
  initialFilter?: 'all' | 'photo' | 'video'
  showAll?: boolean
}

export default function GallerySection({ showAll = false }: Props) {
  const navigate = useNavigate()
  const { photos, videos } = useData()
  const isMobile = useIsMobile()
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  // Build gallery items with categories
  const allItems: (GalleryItemType & { category: CategoryFilter })[] = [
    ...photos.map((p, i) => ({
      ...p, type: 'photo' as const, url: p.public_url,
      category: (['yoga','yoga','yoga','lifestyle','yoga','yoga','yoga','yoga','lifestyle'][i] || 'yoga') as CategoryFilter,
    })),
    ...videos.map((v, i) => ({
      ...v, type: 'video' as const, url: v.public_url,
      poster_url: v.poster_url, duration: v.duration,
      category: (['yoga','yoga','yoga','yoga','lifestyle'][i] || 'yoga') as CategoryFilter,
    })),
  ]

  const displayItems = showAll ? allItems : allItems.slice(0, 9)

  const openLightbox = (index: number) => {
    setLightbox({ open: true, index })
    document.body.style.overflow = 'hidden'
  }
  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 })
    document.body.style.overflow = ''
  }
  const goNext = useCallback(() => {
    setLightbox(p => ({ ...p, index: (p.index + 1) % displayItems.length }))
  }, [displayItems.length])
  const goPrev = useCallback(() => {
    setLightbox(p => ({ ...p, index: (p.index - 1 + displayItems.length) % displayItems.length }))
  }, [displayItems.length])

  // Keyboard nav
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

  // Scroll animations
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Refresh ScrollTrigger
        ScrollTrigger.refresh()

        const label = section.querySelector('.gallery-label')
        if (label) {
          gsap.from(label, {
            opacity: 0, y: 15, duration: 0.6,
            scrollTrigger: { trigger: section, start: 'top 88%' },
          })
        }

        const title = section.querySelector('.gallery-title')
        if (title) {
          gsap.from(title, {
            opacity: 0, y: 50, duration: 0.9,
            scrollTrigger: { trigger: section, start: 'top 88%' },
          })
        }

        const items = section.querySelectorAll('.gallery-item')
        if (items.length > 0) {
          gsap.from(items, {
            opacity: 0, y: 50, scale: 1.02, duration: 0.8, stagger: 0.08,
            scrollTrigger: { trigger: items[0], start: 'top 88%' },
          })
        }
      }, section)

      return () => ctx.revert()
    }, 100)

    return () => clearTimeout(timeout)
  }, [displayItems])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="bg-cream-50"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      <div className="section-container">
        <p className="gallery-label font-mono-label mb-6" style={{ opacity: 1, color: 'var(--gold-600)' }}>
          GALLERY
        </p>

        {/* Title */}
        <h2
          className="gallery-title font-display mb-8"
          style={{
            opacity: 1,
            color: 'var(--navy-900)',
            fontSize: isMobile ? '40px' : '80px',
            lineHeight: isMobile ? '44px' : '80px',
            letterSpacing: isMobile ? '-0.8px' : '-1.6px',
          }}
        >
          My Yoga Journey
        </h2>



        {/* Gallery Grid */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {displayItems.map((item, idx) => (
            <div
              key={`${item.type}-${item.id}`}
              className="gallery-item group relative overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: item.type === 'video' ? '16/10' : '4/5' }}>
                <img
                  src={item.type === 'video' ? (item.poster_url || item.url) : item.url}
                  alt={item.caption || 'Yoga'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: 'rgba(15,29,50,0.45)' }}
                >
                  {item.type === 'video' ? (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--gold-500)' }}
                    >
                      <Play size={18} fill="var(--navy-950)" style={{ color: 'var(--navy-950)', marginLeft: '2px' }} />
                    </div>
                  ) : (
                    <span
                      className="font-display italic text-lg"
                      style={{ color: 'var(--cream-50)' }}
                    >
                      View
                    </span>
                  )}
                </div>

                {/* Duration badge */}
                {item.type === 'video' && item.duration && (
                  <div
                    className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ backgroundColor: 'rgba(15,29,50,0.75)', color: 'var(--cream-50)', fontFamily: 'var(--font-mono)' }}
                  >
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Caption */}
              {item.caption && (
                <p
                  className="mt-3 text-sm truncate px-1"
                  style={{ color: 'var(--navy-600)', fontFamily: 'var(--font-body)' }}
                >
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation (Dashboard → Full pages) */}
      {!showAll && (
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate('/photos')}
            className="px-6 py-3 rounded-full bg-navy-900 text-white hover:opacity-90 transition"
          >
            View Photos
          </button>

          <button
            onClick={() => navigate('/videos')}
            className="px-6 py-3 rounded-full bg-navy-900 text-white hover:opacity-90 transition"
          >
            View Videos
          </button>
        </div>
      )}

      {/* Lightbox */}
{lightbox.open && displayItems.length > 0 && (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center"  // ← change z-[80] to z-[200]
    style={{ backgroundColor: 'rgba(15,29,50,0.94)' }}
    onClick={closeLightbox}
  >
    <button
      className="absolute top-6 right-6 transition-opacity duration-200 hover:opacity-100 z-[201]"  // ← change z-10 to z-[201]
      style={{ color: 'var(--cream-100)', opacity: 0.6 }}
      onClick={(e) => {
        e.stopPropagation()   // ← add this line
        closeLightbox()
      }}
    >
      <X size={28} />
    </button>

          {displayItems.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 transition-opacity duration-200 hover:opacity-100 z-10"
                style={{ color: 'var(--cream-100)', opacity: 0.5 }}
                onClick={(e) => { e.stopPropagation(); goPrev() }}
              >
                <ChevronLeft size={36} />
              </button>
              <button
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 transition-opacity duration-200 hover:opacity-100 z-10"
                style={{ color: 'var(--cream-100)', opacity: 0.5 }}
                onClick={(e) => { e.stopPropagation(); goNext() }}
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}

          <div
            className="max-w-[88vw] max-h-[84vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {displayItems[lightbox.index].type === 'video' ? (
              <video
                key={displayItems[lightbox.index].id}
                className="max-w-full max-h-[72vh] rounded-xl"
                autoPlay
                controls
                src={displayItems[lightbox.index].url}
                poster={displayItems[lightbox.index].poster_url || undefined}
              />
            ) : (
              <img
                key={displayItems[lightbox.index].id}
                src={displayItems[lightbox.index].url}
                alt={displayItems[lightbox.index].caption || ''}
                className="max-w-full max-h-[72vh] object-contain rounded-xl"
              />
            )}
            {displayItems[lightbox.index].caption && (
              <p
                className="mt-4 text-center font-display italic"
                style={{ color: 'var(--cream-200)', fontSize: '16px' }}
              >
                {displayItems[lightbox.index].caption}
              </p>
            )}
            <p className="mt-2 font-mono-label" style={{ color: 'var(--navy-400)', fontSize: '11px', letterSpacing: '2px' }}>
              {lightbox.index + 1} / {displayItems.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
