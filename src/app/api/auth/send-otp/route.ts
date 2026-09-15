import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOTP } from '@/lib/mailer';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        email: { equals: email, mode: 'insensitive' },
        role: role === 'ADMIN' ? 'ADMIN' : 'INTERN'
      }
    });

    let isPasswordValid = false;
    if (user) {
      const { isHashed, verifyPassword } = await import("@/lib/hash");
      if (isHashed(user.passwordHash)) {
        isPasswordValid = await verifyPassword(password, user.passwordHash);
      } else {
        isPasswordValid = user.passwordHash === password;
      }
    }

    if (!user || !isPasswordValid) {
      return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 });
    }

    // Generate 6 digit OTP
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes from now

    // Save to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt: expiresAt
      }
    });

    // Send email
    const emailSent = await sendOTP(user.email, otp);

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
