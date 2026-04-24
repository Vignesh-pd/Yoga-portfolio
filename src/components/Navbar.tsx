import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [filled, setFilled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setFilled(window.scrollY > window.innerHeight * 0.85)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          filled
            ? 'bg-[rgba(250,248,243,0.96)] backdrop-blur-[16px] border-b border-[#E5DECF]'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{ height: filled ? '72px' : '80px' }}
      >
        <div className="section-container flex items-center justify-between h-full">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="transition-opacity duration-300 hover:opacity-85 flex-shrink-0"
          >
            <img
              src="/assets/YogaLogo.png"
              alt="Vignesh Yoga"
              className="h-10 md:h-12 w-auto rounded-md object-contain"
              style={{
                boxShadow: filled ? 'none' : '0 2px 12px rgba(0,0,0,0.2)',
                transition: 'box-shadow 0.5s ease',
              }}
            />
          </button>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium transition-colors duration-300 tracking-wide"
                  style={{
                    color: filled ? 'var(--navy-800)' : 'var(--cream-50)',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.5px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-500)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = filled ? 'var(--navy-800)' : 'var(--cream-50)')}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop CTA */}
          {!isMobile && (
            <button
              onClick={() => scrollTo('#contact')}
              className="rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
              style={{
                padding: '12px 28px',
                letterSpacing: '0.5px',
                backgroundColor: filled ? 'var(--navy-800)' : 'transparent',
                color: filled ? 'var(--cream-50)' : 'var(--cream-50)',
                border: filled ? 'none' : '1.5px solid var(--cream-50)',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                if (filled) {
                  e.currentTarget.style.backgroundColor = 'var(--navy-700)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-gold)'
                } else {
                  e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.08)'
                  e.currentTarget.style.borderColor = 'var(--gold-500)'
                  e.currentTarget.style.color = 'var(--gold-500)'
                }
              }}
              onMouseLeave={(e) => {
                if (filled) {
                  e.currentTarget.style.backgroundColor = 'var(--navy-800)'
                  e.currentTarget.style.boxShadow = 'none'
                } else {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--cream-50)'
                  e.currentTarget.style.color = 'var(--cream-50)'
                }
              }}
            >
              Book a Session
            </button>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2"
              style={{ color: filled ? 'var(--navy-800)' : 'var(--cream-50)' }}
            >
              <Menu size={24} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: 'var(--cream-100)' }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 p-2"
            style={{ color: 'var(--navy-800)' }}
          >
            <X size={28} />
          </button>

          <img
            src="/assets/YogaLogo.png"
            alt="Vignesh Yoga"
            className="h-16 w-auto object-contain mb-4"
          />

          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-display transition-all duration-300 hover:text-[var(--gold-500)]"
              style={{
                color: 'var(--navy-800)',
                fontSize: '32px',
                lineHeight: '36px',
                letterSpacing: '-0.5px',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="btn-navy mt-4"
          >
            Book a Session
          </button>
        </div>
      )}
    </>
  )
}
