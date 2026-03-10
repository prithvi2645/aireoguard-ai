// Supabase Configuration for AeroGuard AI
const SUPABASE_URL = 'https://ensedxerykbjxnzenabl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuc2VkeGVyeWtianhuemVuYWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NzYzNzIsImV4cCI6MjA4NjM1MjM3Mn0.6g0u3qviXkmhBCfHgwBcVDd2UbvHXYyZKYB5N_QBK1c';

// Initialize Supabase client using the global from the CDN bundle
// The UMD bundle exposes: window.supabase.createClient
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('[AeroGuard] Supabase client initialized:', typeof supabaseClient.auth);
