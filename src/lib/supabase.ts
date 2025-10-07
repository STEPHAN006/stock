import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  browserClient = createClient(url, anonKey)
  return browserClient
}

let serverClient: SupabaseClient | null = null

export function getSupabaseServer(): SupabaseClient {
  if (serverClient) return serverClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  serverClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  return serverClient
}


