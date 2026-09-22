import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Send,
  Image,
  Mic,
  FileText,
  Check,
  X,
  MapPin,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Star,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobRequest, JobStatus, ChatMessage } from '../../types';
import { VoiceNoteRecorder } from '../common/VoiceNoteRecorder';
import { PaymentGuidanceSheet } from './PaymentGuidanceSheet';

interface ClientBookingsChatProps {
  selectedJobId?: string | null;
  onBackToDashboard: () => void;
}

export const ClientBookingsChat: React.FC<ClientBookingsChatProps> = ({
  selectedJobId,
  onBackToDashboard,
}) => {
  const {
    jobRequests,
    chatMessages,
    sendMessage,
    respondToQuote,
    clientProfile,
    artisans,
  } = useApp();

  const [activeJobId, setActiveJobId] = useState<string>(
    selectedJobId || jobRequests[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const activeJob = jobRequests.find((j) => j.id === activeJobId) || jobRequests[0];
  const activeArtisan = artisans.find((a) => a.id === activeJob?.artisanId);

  const activeMessages = chatMessages.filter((m) => m.jobId === activeJob?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeJob) return;

    sendMessage({
      jobId: activeJob.id,
      senderId: clientProfile.id,
      senderRole: 'client',
      text: inputText.trim(),
    });

    setInputText('');
  };

  const handleSendVoiceNote = (audioDataUrl: string, duration: number) => {
    if (!activeJob) return;
    sendMessage({
      jobId: activeJob.id,
      senderId: clientProfile.id,
      senderRole: 'client',
      voiceNoteUrl: audioDataUrl,
      voiceNoteDuration: duration,
    });
    setIsRecordingAudio(false);
  };

  const playVoiceNote = (msgId: string, url?: string) => {
    if (!url) return;
    if (playingVoiceId === msgId) {
      audioPlayerRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      audioPlayerRef.current = new Audio(url);
      audioPlayerRef.current.onended = () => setPlayingVoiceId(null);
      audioPlayerRef.current.play().catch(() => {});
      setPlayingVoiceId(msgId);
    }
  };

  // Status timeline steps
  const statusSteps: { key: JobStatus; label: string }[] = [
    { key: 'request_sent', label: 'Request Sent' },
    { key: 'estimate_accepted', label: 'Estimate Accepted' },
    { key: 'artisan_en_route', label: 'Artisan En Route' },
    { key: 'work_in_progress', label: 'Work in Progress' },
    { key: 'job_completed', label: 'Job Completed' },
  ];

  const getStepProgress = (currentStatus: JobStatus) => {
    const order: Record<JobStatus, number> = {
      request_sent: 0,
      estimate_received: 0.5,
      estimate_accepted: 1,
      estimate_declined: 0,
      artisan_en_route: 2,
      arrived: 2.5,
      work_in_progress: 3,
      job_completed: 4,
      cancelled: -1,
    };
    return order[currentStatus] ?? 0;
  };

  if (!activeJob) {
    return (
      <div className="py-16 text-center text-stone-500 space-y-3">
        <MessageSquare className="w-10 h-10 text-stone-400 mx-auto" />
        <h3 className="text-base font-bold">No active bookings yet</h3>
        <p className="text-xs">Browse artisans to request a repair job.</p>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
        >
          Explore Artisans
        </button>
      </div>
    );
  }

  const currentProgress = getStepProgress(activeJob.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Column: Bookings list (desktop) or Active Job Info */}
      <div className="lg:col-span-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Active Bookings ({jobRequests.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
            Ghana Post GPS
          </span>
        </div>

        {/* Bookings list tabs */}
        <div className="p-2 overflow-y-auto space-y-2 flex-1">
          {jobRequests.map((job) => {
            const isSelected = job.id === activeJob.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => setActiveJobId(job.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                    {job.subService}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      job.status === 'job_completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : job.status === 'work_in_progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {job.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {job.artisanName}
                  </span>
                  <span>•</span>
                  <span>{job.preferredTimeWindow.split(' ')[0]}</span>
                </div>

                <div className="text-[10px] text-stone-400 font-mono mt-1 truncate">
                  📍 {job.locationAddress} ({job.ghanaPostCode})
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Job Status Timeline Widget */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2.5 flex items-center justify-between">
            <span>Status Timeline</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
              Live updates
            </span>
          </div>

          <div className="space-y-2">
            {statusSteps.map((step, idx) => {
              const isDone = currentProgress >= idx;
              const isCurrent = Math.floor(currentProgress) === idx;

              return (
                <div key={step.key} className="flex items-center gap-2.5 text-xs">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isDone
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] ${
                      isCurrent
                        ? 'font-bold text-amber-600 dark:text-amber-400'
                        : isDone
                        ? 'font-medium text-stone-800 dark:text-stone-200'
                        : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* If completed, prompt for Mobile Money or Cash settlement */}
          {activeJob.status === 'job_completed' && (
            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setIsPaymentSheetOpen(true)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                  activeJob.isPaid
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-stone-950 animate-pulse'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>
                  {activeJob.isPaid
                    ? '✓ Paid & Rated (View Receipt)'
                    : 'Pay Artisan (MoMo / Cash)'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: In-App Messaging & Digital Job Estimate Card */}
      <div className="lg:col-span-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <img
              src={activeArtisan?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200'}
              alt={activeJob.artisanName}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">
                  {activeJob.artisanName}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-stone-400">
                {activeJob.artisanTrade} • {activeJob.ghanaPostCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeArtisan?.phone || '+233244918234'}`}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call</span>
            </a>
          </div>
        </div>

        {/* Messages feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50 dark:bg-stone-950/40">
          {activeMessages.map((msg) => {
            const isClient = msg.senderRole === 'client';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-sm text-xs space-y-2 ${
                    isClient
                      ? 'bg-amber-500 text-stone-950 rounded-br-none'
                      : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-bl-none'
                  }`}
                >
                  {/* Text content */}
                  {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                  {/* Voice Note Player in Chat */}
                  {msg.voiceNoteUrl && (
                    <div
                      className={`flex items-center gap-2 p-2 rounded-xl border ${
                        isClient
                          ? 'bg-amber-600/30 border-amber-600/40 text-stone-950'
                          : 'bg-stone-100 dark:bg-stone-700 border-stone-200 dark:border-stone-600'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => playVoiceNote(msg.id, msg.voiceNoteUrl)}
                        className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shrink-0"
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span>Voice note</span>
                          <span>{msg.voiceNoteDuration || 5}s</span>
                        </div>
                        <div className="flex items-center gap-0.5 h-2 mt-1">
                          {[30, 80, 50, 100, 60, 40, 90, 70, 30].map((h, i) => (
                            <span
                              key={i}
                              className={`flex-1 rounded-full ${
                                playingVoiceId === msg.id
                                  ? 'bg-amber-400 animate-pulse'
                                  : 'bg-stone-400'
                              }`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIGITAL JOB ESTIMATE CARD (Received directly from artisan) */}
                  {msg.quote && (
                    <div className="p-3 rounded-xl bg-stone-900 text-white border border-amber-500/40 space-y-2.5 shadow-md">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Formal Price Quote</span>
                        </div>
                        <span className="font-mono text-[10px] text-stone-400">
                          Valid 3 days
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        {msg.quote.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-stone-300"
                          >
                            <span>{item.description}</span>
                            <span className="font-mono font-semibold">
                              GH₵ {item.costGhs}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-stone-800 pt-1.5 flex items-center justify-between font-bold text-xs">
                        <span className="text-white">Grand Total</span>
                        <span className="text-amber-400 font-mono text-sm">
                          GH₵ {msg.quote.grandTotalGhs}
                        </span>
                      </div>

                      {msg.quote.notes && (
                        <p className="text-[10px] text-stone-400 italic">
                          Note: "{msg.quote.notes}"
                        </p>
                      )}

                      {/* Accept / Decline actions */}
                      {msg.quote.status === 'pending' ? (
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => respondToQuote(activeJob.id, false)}
                            className="flex-1 py-1.5 rounded-lg border border-red-500 text-red-300 hover:bg-red-950/40 font-bold text-[11px] transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => respondToQuote(activeJob.id, true)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-black text-[11px] transition-colors shadow-sm"
                          >
                            Accept Estimate
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`text-center py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            msg.quote.status === 'accepted'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-950 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {msg.quote.status === 'accepted'
                            ? '✓ Estimate Accepted by You'
                            : '✗ Estimate Declined'}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-[9px] font-mono text-right ${
                      isClient ? 'text-stone-800' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Note Recording Panel inside chat */}
        {isRecordingAudio && (
          <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <VoiceNoteRecorder
              onRecordingComplete={handleSendVoiceNote}
              onClear={() => setIsRecordingAudio(false)}
            />
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsRecordingAudio(!isRecordingAudio)}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecordingAudio
                ? 'bg-red-500 text-white'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message or question for artisan..."
            className="flex-1 py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-stone-950 font-bold transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Payment & Review Sheet Modal */}
      <PaymentGuidanceSheet
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        job={activeJob}
        artisan={activeArtisan}
      />
    </div>
  );
};
