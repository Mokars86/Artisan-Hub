import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';
import { Artisan, PortfolioProject } from '../../types';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';

interface ScreenArtisanProfileProps {
  artisan: Artisan;
  onBack: () => void;
  onRequestQuote: (artisan: Artisan) => void;
  onOpenChat: (artisan: Artisan) => void;
}

export const ScreenArtisanProfile: React.FC<ScreenArtisanProfileProps> = ({
  artisan,
  onBack,
  onRequestQuote,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio'>('portfolio');
  const [selectedSubCategory, setSelectedSubCategory] = useState<'Interiors' | 'Exteriors' | 'Commercial'>('Interiors');
  const [copiedShare, setCopiedShare] = useState(false);

  // Selected project for before/after comparison
  const interiorProject = artisan.portfolio[0] || {
    id: 'p-default',
    title: 'Transforming a living space in Adum, Kumasi',
    category: artisan.trade,
    beforePhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    description: 'Repaired rough plaster, applied double-coat screed, and installed clean warm recessed ceiling downlights.',
    completionTime: '3 Days',
    estimatedCostGhs: 1450,
  };

  const exteriorProject = artisan.portfolio[2] || artisan.portfolio[0];

  const currentProject = selectedSubCategory === 'Exteriors' ? exteriorProject : interiorProject;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${artisan.name} - ${artisan.tradeTitle}`,
          text: `Check out ${artisan.name}'s verified portfolio on Artisan Hub!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleCall = () => {
    window.open(`tel:${artisan.phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const cleanPhone = artisan.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${artisan.name}, I found your profile on Artisan Hub (${artisan.tradeTitle}). I'd like to request a quote for a job.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Top Header Bar matching Screen C */}
      <div className="sticky top-0 z-30 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          title="Back to Directory"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h2 className="font-extrabold text-sm text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
          {artisan.name}
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-5 h-5" />
          </button>
          {copiedShare && (
            <span className="absolute right-0 top-full mt-1 px-2 py-1 rounded bg-stone-900 text-white text-[10px] whitespace-nowrap shadow">
              Link Copied!
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Photo Section matching Screen C */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-900 overflow-hidden">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Verification Badges overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider">
                {artisan.trade}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                {artisan.name} - {artisan.tradeTitle}
              </h1>
            </div>

            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{artisan.rating}</span>
              <span className="text-stone-300 text-[10px]">({artisan.totalReviews})</span>
            </div>
          </div>
        </div>

        {/* Verification Strip matching Screen C */}
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verification</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>GH Card</span>
            </span>

            <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 ml-auto">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-semibold">{artisan.ghanaPostGps}</span>
            </div>
          </div>

          {/* Big Orange "Request a Quote" CTA Button matching Screen C */}
          <button
            type="button"
            id="btn-request-quote"
            onClick={() => onRequestQuote(artisan)}
            className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-sm uppercase tracking-wide shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Request a Quote</span>
          </button>
        </div>

        {/* Segmented Tabs: About | Portfolio matching Screen C */}
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-3 text-sm font-extrabold transition-all relative ${
              activeTab === 'about'
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            About
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`py-3 text-sm font-extrabold transition-all relative ${
              activeTab === 'portfolio'
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            Portfolio
            {activeTab === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'portfolio' ? (
          /* Portfolio View matching Screen C */
          <div className="p-4 space-y-4">
            {/* Experience & Passion summary snippet */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-black text-orange-900 dark:text-orange-200">
                  Experience: {artisan.experienceYears} yrs
                </span>
              </div>
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                Passionate painter
              </span>
            </div>

            {/* Subcategories Selector: Interiors | Exteriors | Commercial matching Screen C */}
            <div className="flex items-center gap-2">
              {(['Interiors', 'Exteriors', 'Commercial'] as const).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    selectedSubCategory === sub
                      ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Main Interactive Project Card with Before & After Slider */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 text-[10px] font-black uppercase tracking-wider">
                  INTERIOR PROJECT
                </span>
                <span className="text-xs font-bold text-stone-500">
                  {currentProject.completionTime || '3 Days'}
                </span>
              </div>

              {/* Before & After Interactive Slider with Circular "B&A" Handle */}
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <BeforeAfterSlider
                  beforeImage={currentProject.beforePhoto}
                  afterImage={currentProject.afterPhoto}
                  beforeLabel="Before"
                  afterLabel="After"
                  handleText="B&A"
                />
              </div>

              {/* Project Title & Adum Description matching Screen C */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-stone-900 dark:text-white">
                    Before & After
                  </h3>
                  <span className="text-stone-400 text-xs">•</span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    Live Drag Slider
                  </span>
                </div>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                  {currentProject.title}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {currentProject.description}
                </p>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleCall}
                className="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Direct Call</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          /* About View */
          <div className="p-4 space-y-4">
            {/* Bio */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-2">
              <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                Artisan Bio
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {artisan.bio}
              </p>
            </div>

            {/* Specializations */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-2">
              <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                Services & Capabilities
              </h3>
              <div className="space-y-1.5">
                {artisan.subServices.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reviews */}
            <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                  Client Reviews ({artisan.reviews.length})
                </h3>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {artisan.rating} Average
                </span>
              </div>

              <div className="space-y-3">
                {artisan.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                        {rev.clientName}
                      </span>
                      <span className="text-[10px] text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
