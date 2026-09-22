import React from 'react';
import artisanHubLogoUrl from '../../assets/images/artisan_hub_logo_1789965396816.jpg';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'white' | 'dark';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  };

  const textMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative shrink-0 overflow-hidden shadow-md ring-1 ring-orange-500/20 bg-[#0C182B] ${sizeMap[size]}`}
      >
        <img
          src={artisanHubLogoUrl}
          alt="Artisan Hub Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight leading-none ${
              textColor === 'white' ? 'text-white' : 'text-stone-900 dark:text-white'
            } ${textMap[size]}`}
          >
            Artisan <span className="text-orange-500">Hub</span>
          </span>
          {size !== 'sm' && (
            <span
              className={`text-[10px] font-semibold tracking-wide uppercase mt-0.5 ${
                textColor === 'white' ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              Certified Pros • Ghana
            </span>
          )}
        </div>
      )}
    </div>
  );
};
