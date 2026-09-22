import React, { useState } from 'react';
import {
  ShieldCheck,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass,
  Phone,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_DEFINITIONS } from '../../data/mockData';
import { TradeCategory } from '../../types';

interface ArtisanRegistrationKYCProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtisanRegistrationKYC: React.FC<ArtisanRegistrationKYCProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentArtisan } = useApp();

  const [step, setStep] = useState<'info' | 'ghana_card' | 'workshop'>('info');
  const [fullName, setFullName] = useState(currentArtisan.name);
  const [trade, setTrade] = useState<TradeCategory>(currentArtisan.trade);
  const [phone, setPhone] = useState(currentArtisan.phone);
  const [frontCardPhoto, setFrontCardPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
  );
  const [backCardPhoto, setBackCardPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
  );
  const [workshopGps, setWorkshopGps] = useState(currentArtisan.ghanaPostGps);
  const [workshopArea, setWorkshopArea] = useState(currentArtisan.locationArea);
  const [isVerifyingCard, setIsVerifyingCard] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(true);

  if (!isOpen) return null;

  const handleVerifyCard = () => {
    setIsVerifyingCard(true);
    setTimeout(() => {
      setIsVerifyingCard(false);
      setIsVerifiedSuccess(true);
      setStep('workshop');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-xs">
        {/* Header */}
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Artisan KYC & Ghana Card Verification
              </h2>
              <p className="text-[11px] text-stone-400">
                Mandatory National ID screening for client trust & badges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step progress pills */}
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 p-2.5 gap-2">
          <button
            type="button"
            onClick={() => setStep('info')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
              step === 'info'
                ? 'bg-amber-500 text-stone-950'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            1. Trade Details
          </button>
          <button
            type="button"
            onClick={() => setStep('ghana_card')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
              step === 'ghana_card'
                ? 'bg-amber-500 text-stone-950'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            2. Ghana Card ID
          </button>
          <button
            type="button"
            onClick={() => setStep('workshop')}
            className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all ${
              step === 'workshop'
                ? 'bg-amber-500 text-stone-950'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            3. Workshop Pin
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {/* STEP 1: Basic Info & Trade */}
          {step === 'info' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name (as on Ghana Card)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Trade Specialty
                </label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value as TradeCategory)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                >
                  {Object.keys(CATEGORY_DEFINITIONS).map((k) => (
                    <option key={k} value={k}>
                      {CATEGORY_DEFINITIONS[k as TradeCategory].iconEmoji}{' '}
                      {CATEGORY_DEFINITIONS[k as TradeCategory].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Mobile Number (+233 MoMo Enabled)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('ghana_card')}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Ghana Card ID Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Ghana Card Snap & Verification */}
          {step === 'ghana_card' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200">
                Ghanaian National ID card (GHA-XXXXXXXXX-X) is cross-checked against the National Identification Authority database to earn the <b>"Verified Ghana Card"</b> shield badge.
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Front Photo */}
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Front of Ghana Card
                  </span>
                  <div className="relative h-28 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 overflow-hidden bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    {frontCardPhoto ? (
                      <img
                        src={frontCardPhoto}
                        alt="Front card"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-stone-400" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      Snap / Reupload
                    </div>
                  </div>
                </div>

                {/* Back Photo */}
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    Back of Ghana Card
                  </span>
                  <div className="relative h-28 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 overflow-hidden bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    {backCardPhoto ? (
                      <img
                        src={backCardPhoto}
                        alt="Back card"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-stone-400" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      Snap / Reupload
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NIA Verification Status: Matched to biometric registry</span>
              </div>

              <button
                type="button"
                onClick={handleVerifyCard}
                disabled={isVerifyingCard}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>{isVerifyingCard ? 'Validating NIA Card...' : 'Confirm Card & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Workshop Pin & Area of Operation */}
          {step === 'workshop' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Main Workshop / Base Ghana Post GPS Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={workshopGps}
                    onChange={(e) => setWorkshopGps(e.target.value.toUpperCase())}
                    placeholder="e.g. GA-183-9021 or AK-039-1234"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono uppercase tracking-wider"
                  />
                  <Compass className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Used by clients to estimate arrival distance and travel fee.
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Operational Area / Neighborhood
                </label>
                <input
                  type="text"
                  value={workshopArea}
                  onChange={(e) => setWorkshopArea(e.target.value)}
                  placeholder="e.g. East Legon, Spintex, Airport Residential"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pinned Location Preview</span>
                </div>
                <p className="text-stone-500">
                  Workshop location is active and public on client search radius.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition-all shadow-md mt-4"
              >
                Save KYC & Launch Artisan Work Center
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
