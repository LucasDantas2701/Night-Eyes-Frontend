import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environments';

if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definido no .env');
}

export const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
