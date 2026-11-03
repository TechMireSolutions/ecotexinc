'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Tag, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Save, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Percent, 
  Package, 
  DollarSign, 
  Check,
  Search,
  X,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  Sparkle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product, DealConfig } from '../../types';
import { ImageUploader } from './ImageUploader';

const DEFAULT_DEAL_CONFIG: DealConfig = {
  enabled: true,
  productId: '',
  badge: 'ECO CHOICE',
  title: "Grab It Before\nIt's Gone!",
  subtitle: 'Commercial Wholesale Series',
  buttonText: 'SHOP THE DEAL',
  offerPrice: 0.25,
  originalPrice: 0.36,
  stockText: 'Ready for Immediate Dispatch',
  stockProgressPercent: 78,
  timerHours: 8,
  timerMinutes: 12,
  timerSeconds: 45
};

const PRESET_BADGES = [
  'ECO CHOICE',
  'DEAL OF THE DAY',
  'FLASH WHOLESALE DEAL',
  'LIMITED TIME OFFER',
  '50% OFF SPECIAL',
  'HOT SELLER',
  'CLEARANCE SALE',
  'BULK BUY SPECIAL'
];

export const OffersDealsManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, products } = useStore();
  const currentDeal = siteSettings?.dealConfig || DEFAULT_DEAL_CONFIG;

  const [formData, setFormData] = useState<DealConfig>({
    ...DEFAULT_DEAL_CONFIG,
    ...currentDeal,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Sync when store updates
  useEffect(() => {
    if (siteSettings?.dealConfig) {
      setFormData((prev) => ({
        ...prev,
        ...siteSettings.dealConfig
      }));
    }
  }, [siteSettings?.dealConfig]);

  // Selected Product reference
  const selectedProduct: Product | undefined = useMemo(() => {
    if (formData.productId) {
      const found = products.find((p) => p.id === formData.productId);
      if (found) return found;
    }
    return products[0];
  }, [formData.productId, products]);

  // Real-time local preview ticker for the 4 boxes
  const [previewTime, setPreviewTime] = useState({
    hours: formData.timerHours || 8,
    minutes: formData.timerMinutes || 12,
    seconds: formData.timerSeconds || 45,
    milliseconds: 91
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewTime((prev) => {
        let ms = prev.milliseconds - 1;
        let s = prev.seconds;
        let m = prev.minutes;
        let h = prev.hours;

        if (ms < 0) {
          ms = 99;
          s -= 1;
        }
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = formData.timerHours || 8;
          m = formData.timerMinutes || 12;
          s = formData.timerSeconds || 45;
        }
        return { hours: h, minutes: m, seconds: s, milliseconds: ms };
      });
    }, 42);

    return () => clearInterval(interval);
  }, [formData.timerHours, formData.timerMinutes, formData.timerSeconds]);

  // Handle selecting a product from catalog
  const handleSelectProduct = (product: Product) => {
    setFormData((prev) => ({
      ...prev,
      productId: product.id,
      subtitle: product.subtitle || product.categoryLabel || prev.subtitle,
      offerPrice: product.pricePerUnit,
      originalPrice: Number((product.pricePerUnit * 1.45).toFixed(2)),
      customImage: product.image || prev.customImage,
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings({
      dealConfig: formData
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };


  // Filtered products for selector
  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => (
      p.name.toLowerCase().includes(q) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
      (p.material && p.material.toLowerCase().includes(q))
    ));
  }, [products, productSearch]);

  // Calculate discount percentage and savings
  const currentOfferPrice = Number(formData.offerPrice || selectedProduct?.pricePerUnit || 0.25);
  const currentOriginalPrice = Number(formData.originalPrice || (currentOfferPrice * 1.45));
  const savingsAmount = currentOriginalPrice > currentOfferPrice ? (currentOriginalPrice - currentOfferPrice) : 0;
  const discountPercent = currentOriginalPrice > currentOfferPrice
    ? Math.round((savingsAmount / currentOriginalPrice) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      
      {/* ========================================================
          TOP HEADER CARD
         ======================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FF5722] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                PROMOTIONS STUDIO
              </span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Special Offers & Flash Deals Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Curate your storefront's high-converting Deal of the Day banner. Link any catalog item, set discounted pricing, real-time urgency timer, and live stock countdown.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">

          <button
            type="button"
            onClick={() => handleSave()}
            className="flex-1 sm:flex-initial shrink-0 whitespace-nowrap justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#22c55e] hover:from-[#15803d] hover:to-[#16a34a] text-white text-xs font-black tracking-wide uppercase shadow-lg shadow-green-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer text-center"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
                <span>SAVED LIVE!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span>SAVE & PUBLISH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-xs animate-slideDown">
          <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-emerald-950">Offer changes published successfully!</p>
            <p className="text-xs text-emerald-800 font-normal">All storefront visitors are seeing this active special promotion right now.</p>
          </div>
        </div>
      )}

      {/* ========================================================
          1. LIVE STOREFRONT PREVIEW (EXACT SHOPPING EXPERIENCE)
         ======================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Preview Top Header */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                Live Storefront Preview
              </h3>
              <p className="text-[11px] text-slate-400">Interactive simulation of the homepage and shop deal banner</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start xs:self-auto">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
              formData.enabled 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${formData.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{formData.enabled ? 'LIVE ON STORE' : 'HIDDEN DRAFT'}</span>
            </span>
          </div>
        </div>

        {/* The Exact Banner Preview Card */}
        <div className={`w-full rounded-2xl sm:rounded-[36px] bg-[#FFF5ED] border border-[#FFE0CC] p-4 sm:p-8 lg:p-10 shadow-xs overflow-hidden transition-opacity duration-300 ${
          formData.enabled ? 'opacity-100' : 'opacity-60 ring-2 ring-dashed ring-slate-300'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Deal Copy & CTA */}
            <div className="lg:col-span-5 flex flex-col text-left">
              <span className="text-xs font-black tracking-widest uppercase text-[#FF5722] mb-2 sm:mb-3 inline-block">
                {formData.badge || 'ECO CHOICE'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-[1.1] mb-3 whitespace-pre-line">
                {formData.title || "Grab It Before\nIt's Gone!"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mb-5 font-medium max-w-md line-clamp-3">
                {formData.subtitle || selectedProduct?.subtitle || 'Commercial Wholesale Series'}
              </p>
              <div>
                <button
                  type="button"
                  className="bg-[#FF5722] text-white font-black text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 rounded-full inline-flex items-center gap-2.5 shadow-lg shadow-[#FF5722]/30 cursor-pointer pointer-events-none select-none"
                >
                  <span>{formData.buttonText || 'SHOP THE DEAL'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right Column: Clean White Product Card with Stock Bar & 4 Timer Boxes */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-md border border-stone-200/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                
                {/* Product Thumbnail */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 bg-stone-50 rounded-2xl flex items-center justify-center p-3 shrink-0 overflow-hidden border border-stone-100">
                  <img
                    src={formData.customImage || selectedProduct?.image || '/images/bag-blue.png'}
                    alt={selectedProduct?.name || 'Offer Product'}
                    className="w-full h-full object-contain filter drop-shadow-md select-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/bag-blue.png';
                    }}
                  />
                </div>

                {/* Details Column */}
                <div className="flex-1 w-full text-left">
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mb-1 line-clamp-1">
                    {selectedProduct?.name || 'Select a Product Below'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 mb-3 line-clamp-2">
                    {selectedProduct?.subtitle || selectedProduct?.description || 'Commercial Wholesale Series'}
                  </p>

                  {/* Pricing Row */}
                  <div className="flex items-baseline flex-wrap gap-2.5 mb-3.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#FF5722]">
                      ${currentOfferPrice.toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-stone-400 line-through">
                      ${currentOriginalPrice.toFixed(2)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-stone-700">
                      <span className="truncate pr-2">{formData.stockText || 'Ready for Immediate Dispatch'}</span>
                      <span className="text-[#FF5722] text-[11px] font-black shrink-0">{formData.stockProgressPercent || 78}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-[#FF5722] rounded-full transition-all duration-500" 
                        style={{ width: `${formData.stockProgressPercent || 78}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Square Countdown Timer Boxes */}
                  <div className="grid grid-cols-4 gap-2 max-w-xs">
                    
                    {/* HRS */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/90 p-1.5 sm:p-2 text-center shadow-2xs">
                      <span className="font-mono font-black text-sm sm:text-base text-stone-900 leading-none block">
                        {String(previewTime.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        HRS
                      </span>
                    </div>

                    {/* MINS */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/90 p-1.5 sm:p-2 text-center shadow-2xs">
                      <span className="font-mono font-black text-sm sm:text-base text-stone-900 leading-none block">
                        {String(previewTime.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        MINS
                      </span>
                    </div>

                    {/* SECS */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/90 p-1.5 sm:p-2 text-center shadow-2xs">
                      <span className="font-mono font-black text-sm sm:text-base text-stone-900 leading-none block">
                        {String(previewTime.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        SECS
                      </span>
                    </div>

                    {/* MSEC */}
                    <div className="rounded-xl border border-stone-200/90 bg-stone-50/90 p-1.5 sm:p-2 text-center shadow-2xs">
                      <span className="font-mono font-black text-sm sm:text-base text-[#FF5722] leading-none block">
                        {String(previewTime.milliseconds).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block mt-1">
                        MSEC
                      </span>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          2. FORM SETTINGS & CONFIGURATION
         ======================================================== */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Visibility Toggle Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${formData.enabled ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'}`} />
              <h4 className="text-base font-black text-slate-900">
                Storefront Display Visibility
              </h4>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Toggle to instantly show or hide the Special Offers & Deals banner across both Homepage and Shop page without losing any configured content.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">
              {formData.enabled ? 'Enabled (Live)' : 'Disabled (Hidden)'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#22c55e]"></div>
            </label>
          </div>
        </div>

        {/* 1. Pick the Offer Product */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  1. Select Offer Product
                </h3>
                <p className="text-xs text-slate-500">Pick any active product from your live catalog to spotlight</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 self-start sm:self-auto">
              {products.length} Products Available
            </span>
          </div>

          {/* Search box for catalog */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products by title, category, or material..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
            />
            {productSearch && (
              <button
                type="button"
                onClick={() => setProductSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Product Cards Picker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1.5 border border-slate-200/80 rounded-2xl bg-slate-50/50">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                No products found matching "{productSearch}".
                <button
                  type="button"
                  onClick={() => setProductSearch('')}
                  className="ml-2 text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isSelected = (formData.productId === p.id) || (!formData.productId && selectedProduct?.id === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-600/20'
                        : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200/80 shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={p.image || '/images/bag-green.png'}
                        alt={p.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/bag-green.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {p.categoryLabel || p.subtitle || 'Catalog Item'} · <span className="font-bold text-slate-700">${p.pricePerUnit.toFixed(2)}</span>
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Offer Banner Headlines & Badges */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5722] flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Banner Headlines & Badges
              </h3>
              <p className="text-xs text-slate-500">Configure promotional badges, bold headline copy, and call-to-action</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Badge input with quick presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Top Badge Label
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-[#FF5722] bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition-all"
                placeholder="e.g. ECO CHOICE or 50% OFF"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_BADGES.map((b) => {
                  const isActive = formData.badge === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, badge: b })}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-2xs' 
                          : 'bg-slate-100/80 text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-[#FF5722] hover:border-orange-200'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Button Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                placeholder="e.g. SHOP THE DEAL"
              />
              <p className="text-[11px] text-slate-400">
                Action button directly adds this item to cart or opens quick-order modal.
              </p>
            </div>

            {/* Main Headline */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Main Headline
                </label>
                <span className="text-[11px] text-slate-400">
                  Tip: Press Enter to create a 2-line punchy headline
                </span>
              </div>
              <textarea
                rows={2}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-black text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all resize-none leading-snug"
                placeholder="Grab It Before&#10;It's Gone!"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Subtitle / Offer Tagline
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                placeholder="Commercial Wholesale Series"
              />
            </div>
          </div>
        </div>

        {/* 3. Offer Pricing & Discount */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. Offer Pricing & Calculated Savings
              </h3>
              <p className="text-xs text-slate-500">Set special promotional unit prices and show customer savings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 items-end">
            {/* Offer Sale Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Special Offer Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 font-black">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.offerPrice || ''}
                  onChange={(e) => setFormData({ ...formData, offerPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-black text-[#FF5722] bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-500 transition-all"
                  placeholder="0.25"
                />
              </div>
            </div>

            {/* Regular / Strikethrough Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Original Price ($) (Strikethrough)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  placeholder="0.36"
                />
              </div>
            </div>

            {/* Calculated Discount Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Customer Savings
              </label>
              <div className="h-[42px] rounded-xl bg-orange-50 border border-orange-200/80 px-4 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-[#FF5722]" />
                  <span className="text-xs font-black text-[#FF5722]">
                    {discountPercent}% OFF
                  </span>
                </div>
                {savingsAmount > 0 && (
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-md">
                    Save ${savingsAmount.toFixed(2)}/pc
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Urgency Countdown & Stock Progress */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Urgency Countdown Timer & Stock Bar
              </h3>
              <p className="text-xs text-slate-500">Drive wholesale conversions with psychological scarcity and countdown clock</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Timer Hours */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Timer Hours (0-99)
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={formData.timerHours}
                onChange={(e) => setFormData({ ...formData, timerHours: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>

            {/* Timer Minutes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Timer Minutes (0-59)
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData.timerMinutes}
                onChange={(e) => setFormData({ ...formData, timerMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>

            {/* Timer Seconds */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Timer Seconds (0-59)
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData.timerSeconds}
                onChange={(e) => setFormData({ ...formData, timerSeconds: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-bold bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>

            {/* Quick Timer Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Quick Hour Presets
              </label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[6, 12, 24, 48].map((h) => {
                  const isActive = formData.timerHours === h && formData.timerMinutes === 0 && formData.timerSeconds === 0;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData({ ...formData, timerHours: h, timerMinutes: 0, timerSeconds: 0 })}
                      className={`flex-1 text-[11px] font-bold py-2 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                      }`}
                    >
                      {h}h
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Bar Text */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Stock Status Tagline
              </label>
              <input
                type="text"
                value={formData.stockText}
                onChange={(e) => setFormData({ ...formData, stockText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                placeholder="Ready for Immediate Dispatch"
              />
            </div>

            {/* Stock Progress Percent */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Stock Claimed Progress Bar (%)
                </label>
                <span className="text-xs font-black text-[#FF5722] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {formData.stockProgressPercent}% Claimed
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={formData.stockProgressPercent}
                onChange={(e) => setFormData({ ...formData, stockProgressPercent: parseInt(e.target.value) || 78 })}
                className="w-full accent-[#FF5722] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                <span>5% (Just started)</span>
                <span>50%</span>
                <span>100% (Almost gone)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Custom Promo Image (Optional override) */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                5. Custom Promotional Cutout Image (Optional)
              </h3>
              <p className="text-xs text-slate-500">
                By default, the selected product's photo is automatically used. Upload or paste a custom promo pack shot cutout to override it.
              </p>
            </div>
            {formData.customImage && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, customImage: undefined })}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-bold self-start sm:self-auto flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Use Catalog Image</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/80">
            <ImageUploader
              value={formData.customImage || selectedProduct?.image}
              onChange={(url: string) => setFormData({ ...formData, customImage: url })}
              label="Upload Custom Offer Product Image"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Bottom Floating Publish Bar */}
        <div className="sticky bottom-6 z-30 bg-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Ready to publish this special offer?
              </p>
              <p className="text-[11px] text-slate-400">
                All changes sync immediately to database and active storefront visitors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-6 sm:px-8 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap text-center flex items-center justify-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>OFFER PUBLISHED!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>PUBLISH OFFER NOW</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default OffersDealsManager;