import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  console.log("Testing intern...");
  const res1 = await supabase.auth.signInWithPassword({ email: "intern@belvo.com", password: "password" });
  console.log(res1.error ? res1.error.message : "Success!");

  console.log("Testing admin...");
  const res2 = await supabase.auth.signInWithPassword({ email: "admin@belvo.com", password: "password" });
  console.log(res2.error ? res2.error.message : "Success!");
}
test();
