
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
        const user = users.find(u => u.email === credentials.email);

        // IMPORTANT: In a real application, you MUST hash and compare passwords securely.
        // This is a simplified example using plain text passwords for demonstration.
        if (user && user.password === credentials.password) {
          // Return a user object that NextAuth can use
          // Add any other user properties you want in the session here
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
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

