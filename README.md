# iffe-travels

This is a professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## Project Architecture & Development Phases

The creation of the Iffe-Travels platform was executed in five strategic phases to ensure a robust and scalable architecture:

1.  **Phase 1: Foundation & Infrastructure**: Establishing the Next.js App Router foundation, configuring Tailwind CSS for the design system, and initializing the Firebase SDK for real-time data and authentication.
2.  **Phase 2: Authentication & Security Framework**: Building a hybrid authentication layer using NextAuth.js for session lifecycle management and Firebase Auth for user identity. Implemented server-side Middleware to enforce Role-Based Access Control (RBAC).
3.  **Phase 3: Administrative Business Engine**: Developing the `/admin` suite to manage core business assets. This included creating Firestore-connected modules for live inventory, dynamic pricing, expedition itineraries, and promotional codes.
4.  **Phase 4: Traveller Experience & Storefront**: Designing the public-facing journey, featuring the cinematic "Explore the Pearl" hero sections, the logic-driven Custom Safari Builder, and real-time community engagement tools like the Traveler Chat.
5.  **Phase 5: Data Synchronization & Live Integration**: Finalizing the bridge between management controls and public views, ensuring that pricing updates and new tour content are published globally in real-time.

## Authentication & Account Handling Process

The platform utilizes a secure, JWT-based authentication flow designed for both traveler convenience and administrative security:

-   **Unified Identity Bridge**: We leverage NextAuth.js to provide a consistent session management layer, while using Firebase Auth as the authoritative user database.
-   **Role-Based Provisioning**: During the login handshake, the system evaluates credentials. Accounts matching the `NEXT_PUBLIC_ADMIN_EMAIL` are automatically provisioned with 'admin' privileges, while others default to the 'traveler' role.
-   **JWT Persistence**: Upon successful authentication, a JSON Web Token (JWT) is generated containing the user's ID and role. This token is securely persisted in an HTTP-only cookie to prevent unauthorized access.
-   **Middleware Gatekeeping**: All administrative routes under `/admin` are protected by a server-side gatekeeper (`middleware.ts`). This layer inspects the session JWT at the edge, redirecting any non-authorized users before they can access the business engine.

## Deployment to Vercel

To deploy this application to Vercel, follow these steps:

1.  **Push to GitHub**: Push your latest code changes to a GitHub repository.
2.  **Import to Vercel**: Connect your GitHub account to Vercel and import the project.
3.  **Environment Variables**: Add the following variables in Vercel Project Settings:
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `NEXT_PUBLIC_FIREBASE_APP_ID`
    *   `NEXT_PUBLIC_ADMIN_EMAIL` (e.g., admin@iffe-travels.com)
    *   `NEXTAUTH_SECRET` (A random secure string)
    *   `NEXTAUTH_URL` (Your production URL, e.g., https://your-app.vercel.app)
4.  **Firebase Configuration**:
    *   Go to Firebase Console > Build > Authentication > Settings > Authorized Domains.
    *   Add your Vercel deployment URL (e.g., `your-app.vercel.app`) to the list.

## Local Development

```bash
npm install
npm run dev
```

Your app will be running at [http://localhost:9002](http://localhost:9002).
