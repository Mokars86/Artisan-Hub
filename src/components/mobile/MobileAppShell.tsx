import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { MobileStatusBar } from './MobileStatusBar';
import { MobileBottomNav, MobileTab } from './MobileBottomNav';

interface MobileAppShellProps {
  children: React.ReactNode;
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  statusTheme?: 'dark' | 'light';
  hideBottomNav?: boolean;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  children,
  activeTab,
  onTabChange,
  isFrameMode,
  onToggleFrameMode,
  statusTheme,
  hideBottomNav = false,
}) => {
  const isDarkHeader =
    statusTheme === 'dark' ||
    activeTab === 'home' ||
    activeTab === 'splash' ||
    activeTab === 'login' ||
    activeTab === 'signup';

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-950 p-0 sm:p-4">
      {/* Device Frame Wrapper (Centered phone mockup on desktop, fluid on mobile) */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isFrameMode
            ? 'max-w-[420px] h-[860px] max-h-[96vh] rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] ring-[12px] ring-stone-900 border-4 border-stone-800 overflow-hidden relative'
            : 'max-w-xl min-h-screen sm:min-h-[860px] sm:rounded-3xl sm:border sm:border-stone-200 sm:dark:border-stone-800 shadow-xl overflow-hidden'
        } bg-white dark:bg-stone-900`}
      >
        {/* Top Status Bar (9:41, WiFi, Battery, Dynamic Island) */}
        <div className={`shrink-0 z-30 ${isDarkHeader ? 'bg-[#0C182B]' : 'bg-white dark:bg-stone-900'}`}>
          <MobileStatusBar theme={isDarkHeader ? 'dark' : 'light'} />
        </div>

        {/* Screen Content Body */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar (Shown on core app screens) */}
        {!hideBottomNav && (
          <MobileBottomNav activeTab={activeTab} onTabChange={onTabChange} />
        )}
      </div>
    </div>
  );
};
