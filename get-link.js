const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: 'kolipakaabhichandra991@gmail.com',
    options: {
      redirectTo: 'http://localhost:3000/api/auth/callback'
    }
  });

  if (error) console.error(error);
  else console.log("Magic Link:", data.properties.action_link);
}
run();
