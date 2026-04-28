import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const supabaseClientProvider = {
  provide: SUPABASE_CLIENT,
  useFactory: (): SupabaseClient<any, any, 'public', any, any> => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
      );
    }

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  },
};
