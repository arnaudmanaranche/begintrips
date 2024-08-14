import { createClient as createClientPrimitive } from '@supabase/supabase-js'
import { type Database } from './database.types'

export function createClient() {
  const supabase = createClientPrimitive<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
}
