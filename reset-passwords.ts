import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
async function reset() {
  await supabase.auth.admin.updateUserById('2904084d-a2ca-4e06-bc20-d8c2d96dc032', { password: 'password' });
  await supabase.auth.admin.updateUserById('f59b81ba-989f-4aa5-9b61-f10da70475a5', { password: 'password' });
  console.log("Passwords forcibly reset to 'password'");
}
reset();
