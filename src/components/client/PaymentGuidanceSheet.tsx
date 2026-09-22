import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Banknote,
  Star,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { Artisan, JobRequest } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentGuidanceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobRequest;
  artisan?: Artisan;
}

export const PaymentGuidanceSheet: React.FC<PaymentGuidanceSheetProps> = ({
  isOpen,
  onClose,
  job,
  artisan,
}) => {
  const { payForJob, submitJobReview } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'momo_mtn' | 'momo_telecel' | 'momo_at' | 'cash'>('momo_mtn');
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalAmountGhs = job.quote?.grandTotalGhs || 220;
  const artisanPhone = artisan?.phone || '+233 24 491 8234';

  const copyPhone = () => {
    navigator.clipboard.writeText(artisanPhone.replace(/\s+/g, ''));
    setIsCopiedPhone(true);
    setTimeout(() => setIsCopiedPhone(false), 2000);
  };

  const handleConfirmPaymentAndReview = () => {
    payForJob(job.id, paymentMethod);
    if (rating > 0) {
      submitJobReview(
        job.id,
        rating,
        reviewText || 'Very professional and neat job done on time!'
      );
    }
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col text-xs">
        {/* Header */}
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Direct Payment & Rating
              </h2>
              <p className="text-[11px] text-stone-400">
                100% of payment goes directly to {job.artisanName}
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

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Bill Summary */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                Total Job Amount
              </div>
              <div className="text-[11px] text-stone-500">{job.subService}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                GH₵ {totalAmountGhs}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                No Artisan Hub platform surcharge
              </span>
            </div>
          </div>

          {/* Payment Guidance: Direct MoMo vs Cash */}
          <div>
            <label className="block font-bold text-stone-800 dark:text-stone-200 mb-2">
              Select Direct Payment Mode
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('momo_mtn')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'momo_mtn'
                    ? 'border-amber-500 bg-yellow-400/20 text-stone-950 dark:text-white font-bold ring-2 ring-amber-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <span className="text-base block mb-0.5">🟡</span>
                <span className="text-[11px] block">MTN MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('momo_telecel')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'momo_telecel'
                    ? 'border-red-500 bg-red-500/20 text-stone-950 dark:text-white font-bold ring-2 ring-red-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <span className="text-base block mb-0.5">🔴</span>
                <span className="text-[11px] block">Telecel Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('momo_at')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'momo_at'
                    ? 'border-blue-500 bg-blue-500/20 text-stone-950 dark:text-white font-bold ring-2 ring-blue-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <span className="text-base block mb-0.5">🔵</span>
                <span className="text-[11px] block">AT Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-500/20 text-stone-950 dark:text-white font-bold ring-2 ring-emerald-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <span className="text-base block mb-0.5">💵</span>
                <span className="text-[11px] block">Direct Cash</span>
              </button>
            </div>
          </div>

          {/* MoMo USSD Prompt Guidance Card */}
          {paymentMethod !== 'cash' ? (
            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  Artisan Mobile Money Number:
                </span>
                <button
                  type="button"
                  onClick={copyPhone}
                  className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-mono font-bold hover:underline"
                >
                  {isCopiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedPhone ? 'Copied' : 'Copy Number'}</span>
                </button>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-stone-900 font-mono font-bold text-sm text-center border border-stone-200 dark:border-stone-700">
                {artisanPhone} ({job.artisanName})
              </div>

              <div className="text-[11px] text-stone-500 space-y-1">
                <p>
                  <b>USSD Guide:</b> Dial{' '}
                  <span className="font-mono font-bold text-amber-600">
                    {paymentMethod === 'momo_mtn' ? '*170#' : '*110#'}
                  </span>{' '}
                  ➔ Transfer Money ➔ Enter number above ➔ Reference:{' '}
                  <span className="font-mono font-bold">ArtisanHub</span>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300">
              <p className="font-semibold">
                Please hand over <b>GH₵ {totalAmountGhs}</b> directly to {job.artisanName} after you have thoroughly inspected the completed repair.
              </p>
            </div>
          )}

          {/* Review Prompt: Star rating (1–5) and optional text review */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                Rate {job.artisanName} (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        rating >= star
                          ? 'text-amber-500 fill-current'
                          : 'text-stone-300 dark:text-stone-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono font-bold text-sm text-amber-500">
                  {rating}.0
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                Client Review & Feedback (Optional)
              </label>
              <textarea
                rows={2}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="He was very polite, punctual, and left the area tidy..."
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Confirmation Button */}
          <button
            type="button"
            onClick={handleConfirmPaymentAndReview}
            disabled={isSubmitted}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Payment & Review Confirmed!</span>
              </>
            ) : (
              <span>Confirm Direct Payment & Submit Review</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
