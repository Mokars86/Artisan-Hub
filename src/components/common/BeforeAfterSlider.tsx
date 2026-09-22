import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  className?: string;
  handleText?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  title,
  className = '',
  handleText = 'B&A',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  return (
    <div className={`relative select-none overflow-hidden rounded-xl bg-stone-900 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-3 py-2 bg-stone-900/90 text-stone-200 border-b border-stone-800 text-xs">
          <span className="font-medium truncate flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {title}
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            Drag to compare
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative h-64 sm:h-80 w-full cursor-ew-resize overflow-hidden"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER Image (Full background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* BEFORE Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full max-w-none object-cover"
            style={{
              width: containerRef.current
                ? `${containerRef.current.clientWidth}px`
                : '100vw',
            }}
          />
        </div>

        {/* Divider line & handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 text-white font-extrabold text-[11px] shadow-lg border-2 border-white ring-2 ring-black/30 transition-transform active:scale-110 select-none">
            {handleText || <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-950/80 text-red-200 border border-red-500/30 backdrop-blur-sm shadow-sm">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 backdrop-blur-sm shadow-sm">
            {afterLabel}
          </span>
        </div>

        {/* Quick click preset points */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full bg-stone-900/70 backdrop-blur-md text-[10px] text-stone-300 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSliderPosition(20);
            }}
            className="hover:text-amber-400 px-1.5 transition-colors"
          >
            Before
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSliderPosition(50);
            }}
            className="hover:text-amber-400 px-1.5 transition-colors font-semibold text-amber-300"
          >
            50%
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSliderPosition(80);
            }}
            className="hover:text-amber-400 px-1.5 transition-colors"
          >
            After
          </button>
        </div>
      </div>
    </div>
  );
};
