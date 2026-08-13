import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
  "https://sqmieonrtwhehrbdxwmd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_jABLiODsCqH2AzMmBNIpbQ_sqRMJ2h7";

export const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

export async function requireUser() {

  const {
    data: { user }
  } =
    await supabase.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return null;
  }

  return user;
}
