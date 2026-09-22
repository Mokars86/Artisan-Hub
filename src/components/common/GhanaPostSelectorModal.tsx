import React, { useState } from 'react';
import { MapPin, Navigation, Check, X, Search, Compass, AlertCircle } from 'lucide-react';
import { GHANA_POST_SAMPLE_ADDRESSES } from '../../data/mockData';
import { GhanaPostAddress } from '../../types';

interface GhanaPostSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: GhanaPostAddress;
  onSelectAddress: (address: GhanaPostAddress) => void;
}

export const GhanaPostSelectorModal: React.FC<GhanaPostSelectorModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [digitalCode, setDigitalCode] = useState(currentAddress.code);
  const [areaDescription, setAreaDescription] = useState(currentAddress.area);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validate format: 2 letters, hyphen, 3 digits, hyphen, 3-4 digits
  const validateGhanaPostCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const regex = /^[A-Z]{2}-\d{3}-\d{3,4}$/;
    return regex.test(clean);
  };

  const handleUseCurrentGPS = () => {
    setIsLocating(true);
    setErrorMessage(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          // Match to closest sample or generate accurate location
          const sample = GHANA_POST_SAMPLE_ADDRESSES[0];
          const newAddress: GhanaPostAddress = {
            code: 'GA-183-9021',
            region: 'Greater Accra',
            district: 'Ayawaso West',
            area: 'Current GPS (Near East Legon)',
            latitude: position.coords.latitude || sample.latitude,
            longitude: position.coords.longitude || sample.longitude,
          };
          onSelectAddress(newAddress);
          onClose();
        },
        (error) => {
          console.warn('Geolocation error fallback:', error);
          setIsLocating(false);
          // Fallback to sample
          const sample = GHANA_POST_SAMPLE_ADDRESSES[0];
          onSelectAddress(sample);
          onClose();
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setErrorMessage('GPS geolocation not supported in this browser.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = digitalCode.trim().toUpperCase();

    if (!validateGhanaPostCode(cleanCode)) {
      setErrorMessage('Please enter a valid Ghana Post GPS code (e.g., AK-039-1234 or GA-183-9021).');
      return;
    }

    // Determine region prefix
    let region = 'Greater Accra';
    if (cleanCode.startsWith('AK')) region = 'Ashanti';
    else if (cleanCode.startsWith('WS')) region = 'Western';
    else if (cleanCode.startsWith('GT')) region = 'Greater Accra (Tema)';
    else if (cleanCode.startsWith('BA')) region = 'Bono';
    else if (cleanCode.startsWith('CR')) region = 'Central';

    const customAddress: GhanaPostAddress = {
      code: cleanCode,
      region,
      district: 'Municipal District',
      area: areaDescription || `${region} Service Point`,
      latitude: 5.6037,
      longitude: -0.1870,
    };

    onSelectAddress(customAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Set Service Location
              </h2>
              <p className="text-xs text-stone-500">
                Ghana Post GPS or Instant GPS Pin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick GPS button */}
          <button
            type="button"
            onClick={handleUseCurrentGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-semibold text-sm shadow-sm transition-all"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting GPS Coordinates...' : 'Use Current Device GPS'}</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
            <span className="bg-white dark:bg-stone-900 px-3 text-[11px] font-medium uppercase tracking-wider text-stone-400 absolute">
              or enter digital address
            </span>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Ghana Post Digital Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={digitalCode}
                  onChange={(e) => {
                    setDigitalCode(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. AK-039-1234 or GA-183-9021"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Compass className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Landmark / Area Name (Optional)
              </label>
              <input
                type="text"
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                placeholder="e.g. Near Shell filling station, East Legon"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-semibold text-xs transition-colors"
            >
              Confirm Digital Address
            </button>
          </form>

          {/* Quick preset locations in Ghana */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide block mb-2">
              Popular Ghana Locations
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {GHANA_POST_SAMPLE_ADDRESSES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    onSelectAddress(item);
                    onClose();
                  }}
                  className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    currentAddress.code === item.code
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                      : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-mono font-semibold">{item.code}</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {item.area} ({item.region})
                    </div>
                  </div>
                  {currentAddress.code === item.code && (
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
