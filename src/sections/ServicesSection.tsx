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
    description: 'One-on-one sessions designed around your body, goals, and schedule. From beginners to advanced practitioners, every session is tailored to your unique journey.',
    icon_name: 'yoga-mat',
  },
  {
    id: 2,
    title: 'Online Sessions',
    description: 'Practice yoga from anywhere with live, interactive online classes. Real-time guidance, posture corrections, and personalized feedback in every session.',
    icon_name: 'video-call',
  },
  {
    id: 3,
    title: 'Group Classes',
    description: 'Join a supportive community in group yoga classes. Build strength and flexibility together while cultivating mindfulness and inner peace.',
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
      // Animate heading
      gsap.from(section.querySelector('.services-label'), {
        opacity: 0, y: 15, duration: 0.6,
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.from(section.querySelector('.services-title'), {
        opacity: 0, y: 50, duration: 0.9,
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.from(section.querySelector('.services-desc'), {
        opacity: 0, y: 40, duration: 0.8, delay: 0.15,
        scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
      })

      // Animate cards with stagger
      const cards = section.querySelectorAll('.service-card')
      if (cards.length > 0) {
        gsap.from(cards, {
          opacity: 0, y: 50, duration: 0.8, stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, section)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-navy-gradient relative overflow-hidden"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      {/* Subtle decorative element */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, var(--gold-500) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, var(--gold-500) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="section-container relative z-10">
        {/* Label */}
        <p className="services-label font-mono-label text-center mb-6" style={{ color: 'var(--gold-500)' }}>
          SERVICES
        </p>

        {/* Title */}
        <h2
          className="services-title font-display text-center mb-5"
          style={{
            color: 'var(--cream-50)',
            fontSize: isMobile ? '40px' : '80px',
            lineHeight: isMobile ? '44px' : '80px',
            letterSpacing: isMobile ? '-0.8px' : '-1.6px',
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
            fontSize: isMobile ? '17px' : '18px',
            lineHeight: '28px',
            fontFamily: 'var(--font-body)',
          }}
        >
          Personalized yoga experiences designed to meet you where you are and guide you toward your goals.
        </p>

        {/* Service Cards */}
        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="service-card group text-center p-10 md:p-12 rounded-xl transition-all duration-500"
              style={{
                
                background: 'rgba(250, 248, 243, 0.04)',
                border: '1px solid rgba(201, 169, 110, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.5)'
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-8 transition-all duration-500 group-hover:scale-110"
                style={{
                  color: 'var(--gold-500)',
                  background: 'rgba(201, 169, 110, 0.1)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                }}
              >
                {iconMap[service.icon_name] || iconMap['yoga-mat']}
              </div>

              {/* Title */}
              <h3
                className="font-display mb-4"
                style={{
                  color: 'var(--cream-50)',
                  fontSize: '24px',
                  lineHeight: '30px',
                  letterSpacing: '-0.36px',
                  fontWeight: 500,
                }}
              >
                {service.title}
              </h3>

              {/* Divider */}
              <div className="w-10 h-[1px] mx-auto mb-5" style={{ backgroundColor: 'var(--gold-500)', opacity: 0.4 }} />

              {/* Description */}
              <p
                className="text-[15px]"
                style={{
                  color: 'var(--navy-300)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: '26px',
                }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
