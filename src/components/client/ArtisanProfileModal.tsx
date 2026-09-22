import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  Banknote,
  Wrench,
  ThumbsUp,
} from 'lucide-react';
import { Artisan, PortfolioProject } from '../../types';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { CATEGORY_DEFINITIONS } from '../../data/mockData';

interface ArtisanProfileModalProps {
  artisan: Artisan | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestBook: (artisan: Artisan) => void;
}

export const ArtisanProfileModal: React.FC<ArtisanProfileModalProps> = ({
  artisan,
  isOpen,
  onClose,
  onRequestBook,
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'about'>('portfolio');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  if (!isOpen || !artisan) return null;

  // Selected project for before/after comparison
  const displayProject = activeProject || artisan.portfolio[0];

  const handleCall = () => {
    window.open(`tel:${artisan.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const cleanPhone = artisan.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${artisan.name}, I found your profile on Artisan Hub (${artisan.tradeTitle}). Are you available for a job?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close */}
        <div className="relative bg-stone-950 text-white p-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
              />
              {artisan.isPro && (
                <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow">
                  PRO
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-white truncate">
                  {artisan.name}
                </h1>
                {artisan.isGhanaCardVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Ghana Card</span>
                  </span>
                )}
              </div>

              <p className="text-stone-300 text-xs sm:text-sm font-medium mt-0.5">
                {artisan.tradeTitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-300">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{artisan.rating}</span>
                  <span className="text-stone-400 font-normal">
                    ({artisan.totalReviews} reviews)
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{artisan.distanceKm} km away</span>
                  <span className="text-stone-400">({artisan.locationArea})</span>
                </div>
                <span>•</span>
                <span className="font-mono text-amber-300">
                  GPS: {artisan.ghanaPostGps}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Direct Call, WhatsApp shortcut, Request Job / Book */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={handleCall}
              className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Direct Call</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onRequestBook(artisan);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Request Job</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 px-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Portfolio & Before/After ({artisan.portfolio.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Verified Reviews ({artisan.reviews.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Trade Services & Skills</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: Portfolio & Interactive Before/After Slider */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {displayProject && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {displayProject.title}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Interactive split slider: drag line to see real transformation
                      </p>
                    </div>
                    {displayProject.estimatedCostGhs && (
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono font-bold text-xs">
                        GH₵ {displayProject.estimatedCostGhs}
                      </span>
                    )}
                  </div>

                  {/* Slider */}
                  <BeforeAfterSlider
                    beforeImage={displayProject.beforePhoto}
                    afterImage={displayProject.afterPhoto}
                    beforeLabel="Before Work"
                    afterLabel="Finished Work"
                    title={displayProject.title}
                  />

                  {/* Description & metadata */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
                    <p className="flex-1 min-w-[200px] mr-2">
                      {displayProject.description}
                    </p>
                    <div className="flex items-center gap-3 shrink-0 text-stone-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Time: {displayProject.completionTime}
                      </span>
                      <span>•</span>
                      <span>Date: {displayProject.createdAt}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio thumbnail grid */}
              {artisan.portfolio.length > 1 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wider">
                    More Previous Projects
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {artisan.portfolio.map((proj) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => setActiveProject(proj)}
                        className={`text-left rounded-xl border overflow-hidden transition-all ${
                          displayProject?.id === proj.id
                            ? 'border-amber-500 ring-2 ring-amber-500/20'
                            : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <img
                          src={proj.afterPhoto}
                          alt={proj.title}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 bg-white dark:bg-stone-800">
                          <p className="text-[11px] font-bold line-clamp-1">
                            {proj.title}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            {proj.completionTime}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Reviews & Ratings */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    {artisan.rating}
                  </div>
                  <div className="flex text-amber-500 justify-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <p className="font-bold text-stone-900 dark:text-stone-100">
                    100% Verified Artisan Hub Bookings
                  </p>
                  <p className="text-stone-500">
                    All reviews come from verified clients who paid through Mobile Money or confirmed direct cash receipt.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {artisan.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-xs">
                          {rev.clientName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                              {rev.clientName}
                            </span>
                            {rev.verifiedBooking && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                Verified Booking
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {rev.clientPhoneMasked} • {rev.jobCategory}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                      <span>{rev.date}</span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <ThumbsUp className="w-3 h-3" /> Helpful
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: About & Sub-services */}
          {activeTab === 'about' && (
            <div className="space-y-5 text-xs text-stone-700 dark:text-stone-300">
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1.5">
                  Artisan Biography & Background
                </h4>
                <p className="leading-relaxed">{artisan.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                  Trade Sub-Services & Specializations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {artisan.subServices.map((sub, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2">
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                  Verification & Safety Standards
                </h4>
                <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                  <p>✓ National Identification Authority (NIA) Ghana Card verified.</p>
                  <p>✓ Workshop address pinned and cross-checked on Ghana Post GPS.</p>
                  <p>✓ Direct client payment after inspection (Cash or Mobile Money).</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
