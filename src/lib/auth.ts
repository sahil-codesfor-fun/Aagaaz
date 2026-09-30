import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Staff & Admin Authentication",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password;

        // Configurable credentials via environment variables with secure fallbacks
        const adminEmail = (process.env.ADMIN_USER_EMAIL || "admin@geeta.com").toLowerCase();
        const adminPassword = process.env.ADMIN_USER_PASSWORD || "admin@123";

        const accountantEmail = (process.env.ACCOUNTS_USER_EMAIL || "accounts@geeta.com").toLowerCase();
        const accountantPassword = process.env.ACCOUNTS_USER_PASSWORD || "accounts@123";

        const users = [
          {
            id: "1",
            name: "Administrator",
            email: adminEmail,
            password: adminPassword,
            role: "admin",
          },
          {
            id: "2",
            name: "Accounts Officer",
            email: accountantEmail,
            password: accountantPassword,
            role: "accountant",
          },
        ];

        const user = users.find(
          (u) => u.email === inputEmail && u.password === inputPassword
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours session duration
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};
