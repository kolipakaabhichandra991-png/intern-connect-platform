import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // For this prototype, we're doing a simple string match
        // In production, ALWAYS use bcrypt to hash and compare passwords
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
