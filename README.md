
# iffe-travels (e-Rotary Hub)

A professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## 🛠 Database Implementation Guide

The application is currently configured with a **Service Layer Architecture** (`src/lib/services/cms-service.ts`). This layer acts as a bridge between your UI and Firestore.

### Current Data Flow
1.  **Frontend**: Calls a function (e.g., `fetchCampaigns()`).
2.  **Service Layer**: Attempts to query the Firestore collection.
3.  **Fallback**: If Firestore is empty or unreachable, the service returns a hardcoded "Seed" array. This ensures the site never looks broken during implementation.

### Collection Mapping
| Feature | Firestore Collection | Admin Management |
| :--- | :--- | :--- |
| **Tours** | `/campaigns` | Admin > Expeditions |
| **Journal** | `/posts` | Admin > Content Moderation |
| **Gallery** | `/gallery` | Admin > Media Library |
| **Builder Items** | `/packages`, `/addons` | Admin > Inventory & Prices |
| **Announcements** | `/announcements` | Dashboard (Broadcasting) |
| **Private Docs** | `/user_documents` | Admin > User Management (Planned) |

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
