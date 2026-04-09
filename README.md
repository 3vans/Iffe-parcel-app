
# iffe-travels (Expedition Engine)

A professional tour agency management and community impact platform built with Next.js, Firebase, and Supabase.

## 🌍 Agency Vision
iffe-travels is a hybrid ecosystem designed to bridge high-end safari experiences with community engagement. It serves as the primary portal for travelers to discover, customize, and book bespoke adventures in the Pearl of Africa.

## 🏗 Admin Capabilities

### 1. Expedition CMS (`/admin/expeditions`)
- **Live Itineraries**: Manage the `/campaigns_public` collection to update tour descriptions, regions, and visuals.
- **Rich Data**: Admins control all highlights, storyteller narratives, and tour status.

### 2. Inventory & Dynamic Pricing (`/admin/inventory`)
- **Foundation Packages**: Edit the base `/packages` that form the starting point for all safaris.
- **Addon Ecosystem**: Manage individual activity prices in `/addons` (e.g., Gorilla permits, boat cruises). 
- **Real-time Synchronization**: Updates to inventory reflect instantly in the traveler's **Custom Safari Builder**.

### 3. Community Moderation
- **Journal Approvals**: Moderate submitted travel stories in `/posts_approved`.
- **Support Channels**: Real-time interaction with travelers via `/chatrooms`.
- **Idea Box**: Track and implement community-suggested destinations from `/ideas`.

## 🔐 Administrator Credentials
To access the Agency Admin Dashboard (`/admin`), use these credentials:
- **Email**: `admin@iffe-travels.com`
- **Password**: `ivan.ian`

## 🚀 Core Technologies
- **Next.js 15**: Performance-first App Router architecture.
- **Firestore**: Real-time agency inventory and traveler profiles.
- **Supabase Storage**: High-resolution binary asset hosting for safari visuals.
- **Genkit AI**: Intelligent itinerary summarization.
