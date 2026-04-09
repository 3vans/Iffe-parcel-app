'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Add a more helpful warning for placeholders
if (!supabaseUrl || supabaseUrl.includes('your-supabase-url') || !supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
  if (typeof window !== 'undefined') {
    console.warn("Supabase Warning: Using placeholder credentials. Media uploads will fail until you update your .env file with actual keys from your Supabase Dashboard.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
