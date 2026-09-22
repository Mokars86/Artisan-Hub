import React, { useState } from 'react';
import {
  Search,
  Mic,
  ArrowRight,
  Paintbrush,
  Wrench,
  Zap,
  Hammer,
  MapPin,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TradeCategory } from '../../types';
import { AppLogo } from '../common/AppLogo';

interface ScreenOnboardingSearchProps {
  onSelectCategory: (category: TradeCategory) => void;
  onSearch: (query: string) => void;
  onNavigateToDirectory: () => void;
  onOpenEmergency: () => void;
  onOpenLocationModal?: () => void;
}

export const ScreenOnboardingSearch: React.FC<ScreenOnboardingSearchProps> = ({
  onSelectCategory,
  onSearch,
  onNavigateToDirectory,
  onOpenEmergency,
  onOpenLocationModal,
}) => {
  const { currentLocation } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-GH';
      setIsListeningVoice(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchInput(transcript);
        setIsListeningVoice(false);
        onSearch(transcript);
      };

      recognition.onerror = () => setIsListeningVoice(false);
      recognition.onend = () => setIsListeningVoice(false);
      recognition.start();
    } else {
      setIsListeningVoice(true);
      setTimeout(() => {
        setIsListeningVoice(false);
        setSearchInput('Painter in Kumasi');
        onSearch('Painter in Kumasi');
      }, 1000);
    }
  };

  const categories = [
    {
      id: 'painter' as TradeCategory,
      name: 'Painter',
      icon: Paintbrush,
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      iconColor: 'text-orange-500',
      accentColor: 'border-orange-200 dark:border-orange-800',
      description: 'Interior, exterior, POP ceilings',
    },
    {
      id: 'plumber' as TradeCategory,
      name: 'Plumber',
      icon: Wrench,
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      iconColor: 'text-sky-500',
      accentColor: 'border-sky-200 dark:border-sky-800',
      description: 'Burst pipes, tanks, pumps',
    },
    {
      id: 'electrician' as TradeCategory,
      name: 'Electrician',
      icon: Zap,
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-500',
      accentColor: 'border-amber-200 dark:border-amber-800',
      description: 'Wiring, meters, generators',
    },
    {
      id: 'carpenter' as TradeCategory,
      name: 'Carpenter',
      icon: Hammer,
      bg: 'bg-stone-100 dark:bg-stone-800',
      iconColor: 'text-stone-700 dark:text-stone-300',
      accentColor: 'border-stone-200 dark:border-stone-700',
      description: 'Cabinets, roofing, doors',
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#0C182B] text-white">
      {/* Top Header Section with Greeting & Ghana Post Selector */}
      <div className="px-6 pt-2 pb-6 space-y-4">
        {/* Location Selector Pill */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs text-stone-200 border border-white/15 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold">{currentLocation.area}</span>
            <span className="text-[10px] text-stone-400 font-mono">
              ({currentLocation.code})
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-bold hover:bg-red-500/30 transition-colors"
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Emergency 24/7</span>
          </button>
        </div>

        {/* Welcome Brand Header with Logo */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <AppLogo size="sm" textColor="white" />
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-1 rounded-full bg-red-600" />
              <span className="w-5 h-1 rounded-full bg-amber-400" />
              <span className="w-5 h-1 rounded-full bg-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-[1.15] text-white uppercase pt-1">
            FIND CERTIFIED <br />
            <span className="text-orange-400">GHANAIAN</span> <br />
            ARTISANS
          </h1>
        </div>

        {/* Search Bar matching Screen A */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-lg">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch(searchInput);
              }}
              placeholder="Search: Plumber, Electrician..."
              className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-xs sm:text-sm font-medium focus:outline-none"
            />

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Voice Search"
              className={`p-1.5 rounded-full transition-colors ${
                isListeningVoice
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-stone-400 hover:text-orange-500 hover:bg-stone-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Curved Bottom White Sheet with Categories */}
      <div className="flex-1 bg-white dark:bg-stone-950 rounded-t-[32px] px-6 pt-6 pb-6 text-stone-900 dark:text-stone-100 flex flex-col justify-between shadow-2xl">
        <div className="space-y-4">
          {/* Categories Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Categories
            </h2>
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              See All Artisans
            </button>
          </div>

          {/* 4 Trade Category Tiles (2x2 Grid) matching Screen A */}
          <div className="grid grid-cols-2 gap-3.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  id={`category-${cat.id}`}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center group active:scale-95 ${cat.bg} ${cat.accentColor} hover:shadow-md`}
                >
                  <div className={`p-3 rounded-2xl bg-white dark:bg-stone-900 shadow-sm mb-2 group-hover:scale-110 transition-transform ${cat.iconColor}`}>
                    <Icon className="w-7 h-7 stroke-[2]" />
                  </div>
                  <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                    {cat.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ghana Card Trust Banner */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-[11px] leading-tight">
              <span className="font-bold">100% NIA Ghana Card Verified:</span> Identity, criminal background, and certification checked.
            </p>
          </div>
        </div>

        {/* Big Orange Round Next Button at Bottom matching Screen A */}
        <div className="flex flex-col items-center justify-center pt-4 pb-1">
          <button
            type="button"
            id="btn-onboarding-next"
            onClick={onNavigateToDirectory}
            className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all group"
            title="Browse Verified Artisans"
          >
            <ArrowRight className="w-6 h-6 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </button>
          <span className="text-[11px] font-semibold text-stone-400 mt-2">
            Tap to Explore Nearby Artisans
          </span>
        </div>
      </div>
    </div>
  );
};
