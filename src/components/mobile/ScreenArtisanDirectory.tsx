import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  SlidersHorizontal,
  Star,
  MapPin,
  ShieldCheck,
  Map as MapIcon,
  List as ListIcon,
  Phone,
  MessageCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Artisan, TradeCategory } from '../../types';

interface ScreenArtisanDirectoryProps {
  onBack: () => void;
  onSelectArtisan: (artisan: Artisan) => void;
  onRequestContact: (artisan: Artisan) => void;
  selectedCategory?: TradeCategory | 'all';
  searchQuery?: string;
  onOpenLocationModal?: () => void;
}

export const ScreenArtisanDirectory: React.FC<ScreenArtisanDirectoryProps> = ({
  onBack,
  onSelectArtisan,
  onRequestContact,
  selectedCategory = 'painter',
  searchQuery = '',
  onOpenLocationModal,
}) => {
  const { artisans, currentLocation } = useApp();
  const [activeCategory, setActiveCategory] = useState<TradeCategory | 'all'>(selectedCategory);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const categoryTabs: { id: TradeCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Trades' },
    { id: 'painter', label: 'Painters' },
    { id: 'plumber', label: 'Plumbers' },
    { id: 'electrician', label: 'Electricians' },
    { id: 'carpenter', label: 'Carpenters' },
    { id: 'mason', label: 'Masons' },
    { id: 'ac_tech', label: 'AC Techs' },
  ];

  const filteredArtisans = useMemo(() => {
    return artisans.filter((art) => {
      if (activeCategory !== 'all' && art.trade !== activeCategory) return false;
      if (onlyVerified && !art.isGhanaCardVerified) return false;
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        const matchName = art.name.toLowerCase().includes(q);
        const matchTrade = art.tradeTitle.toLowerCase().includes(q);
        const matchArea = art.locationArea.toLowerCase().includes(q);
        const matchServices = art.subServices.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchTrade && !matchArea && !matchServices) return false;
      }
      return true;
    });
  }, [artisans, activeCategory, onlyVerified, localSearch]);

  const currentCategoryTitle =
    activeCategory === 'all'
      ? 'All Verified Artisans'
      : activeCategory === 'painter'
      ? 'Nearby Painters (4.5★+)'
      : `Nearby ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}s`;

  return (
    <div className="flex flex-col min-h-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Top Bar matching Screen B */}
      <div className="sticky top-0 z-30 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
            Filtered
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-[10px] font-bold">
            {filteredArtisans.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Map / List toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={viewMode === 'list' ? 'Switch to Map' : 'Switch to List'}
          >
            {viewMode === 'list' ? (
              <MapIcon className="w-4 h-4 text-orange-500" />
            ) : (
              <ListIcon className="w-4 h-4 text-orange-500" />
            )}
          </button>

          {/* Filter sheet trigger */}
          <button
            type="button"
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`p-2 rounded-xl border transition-colors ${
              onlyVerified
                ? 'bg-orange-500 text-white border-orange-500'
                : 'text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
            }`}
            title="Filter Ghana Card Verified"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        {categoryTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Section Header with Location context */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <h2 className="font-black text-sm text-stone-900 dark:text-white tracking-tight">
            {currentCategoryTitle}
          </h2>
          <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            <MapPin className="w-3 h-3 text-orange-500" />
            <span>Near {currentLocation.area} ({currentLocation.code})</span>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
          Radius: 5km
        </span>
      </div>

      {/* Main Content: List or Map */}
      {viewMode === 'map' ? (
        /* Interactive Map View with Ghana Post GPS pins */
        <div className="p-4 flex-1">
          <div className="relative w-full h-96 rounded-2xl bg-stone-900 overflow-hidden border border-stone-300 dark:border-stone-800 flex flex-col justify-between p-4 text-white">
            <div className="z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-orange-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Live GPS Dispatch
              </span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-2 py-1 rounded-lg bg-white/20 text-xs font-bold hover:bg-white/30"
              >
                Back to List
              </button>
            </div>

            {/* Simulated Pins */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72 rounded-full border border-orange-500/20 animate-ping" />
              <div className="absolute top-1/3 left-1/3 p-2 rounded-full bg-orange-500 text-white shadow-lg pointer-events-auto cursor-pointer flex items-center gap-1">
                <span className="text-xs font-bold">Kojo Mensah</span>
                <span className="text-[10px] bg-white text-orange-600 px-1 rounded font-black">4.8★</span>
              </div>
              <div className="absolute bottom-1/3 right-1/4 p-2 rounded-full bg-sky-500 text-white shadow-lg pointer-events-auto cursor-pointer flex items-center gap-1">
                <span className="text-xs font-bold">Kwame Mensah</span>
                <span className="text-[10px] bg-white text-sky-600 px-1 rounded font-black">4.9★</span>
              </div>
            </div>

            <div className="z-10 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs space-y-1">
              <p className="font-bold text-orange-400">Ghana Post GPS Geofencing Active</p>
              <p className="text-[11px] text-stone-300">
                Displaying certified artisans verified within {currentLocation.area} radius.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* List View matching Screen B */
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {filteredArtisans.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <p className="font-semibold text-sm">No artisans found for this filter.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setOnlyVerified(false);
                  setLocalSearch('');
                }}
                className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                id={`artisan-card-${artisan.id}`}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-all overflow-hidden p-4 space-y-3"
              >
                {/* Header Row: Avatar, Info, and Star */}
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-400 shrink-0"
                    />
                    {artisan.isPro && (
                      <span className="absolute -bottom-1.5 -right-1 px-1 rounded bg-orange-500 text-white font-black text-[8px] uppercase tracking-wider">
                        PRO
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-base text-stone-900 dark:text-white truncate">
                        {artisan.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-xs shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{artisan.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 capitalize">
                        Trade: {artisan.trade}
                      </span>
                      {artisan.isGhanaCardVerified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>GH Card</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                      <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                      <span className="truncate">
                        {artisan.locationArea}, {artisan.ghanaPostGps}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                      {artisan.rating} ★ | {artisan.totalReviews} reviews
                    </div>
                  </div>
                </div>

                {/* 3 Portfolio Photo Thumbnails Row matching Screen B */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {artisan.portfolio.slice(0, 3).map((project, idx) => (
                    <div
                      key={project.id || idx}
                      onClick={() => onSelectArtisan(artisan)}
                      className="relative h-20 rounded-xl overflow-hidden cursor-pointer group bg-stone-100 dark:bg-stone-800"
                    >
                      <img
                        src={project.afterPhoto}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate drop-shadow">
                        {project.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Buttons matching Screen B */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectArtisan(artisan)}
                    className="py-2.5 px-3 rounded-xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors text-center"
                  >
                    View Portfolio
                  </button>

                  <button
                    type="button"
                    onClick={() => onRequestContact(artisan)}
                    className="py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-xs font-black text-white shadow-sm transition-all text-center"
                  >
                    Contact
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
