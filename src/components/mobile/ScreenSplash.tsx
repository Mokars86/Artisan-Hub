import React from 'react';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Lock,
} from 'lucide-react';
import { AppLogo } from '../common/AppLogo';
import artisanHubLogoUrl from '../../assets/images/artisan_hub_logo_1789965396816.jpg';

interface ScreenSplashProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreGuest: () => void;
}

export const ScreenSplash: React.FC<ScreenSplashProps> = ({
  onGetStarted,
  onSignIn,
  onExploreGuest,
}) => {
  return (
    <div className="flex flex-col min-h-full bg-[#0C182B] text-white select-none justify-between p-6 relative overflow-hidden">
      {/* Background Decorative Lighting & Geometric Ghanaian Accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-60 h-60 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      {/* Ghana Flag Stripe Ribbon at Top */}
      <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
        <span className="w-8 h-1 rounded-full bg-red-600" />
        <span className="w-8 h-1 rounded-full bg-amber-400" />
        <span className="w-8 h-1 rounded-full bg-emerald-600" />
      </div>

      {/* Center Brand Identity Section */}
      <div className="my-auto flex flex-col items-center text-center space-y-6 z-10 py-6">
        {/* New Generated Logo Emblem */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-orange-600 via-amber-400 to-orange-500 shadow-[0_16px_40px_rgba(249,115,22,0.45)]">
            <img
              src={artisanHubLogoUrl}
              alt="Artisan Hub"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[22px]"
            />
          </div>
          {/* Ghana Card Verified Tag */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[9px] flex items-center gap-1 shadow-lg whitespace-nowrap">
            <ShieldCheck className="w-3 h-3" />
            <span>NIA VERIFIED</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-black uppercase tracking-wider border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ARTISAN HUB GHANA</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase">
            FIND CERTIFIED <br />
            <span className="text-orange-400">GHANAIAN</span> ARTISANS
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xs mx-auto leading-relaxed">
            Ghana's trusted marketplace connecting homes and businesses with verified painters, plumbers, electricians, and carpenters.
          </p>
        </div>

        {/* 3 Core Value Props Pills */}
        <div className="w-full max-w-xs space-y-2.5 pt-2">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Ghana Card Verified</p>
              <p className="text-[10px] text-stone-400">Police record & identity confirmed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Ghana Post GPS Geofencing</p>
              <p className="text-[10px] text-stone-400">Accra, Kumasi, Takoradi & nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">MoMo Escrow Protection</p>
              <p className="text-[10px] text-stone-400">Pay only after job is completed & inspected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions Section */}
      <div className="w-full max-w-sm mx-auto space-y-3 pt-4 z-10">
        <button
          type="button"
          id="splash-get-started-btn"
          onClick={onGetStarted}
          className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-sm uppercase tracking-wide shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          id="splash-sign-in-btn"
          onClick={onSignIn}
          className="w-full py-3 px-6 rounded-2xl border-2 border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center"
        >
          I have an account • Sign In
        </button>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onExploreGuest}
            className="text-[11px] font-bold text-stone-400 hover:text-orange-400 underline underline-offset-4 transition-colors"
          >
            Explore Artisans as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
