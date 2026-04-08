
# iffe-travels (e-Rotary Hub)

A professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## 🏗 Database Implementation Roadmap

The application uses a **Hybrid-Storage Architecture**:
- **Firebase Firestore**: Structured content, metadata, real-time messaging, and user profiles.
- **Firebase Authentication**: User identity management.
- **Supabase Storage**: Large binary objects (Photos, Videos, PDF Documents).

### Implementation Phases

1.  **Phase 1: Setup & User Profiles (DONE ✅)**
    *   Integrated Firebase Auth.
    *   Established the `/users` collection with automated profile generation.

2.  **Phase 2: Expedition Management (DONE ✅)**
    *   Migrated static tour data to `/campaigns_public`.
    *   Implemented full Admin CRUD logic for tour itineraries.

3.  **Phase 3: Media & Narrative (DONE ✅)**
    *   Implemented live `/posts_approved` (Journal) and `/gallery`.
    *   Enabled Admin moderation for stories and images.

4.  **Phase 4: Custom Builder & Inventory (DONE ✅)**
    *   Populated `/packages` and `/addons` collections.
    *   Connected the `CustomSafariBuilder` to dynamic pricing and bundle logic.
    *   Added `/custom_bookings` to capture bespoke trip requests.

5.  **Phase 5: Real-time Interaction**
    *   Finalize the `/chatrooms` message streams.
    *   Implement the `/ideas` voting engine for community destination suggestions.

## 🔐 Administrator Credentials
To access the Admin Panel (`/admin`), use these credentials:
- **Email**: `admin@iffe-travels.com`
- **Password**: `admin123` (Suggested)

## 🚀 Key Features
- **Custom Safari Builder**: A live pricing engine for bespoke trips with bundle discounts.
- **Visual Highlights**: An interactive, draggable "Film Strip" of top destinations.
- **Idea Box**: Community-driven destination voting.
- **User Dashboard**: Secure access to personal itineraries and support.
