import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ArtisanSubscriptionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtisanSubscriptionSheet: React.FC<ArtisanSubscriptionSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentArtisan, updateArtisanSubscription } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>(
    currentArtisan.subscription.plan
  );
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'momo_checkout' | 'status'>('plans');
  const [momoNetwork, setMomoNetwork] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [momoPhone, setMomoPhone] = useState(currentArtisan.phone.replace(/[^0-9]/g, ''));
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartCheckout = () => {
    if (selectedPlan === 'free') {
      updateArtisanSubscription(currentArtisan.id, 'free');
      onClose();
    } else {
      setCheckoutStep('momo_checkout');
    }
  };

  const handleCompleteMoMoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      updateArtisanSubscription(currentArtisan.id, 'pro');
      setTimeout(() => {
        setCheckoutStep('status');
      }, 800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-xs">
        {/* Header */}
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Artisan Pro Subscription
              </h2>
              <p className="text-[11px] text-stone-400">
                Hubtel / Paystack Mobile Money Integration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP 1: Plan Selection */}
          {checkoutStep === 'plans' && (
            <div className="space-y-4">
              {/* Current Status banner */}
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Current Active Tier
                  </span>
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {currentArtisan.subscription.plan === 'pro'
                      ? '⭐ Pro Monthly Member'
                      : 'Free Starter'}
                  </span>
                </div>
                <div className="text-right font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  {currentArtisan.subscription.renewDaysLeft} days remaining
                </div>
              </div>

              {/* Plans Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Free Plan */}
                <div
                  onClick={() => setSelectedPlan('free')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'free'
                      ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800/80'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                    Free Starter
                  </div>
                  <div className="text-base font-black font-mono text-stone-900 dark:text-white mb-3">
                    GH₵ 0 <span className="text-xs font-normal text-stone-400">/mo</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                    <p>• Basic profile listing</p>
                    <p>• Up to 3 portfolio photos</p>
                    <p>• Standard search ranking</p>
                    <p className="text-stone-400">• Standard booking alerts</p>
                  </div>
                </div>

                {/* Pro Monthly */}
                <div
                  onClick={() => setSelectedPlan('pro')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer relative transition-all ${
                    selectedPlan === 'pro'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[9px] uppercase tracking-wide shadow-sm">
                    Recommended
                  </div>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1">
                    <span>Pro Monthly</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-base font-black font-mono text-amber-600 dark:text-amber-400 mb-3">
                    GH₵ 85 <span className="text-xs font-normal text-stone-400">/mo</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-stone-800 dark:text-stone-200 font-medium">
                    <p className="text-amber-700 dark:text-amber-300 font-bold">
                      ✓ Priority top-ranking in search
                    </p>
                    <p>✓ Unlimited portfolio uploads</p>
                    <p>✓ "Verified Pro" golden badge</p>
                    <p>✓ Direct Call & WhatsApp buttons</p>
                    <p>✓ Instant emergency job alerts</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartCheckout}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>
                  {selectedPlan === 'pro'
                    ? 'Proceed to Mobile Money Checkout (GH₵ 85)'
                    : 'Keep Free Starter Plan'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: MoMo Payment Checkout (Paystack / Hubtel style) */}
          {checkoutStep === 'momo_checkout' && (
            <form onSubmit={handleCompleteMoMoPayment} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-stone-500 text-[11px] block">
                    Paying for:
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Artisan Hub Pro Monthly Membership
                  </span>
                </div>
                <div className="text-right font-mono font-black text-base text-amber-600 dark:text-amber-400">
                  GH₵ 85.00
                </div>
              </div>

              {/* MoMo Network Selection */}
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-2">
                  Select Mobile Money Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMomoNetwork('mtn')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      momoNetwork === 'mtn'
                        ? 'border-yellow-500 bg-yellow-400/20 text-stone-950 dark:text-yellow-300'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomoNetwork('telecel')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      momoNetwork === 'telecel'
                        ? 'border-red-500 bg-red-500/20 text-stone-950 dark:text-red-300'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    Telecel Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomoNetwork('at')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      momoNetwork === 'at'
                        ? 'border-blue-500 bg-blue-500/20 text-stone-950 dark:text-blue-300'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    AT Money
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  MoMo Wallet Number
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 overflow-hidden">
                  <span className="px-3 py-2.5 font-mono text-stone-500 border-r border-stone-300 dark:border-stone-700">
                    +233
                  </span>
                  <input
                    type="tel"
                    required
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="24 491 8234"
                    className="w-full px-3 py-2.5 bg-transparent font-mono tracking-wider focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-[11px] text-stone-500 space-y-1">
                <p>
                  1. A prompt will be sent to your phone from <b>Hubtel / Paystack</b>.
                </p>
                <p>2. Enter your MoMo PIN to authorize recurring GH₵ 85 monthly renewal.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('plans')}
                  className="py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 font-bold text-stone-700 dark:text-stone-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Awaiting USSD PIN Approval...</span>
                  ) : paymentSuccess ? (
                    <span>✓ Payment Authorized!</span>
                  ) : (
                    <span>Pay GH₵ 85 via Mobile Money</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Subscription Status Screen */}
          {checkoutStep === 'status' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Pro Subscription Active!
                </h3>
                <p className="text-stone-500 text-xs">
                  Your profile has received the Verified Pro badge and 1st page search ranking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Renewal Cycle:</span>
                  <span className="font-mono font-bold">Monthly (30 Days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Next Billing Date:</span>
                  <span className="font-mono font-bold">October 21, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Channel:</span>
                  <span className="font-bold">MTN Mobile Money</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Auto-Renewal:</span>
                  <span className="text-emerald-600 font-bold">Active</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Return to Artisan Work Center
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
