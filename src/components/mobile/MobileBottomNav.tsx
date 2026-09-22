import React from 'react';
import { Home, Search, UserCheck, Briefcase, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type MobileTab = 'splash' | 'login' | 'signup' | 'home' | 'directory' | 'profile' | 'jobs' | 'artisan_suite';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { jobRequests } = useApp();

  const activeJobsCount = jobRequests.filter(
    (j) => j.status === 'work_in_progress' || j.status === 'estimate_received'
  ).length;

  const navItems = [
    {
      id: 'home' as MobileTab,
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'directory' as MobileTab,
      label: 'Artisans',
      icon: Search,
      badge: null,
    },
    {
      id: 'profile' as MobileTab,
      label: 'Portfolio',
      icon: UserCheck,
      badge: null,
    },
    {
      id: 'jobs' as MobileTab,
      label: 'Jobs',
      icon: Briefcase,
      badge: activeJobsCount > 0 ? activeJobsCount : null,
    },
    {
      id: 'artisan_suite' as MobileTab,
      label: 'Pro Hub',
      icon: Wrench,
      badge: null,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Bottom Navigation"
      className="w-full bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0 z-40"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 font-bold scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-orange-500 shadow-sm" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />

                {/* Badge for notifications / active jobs */}
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-orange-600 text-white font-black text-[9px] flex items-center justify-center shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-0.5 tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS home indicator safe area */}
      <div className="w-32 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2" />
    </nav>
  );
};
