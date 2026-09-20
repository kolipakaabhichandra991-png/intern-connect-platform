import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, department, photoUrl } = await req.json();
    
    // Find the current admin if they are logged in
    const session = await getServerSession();
    let currentAdminId = null;
    if (session && session.user && session.user.role === "ADMIN") {
      currentAdminId = session.user.id;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. The trigger creates the User row, but we need to create the InternProfile
    // Give the trigger a moment to run
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update role if needed
    await prisma.user.upsert({
      where: { id: userId },
      update: { role: role || "INTERN" },
      create: { id: userId, email, role: role || "INTERN" }
    });

    if (role === "INTERN") {
      await prisma.internProfile.upsert({
        where: { userId },
        update: {
          name,
          department,
          photoUrl: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
          ...(currentAdminId ? { adminId: currentAdminId } : {})
        },
        create: {
          userId,
          name,
          department: department || "Engineering",
          photoUrl: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
          designation: "Intern",
          xp: 0,
          dob: new Date(),
          teamName: "New Joiners",
          idCardNumber: "BEL-" + Math.floor(Math.random() * 10000).toString(),
          ...(currentAdminId ? { adminId: currentAdminId } : {})
        }
      });
    }

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
