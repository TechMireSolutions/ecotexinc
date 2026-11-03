'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  ArrowRight,
  Trash2,
  Sparkles,
  AlertCircle,
  Undo2
} from 'lucide-react';
import { useStore, HeroConfig } from '../../store/useStore';
import { apiService } from '../../services/apiService';
import { ImageUploader } from './ImageUploader';

export const HeroBannerManager: React.FC = () => {
  const { 
    heroConfig, 
    updateHeroConfig 
  } = useStore();

  // Local draft state - changes remain in draft until user clicks "Publish Updates"
  const [localHero, setLocalHero] = useState<HeroConfig>(heroConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isInitialized = React.useRef(false);
  useEffect(() => {
    if (!isInitialized.current && heroConfig && Object.keys(heroConfig).length > 0) {
      setLocalHero(heroConfig);
      isInitialized.current = true;
    }
  }, [heroConfig]);

  // Check if current draft has unpublished edits
  const hasUnpublishedChanges = JSON.stringify(localHero) !== JSON.stringify(heroConfig);

  const handleSaveAll = async () => {
    try {
      const payload = {
        heroConfig: localHero,
        heroTitle: localHero.title,
        heroSubtitle: localHero.subtitle,
        heroButtonText: localHero.ctaText,
        heroBackgroundImage: localHero.backgroundImage
      };

      const saved = await apiService.updateSettings(payload);

      useStore.setState((state) => ({
        siteSettings: { ...state.siteSettings, ...saved },
        heroConfig: localHero
      }));

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ecotex_hero_config', JSON.stringify(localHero));
          localStorage.setItem('ecotex_site_settings', JSON.stringify(saved));
        } catch (_) {}

        window.dispatchEvent(new CustomEvent('ecotex_homepage_updated', {
          detail: { hero: localHero, settings: saved }
        }));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save hero banner:', err);
    }
  };

  const handleDiscardDraft = () => {
    setLocalHero(heroConfig);
  };

  // Preset bag images
  const BAG_PRESETS = [
    { label: 'Leaf Green Tote', url: '/images/bag-green.png', color: '#4E9F76' },
    { label: 'Cobalt Blue Tote', url: '/images/bag-blue.png', color: '#1e3a5f' },
    { label: 'Pure White Linen', url: '/images/bag-white.png', color: '#f8fafc' },
    { label: 'Luxury Black Tote', url: '/images/bag-black.png', color: '#0f172a' },
    { label: 'Bio Amber Orange', url: '/images/bag-orange.png', color: '#ea580c' },
  ];

  // Parse title lines for preview (mirrors BiteStyleHero)
  const titleLines = (localHero.title || "It's time to\npack better.").split('\n');

  const currentBgImage = 
    localHero.backgroundImage === 'none'
      ? null
      : (localHero.backgroundImage || '/images/home-hero-bg.jpg');

  return (
    <div className="space-y-8 animate-fadeInUp pb-12 font-sans">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              Homepage Visual Hero Manager
            </span>
            {hasUnpublishedChanges ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unpublished Draft
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live on Storefront
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            Homepage Hero Banner
          </h2>
          <p className="text-xs text-slate-500">
            Edit the draft below and preview in real-time. Changes will <strong>only</strong> appear on the live storefront when you click <strong>Publish Updates</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {hasUnpublishedChanges && (
            <button
              onClick={handleDiscardDraft}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer"
              title="Discard unpublished draft and restore current live version"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </button>
          )}


          <button
            onClick={handleSaveAll}
            className={`w-full sm:w-auto shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              hasUnpublishedChanges
                ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-emerald-600/30 ring-2 ring-[#4ade80]/50 animate-pulse'
                : 'bg-[#4E9F76] hover:bg-[#86C59E] text-white shadow-[#4E9F76]/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#B2E2C5] shrink-0" />
                <span>Published to Storefront!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span>{hasUnpublishedChanges ? 'Publish Updates Now' : 'Published'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Editor Controls (Left) & Real-time Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Editor Controls (7 Columns) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          
          {/* Card 1: Headlines & Copy */}
          <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                1. Headlines & Call-to-Action
              </h3>
              <p className="text-xs text-slate-400">
                The last word of the headline will automatically receive a luminous green gradient accent.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Main Headline (Press Enter for line break)
                </label>
                <textarea
                  rows={2}
                  value={localHero.title}
                  onChange={(e) => {
                    setLocalHero(prev => ({ ...prev, title: e.target.value }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
                  placeholder="It's time to&#10;pack better."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={3}
                  value={localHero.subtitle}
                  onChange={(e) => {
                    setLocalHero(prev => ({ ...prev, subtitle: e.target.value }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
                  placeholder="Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  value={localHero.ctaText || 'Shop Now'}
                  onChange={(e) => {
                    setLocalHero(prev => ({ ...prev, ctaText: e.target.value }));
                  }}
                  className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] focus:outline-none focus:border-[#86C59E]"
                  placeholder="Shop Now"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Hero Background Image */}
          <div className="bg-white rounded-3xl p-6 border border-[#B2E2C5]/30 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">
                    2. Panoramic Hero Backdrop
                  </h3>
                  {currentBgImage ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Photo Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Clean Dark Emerald Gradient
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set a panoramic photo or toggle off to use a sleek deep emerald gradient.
                </p>
              </div>

              {currentBgImage ? (
                <button
                  type="button"
                  onClick={() => {
                    setLocalHero(prev => ({ ...prev, backgroundImage: 'none' }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  title="Remove image and return to clean dark emerald gradient"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disable Photo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setLocalHero(prev => ({ ...prev, backgroundImage: '/images/home-hero-bg.jpg' }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#4E9F76] border border-emerald-200 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Restore Factory Photo</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Panoramic Hero Background Image"
                description="Upload custom landscape artwork or warehouse facility photography"
                value={localHero.backgroundImage === 'none' ? '' : (localHero.backgroundImage || '/images/home-hero-bg.jpg')}
                onChange={(newUrl) => {
                  const val = newUrl ? newUrl : 'none';
                  setLocalHero(prev => ({ ...prev, backgroundImage: val }));
                }}
                aspectRatio="banner"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Exact Replica Live Storefront Preview (5-6 Columns) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4 lg:sticky lg:top-24">
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#4E9F76]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#0f172a]">
                Live Storefront Hero Preview
              </span>
            </div>
            {hasUnpublishedChanges ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Previewing Draft
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#B2E2C5]/30 text-[#4E9F76]">
                Previewing Live
              </span>
            )}
          </div>

          {/* Miniature Replica of BiteStyleHero */}
          <div className="relative w-full min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0f172a] text-white flex flex-col justify-between p-6 sm:p-8 select-none">
            
            {/* Background Panorama with dark gradient overlay (Exact to BiteStyleHero.tsx) */}
            {currentBgImage ? (
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <img 
                  src={currentBgImage} 
                  alt="Backdrop" 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/75 pointer-events-none" />
              </div>
            ) : (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f172a]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/60 via-[#0f172a] to-[#022c22]/70" />
              </div>
            )}

            {/* Inner Content Grid */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              
              {/* Top Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-[1.1] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  {titleLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {idx === titleLines.length - 1 ? (
                        <span>
                          <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            {line.split(' ').slice(0, -1).join(' ')}{' '}
                          </span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#a7f3d0] drop-shadow-[0_2px_12px_rgba(74,222,128,0.55)]">
                            {line.split(' ').slice(-1)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                          {line}<br />
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h1>

                {/* Subtitle */}
                <p className="mt-3 text-xs text-white/85 leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-3">
                  {localHero.subtitle}
                </p>
              </div>

              {/* Center Floating Bag */}
              <div className="relative flex items-center justify-center my-2">
                {/* Backlight Glow */}
                <div className="absolute inset-0 m-auto w-36 h-36 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none -z-10" />

                {/* Floating Bag */}
                <div className="relative flex flex-col items-center justify-center w-full max-w-[200px]">
                  <img 
                    src={localHero.productImage || '/images/bag-green.png'} 
                    alt="Bag Cutout Preview" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bag-green.png';
                    }}
                    className="w-full h-auto max-h-[220px] object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.5)]"
                  />
                  {/* Shadow */}
                  <div className="w-[65%] h-4 bg-black/45 rounded-[100%] blur-md mt-1 pointer-events-none" />
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  className="py-3 px-6 rounded-full bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#10b981] text-white font-black text-xs tracking-wide shadow-[0_8px_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
                >
                  <span>{localHero.ctaText || 'Shop Now'}</span>
                  <div className="bg-white/20 p-1 rounded-full">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </button>
              </div>

            </div>

          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#B2E2C5]/40 text-xs text-slate-600 flex items-center justify-between shadow-2xs">
            {hasUnpublishedChanges ? (
              <span className="flex items-center gap-1.5 text-amber-700 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                Unpublished changes in draft. Click "Publish Updates Now" above to push to site.
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Storefront is synchronized with the latest published version.
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroBannerManager;
