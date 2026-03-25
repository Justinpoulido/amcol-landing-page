import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  hasSupabaseAdminConfig,
  hasSupabaseReadConfig,
  supabasePublishableKey,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "@/lib/supabase/config";

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};

export function createSupabaseReadClient() {
  if (!hasSupabaseReadConfig() || !supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase read access is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey, clientOptions);
}

export function createSupabaseAdminClient() {
  if (!hasSupabaseAdminConfig() || !supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Supabase admin access is not configured. Set SUPABASE_SERVICE_ROLE_KEY on the server.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, clientOptions);
}
