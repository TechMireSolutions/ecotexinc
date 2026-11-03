'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Save,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  
  ExternalLink,
  Layers,
  Check,
  AlertCircle,
  HelpCircle,
  Headphones
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { apiService } from '../../services/apiService';
import { ImageUploader } from './ImageUploader';
import { ShopConfig } from '../../types';

interface ShopBannerManagerProps {
  onViewShop?: () => void;
}

export const ShopBannerManager: React.FC<ShopBannerManagerProps> = ({ onViewShop }) => {
  const { siteSettings, updateSiteSettings } = useStore();

  const currentShopConfig = siteSettings?.shopConfig || {} as Partial<ShopConfig>;

  // Form State initialized from siteSettings.shopConfig
  const [formData, setFormData] = useState({
    showHeroBanner: currentShopConfig.showHeroBanner !== false,
    heroBannerBadge: currentShopConfig.heroBannerBadge || 'LIMITED TIME ONLY',
    heroBannerTitle: currentShopConfig.heroBannerTitle || "Shop More,\nSave More!",
    heroBannerSubtitle: currentShopConfig.heroBannerSubtitle || 'Discover amazing deals on your favorite sustainable products & eco-friendly essentials.',
    heroBannerBtnText: currentShopConfig.heroBannerBtnText || 'EXPLORE COLLECTION',
    heroBannerImage: currentShopConfig.heroBannerImage || '/images/shop-hero-podium.jpg',
    heroBannerDiscountBadge: currentShopConfig.heroBannerDiscountBadge || 'UP TO 50% OFF',
    valueProp1Title: currentShopConfig.valueProp1Title || 'Best Prices',
    valueProp1Subtitle: currentShopConfig.valueProp1Subtitle || 'Guaranteed',
    valueProp2Title: currentShopConfig.valueProp2Title || 'Secure',
    valueProp2Subtitle: currentShopConfig.valueProp2Subtitle || 'Payments',
    valueProp3Title: currentShopConfig.valueProp3Title || 'Fast Delivery',
    valueProp3Subtitle: currentShopConfig.valueProp3Subtitle || 'Worldwide',
    trustBar1Title: currentShopConfig.trustBar1Title || 'Free Shipping',
    trustBar1Subtitle: currentShopConfig.trustBar1Subtitle || 'On orders over $75',
    trustBar2Title: currentShopConfig.trustBar2Title || 'Easy Returns',
    trustBar2Subtitle: currentShopConfig.trustBar2Subtitle || '30-day returns',
    trustBar3Title: currentShopConfig.trustBar3Title || 'Premium Quality',
    trustBar3Subtitle: currentShopConfig.trustBar3Subtitle || '100% original products',
    trustBar4Title: currentShopConfig.trustBar4Title || '24/7 Support',
    trustBar4Subtitle: currentShopConfig.trustBar4Subtitle || "We're here to help"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'banner' | 'value-props' | 'trust-bar'>('banner');

  // Keep state synced if siteSettings changes externally
  useEffect(() => {
    if (siteSettings?.shopConfig) {
      const cfg = siteSettings.shopConfig;
      setFormData(prev => ({
        ...prev,
        showHeroBanner: cfg.showHeroBanner !== false,
        heroBannerBadge: cfg.heroBannerBadge || prev.heroBannerBadge,
        heroBannerTitle: cfg.heroBannerTitle || prev.heroBannerTitle,
        heroBannerSubtitle: cfg.heroBannerSubtitle || prev.heroBannerSubtitle,
        heroBannerBtnText: cfg.heroBannerBtnText || prev.heroBannerBtnText,
        heroBannerImage: cfg.heroBannerImage || prev.heroBannerImage,
        heroBannerDiscountBadge: cfg.heroBannerDiscountBadge || prev.heroBannerDiscountBadge,
        valueProp1Title: cfg.valueProp1Title || prev.valueProp1Title,
        valueProp1Subtitle: cfg.valueProp1Subtitle || prev.valueProp1Subtitle,
        valueProp2Title: cfg.valueProp2Title || prev.valueProp2Title,
        valueProp2Subtitle: cfg.valueProp2Subtitle || prev.valueProp2Subtitle,
        valueProp3Title: cfg.valueProp3Title || prev.valueProp3Title,
        valueProp3Subtitle: cfg.valueProp3Subtitle || prev.valueProp3Subtitle,
        trustBar1Title: cfg.trustBar1Title || prev.trustBar1Title,
        trustBar1Subtitle: cfg.trustBar1Subtitle || prev.trustBar1Subtitle,
        trustBar2Title: cfg.trustBar2Title || prev.trustBar2Title,
        trustBar2Subtitle: cfg.trustBar2Subtitle || prev.trustBar2Subtitle,
        trustBar3Title: cfg.trustBar3Title || prev.trustBar3Title,
        trustBar3Subtitle: cfg.trustBar3Subtitle || prev.trustBar3Subtitle,
        trustBar4Title: cfg.trustBar4Title || prev.trustBar4Title,
        trustBar4Subtitle: cfg.trustBar4Subtitle || prev.trustBar4Subtitle
      }));
    }
  }, [siteSettings]);

  const IMAGE_PRESETS = [
    { label: 'Studio Podium (Default)', url: '/images/shop-hero-podium.jpg' },
    { label: 'Leather Handbag', url: '/images/leather-handbag.jpg' },
    { label: 'Classic Footwear', url: '/images/classic-sneakers.jpg' },
    { label: 'Emerald Green Tote', url: '/images/bag-green.png' },
    { label: 'Luxury Black Tote', url: '/images/bag-black.png' },
    { label: 'Packaging Bags', url: '/images/hero-packaging-bags-bg.png' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const mergedShopConfig: ShopConfig = {
        ...(siteSettings?.shopConfig || { catalogTitle: '', catalogSubtitle: '', testimonials: [] }),
        ...formData
      };

      const payload = {
        shopConfig: mergedShopConfig
      };

      const saved = await apiService.updateSettings(payload);

      updateSiteSettings({ shopConfig: mergedShopConfig });

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ecotex_site_settings', JSON.stringify({
            ...siteSettings,
            shopConfig: mergedShopConfig
          }));
        } catch (_) {}

        window.dispatchEvent(new CustomEvent('ecotex_settings_updated', {
          detail: { settings: { ...siteSettings, shopConfig: mergedShopConfig } }
        }));
        window.dispatchEvent(new CustomEvent('ecotex_homepage_updated', {
          detail: { settings: { ...siteSettings, shopConfig: mergedShopConfig } }
        }));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save shop banner settings:', err);
      alert('Failed to save banner settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to restore the default shop banner copy and images?')) {
      setFormData({
        showHeroBanner: true,
        heroBannerBadge: 'LIMITED TIME ONLY',
        heroBannerTitle: "Shop More,\nSave More!",
        heroBannerSubtitle: 'Discover amazing deals on your favorite sustainable products & eco-friendly essentials.',
        heroBannerBtnText: 'EXPLORE COLLECTION',
        heroBannerImage: '/images/shop-hero-podium.jpg',
        heroBannerDiscountBadge: 'UP TO 50% OFF',
        valueProp1Title: 'Best Prices',
        valueProp1Subtitle: 'Guaranteed',
        valueProp2Title: 'Secure',
        valueProp2Subtitle: 'Payments',
        valueProp3Title: 'Fast Delivery',
        valueProp3Subtitle: 'Worldwide',
        trustBar1Title: 'Free Shipping',
        trustBar1Subtitle: 'On orders over $75',
        trustBar2Title: 'Easy Returns',
        trustBar2Subtitle: '30-day returns',
        trustBar3Title: 'Premium Quality',
        trustBar3Subtitle: '100% original products',
        trustBar4Title: '24/7 Support',
        trustBar4Subtitle: "We're here to help"
      });
    }
  };

  const handleOpenLiveShop = () => {
    if (onViewShop) {
      onViewShop();
    } else if (typeof window !== 'undefined') {
      window.open('/#shop', '_blank');
    }
  };

  return (
    <div className="space-y-8 animate-fadeInUp pb-12 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0a2c17] text-white flex items-center justify-center font-bold shadow-md shadow-[#0a2c17]/20 shrink-0">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Shop Page Hero Banner
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live CMS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Customize the high-converting top banner, discount circle badge, value props, and podium showcase image.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handleOpenLiveShop}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:border-slate-300 active:scale-95"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>View Live Shop</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-800 text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Reset form fields to factory default values"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-95 ${
              saveSuccess
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : 'bg-[#4E9F76] hover:bg-[#3d8560] shadow-[#4E9F76]/25'
            }`}
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </span>
            ) : saveSuccess ? (
              <span className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                Saved & Published!
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Save className="w-4 h-4" />
                Publish Updates
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Visibility Toggle Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            formData.showHeroBanner ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {formData.showHeroBanner ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Banner Visibility Status: <span className={formData.showHeroBanner ? 'text-emerald-600' : 'text-slate-500'}>
                {formData.showHeroBanner ? 'Active & Visible on Shop Page' : 'Hidden from Shop Page'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              When enabled, this full-width studio banner displays at the very top of the Shop page.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFormData(p => ({ ...p, showHeroBanner: !p.showHeroBanner }))}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            formData.showHeroBanner
              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300 hover:bg-emerald-500/20'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          {formData.showHeroBanner ? 'Turn Off Banner' : 'Turn On Banner'}
        </button>
      </div>

      {/* ========================================================
          LIVE VISUAL PREVIEW CONTAINER (MATCHES SHOPSECTION.TSX)
         ======================================================== */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Live Preview (Real-Time Render)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Shows exactly what visitors see on the Shop page
          </span>
        </div>

        <div className="rounded-3xl overflow-hidden border border-emerald-950/40 shadow-xl bg-gradient-to-r from-[#051a0e] via-[#0a2c17] to-[#04150a] text-white relative">
          
          {/* Ambient Lighting Glows */}
          <div className="pointer-events-none absolute -top-32 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/15 blur-[100px]" />

          {/* Dot Matrix Decoration */}
          <div className="pointer-events-none absolute top-6 right-8 opacity-25 hidden md:grid grid-cols-6 gap-2 z-10">
            {[...Array(24)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white block" />
            ))}
          </div>

          {/* Banner Inner Preview Content */}
          <div className="w-full px-6 sm:px-10 lg:px-14 py-8 sm:py-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a2c16]/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-widest uppercase mb-4 self-start shadow-inner">
                  <span>{formData.heroBannerBadge || 'LIMITED TIME ONLY'}</span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08] mb-3 whitespace-pre-line">
                  {formData.heroBannerTitle || "Shop More,\nSave More!"}
                </h1>

                {/* Subtitle */}
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed max-w-lg mb-6 font-normal">
                  {formData.heroBannerSubtitle || 'Discover amazing deals on your favorite sustainable products & eco-friendly essentials.'}
                </p>

                {/* 3 Value Props */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-7">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-xs shrink-0">
                      <Tag className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-white">{formData.valueProp1Title || 'Best Prices'}</p>
                      <p className="text-emerald-200/80 text-[9px]">{formData.valueProp1Subtitle || 'Guaranteed'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-xs shrink-0">
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-white">{formData.valueProp2Title || 'Secure'}</p>
                      <p className="text-emerald-200/80 text-[9px]">{formData.valueProp2Subtitle || 'Payments'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d3419] shadow-xs shrink-0">
                      <Truck className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-white">{formData.valueProp3Title || 'Fast Delivery'}</p>
                      <p className="text-emerald-200/80 text-[9px]">{formData.valueProp3Subtitle || 'Worldwide'}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <button
                    type="button"
                    className="bg-[#FF5722] hover:bg-[#e64a19] text-white font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-full inline-flex items-center gap-2.5 shadow-lg shadow-[#FF5722]/35 transition-all select-none"
                  >
                    <span>{formData.heroBannerBtnText || 'EXPLORE COLLECTION'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Right Column: Podium Image & Floating Badge */}
              <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl select-none group border border-white/10">
                  <img
                    src={formData.heroBannerImage || "/images/shop-hero-podium.jpg"}
                    alt="Podium Showcase"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Soft Gradient Overlay on left edge */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a2c17] to-transparent opacity-75" />

                  {/* Floating Circular Orange Badge */}
                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#FF5722] text-white flex flex-col items-center justify-center shadow-xl shadow-[#FF5722]/50 font-extrabold uppercase text-center border-2 border-white/30 select-none z-20">
                    <span className="text-[11px] sm:text-xs font-black leading-tight text-center px-1.5 whitespace-pre-line">
                      {formData.heroBannerDiscountBadge || 'UP TO 50% OFF'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'banner'
              ? 'bg-[#4E9F76] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Hero Banner & Photography
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('value-props')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'value-props'
              ? 'bg-[#4E9F76] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Three Value Badges
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trust-bar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'trust-bar'
              ? 'bg-[#4E9F76] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. 4-Item Trust Strip Bar
        </button>
      </div>

      {/* ========================================================
          TAB 1: BANNER HEADLINES & PODIUM IMAGE
         ======================================================== */}
      {activeTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left Column: Headlines & Copy */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Headlines, Badges & Call To Action
              </h3>
              <p className="text-xs text-slate-400">
                Edit the text content, promotional discount percentage, and CTA button.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Top Pill Badge Text
                </label>
                <input
                  type="text"
                  value={formData.heroBannerBadge}
                  onChange={(e) => setFormData(p => ({ ...p, heroBannerBadge: e.target.value }))}
                  placeholder="LIMITED TIME ONLY"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-emerald-800 focus:bg-white focus:border-[#4E9F76] focus:ring-2 focus:ring-[#4E9F76]/20 transition-all"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Upper-left green badge pill</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Floating Discount Circle Badge
                </label>
                <input
                  type="text"
                  value={formData.heroBannerDiscountBadge}
                  onChange={(e) => setFormData(p => ({ ...p, heroBannerDiscountBadge: e.target.value }))}
                  placeholder="UP TO 50% OFF"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-black text-[#FF5722] focus:bg-white focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 transition-all"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Orange circular badge over the podium image</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Main Headline (Supports \n line break)
              </label>
              <textarea
                rows={2}
                value={formData.heroBannerTitle}
                onChange={(e) => setFormData(p => ({ ...p, heroBannerTitle: e.target.value }))}
                placeholder="Shop More,&#10;Save More!"
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-black text-slate-900 focus:bg-white focus:border-[#4E9F76] focus:ring-2 focus:ring-[#4E9F76]/20 transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Use Enter / Newline to split into 2 lines (e.g. &ldquo;Shop More,&rdquo; and &ldquo;Save More!&rdquo;)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                value={formData.heroBannerSubtitle}
                onChange={(e) => setFormData(p => ({ ...p, heroBannerSubtitle: e.target.value }))}
                placeholder="Discover amazing deals on your favorite sustainable products & eco-friendly essentials."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:border-[#4E9F76] focus:ring-2 focus:ring-[#4E9F76]/20 transition-all leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.heroBannerBtnText}
                onChange={(e) => setFormData(p => ({ ...p, heroBannerBtnText: e.target.value }))}
                placeholder="EXPLORE COLLECTION"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#4E9F76] focus:ring-2 focus:ring-[#4E9F76]/20 transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Smoothly scrolls visitors to the products catalog</span>
            </div>
          </div>

          {/* Right Column: Image Uploader & Presets */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Podium Showcase Photography
              </h3>
              <p className="text-xs text-slate-400">
                Upload custom product display photography or choose a preset.
              </p>
            </div>

            <ImageUploader
              label="Podium Hero Image"
              value={formData.heroBannerImage}
              onChange={(newUrl) => setFormData(p => ({ ...p, heroBannerImage: newUrl }))}
              aspectRatio="wide"
              description="High-resolution image (approx 4:3 or 16:9 aspect ratio)."
              placeholderText="Upload podium showcase photo"
            />

            {/* Quick Preset Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Or Select from Ready Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {IMAGE_PRESETS.map((preset) => {
                  const isSelected = formData.heroBannerImage === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, heroBannerImage: preset.url }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#4E9F76] bg-emerald-50/60 ring-2 ring-[#4E9F76]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                          {preset.label}
                        </div>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-[#4E9F76] uppercase">Active</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: THREE VALUE PROPOSITION BADGES
         ======================================================== */}
      {activeTab === 'value-props' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Three Value Proposition Badges
              </h3>
              <p className="text-xs text-slate-400">
                These 3 badges appear directly under the subtitle with icons in the hero banner.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              3 Badges
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Badge 1: Best Prices */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-800">
                  <Tag className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-slate-800">Badge 1 (Tag Icon)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.valueProp1Title}
                  onChange={(e) => setFormData(p => ({ ...p, valueProp1Title: e.target.value }))}
                  placeholder="Best Prices"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.valueProp1Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, valueProp1Subtitle: e.target.value }))}
                  placeholder="Guaranteed"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Badge 2: Secure Payments */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-slate-800">Badge 2 (Shield Icon)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.valueProp2Title}
                  onChange={(e) => setFormData(p => ({ ...p, valueProp2Title: e.target.value }))}
                  placeholder="Secure"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.valueProp2Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, valueProp2Subtitle: e.target.value }))}
                  placeholder="Payments"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Badge 3: Fast Delivery */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-800">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase text-slate-800">Badge 3 (Truck Icon)</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.valueProp3Title}
                  onChange={(e) => setFormData(p => ({ ...p, valueProp3Title: e.target.value }))}
                  placeholder="Fast Delivery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.valueProp3Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, valueProp3Subtitle: e.target.value }))}
                  placeholder="Worldwide"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: 4-ITEM TRUST STRIP BAR
         ======================================================== */}
      {activeTab === 'trust-bar' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                4-Item Trust & Value Strip Bar
              </h3>
              <p className="text-xs text-slate-400">
                This horizontal strip sits directly below the hero banner on the Shop page.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              4 Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Strip 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="w-4 h-4 text-[#4E9F76]" />
                <span className="text-xs font-black uppercase text-slate-800">1. Free Shipping</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.trustBar1Title}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar1Title: e.target.value }))}
                  placeholder="Free Shipping"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.trustBar1Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar1Subtitle: e.target.value }))}
                  placeholder="On orders over $75"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Strip 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <RotateCcw className="w-4 h-4 text-[#4E9F76]" />
                <span className="text-xs font-black uppercase text-slate-800">2. Easy Returns</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.trustBar2Title}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar2Title: e.target.value }))}
                  placeholder="Easy Returns"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.trustBar2Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar2Subtitle: e.target.value }))}
                  placeholder="30-day returns"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Strip 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#4E9F76]" />
                <span className="text-xs font-black uppercase text-slate-800">3. Premium Quality</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.trustBar3Title}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar3Title: e.target.value }))}
                  placeholder="Premium Quality"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.trustBar3Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar3Subtitle: e.target.value }))}
                  placeholder="100% original products"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

            {/* Strip 4 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Headphones className="w-4 h-4 text-[#4E9F76]" />
                <span className="text-xs font-black uppercase text-slate-800">4. 24/7 Support</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.trustBar4Title}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar4Title: e.target.value }))}
                  placeholder="24/7 Support"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.trustBar4Subtitle}
                  onChange={(e) => setFormData(p => ({ ...p, trustBar4Subtitle: e.target.value }))}
                  placeholder="We're here to help"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-600"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Bottom Save Bar for Quick Access */}
      <div className="sticky bottom-6 z-30 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-white">Ready to publish changes?</div>
            <div className="text-[11px] text-slate-400">All changes are saved to the backend API and update the storefront immediately.</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600'
                : 'bg-[#4E9F76] hover:bg-[#3d8560]'
            }`}
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                Published!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
