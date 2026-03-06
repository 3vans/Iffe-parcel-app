
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
  type DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// --- TYPES ---

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
  subCategory?: string;
  bundleEligible?: boolean;
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

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  createdAt: any;
}

// --- BUILDER SERVICES ---

export async function fetchBasePackages(): Promise<Package[]> {
  const q = query(collection(db, 'packages'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  
  const defaultPkgs: Package[] = [
    { id: 'explorer', name: 'Explorer Package', basePrice: 750, durationDays: 4, features: ['Short Trip', 'Eastern Uganda'], isActive: true },
    { id: 'adventurer', name: 'Adventurer Package', basePrice: 4500, durationDays: 7, features: ['Primate Focus', 'Lodge Stays'], isActive: true, isPopular: true },
    { id: 'ultimate', name: 'Ultimate Safari', basePrice: 8000, durationDays: 10, features: ['All Major Parks', 'Full Circuit'], isActive: true }
  ];

  if (snapshot.empty) {
    return defaultPkgs;
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
}

export async function fetchAddons(): Promise<Addon[]> {
  const q = query(collection(db, 'addons'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  
  const defaultAddons: Addon[] = [
    // Wildlife Category
    { id: 'gorilla', name: 'Gorilla Trekking', price: 700, category: 'activity', subCategory: 'Wildlife', bundleEligible: true, isActive: true },
    { id: 'chimp', name: 'Chimpanzee Tracking', price: 250, category: 'activity', subCategory: 'Wildlife', bundleEligible: true, isActive: true },
    { id: 'golden_monkey', name: 'Golden Monkey Tracking', price: 100, category: 'activity', subCategory: 'Wildlife', isActive: true },
    { id: 'big_five', name: 'Big Five Game Drive', price: 150, category: 'activity', subCategory: 'Wildlife', isActive: true },
    { id: 'rhino_tracking', name: 'Rhino Tracking', price: 100, category: 'activity', subCategory: 'Wildlife', isActive: true },
    { id: 'bird_watching', name: 'Bird Watching Safari', price: 80, category: 'activity', subCategory: 'Wildlife', isActive: true },
    { id: 'night_game', name: 'Night Game Drive', price: 120, category: 'activity', subCategory: 'Wildlife', isActive: true },
    { id: 'predator_tracking', name: 'Predator Tracking Experience', price: 200, category: 'activity', subCategory: 'Wildlife', isActive: true },
    
    // Adventure Category
    { id: 'safari_game_drive', name: 'Guided Safari Game Drive', price: 150, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'off_road_adventure', name: 'Off-Road Safari Adventure', price: 180, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'walking_safari', name: 'Walking Safari', price: 100, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'cycling_safari', name: 'Cycling Safari', price: 80, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'atv_safari', name: 'ATV / Quad Bike Safari', price: 120, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'mtn_hiking', name: 'Mountain Hiking', price: 200, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'volcano_trek', name: 'Volcano Trekking', price: 250, category: 'activity', subCategory: 'Adventure', isActive: true },
    { id: 'nature_trail', name: 'Nature Trail Exploration', price: 60, category: 'activity', subCategory: 'Adventure', isActive: true },
    
    // Culture Category
    { id: 'kampala_tour', name: 'Kampala City Tour', price: 50, category: 'activity', subCategory: 'Culture', isActive: true },
    { id: 'jinja_tour', name: 'Source of the Nile', price: 100, category: 'activity', subCategory: 'Culture', isActive: true },
    { id: 'batwa_experience', name: 'Batwa Cultural Experience', price: 80, category: 'activity', subCategory: 'Culture', isActive: true },
    
    // Luxury Options
    { id: 'luxury_lodge', name: 'Luxury Lodge Upgrade', price: 1200, category: 'luxury', isActive: true },
    { id: 'private_guide', name: 'Private Safari Guide', price: 900, category: 'luxury', isActive: true },
    { id: 'private_cruiser', name: 'Private Land Cruiser', price: 1500, category: 'luxury', isActive: true },
    
    // Extensions
    { id: 'extra_2days', name: 'Extra 2 Days', price: 900, category: 'extension', isActive: true },
    { id: 'zanzibar', name: 'Zanzibar Beach Add-on', price: 2000, category: 'extension', isActive: true }
  ];

  if (snapshot.empty) {
    return defaultAddons;
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Addon));
}

export function calculatePricing(basePackage: Package, selectedAddons: Addon[]) {
  const basePrice = basePackage.basePrice;
  let addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  
  // Bundle Logic: 5% off Gorilla + Chimp
  let discountAmount = 0;
  const hasGorilla = selectedAddons.some(a => a.id === 'gorilla');
  const hasChimp = selectedAddons.some(a => a.id === 'chimp');
  
  if (hasGorilla && hasChimp) {
    const wildlifeItems = selectedAddons.filter(a => a.id === 'gorilla' || a.id === 'chimp');
    const wildlifeSum = wildlifeItems.reduce((sum, item) => sum + item.price, 0);
    discountAmount = wildlifeSum * 0.05;
  }

  const finalTotal = basePrice + addonsTotal - discountAmount;
  const tier = finalTotal > 10000 ? 'elite' : 'standard';

  return {
    basePrice,
    addonsTotal,
    discountAmount,
    finalTotal,
    tier
  };
}

// --- GALLERY ---

export async function uploadGalleryImage(file: File, metadata: { caption?: string, tags?: string, dataAiHint?: string }) {
  const storagePath = `gallery/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, storagePath);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  const tagsArray = metadata.tags ? metadata.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`) : [];
  
  const docRef = await addDoc(collection(db, 'gallery'), {
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
  const galleryRef = collection(db, 'gallery');
  const q = count 
    ? query(galleryRef, orderBy('createdAt', 'desc'), limit(count))
    : query(galleryRef, orderBy('createdAt', 'desc'));
    
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
}

export async function deleteGalleryImage(id: string, storagePath?: string) {
  if (storagePath) {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef).catch(err => console.error("Storage delete error:", err));
  }
  await deleteDoc(doc(db, 'gallery', id));
}

// --- BLOG ---

export async function submitBlogPost(data: Omit<BlogPost, 'id' | 'date' | 'commentCount' | 'status'>) {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...data,
    status: 'Published',
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchBlogPosts(status?: string, count?: number): Promise<BlogPost[]> {
  const postsRef = collection(db, 'posts');
  let q;
  
  if (status && status !== 'all') {
    q = query(postsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
  } else {
    q = query(postsRef, orderBy('createdAt', 'desc'));
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
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const docSnap = await getDoc(doc(db, 'posts', id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      date: data.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently',
    } as BlogPost;
  }
  return null;
}

export async function updatePostStatus(id: string, status: BlogPost['status']) {
  await updateDoc(doc(db, 'posts', id), { status });
}

export async function deleteBlogPost(id: string) {
  await deleteDoc(doc(db, 'posts', id));
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
  const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
}

export async function deleteVideo(id: string) {
  await deleteDoc(doc(db, 'videos', id));
}

// --- CAMPAIGNS ---

export async function fetchCampaigns(featuredOnly?: boolean): Promise<Campaign[]> {
  const campaignsRef = collection(db, 'campaigns');
  let q = query(campaignsRef, orderBy('createdAt', 'desc'));
  if (featuredOnly) {
    q = query(q, where('featured', '==', true));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
}

// --- IDEAS ---

export async function submitIdea(data: Omit<Idea, 'id' | 'dateSubmitted' | 'votes' | 'voters' | 'status' | 'commentsCount'>) {
  const docRef = await addDoc(collection(db, 'ideas'), {
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
  const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dateSubmitted: data.createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently',
    } as Idea;
  });
}

export async function voteForIdea(ideaId: string, userId: string, hasVoted: boolean) {
  const ideaRef = doc(db, 'ideas', ideaId);
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

// --- CHAT ---

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'createdAt'>) {
  await addDoc(collection(db, 'chats'), {
    ...message,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToMessages(callback: (messages: ChatMessage[]) => void) {
  const q = query(collection(db, 'chats'), orderBy('createdAt', 'asc'), limit(50));
  
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
