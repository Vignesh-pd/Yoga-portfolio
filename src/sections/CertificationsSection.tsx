import { useState, useEffect, useRef } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const certificates = [
  {
    id: 1,
    title: '200 Hours Certification',
    image: '/assets/certificates/200-hour.png',
  },
  {
    id: 2,
    title: '300 Hours Certification',
    image: '/assets/certificates/300-hour.png',
  },
]

export default function CertificatesSection() {
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedCert, setSelectedCert] = useState<string | null>(null)

  // Animation (stable, no flicker)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const label = section.querySelector('.cert-label')
      const title = section.querySelector('.cert-title')
      const cards = section.querySelectorAll('.cert-card')

      if (label) {
        gsap.from(label, {
          opacity: 0,
          y: 15,
          duration: 0.6,
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        })
      }

      if (title) {
        gsap.from(title, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        })
      }

      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: { trigger: cards[0], start: 'top 88%', once: true },
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="bg-cream-100"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      <div className="section-container">
        {/* Label */}
        <p
          className="cert-label font-mono-label text-center mb-6"
          style={{ color: 'var(--gold-600)' }}
        >
          CERTIFICATIONS
        </p>

        {/* Title */}
        <h2
          className="cert-title font-display text-center mb-12"
          style={{
            color: 'var(--navy-900)',
            fontSize: isMobile ? '40px' : '72px',
            lineHeight: isMobile ? '44px' : '72px',
          }}
        >
          My Credentials
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert.image)}
              className="cert-card group cursor-pointer p-10 rounded-2xl text-center transition-all duration-300"
              style={{
                background: 'var(--cream-50)',
                border: '1px solid var(--cream-300)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = 'var(--gold-400)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'var(--cream-300)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(201,169,110,0.12)',
                  color: 'var(--gold-600)',
                }}
              >
                🎓
              </div>

              {/* Title */}
              <p
                className="font-display"
                style={{
                  color: 'var(--navy-900)',
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                {cert.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ background: 'rgba(15,29,50,0.94)' }}
          onClick={() => setSelectedCert(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-xl opacity-70 hover:opacity-100"
            onClick={() => setSelectedCert(null)}
          >
            ✕
          </button>

          <img
            src={selectedCert}
            alt="Certificate"
            className="max-w-[90vw] max-h-[85vh] rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}