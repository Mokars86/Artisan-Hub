import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Phone,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle,
  Navigation,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GHANA_POST_SAMPLE_ADDRESSES } from '../../data/mockData';

interface ClientOnboardingProps {
  isOpen?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
}

export const ClientOnboarding: React.FC<ClientOnboardingProps> = ({
  isOpen = true,
  onClose,
  onComplete,
}) => {
  const { clientProfile, updateClientProfile, setCurrentLocation } = useApp();

  const [step, setStep] = useState<'splash' | 'otp' | 'location'>('splash');
  const [phoneNumber, setPhoneNumber] = useState('244918234');
  const [otpCode, setOtpCode] = useState(['5', '2', '8', '1']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [digitalCode, setDigitalCode] = useState('GA-183-9021');

  if (!isOpen) return null;

  const handleSendOtp = () => {
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      updateClientProfile({
        phone: `+233 ${phoneNumber}`,
      });
      setStep('location');
    }, 600);
  };

  const handleCompleteLocation = () => {
    const match = GHANA_POST_SAMPLE_ADDRESSES.find((a) => a.code === digitalCode) || {
      code: digitalCode,
      region: 'Greater Accra',
      district: 'Ayawaso West',
      area: 'East Legon Residence',
      latitude: 5.6358,
      longitude: -0.1582,
    };
    setCurrentLocation(match);
    updateClientProfile({ ghanaPostAddress: match });
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-stone-100">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            ✕
          </button>
        )}
        {/* Step 1: Splash Screen */}
        {step === 'splash' && (
          <div>
            <div className="relative h-64 bg-amber-500 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
                alt="Ghana Artisan Repairs"
                className="w-full h-full object-cover mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-white font-extrabold text-sm tracking-wider">
                  Artisan Hub
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-stone-950 mb-1">
                  <ShieldCheck className="w-3 h-3" /> NIA Ghana Card Verified
                </span>
                <h1 className="text-xl font-extrabold leading-tight">
                  Trusted Artisans & Home Repairs at Your Doorstep
                </h1>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Verified Plumbers, Electricians, Carpenters & AC Techs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Precise Ghana Post GPS dispatch (e.g. AK-039-1234)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Direct Mobile Money (MTN MoMo, Telecel Cash, AT Money)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Verify Phone (+233) to Start</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full py-2 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors text-center"
                >
                  Skip and Browse as Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Phone Verification (OTP) */}
        {step === 'otp' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Ghana Phone Verification</h2>
              <p className="text-xs text-stone-500">
                Quick SMS OTP authentication for secure booking
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Mobile Number
              </label>
              <div className="flex items-center rounded-xl border border-stone-300 dark:border-stone-700 overflow-hidden bg-stone-50 dark:bg-stone-800/80">
                <span className="px-3 py-2.5 text-xs font-semibold font-mono bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 border-r border-stone-300 dark:border-stone-600">
                  🇬🇭 +233
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="24 491 8234"
                  maxLength={10}
                  className="w-full px-3 py-2.5 bg-transparent text-sm font-mono tracking-wider focus:outline-none"
                />
                {!isOtpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-1.5 mr-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shrink-0 transition-colors"
                  >
                    Send OTP
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 shrink-0">
                    Sent
                  </span>
                )}
              </div>
            </div>

            {/* OTP Inputs */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Enter 4-Digit SMS Code
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                  Test code: 5281
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {otpCode.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => {
                      const copy = [...otpCode];
                      copy[idx] = e.target.value;
                      setOtpCode(copy);
                    }}
                    className="w-full h-12 text-center text-lg font-bold font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{isVerifying ? 'Verifying OTP...' : 'Verify & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Location Permission / Ghana Post Digital Address */}
        {step === 'location' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Set Service Location</h2>
              <p className="text-xs text-stone-500">
                Ghana Post GPS allows artisans to reach your exact gate without hassle.
              </p>
            </div>

            {/* GPS prompt */}
            <button
              type="button"
              onClick={handleCompleteLocation}
              className="w-full p-3 rounded-xl border border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 flex items-center gap-3 text-left hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Allow GPS Location Access
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Auto-detect nearest Ghana Post GPS marker (GA-183-9021)
                </div>
              </div>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
              <span className="bg-white dark:bg-stone-900 px-3 text-[10px] uppercase font-bold text-stone-400 absolute">
                or manual digital address
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Ghana Post GPS Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={digitalCode}
                  onChange={(e) => setDigitalCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AK-039-1234"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Compass className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Found on your house plate or via the GhanaPostGPS app.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCompleteLocation}
              className="w-full py-3 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs transition-colors"
            >
              Save Address & Enter Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
