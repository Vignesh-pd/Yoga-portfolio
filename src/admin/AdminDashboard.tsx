import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, uploadFile, deleteFile } from '@/lib/supabase'
import { useAuthContext } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import {
  Upload, Trash2, Pencil, X, Check, Image as ImageIcon,
  Video as VideoIcon, FileText, User, Phone,
  MessageSquare, Inbox, Play, File, ExternalLink
} from 'lucide-react'
import type {
  Photo, Video as VideoType, Certificate, AboutContent,
  ContactInfo, Service, Message
} from '@/types/database'
console.log("ADMIN DASHBOARD LOADED")
export default function AdminDashboard() {
  const location = useLocation()
  const page = location.pathname.replace('/admin', '').replace('/', '') || 'dashboard'
  useAuthContext() // auth guard handles redirect

  // Data states
  const [photos, setPhotos] = useState<Photo[]>([])
  const [videos, setVideos] = useState<VideoType[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [contact, setContact] = useState<ContactInfo | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [uploadModal, setUploadModal] = useState<{ open: boolean; type: 'photo' | 'video' | 'certificate' } | null>(null)
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [editVideo, setEditVideo] = useState<VideoType | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; path: string } | null>(null)
  const [viewMessage, setViewMessage] = useState<Message | null>(null)
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all')

  // Form states
  const [uploadFile_data, setUploadFile_data] = useState<File | null>(null)
  const [uploadCaption, setUploadCaption] = useState('')
  const [certName, setCertName] = useState('')
  const [certIssuer, setCertIssuer] = useState('')

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, vRes, cRes, aRes, coRes, sRes, mRes] = await Promise.all([
        (supabase as any).from('photos').select('*').order('sort_order', { ascending: true }),
        (supabase as any).from('videos').select('*').order('sort_order', { ascending: true }),
        (supabase as any).from('certificates').select('*').order('sort_order', { ascending: true }),
        (supabase as any).from('about_content').select('*').single(),
        (supabase as any).from('contact_info').select('*').single(),
        (supabase as any).from('services').select('*').order('id', { ascending: true }),
        (supabase as any).from('messages').select('*').order('created_at', { ascending: false }),
      ])
      if (pRes.data) setPhotos(pRes.data)
      if (vRes.data) setVideos(vRes.data)
      if (cRes.data) setCertificates(cRes.data)
      if (aRes.data) setAbout(aRes.data)
      if (coRes.data) setContact(coRes.data)
      if (sRes.data) setServices(sRes.data)
      if (mRes.data) setMessages(mRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      toast.error('Failed to load data')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Check if supabase is configured
  const supabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY

  // ─── ACTIONS ─────────────────────────────────────

  const handleUpload = async () => {
    if (!uploadFile_data) { toast.error('Please select a file'); return }
    const bucket = uploadModal?.type === 'photo' ? 'photos' : uploadModal?.type === 'video' ? 'videos' : 'certificates'
    try {
      toast.loading('Uploading...')
      const { path, url } = await uploadFile(bucket, uploadFile_data)

      if (uploadModal?.type === 'photo') {
        const { error } = await (supabase as any).from('photos').insert([{
          storage_path: path, public_url: url, caption: uploadCaption || null,
          sort_order: photos.length,
        }])
        if (error) throw error
      } else if (uploadModal?.type === 'video') {
        const { error } = await (supabase as any).from('videos').insert([{
          storage_path: path, public_url: url, caption: uploadCaption || null,
          poster_url: null, sort_order: videos.length,
        }])
        if (error) throw error
      } else {
        const { error } = await (supabase as any).from('certificates').insert([{
          storage_path: path, public_url: url, name: certName || uploadCaption || 'Certificate',
          issuer: certIssuer || null, file_type: uploadFile_data.name.split('.').pop(),
          sort_order: certificates.length,
        }])
        if (error) throw error
      }

      toast.dismiss()
      toast.success('Uploaded successfully!')
      setUploadModal(null)
      setUploadFile_data(null)
      setUploadCaption('')
      setCertName('')
      setCertIssuer('')
      fetchData()
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message || 'Upload failed')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const bucket = deleteTarget.type === 'photo' ? 'photos' : deleteTarget.type === 'video' ? 'videos' : 'certificates'
      await deleteFile(bucket, deleteTarget.path)
      await (supabase as any).from(deleteTarget.type + 's').delete().eq('id', deleteTarget.id)
      toast.success('Deleted successfully!')
      setDeleteTarget(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const handleUpdatePhoto = async (id: string, caption: string) => {
    await (supabase as any).from('photos').update({ caption }).eq('id', id)
    toast.success('Updated!')
    setEditPhoto(null)
    fetchData()
  }

  const handleUpdateVideo = async (id: string, caption: string) => {
    await (supabase as any).from('videos').update({ caption }).eq('id', id)
    toast.success('Updated!')
    setEditVideo(null)
    fetchData()
  }

  const handleUpdateAbout = async () => {
    if (!about) return
    const { error } = await (supabase as any).from('about_content').update({
      philosophy_text: about.philosophy_text,
      stat_1_number: about.stat_1_number,
      stat_1_label: about.stat_1_label,
      stat_2_number: about.stat_2_number,
      stat_2_label: about.stat_2_label,
      stat_3_number: about.stat_3_number,
      stat_3_label: about.stat_3_label,
    }).eq('id', 1)
    if (error) { toast.error('Failed to update'); return }
    toast.success('About section updated!')
    fetchData()
  }

  const handleUpdateContact = async () => {
    if (!contact) return
    const { error } = await (supabase as any).from('contact_info').update({
      whatsapp_number: contact.whatsapp_number,
      instagram_handle: contact.instagram_handle,
      instagram_url: contact.instagram_url,
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
    }).eq('id', 1)
    if (error) { toast.error('Failed to update'); return }
    toast.success('Contact info updated!')
    fetchData()
  }

  const handleUpdateServices = async () => {
    for (const svc of services) {
      await (supabase as any).from('services').update({
        title: svc.title, description: svc.description, icon_name: svc.icon_name,
      }).eq('id', svc.id)
    }
    toast.success('Services updated!')
    fetchData()
  }

  const handleMarkRead = async (id: string) => {
    await (supabase as any).from('messages').update({ is_read: true }).eq('id', id)
    fetchData()
  }

  const handleDeleteMessage = async (id: string) => {
    await (supabase as any).from('messages').delete().eq('id', id)
    setViewMessage(null)
    toast.success('Message deleted')
    fetchData()
  }

  const handleUploadPortrait = async (file: File) => {
    try {
      toast.loading('Uploading portrait...')
      const { path, url } = await uploadFile('portraits', file)
      await (supabase as any).from('about_content').update({ portrait_path: path, portrait_url: url }).eq('id', 1)
      toast.dismiss()
      toast.success('Portrait updated!')
      fetchData()
    } catch (err: any) {
      toast.dismiss()
      toast.error(err.message || 'Upload failed')
    }
  }

  // ─── RENDER ──────────────────────────────────────

  if (!supabaseConfigured) {
    return <SupabaseSetupGuide />
  }

  if (loading && photos.length === 0 && videos.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-[var(--gold-500)] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Dashboard */}
      {page === 'dashboard' && (
        <DashboardView
          photos={photos} videos={videos} certificates={certificates}
          messages={messages} onNavigate={() => {}}
        />
      )}

      {/* Photos */}
      {page === 'photos' && (
        <MediaGridView
          items={photos} type="photo"
          onUpload={() => setUploadModal({ open: true, type: 'photo' })}
          onEdit={(p) => setEditPhoto(p as Photo)}
          onDelete={(p) => setDeleteTarget({ type: 'photo', id: p.id, path: (p as Photo).storage_path })}
        />
      )}

      {/* Videos */}
      {page === 'videos' && (
        <MediaGridView
          items={videos} type="video"
          onUpload={() => setUploadModal({ open: true, type: 'video' })}
          onEdit={(v) => setEditVideo(v as VideoType)}
          onDelete={(v) => setDeleteTarget({ type: 'video', id: v.id, path: (v as VideoType).storage_path })}
        />
      )}

      {/* Certificates */}
      {page === 'certificates' && (
        <CertificateView
          items={certificates}
          onUpload={() => setUploadModal({ open: true, type: 'certificate' })}
          onDelete={(c) => setDeleteTarget({ type: 'certificate', id: c.id, path: c.storage_path })}
        />
      )}

      {/* About */}
      {page === 'about' && (
        <AboutEditView
          about={about}
          onChange={setAbout}
          onSave={handleUpdateAbout}
          onUploadPortrait={handleUploadPortrait}
        />
      )}

      {/* Contact */}
      {page === 'contact' && (
        <ContactEditView
          contact={contact}
          onChange={setContact}
          onSave={handleUpdateContact}
        />
      )}

      {/* Services */}
      {page === 'services' && (
        <ServicesEditView
          services={services}
          onChange={setServices}
          onSave={handleUpdateServices}
        />
      )}

      {/* Messages */}
      {page === 'messages' && (
        <MessagesView
          messages={messages}
          filter={messageFilter}
          onFilterChange={setMessageFilter}
          onView={setViewMessage}
          onMarkRead={handleMarkRead}
          onDelete={handleDeleteMessage}
        />
      )}

      {/* Upload Modal */}
      {uploadModal?.open && (
        <UploadModal
          type={uploadModal.type}
          file={uploadFile_data}
          onFileChange={setUploadFile_data}
          caption={uploadCaption}
          onCaptionChange={setUploadCaption}
          certName={certName}
          onCertNameChange={setCertName}
          certIssuer={certIssuer}
          onCertIssuerChange={setCertIssuer}
          onUpload={handleUpload}
          onClose={() => setUploadModal(null)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmModal
          title={`Delete ${deleteTarget.type.charAt(0).toUpperCase() + deleteTarget.type.slice(1)}?`}
          message="This action cannot be undone."
          confirmText="Delete"
          confirmColor="#dc2626"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Edit Photo Modal */}
      {editPhoto && (
        <EditCaptionModal
          caption={editPhoto.caption || ''}
          onSave={(cap) => handleUpdatePhoto(editPhoto.id, cap)}
          onClose={() => setEditPhoto(null)}
        />
      )}

      {/* Edit Video Modal */}
      {editVideo && (
        <EditCaptionModal
          caption={editVideo.caption || ''}
          onSave={(cap) => handleUpdateVideo(editVideo.id, cap)}
          onClose={() => setEditVideo(null)}
        />
      )}

      {/* View Message Modal */}
      {viewMessage && (
        <MessageDetailModal
          message={viewMessage}
          onClose={() => { setViewMessage(null); handleMarkRead(viewMessage.id) }}
          onDelete={() => handleDeleteMessage(viewMessage.id)}
        />
      )}
    </div>
  )
}

// ─── SUB-COMPONENTS ──────────────────────────────

function DashboardView({ photos, videos, certificates, messages }: {
  photos: Photo[]; videos: VideoType[]; certificates: Certificate[]; messages: Message[]; onNavigate: (p: string) => void
}) {
  const stats = [
    { icon: ImageIcon, title: 'Total Photos', value: photos.length, color: 'var(--gold-500)', bg: 'rgba(227,97,49,0.1)' },
    { icon: VideoIcon, title: 'Total Videos', value: videos.length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { icon: FileText, title: 'Certificates', value: certificates.length, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { icon: MessageSquare, title: 'New Messages', value: messages.filter((m) => !m.is_read).length, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-5 md:p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            style={{
              boxShadow: 'var(--shadow-sm)',
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--navy-600)' }}>{stat.title}</p>
            <p className="font-editorial text-3xl md:text-4xl mt-2" style={{ color: 'var(--navy-900)' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-5 md:p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h3 className="font-medium text-base mb-4" style={{ color: 'var(--navy-800)' }}>Recent Photos</h3>
          {photos.length === 0 ? (
            <EmptyState icon={ImageIcon} text="No photos uploaded yet" />
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {photos.slice(0, 4).map((p) => (
                <div key={p.id} className="aspect-square rounded-md overflow-hidden">
                  <img src={p.public_url} alt={p.caption || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-5 md:p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h3 className="font-medium text-base mb-4" style={{ color: 'var(--navy-800)' }}>Recent Messages</h3>
          {messages.length === 0 ? (
            <EmptyState icon={Inbox} text="No messages yet" />
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-md" style={{ borderLeft: m.is_read ? 'none' : '3px solid var(--gold-500)', backgroundColor: m.is_read ? 'transparent' : 'rgba(227,97,49,0.03)' }}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!m.is_read ? 'font-medium' : ''}`} style={{ color: 'var(--navy-800)' }}>{m.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--navy-500)' }}>{m.message}</p>
                  </div>
                  <p className="text-xs whitespace-nowrap" style={{ color: 'var(--navy-400)' }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MediaGridView({ items, type, onUpload, onEdit, onDelete }: {
  items: (Photo | VideoType)[]; type: 'photo' | 'video'
  onUpload: () => void; onEdit: (item: Photo | VideoType) => void; onDelete: (item: Photo | VideoType) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-editorial text-2xl" style={{ color: 'var(--navy-900)' }}>
          {type === 'photo' ? 'Photos' : 'Videos'}
        </h2>
        <button onClick={onUpload} className="btn-copper text-sm py-2.5 px-5">
          <Upload size={16} /> Upload {type === 'photo' ? 'Photo' : 'Video'}
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={type === 'photo' ? ImageIcon : VideoIcon} text={`No ${type}s yet`} action={onUpload} actionText={`Upload ${type}`} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden group" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={type === 'video' ? (item as VideoType).poster_url || item.public_url : item.public_url}
                  alt={item.caption || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                      <Play size={16} fill="var(--navy-900)" style={{ color: 'var(--navy-900)' }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm truncate" style={{ color: 'var(--navy-800)' }}>{item.caption || 'Untitled'}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onEdit(item)} className="p-1.5 rounded hover:bg-[var(--cream-100)] transition-colors" style={{ color: 'var(--navy-600)' }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-1.5 rounded hover:bg-red-50 transition-colors" style={{ color: '#dc2626' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CertificateView({ items, onUpload, onDelete }: {
  items: Certificate[]; onUpload: () => void; onDelete: (c: Certificate) => void
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-editorial text-2xl" style={{ color: 'var(--navy-900)' }}>Certificates</h2>
        <button onClick={onUpload} className="btn-copper text-sm py-2.5 px-5">
          <Upload size={16} /> Upload Certificate
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={FileText} text="No certificates yet" action={onUpload} actionText="Upload Certificate" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--cream-100)' }}>
                  {cert.file_type === 'pdf' ? <File size={24} style={{ color: 'var(--gold-500)' }} /> : (
                    <img src={cert.public_url} alt={cert.name} className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--navy-800)' }}>{cert.name}</p>
                  {cert.issuer && <p className="text-xs" style={{ color: 'var(--navy-600)' }}>{cert.issuer}</p>}
                  {cert.issue_date && <p className="text-xs" style={{ color: 'var(--navy-400)' }}>{cert.issue_date}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <a href={cert.public_url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 py-1.5 px-3 rounded-md border transition-colors hover:bg-[var(--cream-100)]" style={{ color: 'var(--navy-600)', borderColor: 'var(--cream-300)' }}>
                  <ExternalLink size={12} /> View
                </a>
                <button onClick={() => onDelete(cert)} className="text-xs flex items-center gap-1 py-1.5 px-3 rounded-md border transition-colors hover:bg-red-50" style={{ color: '#dc2626', borderColor: '#fecaca' }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AboutEditView({ about, onChange, onSave, onUploadPortrait }: {
  about: AboutContent | null; onChange: (a: AboutContent | null) => void
  onSave: () => void; onUploadPortrait: (f: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  if (!about) return <EmptyState icon={User} text="Loading..." />

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg p-6 md:p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <h2 className="font-editorial text-2xl mb-6" style={{ color: 'var(--navy-900)' }}>About Me</h2>

        {/* Portrait */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--navy-800)' }}>Portrait Photo</label>
          <div className="flex items-center gap-6">
            <div className="w-32 h-40 rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <img src={about.portrait_url || '/assets/logo.jpg'} alt="Portrait" className="w-full h-full object-cover" />
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUploadPortrait(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} className="text-sm py-2.5 px-5 rounded-full border transition-colors hover:bg-[var(--cream-100)]" style={{ color: 'var(--gold-500)', borderColor: 'var(--gold-500)' }}>
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Philosophy Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--navy-800)' }}>Philosophy / About Text</label>
          <textarea
            value={about.philosophy_text}
            onChange={(e) => onChange({ ...about, philosophy_text: e.target.value })}
            rows={12}
            className="w-full px-4 py-3 rounded-md text-sm transition-all duration-200 focus:outline-none resize-y"
            style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)', fontFamily: 'var(--font-body)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--cream-400)')}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { num: 'stat_1_number', label: 'stat_1_label', title: 'Stat 1' },
            { num: 'stat_2_number', label: 'stat_2_label', title: 'Stat 2' },
            { num: 'stat_3_number', label: 'stat_3_label', title: 'Stat 3' },
          ].map((s) => (
            <div key={s.title}>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--navy-600)' }}>{s.title}</label>
              <input
                value={about[s.num as keyof AboutContent] as string}
                onChange={(e) => onChange({ ...about, [s.num]: e.target.value })}
                placeholder="Number"
                className="w-full px-3 py-2 rounded-md text-sm mb-2"
                style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }}
              />
              <input
                value={about[s.label as keyof AboutContent] as string}
                onChange={(e) => onChange({ ...about, [s.label]: e.target.value })}
                placeholder="Label"
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }}
              />
            </div>
          ))}
        </div>

        <button onClick={onSave} className="btn-copper w-full md:w-auto">Save Changes</button>
      </div>
    </div>
  )
}

function ContactEditView({ contact, onChange, onSave }: {
  contact: ContactInfo | null; onChange: (c: ContactInfo | null) => void; onSave: () => void
}) {
  if (!contact) return <EmptyState icon={Phone} text="Loading..." />

  const fields = [
    { key: 'whatsapp_number' as const, label: 'WhatsApp Number', type: 'tel', icon: '📱' },
    { key: 'instagram_handle' as const, label: 'Instagram Handle', type: 'text', icon: '📸' },
    { key: 'instagram_url' as const, label: 'Instagram URL', type: 'url', icon: '🔗' },
    { key: 'email' as const, label: 'Email Address', type: 'email', icon: '✉️' },
    { key: 'phone' as const, label: 'Phone Number', type: 'tel', icon: '📞' },
    { key: 'location' as const, label: 'Location', type: 'text', icon: '📍' },
  ]

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg p-6 md:p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <h2 className="font-editorial text-2xl mb-6" style={{ color: 'var(--navy-900)' }}>Contact Information</h2>

        <div className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>{f.label}</label>
              <input
                type={f.type}
                value={contact[f.key]}
                onChange={(e) => onChange({ ...contact, [f.key]: e.target.value })}
                className="w-full px-4 py-3.5 rounded-md text-base transition-all duration-200 focus:outline-none"
                style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)', fontFamily: 'var(--font-body)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--gold-500)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--cream-400)')}
              />
            </div>
          ))}
        </div>

        <button onClick={onSave} className="btn-copper w-full md:w-auto mt-8">Save Changes</button>
      </div>
    </div>
  )
}

function ServicesEditView({ services, onChange, onSave }: {
  services: Service[]; onChange: (s: Service[]) => void; onSave: () => void
}) {
  const iconOptions = ['yoga-mat', 'video-call', 'people', 'lotus', 'heart', 'sun', 'moon', 'flame', 'star', 'leaf', 'water', 'mountain']

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="max-w-3xl space-y-6">
      {services.map((svc, idx) => (
        <div key={svc.id} className="bg-white rounded-lg p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h3 className="font-medium text-base mb-4" style={{ color: 'var(--navy-800)' }}>Service {idx + 1}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>Title</label>
              <input
                value={svc.title}
                onChange={(e) => updateService(idx, 'title', e.target.value)}
                className="w-full px-4 py-3 rounded-md"
                style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>Description</label>
              <textarea
                value={svc.description}
                onChange={(e) => updateService(idx, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-md resize-y"
                style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => updateService(idx, 'icon_name', icon)}
                    className="aspect-square rounded-md border flex items-center justify-center text-xs transition-all"
                    style={{
                      borderColor: svc.icon_name === icon ? 'var(--gold-500)' : 'var(--cream-400)',
                      backgroundColor: svc.icon_name === icon ? 'rgba(227,97,49,0.1)' : 'transparent',
                      color: svc.icon_name === icon ? 'var(--gold-500)' : 'var(--navy-400)',
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={onSave} className="btn-copper">Save All Services</button>
    </div>
  )
}

function MessagesView({ messages, filter, onFilterChange, onView, onMarkRead, onDelete: _onDelete }: {
  messages: Message[]; filter: string; onFilterChange: (f: 'all' | 'unread' | 'read') => void
  onView: (m: Message) => void; onMarkRead: (id: string) => void; onDelete: (id: string) => void
}) {
  void _onDelete;
  const filtered = filter === 'all' ? messages : filter === 'unread' ? messages.filter((m) => !m.is_read) : messages.filter((m) => m.is_read)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize"
            style={{
              color: filter === f ? 'var(--gold-500)' : 'var(--navy-600)',
              border: filter === f ? '1px solid var(--gold-500)' : '1px solid transparent',
              backgroundColor: filter === f ? 'rgba(227,97,49,0.05)' : 'transparent',
            }}
          >
            {f} {f === 'unread' && messages.filter((m) => !m.is_read).length > 0 && `(${messages.filter((m) => !m.is_read).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Inbox} text="No messages" />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:bg-[var(--cream-100)]"
              style={{
                boxShadow: 'var(--shadow-sm)',
                borderLeft: m.is_read ? 'none' : '3px solid var(--gold-500)',
              }}
              onClick={() => onView(m)}
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${m.is_read ? 'bg-gray-300' : 'bg-green-500'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${!m.is_read ? 'font-medium' : ''}`} style={{ color: 'var(--navy-800)' }}>{m.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--navy-500)' }}>{m.email}</p>
                <p className="text-sm truncate mt-1" style={{ color: 'var(--navy-600)' }}>{m.message}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <p className="text-xs" style={{ color: 'var(--navy-400)' }}>
                  {new Date(m.created_at).toLocaleDateString()}
                </p>
                {!m.is_read && (
                  <button onClick={(e) => { e.stopPropagation(); onMarkRead(m.id) }} className="p-1.5 rounded hover:bg-green-50" style={{ color: '#22c55e' }}>
                    <Check size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MODAL COMPONENTS ────────────────────────────

function UploadModal({ type, file, onFileChange, caption, onCaptionChange, certName, onCertNameChange, certIssuer, onCertIssuerChange, onUpload, onClose }: {
  type: 'photo' | 'video' | 'certificate'; file: File | null; onFileChange: (f: File | null) => void
  caption: string; onCaptionChange: (s: string) => void; certName: string; onCertNameChange: (s: string) => void
  certIssuer: string; onCertIssuerChange: (s: string) => void; onUpload: () => void; onClose: () => void
}) {
  const dropRef = useRef<HTMLDivElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onFileChange(f)
  }

  const titleMap = { photo: 'Upload Photo', video: 'Upload Video', certificate: 'Upload Certificate' }
  const acceptMap = { photo: 'image/*', video: 'video/*', certificate: '.pdf,.png,.jpg,.jpeg' }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(21,20,19,0.6)]" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial text-xl" style={{ color: 'var(--navy-900)' }}>{titleMap[type]}</h3>
          <button onClick={onClose} style={{ color: 'var(--navy-400)' }}><X size={24} /></button>
        </div>

        {/* Dropzone */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors hover:border-[var(--gold-500)] mb-5"
          style={{ borderColor: file ? 'var(--gold-500)' : 'var(--cream-400)' }}
          onClick={() => document.getElementById('upload-input')?.click()}
        >
          <input id="upload-input" type="file" accept={acceptMap[type]} className="hidden" onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])} />
          <Upload size={48} style={{ color: file ? 'var(--gold-500)' : 'var(--cream-400)', margin: '0 auto 12px' }} />
          <p className="text-sm" style={{ color: 'var(--navy-500)' }}>
            {file ? file.name : 'Drag & drop or click to select'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--navy-400)' }}>
            {type === 'video' ? 'MP4, MOV up to 100MB' : type === 'certificate' ? 'PDF, PNG, JPG up to 10MB' : 'PNG, JPG up to 10MB'}
          </p>
        </div>

        {type === 'certificate' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>Certificate Name</label>
              <input value={certName} onChange={(e) => onCertNameChange(e.target.value)} placeholder="e.g., 200-Hour YTT" className="w-full px-4 py-3 rounded-md" style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>Issuing Organization</label>
              <input value={certIssuer} onChange={(e) => onCertIssuerChange(e.target.value)} placeholder="e.g., Yoga Alliance" className="w-full px-4 py-3 rounded-md" style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }} />
            </div>
          </>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy-800)' }}>{type === 'certificate' ? 'Description (optional)' : 'Caption (optional)'}</label>
          <input value={caption} onChange={(e) => onCaptionChange(e.target.value)} placeholder="Add a caption..." className="w-full px-4 py-3 rounded-md" style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }} />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border text-sm font-medium transition-colors hover:bg-[var(--cream-100)]" style={{ color: 'var(--navy-600)', borderColor: 'var(--cream-400)' }}>
            Cancel
          </button>
          <button onClick={onUpload} disabled={!file} className="flex-1 btn-copper py-3 text-sm disabled:opacity-50">
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ title, message, confirmText, confirmColor, onConfirm, onCancel }: {
  title: string; message: string; confirmText: string; confirmColor: string
  onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(21,20,19,0.6)]" onClick={onCancel}>
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-editorial text-xl mb-2" style={{ color: 'var(--navy-900)' }}>{title}</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--navy-600)' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-full border text-sm font-medium transition-colors hover:bg-[var(--cream-100)]" style={{ color: 'var(--navy-600)', borderColor: 'var(--cream-400)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: confirmColor }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditCaptionModal({ caption, onSave, onClose }: { caption: string; onSave: (c: string) => void; onClose: () => void }) {
  const [value, setValue] = useState(caption)
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(21,20,19,0.6)]" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-editorial text-xl" style={{ color: 'var(--navy-900)' }}>Edit Caption</h3>
          <button onClick={onClose} style={{ color: 'var(--navy-400)' }}><X size={24} /></button>
        </div>
        <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-3 rounded-md mb-6" style={{ border: '1px solid var(--cream-400)', color: 'var(--navy-800)' }} />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border text-sm font-medium transition-colors hover:bg-[var(--cream-100)]" style={{ color: 'var(--navy-600)', borderColor: 'var(--cream-400)' }}>Cancel</button>
          <button onClick={() => onSave(value)} className="flex-1 btn-copper py-3 text-sm">Save</button>
        </div>
      </div>
    </div>
  )
}

function MessageDetailModal({ message, onClose, onDelete }: { message: Message; onClose: () => void; onDelete: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(21,20,19,0.6)]" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-editorial text-xl" style={{ color: 'var(--navy-900)' }}>{message.name}</h3>
          <button onClick={onClose} style={{ color: 'var(--navy-400)' }}><X size={24} /></button>
        </div>
        <a href={`mailto:${message.email}`} className="text-sm hover:text-[var(--gold-500)] transition-colors" style={{ color: 'var(--gold-500)' }}>{message.email}</a>
        <p className="text-xs mt-1" style={{ color: 'var(--navy-400)' }}>{new Date(message.created_at).toLocaleString()}</p>
        <div className="border-t my-4" style={{ borderColor: 'var(--cream-300)' }} />
        <p className="text-base whitespace-pre-wrap" style={{ color: 'var(--navy-800)', lineHeight: '26px' }}>{message.message}</p>
        <div className="flex gap-3 mt-6">
          <a href={`mailto:${message.email}`} className="py-2.5 px-5 rounded-full border text-sm font-medium transition-colors hover:bg-[var(--cream-100)]" style={{ color: 'var(--navy-600)', borderColor: 'var(--cream-400)' }}>Reply</a>
          <button onClick={onDelete} className="py-2.5 px-5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90" style={{ backgroundColor: '#dc2626' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, text, action, actionText }: { icon: any; text: string; action?: () => void; actionText?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon size={64} style={{ color: 'var(--cream-400)' }} />
      <p className="text-base mt-4 font-medium" style={{ color: 'var(--navy-600)' }}>{text}</p>
      {action && actionText && (
        <button onClick={action} className="btn-copper text-sm mt-4 py-2.5 px-5">{actionText}</button>
      )}
    </div>
  )
}

// ─── SUPABASE SETUP GUIDE ────────────────────────

function SupabaseSetupGuide() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white rounded-lg p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(227,97,49,0.1)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        </div>
        <h2 className="font-editorial text-2xl mb-4" style={{ color: 'var(--navy-900)' }}>Supabase Setup Required</h2>
        <p className="text-base mb-6" style={{ color: 'var(--navy-600)', lineHeight: '26px' }}>
          The admin dashboard requires a Supabase connection. Follow these steps to set it up:
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-100)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--navy-800)' }}>Step 1: Create a free Supabase project</h4>
            <p className="text-sm" style={{ color: 'var(--navy-600)' }}>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[var(--gold-500)] underline">supabase.com</a> and create a new project.</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-100)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--navy-800)' }}>Step 2: Set environment variables</h4>
            <p className="text-sm mb-2" style={{ color: 'var(--navy-600)' }}>Add these to your <code className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--cream-200)' }}>.env</code> file:</p>
            <pre className="p-3 rounded-md text-xs overflow-x-auto" style={{ backgroundColor: 'var(--navy-900)', color: '#fff' }}>
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-100)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--navy-800)' }}>Step 3: Run the SQL setup</h4>
            <p className="text-sm" style={{ color: 'var(--navy-600)' }}>Run the SQL script from <code className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--cream-200)' }}>src/lib/supabase-setup.sql</code> in the Supabase SQL Editor.</p>
          </div>
        </div>

        <p className="text-sm mt-6" style={{ color: 'var(--navy-500)' }}>
          After setup, refresh this page to access the admin dashboard.
        </p>
      </div>
    </div>
  )
}
