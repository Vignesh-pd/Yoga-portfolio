export interface Photo {
  id: string
  storage_path: string
  public_url: string
  caption: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
}

export interface Video {
  id: string
  storage_path: string
  public_url: string
  poster_path: string | null
  poster_url: string | null
  caption: string | null
  duration: string | null
  sort_order: number
  is_visible: boolean
  created_at: string
}

export interface Certificate {
  id: string
  storage_path: string
  public_url: string
  name: string
  issuer: string | null
  issue_date: string | null
  description: string | null
  file_type: string | null
  sort_order: number
  created_at: string
}

export interface AboutContent {
  id: number
  portrait_path: string | null
  portrait_url: string | null
  philosophy_text: string
  stat_1_number: string
  stat_1_label: string
  stat_2_number: string
  stat_2_label: string
  stat_3_number: string
  stat_3_label: string
  updated_at: string
}

export interface ContactInfo {
  id: number
  whatsapp_number: string
  instagram_handle: string
  instagram_url: string
  email: string
  phone: string
  location: string
  updated_at: string
}

export interface Service {
  id: number
  title: string
  description: string
  icon_name: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

export type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  url: string
  caption: string | null
  poster_url?: string | null
  duration?: string | null
}

export interface Database {
  public: {
    Tables: {
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at'>
        Update: Partial<Omit<Photo, 'id' | 'created_at'>>
      }
      videos: {
        Row: Video
        Insert: Omit<Video, 'id' | 'created_at'>
        Update: Partial<Omit<Video, 'id' | 'created_at'>>
      }
      certificates: {
        Row: Certificate
        Insert: Omit<Certificate, 'id' | 'created_at'>
        Update: Partial<Omit<Certificate, 'id' | 'created_at'>>
      }
      about_content: {
        Row: AboutContent
        Insert: Omit<AboutContent, 'updated_at'>
        Update: Partial<Omit<AboutContent, 'id' | 'updated_at'>>
      }
      contact_info: {
        Row: ContactInfo
        Insert: Omit<ContactInfo, 'updated_at'>
        Update: Partial<Omit<ContactInfo, 'id' | 'updated_at'>>
      }
      services: {
        Row: Service
        Insert: Omit<Service, 'updated_at'>
        Update: Partial<Omit<Service, 'id' | 'updated_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'is_read' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
    }
  }
}
