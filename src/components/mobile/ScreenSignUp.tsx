import React, { useState } from 'react';
import {
  ChevronLeft,
  User,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TradeCategory, GhanaPostAddress } from '../../types';
import { GHANA_POST_SAMPLE_ADDRESSES } from '../../data/mockData';
import { AppLogo } from '../common/AppLogo';

interface ScreenSignUpProps {
  onBack: () => void;
  onSuccessSignUp: (role: 'client' | 'artisan') => void;
  onNavigateToLogin: () => void;
  onContinueGuest: () => void;
}

export const ScreenSignUp: React.FC<ScreenSignUpProps> = ({
  onBack,
  onSuccessSignUp,
  onNavigateToLogin,
  onContinueGuest,
}) => {
  const { updateClientProfile, setCurrentLocation, setMode } = useApp();

  const [role, setRole] = useState<'client' | 'artisan'>('client');
  const [fullName, setFullName] = useState('Afia Pokuaa');
  const [phone, setPhone] = useState('244918234');
  const [digitalAddressCode, setDigitalAddressCode] = useState('GA-183-9021');
  const [selectedTrade, setSelectedTrade] = useState<TradeCategory>('painter');
  const [experienceYears, setExperienceYears] = useState('6');
  const [ghanaCardNumber, setGhanaCardNumber] = useState('GHA-728192031-4');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // OTP Sub-step
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpDigits, setOtpDigits] = useState(['5', '2', '8', '1']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const trades: { id: TradeCategory; label: string }[] = [
    { id: 'painter', label: 'Painter' },
    { id: 'plumber', label: 'Plumber' },
    { id: 'electrician', label: 'Electrician' },
    { id: 'carpenter', label: 'Carpenter' },
    { id: 'mason', label: 'Mason' },
    { id: 'ac_tech', label: 'AC Technician' },
  ];

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (phone.length < 8) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    if (role === 'artisan' && !ghanaCardNumber.trim()) {
      setErrorMsg('Artisans require a valid Ghana Card PIN for NIA verification');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Please accept the service terms');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otpDigits];
    next[index] = val;
    setOtpDigits(next);
    if (val && index < 3) {
      document.getElementById(`signup-otp-${index + 1}`)?.focus();
    }
  };

  const handleFinalizeSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Update location based on digital address
      const matchedAddr =
        GHANA_POST_SAMPLE_ADDRESSES.find((a) => a.code === digitalAddressCode) || {
          code: digitalAddressCode,
          region: 'Greater Accra',
          district: 'Ayawaso West',
          area: 'East Legon Residence',
          latitude: 5.6358,
          longitude: -0.1582,
        };
      setCurrentLocation(matchedAddr);

      // Update client profile
      updateClientProfile({
        name: fullName,
        phone: `+233 ${phone}`,
        ghanaPostAddress: matchedAddr,
      });

      setMode(role);
      onSuccessSignUp(role);
    }, 700);
  };

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 justify-between">
      {/* Top Bar */}
      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={step === 'otp' ? () => setStep('form') : onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <span className="font-extrabold text-sm text-stone-900 dark:text-white">
          {step === 'otp' ? 'Confirm Phone' : 'Create Account'}
        </span>

        <button
          type="button"
          onClick={onContinueGuest}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Title and Logo */}
        <div className="space-y-2.5">
          <AppLogo size="md" />
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
              JOIN ARTISAN HUB
            </span>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight mt-1">
              {step === 'otp' ? 'Verify Mobile Number' : 'Create Your Account'}
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {step === 'otp'
              ? `Enter the 4-digit SMS OTP sent to +233 ${phone}`
              : 'Join thousands of verified artisans and happy homeowners in Ghana.'}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleProceedToOtp} className="space-y-4">
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    role === 'client'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <User className="w-5 h-5 text-orange-500 mb-1" />
                  <p className="text-xs font-extrabold text-stone-900 dark:text-white">
                    Client / Customer
                  </p>
                  <p className="text-[10px] text-stone-500">I need repairs & services</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('artisan')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    role === 'artisan'
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-orange-500 mb-1" />
                  <p className="text-xs font-extrabold text-stone-900 dark:text-white">
                    Skilled Artisan
                  </p>
                  <p className="text-[10px] text-stone-500">I want to get jobs & earn</p>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Afia Pokuaa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold text-stone-900 dark:text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Ghana Phone (for SMS OTP & MoMo)
              </label>
              <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-2 focus-within:border-orange-500">
                <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-300 pr-2 border-r border-stone-300 dark:border-stone-700">
                  🇬🇭 +233
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="24 491 8234"
                  maxLength={10}
                  className="w-full bg-transparent px-2.5 text-xs font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Ghana Post Digital Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>Ghana Post Digital Address</span>
                <span className="text-[10px] text-stone-400">e.g. GA-183-9021</span>
              </label>
              <div className="flex items-center rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-3 py-2">
                <MapPin className="w-3.5 h-3.5 text-orange-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={digitalAddressCode}
                  onChange={(e) => setDigitalAddressCode(e.target.value.toUpperCase())}
                  placeholder="GA-183-9021"
                  className="w-full bg-transparent text-xs font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* ARTISAN-SPECIFIC FIELDS */}
            {role === 'artisan' && (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                  <Wrench className="w-4 h-4 text-orange-500" />
                  <span>Artisan Credentials</span>
                </div>

                {/* Trade Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Primary Trade
                  </label>
                  <select
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value as TradeCategory)}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-stone-900 dark:text-white"
                  >
                    {trades.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Years of Practical Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold"
                  />
                </div>

                {/* Ghana Card PIN */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ghana Card PIN (Required for NIA Verification)</span>
                  </label>
                  <input
                    type="text"
                    value={ghanaCardNumber}
                    onChange={(e) => setGhanaCardNumber(e.target.value.toUpperCase())}
                    placeholder="GHA-718293041-9"
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-mono font-bold text-stone-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="terms" className="text-[11px] text-stone-500 leading-tight">
                I agree to the Artisan Hub{' '}
                <span className="text-orange-600 dark:text-orange-400 font-bold">Terms of Service</span>,{' '}
                NIA verification policy, and MoMo escrow rules.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Generating Verification Code...</span>
              ) : (
                <>
                  <span>Continue to Mobile Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Entry */
          <form onSubmit={handleFinalizeSignUp} className="space-y-5">
            <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 space-y-1">
              <p className="font-bold">Almost Done!</p>
              <p className="text-[11px] text-orange-700 dark:text-orange-300">
                Enter the code sent to <span className="font-mono font-bold">+233 {phone}</span> to activate your {role === 'artisan' ? 'Artisan Pro' : 'Client'} account.
              </p>
              <p className="text-[10px] font-mono text-stone-500">
                (Demo auto-fill: <span className="font-bold text-orange-600">5281</span>)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                4-digit SMS Code
              </label>
              <div className="flex items-center justify-between gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`signup-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 text-center font-mono font-black text-xl rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Activating Account...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Registration</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Bottom Switch to Login */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 text-center space-y-2 bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Already registered?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
