import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json({ error: 'Missing email or role' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' }, role }
    });

    if (!user) {
      // Return success even if user not found for security reasons
      return NextResponse.json({ success: true });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiresAt: expiresAt }
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Belvo - Password Reset Verification',
      html: \
        <h2>Password Reset</h2>
        <p>Your verification code to reset your password is: <strong>\</strong></p>
        <p>This code expires in 10 minutes. If you didn't request a password reset, please ignore this email.</p>
      \
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
