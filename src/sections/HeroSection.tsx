import { useEffect, useRef, useState } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [muted, setMuted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

 useEffect(() => {
  if (videoRef.current) {
    videoRef.current.volume = 0.2 // 🔊 low volume
  }
}, [])

  /* ── Scroll parallax ── */
  useEffect(() => {
  const onScroll = () => {
    if (!videoRef.current || !contentRef.current) return

    const s = window.scrollY
    const vh = window.innerHeight
    const p = Math.min(s / vh, 1)

    // Smooth video movement
    videoRef.current.style.transform = `scale(1.05) translateY(${p * 40}px)`

    // Keep content ALWAYS visible
    contentRef.current.style.opacity = String(Math.max(0.7, 1 - p * 0.4))

    // Subtle movement
    contentRef.current.style.transform = `translateY(${p * 20}px)`
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: '100svh', minHeight: '600px' }}
      >
        {/* ── Background Video ── */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
  transform: 'scale(1.02)',
  filter: 'brightness(1.02) contrast(1.03)'
}}
          autoPlay
          muted={muted}
          loop
          playsInline
          poster="/assets/photos/photo9.jpg"
        >
          <source src="/assets/videos/video8.mp4" type="video/mp4" />
        </video>

        {/* ── Mobile fallback image ── */}
        {isMobile && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/photos/photo9.jpg)' }}
          />
        )}

        {/* ── Dark Overlay ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
       style={{
  background: 'linear-gradient(180deg, rgba(15,29,50,0.2) 0%, rgba(15,29,50,0.3) 50%, rgba(15,29,50,0.5) 100%)'
}}      />

     

        {/* ── Content ── */}
        <div
  ref={contentRef}
  className="relative z-10 flex flex-col items-center text-center px-6 max-w-[680px]"
  style={{ opacity: 1 }}
>
          {/* Logo */}
          <div ref={logoRef}>
            <img
              src="/assets/YogaLogo.png"
              alt="Vignesh Yoga"
              className="mx-auto w-auto rounded-xl"
              style={{
                maxWidth: isMobile ? '180px' : '260px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              }}
            />
          </div>

          {/* Tagline */}
          <div ref={taglineRef} className="mt-8 md:mt-10 flex items-center justify-center gap-2 md:gap-3">
            {['Strength', 'Balance', 'Soul'].map((w, i) => (
              <span key={w} className="flex items-center gap-2 md:gap-3">
                <span
                  className="word font-display text-white"
                  style={{
                    fontSize: isMobile ? '32px' : '52px',
                    lineHeight: '1.1',
                    letterSpacing: '-0.5px',
                    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {w}
                </span>
                {i < 2 && (
                  <span
                    className="word"
                    style={{ color: 'var(--gold-500)', fontSize: '14px', lineHeight: 1 }}
                  >
                    &#9670;
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Subtitle */}
          <p
            className="hero-subtitle mt-5 md:mt-6 text-white mx-auto"
            style={{
              fontSize: isMobile ? '14px' : '16px',
              lineHeight: '26px',
              opacity: 0.7,
              fontFamily: 'var(--font-body)',
              maxWidth: '420px',
              letterSpacing: '0.3px',
            }}
          >
            Yoga training for body, mind &amp; spirit — guiding you toward inner peace
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className={`mt-8 md:mt-10 flex gap-3 ${isMobile ? 'flex-col w-full max-w-[260px]' : 'flex-row'}`}>
            <button onClick={scrollToContact} className="cta-btn btn-gold" style={{ padding: '14px 28px', fontSize: '13px' }}>
              Book a Session
            </button>
            <button onClick={() => setLightboxOpen(true)} className="cta-btn btn-ghost flex items-center gap-2" style={{ padding: '14px 28px', fontSize: '13px' }}>
              <Play size={14} /> Watch Video
            </button>
          </div>
        </div>

        {/* ── Mute toggle ── */}
        <button
          onClick={() => {
  if (!videoRef.current) return

  const newMuted = !muted

  videoRef.current.muted = newMuted

  //  ensure volume is set when unmuting
  if (!newMuted) {
    videoRef.current.volume = 0.2
  }

  setMuted(newMuted)
}}
          className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-50 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: 'var(--cream-50)', border: '1px solid rgba(255,255,255,0.15)' }}
          aria-label="Toggle sound"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* ── Scroll indicator ── */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: 0.5 }}
        >
          <span className="font-mono-label text-white" style={{ fontSize: '9px', letterSpacing: '3px' }}>SCROLL</span>
          <div className="w-[1px] h-8 bg-white/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-white animate-bounce-subtle" />
          </div>
        </div>

        {/* ── Bottom gradient fade ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(245,240,230,0.6) 100%)' }}
        />
      </section>

      {/* ── Video Lightbox ── */}
      {lightboxOpen && (
         <div
    className="fixed inset-0 z-[200] flex items-center justify-center"  // ← was z-[80]
    style={{ backgroundColor: 'rgba(15,29,50,0.94)' }}
    onClick={() => setLightboxOpen(false)}
  >
    <button
      className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-[201]"  // ← above the overlay
      onClick={(e) => {
        e.stopPropagation()
        setLightboxOpen(false)
      }}
    >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <video
            className="max-w-[88vw] max-h-[84vh] rounded-xl"
            autoPlay
            controls
            onClick={(e) => e.stopPropagation()}
          >
            <source src="/assets/videos/video8.mp4" type="video/mp4" />
          </video>
        </div>
      )}
    </>
  )
}
