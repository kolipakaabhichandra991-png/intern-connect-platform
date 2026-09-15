import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

// In-memory caches
export const accountLockoutCache = new Map<string, { count: number, lockedUntil: number | null, lastAttempt: number }>();

export const sendLockoutEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });
    if (!user) return; // Security: Don't leak

    // We generate an OTP or just provide the reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const resetLink = `http://localhost:3000/login?reset=true`;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Belvo - Security Alert: Account Locked',
      html: `
        <h2>Security Alert</h2>
        <p>Your account has been locked for 15 minutes due to too many failed login attempts.</p>
        <p>If you forgot your password, you can reset it here: <a href="${resetLink}">Reset Password</a></p>
        <p>If you did not attempt to log in, please contact security immediately.</p>
      `
    });
  } catch (error) {
    console.error("Failed to send lockout email:", error);
  }
};
