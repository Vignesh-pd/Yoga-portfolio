import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getPhotos, getVideos, getCertificates, getAboutContent,
  getContactInfo, getServices
} from '@/lib/supabase'
import type { Photo, Video, Certificate, AboutContent, ContactInfo, Service } from '@/types/database'

interface DataContextType {
  photos: Photo[]
  videos: Video[]
  certificates: Certificate[]
  about: AboutContent | null
  contact: ContactInfo | null
  services: Service[]
  loading: boolean
  error: string | null
}

const DataContext = createContext<DataContextType>({
  photos: [],
  videos: [],
  certificates: [],
  about: null,
  contact: null,
  services: [],
  loading: true,
  error: null,
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [contact, setContact] = useState<ContactInfo | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Try to fetch from Supabase
        const [photosRes, videosRes, certsRes, aboutRes, contactRes, servicesRes] =
          await Promise.all([
            getPhotos(),
            getVideos(),
            getCertificates(),
            getAboutContent(),
            getContactInfo(),
            getServices(),
          ])

        // If no data from Supabase, use fallback local data
        const fetchedPhotos = photosRes.data && photosRes.data.length > 0
          ? photosRes.data
          : getFallbackPhotos()
        const fetchedVideos = videosRes.data && videosRes.data.length > 0
          ? videosRes.data
          : getFallbackVideos()
        const fetchedCerts = certsRes.data || []

        const fetchedAbout = aboutRes.data || getFallbackAbout()
        const fetchedContact = contactRes.data || getFallbackContact()
       const fetchedServices = servicesRes.data && servicesRes.data.length > 0
  ? servicesRes.data
  : getFallbackServices()

        setPhotos(fetchedPhotos)
        setVideos(fetchedVideos)
        setCertificates(fetchedCerts)
        setAbout(fetchedAbout)
        setContact(fetchedContact)
        setServices(fetchedServices)

        if (photosRes.error || videosRes.error) {
          console.warn('Some data loaded from local fallbacks')
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load some content')
        // Use fallback data on error
        setPhotos(getFallbackPhotos())
        setVideos(getFallbackVideos())
        setAbout(getFallbackAbout())
        setContact(getFallbackContact())
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <DataContext.Provider value={{ photos, videos, certificates, about, contact, services, loading, error }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}

// Fallback data using user's uploaded assets
function getFallbackPhotos(): Photo[] {
  return [
    { id: '1', storage_path: '', public_url: '/assets/photos/photo19.png', caption: 'Parivrtta Janu Sirsasana — Revolved Head to Knee Pose', sort_order: 1, is_visible: true, created_at: '' },
    { id: '2', storage_path: '', public_url: '/assets/photos/photo15.png', caption: 'Chakrasana — Wheel pose', sort_order: 2, is_visible: true, created_at: '' },
    { id: '3', storage_path: '', public_url: '/assets/photos/photo16.png', caption: 'Padma Bakasana — Balance & strength', sort_order: 3, is_visible: true, created_at: '' },
    { id: '4', storage_path: '', public_url: '/assets/photos/photo20.png', caption: 'Veerabadrasana — Warrior 1 pose', sort_order: 4, is_visible: true, created_at: '' },
    { id: '5', storage_path: '', public_url: '/assets/photos/photo21.jpg', caption: 'Meditation practice', sort_order: 5, is_visible: true, created_at: '' },
    { id: '8', storage_path: '', public_url: '/assets/photos/photo22.png', caption: 'Sirsasana variation', sort_order: 8, is_visible: true, created_at: '' },
    { id: '9', storage_path: '', public_url: '/assets/photos/photo4.jpg', caption: 'Eka Pada Rajakapotasana — Pigeon pose', sort_order: 9, is_visible: true, created_at: '' },
    { id: '10', storage_path: '', public_url: '/assets/photos/photo18.png', caption: 'Natarajasana — Dancing Shiva pose', sort_order: 10, is_visible: true, created_at: '' },
    { id: '11', storage_path: '', public_url: '/assets/photos/photo3.jpg', caption: 'Janu Shirshasana — Deep stretch', sort_order: 11, is_visible: true, created_at: '' },
    { id: '13', storage_path: '', public_url: '/assets/photos/photo13.jpg', caption: 'International Yoga Day celebration', sort_order: 13, is_visible: true, created_at: '' },
  ]
}

function getFallbackVideos(): Video[] {
  return [
    { id: 'v1', storage_path: '', public_url: '/assets/videos/video1.mp4', poster_path: null, poster_url: '/assets/photos/photo9.jpg', caption: 'Surya Namaskar flow', duration: '0:15', sort_order: 1, is_visible: true, created_at: '' },
    { id: 'v2', storage_path: '', public_url: '/assets/videos/video2.mp4', poster_path: null, poster_url: '/assets/photos/photo3.jpg', caption: 'Vinyasa flow sequence', duration: '0:14', sort_order: 2, is_visible: true, created_at: '' },
    { id: 'v3', storage_path: '', public_url: '/assets/videos/video3.mp4', poster_path: null, poster_url: '/assets/photos/photo1.jpg', caption: 'Urdhva Mukha Paschimottanasana', duration: '0:08', sort_order: 3, is_visible: true, created_at: '' },
    { id: 'v4', storage_path: '', public_url: '/assets/videos/video4.mp4', poster_path: null, poster_url: '/assets/photos/photo5.jpg', caption: 'Vinyasa practice', duration: '0:13', sort_order: 4, is_visible: true, created_at: '' },
    { id: 'v5', storage_path: '', public_url: '/assets/videos/video5.mp4', poster_path: null, poster_url: '/assets/photos/photo10.jpg', caption: 'Mountain Vinyasa flow', duration: '0:12', sort_order: 5, is_visible: true, created_at: '' },
    { id: 'v7', storage_path: '', public_url: '/assets/videos/video7.mp4', poster_path: null, poster_url: '/assets/photos/photo13.jpg', caption: 'Mountain Vinyasa flow — Snow peaks', duration: '0:12', sort_order: 7, is_visible: true, created_at: '' },
  ]
}

function getFallbackAbout(): AboutContent {
  return {
    id: 1,
    portrait_path: null,
    portrait_url: '/assets/photos/photo9.jpg',
    philosophy_text: `Yoga, for me, is not about flexibility or achieving perfect postures. When most people think about yoga, they imagine extreme flexibility, perfect splits, deep backbends, or picture-perfect poses, but that is not the essence of it. Yoga is about understanding your own body, listening to it carefully, and gradually building a deep connection between the body and the mind. It is about creating a sense of harmony, what I like to think of as syncing the soul and the body. This connection matters far more than simply being able to touch your toes or perform advanced poses.

I strongly believe that yoga does not require a perfect routine or long hours of practice every day. It begins with something very simple. Even practicing one asana daily is enough to start the journey. There will be days when you may skip practice or take a break for a period of time, and that is completely fine. What truly matters is your ability to come back and continue. Yoga is not about perfection; it is about consistency and patience over time. As you stay committed, you slowly begin to notice your body responding. Strength starts building, flexibility follows naturally, and along with it comes a deep sense of mental calmness and inner peace that feels almost blissful.

Yoga, however, does not limit me to stillness alone. I also practice weight training and calisthenics, and together they create a balanced approach to fitness. Yoga enhances my mobility, body awareness, and control, while strength training helps me build power and endurance. This combination allows me to maintain both physical strength and inner balance.

When it comes to food, I do not follow a strict yogic diet because I believe there is no single approach that works for everyone. Each person has their own preferences, goals, and lifestyle. For me, it is important to maintain a balanced diet that supports my body without creating stress. I focus on eating nutritious meals with a good amount of protein and enjoy experimenting with recipes based on my taste and preference. I believe that if eating healthy feels restrictive or stressful, it will not be sustainable in the long run. Food should be something you enjoy, while also being mindful of the quantity and ensuring your nutrition aligns with your personal goals.

Many people associate age with limitations, but my experience has been the opposite. At the age of 36, I feel stronger, fitter, and in better shape than I was in my twenties. This has made me realize that age is often just a mindset. With determination, consistency, and patience, the body adapts and improves over time. It is never too late to start.

The most significant change yoga has brought into my life is not just physical, but mental and emotional. It has helped me reduce anger, lower my expectations from others, and develop a more compassionate perspective towards people. I have let go of unnecessary negativity and started focusing on spreading positivity. I find myself smiling more, holding less resentment, and making a conscious effort to be a better human being. Yoga has gradually transformed the way I think, feel, and live.

For me, yoga is not just something I practice on a mat. It is a way of life that continues to shape my actions, mindset, and interactions every single day.`,
    stat_1_number: '8+',
    stat_1_label: 'Years of Practice',
    stat_2_number: '500+',
    stat_2_label: 'Students Trained',
    stat_3_number: '50+',
    stat_3_label: 'Workshops Conducted',
    updated_at: '',
  }
}

function getFallbackContact(): ContactInfo {
  return {
    id: 1,
    whatsapp_number: '+919876543210',
    instagram_handle: '@vignesh_yoga',
    instagram_url: 'https://instagram.com/vignesh_yoga',
    email: 'vigneshyoga@email.com',
    phone: '+919876543210',
    location: 'India',
    updated_at: '',
  }
}

function getFallbackServices(): Service[] {
  return [
    {
      id: 1,
      title: "Personal Yoga Training",
      description: "Customized one-on-one sessions based on your goals and body needs",
      icon_name: "user",
      updated_at: ""
    },
    {
      id: 2,
      title: "Online Yoga Sessions",
      description: "Practice yoga from anywhere with guided online sessions",
      icon_name: "video",
      updated_at: ""
    },
    {
      id: 3,
      title: "Group Yoga Classes",
      description: "Experience energy and motivation through group sessions",
      icon_name: "users",
      updated_at: ""
    }
  ]
}
