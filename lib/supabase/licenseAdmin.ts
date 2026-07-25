import { createClient } from "@supabase/supabase-js";

export function createLicenseAdminClient() {
  const supabaseUrl =
    process.env.LICENSE_SUPABASE_URL?.trim() || "";

  const serviceRoleKey =
    process.env.LICENSE_SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

  if (!supabaseUrl) {
    throw new Error("Missing LICENSE_SUPABASE_URL.");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing LICENSE_SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}