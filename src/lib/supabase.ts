import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
const isConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key');

// Log configuration status (only in browser, not during build)
if (typeof window !== 'undefined') {
  if (!isConfigured) {
    console.error('⚠️ Supabase not configured!');
    console.error('Missing environment variables:');
    if (!supabaseUrl) console.error('  - VITE_SUPABASE_URL');
    if (!supabaseAnonKey) console.error('  - VITE_SUPABASE_ANON_KEY');
    console.error('Please add these in Vercel: Settings → Environment Variables');
  } else {
    console.log('✅ Supabase configured successfully');
  }
}

// Create client with fallback empty strings to prevent crash
// The app will show errors when trying to use Supabase if env vars are missing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return isConfigured;
};

