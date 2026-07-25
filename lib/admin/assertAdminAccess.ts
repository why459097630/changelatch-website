import { createClient as createServerClient } from "@/lib/supabase/server";

export async function assertAdminAccess() {
  const authClient = await createServerClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return {
      ok: false as const,
      status: 401,
      error: "Unauthorized.",
      user: null,
    };
  }

  const emailAllowlistRaw =
    process.env.ADMIN_EMAIL_ALLOWLIST?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    "";

  const userIdAllowlistRaw = process.env.ADMIN_USER_IDS?.trim() || "";

  const emailAllowlist = emailAllowlistRaw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const userIdAllowlist = userIdAllowlistRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const currentEmail = (user.email || "").trim().toLowerCase();

  if (userIdAllowlist.length > 0) {
    return {
      ok: userIdAllowlist.includes(user.id),
      status: userIdAllowlist.includes(user.id) ? 200 : 403,
      error: userIdAllowlist.includes(user.id) ? null : "Forbidden.",
      user,
    };
  }

  if (emailAllowlist.length > 0) {
    return {
      ok: emailAllowlist.includes(currentEmail),
      status: emailAllowlist.includes(currentEmail) ? 200 : 403,
      error: emailAllowlist.includes(currentEmail) ? null : "Forbidden.",
      user,
    };
  }

  return {
    ok: false as const,
    status: 403,
    error: "Forbidden.",
    user: null,
  };
}