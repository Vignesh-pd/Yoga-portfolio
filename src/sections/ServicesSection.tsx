import { useLayoutEffect, useRef } from 'react'
import { useData } from '@/context/DataContext'
import { useIsMobile } from '@/hooks/useMediaQuery'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User, Monitor, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const iconMap: Record<string, React.ReactNode> = {
  'yoga-mat': <User size={32} strokeWidth={1.5} />,
  'video-call': <Monitor size={32} strokeWidth={1.5} />,
  'people': <Users size={32} strokeWidth={1.5} />,
}

const defaultServices = [
  {
    id: 1,
    title: 'Personal Training',
    description:
      'One-on-one sessions designed around your body, goals, and schedule. From beginners to advanced practitioners, every session is tailored to your unique journey.',
    icon_name: 'yoga-mat',
  },
  {
    id: 2,
    title: 'Online Sessions',
    description:
      'Practice yoga from anywhere with live, interactive online classes. Real-time guidance, posture corrections, and personalized feedback in every session.',
    icon_name: 'video-call',
  },
  {
    id: 3,
    title: 'Group Classes',
    description:
      'Join a supportive community in group yoga classes. Build strength and flexibility together while cultivating mindfulness and inner peace.',
    icon_name: 'people',
  },
]

export default function ServicesSection() {
  const { services } = useData()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)

  const displayServices = services.length > 0 ? services : defaultServices

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const label = section.querySelector('.services-label')
      const title = section.querySelector('.services-title')
      const desc = section.querySelector('.services-desc')
      const cards = section.querySelectorAll('.service-card')

      // ✅ Always visible first (prevents disappearing)
      gsap.set([label, title, desc, cards], { opacity: 1, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      })

      if (label) {
        tl.fromTo(label,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
      }

      if (title) {
        tl.fromTo(title,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.3'
        )
      }

      if (desc) {
        tl.fromTo(desc,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
      }

      if (cards.length > 0) {
        tl.fromTo(cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power2.out',
          },
          '-=0.3'
        )
      }

    }, section)

    // 🔥 Layout sync fix (VERY IMPORTANT)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-navy-gradient relative overflow-hidden"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, var(--gold-500) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, var(--gold-500) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="section-container relative z-10">
        {/* Label */}
        <p className="services-label text-center mb-6" style={{ color: 'var(--gold-500)' }}>
          SERVICES
        </p>

        {/* Title */}
        <h2
          className="services-title text-center mb-5"
          style={{
            color: 'var(--cream-50)',
            fontSize: isMobile ? '40px' : '80px',
          }}
        >
          My Yoga Offerings
        </h2>

        {/* Description */}
        <p
          className="services-desc text-center mx-auto mb-16"
          style={{
            color: 'var(--navy-300)',
            maxWidth: '560px',
          }}
        >
          Personalized yoga experiences designed to meet you where you are and guide you toward your goals.
        </p>

        {/* Cards */}
        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="service-card group text-center p-10 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(250, 248, 243, 0.04)',
                border: '1px solid rgba(201, 169, 110, 0.15)',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -8,
                  scale: 1.02,
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
              <div className="mb-6 flex justify-center">
                {iconMap[service.icon_name] || iconMap['yoga-mat']}
              </div>

              <h3 className="mb-3 text-xl" style={{ color: 'var(--cream-50)' }}>
                {service.title}
              </h3>

              <p style={{ color: 'var(--navy-300)' }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}