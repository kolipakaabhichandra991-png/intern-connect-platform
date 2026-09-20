import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
async function list() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) console.error(error);
  else console.log(data.users.map(u => ({ email: u.email, id: u.id, confirmed_at: u.confirmed_at })));
}
list();
