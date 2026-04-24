import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect } from 'react'

export default function AdminLogin() {
  const { signIn, user } = useAuthContext()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
  if (user) {
    navigate('/admin')
  }
}, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError('Invalid email or password')
      setShake(true)
      setTimeout(() => setShake(false), 400)
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: 'var(--cream-100)' }}
    >
      <div
        className={`w-full max-w-[420px] rounded-xl p-10 md:p-12 ${shake ? 'animate-shake' : ''}`}
        style={{
          backgroundColor: 'var(--cream-50)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--cream-300)',
        }}
      >
        {/* Logo */}
        <div className="text-center">
          <img
            src="/assets/YogaLogo.png"
            alt="Vignesh Yoga"
            className="h-16 w-auto mx-auto object-contain rounded-lg"
          />
          <p
            className="font-mono-label mt-4"
            style={{ color: 'var(--gold-600)', letterSpacing: '3px', fontSize: '11px' }}
          >
            ADMIN PANEL
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--navy-800)', fontFamily: 'var(--font-body)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-3.5 rounded-lg text-base transition-all duration-200 focus:outline-none"
              style={{
                border: '1.5px solid var(--cream-300)',
                backgroundColor: 'var(--cream-100)',
                color: 'var(--navy-800)',
                fontFamily: 'var(--font-body)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--cream-300)')}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--navy-800)', fontFamily: 'var(--font-body)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3.5 pr-12 rounded-lg text-base transition-all duration-200 focus:outline-none"
                style={{
                  border: '1.5px solid var(--cream-300)',
                  backgroundColor: 'var(--cream-100)',
                  color: 'var(--navy-800)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--cream-300)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'var(--navy-400)' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm px-1" style={{ color: '#b91c1c', fontFamily: 'var(--font-body)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-navy w-full mt-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Back to site */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm transition-colors hover:text-[var(--navy-800)]"
            style={{ color: 'var(--navy-500)', fontFamily: 'var(--font-body)' }}
          >
            &larr; Back to website
          </button>
        </div>
      </div>
    </div>
  )
}
