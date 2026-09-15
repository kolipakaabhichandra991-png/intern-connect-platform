import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { LoginSchema } from "@/lib/validation";

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
      async authorize(rawCredentials) {
        if (!rawCredentials) return null;

        const validation = LoginSchema.safeParse(rawCredentials);
        if (!validation.success) {
          console.error("Login Validation Failed:", validation.error.format());
          throw new Error("Invalid input provided. Please check your credentials.");
        }

        const credentials = validation.data;
        if (!credentials.email || !credentials.password || !credentials.otp) {
           throw new Error("Invalid input provided. Please check your credentials.");
        }
        
        const user = await prisma.user.findFirst({
          where: { 
            email: {
              equals: credentials.email,
              mode: 'insensitive'
            },
            role: credentials.role === "ADMIN" ? "ADMIN" : "INTERN"
          }
        });

        if (user && user.passwordHash === credentials.password) {
          // Verify OTP
          if (user.otpCode !== credentials.otp) {
            throw new Error("Invalid OTP");
          }
          if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            throw new Error("OTP expired");
          }

          // Clear OTP after successful login
          await prisma.user.update({
            where: { id: user.id },
            data: { otpCode: null, otpExpiresAt: null }
          });

          return {
            id: user.id,
            email: user.email,
            role: user.role
          };
        }
        return null;
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
