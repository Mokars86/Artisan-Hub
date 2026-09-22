import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Navigation,
  Clock,
  Phone,
  Play,
  Pause,
  AlertCircle,
  Truck,
  Wrench,
  Check,
  MapPin,
} from 'lucide-react';
import { JobRequest, JobStatus, QuoteItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ArtisanQuoteBuilderProps {
  job: JobRequest;
  onClose: () => void;
  onOpenChat: (jobId: string) => void;
}

export const ArtisanQuoteBuilder: React.FC<ArtisanQuoteBuilderProps> = ({
  job,
  onClose,
  onOpenChat,
}) => {
  const { sendJobQuote, updateJobStatus } = useApp();

  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: 'Labor & Inspection Fee', type: 'labor', costGhs: 120 },
    { id: '2', description: 'Required Materials & Replacement Parts', type: 'material', costGhs: 80 },
    { id: '3', description: 'Transportation & Logistics', type: 'labor', costGhs: 30 },
  ]);
  const [quoteNotes, setQuoteNotes] = useState('All parts covered by 3-month workmanship warranty.');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const totalLaborGhs = items
    .filter((i) => i.type === 'labor')
    .reduce((sum, item) => sum + (Number(item.costGhs) || 0), 0);
  const totalMaterialsGhs = items
    .filter((i) => i.type === 'material')
    .reduce((sum, item) => sum + (Number(item.costGhs) || 0), 0);
  const grandTotal = items.reduce((sum, item) => sum + (Number(item.costGhs) || 0), 0);

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: String(Date.now()),
      description: 'Additional Material / Specialist Labor',
      type: 'material',
      costGhs: 50,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: 'description' | 'costGhs', val: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSendFormalQuote = (e: React.FormEvent) => {
    e.preventDefault();
    sendJobQuote(job.id, {
      items,
      totalLaborGhs,
      totalMaterialsGhs,
      grandTotalGhs: grandTotal,
      notes: quoteNotes,
      validUntil: '3 Days',
    });
    onOpenChat(job.id);
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    updateJobStatus(job.id, newStatus);
  };

  const togglePlayVoiceNote = () => {
    if (!job.voiceNoteUrl) return;
    if (isPlayingAudio) {
      audioPlayer?.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = new Audio(job.voiceNoteUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play().catch(() => {});
      setAudioPlayer(audio);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Client Overview Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Job Enquiry #{job.id.slice(0, 7)}
            </span>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {job.subService}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${job.clientPhone}`}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Client ({job.clientName})</span>
            </a>
          </div>
        </div>

        {/* Client details & Ghana Post location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 space-y-1">
            <span className="text-[10px] text-stone-400 block font-semibold">
              Location & Gate Address
            </span>
            <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{job.ghanaPostCode}</span>
            </div>
            <p className="text-[11px] text-stone-500">{job.locationAddress}</p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 space-y-1">
            <span className="text-[10px] text-stone-400 block font-semibold">
              Preferred Arrival Time
            </span>
            <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{job.preferredDate}</span>
            </div>
            <p className="text-[11px] text-stone-500">{job.preferredTimeWindow}</p>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 space-y-1">
            <span className="text-[10px] text-stone-400 block font-semibold">
              Budget / Estimation Mode
            </span>
            <div className="font-bold text-stone-900 dark:text-stone-100">
              {job.estimatedCostRangeGhs}
            </div>
            <p className="text-[11px] text-stone-500">
              Awaiting your itemized formal quote
            </p>
          </div>
        </div>

        {/* Client Problem Photos */}
        {job.mediaPhotos.length > 0 && (
          <div className="space-y-2">
            <span className="font-bold text-stone-800 dark:text-stone-200 block">
              Client Attached Photos ({job.mediaPhotos.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {job.mediaPhotos.map((photo, i) => (
                <div key={i} className="h-28 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700">
                  <img src={photo} alt={`Client problem ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Voice Note Player */}
        {job.voiceNoteUrl && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayVoiceNote}
                className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow"
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100 block">
                  Listen to Client Audio Explanation
                </span>
                <span className="text-[10px] text-stone-500">
                  Recorded in local language / audio notes ({job.voiceNoteDuration || 12}s)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* JOB STATUS CONTROL: En Route, Arrived, Work in Progress, Job Complete */}
      <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-500" />
          <span>Real-time Job Dispatch Controls</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange('artisan_en_route')}
            className={`p-3 rounded-xl border text-center transition-all ${
              job.status === 'artisan_en_route'
                ? 'border-blue-500 bg-blue-500/20 text-blue-900 dark:text-blue-300 font-bold'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <Truck className="w-4 h-4 mx-auto mb-1" />
            <span>En Route (On My Way)</span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('arrived')}
            className={`p-3 rounded-xl border text-center transition-all ${
              job.status === 'arrived'
                ? 'border-purple-500 bg-purple-500/20 text-purple-900 dark:text-purple-300 font-bold'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-4 h-4 mx-auto mb-1" />
            <span>Arrived at Gate</span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('work_in_progress')}
            className={`p-3 rounded-xl border text-center transition-all ${
              job.status === 'work_in_progress'
                ? 'border-amber-500 bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <Wrench className="w-4 h-4 mx-auto mb-1" />
            <span>Work in Progress</span>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('job_completed')}
            className={`p-3 rounded-xl border text-center transition-all ${
              job.status === 'job_completed'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-bold'
                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
            <span>Job Completed</span>
          </button>
        </div>
      </div>

      {/* FORMAL QUOTE BUILDER TOOL */}
      <form
        onSubmit={handleSendFormalQuote}
        className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Itemized Formal Price Quote</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Quote is delivered instantly into client's chat for 1-tap acceptance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="py-1.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item Line</span>
          </button>
        </div>

        {/* Itemized lines */}
        <div className="space-y-2.5">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-2">
              <input
                type="text"
                value={it.description}
                onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                placeholder="Description of labor or parts..."
                className="flex-1 p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
              />
              <div className="flex items-center w-36 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 overflow-hidden">
                <span className="px-2 text-stone-400 font-mono text-[10px]">GH₵</span>
                <input
                  type="number"
                  value={it.costGhs}
                  onChange={(e) =>
                    handleUpdateItem(it.id, 'costGhs', Number(e.target.value))
                  }
                  className="w-full py-2 pr-2 bg-transparent text-right font-mono font-bold text-xs focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(it.id)}
                className="p-2 text-stone-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Notes & Grand Total */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-500 block font-semibold">
              Artisan Quote Grand Total
            </span>
            <span className="text-xs text-stone-700 dark:text-stone-300">
              Direct settlement upon completion
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            GH₵ {grandTotal}
          </div>
        </div>

        <div>
          <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
            Quote Terms & Guarantee Notes
          </label>
          <input
            type="text"
            value={quoteNotes}
            onChange={(e) => setQuoteNotes(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Send Formal Quote into Client Chat</span>
        </button>
      </form>
    </div>
  );
};
