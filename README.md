# iffe-travels

This is a professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## Administrator Credentials (Prototype)
To access the Admin Panel (/admin), use the following credentials:
- **Email**: `admin@iffe-travels.com`
- **Password**: `admin123` 

### Setup Instructions
1. **Firebase Console**: Go to the [Firebase Console](https://console.firebase.google.com/).
2. **Authentication**: Select your project, go to **Build > Authentication > Users**.
3. **Add User**: Click "Add user", enter the email `admin@iffe-travels.com` and the password `admin123`.
4. **Login**: Use these credentials in the app's login modal. The system will automatically recognize the email and route you to the `/admin` dashboard.

## Project Architecture & Strategic Phases

The creation of the Iffe-Travels platform follows five strategic phases:

1.  **Phase 1: Foundation & Infrastructure**: Establishing the Next.js App Router foundation and direct Firebase initialization.
2.  **Phase 2: Authentication & Security Framework**: Utilizing a custom `AuthContext.tsx` for real-time session management. Role-based redirects are performed client-side based on the administrator email defined in the environment.
3.  **Phase 3: Traveler Experience (The Dashboard)**: A centralized `/dashboard` for travelers featuring announcements, secure document access, and support chat.
4.  **Phase 4: Administrative Business Engine**: The `/admin` suite for managing tours, pricing, and content. This connects directly to Firestore collections defined in `docs/backend.json`.
5.  **Phase 5: Data Synchronization**: Ensuring that tour itineraries and pricing managed in the Admin panel are reflected instantly on the public storefront.

## Local Development

```bash
npm install
npm run dev
```

Your app will be running at [http://localhost:9002](http://localhost:9002).