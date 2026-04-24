


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0



// Create a safe client - if not configured, create a mock that won't crash
let client: any

try {
  if (isSupabaseConfigured) {
    client = createClient(supabaseUrl, supabaseAnonKey)
  } else {
    // Create a mock client that returns empty data for all operations
    // This prevents crashes when Supabase env vars are not set
    client = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }), data: [], error: null }),
        insert: () => ({ select: () => ({ data: [], error: null }), data: null, error: null }),
        update: () => ({ eq: () => ({ data: null, error: null }), data: null, error: null }),
        delete: () => ({ eq: () => ({ data: null, error: null }), error: null }),
        upsert: () => ({ data: null, error: null }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: { path: '' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          remove: async () => ({ data: null, error: null }),
        }),
      },
    }
  }
} catch (e) {
  // Fallback mock if createClient throws
  client = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ error: null }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: '' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: async () => ({ data: null, error: null }),
      }),
    },
  }
}

export const supabase = client

// Auth helpers
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}

// Public data queries
export async function getPhotos() {
  try {
    const { data, error } = await supabase.from('photos').select('*').eq('is_visible', true).order('sort_order', { ascending: true })
    return { data, error }
  } catch { return { data: [], error: null } }
}

export async function getVideos() {
  try {
    const { data, error } = await supabase.from('videos').select('*').eq('is_visible', true).order('sort_order', { ascending: true })
    return { data, error }
  } catch { return { data: [], error: null } }
}

export async function getCertificates() {
  try {
    const { data, error } = await supabase.from('certificates').select('*')
    return { data, error }
  } catch { return { data: [], error: null } }
}

export async function getAboutContent() {
  try {
    const { data, error } = await supabase.from('about_content').select('*').single()
    return { data, error }
  } catch { return { data: null, error: null } }
}

export async function getContactInfo() {
  try {
    const { data, error } = await supabase.from('contact_info').select('*').single()
    return { data, error }
  } catch { return { data: null, error: null } }
}

export async function getServices() {
  try {
    const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true })
    return { data, error }
  } catch { return { data: [], error: null } }
}

export async function submitMessage(name: string, email: string, message: string) {
  try {
    const { data, error } = await supabase.from('messages').insert([{ name, email, message } as any])
    return { data, error }
  } catch (e: any) { return { data: null, error: e } }
}

// Storage helpers
export async function uploadFile(bucket: string, file: File) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return { path: filePath, url: publicUrl }
}

export async function deleteFile(bucket: string, path: string) {
  if (!isSupabaseConfigured) return { error: null }
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error }
}
