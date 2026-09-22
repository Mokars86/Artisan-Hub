import React, { useState } from 'react';
import {
  ChevronLeft,
  Calendar,
  Star,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  DollarSign,
  AlertCircle,
  X,
  Send,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobRequest } from '../../types';

interface ScreenClientJobsProps {
  onBack: () => void;
  onOpenJobChat: (job: JobRequest) => void;
  onNewBookingRequest?: () => void;
}

export const ScreenClientJobs: React.FC<ScreenClientJobsProps> = ({
  onBack,
  onOpenJobChat,
  onNewBookingRequest,
}) => {
  const { jobRequests, submitJobReview } = useApp();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [reviewingJob, setReviewingJob] = useState<JobRequest | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [reviewTextInput, setReviewTextInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Split jobs into active and past
  const activeJobs = jobRequests.filter((j) => j.status !== 'job_completed' && j.status !== 'cancelled');
  const pastJobs = jobRequests.filter((j) => j.status === 'job_completed' || j.status === 'cancelled');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingJob) return;

    submitJobReview(reviewingJob.id, ratingInput, reviewTextInput);

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewingJob(null);
      setReviewTextInput('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Top Header Bar matching Screen D */}
      <div className="sticky top-0 z-30 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <h1 className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
          Jobs
        </h1>

        <button
          type="button"
          onClick={() => setShowCalendarModal(true)}
          className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          title="Job Calendar Schedule"
        >
          <Calendar className="w-5 h-5 text-orange-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Jobs Section matching Screen D */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-sm text-stone-900 dark:text-white tracking-tight uppercase">
              Active Jobs
            </h2>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {activeJobs.length} Ongoing
            </span>
          </div>

          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                id={`active-job-${job.id}`}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-all p-4 space-y-3"
              >
                {/* Top: Job ID with Star and Chat Button */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                        Job ID: {job.id}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>

                    <h3 className="font-black text-sm text-stone-900 dark:text-white mt-1">
                      {job.subService}
                    </h3>
                  </div>

                  {/* Message Bubble Button matching Screen D */}
                  <button
                    type="button"
                    onClick={() => onOpenJobChat(job)}
                    className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md shadow-orange-500/20 flex items-center justify-center shrink-0 transition-transform"
                    title="Open Live Chat with Artisan"
                  >
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Artisan & Status Info */}
                <div className="space-y-1 text-xs">
                  <div className="text-stone-700 dark:text-stone-300 font-medium">
                    <span className="font-bold">Artisan:</span> {job.artisanName}
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] border border-blue-200 dark:border-blue-800">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span>Status: Work in Progress</span>
                    </div>

                    <span className="text-stone-400 text-[11px] font-mono">
                      {job.ghanaPostCode}
                    </span>
                  </div>
                </div>

                {/* Quick Interactive Actions */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenJobChat(job)}
                    className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Timeline & Invoice</span>
                  </button>

                  <span className="font-mono font-bold text-stone-700 dark:text-stone-300">
                    {job.quote?.grandTotalGhs ? `GH₵ ${job.quote.grandTotalGhs}` : job.estimatedCostRangeGhs}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Jobs Section matching Screen D */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-sm text-stone-900 dark:text-white tracking-tight uppercase">
              Past Jobs
            </h2>
            <span className="text-xs font-semibold text-stone-400">
              {pastJobs.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {pastJobs.map((job) => (
              <div
                key={job.id}
                id={`past-job-${job.id}`}
                className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm p-4 space-y-3"
              >
                {/* Top: Job ID and Star */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                        Job ID: {job.id}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>

                    <h3 className="font-black text-sm text-stone-900 dark:text-white mt-1 flex items-center gap-2">
                      <span>{job.subService}</span>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </h3>
                  </div>

                  <span className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
                    💰 Paid (MoMo)
                  </span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-400">
                  <span>Artisan: {job.artisanName}</span> • <span>East Legon, GA-183-9021</span>
                </div>

                {/* Rate & Review Action Bar matching Screen D */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setReviewingJob(job)}
                    className="text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-orange-500 transition-colors"
                  >
                    Rate & Review
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewingJob(job)}
                    className="py-1.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    Rate & Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Rate & Review Modal */}
      {reviewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setReviewingJob(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-stone-900 dark:text-white">
                Rate & Review Artisan
              </h3>
              <p className="text-xs text-stone-500">
                How was the service provided by <span className="font-bold">{reviewingJob.artisanName}</span>?
              </p>
            </div>

            {reviewSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="font-bold text-sm text-emerald-600">Review Submitted!</p>
                <p className="text-xs text-stone-400">Thank you for supporting verified Ghanaian artisans.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star selection */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= ratingInput
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Write your review
                  </label>
                  <textarea
                    rows={3}
                    value={reviewTextInput}
                    onChange={(e) => setReviewTextInput(e.target.value)}
                    placeholder="Describe punctuality, quality of work, and tidiness..."
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-xs shadow-md transition-all"
                >
                  Submit 5★ Rating
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Calendar modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setShowCalendarModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>Job Schedule Calendar</span>
              </h3>
              <p className="text-xs text-stone-500">
                Scheduled repair dates with verified artisans in Ghana
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-orange-900 dark:text-orange-200">
                    Today: 22 Sep 2026
                  </p>
                  <p className="text-[11px] text-orange-700 dark:text-orange-300">
                    Painter needed for Bedroom (Kojo M.)
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500 text-white">
                  09:00 AM
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-stone-800 dark:text-stone-200">
                    Tomorrow: 23 Sep 2026
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Painter needed for Bedroom Phase 2 (Kojo M.)
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                  01:00 PM
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCalendarModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs"
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
