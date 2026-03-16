// Supabase Client (ES Module version)
// For use with React / module-based imports
// Usage: import { supabase } from './supabaseClient.js'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ensedxerykbjxnzenabl.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuc2VkeGVyeWtianhuemVuYWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NzYzNzIsImV4cCI6MjA4NjM1MjM3Mn0.6g0u3qviXkmhBCfHgwBcVDd2UbvHXYyZKYB5N_QBK1c"

export const supabase = createClient(supabaseUrl, supabaseKey)
