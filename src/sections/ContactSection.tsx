import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useData } from '@/context/DataContext'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { submitMessage } from '@/lib/supabase'
import { MessageCircle, Instagram, Mail, Phone, CheckCircle } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import { j } from 'node_modules/react-router/dist/development/index-react-server-client-BjhKIe3u.d.mts'


gsap.registerPlugin(ScrollTrigger)

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactSection() {
  const { contact } = useData()
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLElement>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setSubmitStatus('sending')
    const { error } = await submitMessage(data.name, data.email, data.message)
    if (error) {
      setSubmitStatus('error')
    } else {
      setSubmitStatus('success')
      reset()
      setTimeout(() => setSubmitStatus('idle'), 4000)
    }
  }
console.log(contact)

const ci = {
  whatsapp_number: contact?.whatsapp_number || '+919010976762',
  instagram_handle: contact?.instagram_handle || '@vigidilli',
  instagram_url: contact?.instagram_url || 'https://www.instagram.com/vigidilli/',
  email: contact?.email || 'vigneshpd@yahoo.in',
  phone: contact?.phone || '+33745641510',
  location: contact?.location || 'France (available worldwide online)',
}
  const safeWhatsapp = ci.whatsapp_number || ''
const safePhone = ci.phone || ''

  const contactItems = [
    {
      icon: <MessageCircle size={22} />,
      label: 'WhatsApp',
      value: ci.whatsapp_number,
      href: `https://wa.me/${safeWhatsapp.replace(/[^0-9]/g, '')}`,
      color: '#25D366',
    },
    {
      icon: <Instagram size={22} />,
      label: 'Instagram',
      value: ci.instagram_handle,
      href: ci.instagram_url,
      color: '#C13584',
    },
    {
      icon: <Mail size={22} />,
      label: 'Email',
      value: ci.email,
      href: `mailto:${ci.email}`,
      color: 'var(--navy-800)',
    },
    {
      icon: <Phone size={22} />,
      label: 'Phone',
      value: ci.phone,
      href: `tel:${safePhone.replace(/\s/g, '')}`,
      color: 'var(--navy-700)',
    },
  ].filter(item => item.value)
console.log('CONTACT ITEMS:', contactItems) 
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const label = section.querySelector('.contact-label')
if (label) {
  gsap.from(label, {
    opacity: 0,
    y: 15,
    duration: 0.6,
    scrollTrigger: { trigger: section, start: 'top 88%' },
  })
}
      const title = section.querySelector('.contact-title')
if (title) {
  gsap.from(title, {
    opacity: 0,
    y: 50,
    duration: 0.9,
    scrollTrigger: { trigger: section, start: 'top 88%' },
  })
}
      const form = section.querySelector('.contact-form')
if (form) {
  gsap.from(form, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: 0.15,
    scrollTrigger: { trigger: section, start: 'top 88%' },
  })
}
     const items = section.querySelectorAll('.contact-item')

if (items.length > 0) {
  gsap.from(items, {
    opacity: 0,
    x: 30,
    duration: 0.7,
    stagger: 0.1,
    scrollTrigger: { trigger: items[0], start: 'top 88%' },
  })
}
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-cream-100 relative"
      style={{ padding: isMobile ? '80px 0' : '160px 0' }}
    >
      <div className="section-container">
        <div className={`grid gap-16 ${isMobile ? 'grid-cols-1' : 'grid-cols-[1.1fr_0.9fr]'}`} style={{ gap: isMobile ? '48px' : '80px' }}>
          {/* Left — Form */}
          <div>
            <p className="contact-label font-mono-label mb-6" style={{ color: 'var(--gold-600)' }}>
              GET IN TOUCH
            </p>

            <h2
              className="contact-title font-display mb-6"
              style={{
                color: 'var(--navy-900)',
                fontSize: isMobile ? '40px' : '72px',
                lineHeight: isMobile ? '44px' : '76px',
                letterSpacing: isMobile ? '-0.8px' : '-1.44px',
              }}
            >
              Start Your Journey
            </h2>

            <p
              className="mb-12 text-body-lg"
              style={{ color: 'var(--navy-600)', maxWidth: '480px' }}
            >
              Ready to transform your body and mind? Send me a message and I'll get back to you within 24 hours.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="contact-form flex flex-col gap-5 max-w-[520px]">
              <div>
                <input
                  {...register('name')}
                  placeholder="Your name"
                  className="w-full px-5 py-4 rounded-lg text-base transition-all duration-200 focus:outline-none"
                  style={{
                    border: '1.5px solid var(--cream-300)',
                    background: 'var(--cream-50)',
                    color: 'var(--navy-800)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--cream-300)')}
                />
                {errors.name && <p className="text-sm mt-1.5" style={{ color: '#b91c1c' }}>{errors.name.message}</p>}
              </div>

              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-5 py-4 rounded-lg text-base transition-all duration-200 focus:outline-none"
                  style={{
                    border: '1.5px solid var(--cream-300)',
                    background: 'var(--cream-50)',
                    color: 'var(--navy-800)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--cream-300)')}
                />
                {errors.email && <p className="text-sm mt-1.5" style={{ color: '#b91c1c' }}>{errors.email.message}</p>}
              </div>

              <div>
                <textarea
                  {...register('message')}
                  placeholder="Tell me about your goals..."
                  rows={5}
                  className="w-full px-5 py-4 rounded-lg text-base transition-all duration-200 focus:outline-none resize-y"
                  style={{
                    border: '1.5px solid var(--cream-300)',
                    background: 'var(--cream-50)',
                    color: 'var(--navy-800)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--cream-300)')}
                />
                {errors.message && <p className="text-sm mt-1.5" style={{ color: '#b91c1c' }}>{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'sending'}
                className="btn-navy disabled:opacity-70"
              >
                {submitStatus === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : submitStatus === 'success' ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle size={20} />
                    Message Sent!
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>

              {submitStatus === 'error' && (
                <p className="text-sm" style={{ color: '#b91c1c' }}>Failed to send. Please try again.</p>
              )}
            </form>
          </div>

          {/* Right — Contact Details */}
<div>
  <p className="font-mono-label mb-8" style={{ color: 'var(--navy-400)', letterSpacing: '2px' }}>
    DIRECT CONTACT
  </p>

  {!contact ? (
    <div style={{ padding: '20px' }}>Loading contact...</div>
  ) : (
    <>
      
      
      <div className="flex flex-col gap-5">
        {contactItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target={item.label === 'Instagram' || item.label === 'WhatsApp' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="contact-item flex items-center gap-5 p-5 rounded-xl transition-all duration-300"
            style={{
              background: 'var(--cream-50)',
              border: '1.5px solid var(--cream-300)',
            }}
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201, 169, 110, 0.1)', color: 'var(--gold-600)' }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--navy-500)' }}>
                {item.label}
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--navy-800)' }}>
                {item.value}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Location */}
      {ci.location && (
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--cream-300)' }}>
          <p className="font-mono-label mb-3" style={{ color: 'var(--navy-400)', letterSpacing: '2px' }}>
            LOCATION
          </p>
          <p className="text-body-lg" style={{ color: 'var(--navy-700)' }}>
            {ci.location}
          </p>
        </div>
      )}
    </>
  )}
</div>
        </div>
      </div>
    </section>
  )
}
