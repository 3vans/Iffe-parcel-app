
# e-Rotary Hub (iffe-travels)

A professional adventure tourism and community impact platform built with Next.js, Firebase, and Supabase.

## 🌟 Platform Vision
e-Rotary Hub (iffe-travels) is a hybrid ecosystem designed to bridge high-end safari experiences with community engagement. It serves as the official portal for the **Iffe Explorer's Club**, combining bespoke travel planning with crowdsourced community projects.

## 🏗 Core Architecture

### 1. The Expedition Engine (CMS)
- **Live Inventory**: Managed via `/campaigns_public`. Admins can update itineraries, pricing, and availability in real-time.
- **Bespoke Builder**: A dynamic pricing engine in the `/packages` and `/addons` collections that calculates group investment and applies "Wildlife Bundle" discounts.

### 2. The Community Layer (Social)
- **Idea Box**: Crowdsourcing destination suggestions via an atomic voting engine in `/ideas`.
- **Narrative Journal**: A moderated storytelling platform (`/posts_approved`) for travelers to share their experiences.
- **Real-time Hub**: Secure support and community channels via room-aware chat architecture in `/chatrooms`.

### 3. Media Strategy (Hybrid Storage)
- **Firestore**: Stores structured metadata, tags, captions, and real-time message streams.
- **Supabase Storage**: Hosts high-resolution binary objects (Photos and Videos) via the `media` bucket with specific RLS policies for public inserts.

## 🔐 Administrator Credentials
To access the Admin Panel (`/admin`), use these credentials:
- **Username**: `admin`
- **Email**: `admin@iffe-travels.com`
- **Password**: `ivan.ian`

## 🚀 Key Features
- **Custom Safari Builder**: Live configuration of dream trips with instant pricing feedback.
- **Visual Highlights**: An interactive, draggable "Film Strip" of top destinations on the home page.
- **AI Itinerary Summarizer**: Uses Genkit to distill long descriptions into concise highlights for quick reading.
- **Impact Dashboard**: Tracks traveler levels, points, and milestones to foster community growth.
