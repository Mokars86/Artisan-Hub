import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Send,
  Mic,
  Clock,
  Check,
  CheckCircle2,
  FileText,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobRequest, ChatMessage } from '../../types';
import { VoiceNoteRecorder } from '../common/VoiceNoteRecorder';

interface ArtisanChatInboxProps {
  onOpenQuoteBuilder: (job: JobRequest) => void;
}

export const ArtisanChatInbox: React.FC<ArtisanChatInboxProps> = ({
  onOpenQuoteBuilder,
}) => {
  const {
    jobRequests,
    chatMessages,
    sendMessage,
    currentArtisan,
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>(
    jobRequests[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const activeJob =
    jobRequests.find((j) => j.id === selectedJobId) || jobRequests[0];
  const activeMessages = chatMessages.filter((m) => m.jobId === activeJob?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const quickTemplates = [
    'I am on my way now with the tools.',
    'Please send gate landmark or digital address code.',
    'Materials bought from shop, arriving in 15 mins.',
    'Work completed. Please inspect before final handover.',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || !activeJob) return;

    sendMessage({
      jobId: activeJob.id,
      senderId: currentArtisan.id,
      senderRole: 'artisan',
      text,
    });

    setInputText('');
  };

  const handleSendVoiceNote = (audioDataUrl: string, duration: number) => {
    if (!activeJob) return;
    sendMessage({
      jobId: activeJob.id,
      senderId: currentArtisan.id,
      senderRole: 'artisan',
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

  if (!activeJob) {
    return (
      <div className="py-16 text-center text-stone-500">
        <MessageSquare className="w-10 h-10 mx-auto mb-2 text-stone-400" />
        <p className="font-bold text-sm">No client conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] min-h-[600px] text-xs">
      {/* Left Column: Client Enquiries List */}
      <div className="lg:col-span-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Client Inquiries ({jobRequests.length})
          </h2>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            Real-time
          </span>
        </div>

        <div className="p-2 overflow-y-auto space-y-2 flex-1">
          {jobRequests.map((job) => {
            const isSelected = job.id === activeJob.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedJobId(job.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                    {job.clientName}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {job.preferredDate}
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 dark:text-stone-300 font-medium truncate mt-0.5">
                  {job.subService}
                </p>

                <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400 font-mono">
                  <span>📍 {job.ghanaPostCode}</span>
                  <span className="font-bold text-amber-600 uppercase">
                    {job.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat view */}
      <div className="lg:col-span-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                {activeJob.clientName}
              </h3>
              <span className="text-[10px] font-mono text-stone-400">
                ({activeJob.clientPhone})
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              {activeJob.subService} • {activeJob.locationAddress} (
              {activeJob.ghanaPostCode})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenQuoteBuilder(activeJob)}
              className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quote / Dispatch</span>
            </button>
            <a
              href={`tel:${activeJob.clientPhone}`}
              className="p-2 rounded-xl bg-stone-800 text-emerald-400 hover:bg-stone-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick templates bar */}
        <div className="flex items-center gap-2 p-2 overflow-x-auto bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px]">
          <span className="text-stone-400 shrink-0 font-bold">Quick:</span>
          {quickTemplates.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(template)}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-amber-500 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/40 dark:bg-stone-950/40">
          {activeMessages.map((msg) => {
            const isMe = msg.senderRole === 'artisan';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-xs space-y-2 ${
                    isMe
                      ? 'bg-amber-500 text-stone-950 rounded-br-none'
                      : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-bl-none'
                  }`}
                >
                  {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                  {/* Voice player */}
                  {msg.voiceNoteUrl && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/10">
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
                      <div className="text-[10px] font-mono">
                        Voice Note ({msg.voiceNoteDuration || 8}s)
                      </div>
                    </div>
                  )}

                  {/* Quote preview if present */}
                  {msg.quote && (
                    <div className="p-2.5 rounded-xl bg-stone-900 text-white space-y-1.5 text-[11px]">
                      <div className="font-bold text-amber-400 flex justify-between">
                        <span>Formal Price Quote Sent</span>
                        <span className="font-mono">GH₵ {msg.quote.grandTotalGhs}</span>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Status:{' '}
                        <b className="uppercase text-amber-300">
                          {msg.quote.status}
                        </b>
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] font-mono text-right opacity-70">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Audio Recording preview */}
        {isRecordingAudio && (
          <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <VoiceNoteRecorder
              onRecordingComplete={handleSendVoiceNote}
              onClear={() => setIsRecordingAudio(false)}
            />
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsRecordingAudio(!isRecordingAudio)}
            className="p-2.5 rounded-xl text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to client..."
            className="flex-1 py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
    </div>
  );
};
