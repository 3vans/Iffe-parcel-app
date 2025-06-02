
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user data (replace with database logic later)
const users = [
  { id: '1', name: 'Test User', email: 'test@example.com', password: 'password', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        
        const inputEmail = credentials.email;
        const inputPassword = credentials.password;

        // Explicitly check for admin credentials first
        if (inputEmail === 'admin@example.com' && inputPassword === 'password') {
          const adminUserDetails = users.find(u => u.email === 'admin@example.com' && u.role === 'admin');
          if (adminUserDetails) {
            return { // Return the expected user object structure
              id: adminUserDetails.id,
              name: adminUserDetails.name,
              email: adminUserDetails.email,
              role: adminUserDetails.role,
            };
          } else {
            // This case implies an issue with the predefined 'users' array if admin credentials are correct but user isn't found.
            return null; 
          }
        }

        // Fallback logic for other users based on credentials provided
        const regularUser = users.find(u => u.email === inputEmail);
        if (regularUser && regularUser.password === inputPassword) {
          return {
            id: regularUser.id,
            name: regularUser.name,
            email: regularUser.email,
            role: regularUser.role,
          };
        }
        
        // If no credentials match (admin or regular user)
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user ID and role to the JWT
      if (user) {
        token.id = user.id;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect to home page for sign in, modals will handle actual display
    error: '/', // Redirect to home on error, error messages can be handled in UI
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
