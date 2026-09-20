import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function confirmAll() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(error);
    return;
  }
  
  for (const user of data.users) {
    if (!user.email_confirmed_at) {
      console.log(`Confirming ${user.email}...`);
      await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });
    }
  }
  console.log("All users have been confirmed!");
}

confirmAll();
