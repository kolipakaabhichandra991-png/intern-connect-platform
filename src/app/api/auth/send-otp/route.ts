export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";
import { sendOTP } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, role, isRegister } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // If it's registration, we need to create the user in Supabase first (if they don't exist)
    if (isRegister) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(-10) + "A1!",
        email_confirm: true
      });

      if (authError && !authError.message.includes("already exists")) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      if (authData?.user) {
        // Create in Prisma
        await prisma.user.upsert({
          where: { id: authData.user.id },
          update: { role: role || "ADMIN" },
          create: { id: authData.user.id, email, role: role || "ADMIN" }
        });
      }
    }

    // Verify user exists
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    
    if (!user) {
      return NextResponse.json({ error: "Incorrect email" }, { status: 404 });
    }

    // Ensure the requested login role matches the user's actual role in the database
    if (!isRegister && role && user.role !== role) {
      return NextResponse.json({ error: "Incorrect email" }, { status: 403 });
    }
  

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save to DB
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry: expiresAt }
    });

    // Send email
    await sendOTP(email, otp); const emailSent = true;

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
