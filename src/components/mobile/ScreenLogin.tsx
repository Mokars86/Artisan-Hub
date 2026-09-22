import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppLogo } from '../common/AppLogo';

interface ScreenLoginProps {
  onBack: () => void;
  onSuccessLogin: (role: 'client' | 'artisan') => void;
  onNavigateToSignUp: () => void;
  onContinueGuest: () => void;
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({
  onBack,
  onSuccessLogin,
  onNavigateToSignUp,
  onContinueGuest,
}) => {
  const { updateClientProfile, setMode } = useApp();

  const [role, setRole] = useState<'client' | 'artisan'>('client');
  const [phoneNumber, setPhoneNumber] = useState('244918234');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['5', '2', '8', '1']);
  const [resendTimer, setResendTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-detect Ghana Mobile Network (MTN, Telecel, AT)
  const getCarrier = (num: string) => {
    const clean = num.trim();
    if (clean.startsWith('24') || clean.startsWith('54') || clean.startsWith('55') || clean.startsWith('59')) {
      return { name: 'MTN MoMo', color: 'bg-yellow-400 text-stone-900 border-yellow-500' };
    }
    if (clean.startsWith('20') || clean.startsWith('50')) {
      return { name: 'Telecel Cash', color: 'bg-red-500 text-white border-red-600' };
    }
    if (clean.startsWith('27') || clean.startsWith('57') || clean.startsWith('26')) {
      return { name: 'AT Money', color: 'bg-blue-600 text-white border-blue-700' };
    }
    return { name: 'Ghana Mobile', color: 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300' };
  };

  const carrier = getCarrier(phoneNumber);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 8) {
      setErrorMsg('Please enter a valid Ghanaian mobile number');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setResendTimer(45);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const next = [...otpDigits];
    next[index] = val;
    setOtpDigits(next);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 4) {
      setErrorMsg('Please enter the 4-digit SMS verification code');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      // Update app profile
      updateClientProfile({
        phone: `+233 ${phoneNumber}`,
        name: role === 'artisan' ? 'Kojo Mensah' : 'Afia Pokuaa',
      });
      setMode(role);
      onSuccessLogin(role);
    }, 700);
  };

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 justify-between">
      {/* Top Bar with Back Button */}
      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <span className="font-extrabold text-sm text-stone-900 dark:text-white">
          Sign In
        </span>

        <button
          type="button"
          onClick={onContinueGuest}
          className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header Display with Logo */}
        <div className="space-y-3">
          <AppLogo size="md" />
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider">
              ARTISAN HUB ACCESS
            </span>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight mt-1">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Sign in with your phone number verified via Ghana SMS OTP.
            </p>
          </div>
        </div>

        {/* Account Role Selector Pill (Customer vs Artisan) */}
        <div className="p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center gap-1 border border-stone-200 dark:border-stone-700">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'client'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-orange-500" />
            <span>Customer (Client)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('artisan')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'artisan'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-orange-500" />
            <span>Artisan (Pro Hub)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Phone Input Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Ghanaian Mobile Number
              </label>
              <div className="flex items-center rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 px-3 py-2.5 focus-within:border-orange-500 focus-within:bg-white dark:focus-within:bg-stone-900 transition-all">
                <div className="flex items-center gap-1.5 pr-2.5 border-r border-stone-300 dark:border-stone-700">
                  <span className="text-base">🇬🇭</span>
                  <span className="font-mono font-bold text-xs text-stone-800 dark:text-stone-200">
                    +233
                  </span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="24 491 8234"
                  maxLength={10}
                  className="w-full bg-transparent px-3 text-sm font-mono font-bold text-stone-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              {/* Detected Mobile Money Carrier Pill */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-400">Carrier Detected:</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${carrier.color}`}>
                  {carrier.name}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Sending SMS OTP...</span>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: 4-digit OTP Code Input */
          <form onSubmit={handleVerifyAndLogin} className="space-y-5">
            <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>SMS OTP Sent</span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-orange-600 dark:text-orange-400 underline font-semibold text-[11px]"
                >
                  Change Number
                </button>
              </div>
              <p className="text-[11px] text-orange-700 dark:text-orange-300">
                Code sent to <span className="font-mono font-bold">+233 {phoneNumber}</span>.
              </p>
              <p className="text-[10px] font-mono text-stone-500">
                (Demo auto-fill: <span className="font-bold text-orange-600">5281</span>)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Enter 4-digit Code
              </label>
              <div className="flex items-center justify-between gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 text-center font-mono font-black text-xl rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:border-orange-500 focus:bg-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-stone-400">
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Code expired?'}
                </span>
                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => handleSendOtp()}
                  className={`font-bold ${
                    resendTimer > 0
                      ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                      : 'text-orange-600 dark:text-orange-400 hover:underline'
                  }`}
                >
                  Resend SMS Code
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security & Verification Guarantee */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-[11px]">
            Protected by Ghana National Data Protection & NIA Encrypted Channels.
          </span>
        </div>
      </div>

      {/* Bottom Switch to Sign Up */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 text-center space-y-2 bg-stone-50/50 dark:bg-stone-900/50 shrink-0">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
