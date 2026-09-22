import React, { useState } from 'react';
import {
  Search,
  Mic,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_DEFINITIONS } from '../../data/mockData';
import { Artisan, TradeCategory } from '../../types';

interface ClientDashboardProps {
  onSelectCategory: (category: TradeCategory) => void;
  onSelectArtisan: (artisan: Artisan) => void;
  onRequestBook: (artisan: Artisan) => void;
  onOpenEmergencyMode: () => void;
  onOpenSearch: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onSelectCategory,
  onSelectArtisan,
  onRequestBook,
  onOpenEmergencyMode,
  onOpenSearch,
}) => {
  const { artisans, currentLocation, urgentJobBannerOpen, setUrgentJobBannerOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Top rated pro artisans within 5km
  const featuredArtisans = artisans
    .filter((a) => a.isPro && a.rating >= 4.8)
    .slice(0, 4);

  // Voice Search handler
  const handleVoiceSearch = () => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-GH'; // Ghanaian English
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListeningVoice(true);
      setVoiceNotice('Listening... Speak trade or repair (e.g. "Plumber for burst pipe")');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListeningVoice(false);
        setVoiceNotice(`Searched for: "${transcript}"`);
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
        setVoiceNotice('Voice query simulated: "Plumber near East Legon"');
        setSearchQuery('Plumber near East Legon');
        setTimeout(() => setVoiceNotice(null), 2500);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } else {
      // Fallback simulation for sandbox
      setIsListeningVoice(true);
      setVoiceNotice('Simulating voice input...');
      setTimeout(() => {
        setIsListeningVoice(false);
        setSearchQuery('Emergency Electrician');
        setVoiceNotice('Recognized: "Emergency Electrician"');
        setTimeout(() => setVoiceNotice(null), 2000);
      }, 1200);
    }
  };

  const categories = Object.keys(CATEGORY_DEFINITIONS) as TradeCategory[];

  return (
    <div className="space-y-6">
      {/* Search Bar with Voice-Search Support */}
      <div className="relative">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm focus-within:ring-2 focus-within:ring-amber-500">
          <Search className="w-5 h-5 text-stone-400 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onOpenSearch();
            }}
            placeholder="Search verified plumbers, electricians, masons, AC..."
            className="w-full bg-transparent py-1.5 px-2 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isListeningVoice
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
            }`}
            title="Voice Search (Speak repair name or trade)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shrink-0 shadow-sm transition-colors"
          >
            Search
          </button>
        </div>

        {voiceNotice && (
          <div className="absolute top-full left-0 mt-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-amber-300 text-xs shadow-lg z-20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{voiceNotice}</span>
          </div>
        )}
      </div>

      {/* Emergency / Urgent Services Banner */}
      {urgentJobBannerOpen && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white p-5 shadow-lg">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                <span>Immediate 30-Min Dispatch</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Emergency & Urgent Repairs
              </h2>
              <p className="text-xs text-red-100 max-w-lg">
                Burst water pipe, total power blackout, or leaking gas? One-tap access to ready-to-move artisans in {currentLocation.area}.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenEmergencyMode}
                className="py-2.5 px-4 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-md hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Find Urgent Artisans</span>
              </button>
            </div>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>
      )}

      {/* Category Grid: Visual icons for key trades */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Home Repair Trades</span>
            <span className="text-xs font-normal text-stone-400">
              (Choose category)
            </span>
          </h2>
          <button
            type="button"
            onClick={onOpenSearch}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((catKey) => {
            const cat = CATEGORY_DEFINITIONS[catKey];
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => onSelectCategory(catKey)}
                className="group relative flex flex-col items-center text-center p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-2xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                  {cat.iconEmoji}
                </div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.label}
                </span>
                <span className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                  {cat.subServices.length} services
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured / Top-Rated Artisans Carousel (Pro 4.8+ within 5km) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Top-Rated Verified Pro Artisans
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                4.8+ rating within 5km radius of {currentLocation.code}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSearch}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Browse All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Pro Pill */}
                <div className="relative h-32 bg-stone-100 dark:bg-stone-800">
                  <img
                    src={artisan.portfolio[0]?.afterPhoto || artisan.avatar}
                    alt={artisan.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-bold text-[10px] shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Verified Pro</span>
                  </div>

                  <div className="absolute bottom-2 left-2 text-white flex items-center gap-1 text-[11px] font-mono">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{artisan.distanceKm} km ({artisan.locationArea})</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                          {artisan.name}
                        </h3>
                        {artisan.isGhanaCardVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {artisan.tradeTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{artisan.rating}</span>
                      <span className="text-stone-400 font-normal">
                        ({artisan.totalReviews})
                      </span>
                    </div>
                    <span className="text-stone-500 font-medium text-[11px]">
                      From GH₵ {artisan.startingPriceGhs}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-stone-100 dark:border-stone-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelectArtisan(artisan)}
                  className="flex-1 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors"
                >
                  Portfolio
                </button>
                <button
                  type="button"
                  onClick={() => onRequestBook(artisan)}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold transition-colors"
                >
                  Book Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
