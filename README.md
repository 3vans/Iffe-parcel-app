
# iffe-travels (e-Rotary Hub)

A professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## 🏗 Database Implementation Roadmap

The application uses a **Hybrid-Storage Architecture**:
- **Firebase Firestore**: Structured content, metadata, real-time messaging, and user profiles.
- **Firebase Authentication**: User identity management.
- **Supabase Storage**: Large binary objects (Photos, Videos, PDF Documents).

### Implementation Phases

1.  **Phase 1: Setup & User Profiles**
    *   Integrate Firebase Auth.
    *   Establish the `/users` collection.
    *   *Supabase Goal*: Handle profile picture uploads.

2.  **Phase 2: Expedition Management**
    *   Migrate static tour data to `/campaigns_public`.
    *   Implement Admin CRUD logic for tour itineraries.

3.  **Phase 3: Community Content**
    *   Implement `/posts_approved` (Journal) and `/gallery`.
    *   *Supabase Goal*: All high-res safari imagery.

4.  **Phase 4: Custom Builder & Inventory**
    *   Populate `/packages` and `/addons`.
    *   Connect the `CustomSafariBuilder` to dynamic pricing data.

5.  **Phase 5: Real-time Interaction**
    *   Finalize the `/chatrooms` message streams.
    *   Implement the `/ideas` voting engine.

## 🔐 Administrator Credentials
To access the Admin Panel (`/admin`), use these credentials:
- **Email**: `admin@iffe-travels.com`
- **Password**: `admin123` (Suggested)

**Setup Steps**:
1. Go to the Firebase Console > Build > Authentication.
2. Add a new user with the email above.
3. Once logged in, the system will automatically recognize the email and grant access to the `/admin` suite.

## 🚀 Key Features
- **Custom Safari Builder**: A layered pricing engine for bespoke trips.
- **Visual Highlights**: An interactive, draggable "Film Strip" of top destinations.
- **Idea Box**: Community-driven destination voting.
- **User Dashboard**: Secure access to personal itineraries and support.
