export type AppMode = 'client' | 'artisan';

export type TradeCategory = 
  | 'plumber' 
  | 'electrician' 
  | 'carpenter' 
  | 'painter' 
  | 'mason' 
  | 'ac_tech';

export interface SubService {
  id: string;
  name: string;
  baseEstimateGhs: number;
}

export interface GhanaPostAddress {
  code: string; // e.g., "GA-183-9021"
  region: string;
  district: string;
  area: string;
  latitude: number;
  longitude: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: TradeCategory;
  beforePhoto: string;
  afterPhoto: string;
  description: string;
  completionTime: string;
  estimatedCostGhs?: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientPhoneMasked: string; // e.g. "+233 24 *** 892"
  rating: number;
  comment: string;
  date: string;
  jobCategory: string;
  verifiedBooking: boolean;
}

export interface Artisan {
  id: string;
  name: string;
  phone: string;
  trade: TradeCategory;
  tradeTitle: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  locationArea: string;
  ghanaPostGps: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  isGhanaCardVerified: boolean;
  isPro: boolean;
  isAvailable: boolean; // Online / Offline toggle
  experienceYears: number;
  startingPriceGhs: number;
  emergencyAvailable: boolean;
  bio: string;
  subServices: string[];
  portfolio: PortfolioProject[];
  reviews: Review[];
  stats: {
    profileViews: number;
    jobEnquiries: number;
    completedJobs: number;
    ratingAverage: number;
  };
  subscription: {
    plan: 'free' | 'pro';
    expiresAt: string;
    renewDaysLeft: number;
    autoRenew: boolean;
  };
}

export type JobStatus = 
  | 'request_sent'
  | 'estimate_received'
  | 'estimate_accepted'
  | 'estimate_declined'
  | 'artisan_en_route'
  | 'arrived'
  | 'work_in_progress'
  | 'job_completed'
  | 'cancelled';

export interface QuoteItem {
  id: string;
  description: string;
  type: 'labor' | 'material';
  costGhs: number;
}

export interface JobQuote {
  id: string;
  jobId: string;
  items: QuoteItem[];
  totalLaborGhs: number;
  totalMaterialsGhs: number;
  grandTotalGhs: number;
  notes?: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

export interface JobRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  artisanId: string;
  artisanName: string;
  artisanTrade: string;
  category: TradeCategory;
  subService: string;
  description: string;
  locationAddress: string;
  ghanaPostCode: string;
  locationCoords?: { lat: number; lng: number };
  mediaPhotos: string[];
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  preferredDate: string;
  preferredTimeWindow: string; // e.g. "Morning (8:00 AM - 12:00 PM)"
  estimatedCostRangeGhs?: string; // e.g. "GH₵ 180 - GH₵ 350"
  status: JobStatus;
  quote?: JobQuote;
  paymentMethod?: 'cash' | 'momo_mtn' | 'momo_telecel' | 'momo_at';
  isPaid?: boolean;
  paidAt?: string;
  isUrgent?: boolean;
  createdAt: string;
  clientRating?: number;
  clientReviewText?: string;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderRole: 'client' | 'artisan';
  text?: string;
  imageUrl?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  quote?: JobQuote;
  timestamp: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  ghanaPostAddress: GhanaPostAddress;
  avatar: string;
}

export interface OfflineDraft {
  id: string;
  title: string;
  category: TradeCategory;
  beforePhoto: string;
  afterPhoto: string;
  description: string;
  completionTime: string;
  estimatedCostGhs: number;
  savedAt: string;
}
