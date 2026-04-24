import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
          setIsAdmin(!!user)
          setLoading(false)
        }
      } catch {
        if (mounted) setLoading(false)
      }
    }

    getUser()

    let listener: any = null
    try {
      const result = supabase.auth.onAuthStateChange(
        (_event: any, session: any) => {
          setUser(session?.user ?? null)
          setIsAdmin(!!session?.user)
        }
      )
      listener = result.data
    } catch {
      // Auth state change not available
    }

    return () => {
      mounted = false
      if (listener?.subscription) {
        try { listener.subscription.unsubscribe() } catch {}
      }
    }
    
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.') }
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error }
    } catch (e: any) {
      return { data: null, error: e }
    }
  }, [])

  const signOut = useCallback(async () => {
    try { await supabase.auth.signOut() } catch {}
    setUser(null)
    setIsAdmin(false)
  }, [])

  return { user, isAdmin, loading, signIn, signOut }
}
