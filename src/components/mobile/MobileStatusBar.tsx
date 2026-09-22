import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileStatusBarProps {
  theme?: 'dark' | 'light';
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ theme = 'dark' }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-stone-900';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-3 pb-2 select-none ${textColor}`}>
      {/* Time */}
      <span className="font-semibold text-xs tracking-tight">9:41</span>

      {/* Dynamic Island / Camera Notch */}
      <div className="w-20 h-4 rounded-full bg-black/90 mx-auto flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700/60 mr-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
      </div>

      {/* Connectivity Icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
