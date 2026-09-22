import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Star,
  Layers,
  Clock,
  Sparkles,
  WifiOff,
  RefreshCw,
  Upload,
  CheckCircle2,
  ArrowUpDown,
  FileEdit,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PortfolioProject, TradeCategory } from '../../types';
import { CATEGORY_DEFINITIONS } from '../../data/mockData';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { compressImageOnDevice, formatBytes } from '../../utils/imageCompressor';

export const ArtisanPortfolioManager: React.FC = () => {
  const {
    currentArtisan,
    addPortfolioProject,
    deletePortfolioProject,
    offlineDrafts,
    saveOfflineDraft,
    syncOfflineDrafts,
    isDataSaverEnabled,
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory>(
    currentArtisan.trade
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completionTime, setCompletionTime] = useState('1 Day');
  const [estimatedCostGhs, setEstimatedCostGhs] = useState<number>(350);
  const [beforePhoto, setBeforePhoto] = useState<string>(
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'
  );
  const [afterPhoto, setAfterPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80'
  );
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [compressionNote, setCompressionNote] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  const handleBeforeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (isDataSaverEnabled) {
        const res = await compressImageOnDevice(file);
        setBeforePhoto(res.dataUrl);
        setCompressionNote(
          `Compressed ${formatBytes(res.originalSizeBytes)} ➔ ${formatBytes(
            res.compressedSizeBytes
          )} (${res.savingsPercentage}% saved on 3G)`
        );
      } else {
        const reader = new FileReader();
        reader.onload = () => setBeforePhoto(reader.result as string);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Compress error:', err);
    }
  };

  const handleAfterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (isDataSaverEnabled) {
        const res = await compressImageOnDevice(file);
        setAfterPhoto(res.dataUrl);
      } else {
        const reader = new FileReader();
        reader.onload = () => setAfterPhoto(reader.result as string);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Compress error:', err);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (isOfflineMode) {
      // Save to offline draft store
      saveOfflineDraft({
        title,
        category: selectedCategory,
        beforePhoto,
        afterPhoto,
        description: description || 'Repaired and restored to high standards.',
        completionTime,
        estimatedCostGhs,
      });
    } else {
      // Add directly to live portfolio
      addPortfolioProject(currentArtisan.id, {
        title,
        category: selectedCategory,
        beforePhoto,
        afterPhoto,
        description: description || 'Repaired and restored to high standards.',
        completionTime,
        estimatedCostGhs,
        isFeatured: false,
      });
    }

    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <span>Interactive Portfolio Gallery</span>
          </h2>
          <p className="text-xs text-stone-500">
            Showcase your craftsmanship with interactive Before/After sliders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline Drafts Toggle */}
          <button
            type="button"
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOfflineMode
                ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100'
            }`}
            title="Simulate offline field conditions with local storage queue"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode: {isOfflineMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project Post</span>
          </button>
        </div>
      </div>

      {/* Offline Drafts Queue Banner */}
      {offlineDrafts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-xs text-amber-900 dark:text-amber-200">
                {offlineDrafts.length} Offline Draft(s) Pending Sync
              </div>
              <p className="text-[11px] text-stone-500">
                Saved locally while disconnected from 3G data.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={syncOfflineDrafts}
            className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Live Profile</span>
          </button>
        </div>
      )}

      {/* Current Projects Grid with Before/After Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentArtisan.portfolio.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-sm space-y-3"
          >
            {/* Interactive Slider */}
            <BeforeAfterSlider
              beforeImage={project.beforePhoto}
              afterImage={project.afterPhoto}
              beforeLabel="Before Work"
              afterLabel="After Fix"
              title={project.title}
            />

            <div className="p-4 pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  {project.title}
                </span>
                {project.estimatedCostGhs && (
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    GH₵ {project.estimatedCostGhs}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300">
                {project.description}
              </p>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Time: {project.completionTime}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      deletePortfolioProject(currentArtisan.id, project.id)
                    }
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Project Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col text-xs">
            <div className="p-5 bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Post Completed Project
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Upload Before & After photos to build client trust
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Bedroom High-Gloss Kitchen Cabinetry"
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Before and After Image Upload with On-Device Compression */}
              <div className="grid grid-cols-2 gap-3">
                {/* Before Photo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-800 dark:text-stone-200">
                      Before Photo
                    </label>
                    <span className="text-[10px] text-red-500 font-bold uppercase">
                      Problem State
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={beforeInputRef}
                    accept="image/*"
                    onChange={handleBeforeUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => beforeInputRef.current?.click()}
                    className="h-32 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-800 relative flex items-center justify-center"
                  >
                    {beforePhoto ? (
                      <img src={beforePhoto} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-stone-400">
                        <Upload className="w-5 h-5 mx-auto mb-1" />
                        <span>Upload Before</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* After Photo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-800 dark:text-stone-200">
                      After Photo
                    </label>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">
                      Finished Fix
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={afterInputRef}
                    accept="image/*"
                    onChange={handleAfterUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => afterInputRef.current?.click()}
                    className="h-32 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-800 relative flex items-center justify-center"
                  >
                    {afterPhoto ? (
                      <img src={afterPhoto} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-stone-400">
                        <Upload className="w-5 h-5 mx-auto mb-1" />
                        <span>Upload After</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {compressionNote && (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{compressionNote}</span>
                </div>
              )}

              {/* Time & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Completion Time
                  </label>
                  <input
                    type="text"
                    value={completionTime}
                    onChange={(e) => setCompletionTime(e.target.value)}
                    placeholder="e.g. 6 Hours or 2 Days"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Project Cost (GH₵ Optional)
                  </label>
                  <input
                    type="number"
                    value={estimatedCostGhs}
                    onChange={(e) => setEstimatedCostGhs(Number(e.target.value))}
                    placeholder="e.g. 450"
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the materials used and challenges solved..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {isOfflineMode
                    ? 'Save as Offline Draft'
                    : 'Publish to Public Portfolio'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
