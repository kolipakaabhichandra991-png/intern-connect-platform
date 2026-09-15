import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/validation";
import { accountLockoutCache, sendLockoutEmail } from "@/lib/authRateLimit";

// In-memory cache for IP Rate Limiting (10 requests per minute)
const ipRateLimitCache = new Map<string, { count: number, windowStart: number }>();

const getIp = (req: any) => {
  if (req?.headers?.['x-forwarded-for']) {
    return req.headers['x-forwarded-for'].split(',')[0];
  }
  return 'unknown-ip';
};

const checkIpRateLimit = (ip: string) => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  let record = ipRateLimitCache.get(ip);
  if (!record || now - record.windowStart > windowMs) {
    record = { count: 0, windowStart: now };
  }

  record.count += 1;
  ipRateLimitCache.set(ip, record);

  if (record.count > maxRequests) {
    throw new Error("GenericAuthError");
  }
};

const checkAccountLockout = async (email: string) => {
  const now = Date.now();
  let record = accountLockoutCache.get(email);
  
  if (record) {
    // If locked, check if 15 min has passed
    if (record.lockedUntil && now < record.lockedUntil) {
      throw new Error("GenericAuthError");
    }
    
    // If lock expired, we can reset it or keep it until successful login
    if (record.lockedUntil && now >= record.lockedUntil) {
      record.lockedUntil = null;
      record.count = 0;
      accountLockoutCache.set(email, record);
    }
    
    // Progressive delay for failed attempts (before lockout)
    if (record.count > 0 && !record.lockedUntil) {
      const delayMs = record.count * 1000; // 1s per failed attempt
      const timeSinceLastAttempt = now - record.lastAttempt;
      if (timeSinceLastAttempt < delayMs) {
        await new Promise(res => setTimeout(res, delayMs - timeSinceLastAttempt));
      }
    }
  }
};

const handleFailedAttempt = async (email: string) => {
  let record = accountLockoutCache.get(email) || { count: 0, lockedUntil: null, lastAttempt: Date.now() };
  record.count += 1;
  record.lastAttempt = Date.now();

  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
    accountLockoutCache.set(email, record);
    // Send email notification on lockout in the background
    sendLockoutEmail(email).catch(console.error);
    throw new Error("GenericAuthError");
  } else {
    accountLockoutCache.set(email, record);
    throw new Error("GenericAuthError");
  }
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(rawCredentials, req) {
        if (!rawCredentials) return null;
        
        const ip = getIp(req);

        try {
          // 1. IP Rate Limiting
          checkIpRateLimit(ip);

          // 2. Validate & Sanitize Input
          const validation = LoginSchema.safeParse(rawCredentials);
          if (!validation.success) {
            console.error("Login Validation Failed:", validation.error.format());
            throw new Error("GenericAuthError");
          }
          const credentials = validation.data;
          
          if (!credentials.email || !credentials.password) {
             throw new Error("GenericAuthError");
          }

          // 3. Check Account Lockout & Progressive Delay
          await checkAccountLockout(credentials.email);
          
          // 4. Fetch User
          const user = await prisma.user.findFirst({
            where: { 
              email: {
                equals: credentials.email,
                mode: 'insensitive'
              },
              role: credentials.role === "ADMIN" ? "ADMIN" : "INTERN"
            }
          });

          if (!user || user.passwordHash !== credentials.password) {
            await handleFailedAttempt(credentials.email);
          }

          // Verify OTP if provided
          if (credentials.otp) {
            if (user?.otpCode !== credentials.otp || !user?.otpExpiresAt || user?.otpExpiresAt < new Date()) {
              await handleFailedAttempt(credentials.email);
            }
            await prisma.user.update({
              where: { id: user!.id },
              data: { otpCode: null, otpExpiresAt: null }
            });
          }

          // 5. Success - Reset failed attempts
          accountLockoutCache.delete(credentials.email);

          return {
            id: user!.id,
            email: user!.email,
            role: user!.role
          };
        } catch (error: any) {
          if (error.message === "GenericAuthError") {
             throw new Error("Invalid login attempt. Please try again later.");
          }
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-prototype-key-do-not-use-in-prod"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
