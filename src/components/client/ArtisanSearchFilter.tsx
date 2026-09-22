import React, { useState, useMemo } from 'react';
import {
  List,
  Map as MapIcon,
  Filter,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  SlidersHorizontal,
  X,
  Sparkles,
  Search,
  Wrench,
} from 'lucide-react';
import { Artisan, TradeCategory } from '../../types';
import { CATEGORY_DEFINITIONS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface ArtisanSearchFilterProps {
  onSelectArtisan: (artisan: Artisan) => void;
  onRequestBook: (artisan: Artisan) => void;
  initialCategory?: TradeCategory | 'all';
  initialSearchQuery?: string;
  isEmergencyOnly?: boolean;
}

export const ArtisanSearchFilter: React.FC<ArtisanSearchFilterProps> = ({
  onSelectArtisan,
  onRequestBook,
  initialCategory = 'all',
  initialSearchQuery = '',
  isEmergencyOnly = false,
}) => {
  const { artisans, currentLocation } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory | 'all'>(initialCategory);
  const [selectedSubService, setSelectedSubService] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [onlyVerifiedPro, setOnlyVerifiedPro] = useState<boolean>(false);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState<boolean>(isEmergencyOnly);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [hoveredArtisanId, setHoveredArtisanId] = useState<string | null>(null);

  // Available sub-services based on selected category
  const availableSubServices = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return CATEGORY_DEFINITIONS[selectedCategory]?.subServices || [];
  }, [selectedCategory]);

  // Filtered artisans
  const filteredArtisans = useMemo(() => {
    return artisans.filter((art) => {
      // Emergency / availability filter
      if (isEmergencyOnly && !art.emergencyAvailable) return false;
      if (onlyAvailableNow && !art.isAvailable) return false;

      // Category filter
      if (selectedCategory !== 'all' && art.trade !== selectedCategory) return false;

      // Sub-service filter
      if (
        selectedSubService !== 'all' &&
        !art.subServices.some((s) => s.toLowerCase().includes(selectedSubService.toLowerCase()))
      ) {
        return false;
      }

      // Pro badge filter
      if (onlyVerifiedPro && !art.isPro) return false;

      // Rating filter
      if (art.rating < minRating) return false;

      // Distance filter
      if (art.distanceKm && art.distanceKm > maxDistanceKm) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = art.name.toLowerCase().includes(q);
        const matchTrade = art.tradeTitle.toLowerCase().includes(q);
        const matchArea = art.locationArea.toLowerCase().includes(q);
        const matchSub = art.subServices.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchTrade && !matchArea && !matchSub) return false;
      }

      return true;
    });
  }, [
    artisans,
    isEmergencyOnly,
    onlyAvailableNow,
    selectedCategory,
    selectedSubService,
    onlyVerifiedPro,
    minRating,
    maxDistanceKm,
    searchQuery,
  ]);

  return (
    <div className="space-y-4">
      {/* Search Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plumber, electrician, generator, tile..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedCategory !== 'all' ||
              selectedSubService !== 'all' ||
              onlyVerifiedPro ||
              maxDistanceKm < 25
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {(selectedCategory !== 'all' || onlyVerifiedPro) && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Toggle View: List vs Map */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Pin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
            setSelectedSubService('all');
          }}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
          }`}
        >
          All Trades ({artisans.length})
        </button>

        {(Object.keys(CATEGORY_DEFINITIONS) as TradeCategory[]).map((cat) => {
          const def = CATEGORY_DEFINITIONS[cat];
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubService('all');
              }}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{def.iconEmoji}</span>
              <span>{def.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-services pills if a category is selected */}
      {availableSubServices.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-stone-400 font-medium whitespace-nowrap pl-1">
            Sub-services:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSubService('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              selectedSubService === 'all'
                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            All
          </button>
          {availableSubServices.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubService(sub.name)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap border transition-colors ${
                selectedSubService === sub.name
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Content View */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtisans.length === 0 ? (
            <div className="col-span-full py-12 text-center text-stone-500 space-y-2">
              <Wrench className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-semibold text-sm">No artisans found matching criteria.</p>
              <p className="text-xs">Try increasing the distance radius or clearing filters.</p>
            </div>
          ) : (
            filteredArtisans.map((artisan) => (
              <div
                key={artisan.id}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top image / cover with status */}
                  <div className="relative h-28 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    {artisan.portfolio[0] ? (
                      <img
                        src={artisan.portfolio[0].afterPhoto}
                        alt="Work sample"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-amber-500/20 to-stone-500/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Pro badge */}
                    {artisan.isPro && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-bold text-[10px] shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Verified Pro</span>
                      </div>
                    )}

                    {/* Online status */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          artisan.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                        }`}
                      />
                      <span>{artisan.isAvailable ? 'Available Now' : 'Offline'}</span>
                    </div>

                    {/* Distance from client */}
                    <div className="absolute bottom-2 left-2.5 text-white flex items-center gap-1 text-xs font-mono font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{artisan.distanceKm || 2.5} km away</span>
                      <span className="text-stone-300 font-normal">
                        ({artisan.ghanaPostGps})
                      </span>
                    </div>
                  </div>

                  {/* Profile info */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                            {artisan.name}
                          </h3>
                          {artisan.isGhanaCardVerified && (
                            <span
                              title="Ghana Card Verified (NIA)"
                              className="text-emerald-500 shrink-0"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {artisan.tradeTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {artisan.rating}
                          </span>
                          <span className="text-stone-400">
                            ({artisan.totalReviews} reviews)
                          </span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-500">
                            {artisan.experienceYears} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mt-2.5">
                      {artisan.bio}
                    </p>

                    {/* Sub services tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {artisan.subServices.slice(0, 2).map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-400 truncate max-w-[200px]"
                        >
                          {sub}
                        </span>
                      ))}
                      {artisan.subServices.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-500">
                          +{artisan.subServices.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="p-4 pt-0 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectArtisan(artisan)}
                    className="flex-1 py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors text-center"
                  >
                    View Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestBook(artisan)}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-xs font-bold text-stone-950 transition-all text-center shadow-sm"
                  >
                    Request Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Interactive Ghana Map View */
        <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-900 text-white overflow-hidden h-[540px]">
          {/* Map canvas simulation with SVG terrain & interactive pins */}
          <div className="absolute inset-0 bg-[#121820] overflow-hidden">
            {/* Grid & road pattern simulation */}
            <svg
              className="w-full h-full opacity-30"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="map-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="0.75"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />
              {/* Simulated Accra major roads (George Walker Bush Hwy, Ring Road, Liberation Rd) */}
              <path
                d="M 50 480 Q 250 300 650 200 T 1100 120"
                fill="none"
                stroke="#d97706"
                strokeWidth="4"
                strokeOpacity="0.4"
              />
              <path
                d="M 120 100 Q 300 350 500 500"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeOpacity="0.5"
              />
              <path
                d="M 400 50 Q 550 250 800 450"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
            </svg>

            {/* Client Location Pin */}
            <div className="absolute top-[52%] left-[44%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="w-8 h-8 rounded-full bg-amber-500/30 animate-ping absolute" />
                <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white text-stone-950 flex items-center justify-center shadow-lg">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-1 px-2 py-0.5 rounded bg-stone-900/90 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/40 shadow-md">
                You ({currentLocation.code})
              </div>
            </div>

            {/* Radius circle around user */}
            <div
              className="absolute top-[52%] left-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-amber-500/40 pointer-events-none transition-all duration-300"
              style={{
                width: `${maxDistanceKm * 28}px`,
                height: `${maxDistanceKm * 28}px`,
              }}
            />

            {/* Artisan Pins on Map */}
            {filteredArtisans.map((artisan, index) => {
              // Distribute pins realistically around the center
              const angles = [35, 120, 210, 310, 75, 185];
              const angle = (angles[index % angles.length] * Math.PI) / 180;
              const radiusPixels = Math.min(220, (artisan.distanceKm || 3) * 26);
              const topOffset = 52 + (Math.sin(angle) * radiusPixels) / 4.8;
              const leftOffset = 44 + (Math.cos(angle) * radiusPixels) / 8.5;

              return (
                <div
                  key={artisan.id}
                  style={{ top: `${topOffset}%`, left: `${leftOffset}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  onClick={() => onSelectArtisan(artisan)}
                  onMouseEnter={() => setHoveredArtisanId(artisan.id)}
                  onMouseLeave={() => setHoveredArtisanId(null)}
                >
                  <div
                    className={`flex items-center gap-1.5 p-1.5 rounded-full shadow-lg border transition-all ${
                      artisan.isPro
                        ? 'bg-amber-500 text-stone-950 border-white ring-2 ring-amber-400/50 scale-105'
                        : 'bg-stone-900 text-white border-stone-600'
                    }`}
                  >
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="hidden sm:flex flex-col text-left pr-1.5">
                      <span className="text-[11px] font-bold leading-tight truncate max-w-[80px]">
                        {artisan.name}
                      </span>
                      <span className="text-[9px] font-semibold opacity-90">
                        {CATEGORY_DEFINITIONS[artisan.trade].iconEmoji} {artisan.distanceKm}km
                      </span>
                    </div>
                  </div>

                  {/* Tooltip on hover */}
                  {hoveredArtisanId === artisan.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl bg-stone-950 border border-stone-700 shadow-2xl text-xs z-50 animate-in fade-in">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span className="truncate">{artisan.name}</span>
                        <span className="text-amber-400 font-mono">
                          ★ {artisan.rating}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 truncate">
                        {artisan.tradeTitle}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono mt-1">
                        GPS: {artisan.ghanaPostGps} ({artisan.distanceKm} km)
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestBook(artisan);
                        }}
                        className="w-full mt-2 py-1 rounded bg-amber-500 text-stone-950 font-bold text-[11px]"
                      >
                        Book Now
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-40 bg-stone-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-800 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                Showing <b>{filteredArtisans.length}</b> verified artisans on map
              </span>
            </div>

            <div className="absolute bottom-4 right-4 z-40 bg-stone-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-stone-800 text-[11px] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Verified Pro Artisan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600" />
                <span>Standard Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Sheet Modal */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Search & Distance Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Distance Radius Slider (1 km to 25 km) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>Distance Radius</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {maxDistanceKm} km
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>1 km (Neighborhood)</span>
                <span>25 km (Greater City)</span>
              </div>
            </div>

            {/* Rating Filter (4+ stars) */}
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Minimum Rating
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[4.0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinRating(rate)}
                    className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1 transition-colors ${
                      minRating === rate
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    <span>{rate}+ Stars</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subscription Badge Filter */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Verified Pro Only
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Top-tier vetted artisans with verified portfolios
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyVerifiedPro}
                  onChange={(e) => setOnlyVerifiedPro(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Online & Available Now
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Ready for immediate dispatch
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={onlyAvailableNow}
                  onChange={(e) => setOnlyAvailableNow(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubService('all');
                  setMaxDistanceKm(20);
                  setMinRating(4.0);
                  setOnlyVerifiedPro(false);
                  setOnlyAvailableNow(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm"
              >
                Apply Filters ({filteredArtisans.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
