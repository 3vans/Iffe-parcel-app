
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user data (replace with database logic later)
const users = [
  { id: '1', name: 'Test User', email: 'test@example.com', password: 'password', role: 'user' },
  { id: '2', name: 'Admin User', email: 'admin@rtry.com', password: 'password1234567', role: 'admin' },
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
        if (!credentials?.email || !credentials.password) {
          return null; // Credentials not provided
        }

        const { email, password } = credentials;

        const user = users.find(u => u.email === email);

        if (!user) {
          return null; // User not found
        }

        // Check if the password matches
        if (user.password === password) {
          // If credentials are valid, return the user object
          // Ensure the returned object includes all necessary fields for your session/JWT callbacks
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Crucial for role-based access
          };
        }
        
        return null; // Password does not match
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

