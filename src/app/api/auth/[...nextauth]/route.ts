import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { email } = credentials;
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@iffe-travels.com';
        
        // Use the logic from the reference: check if email matches admin
        const isAdmin = email.toLowerCase() === adminEmail.toLowerCase();
        
        // For the prototype, we allow the admin to log in with any password.
        // For travelers, we expect the frontend to have already verified them with Firebase Auth.
        return {
          id: isAdmin ? 'admin-uid' : 'traveler-' + Date.now(),
          name: isAdmin ? 'Platform Admin' : 'Iffe Traveler',
          email: email,
          role: isAdmin ? 'admin' : 'user',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };