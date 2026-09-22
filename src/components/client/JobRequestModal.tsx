import React, { useState, useRef } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Navigation,
  FileText,
  Volume2,
} from 'lucide-react';
import { Artisan, TradeCategory, SubService } from '../../types';
import { CATEGORY_DEFINITIONS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { VoiceNoteRecorder } from '../common/VoiceNoteRecorder';
import { compressImageOnDevice, formatBytes } from '../../utils/imageCompressor';

interface JobRequestModalProps {
  artisan: Artisan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirectToBookings: (jobId: string) => void;
}

export const JobRequestModal: React.FC<JobRequestModalProps> = ({
  artisan,
  isOpen,
  onClose,
  onSuccessRedirectToBookings,
}) => {
  const { currentLocation, clientProfile, createJobRequest, isDataSaverEnabled } = useApp();

  const [category, setCategory] = useState<TradeCategory>(artisan?.trade || 'plumber');
  const [subService, setSubService] = useState<string>(
    artisan?.subServices[0] || 'Pipe Leak & Burst Pipe Repair'
  );
  const [description, setDescription] = useState('');
  const [ghanaPostCode, setGhanaPostCode] = useState(currentLocation.code);
  const [locationAddress, setLocationAddress] = useState(currentLocation.area);
  const [preferredDate, setPreferredDate] = useState('2026-09-22');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState('Morning (8:00 AM - 12:00 PM)');
  const [budgetType, setBudgetType] = useState<'estimate_range' | 'open_quote'>('estimate_range');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [compressionStats, setCompressionStats] = useState<string | null>(null);
  const [voiceNoteDataUrl, setVoiceNoteDataUrl] = useState<string | undefined>(undefined);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !artisan) return null;

  const currentCategoryDef = CATEGORY_DEFINITIONS[category];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - uploadedPhotos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    let totalOriginal = 0;
    let totalCompressed = 0;
    const newPhotos: string[] = [];

    for (const file of filesToProcess) {
      try {
        if (isDataSaverEnabled) {
          // On-device canvas compression for 3G
          const res = await compressImageOnDevice(file, 1000, 1000, 0.7);
          newPhotos.push(res.dataUrl);
          totalOriginal += res.originalSizeBytes;
          totalCompressed += res.compressedSizeBytes;
        } else {
          const reader = new FileReader();
          const p = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newPhotos.push(await p);
        }
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }

    setUploadedPhotos((prev) => [...prev, ...newPhotos]);

    if (isDataSaverEnabled && totalOriginal > 0) {
      const savedPct = Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100);
      setCompressionStats(
        `3G Data Saver: Reduced ${formatBytes(totalOriginal)} → ${formatBytes(
          totalCompressed
        )} (${savedPct}% saved)`
      );
    }
  };

  const removePhoto = (idx: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calculate base estimate range
    const matchingSub = currentCategoryDef.subServices.find((s) => s.name === subService);
    const baseGhs = matchingSub ? matchingSub.baseEstimateGhs : 200;
    const estimatedCostRangeGhs =
      budgetType === 'estimate_range'
        ? `GH₵ ${baseGhs} - GH₵ ${Math.round(baseGhs * 1.6)}`
        : 'Open for custom artisan quote';

    setTimeout(() => {
      const jobId = createJobRequest({
        clientId: clientProfile.id,
        clientName: clientProfile.name,
        clientPhone: clientProfile.phone,
        artisanId: artisan.id,
        artisanName: artisan.name,
        artisanTrade: artisan.tradeTitle,
        category,
        subService,
        description: description || `Repair request for ${subService}`,
        locationAddress,
        ghanaPostCode,
        mediaPhotos: uploadedPhotos.length > 0 ? uploadedPhotos : [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
        ],
        voiceNoteUrl: voiceNoteDataUrl,
        voiceNoteDuration,
        preferredDate,
        preferredTimeWindow,
        estimatedCostRangeGhs,
        isUrgent: artisan.emergencyAvailable,
      });

      setIsSubmitting(false);
      onClose();
      onSuccessRedirectToBookings(jobId);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-amber-400"
            />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Request Job:</span>
                <span className="text-amber-400">{artisan.name}</span>
              </h2>
              <p className="text-xs text-stone-400">
                {artisan.tradeTitle} • {artisan.locationArea}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Service & Sub-service Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as TradeCategory;
                  setCategory(cat);
                  setSubService(CATEGORY_DEFINITIONS[cat].subServices[0].name);
                }}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Specific Sub-Service Breakdown
              </label>
              <select
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {currentCategoryDef.subServices.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name} (~GH₵ {sub.baseEstimateGhs})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Input (Ghana Post GPS or Current GPS) */}
          <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Service Job Location (Ghana Post GPS)
              </label>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                Required for gate navigation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={ghanaPostCode}
                  onChange={(e) => setGhanaPostCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GA-183-9021"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Area landmark (e.g. East Legon, near Shell)"
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Media Upload: Attach up to 4 photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                Problem Photos (Up to 4)
              </label>
              <span className="text-[11px] text-stone-400">
                {uploadedPhotos.length} / 4 attached
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div className="grid grid-cols-4 gap-2.5">
              {uploadedPhotos.map((photo, i) => (
                <div key={i} className="relative h-20 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 group">
                  <img src={photo} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {uploadedPhotos.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 flex flex-col items-center justify-center text-stone-400 hover:text-amber-500 transition-colors"
                >
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-semibold">+ Add Photo</span>
                </button>
              )}
            </div>

            {compressionStats && (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{compressionStats}</span>
              </div>
            )}
          </div>

          {/* Voice Note Recorder (30-sec max) */}
          <div>
            <VoiceNoteRecorder
              onRecordingComplete={(audioDataUrl, duration) => {
                setVoiceNoteDataUrl(audioDataUrl);
                setVoiceNoteDuration(duration);
              }}
              onClear={() => {
                setVoiceNoteDataUrl(undefined);
                setVoiceNoteDuration(undefined);
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Job Description & Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The leak started 2 days ago under the kitchen sink. Water is dripping slowly onto the wooden floorboards..."
              className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Date and Time Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Preferred Arrival Window
              </label>
              <select
                value={preferredTimeWindow}
                onChange={(e) => setPreferredTimeWindow(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                <option value="Evening (4:30 PM - 7:00 PM)">Evening (4:30 PM - 7:00 PM)</option>
                <option value="Emergency (Immediate Dispatch)">Emergency (Immediate 30-min Dispatch)</option>
              </select>
            </div>
          </div>

          {/* Cost Estimate Confirmation Range */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-900 dark:text-amber-200">
                Cost Estimate Confirmation
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetType('estimate_range')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    budgetType === 'estimate_range'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-500'
                  }`}
                >
                  Standard Range
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType('open_quote')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    budgetType === 'open_quote'
                      ? 'bg-amber-500 text-stone-950'
                      : 'text-stone-500'
                  }`}
                >
                  Custom Quote
                </button>
              </div>
            </div>

            {budgetType === 'estimate_range' ? (
              <p className="text-xs text-amber-950 dark:text-amber-200">
                Estimated job range: <b className="font-mono text-sm">GH₵ 180 - GH₵ 350</b> (Labor only; parts billed with receipts upon mutual agreement).
              </p>
            ) : (
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Artisan will inspect your photos/voice note and message an itemized formal quote into your chat.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Sending Job Request...' : 'Send Job Request & Start Chat'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
