'use client';

import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values during build/prerendering to prevent "supabaseUrl is required" error
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined') {
    console.warn("Supabase Warning: Missing credentials. Media uploads will fail until you update your .env file.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
