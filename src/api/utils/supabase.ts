import { createClient } from '@supabase/supabase-js'

const options = {}

export const supabase = createClient(
  process.env.DATABASE_URL as string,
  process.env.DATABASE_KEY as string,
  options
)
