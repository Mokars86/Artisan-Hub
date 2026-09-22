import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppMode,
  Artisan,
  ChatMessage,
  ClientProfile,
  GhanaPostAddress,
  JobQuote,
  JobRequest,
  JobStatus,
  OfflineDraft,
  PortfolioProject,
} from '../types';
import {
  GHANA_POST_SAMPLE_ADDRESSES,
  INITIAL_ARTISANS,
  INITIAL_JOB_REQUESTS,
} from '../data/mockData';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Location
  currentLocation: GhanaPostAddress;
  setCurrentLocation: (loc: GhanaPostAddress) => void;
  
  // Client state
  clientProfile: ClientProfile;
  updateClientProfile: (profile: Partial<ClientProfile>) => void;
  
  // Artisans data
  artisans: Artisan[];
  activeArtisanId: string;
  setActiveArtisanId: (id: string) => void;
  currentArtisan: Artisan;
  toggleArtisanAvailability: (artisanId: string) => void;
  updateArtisanSubscription: (artisanId: string, plan: 'pro' | 'free') => void;
  addPortfolioProject: (artisanId: string, project: Omit<PortfolioProject, 'id' | 'createdAt'>) => void;
  deletePortfolioProject: (artisanId: string, projectId: string) => void;
  
  // Jobs & Bookings
  jobRequests: JobRequest[];
  createJobRequest: (job: Omit<JobRequest, 'id' | 'createdAt' | 'status'>) => string;
  sendJobQuote: (jobId: string, quote: Omit<JobQuote, 'id' | 'jobId' | 'status' | 'sentAt'>) => void;
  respondToQuote: (jobId: string, accept: boolean) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  payForJob: (jobId: string, method: 'cash' | 'momo_mtn' | 'momo_telecel' | 'momo_at') => void;
  submitJobReview: (jobId: string, rating: number, reviewText: string) => void;
  
  // Chat & Communication
  chatMessages: ChatMessage[];
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  // Offline drafts & 3G optimization
  offlineDrafts: OfflineDraft[];
  saveOfflineDraft: (draft: Omit<OfflineDraft, 'id' | 'savedAt'>) => void;
  syncOfflineDrafts: () => void;
  isDataSaverEnabled: boolean;
  setIsDataSaverEnabled: (enabled: boolean) => void;
  
  // Active urgent alert
  urgentJobBannerOpen: boolean;
  setUrgentJobBannerOpen: (open: boolean) => void;
  newJobAlert: JobRequest | null;
  dismissNewJobAlert: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('client');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hg_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [currentLocation, setCurrentLocation] = useState<GhanaPostAddress>(
    GHANA_POST_SAMPLE_ADDRESSES[0]
  );

  const [clientProfile, setClientProfile] = useState<ClientProfile>({
    id: 'client-user-1',
    name: 'Afia Pokuaa',
    phone: '+233 24 555 8921',
    ghanaPostAddress: GHANA_POST_SAMPLE_ADDRESSES[0],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
  });

  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem('hg_artisans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached artisans', e);
      }
    }
    return INITIAL_ARTISANS;
  });

  const [activeArtisanId, setActiveArtisanId] = useState<string>('artisan-kwame-plumber');

  const [jobRequests, setJobRequests] = useState<JobRequest[]>(() => {
    const saved = localStorage.getItem('hg_jobs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached jobs', e);
      }
    }
    return INITIAL_JOB_REQUESTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      jobId: 'job-sample-101',
      senderId: 'client-user-1',
      senderRole: 'client',
      text: 'Good morning Master Kwame, I have sent photos of the leaking pipe under my sink. Can you come today?',
      timestamp: '08:35 AM',
    },
    {
      id: 'msg-init-2',
      jobId: 'job-sample-101',
      senderId: 'artisan-kwame-plumber',
      senderRole: 'artisan',
      text: 'Good morning Madam Afia. I have reviewed the photo. The galvanized fitting has rusted. I have sent an itemized estimate for the repair and new PPR pipe.',
      timestamp: '08:42 AM',
    },
    {
      id: 'msg-init-3',
      jobId: 'job-sample-101',
      senderId: 'artisan-kwame-plumber',
      senderRole: 'artisan',
      quote: INITIAL_JOB_REQUESTS[0].quote,
      timestamp: '08:43 AM',
    },
  ]);

  const [offlineDrafts, setOfflineDrafts] = useState<OfflineDraft[]>([]);
  const [isDataSaverEnabled, setIsDataSaverEnabled] = useState(true);
  const [urgentJobBannerOpen, setUrgentJobBannerOpen] = useState(true);
  const [newJobAlert, setNewJobAlert] = useState<JobRequest | null>(null);

  // Sync theme with document element
  useEffect(() => {
    localStorage.setItem('hg_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync artisans to localStorage
  useEffect(() => {
    localStorage.setItem('hg_artisans', JSON.stringify(artisans));
  }, [artisans]);

  // Sync jobs to localStorage
  useEffect(() => {
    localStorage.setItem('hg_jobs', JSON.stringify(jobRequests));
  }, [jobRequests]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentArtisan =
    artisans.find((a) => a.id === activeArtisanId) || artisans[0];

  const updateClientProfile = (profile: Partial<ClientProfile>) => {
    setClientProfile((prev) => ({ ...prev, ...profile }));
  };

  const toggleArtisanAvailability = (artisanId: string) => {
    setArtisans((prev) =>
      prev.map((art) =>
        art.id === artisanId ? { ...art, isAvailable: !art.isAvailable } : art
      )
    );
  };

  const updateArtisanSubscription = (artisanId: string, plan: 'pro' | 'free') => {
    setArtisans((prev) =>
      prev.map((art) => {
        if (art.id !== artisanId) return art;
        return {
          ...art,
          isPro: plan === 'pro',
          subscription: {
            plan,
            expiresAt: '2026-10-31',
            renewDaysLeft: 30,
            autoRenew: true,
          },
        };
      })
    );
  };

  const addPortfolioProject = (
    artisanId: string,
    project: Omit<PortfolioProject, 'id' | 'createdAt'>
  ) => {
    const newProject: PortfolioProject = {
      ...project,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setArtisans((prev) =>
      prev.map((art) =>
        art.id === artisanId
          ? { ...art, portfolio: [newProject, ...art.portfolio] }
          : art
      )
    );
  };

  const deletePortfolioProject = (artisanId: string, projectId: string) => {
    setArtisans((prev) =>
      prev.map((art) =>
        art.id === artisanId
          ? {
              ...art,
              portfolio: art.portfolio.filter((p) => p.id !== projectId),
            }
          : art
      )
    );
  };

  const createJobRequest = (
    jobData: Omit<JobRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newId = `job-${Date.now()}`;
    const newJob: JobRequest = {
      ...jobData,
      id: newId,
      status: 'request_sent',
      createdAt: new Date().toISOString(),
    };

    setJobRequests((prev) => [newJob, ...prev]);

    // Show alert on artisan suite
    setNewJobAlert(newJob);

    // Initial system chat message
    const initMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId: newId,
      senderId: jobData.clientId,
      senderRole: 'client',
      text: `Hello ${jobData.artisanName}, I have requested a booking for ${jobData.subService}. Problem description: "${jobData.description}"`,
      voiceNoteUrl: jobData.voiceNoteUrl,
      voiceNoteDuration: jobData.voiceNoteDuration,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, initMsg]);

    return newId;
  };

  const sendJobQuote = (
    jobId: string,
    quoteData: Omit<JobQuote, 'id' | 'jobId' | 'status' | 'sentAt'>
  ) => {
    const newQuote: JobQuote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      jobId,
      status: 'pending',
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setJobRequests((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: 'estimate_received', quote: newQuote }
          : j
      )
    );

    // Add quote card into chat
    const quoteMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: activeArtisanId,
      senderRole: 'artisan',
      text: 'I have generated a formal estimate for your review. Please review labor & materials breakdown below.',
      quote: newQuote,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, quoteMsg]);
  };

  const respondToQuote = (jobId: string, accept: boolean) => {
    const newStatus: JobStatus = accept ? 'estimate_accepted' : 'estimate_declined';

    setJobRequests((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          status: newStatus,
          quote: j.quote ? { ...j.quote, status: accept ? 'accepted' : 'declined' } : undefined,
        };
      })
    );

    const replyMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: clientProfile.id,
      senderRole: 'client',
      text: accept
        ? '✅ Estimate accepted! You can proceed with the work as scheduled.'
        : '❌ Estimate declined. Please see if we can revise the material cost.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, replyMsg]);
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobRequests((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );

    let statusText = '';
    switch (status) {
      case 'artisan_en_route':
        statusText = '🚗 Artisan is en route to your location.';
        break;
      case 'arrived':
        statusText = '📍 Artisan has arrived at your Ghana Post address.';
        break;
      case 'work_in_progress':
        statusText = '🔧 Work in progress. Artisan is actively repairing.';
        break;
      case 'job_completed':
        statusText = '🎉 Job completed! Please inspect the work and confirm direct payment.';
        break;
      default:
        statusText = `Status updated to: ${status}`;
    }

    const statusMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: 'system',
      senderRole: 'artisan',
      text: statusText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, statusMsg]);
  };

  const payForJob = (
    jobId: string,
    method: 'cash' | 'momo_mtn' | 'momo_telecel' | 'momo_at'
  ) => {
    setJobRequests((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              isPaid: true,
              paymentMethod: method,
              paidAt: new Date().toLocaleTimeString(),
            }
          : j
      )
    );

    const paymentLabel =
      method === 'cash'
        ? 'Direct Cash'
        : method === 'momo_mtn'
        ? 'MTN MoMo'
        : method === 'momo_telecel'
        ? 'Telecel Cash'
        : 'AT Money';

    const payMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: clientProfile.id,
      senderRole: 'client',
      text: `💳 Payment completed directly via ${paymentLabel}. Thank you!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, payMsg]);
  };

  const submitJobReview = (jobId: string, rating: number, reviewText: string) => {
    const targetJob = jobRequests.find((j) => j.id === jobId);
    if (!targetJob) return;

    setJobRequests((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, clientRating: rating, clientReviewText: reviewText }
          : j
      )
    );

    // Add review to artisan
    const newRev = {
      id: `rev-${Date.now()}`,
      clientName: targetJob.clientName,
      clientPhoneMasked: '+233 24 *** 892',
      rating,
      comment: reviewText,
      date: 'Just now',
      jobCategory: targetJob.subService,
      verifiedBooking: true,
    };

    setArtisans((prev) =>
      prev.map((art) =>
        art.id === targetJob.artisanId
          ? {
              ...art,
              reviews: [newRev, ...art.reviews],
              totalReviews: art.totalReviews + 1,
            }
          : art
      )
    );
  };

  const sendMessage = (msgData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const saveOfflineDraft = (draftData: Omit<OfflineDraft, 'id' | 'savedAt'>) => {
    const draft: OfflineDraft = {
      ...draftData,
      id: `draft-${Date.now()}`,
      savedAt: new Date().toLocaleDateString(),
    };
    setOfflineDrafts((prev) => [draft, ...prev]);
  };

  const syncOfflineDrafts = () => {
    // Commit all drafts to current artisan's portfolio
    offlineDrafts.forEach((draft) => {
      addPortfolioProject(activeArtisanId, {
        title: draft.title,
        category: draft.category,
        beforePhoto: draft.beforePhoto,
        afterPhoto: draft.afterPhoto,
        description: draft.description,
        completionTime: draft.completionTime,
        estimatedCostGhs: draft.estimatedCostGhs,
      });
    });
    setOfflineDrafts([]);
  };

  const dismissNewJobAlert = () => {
    setNewJobAlert(null);
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        theme,
        toggleTheme,
        currentLocation,
        setCurrentLocation,
        clientProfile,
        updateClientProfile,
        artisans,
        activeArtisanId,
        setActiveArtisanId,
        currentArtisan,
        toggleArtisanAvailability,
        updateArtisanSubscription,
        addPortfolioProject,
        deletePortfolioProject,
        jobRequests,
        createJobRequest,
        sendJobQuote,
        respondToQuote,
        updateJobStatus,
        payForJob,
        submitJobReview,
        chatMessages,
        sendMessage,
        offlineDrafts,
        saveOfflineDraft,
        syncOfflineDrafts,
        isDataSaverEnabled,
        setIsDataSaverEnabled,
        urgentJobBannerOpen,
        setUrgentJobBannerOpen,
        newJobAlert,
        dismissNewJobAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
