'use client';

import { db } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  updateDoc,
  where,
  getDoc,
  limit,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  setDoc,
  type DocumentData,
  type CollectionReference,
  type DocumentReference
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

// --- UTILITIES ---

/**
 * Recursively removes undefined values from an object,
 * as Firestore does not allow them in setDoc/updateDoc.
 */
function cleanData(obj: any): any {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date || obj?.toDate) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  }

  const cleaned: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined) {
      cleaned[key] = cleanData(value);
    }
  });
  return cleaned;
}

// --- TYPES ---

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  profilePictureUrl?: string;
  isCreator: boolean;
  isAdmin: boolean;
  points: number;
  level: string;
  memberSince: string;
  followedUserIds: string[];
  createdAt: any;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
  date?: string;
  tags: string[];
  storagePath?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  dataAiHint?: string;
  commentCount: number;
  status: 'Published' | 'Hidden' | 'Reported';
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  dataAiHint: string;
  youtubeVideoId: string;
  category: string;
  duration?: string;
}

export interface Campaign {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  region: 'Western' | 'Eastern' | 'Northern' | 'Central' | 'Other';
  goal: number;
  currentAmount: number;
  tags: string[];
  featured?: boolean;
  storyline?: string[];
  organizer?: string;
  volunteersNeeded?: number;
  volunteersSignedUp?: number;
  activities?: any[];
  accommodation?: any[];
  meals?: any[];
  bookingTips?: string[];
  endDate?: string;
  status?: 'active' | 'completed' | 'cancelled';
}

export interface Departure {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Online' | 'Offline' | 'Hybrid';
  excerpt: string;
  fullDescription: string;
  imageUrl: string;
  dataAiHint?: string;
  rsvpLink?: string;
  calendarLink?: string;
  createdAt?: any;
}

export interface ItinerarySection {
  id: string;
  type: 'text' | 'image';
  content: string;
  imageLayout?: 'small' | 'full';
}

export interface ItineraryItem {
  day: number;
  activity: string;
  sections: ItinerarySection[];
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  basePrice: number;
  priceDescription: string;
  durationDays: number;
  durationText: string;
  features: string[];
  whatsIncluded?: string[];
  imageUrl: string;
  dataAiHint?: string;
  isPopular?: boolean;
  isActive: boolean;
  includedTours: string[];
  itineraryTitle?: string;
  sampleItinerary: ItineraryItem[];
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  category: 'activity' | 'luxury' | 'extension';
  subCategory?: 'Wildlife' | 'Adventure' | 'Culture' | 'Nature & Scenic';
  region?: 'Central' | 'Western' | 'Eastern' | 'Northern';
  bundleEligible?: boolean;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  dateSubmitted: string;
  votes: number;
  voters: string[];
  status: 'New' | 'Under Review' | 'Approved' | 'Implemented';
  imageUrl?: string;
  dataAiHint?: string;
  commentsCount: number;
}

export interface Chatroom {
  id: string;
  name: string;
  topic: string;
  userCount: number;
  lastActivity: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  createdAt: any;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
}

// --- CONSTANTS ---
const CAMPAIGNS_COLLECTION = 'campaigns_public';
const DEPARTURES_COLLECTION = 'departures';
const POSTS_COLLECTION = 'posts_approved';
const GALLERY_COLLECTION = 'gallery';
const CHATROOMS_COLLECTION = 'chatrooms';
const IDEAS_COLLECTION = 'ideas';
const PACKAGES_COLLECTION = 'packages';
const ANNOUNCEMENTS_COLLECTION = 'announcements';

// --- HELPER FOR PERMISSION ERRORS ---

function handleFirestoreError(error: any, context: SecurityRuleContext) {
  console.error(`Firestore Error at ${context.path}:`, error);
  if (error.code === 'permission-denied' || error.message?.includes('permission')) {
    const permissionError = new FirestorePermissionError(context);
    errorEmitter.emit('permission-error', permissionError);
  }
}

// --- USER PROFILE SERVICES ---

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        memberSince: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Recently'
      } as UserProfile;
    }
  } catch (error) {
    handleFirestoreError(error, { path: docRef.path, operation: 'get' });
  }
  return null;
}

export function createUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  const profile: Partial<UserProfile> = cleanData({
    email: data.email || '',
    displayName: data.displayName || 'Iffe Traveler',
    username: data.username || data.email?.split('@')[0] || `user_${userId.substring(0, 5)}`,
    bio: data.bio || 'New explorer at iffe-travels.',
    isCreator: data.isCreator || false,
    isAdmin: data.isAdmin || false,
    points: 0,
    level: 'Novice Explorer',
    followedUserIds: [],
    createdAt: serverTimestamp(),
    ...data
  });
  
  return setDoc(userRef, profile).catch(err => handleFirestoreError(err, { path: userRef.path, operation: 'write', requestResourceData: profile }));
}

// --- ANNOUNCEMENTS ---

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const q = query(collection(db, ANNOUNCEMENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
  } catch (error) {
    handleFirestoreError(error, { path: ANNOUNCEMENTS_COLLECTION, operation: 'list' });
    return [];
  }
}

export function saveAnnouncement(announcement: Partial<Announcement>) {
  const colRef = collection(db, ANNOUNCEMENTS_COLLECTION);
  const newRef = doc(colRef);
  const newData = cleanData({ ...announcement, id: newRef.id, createdAt: serverTimestamp() });
  return setDoc(newRef, newData).catch(err => handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData }));
}

export function deleteAnnouncement(id: string) {
  const ref = doc(db, ANNOUNCEMENTS_COLLECTION, id);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

// --- BUILDER & AGENCY PACKAGES SERVICES ---

export async function fetchBasePackages(): Promise<Package[]> {
  try {
    const q = query(collection(db, PACKAGES_COLLECTION), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
  } catch (error) {
    handleFirestoreError(error, { path: PACKAGES_COLLECTION, operation: 'list' });
    return [];
  }
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  try {
    const q = query(collection(db, PACKAGES_COLLECTION), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as Package;
  } catch (error) {
    handleFirestoreError(error, { path: PACKAGES_COLLECTION, operation: 'list' });
    return null;
  }
}

export function savePackage(pkg: Partial<Package>) {
  const cleanedPkg = cleanData(pkg);
  if (pkg.id) {
    const pkgRef = doc(db, PACKAGES_COLLECTION, pkg.id);
    const updateData = { ...cleanedPkg, updatedAt: serverTimestamp() };
    return updateDoc(pkgRef, updateData).catch(err => handleFirestoreError(err, { path: pkgRef.path, operation: 'update', requestResourceData: updateData }));
  } else {
    const colRef = collection(db, PACKAGES_COLLECTION);
    const newRef = doc(colRef);
    const newData = { 
      ...cleanedPkg, 
      id: newRef.id,
      isActive: true, 
      slug: pkg.slug || pkg.name?.toLowerCase().replace(/\s+/g, '-') || `package-${Date.now()}`,
      createdAt: serverTimestamp() 
    };
    return setDoc(newRef, newData).catch(err => handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData }));
  }
}

export function deletePackage(id: string) {
  const pkgRef = doc(db, PACKAGES_COLLECTION, id);
  return deleteDoc(pkgRef).catch(err => handleFirestoreError(err, { path: pkgRef.path, operation: 'delete' }));
}

export async function fetchAddons(): Promise<Addon[]> {
  try {
    const q = query(collection(db, 'addons'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Addon));
  } catch (error) {
    handleFirestoreError(error, { path: 'addons', operation: 'list' });
    return [];
  }
}

export function saveAddon(addon: Partial<Addon>) {
  const cleanedAddon = cleanData(addon);
  if (addon.id) {
    const addonRef = doc(db, 'addons', addon.id);
    const updateData = { ...cleanedAddon, updatedAt: serverTimestamp() };
    return updateDoc(addonRef, updateData).catch(err => handleFirestoreError(err, { path: addonRef.path, operation: 'update', requestResourceData: updateData }));
  } else {
    const colRef = collection(db, 'addons');
    const newRef = doc(colRef);
    const newData = { ...cleanedAddon, id: newRef.id, isActive: true, createdAt: serverTimestamp() };
    return setDoc(newRef, newData).catch(err => handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData }));
  }
}

export function deleteAddon(id: string) {
  const addonRef = doc(db, 'addons', id);
  return deleteDoc(addonRef).catch(err => handleFirestoreError(err, { path: addonRef.path, operation: 'delete' }));
}

export function calculatePricing(basePackage: Package, selectedAddons: Addon[], numPeople: number = 1) {
  const basePrice = basePackage.basePrice;
  const addonsTotalPerPerson = selectedAddons.reduce((sum, addon) => sum + (addon.price || 0), 0);
  
  let discountAmountPerPerson = 0;
  const hasGorilla = selectedAddons.some(a => a.id === 'gorilla');
  const hasChimp = selectedAddons.some(a => a.id === 'chimp');
  
  if (hasGorilla && hasChimp) {
    const wildlifeItems = selectedAddons.filter(a => a.id === 'gorilla' || a.id === 'chimp');
    const wildlifeSum = wildlifeItems.reduce((sum, item) => sum + (item.price || 0), 0);
    discountAmountPerPerson = wildlifeSum * 0.05;
  }

  const finalPerPerson = basePrice + addonsTotalPerPerson - discountAmountPerPerson;
  const finalTotal = finalPerPerson * numPeople;
  
  const tier = finalTotal > 10000 ? 'elite' : 'standard';

  return {
    basePrice,
    addonsTotal: addonsTotalPerPerson,
    discountAmount: discountAmountPerPerson,
    perPersonTotal: finalPerPerson,
    finalTotal,
    tier
  };
}

export function saveCustomBooking(data: any) {
  const cleanedData = cleanData(data);
  const colRef = collection(db, 'custom_bookings');
  const newRef = doc(colRef);
  const newData = { ...cleanedData, id: newRef.id, createdAt: serverTimestamp() };
  return setDoc(newRef, newData).catch(err => {
    handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData });
  });
}

// --- PROMOTIONS ---

export async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const q = query(collection(db, 'promotions'), orderBy('endDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
  } catch (error) {
    handleFirestoreError(error, { path: 'promotions', operation: 'list' });
    return [];
  }
}

export function savePromotion(promo: Partial<Promotion>) {
  const cleanedPromo = cleanData(promo);
  if (promo.id) {
    const ref = doc(db, 'promotions', promo.id);
    const updateData = { ...cleanedPromo, updatedAt: serverTimestamp() };
    return updateDoc(ref, updateData).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'update', requestResourceData: updateData }));
  } else {
    const colRef = collection(db, 'promotions');
    const newRef = doc(colRef);
    const newData = { ...cleanedPromo, id: newRef.id, isActive: true, createdAt: serverTimestamp() };
    return setDoc(newRef, newData).catch(err => handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData }));
  }
}

export function deletePromotion(id: string) {
  const ref = doc(db, 'promotions', id);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

// --- GALLERY (Hybrid Firestore + Supabase) ---

export async function uploadGalleryImage(file: File, metadata: { caption?: string, tags?: string, dataAiHint?: string }) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { data, error: uploadError } = await supabase.storage
    .from('blobs')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Supabase Error: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage.from('blobs').getPublicUrl(filePath);
  const tagsArray = metadata.tags ? metadata.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`).filter(t => t.length > 1) : [];
  
  const colRef = collection(db, GALLERY_COLLECTION);
  const newRef = doc(colRef);
  const newData = cleanData({
    id: newRef.id,
    src: publicUrl,
    alt: metadata.caption || 'Gallery Image',
    caption: metadata.caption || '',
    tags: tagsArray,
    dataAiHint: metadata.dataAiHint || 'safari photo',
    storagePath: filePath,
    createdAt: serverTimestamp(),
  });

  await setDoc(newRef, newData).catch(err => {
    handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData });
  });
  
  return { id: newRef.id, src: publicUrl };
}

export function updateGalleryImage(id: string, metadata: { caption?: string, tags?: string, dataAiHint?: string }) {
  const ref = doc(db, GALLERY_COLLECTION, id);
  const tagsArray = metadata.tags ? metadata.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`).filter(t => t.length > 1) : [];
  
  const updateData = cleanData({
    caption: metadata.caption || '',
    tags: tagsArray,
    dataAiHint: metadata.dataAiHint || 'safari photo',
    updatedAt: serverTimestamp(),
  });

  return updateDoc(ref, updateData).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'update', requestResourceData: updateData }));
}

export async function fetchGalleryImages(count?: number): Promise<GalleryImage[]> {
  try {
    const galleryRef = collection(db, GALLERY_COLLECTION);
    let q = query(galleryRef, orderBy('createdAt', 'desc'));
    if (count) q = query(q, limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        src: data.src,
        alt: data.alt,
        caption: data.caption,
        dataAiHint: data.dataAiHint,
        tags: data.tags || [],
        date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
        storagePath: data.storagePath
      };
    });
  } catch (error) {
    handleFirestoreError(error, { path: GALLERY_COLLECTION, operation: 'list' });
    return [];
  }
}

export function deleteGalleryImage(id: string, storagePath?: string) {
  if (storagePath) {
    supabase.storage.from('blobs').remove([storagePath]).catch(err => console.error("Supabase file removal snag:", err));
  }
  const ref = doc(db, GALLERY_COLLECTION, id);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

// --- BLOG ---

export function submitBlogPost(data: Omit<BlogPost, 'id' | 'date' | 'commentCount' | 'status'>) {
  const colRef = collection(db, POSTS_COLLECTION);
  const newRef = doc(colRef);
  const newData = cleanData({
    ...data,
    id: newRef.id,
    status: 'Published',
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
  return setDoc(newRef, newData).catch(err => {
    handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData });
  });
}

export async function fetchBlogPosts(status?: string, count?: number): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    let q = query(postsRef, orderBy('createdAt', 'desc'));
    if (status && status !== 'all') q = query(q, where('status', '==', status));
    if (count) q = query(q, limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently',
      } as BlogPost;
    });
  } catch (error) {
    handleFirestoreError(error, { path: POSTS_COLLECTION, operation: 'list' });
    return [];
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const postRef = doc(db, POSTS_COLLECTION, id);
  try {
    const docSnap = await getDoc(postRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
      } as BlogPost;
    }
  } catch (error) {
    handleFirestoreError(error, { path: postRef.path, operation: 'get' });
  }
  return null;
}

export function updatePostStatus(id: string, status: BlogPost['status']) {
  const postRef = doc(db, POSTS_COLLECTION, id);
  return updateDoc(postRef, { status }).catch(err => handleFirestoreError(err, { path: postRef.path, operation: 'update', requestResourceData: { status } }));
}

export function deleteBlogPost(id: string) {
  const postRef = doc(db, POSTS_COLLECTION, id);
  return deleteDoc(postRef).catch(err => handleFirestoreError(err, { path: postRef.path, operation: 'delete' }));
}

// --- VIDEOS ---

export function addVideo(video: Omit<VideoItem, 'id'>) {
  const colRef = collection(db, 'videos');
  const newRef = doc(colRef);
  const newData = cleanData({ ...video, id: newRef.id, createdAt: serverTimestamp() });
  return setDoc(newRef, newData).catch(err => {
    handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData });
  });
}

export async function fetchVideos(): Promise<VideoItem[]> {
  try {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
  } catch (error) {
    handleFirestoreError(error, { path: 'videos', operation: 'list' });
    return [];
  }
}

export function deleteVideo(id: string) {
  const ref = doc(db, 'videos', id);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

// --- CAMPAIGNS (Expeditions) ---

export async function fetchCampaigns(featuredOnly?: boolean): Promise<Campaign[]> {
  try {
    const campaignsRef = collection(db, CAMPAIGNS_COLLECTION);
    const q = featuredOnly ? query(campaignsRef, where('featured', '==', true)) : query(campaignsRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  } catch (error) {
    handleFirestoreError(error, { path: CAMPAIGNS_COLLECTION, operation: 'list' });
    return [];
  }
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const ref = doc(db, CAMPAIGNS_COLLECTION, id);
  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Campaign;
  } catch (error) {
    handleFirestoreError(error, { path: ref.path, operation: 'get' });
  }
  return null;
}

export function saveCampaign(campaign: Partial<Campaign>) {
  const cleanedData = cleanData(campaign);
  if (campaign.id) {
    const ref = doc(db, CAMPAIGNS_COLLECTION, campaign.id);
    const updateData = { ...cleanedData, updatedAt: serverTimestamp() };
    return updateDoc(ref, updateData).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'update', requestResourceData: updateData }));
  } else {
    const colRef = collection(db, CAMPAIGNS_COLLECTION);
    const newRef = doc(colRef);
    const newData = { ...cleanedData, id: newRef.id, status: 'active', createdAt: serverTimestamp() };
    return setDoc(newRef, newData).catch(err => handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData }));
  }
}

export function deleteCampaign(id: string) {
  const ref = doc(db, CAMPAIGNS_COLLECTION, id);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

// --- DEPARTURES (Scheduled Events) ---

export async function fetchDepartures(): Promise<Departure[]> {
  try {
    const departuresRef = collection(db, DEPARTURES_COLLECTION);
    const q = query(departuresRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Departure));
  } catch (error) {
    handleFirestoreError(error, { path: DEPARTURES_COLLECTION, operation: 'list' });
    return [];
  }
}

export async function getDepartureById(id: string): Promise<Departure | null> {
  const ref = doc(db, DEPARTURES_COLLECTION, id);
  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Departure;
  } catch (error) {
    handleFirestoreError(error, { path: ref.path, operation: 'get' });
  }
  return null;
}

export function saveDeparture(departure: Partial<Departure>) {
  const cleanedData = cleanData(departure);
  if (departure.id) {
    const ref = doc(db, DEPARTURES_COLLECTION, departure.id);
    const updateData = { ...cleanedData, updatedAt: serverTimestamp() };
    return updateDoc(ref, updateData).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'update', requestResourceData: updateData }));
  } else {
    const colRef = collection(db, DEPARTURES_COLLECTION);
    const newRef = doc(colRef);
    const newData = { ...cleanedData, id: newRef.id, createdAt: serverTimestamp() };
    return setDoc(newRef, newData).catch(err => handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData }));
  }
}

export function deleteDeparture(id: string) {
  const ref = doc(db, DEPARTURES_COLLECTION, id);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

// --- IDEAS ---

export function submitIdea(data: Omit<Idea, 'id' | 'dateSubmitted' | 'votes' | 'voters' | 'status' | 'commentsCount'>) {
  const colRef = collection(db, IDEAS_COLLECTION);
  const newRef = doc(colRef);
  const newData = cleanData({ ...data, id: newRef.id, votes: 0, voters: [], status: 'New', commentsCount: 0, createdAt: serverTimestamp() });
  return setDoc(newRef, newData).catch(err => {
    handleFirestoreError(err, { path: newRef.path, operation: 'create', requestResourceData: newData });
  });
}

export async function fetchIdeas(): Promise<Idea[]> {
  try {
    const q = query(collection(db, IDEAS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateSubmitted: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently',
      } as Idea;
    });
  } catch (error) {
    handleFirestoreError(error, { path: IDEAS_COLLECTION, operation: 'list' });
    return [];
  }
}

export function voteForIdea(ideaId: string, userId: string, hasVoted: boolean) {
  const ideaRef = doc(db, IDEAS_COLLECTION, ideaId);
  const updateData = hasVoted ? { votes: increment(-1), voters: arrayRemove(userId) } : { votes: increment(1), voters: arrayUnion(userId) };
  return updateDoc(ideaRef, updateData).catch(err => handleFirestoreError(err, { path: ideaRef.path, operation: 'update', requestResourceData: updateData }));
}

// --- CHATROOMS & MESSAGES ---

export async function fetchChatrooms(): Promise<Chatroom[]> {
  try {
    const q = query(collection(db, CHATROOMS_COLLECTION), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chatroom));
  } catch (error) {
    handleFirestoreError(error, { path: CHATROOMS_COLLECTION, operation: 'list' });
    return [];
  }
}

export function sendMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'createdAt'>) {
  const colRef = collection(db, CHATROOMS_COLLECTION, roomId, 'messages');
  const roomRef = doc(db, CHATROOMS_COLLECTION, roomId);
  const newData = cleanData({ ...message, createdAt: serverTimestamp() });
  
  addDoc(colRef, newData).catch(err => handleFirestoreError(err, { path: colRef.path, operation: 'create', requestResourceData: newData }));
  return updateDoc(roomRef, { lastActivity: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }).catch(err => handleFirestoreError(err, { path: roomRef.path, operation: 'update' }));
}

export function subscribeToMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(collection(db, CHATROOMS_COLLECTION, roomId, 'messages'), orderBy('createdAt', 'asc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || 'Just now',
      } as ChatMessage;
    });
    callback(messages);
  }, (err) => handleFirestoreError(err, { path: `chatrooms/${roomId}/messages`, operation: 'list' }));
}

export function deleteChatMessage(roomId: string, messageId: string) {
  const ref = doc(db, CHATROOMS_COLLECTION, roomId, 'messages', messageId);
  return deleteDoc(ref).catch(err => handleFirestoreError(err, { path: ref.path, operation: 'delete' }));
}

export async function fetchUserBookings(userId: string): Promise<any[]> {
  try {
    const q = query(collection(db, 'custom_bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, { path: 'custom_bookings', operation: 'list' });
    return [];
  }
}
