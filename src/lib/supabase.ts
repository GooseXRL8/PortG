import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // If variables are missing during SSR/build of static routes, we avoid throwing immediately
  // to avoid build breakages, but we log or return a fallback when used.
  if (typeof window !== "undefined") {
    console.warn("Variáveis de ambiente do Supabase estão ausentes. Certifique-se de configurar .env.local");
  }
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
