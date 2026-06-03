import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// During build time, env vars may not be available.
// We create a dummy client that will fail at runtime if vars are missing.
let supabase;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} else {
  // Proxy that throws a helpful error on any method call at runtime
  supabase = new Proxy({}, {
    get(_, prop) {
      if (prop === 'from') {
        return () => new Proxy({}, {
          get() {
            return () => {
              throw new Error(
                'Supabase no configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY a .env.local'
              );
            };
          }
        });
      }
      return () => {};
    }
  });
}

export default supabase;
