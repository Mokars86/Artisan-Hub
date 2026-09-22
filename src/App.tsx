/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { MobileTab } from './components/mobile/MobileBottomNav';
import { ScreenSplash } from './components/mobile/ScreenSplash';
import { ScreenLogin } from './components/mobile/ScreenLogin';
import { ScreenSignUp } from './components/mobile/ScreenSignUp';
import { ScreenOnboardingSearch } from './components/mobile/ScreenOnboardingSearch';
import { ScreenArtisanDirectory } from './components/mobile/ScreenArtisanDirectory';
import { ScreenArtisanProfile } from './components/mobile/ScreenArtisanProfile';
import { ScreenClientJobs } from './components/mobile/ScreenClientJobs';

// Modals & Secondary Components
import { GhanaPostSelectorModal } from './components/common/GhanaPostSelectorModal';
import { ClientOnboarding } from './components/client/ClientOnboarding';
import { JobRequestModal } from './components/client/JobRequestModal';
import { ClientBookingsChat } from './components/client/ClientBookingsChat';
import { ArtisanRegistrationKYC } from './components/artisan/ArtisanRegistrationKYC';
import { ArtisanSubscriptionSheet } from './components/artisan/ArtisanSubscriptionSheet';

// Artisan Suite components for Pro Hub tab
import { ArtisanDashboard } from './components/artisan/ArtisanDashboard';
import { ArtisanPortfolioManager } from './components/artisan/ArtisanPortfolioManager';
import { ArtisanChatInbox } from './components/artisan/ArtisanChatInbox';
import { ArtisanQuoteBuilder } from './components/artisan/ArtisanQuoteBuilder';
import { AppLogo } from './components/common/AppLogo';

import { Artisan, JobRequest, TradeCategory } from './types';
import {
  Smartphone,
  Maximize2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Layers,
  Wrench,
  MessageSquare,
  X,
  ArrowRight,
  LogOut,
  User,
} from 'lucide-react';

export default function App() {
  const {
    artisans,
    currentLocation,
    setCurrentLocation,
    jobRequests,
    clientProfile,
    mode,
    setMode,
  } = useApp();

  // Active navigation tab (starts at splash screen as requested)
  const [activeTab, setActiveTab] = useState<MobileTab>('splash');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [loginNotification, setLoginNotification] = useState<string | null>(null);

  // Category and search state for directory
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TradeCategory | 'all'>('painter');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected artisan for profile (Screen C)
  const defaultPainter = artisans.find((a) => a.id === 'artisan-kojo-painter') || artisans[0];
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan>(defaultPainter);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [bookingArtisan, setBookingArtisan] = useState<Artisan | null>(null);
  const [activeChatJob, setActiveChatJob] = useState<JobRequest | null>(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Artisan Suite tab in Pro Hub
  const [artisanSubTab, setArtisanSubTab] = useState<'dashboard' | 'portfolio' | 'inbox'>('dashboard');
  const [selectedJobForQuoteBuilder, setSelectedJobForQuoteBuilder] = useState<JobRequest | null>(null);

  // Handlers
  const handleSelectCategory = (cat: TradeCategory) => {
    setSelectedCategoryFilter(cat);
    setActiveTab('directory');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('directory');
  };

  const handleSelectArtisanForProfile = (artisan: Artisan) => {
    setSelectedArtisan(artisan);
    setActiveTab('profile');
  };

  const handleRequestBooking = (artisan: Artisan) => {
    setBookingArtisan(artisan);
  };

  const handleBookingSubmitted = (jobId: string) => {
    const job = jobRequests.find((j) => j.id === jobId) || jobRequests[0];
    if (job) {
      setActiveChatJob(job);
    }
    setActiveTab('jobs');
  };

  const handleSuccessAuth = (role: 'client' | 'artisan', message: string) => {
    setLoginNotification(message);
    setTimeout(() => setLoginNotification(null), 3000);
    if (role === 'artisan') {
      setActiveTab('artisan_suite');
    } else {
      setActiveTab('home');
    }
  };

  const isAuthScreen = activeTab === 'splash' || activeTab === 'login' || activeTab === 'signup';

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar for Desktop: Screen Switcher & Frame Controls */}
      <header className="w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-2.5 shadow-xs z-30 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('splash')}
              className="flex items-center text-left hover:opacity-90 transition-opacity"
              title="Return to Splash Screen"
            >
              <AppLogo size="sm" />
            </button>
          </div>

          {/* Quick Flow Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('splash')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'splash'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              ★ Splash
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'login'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'signup'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Sign Up
            </button>

            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-1" />

            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              1. Home
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategoryFilter('painter');
                setActiveTab('directory');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              2. Directory
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedArtisan(defaultPainter);
                setActiveTab('profile');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              3. Profile & B&A
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'jobs'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              4. Jobs
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('artisan_suite')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'artisan_suite'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Pro Hub
            </button>
          </div>

          {/* Right Controls: User Pill, Location, Frame Toggle */}
          <div className="flex items-center gap-2">
            {/* Logged in User Indicator & Logout Action */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span className="truncate max-w-[90px]">{clientProfile.name}</span>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="p-1 text-stone-400 hover:text-red-500 ml-0.5"
                title="Log Out or Switch Account"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsGpsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300"
              title="Change Ghana Post Address"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="truncate max-w-[110px]">{currentLocation.area}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFrameMode(!isFrameMode)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-bold text-stone-700 dark:text-stone-300"
              title={isFrameMode ? 'Switch to Wide View' : 'Switch to Phone Mockup'}
            >
              {isFrameMode ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Wide View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Phone Frame</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Global Toast Notification for Login / Sign Up */}
      {loginNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{loginNotification}</span>
        </div>
      )}

      {/* Mobile Application Body */}
      <main className="flex-1 flex flex-col justify-center items-center">
        <MobileAppShell
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isFrameMode={isFrameMode}
          onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
          hideBottomNav={isAuthScreen}
        >
          {/* ================================================================= */}
          {/* SCREEN: SPLASH */}
          {/* ================================================================= */}
          {activeTab === 'splash' && (
            <ScreenSplash
              onGetStarted={() => setActiveTab('signup')}
              onSignIn={() => setActiveTab('login')}
              onExploreGuest={() => setActiveTab('home')}
            />
          )}

          {/* ================================================================= */}
          {/* SCREEN: LOGIN */}
          {/* ================================================================= */}
          {activeTab === 'login' && (
            <ScreenLogin
              onBack={() => setActiveTab('splash')}
              onSuccessLogin={(role) =>
                handleSuccessAuth(
                  role,
                  `Signed in successfully as ${role === 'artisan' ? 'Artisan Pro' : 'Client'}!`
                )
              }
              onNavigateToSignUp={() => setActiveTab('signup')}
              onContinueGuest={() => setActiveTab('home')}
            />
          )}

          {/* ================================================================= */}
          {/* SCREEN: SIGN UP */}
          {/* ================================================================= */}
          {activeTab === 'signup' && (
            <ScreenSignUp
              onBack={() => setActiveTab('splash')}
              onSuccessSignUp={(role) =>
                handleSuccessAuth(
                  role,
                  `Welcome to Artisan Hub! Account created as ${
                    role === 'artisan' ? 'Artisan Pro' : 'Client'
                  }.`
                )
              }
              onNavigateToLogin={() => setActiveTab('login')}
              onContinueGuest={() => setActiveTab('home')}
            />
          )}

          {/* ================================================================= */}
          {/* SCREEN A: ONBOARDING & SEARCH */}
          {/* ================================================================= */}
          {activeTab === 'home' && (
            <ScreenOnboardingSearch
              onSelectCategory={handleSelectCategory}
              onSearch={handleSearch}
              onNavigateToDirectory={() => {
                setSelectedCategoryFilter('painter');
                setActiveTab('directory');
              }}
              onOpenEmergency={() => {
                setSelectedCategoryFilter('plumber');
                setActiveTab('directory');
              }}
              onOpenLocationModal={() => setIsGpsModalOpen(true)}
            />
          )}

          {/* ================================================================= */}
          {/* SCREEN B: ARTISAN DIRECTORY LISTING */}
          {/* ================================================================= */}
          {activeTab === 'directory' && (
            <ScreenArtisanDirectory
              onBack={() => setActiveTab('home')}
              onSelectArtisan={handleSelectArtisanForProfile}
              onRequestContact={(artisan) => {
                setBookingArtisan(artisan);
              }}
              selectedCategory={selectedCategoryFilter}
              searchQuery={searchQuery}
              onOpenLocationModal={() => setIsGpsModalOpen(true)}
            />
          )}

          {/* ================================================================= */}
          {/* SCREEN C: ARTISAN PROFILE & PORTFOLIO */}
          {/* ================================================================= */}
          {activeTab === 'profile' && (
            <ScreenArtisanProfile
              artisan={selectedArtisan}
              onBack={() => setActiveTab('directory')}
              onRequestQuote={(artisan) => {
                setBookingArtisan(artisan);
              }}
              onOpenChat={(artisan) => {
                const job = jobRequests.find((j) => j.artisanId === artisan.id);
                if (job) setActiveChatJob(job);
                else setActiveTab('jobs');
              }}
            />
          )}

          {/* ================================================================= */}
          {/* SCREEN D: CLIENT BOOKING & JOBS */}
          {/* ================================================================= */}
          {activeTab === 'jobs' && (
            <ScreenClientJobs
              onBack={() => setActiveTab('directory')}
              onOpenJobChat={(job) => setActiveChatJob(job)}
              onNewBookingRequest={() => {
                setSelectedCategoryFilter('painter');
                setActiveTab('directory');
              }}
            />
          )}

          {/* ================================================================= */}
          {/* PRO HUB: ARTISAN SUITE & WORK CENTER */}
          {/* ================================================================= */}
          {activeTab === 'artisan_suite' && (
            <div className="flex flex-col min-h-full bg-stone-50 dark:bg-stone-950 p-4 space-y-4">
              {/* Top Sub-navigation for Artisan Suite */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobForQuoteBuilder(null);
                      setArtisanSubTab('dashboard');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      artisanSubTab === 'dashboard' && !selectedJobForQuoteBuilder
                        ? 'bg-orange-500 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    Work Center
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobForQuoteBuilder(null);
                      setArtisanSubTab('portfolio');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      artisanSubTab === 'portfolio'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    Portfolio Manager
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobForQuoteBuilder(null);
                      setArtisanSubTab('inbox');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      artisanSubTab === 'inbox' && !selectedJobForQuoteBuilder
                        ? 'bg-orange-500 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    Enquiries
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsKYCModalOpen(true)}
                  className="p-1.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1"
                  title="Ghana Card KYC Verification"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">KYC</span>
                </button>
              </div>

              {/* Sub-view Rendering */}
              {selectedJobForQuoteBuilder ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForQuoteBuilder(null)}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  >
                    ← Back to Work Center
                  </button>
                  <ArtisanQuoteBuilder
                    job={selectedJobForQuoteBuilder}
                    onClose={() => setSelectedJobForQuoteBuilder(null)}
                    onOpenChat={() => {
                      setSelectedJobForQuoteBuilder(null);
                      setArtisanSubTab('inbox');
                    }}
                  />
                </div>
              ) : (
                <>
                  {artisanSubTab === 'dashboard' && (
                    <ArtisanDashboard
                      onOpenPortfolio={() => setArtisanSubTab('portfolio')}
                      onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                      onOpenKYC={() => setIsKYCModalOpen(true)}
                      onOpenQuoteBuilder={(job) => setSelectedJobForQuoteBuilder(job)}
                      onOpenChat={() => setArtisanSubTab('inbox')}
                    />
                  )}

                  {artisanSubTab === 'portfolio' && <ArtisanPortfolioManager />}

                  {artisanSubTab === 'inbox' && (
                    <ArtisanChatInbox
                      onOpenQuoteBuilder={(job) => setSelectedJobForQuoteBuilder(job)}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </MobileAppShell>
      </main>

      {/* ================================================================= */}
      {/* GLOBAL MODALS & DRAWERS */}
      {/* ================================================================= */}

      {/* Live Chat & Status Drawer for Active Jobs */}
      {activeChatJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl h-[90vh] rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-3 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold text-xs">
                  Active Dispatch & Timeline: Job ID {activeChatJob.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveChatJob(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ClientBookingsChat
                selectedJobId={activeChatJob.id}
                onBackToDashboard={() => setActiveChatJob(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Request & Quote Workflow Modal */}
      <JobRequestModal
        artisan={bookingArtisan}
        isOpen={!!bookingArtisan}
        onClose={() => setBookingArtisan(null)}
        onSuccessRedirectToBookings={handleBookingSubmitted}
      />

      {/* Ghana Post Digital Address Selector Modal */}
      <GhanaPostSelectorModal
        isOpen={isGpsModalOpen}
        onClose={() => setIsGpsModalOpen(false)}
        currentAddress={currentLocation}
        onSelectAddress={setCurrentLocation}
      />

      {/* Client Onboarding / Phone OTP Modal */}
      <ClientOnboarding
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Artisan Registration & Ghana Card KYC Modal */}
      <ArtisanRegistrationKYC
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
      />

      {/* Artisan Subscription Sheet */}
      <ArtisanSubscriptionSheet
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </div>
  );
}
