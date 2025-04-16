import { createClient } from '@supabase/supabase-js';

// Este cliente só deve ser usado em funções de servidor (API routes, Server Actions, etc)
// NUNCA no cliente (navegador)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); 