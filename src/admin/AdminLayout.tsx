import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { useIsMobile } from '@/hooks/useMediaQuery'
import {
  LayoutDashboard, Image, Video, FileText, User,
  Phone, Briefcase, MessageSquare, LogOut, Menu, CircleDot
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Image, label: 'Photos', path: '/admin/photos' },
  { icon: Video, label: 'Videos', path: '/admin/videos' },
  { icon: FileText, label: 'Certificates', path: '/admin/certificates' },
  { icon: User, label: 'About Me', path: '/admin/about' },
  { icon: Phone, label: 'Contact Info', path: '/admin/contact' },
  { icon: Briefcase, label: 'Services', path: '/admin/services' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthContext()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleNav = (path: string) => {
    navigate(path)
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          width: '260px',
          backgroundColor: 'var(--navy-950)',
        }}
      >
        {/* Logo Area */}
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--navy-800)' }}>
          <img
            src="/assets/YogaLogo.png"
            alt="Vignesh Yoga"
            className="h-10 w-auto object-contain rounded"
          />
          <p
            className="font-mono-label mt-2"
            style={{ color: 'var(--navy-400)', fontSize: '10px', letterSpacing: '2px' }}
          >
            ADMIN PANEL
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`admin-nav-link text-left ${
                isActive(item.path) ? 'active' : ''
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4" style={{ borderColor: 'var(--navy-800)' }}>
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium"
            style={{ color: 'var(--navy-400)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--cream-50)'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--navy-400)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(15,29,50,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen" style={{ marginLeft: isMobile ? 0 : '260px' }}>
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-8 h-16"
          style={{
            backgroundColor: 'var(--cream-50)',
            borderBottom: '1px solid var(--cream-300)',
          }}
        >
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ color: 'var(--navy-800)' }}
              >
                <Menu size={24} />
              </button>
            )}
            <h1
              className="font-display text-xl md:text-2xl"
              style={{ color: 'var(--navy-900)' }}
            >
              {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: 'var(--gold-500)', color: 'var(--navy-950)' }}
            >
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="hidden md:inline text-sm font-medium" style={{ color: 'var(--navy-800)' }}>
              Admin
            </span>
            <CircleDot size={8} fill="#22c55e" color="#22c55e" />
          </div>
        </header>

        {/* Page Content */}
        <div style={{ backgroundColor: 'var(--cream-100)', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
