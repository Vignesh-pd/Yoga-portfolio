import { useEffect, useRef } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from(section.querySelector('.about-label'), {
        opacity: 0, y: 15, duration: 0.6,
        scrollTrigger: { trigger: section, start: 'top 88%' },
      })
      gsap.from(section.querySelector('.about-title'), {
        opacity: 0, y: 50, duration: 0.9,
        scrollTrigger: { trigger: section, start: 'top 88%' },
      })
      gsap.from(section.querySelector('.about-text'), {
        opacity: 0, x: -30, duration: 0.9,
        scrollTrigger: { trigger: section, start: 'top 80%' },
      })
      gsap.from(section.querySelector('.about-image'), {
        opacity: 0, x: 30, scale: 1.02, duration: 1,
        scrollTrigger: { trigger: section, start: 'top 80%' },
      })
      const blocks = section.querySelectorAll('.about-block')
      if (blocks.length > 0) {
        gsap.from(blocks, {
          opacity: 0, y: 40, duration: 0.8, stagger: 0.1,
          scrollTrigger: { trigger: blocks[0], start: 'top 88%' },
        })
      }
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-cream-100 relative"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px]" style={{ backgroundColor: 'var(--gold-500)', opacity: 0.4 }} />

      <div className="section-container">
        {/* Label */}
        <p className="about-label font-mono-label mb-6" style={{ color: 'var(--gold-600)' }}>
          ABOUT
        </p>

        {/* Title */}
        <h2
          className="about-title font-display mb-16"
          style={{
            color: 'var(--navy-900)',
            fontSize: isMobile ? '40px' : '80px',
            lineHeight: isMobile ? '44px' : '80px',
            letterSpacing: isMobile ? '-0.8px' : '-1.6px',
          }}
        >
          My Philosophy
        </h2>

        {/* Grid: Text Left, Image Right */}
        <div className={`grid gap-16 ${isMobile ? 'grid-cols-1' : 'grid-cols-[1fr_0.85fr]'}`} style={{ gap: isMobile ? '48px' : '80px', alignItems: 'start' }}>
          {/* Left — Philosophy Text */}
          <div className="about-text flex flex-col gap-6">
            {/* Opening Quote */}
            <div className="about-block relative pl-6 py-2" style={{ borderLeft: '3px solid var(--gold-500)' }}>
              <p className="font-display italic" style={{ color: 'var(--navy-800)', fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: '1.4' }}>
                Yoga, for me, is not about flexibility or achieving perfect postures.
              </p>
              <p className="mt-4" style={{ color: 'var(--navy-600)', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '28px' }}>
                It is about understanding your own body, listening to it carefully, and gradually building a deep connection between the body and the mind.
              </p>
            </div>

            <p className="about-block" style={{ color: 'var(--navy-600)', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '28px' }}>
              I strongly believe that yoga does not require a perfect routine or long hours of practice every day. Even practicing one asana daily is enough to start the journey. Yoga is not about perfection — it is about consistency and patience over time.
            </p>

            <p className="about-block" style={{ color: 'var(--navy-600)', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '28px' }}>
              Yoga does not limit me to stillness alone. I also practice weight training and calisthenics, creating a balanced approach to fitness. Yoga enhances my mobility and body awareness, while strength training builds power and endurance.
            </p>

            {/* Highlight Quote */}
            <div className="about-block rounded-xl p-8 my-2" style={{ background: 'var(--navy-gradient)', boxShadow: 'var(--shadow-md)' }}>
              <p className="font-display italic" style={{ color: 'var(--cream-50)', fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: '1.5' }}>
                &ldquo;At the age of 36, I feel stronger, fitter, and in better shape than I was in my twenties. It is never too late to start.&rdquo;
              </p>
            </div>

            <p className="about-block" style={{ color: 'var(--navy-600)', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '28px' }}>
              The most significant change yoga has brought is not just physical, but mental and emotional. It has helped me reduce anger, lower expectations from others, and develop a more compassionate perspective. Yoga is not just something I practice on a mat — it is a way of life.
            </p>

            {/* Signature */}
            <div className="pt-8 mt-2" style={{ borderTop: '1px solid var(--cream-300)' }}>
              <p className="font-display italic" style={{ color: 'var(--navy-800)', fontSize: '26px' }}>
                &mdash; Vignesh
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--navy-500)', fontFamily: 'var(--font-body)' }}>
                Certified Yoga Instructor RYT 500
              </p>
            </div>
          </div>

          {/* Right — Featured Image */}
          <div className="about-image">
            <div
              className="overflow-hidden rounded-2xl relative"
              style={{
                boxShadow: 'var(--shadow-lg)',
                aspectRatio: isMobile ? '16/10' : '3/4',
                maxHeight: isMobile ? '400px' : '700px',
              }}
            >
              <img
                src="/assets/photos/photo14.png"
                alt="Vignesh Yoga Practice"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ objectPosition: 'center top' }}
              />
              {/* Gold accent line at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--gold-500)' }} />

              {/* Overlay text */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(15,29,50,0.7) 100%)',
                }}
              >
                <p className="font-display italic text-lg" style={{ color: 'var(--cream-50)' }}>
                  Vrikshasana — Yoga in Nature
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--gold-400)', fontFamily: 'var(--font-body)' }}>
                  Strength &bull; Balance &bull; Soul
                </p>
              </div>
            </div>

            {/* Stats Row */}
            {/* <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { num: '8+', label: 'Years' },
                { num: '500+', label: 'Students' },
                { num: '50+', label: 'Workshops' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display" style={{ color: 'var(--gold-600)', fontSize: isMobile ? '32px' : '40px', lineHeight: '1', letterSpacing: '-1px' }}>
                    {stat.num}
                  </p>
                  <p className="mt-2 text-xs" style={{ color: 'var(--navy-500)', fontFamily: 'var(--font-body)', letterSpacing: '0.5px' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
