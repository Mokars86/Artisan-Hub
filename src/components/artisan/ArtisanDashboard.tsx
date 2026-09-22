import React, { useState } from 'react';
import {
  Power,
  Eye,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Layers,
  FileText,
  MapPin,
  Clock,
  Phone,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobRequest } from '../../types';

interface ArtisanDashboardProps {
  onOpenPortfolio: () => void;
  onOpenSubscription: () => void;
  onOpenKYC: () => void;
  onOpenQuoteBuilder: (job: JobRequest) => void;
  onOpenChat: () => void;
}

export const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({
  onOpenPortfolio,
  onOpenSubscription,
  onOpenKYC,
  onOpenQuoteBuilder,
  onOpenChat,
}) => {
  const { currentArtisan, toggleArtisanAvailability, jobRequests } = useApp();

  const [dismissAlert, setDismissAlert] = useState(false);

  // Filter urgent / recent job enquiry
  const latestJob = jobRequests[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Online/Offline Toggle & Subscription Pill */}
      <div className="p-5 rounded-3xl bg-stone-900 text-white border border-stone-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentArtisan.avatar}
            alt={currentArtisan.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white">
                {currentArtisan.name}
              </h1>
              {currentArtisan.isGhanaCardVerified && (
                <button
                  type="button"
                  onClick={onOpenKYC}
                  title="Ghana Card Verified"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-stone-400 font-medium">
              {currentArtisan.tradeTitle} • Base: {currentArtisan.locationArea} (
              {currentArtisan.ghanaPostGps})
            </p>
          </div>
        </div>

        {/* Action Controls: Status Toggle & Subscription */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Online / Offline Toggle: High contrast for field use */}
          <button
            type="button"
            onClick={() => toggleArtisanAvailability(currentArtisan.id)}
            className={`py-2 px-4 rounded-xl font-black text-xs flex items-center gap-2 shadow-md transition-all ${
              currentArtisan.isAvailable
                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 ring-2 ring-emerald-400/50'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>
              {currentArtisan.isAvailable ? 'Available for Jobs' : 'Busy / Offline'}
            </span>
          </button>

          {/* Subscription Badge */}
          <button
            type="button"
            onClick={onOpenSubscription}
            className="py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {currentArtisan.isPro ? 'Pro Member' : 'Free Plan'} (
              {currentArtisan.subscription.renewDaysLeft}d left)
            </span>
          </button>
        </div>
      </div>

      {/* New Job Alert Banner (Instant push simulation) */}
      {latestJob && !dismissAlert && (
        <div className="relative overflow-hidden rounded-2xl bg-amber-500 text-stone-950 p-4 sm:p-5 shadow-lg border-2 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  New Job Request
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {latestJob.clientName} ({latestJob.locationAddress})
                </span>
              </div>
              <p className="text-xs font-black text-stone-950">
                {latestJob.subService} • "{latestJob.description.slice(0, 75)}..."
              </p>
              <p className="text-[11px] text-stone-800 font-mono">
                📍 {latestJob.ghanaPostCode} • Window: {latestJob.preferredTimeWindow}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuoteBuilder(latestJob)}
              className="py-2 px-4 rounded-xl bg-stone-950 text-white font-extrabold text-xs hover:bg-stone-800 transition-all shadow-md"
            >
              Build Quote & Respond
            </button>
            <button
              type="button"
              onClick={() => setDismissAlert(true)}
              className="p-2 text-stone-800 hover:text-stone-950 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Profile Views</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
            520
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">
            +18% this week in {currentArtisan.locationArea}
          </p>
        </div>

        {/* Incoming Job Enquiries */}
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Job Enquiries</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
            42
          </div>
          <p className="text-[10px] text-stone-400">
            {jobRequests.length} active in chat inbox
          </p>
        </div>

        {/* Completed Jobs Counter */}
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Completed Jobs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
            88
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">
            4.9★ Average rating
          </p>
        </div>

        {/* Active Subscription Status */}
        <div
          onClick={onOpenSubscription}
          className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 shadow-sm space-y-1 cursor-pointer hover:border-amber-500 transition-all"
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-bold">
            <span>Pro Subscription</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            {currentArtisan.subscription.renewDaysLeft}d Left
          </div>
          <p className="text-[10px] text-stone-500">
            Manage MoMo auto-renewal (GH₵ 85/mo)
          </p>
        </div>
      </div>

      {/* Navigation Quick Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Portfolio Manager Shortcut */}
        <div
          onClick={onOpenPortfolio}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Portfolio Manager & Sliders
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Upload Before/After project photos with on-device 3G compression & offline draft queue.
          </p>
        </div>

        {/* Client Chat & Quotes Shortcut */}
        <div
          onClick={onOpenChat}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Client Inquiries & Quotes
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Listen to client voice notes, inspect problem photos, and send itemized digital quotes.
          </p>
        </div>

        {/* KYC Ghana Card Shortcut */}
        <div
          onClick={onOpenKYC}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Ghana Card & Workshop Pin
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Verified with National Identification Authority and Ghana Post GPS workshop address.
          </p>
        </div>
      </div>
    </div>
  );
};
