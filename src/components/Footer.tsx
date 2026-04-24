import { MessageCircle, Instagram, Mail, Phone } from 'lucide-react'

interface FooterProps {
  contactInfo?: {
    whatsapp_number?: string
    instagram_handle?: string
    instagram_url?: string
    email?: string
    phone?: string
    location?: string
  }
}

export default function Footer({ contactInfo }: FooterProps) {
  const ci = contactInfo || {}

  return (
    <footer className="relative" style={{ backgroundColor: 'var(--navy-950)' }}>
      {/* Top gold accent line */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--gold-500) 50%, transparent 100%)', opacity: 0.5 }} />

      <div className="section-container py-20 md:py-24">
        {/* Centered brand */}
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <img
            src="/assets/YogaLogo.png"
            alt="Vignesh Yoga"
            className="h-auto rounded-lg"
            style={{ maxWidth: '160px' }}
          />

          {/* Brand name */}
          <p
            className="font-mono-label mt-6"
            style={{ color: 'var(--gold-500)', letterSpacing: '6px', fontSize: '13px' }}
          >
            VIGNESH YOGA
          </p>

          {/* Tagline */}
          <p
            className="font-display italic mt-3"
            style={{ color: 'var(--navy-400)', fontSize: '18px' }}
          >
            Strength &bull; Balance &bull; Soul
          </p>

          {/* Divider */}
          <div
            className="w-full max-w-[320px] h-[1px] my-10"
            style={{ backgroundColor: 'var(--navy-700)' }}
          />

          {/* Social links */}
          <div className="flex items-center gap-8">
            {ci.whatsapp_number && (
              <a
                href={`https://wa.me/${ci.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-[var(--gold-500)]"
                style={{ color: 'var(--navy-400)' }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={22} />
              </a>
            )}
            {ci.instagram_url && (
              <a
                href={ci.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-[var(--gold-500)]"
                style={{ color: 'var(--navy-400)' }}
                aria-label="Instagram"
              >
                <Instagram size={22} />
              </a>
            )}
            {ci.email && (
              <a
                href={`mailto:${ci.email}`}
                className="transition-colors duration-300 hover:text-[var(--gold-500)]"
                style={{ color: 'var(--navy-400)' }}
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            )}
            {ci.phone && (
              <a
                href={`tel:${ci.phone.replace(/\s/g, '')}`}
                className="transition-colors duration-300 hover:text-[var(--gold-500)]"
                style={{ color: 'var(--navy-400)' }}
                aria-label="Phone"
              >
                <Phone size={22} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--navy-800)' }}>
        <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: 'var(--navy-500)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
            &copy; {new Date().getFullYear()} Vignesh Yoga. All rights reserved.
          </p>
          <p style={{ color: 'var(--navy-600)', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
            Designed with calm & intention
          </p>
        </div>
      </div>
    </footer>
  )
}
