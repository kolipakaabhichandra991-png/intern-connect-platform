import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, role, otp, newPassword } = await req.json();
    if (!email || !role || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' }, role }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid details' }, { status: 400 });
    }

    if (user.otpCode !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPassword, // Note: Should be hashed with bcrypt in prod
        otpCode: null,
        otpExpiresAt: null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
