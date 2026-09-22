import React, { useState } from 'react';
import {
  Wrench,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  Wifi,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GhanaPostSelectorModal } from './GhanaPostSelectorModal';

interface HeaderProps {
  onOpenGpsModal?: () => void;
  onOpenOnboarding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGpsModal,
  onOpenOnboarding,
}) => {
  const {
    mode,
    setMode,
    theme,
    toggleTheme,
    currentLocation,
    setCurrentLocation,
    artisans,
    activeArtisanId,
    setActiveArtisanId,
    currentArtisan,
    isDataSaverEnabled,
    setIsDataSaverEnabled,
    jobRequests,
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isArtisanDropdownOpen, setIsArtisanDropdownOpen] = useState(false);

  const handleOpenLocation = () => {
    if (onOpenGpsModal) {
      onOpenGpsModal();
    } else {
      setIsLocationModalOpen(true);
    }
  };

  const pendingJobsCount = jobRequests.filter(
    (j) => j.status === 'request_sent' || j.status === 'estimate_received'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-stone-950 px-4 py-1 text-[11px] font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
            🇬🇭 Ghana Post GPS & Mobile Money (MTN MoMo, Telecel, AT) Integrated
          </span>
          <span className="hidden sm:inline text-stone-900 font-normal">
            • 100% NIA Ghana Card Verified Artisans
          </span>
        </div>

        {/* 3G Data Saver Toggle */}
        <button
          type="button"
          onClick={() => setIsDataSaverEnabled(!isDataSaverEnabled)}
          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
            isDataSaverEnabled
              ? 'bg-stone-950 text-amber-400'
              : 'bg-black/10 text-stone-900 hover:bg-black/20'
          }`}
          title="On-device image compression for low-bandwidth 3G networks"
        >
          <Wifi className="w-3 h-3" />
          <span>3G Data Saver: {isDataSaverEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-md ring-2 ring-amber-400/30">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
                Handy<span className="text-amber-500">Ghana</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
              Home Repairs & Verified Trades
            </p>
          </div>
        </div>

        {/* Location Selector Pill */}
        <button
          type="button"
          onClick={handleOpenLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 bg-stone-50 dark:bg-stone-800/80 text-xs font-medium text-stone-800 dark:text-stone-200 shadow-sm transition-all"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="text-left truncate max-w-[130px] sm:max-w-[200px]">
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {currentLocation.code}
            </span>{' '}
            <span className="text-stone-500 dark:text-stone-400 hidden md:inline">
              ({currentLocation.area})
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dual-Sided Mode Switcher Tab */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('client')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'client'
                  ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-100 font-bold shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('artisan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                mode === 'artisan'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Artisan Suite</span>
              {pendingJobsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>

          {/* Artisan switcher dropdown if in Artisan mode */}
          {mode === 'artisan' && (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsArtisanDropdownOpen(!isArtisanDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200"
              >
                <img
                  src={currentArtisan.avatar}
                  alt={currentArtisan.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="font-semibold">{currentArtisan.name}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isArtisanDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-1.5 z-50">
                  <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1">
                    Switch Active Artisan
                  </div>
                  {artisans.map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => {
                        setActiveArtisanId(art.id);
                        setIsArtisanDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                        art.id === activeArtisanId
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <img
                        src={art.avatar}
                        alt={art.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="truncate">{art.name}</div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {art.tradeTitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            title={
              theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to high-contrast dark mode (battery saver for field use)'
            }
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <GhanaPostSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={currentLocation}
        onSelectAddress={setCurrentLocation}
      />
    </header>
  );
};
