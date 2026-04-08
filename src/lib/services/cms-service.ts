
import { db, storage } from '@/lib/firebase';
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
  type DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import placeholderImages from '@/app/lib/placeholder-images.json';

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

export interface Package {
  id: string;
  name: string;
  basePrice: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
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

// --- CONSTANTS ---
const CAMPAIGNS_COLLECTION = 'campaigns_public';
const POSTS_COLLECTION = 'posts_approved';
const GALLERY_COLLECTION = 'gallery';
const CHATROOMS_COLLECTION = 'chatrooms';
const IDEAS_COLLECTION = 'ideas';

// --- USER PROFILE SERVICES ---

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      memberSince: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || 'Recently'
    } as UserProfile;
  }
  return null;
}

export async function createUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  const profile: Partial<UserProfile> = {
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
  };
  await setDoc(userRef, profile);
  return profile;
}

// --- BUILDER SERVICES ---

export async function fetchBasePackages(): Promise<Package[]> {
  try {
    const q = query(collection(db, 'packages'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
  } catch (e) {
    return [];
  }
}

export async function savePackage(pkg: Partial<Package>) {
  if (pkg.id) {
    const pkgRef = doc(db, 'packages', pkg.id);
    await updateDoc(pkgRef, { ...pkg, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'packages'), {
      ...pkg,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function fetchAddons(): Promise<Addon[]> {
  try {
    const q = query(collection(db, 'addons'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Addon));
  } catch (e) {
    return [];
  }
}

export async function saveAddon(addon: Partial<Addon>) {
  if (addon.id) {
    const addonRef = doc(db, 'addons', addon.id);
    await updateDoc(addonRef, { ...addon, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'addons'), {
      ...addon,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deleteAddon(id: string) {
  await deleteDoc(doc(db, 'addons', id));
}

export function calculatePricing(basePackage: Package, selectedAddons: Addon[], numPeople: number = 1) {
  const basePrice = basePackage.basePrice;
  let addonsTotalPerPerson = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  
  let discountAmountPerPerson = 0;
  const hasGorilla = selectedAddons.some(a => a.id === 'gorilla');
  const hasChimp = selectedAddons.some(a => a.id === 'chimp');
  
  if (hasGorilla && hasChimp) {
    const wildlifeItems = selectedAddons.filter(a => a.id === 'gorilla' || a.id === 'chimp');
    const wildlifeSum = wildlifeItems.reduce((sum, item) => sum + item.price, 0);
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

export async function saveCustomBooking(data: any) {
  const docRef = await addDoc(collection(db, 'custom_bookings'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// --- PROMOTIONS ---

export async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const q = query(collection(db, 'promotions'), orderBy('endDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
  } catch (e) {
    return [];
  }
}

export async function savePromotion(promo: Partial<Promotion>) {
  if (promo.id) {
    const ref = doc(db, 'promotions', promo.id);
    await updateDoc(ref, { ...promo, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'promotions'), {
      ...promo,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }
}

export async function deletePromotion(id: string) {
  await deleteDoc(doc(db, 'promotions', id));
}

// --- GALLERY ---

export async function uploadGalleryImage(file: File, metadata: { caption?: string, tags?: string, dataAiHint?: string }) {
  const storagePath = `gallery/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  const tagsArray = metadata.tags ? metadata.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : [];
  
  const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
    src: downloadUrl,
    alt: metadata.caption || 'Gallery Image',
    caption: metadata.caption || '',
    tags: tagsArray,
    dataAiHint: metadata.dataAiHint || 'safari photo',
    storagePath: storagePath,
    createdAt: serverTimestamp(),
  });
  
  return { id: docRef.id, src: downloadUrl };
}

export async function fetchGalleryImages(count?: number): Promise<GalleryImage[]> {
  try {
    const galleryRef = collection(db, GALLERY_COLLECTION);
    let q = query(galleryRef, orderBy('createdAt', 'desc'));
    
    if (count) {
      q = query(q, limit(count));
    }
      
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
    return [];
  }
}

export async function deleteGalleryImage(id: string, storagePath?: string) {
  if (storagePath) {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef).catch(err => console.error("Storage delete error:", err));
  }
  await deleteDoc(doc(db, GALLERY_COLLECTION, id));
}

// --- BLOG ---

export async function submitBlogPost(data: Omit<BlogPost, 'id' | 'date' | 'commentCount' | 'status'>) {
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...data,
    status: 'Published',
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchBlogPosts(status?: string, count?: number): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    let q = query(postsRef, orderBy('createdAt', 'desc'));
    
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status));
    }
    
    if (count) {
      q = query(q, limit(count));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently',
      } as BlogPost;
    });
  } catch (e) {
    return [];
  }
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const docSnap = await getDoc(doc(db, POSTS_COLLECTION, id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
      } as BlogPost;
    }
  } catch (e) {}
  return null;
}

export async function updatePostStatus(id: string, status: BlogPost['status']) {
  await updateDoc(doc(db, POSTS_COLLECTION, id), { status });
}

export async function deleteBlogPost(id: string) {
  await deleteDoc(doc(db, POSTS_COLLECTION, id));
}

// --- VIDEOS ---

export async function addVideo(video: Omit<VideoItem, 'id'>) {
  const docRef = await addDoc(collection(db, 'videos'), {
    ...video,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchVideos(): Promise<VideoItem[]> {
  try {
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
  } catch (e) {
    return [];
  }
}

export async function deleteVideo(id: string) {
  await deleteDoc(doc(db, 'videos', id));
}

// --- CAMPAIGNS (Expeditions) ---

export async function fetchCampaigns(featuredOnly?: boolean): Promise<Campaign[]> {
  try {
    const campaignsRef = collection(db, CAMPAIGNS_COLLECTION);
    const q = featuredOnly 
      ? query(campaignsRef, where('featured', '==', true))
      : query(campaignsRef);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  } catch (error) {
    return [];
  }
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  try {
    const docSnap = await getDoc(doc(db, CAMPAIGNS_COLLECTION, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
  } catch (e) {}
  return null;
}

export async function saveCampaign(campaign: Partial<Campaign>) {
  if (campaign.id) {
    const ref = doc(db, CAMPAIGNS_COLLECTION, campaign.id);
    await updateDoc(ref, { ...campaign, updatedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, CAMPAIGNS_COLLECTION), {
      ...campaign,
      status: 'active',
      createdAt: serverTimestamp(),
    });
  }
}

export async function deleteCampaign(id: string) {
  await deleteDoc(doc(db, CAMPAIGNS_COLLECTION, id));
}

// --- IDEAS ---

export async function submitIdea(data: Omit<Idea, 'id' | 'dateSubmitted' | 'votes' | 'voters' | 'status' | 'commentsCount'>) {
  const docRef = await addDoc(collection(db, IDEAS_COLLECTION), {
    ...data,
    votes: 0,
    voters: [],
    status: 'New',
    commentsCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
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
  } catch (e) {
    return [];
  }
}

export async function voteForIdea(ideaId: string, userId: string, hasVoted: boolean) {
  const ideaRef = doc(db, IDEAS_COLLECTION, ideaId);
  if (hasVoted) {
    await updateDoc(ideaRef, {
      votes: increment(-1),
      voters: arrayRemove(userId)
    });
  } else {
    await updateDoc(ideaRef, {
      votes: increment(1),
      voters: arrayUnion(userId)
    });
  }
}

// --- CHATROOMS & MESSAGES ---

export async function fetchChatrooms(): Promise<Chatroom[]> {
  try {
    const q = query(collection(db, CHATROOMS_COLLECTION), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Seed initial rooms if empty
      const rooms = [
        { name: 'General Discussion', topic: 'Talk about anything Rotary related!', userCount: 0, lastActivity: 'Now' },
        { name: 'Project Brainstorming', topic: 'Ideas for new community projects.', userCount: 0, lastActivity: 'Now' },
        { name: 'Support', topic: 'Get help with platform features.', userCount: 0, lastActivity: 'Now' }
      ];
      for (const r of rooms) {
        await addDoc(collection(db, CHATROOMS_COLLECTION), r);
      }
      return fetchChatrooms();
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chatroom));
  } catch (e) {
    return [];
  }
}

export async function sendMessage(roomId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'createdAt'>) {
  await addDoc(collection(db, CHATROOMS_COLLECTION, roomId, 'messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });
  // Update room last activity
  await updateDoc(doc(db, CHATROOMS_COLLECTION, roomId), {
    lastActivity: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  });
}

export function subscribeToMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(
    collection(db, CHATROOMS_COLLECTION, roomId, 'messages'), 
    orderBy('createdAt', 'asc'), 
    limit(50)
  );
  
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
  });
}

export async function deleteChatMessage(roomId: string, messageId: string) {
  await deleteDoc(doc(db, CHATROOMS_COLLECTION, roomId, 'messages', messageId));
}
