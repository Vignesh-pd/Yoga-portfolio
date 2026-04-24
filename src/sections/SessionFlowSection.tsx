import { useEffect, useRef } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    title: 'Pranayama',
    subtitle: 'Breathing',
    description:
      'Begin with conscious breathwork to center the mind, calm the nervous system, and prepare the body for the practice ahead.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
        <path d="M8 12s1.5-3 4-3 4 3 4 3"/>
        <path d="M12 16v-2"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Warm-up',
    subtitle: 'Preparation',
    description:
      'Gentle joint mobilization and dynamic stretches to awaken the body, increase circulation, and prevent injury.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Asana Practice',
    subtitle: 'Movement',
    description:
      'Flow through carefully sequenced postures that build strength, flexibility, and balance while deepening body awareness.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3c-4.5 0-8 3.5-8 8 0 5.25 8 10 8 10s8-4.75 8-10c0-4.5-3.5-8-8-8z"/>
        <circle cx="12" cy="11" r="2.5"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Yoga Nidra',
    subtitle: 'Relaxation',
    description:
      'Deep guided relaxation that allows the body to integrate the practice, releasing tension and restoring inner calm.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>
      </svg>
    ),
  },
]

export default function SessionFlowSection() {
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const label = section.querySelector('.session-label')
      const title = section.querySelector('.session-title')
      const desc = section.querySelector('.session-desc')
      const cards = section.querySelectorAll('.session-card')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      })

      if (label) {
        tl.from(label, {
          
          y: 10,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      if (title) {
        tl.from(title, {
         
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.3')
      }

      if (desc) {
        tl.from(desc, {
          
          y: 20,
          duration: 0.7,
          ease: 'power2.out',
        }, '-=0.4')
      }

      if (cards.length > 0) {
        tl.from(cards, {
          
          y: 60,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }, '-=0.3')
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="session-flow"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'var(--warm-gradient)',
        padding: isMobile ? '80px 0' : '160px 0',
      }}
    >
      <div className="section-container relative z-10">

        {/* Label */}
        <p className="session-label font-mono-label text-center mb-6" style={{ color: 'var(--gold-600)' }}>
          THE EXPERIENCE
        </p>

        {/* Title */}
        <h2
          className="session-title font-display text-center mb-6"
          style={{
            color: 'var(--navy-900)',
            fontSize: isMobile ? '40px' : '80px',
          }}
        >
          How a Session Flows
        </h2>

        {/* Description */}
        <p
          className="session-desc text-center mx-auto mb-20"
          style={{
            color: 'var(--navy-600)',
            maxWidth: '520px',
          }}
        >
          Every session follows a thoughtful structure designed to guide you from breath to deep relaxation.
        </p>

        {/* Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="session-card text-center p-8 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: 'var(--cream-50)',
                border: '1px solid var(--cream-300)',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -10,
                  scale: 1.03,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  duration: 0.3,
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  scale: 1,
                  boxShadow: 'none',
                  duration: 0.3,
                })
              }}
            >
              {/* Icon */}
              <div className="mb-5 flex justify-center">{step.icon}</div>

              <h3 className="font-display text-lg mb-1">{step.title}</h3>

              <p className="text-xs tracking-widest mb-3">{step.subtitle}</p>

              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}