'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Package,
  DollarSign,
  Truck,
  AlertCircle,
  FileText,
  Save,
  RotateCcw,
  Building,
  Phone,
  Mail,
  TrendingUp,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Megaphone,
  Layers,
  Users,
  Calculator,
  Star,
  Trash2,
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Recycle,
  Tag,
  Check
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { apiService } from '../../services/apiService';
import { DYE_COLORS } from '../../data/colors';
import {
  SiteSettings,
  LogoConfig,
  NavbarConfig,
  VersatilityConfig,
  SustainabilityConfig,
  AboutConfig,
  ContactConfig,
  FooterConfig,
  QuoteCalcConfig,
  ShopConfig,
  TeamMemberConfig,
  TestimonialConfig
} from '../../types';
import { Product, ProductCategory, ProductColorVariant } from '../../types';

const DEFAULT_PALETTE: ProductColorVariant[] = [
  { id: 'white', name: 'White', hex: '#FFFFFF', stockQuantity: 25 },
  { id: 'black', name: 'Black', hex: '#18181b', stockQuantity: 50 },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#2563eb', stockQuantity: 30 },
  { id: 'red', name: 'Red', hex: '#dc2626', stockQuantity: 20 },
  { id: 'dark-green', name: 'Dark Green', hex: '#166534', stockQuantity: 50 },
  { id: 'navy-blue', name: 'Navy Blue', hex: '#1e3a8a', stockQuantity: 40 },
  { id: 'yellow', name: 'Yellow', hex: '#eab308', stockQuantity: 15 },
  { id: 'orange', name: 'Orange', hex: '#ea580c', stockQuantity: 20 },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#38bdf8', stockQuantity: 25 },
  { id: 'beige-cream', name: 'Beige / Cream', hex: '#f5ecd7', stockQuantity: 35 }
];
import { ImageUploader } from './ImageUploader';

type EditorTab =
  | 'logo'
  | 'navbar'
  | 'shop'
  | 'versatility'
  | 'about'
  | 'contact'
  | 'footer'
  | 'single-product';

export const PageContentEditor: React.FC = () => {
  const { siteSettings, updateSiteSettings, products, updateProduct } = useStore();
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productSaveSuccess, setProductSaveSuccess] = useState(false);

  useEffect(() => {
    if (!selectedProductId && products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const activeSelectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const [pdpForm, setPdpForm] = useState<any>(null);

  useEffect(() => {
    if (activeSelectedProduct) {
      const gImgs = activeSelectedProduct.galleryImages || [
        activeSelectedProduct.image || '/images/bag-green.png',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85'
      ];
      setPdpForm({
        name: activeSelectedProduct.name,
        categoryLabel: activeSelectedProduct.categoryLabel || 'SUSTAINABLE NON-WOVEN',
        subtitle: activeSelectedProduct.subtitle || '',
        articleNo: activeSelectedProduct.articleNo || `EP-${activeSelectedProduct.id.slice(0, 6).toUpperCase()}`,
        volumeNo: activeSelectedProduct.volumeNo || `${activeSelectedProduct.gsm || 80} GSM LUXURY`,
        rating: activeSelectedProduct.rating !== undefined ? activeSelectedProduct.rating : 4.9,
        brandName: activeSelectedProduct.brandName || 'ECOTEX INC.',
        pricePerUnit: activeSelectedProduct.pricePerUnit || 59.99,
        originalPrice: activeSelectedProduct.originalPrice || Math.round((activeSelectedProduct.pricePerUnit || 59.99) * 1.25 * 100) / 100,
        retailPricePerUnit: activeSelectedProduct.retailPricePerUnit !== undefined && activeSelectedProduct.retailPricePerUnit > 0 ? activeSelectedProduct.retailPricePerUnit : Math.round((activeSelectedProduct.pricePerUnit || 59.99) * 1.45 * 100) / 100,
        retailOriginalPrice: activeSelectedProduct.retailOriginalPrice !== undefined && activeSelectedProduct.retailOriginalPrice > 0 ? activeSelectedProduct.retailOriginalPrice : Math.round((activeSelectedProduct.retailPricePerUnit || (activeSelectedProduct.pricePerUnit || 59.99) * 1.45) * 1.25 * 100) / 100,
        retailQuantity: activeSelectedProduct.retailQuantity || 15,
        retailMinBoxes: activeSelectedProduct.retailQuantity || 15,
        retailMaxBoxes: activeSelectedProduct.retailQuantity || 15,
        pcsPerBox: activeSelectedProduct.pcsPerBox || 200,
        wholesaleMoq: activeSelectedProduct.wholesaleMinBoxes || activeSelectedProduct.wholesaleMoq || 5,
        wholesaleMinBoxes: activeSelectedProduct.wholesaleMinBoxes || activeSelectedProduct.wholesaleMoq || 5,
        wholesaleMaxBoxes: activeSelectedProduct.wholesaleMaxBoxes,
        stockQuantity: activeSelectedProduct.stockQuantity !== undefined ? activeSelectedProduct.stockQuantity : 50,
        availableColors: (activeSelectedProduct.availableColors && activeSelectedProduct.availableColors.length > 0)
          ? activeSelectedProduct.availableColors.map((c, i) => ({
              id: c.id || ('col-' + i),
              name: c.name,
              hex: c.hex || '#166534',
              stockQuantity: c.stockQuantity !== undefined 
                ? c.stockQuantity 
                : (c.id && activeSelectedProduct.colorStock ? activeSelectedProduct.colorStock[c.id] : undefined) ?? (activeSelectedProduct.colorStock ? activeSelectedProduct.colorStock[c.name.toLowerCase()] : undefined) ?? 25
            }))
          : DEFAULT_PALETTE.map(c => ({
              ...c,
              stockQuantity: (c.id && activeSelectedProduct.colorStock ? (activeSelectedProduct.colorStock as any)[c.id] : undefined) ?? c.stockQuantity
            })),
        colorStock: activeSelectedProduct.colorStock && Object.keys(activeSelectedProduct.colorStock).length > 0 ? { ...activeSelectedProduct.colorStock } : {
          'white': 25,
          'black': 50,
          'royal-blue': 30,
          'red': 20,
          'dark-green': 50,
          'navy-blue': 40,
          'yellow': 15,
          'orange': 20,
          'sky-blue': 25,
          'beige-cream': 35
        },
        inStock: activeSelectedProduct.inStock !== false,
        gallery0: gImgs[0] || activeSelectedProduct.image || '/images/bag-green.png',
        gallery1: gImgs[1] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
        gallery2: gImgs[2] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
        gallery3: gImgs[3] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
        fabricDetails: activeSelectedProduct.fabricDetails || `${activeSelectedProduct.gsm || 80} GSM Virgin Non-Woven Polypropylene`,
        dimensions: activeSelectedProduct.dimensions || '11.5\"W x 21\"H x 6.5\" Gusset',
        handles: activeSelectedProduct.handles || 'Ultrasonic Thermal Welded Loops',
        printingMethod: activeSelectedProduct.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint',
        compliance: activeSelectedProduct.compliance || 'Certified California SB 270 & ASTM D6400',
        packingDetails: activeSelectedProduct.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons',
        guaranteedFabric: activeSelectedProduct.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene',
        enrouteQuality: activeSelectedProduct.enrouteQuality || 'Enroute to Quality Standard',
        bestFor: activeSelectedProduct.bestFor || 'Supermarket grocers, retail boutiques',
        recommendedPrint: activeSelectedProduct.recommendedPrint || 'High-Precision Flexographic Custom Imprint',
        description: activeSelectedProduct.description || '',
        trustBadge1: activeSelectedProduct.trustBadge1 || 'Fast Delivery',
        trustBadge2: activeSelectedProduct.trustBadge2 || 'Secure Store',
        trustBadge3: activeSelectedProduct.trustBadge3 || 'Easy Return',
        retailPolicyText: activeSelectedProduct.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
        wholesalePolicyText: activeSelectedProduct.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
        outOfStockNotice: activeSelectedProduct.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
        checkoutButtonText: activeSelectedProduct.checkoutButtonText || '→ Express Checkout',
        outOfStockButtonText: activeSelectedProduct.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
        retailTabLabel: activeSelectedProduct.retailTabLabel || 'Retail Order',
        wholesaleTabLabel: activeSelectedProduct.wholesaleTabLabel || 'Wholesale Order',
        specsHeading: activeSelectedProduct.specsHeading || 'Description',
        relatedTag: activeSelectedProduct.relatedTag || 'Explore More Options',
        relatedTitle: activeSelectedProduct.relatedTitle || 'Related Products',
        relatedSubtitle: activeSelectedProduct.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
        relatedBackBtnText: activeSelectedProduct.relatedBackBtnText || 'View Full Catalog'
      });
    }
  }, [activeSelectedProduct]);

  const handleSavePdpForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelectedProduct || !pdpForm) return;

    const finalStock = Math.max(0, Number(pdpForm.stockQuantity) || 0);
    const finalInStock = pdpForm.inStock && finalStock > 0;
    const finalGallery = [
      pdpForm.gallery0?.trim(),
      pdpForm.gallery1?.trim(),
      pdpForm.gallery2?.trim(),
      pdpForm.gallery3?.trim()
    ].filter(Boolean);

    updateProduct(activeSelectedProduct.id, {
      name: pdpForm.name.trim(),
      categoryLabel: pdpForm.categoryLabel.trim(),
      subtitle: pdpForm.subtitle.trim(),
      articleNo: pdpForm.articleNo.trim(),
      volumeNo: pdpForm.volumeNo.trim(),
      rating: Number(pdpForm.rating) || 4.9,
      brandName: pdpForm.brandName.trim(),
      pricePerUnit: Math.max(0.01, Number(pdpForm.pricePerUnit) || 59.99),
      originalPrice: Math.max(0.01, Number(pdpForm.originalPrice) || 74.99),
      retailPricePerUnit: Math.max(0.01, Number(pdpForm.retailPricePerUnit) || 86.99),
      retailOriginalPrice: Math.max(0.01, Number(pdpForm.retailOriginalPrice) || 108.73),
      retailQuantity: Math.max(1, Number(pdpForm.retailQuantity) || 15),
      retailMinBoxes: Math.max(1, Number(pdpForm.retailQuantity) || 15),
      retailMaxBoxes: Math.max(1, Number(pdpForm.retailQuantity) || 15),
      pcsPerBox: Math.max(1, Number(pdpForm.pcsPerBox) || 200),
      wholesaleMoq: Math.max(1, Number(pdpForm.wholesaleMoq || pdpForm.wholesaleMinBoxes) || 5),
      wholesaleMinBoxes: Math.max(1, Number(pdpForm.wholesaleMinBoxes || pdpForm.wholesaleMoq) || 5),
      wholesaleMaxBoxes: pdpForm.wholesaleMaxBoxes ? Math.max(1, Number(pdpForm.wholesaleMaxBoxes)) : undefined,
      stockQuantity: finalStock,
      availableColors: (pdpForm.availableColors || []).map((c: any) => ({
        id: c.id || ('col-' + Math.random().toString(36).substring(2, 7)),
        name: (c.name || '').trim() || 'Custom Color',
        hex: c.hex || '#166534',
        stockQuantity: Math.max(0, Number(c.stockQuantity) || 0)
      })),
      colorStock: (pdpForm.availableColors || []).reduce((acc: any, c: any) => {
        const stock = Math.max(0, Number(c.stockQuantity) || 0);
        const key = c.id || c.name.toLowerCase().replace(/\s+/g, '-');
        return { ...acc, [key]: stock, [c.name.toLowerCase()]: stock };
      }, {} as Record<string, number>),
      inStock: finalInStock,
      image: pdpForm.gallery0?.trim() || activeSelectedProduct.image || '/images/bag-green.png',
      galleryImages: finalGallery,
      fabricDetails: pdpForm.fabricDetails.trim(),
      dimensions: pdpForm.dimensions.trim(),
      handles: pdpForm.handles.trim(),
      printingMethod: pdpForm.printingMethod.trim(),
      compliance: pdpForm.compliance.trim(),
      packingDetails: pdpForm.packingDetails.trim(),
      guaranteedFabric: pdpForm.guaranteedFabric.trim(),
      enrouteQuality: pdpForm.enrouteQuality.trim(),
      bestFor: pdpForm.bestFor.trim(),
      recommendedPrint: pdpForm.recommendedPrint.trim(),
      description: pdpForm.description.trim(),
      trustBadge1: pdpForm.trustBadge1.trim(),
      trustBadge2: pdpForm.trustBadge2.trim(),
      trustBadge3: pdpForm.trustBadge3.trim(),
      retailPolicyText: pdpForm.retailPolicyText.trim(),
      wholesalePolicyText: pdpForm.wholesalePolicyText.trim(),
      outOfStockNotice: pdpForm.outOfStockNotice.trim(),
      checkoutButtonText: (pdpForm.checkoutButtonText || '').trim(),
      outOfStockButtonText: (pdpForm.outOfStockButtonText || '').trim(),
      retailTabLabel: (pdpForm.retailTabLabel || '').trim(),
      wholesaleTabLabel: (pdpForm.wholesaleTabLabel || '').trim(),
      specsHeading: (pdpForm.specsHeading || '').trim(),
      relatedTag: (pdpForm.relatedTag || '').trim(),
      relatedTitle: (pdpForm.relatedTitle || '').trim(),
      relatedSubtitle: (pdpForm.relatedSubtitle || '').trim(),
      relatedBackBtnText: (pdpForm.relatedBackBtnText || '').trim()
    });

    setProductSaveSuccess(true);
    setTimeout(() => setProductSaveSuccess(false), 3000);
  };
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [activeTab, setActiveTab] = useState<EditorTab>('logo');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isInitialized = React.useRef(false);
  useEffect(() => {
    if (!isInitialized.current && siteSettings && Object.keys(siteSettings).length > 0) {
      setFormData(siteSettings);
      isInitialized.current = true;
    }
  }, [siteSettings]);

  const hasUnpublishedChanges = JSON.stringify(formData) !== JSON.stringify(siteSettings);

  const handleDiscardDraft = () => {
    setFormData(siteSettings);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await apiService.updateSettings(formData);
      updateSiteSettings(updated || formData);
      window.dispatchEvent(new CustomEvent('ecotex_homepage_updated', {
        detail: { settings: updated || formData }
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      updateSiteSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: EditorTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'logo', label: 'Logo & Brand', icon: Recycle, desc: 'Visual identity & favicon' },
    { id: 'navbar', label: 'Navbar & Banner', icon: Megaphone, desc: 'Header bar & CTA' },
    { id: 'versatility', label: 'Versatility & Cards', icon: Layers, desc: 'Feature value cards' },
    { id: 'about', label: 'About Us & Team', icon: Users, desc: 'Company story & leadership' },
    { id: 'contact', label: 'Contact & Facilities', icon: Phone, desc: 'Locations & sales lines' },
    { id: 'shop', label: 'Homepage Shop & Banners', icon: Tag, desc: 'Hero banner, trust bar & headings' },
    { id: 'footer', label: 'Footer & Legal', icon: Globe, desc: 'Links, copyright & badges' },
    { id: 'single-product', label: 'Single Product Page', icon: Package, desc: 'Specs, gallery & policies' },
  ];

  return (
    <div className="space-y-6 animate-fadeInUp pb-16 font-sans">

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#B2E2C5]/40 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              100% Dynamic Storefront Studio
            </span>
            {hasUnpublishedChanges ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unpublished Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Published & Live
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            Universal Content & Image CMS
          </h2>
          <p className="text-xs text-slate-500">
            Import images directly from your computer without URLs. Customize text, metrics, and cards across all components in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {hasUnpublishedChanges && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="flex-1 sm:flex-initial justify-center inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer"
              title="Discard unsaved changes and restore current live content"
            >
              <span>Discard Changes</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            className={`w-full sm:w-auto shrink-0 whitespace-nowrap justify-center inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              hasUnpublishedChanges
                ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-emerald-600/30 ring-2 ring-[#4ade80]/50 animate-pulse'
                : 'bg-[#4E9F76] hover:bg-[#86C59E] text-white shadow-[#4E9F76]/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#B2E2C5] shrink-0" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left Sticky Vertical Sidebar + Right Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Vertical Navigation Sidebar */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-6 space-y-3">
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#B2E2C5]/50 shadow-xs">
            <div className="px-3 py-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  CMS Navigation
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Storefront Sections
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#166534] bg-emerald-100/80 border border-emerald-300/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                {tabs.length} Tabs
              </span>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-thin">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-w-[190px] lg:w-full text-left border group ${
                      isActive
                        ? 'bg-[#166534] text-white border-[#166534] shadow-md shadow-[#166534]/20 lg:translate-x-1 font-extrabold'
                        : 'bg-white text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-2xs' 
                        : 'bg-slate-100 text-slate-500 group-hover:bg-[#B2E2C5]/30 group-hover:text-[#166534]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1 min-w-0">
                      <span className="block truncate font-bold text-xs">{tab.label}</span>
                      <span className={`block text-[10px] font-normal truncate mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {tab.desc}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-6 rounded-full bg-white shrink-0 hidden lg:block" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0 w-full bg-white rounded-3xl p-4 sm:p-8 border border-[#B2E2C5]/40 shadow-xs">

          {/* Active Section Context Header */}
          {(() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            const TabIcon = currentTab?.icon || FileText;
            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <TabIcon className="w-5 h-5 text-[#4E9F76]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#166534] bg-emerald-100/90 border border-emerald-300/60 px-2 py-0.5 rounded-md">
                        Section Editor
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">· Live Real-Time Storefront Sync</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#0f172a] mt-0.5">
                      {currentTab?.label}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSave()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Save className="w-3.5 h-3.5 shrink-0" />
                    <span>Save {currentTab?.label.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })()}

        {/* ========================================================
            TAB 1: LOGO & BRAND IDENTITY
           ======================================================== */}
        {activeTab === 'logo' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                  Logo & Visual Brand Identity
                </h3>
                <p className="text-xs text-slate-500">
                  Controls the primary navigation logo, mobile drawer logo, and footer brand mark.
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-[#F4F9F5] border border-[#B2E2C5]/40 flex items-center gap-3 min-h-[56px]">
                {formData.logoConfig?.customLogoUrl ? (
                  <img
                    src={formData.logoConfig.customLogoUrl}
                    alt="Custom Brand Logo"
                    className="h-10 sm:h-12 w-auto max-w-[220px] object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4E9F76] text-white flex items-center justify-center font-black shadow-xs">
                      <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-base font-black tracking-tight text-[#0f172a] leading-none block">
                        {formData.logoConfig?.wordmarkPrefix || 'ECO'}
                        <span className="text-[#4E9F76]">{formData.logoConfig?.wordmarkSuffix || 'TEX'}</span>{' '}
                        <span className="text-[#B2E2C5]">{formData.logoConfig?.badgeText || 'INC.'}</span>
                      </span>
                      <span className="text-[8px] font-bold tracking-[0.16em] uppercase text-slate-400 block mt-0.5">
                        {formData.logoConfig?.subtitle || 'SUSTAINABLE PACKAGING'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Image File Import for Official Brand Logo */}
            <div>
              <ImageUploader
                label="Official Company Brand Logo"
                description="Upload your high-resolution company SVG, PNG, or WebP logo. Automatically synchronizes across the Header Navbar, Footer, and Cart Modal."
                value={formData.logoConfig?.customLogoUrl || ''}
                onChange={(newUrl) => {
                  const updatedLogoConfig = { ...(formData.logoConfig || {}), customLogoUrl: newUrl };
                  setFormData(prev => ({ ...prev, logoConfig: updatedLogoConfig }));
                }}
                aspectRatio="banner"
              />
            </div>

            {/* Browser Tab Favicon Section */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wider">
                    Browser Tab Favicon (Site Icon)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    The small icon shown on browser tabs, bookmarks, and shortcuts. Recommended format: Square SVG, PNG, or ICO.
                  </p>
                </div>

                {/* Live Mock Browser Tab Preview */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-t-xl bg-slate-100 border border-slate-200 border-b-0 text-[11px] text-slate-700 font-medium shadow-2xs self-start sm:self-auto">
                  {formData.logoConfig?.faviconUrl ? (
                    <img
                      src={formData.logoConfig.faviconUrl}
                      alt="Favicon preview"
                      className="w-4 h-4 object-contain rounded-xs"
                    />
                  ) : formData.logoConfig?.customLogoUrl ? (
                    <img
                      src={formData.logoConfig.customLogoUrl}
                      alt="Favicon fallback"
                      className="w-4 h-4 object-contain rounded-xs"
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#4E9F76] flex items-center justify-center text-white text-[8px] font-bold">
                      E
                    </div>
                  )}
                  <span className="truncate max-w-[130px] font-sans">Ecotex Inc. · Packaging</span>
                </div>
              </div>

              <ImageUploader
                label="Upload Favicon File (Square 1:1)"
                description="Upload square icon file directly from your computer (SVG, PNG, ICO, WebP)."
                value={formData.logoConfig?.faviconUrl || ''}
                onChange={(newUrl) => {
                  const updatedLogoConfig = { ...(formData.logoConfig || {}), faviconUrl: newUrl };
                  setFormData(prev => ({ ...prev, logoConfig: updatedLogoConfig }));
                }}
                aspectRatio="square"
              />
            </div>

            {/* Direct Save Logo & Brand Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F4F9F5] p-4 rounded-2xl border border-[#B2E2C5]/50">
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4E9F76]" />
                <span>Logo & visual identity updates automatically save and synchronize live.</span>
              </div>
              <button
                type="button"
                onClick={() => handleSave()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold transition-all shadow-md shadow-[#4E9F76]/20 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#B2E2C5]" />
                    <span>Saved & Live!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Logo & Brand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: NAVBAR & ANNOUNCEMENT BAR
           ======================================================== */}
        {activeTab === 'navbar' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                  Navbar & Top Announcement Bar
                </h3>
                <p className="text-xs text-slate-500">
                  Configure top banner notification, CTA button wording, and telephone display.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={formData.navbarConfig?.announcementActive ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    navbarConfig: { ...formData.navbarConfig!, announcementActive: e.target.checked }
                  })}
                  className="w-4 h-4 text-[#4E9F76] rounded-md focus:ring-[#86C59E]"
                />
                <span className="text-xs font-bold text-slate-700">Display Top Announcement</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Top Announcement Bar Copy
              </label>
              <input
                type="text"
                value={formData.navbarConfig?.announcementText || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  navbarConfig: { ...formData.navbarConfig!, announcementText: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                placeholder="🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Navbar Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.navbarConfig?.ctaButtonText || 'START SHOP'}
                  onChange={(e) => setFormData({
                    ...formData,
                    navbarConfig: { ...formData.navbarConfig!, ctaButtonText: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] focus:outline-none focus:border-[#86C59E]"
                  placeholder="e.g. START SHOP or REQUEST SAMPLE"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Header Phone Number Display
                </label>
                <input
                  type="text"
                  value={formData.navbarConfig?.phoneDisplay || '(951) 555-ECOTEX'}
                  onChange={(e) => setFormData({
                    ...formData,
                    navbarConfig: { ...formData.navbarConfig!, phoneDisplay: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                  placeholder="(951) 555-ECOTEX"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: VERSATILITY & VALUE CARDS
           ======================================================== */}
        {activeTab === 'versatility' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                Versatility & Value Cards Section
              </h3>
              <p className="text-xs text-slate-500">
                Customize the Sustainable Fashion section, the 4 value feature cards, the large photographic editorial banner, and bottom trust badges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Sustainable Fashion Section Headline
                </label>
                <input
                  type="text"
                  value={formData.versatilityConfig?.sustainableFashionTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    versatilityConfig: { ...formData.versatilityConfig!, sustainableFashionTitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Sustainable Fashion Subtitle
                </label>
                <input
                  type="text"
                  value={formData.versatilityConfig?.sustainableFashionSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    versatilityConfig: { ...formData.versatilityConfig!, sustainableFashionSubtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* 4 Feature Cards */}
            <div>
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider mb-3">
                4 Value Proposition Cards
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.versatilityConfig?.featureCards || []).map((card, idx) => (
                  <div key={card.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] font-bold text-[#4E9F76] uppercase tracking-wider block">
                      Card #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...formData.versatilityConfig!.featureCards];
                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                        setFormData({
                          ...formData,
                          versatilityConfig: { ...formData.versatilityConfig!, featureCards: newCards }
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="Title"
                    />
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const newCards = [...formData.versatilityConfig!.featureCards];
                        newCards[idx] = { ...newCards[idx], description: e.target.value };
                        setFormData({
                          ...formData,
                          versatilityConfig: { ...formData.versatilityConfig!, featureCards: newCards }
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Big Editorial Banner */}
            <div className="p-5 rounded-2xl bg-[#F4F9F5] border border-[#B2E2C5]/40 space-y-4">
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider">
                Big Editorial Banner
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={formData.versatilityConfig?.bannerTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      versatilityConfig: { ...formData.versatilityConfig!, bannerTitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Banner Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.versatilityConfig?.bannerSubtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      versatilityConfig: { ...formData.versatilityConfig!, bannerSubtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Banner Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.versatilityConfig?.bannerButtonText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      versatilityConfig: { ...formData.versatilityConfig!, bannerButtonText: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#4E9F76] bg-white focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

              {/* Direct File Import for Big Banner Background */}
              <div className="pt-2">
                <ImageUploader
                  label="Editorial Banner Background Image"
                  description="Import high-resolution lifestyle packaging photo from your computer."
                  value={formData.versatilityConfig?.bannerImage || ''}
                  onChange={(newUrl) => setFormData({
                    ...formData,
                    versatilityConfig: { ...formData.versatilityConfig!, bannerImage: newUrl }
                  })}
                  aspectRatio="wide"
                />
              </div>
            </div>

            {/* Bottom Trust Badges */}
            <div>
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider mb-2">
                4 Bottom Trust Badges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {(formData.versatilityConfig?.bottomTrustBadges || []).map((badge, idx) => (
                  <div key={idx}>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Badge #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => {
                        const newBadges = [...formData.versatilityConfig!.bottomTrustBadges];
                        newBadges[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          versatilityConfig: { ...formData.versatilityConfig!, bottomTrustBadges: newBadges }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ABOUT US & LEADERSHIP TEAM
           ======================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                About Us, Corporate Narrative & Leadership Team
              </h3>
              <p className="text-xs text-slate-500">
                Import real photos directly for the hero background, founder portrait, factory floor, and team profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={formData.aboutConfig?.heroTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, heroTitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={formData.aboutConfig?.heroSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, heroSubtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Direct Image File Import for About Hero Background */}
            <ImageUploader
              label="About Us Page Hero Background Photo"
              description="Import high-resolution facility / executive background image."
              value={formData.aboutConfig?.heroBgImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85'}
              onChange={(newUrl) => setFormData({
                ...formData,
                aboutConfig: { ...formData.aboutConfig!, heroBgImage: newUrl }
              })}
              aspectRatio="wide"
            />

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Executive Mission Quote
              </label>
              <textarea
                rows={2}
                value={formData.aboutConfig?.missionQuote || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aboutConfig: { ...formData.aboutConfig!, missionQuote: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Story Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutConfig?.storyParagraph1 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, storyParagraph1: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Story Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutConfig?.storyParagraph2 || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    aboutConfig: { ...formData.aboutConfig!, storyParagraph2: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Direct Image File Import for Founder Portrait and Workshop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <ImageUploader
                label="Founder Portrait Photo (Rashid Mahmood)"
                description="Import official founder executive portrait from your computer."
                value={formData.aboutConfig?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85'}
                onChange={(newUrl) => setFormData({
                  ...formData,
                  aboutConfig: { ...formData.aboutConfig!, founderImage: newUrl }
                })}
                aspectRatio="portrait"
              />

              <ImageUploader
                label="Engineering Workshop & Testing Laboratory Photo"
                description="Import manufacturing inspection photo from your computer."
                value={formData.aboutConfig?.workshopImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85'}
                onChange={(newUrl) => setFormData({
                  ...formData,
                  aboutConfig: { ...formData.aboutConfig!, workshopImage: newUrl }
                })}
                aspectRatio="wide"
              />
            </div>

            {/* Team Members List */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider">
                    Executive Leadership Team Roster
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Add or update leadership cards displayed on the About Us page with direct photo uploads.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newMember: TeamMemberConfig = {
                      id: `tm-${Date.now()}`,
                      name: 'New Executive',
                      role: 'Vice President of Production',
                      bio: 'Experienced supply chain executive dedicated to sustainable industrial packaging.',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
                      email: 'team@ecotexinc.com',
                      linkedin: '#'
                    };
                    const updatedMembers = [...(formData.aboutConfig?.teamMembers || []), newMember];
                    setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig!, teamMembers: updatedMembers }
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4E9F76]/10 hover:bg-[#4E9F76]/20 text-[#4E9F76] text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-6">
                {(formData.aboutConfig?.teamMembers || []).map((member, idx) => (
                  <div key={member.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-[#4E9F76]">
                        Member #{idx + 1}: {member.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.aboutConfig!.teamMembers.filter((_, i) => i !== idx);
                          setFormData({
                            ...formData,
                            aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      <div className="lg:col-span-4">
                        <ImageUploader
                          label="Profile Headshot Photo"
                          value={member.image}
                          onChange={(newUrl) => {
                            const updated = [...formData.aboutConfig!.teamMembers];
                            updated[idx] = { ...updated[idx], image: newUrl };
                            setFormData({
                              ...formData,
                              aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                            });
                          }}
                          aspectRatio="portrait"
                        />
                      </div>

                      <div className="lg:col-span-8 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], role: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio</label>
                          <textarea
                            rows={2}
                            value={member.bio}
                            onChange={(e) => {
                              const updated = [...formData.aboutConfig!.teamMembers];
                              updated[idx] = { ...updated[idx], bio: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                            <input
                              type="text"
                              value={member.email}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], email: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                            <input
                              type="text"
                              value={member.linkedin}
                              onChange={(e) => {
                                const updated = [...formData.aboutConfig!.teamMembers];
                                updated[idx] = { ...updated[idx], linkedin: e.target.value };
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig!, teamMembers: updated }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: CORPORATE CONTACT & FACILITIES
           ======================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                Corporate Contact & Manufacturing Facilities
              </h3>
              <p className="text-xs text-slate-500">
                Live telephone numbers, facility locations, and social media URLs across the application.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Contact Page Headline
              </label>
              <input
                type="text"
                value={formData.contactConfig?.headline || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contactConfig: { ...formData.contactConfig!, headline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Primary Corporate Phone
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.phone || formData.phone || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    phone: e.target.value,
                    contactConfig: { ...formData.contactConfig!, phone: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Secondary Logistics Hotline
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.secondaryPhone || formData.secondaryPhone || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    secondaryPhone: e.target.value,
                    contactConfig: { ...formData.contactConfig!, secondaryPhone: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Orders & Procurement Email
                </label>
                <input
                  type="email"
                  value={formData.contactConfig?.email || formData.email || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    email: e.target.value,
                    contactConfig: { ...formData.contactConfig!, email: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  US Distribution Facility (Corona, CA)
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.facilityAddress || formData.facilityAddress || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    facilityAddress: e.target.value,
                    contactConfig: { ...formData.contactConfig!, facilityAddress: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Primary Manufacturing Mill Plant
                </label>
                <input
                  type="text"
                  value={formData.contactConfig?.plantAddress || formData.plantAddress || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    plantAddress: e.target.value,
                    contactConfig: { ...formData.contactConfig!, plantAddress: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-xs font-black text-[#4E9F76] uppercase tracking-wider mb-3">
                Social Media URLs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.linkedinUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, linkedinUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.facebookUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, facebookUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.instagramUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, instagramUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={formData.contactConfig?.twitterUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig!, twitterUrl: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: HOMEPAGE SHOP & BANNERS
           ======================================================== */}
        {activeTab === 'shop' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. Shop Hero Panoramic Banner */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#d97706]" />
                <span>Shop Page Top Hero Banner & Podium</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pill Badge Text</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerBadge || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerBadge: e.target.value }
                    })}
                    placeholder="LIMITED TIME ONLY"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Floating Discount Badge</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerDiscountBadge || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerDiscountBadge: e.target.value }
                    })}
                    placeholder="UP TO 50% OFF"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Headline (Supports line break with \n)</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerTitle: e.target.value }
                    })}
                    placeholder="Shop More,\nSave More!"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.heroBannerBtnText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, heroBannerBtnText: e.target.value }
                    })}
                    placeholder="EXPLORE COLLECTION"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.shopConfig?.heroBannerSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    shopConfig: { ...formData.shopConfig!, heroBannerSubtitle: e.target.value }
                  })}
                  placeholder="Discover amazing deals on your favorite sustainable products..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                />
              </div>

              <ImageUploader
                label="Shop Hero Podium Showcase Image"
                description="Upload custom photography for the shop hero podium."
                value={formData.shopConfig?.heroBannerImage || '/images/shop-hero-podium.jpg'}
                onChange={(newUrl) => setFormData({
                  ...formData,
                  shopConfig: { ...formData.shopConfig!, heroBannerImage: newUrl }
                })}
                aspectRatio="wide"
              />

              {/* 3 Value Props */}
              <div className="pt-2 border-t border-slate-200/60">
                <label className="block text-xs font-bold text-slate-800 mb-2">3 Value Proposition Badges</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badge 1</span>
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp1Title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp1Title: e.target.value }
                      })}
                      placeholder="Best Prices"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp1Subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp1Subtitle: e.target.value }
                      })}
                      placeholder="Guaranteed"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badge 2</span>
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp2Title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp2Title: e.target.value }
                      })}
                      placeholder="Secure"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp2Subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp2Subtitle: e.target.value }
                      })}
                      placeholder="Payments"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badge 3</span>
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp3Title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp3Title: e.target.value }
                      })}
                      placeholder="Fast Delivery"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.shopConfig?.valueProp3Subtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, valueProp3Subtitle: e.target.value }
                      })}
                      placeholder="Worldwide"
                      className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 4-Item Trust Bar Strip */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4-Item Trust Propositions Bar</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 1 (Truck)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar1Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar1Title: e.target.value }
                    })}
                    placeholder="Free Shipping"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar1Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar1Subtitle: e.target.value }
                    })}
                    placeholder="On orders over $75"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 2 (Returns)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar2Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar2Title: e.target.value }
                    })}
                    placeholder="Easy Returns"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar2Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar2Subtitle: e.target.value }
                    })}
                    placeholder="30-day returns"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 3 (Quality)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar3Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar3Title: e.target.value }
                    })}
                    placeholder="Premium Quality"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar3Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar3Subtitle: e.target.value }
                    })}
                    placeholder="100% original products"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Item 4 (Support)</span>
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar4Title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar4Title: e.target.value }
                    })}
                    placeholder="24/7 Support"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.shopConfig?.trustBar4Subtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, trustBar4Subtitle: e.target.value }
                    })}
                    placeholder="We're here to help"
                    className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Section Titles & Buttons */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#d97706]" />
                <span>Section Headers, Catalog Titles & Buttons</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categories Section Title</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.categoriesHeading || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, categoriesHeading: e.target.value }
                    })}
                    placeholder="Shop By Category"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categories Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.categoriesSubheading || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, categoriesSubheading: e.target.value }
                    })}
                    placeholder="Explore our full range of certified industrial & retail packaging collections."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Arrivals Title</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.newArrivalsHeading || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, newArrivalsHeading: e.target.value }
                    })}
                    placeholder="New Arrivals"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Arrivals View All Button</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.newArrivalsBtnText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, newArrivalsBtnText: e.target.value }
                    })}
                    placeholder="View All"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#FF5722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Catalog Title</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.catalogTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, catalogTitle: e.target.value }
                    })}
                    placeholder="Full Manufacturing & Retail Catalog"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Catalog Subtitle</label>
                  <input
                    type="text"
                    value={formData.shopConfig?.catalogSubtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      shopConfig: { ...formData.shopConfig!, catalogSubtitle: e.target.value }
                    })}
                    placeholder="Explore our full manufacturing catalog with wholesale pricing tiers."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 7: FOOTER & LEGAL
           ======================================================== */}
        {activeTab === 'footer' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                Footer, Newsletter Banner & Legal Copy
              </h3>
              <p className="text-xs text-slate-500">
                Customise the bottom newsletter strip, background image, footer brand tagline, and copyright notice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Newsletter Banner Title
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    footerConfig: { ...formData.footerConfig!, newsletterTitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Newsletter Subtitle
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterSubtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    footerConfig: { ...formData.footerConfig!, newsletterSubtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                />
              </div>
            </div>

            {/* Direct Image File Import for Newsletter Background */}
            <ImageUploader
              label="Quarterly Newsletter Background Photo"
              description="Import high-contrast background photo from your computer."
              value={formData.footerConfig?.newsletterBgImage || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80'}
              onChange={(newUrl) => setFormData({
                ...formData,
                footerConfig: { ...formData.footerConfig!, newsletterBgImage: newUrl }
              })}
              aspectRatio="wide"
            />

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Footer Brand Sub-tagline
              </label>
              <input
                type="text"
                value={formData.footerConfig?.tagline || formData.footerTagline || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  footerTagline: e.target.value,
                  footerConfig: { ...formData.footerConfig!, tagline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1">
                Legal Copyright Notice
              </label>
              <input
                type="text"
                value={formData.footerConfig?.copyrightNotice || formData.copyrightNotice || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  copyrightNotice: e.target.value,
                  footerConfig: { ...formData.footerConfig!, copyrightNotice: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
              />
            </div>
          </div>
        )}

        {/* TAB 7: SINGLE PRODUCT PAGE EDITOR */}
        {activeTab === 'single-product' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Banner & Product Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#d97706]" />
                  <span>Single Product Page Content Customizer</span>
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Select any wholesale product from your catalog to customize its single product page specifications, 4-photo gallery, badges, and policies.
                </p>
              </div>

              {/* Product Selector Dropdown */}
              <div className="w-full sm:w-72 shrink-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                  Active Product:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.articleNo || p.id.slice(0, 6).toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {pdpForm && (
              <form onSubmit={handleSavePdpForm} className="space-y-5">
                
                {/* 1. Basic Metadata */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#d97706]" />
                      <span>1. Headline, Article & Brand Metadata</span>
                    </h5>
                    <span className="text-[11px] font-mono text-slate-400">ID: {activeSelectedProduct.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={pdpForm.name}
                        onChange={(e) => setPdpForm({ ...pdpForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category Label</label>
                      <input
                        type="text"
                        value={pdpForm.categoryLabel}
                        onChange={(e) => setPdpForm({ ...pdpForm, categoryLabel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="SUSTAINABLE NON-WOVEN"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Customer Rating (Stars)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1.0"
                        max="5.0"
                        value={pdpForm.rating}
                        onChange={(e) => setPdpForm({ ...pdpForm, rating: parseFloat(e.target.value) || 4.9 })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Article No.</label>
                      <input
                        type="text"
                        value={pdpForm.articleNo}
                        onChange={(e) => setPdpForm({ ...pdpForm, articleNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                        placeholder="EP-NW-3040"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Volume No.</label>
                      <input
                        type="text"
                        value={pdpForm.volumeNo}
                        onChange={(e) => setPdpForm({ ...pdpForm, volumeNo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
                        placeholder="80 GSM LUXURY"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. 4-Thumbnail Gallery */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#d97706]" />
                    <span>2. 4-Photo Gallery Strip</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((slotIdx) => {
                      const key = `gallery${slotIdx}`;
                      const val = pdpForm[key] || '';
                      return (
                        <div key={slotIdx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>{slotIdx === 0 ? 'Slot 1 (Main Hero)' : `Slot ${slotIdx + 1} (Thumbnail)`}</span>
                          </div>
                          <ImageUploader
                            label=""
                            value={val}
                            onChange={(url) => setPdpForm({ ...pdpForm, [key]: url })}
                            aspectRatio="portrait"
                            placeholderText="Upload photo from computer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Pricing & Order Modes (Wholesale vs Retail Configuration) */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#d97706]" />
                      <span>3. Pricing & Order Modes (Wholesale & Retail Settings)</span>
                    </h5>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-700">1 Box =</span>
                      <input
                        type="number"
                        min="1"
                        step="10"
                        value={pdpForm.pcsPerBox || 200}
                        onChange={(e) => setPdpForm({ ...pdpForm, pcsPerBox: Math.max(1, parseInt(e.target.value) || 200) })}
                        className="w-16 px-1.5 py-0.5 text-center text-xs font-mono font-bold text-emerald-950 border border-slate-200 rounded-md bg-slate-50"
                      />
                      <span className="text-[10px] font-bold text-slate-500">Pcs</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Wholesale Mode Box */}
                    <div className="bg-emerald-50/40 p-4 rounded-xl border-2 border-emerald-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          <strong className="text-xs font-extrabold uppercase text-[#166534]">
                            Wholesale Order Mode
                          </strong>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          MOQ: {pdpForm.wholesaleMoq || 5} Boxes{pdpForm.wholesaleMaxBoxes ? ' · Max: ' + pdpForm.wholesaleMaxBoxes + ' Boxes' : ''}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-emerald-900 mb-1">Box Price ($)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={pdpForm.pricePerUnit}
                              onChange={(e) => setPdpForm({ ...pdpForm, pricePerUnit: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-emerald-300 text-xs font-bold text-[#166534] bg-white focus:outline-none focus:border-emerald-600"
                              placeholder="59.99"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 mt-1 block">
                            ≈ ${( (pdpForm.pricePerUnit || 0) / (pdpForm.pcsPerBox || 200) ).toFixed(3)} / pc
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Original Price ($)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={pdpForm.originalPrice}
                              onChange={(e) => setPdpForm({ ...pdpForm, originalPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 bg-white"
                              placeholder="74.99"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Compare-At Strike</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale MOQ (Boxes)</label>
                          <input
                            type="number"
                            min="1"
                            value={pdpForm.wholesaleMoq}
                            onChange={(e) => setPdpForm({ ...pdpForm, wholesaleMoq: Math.max(1, parseInt(e.target.value) || 5) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tab Button Label</label>
                          <input
                            type="text"
                            value={pdpForm.wholesaleTabLabel || ''}
                            onChange={(e) => setPdpForm({ ...pdpForm, wholesaleTabLabel: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-white"
                            placeholder="Wholesale Order"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Policy Notice</label>
                        <textarea
                          rows={2}
                          value={pdpForm.wholesalePolicyText || ''}
                          onChange={(e) => setPdpForm({ ...pdpForm, wholesalePolicyText: e.target.value })}
                          className="w-full p-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Retail Mode Box */}
                    <div className="bg-amber-50/40 p-4 rounded-xl border-2 border-amber-200 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                          <strong className="text-xs font-extrabold uppercase text-amber-900">
                            Retail Order Mode
                          </strong>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Fixed: {pdpForm.retailQuantity || 15} Boxes
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-amber-950 mb-1">Box Price ($)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={pdpForm.retailPricePerUnit}
                              onChange={(e) => setPdpForm({ ...pdpForm, retailPricePerUnit: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-[#d97706] bg-white focus:outline-none focus:border-amber-600"
                              placeholder="86.99"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-amber-700 mt-1 block">
                            ≈ ${( (pdpForm.retailPricePerUnit || 0) / (pdpForm.pcsPerBox || 200) ).toFixed(3)} / pc
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Original Price ($)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={pdpForm.retailOriginalPrice}
                              onChange={(e) => setPdpForm({ ...pdpForm, retailOriginalPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 bg-white"
                              placeholder="108.73"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Compare-At Strike</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Retail Max Allowed (Boxes)</label>
                          <input
                            type="number"
                            min="1"
                            value={pdpForm.retailMaxBoxes}
                            onChange={(e) => setPdpForm({ ...pdpForm, retailMaxBoxes: Math.max(1, parseInt(e.target.value) || 5) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tab Button Label</label>
                          <input
                            type="text"
                            value={pdpForm.retailTabLabel || ''}
                            onChange={(e) => setPdpForm({ ...pdpForm, retailTabLabel: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-amber-900 bg-white"
                            placeholder="Retail Order"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Retail Policy Notice</label>
                        <textarea
                          rows={2}
                          value={pdpForm.retailPolicyText || ''}
                          onChange={(e) => setPdpForm({ ...pdpForm, retailPolicyText: e.target.value })}
                          className="w-full p-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock Availability */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <strong className="block text-xs font-bold text-slate-800">Master Stock (Boxes)</strong>
                      <span className="text-[11px] text-slate-500">Stock 0 hone pr product automatic Sold Out mark ho jata hai.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={pdpForm.stockQuantity}
                        onChange={(e) => setPdpForm({ ...pdpForm, stockQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-24 px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50"
                      />
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={pdpForm.inStock && (pdpForm.stockQuantity || 0) > 0}
                          onChange={(e) => setPdpForm({ ...pdpForm, inStock: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <span>Active & In Stock</span>
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Color Palette & Stock Inventory Card */}
                  <div className="bg-white p-4.5 rounded-xl border-2 border-emerald-200/90 space-y-3.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                      <div>
                        <strong className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-600" />
                          <span>Dynamic Color Palette & Stock Inventory</span>
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Apni marzi se naye colours add karein, color picker se shade chunein, aur har colour ka stock set karein (jaise Red mein 20 boxes).
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-600">Total:</span>
                        <span className="text-xs font-mono font-bold text-[#166534] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          {(pdpForm.availableColors || []).reduce((acc: number, c: any) => acc + (Number(c.stockQuantity) || 0), 0)} Boxes
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const sum = (pdpForm.availableColors || []).reduce((acc: number, c: any) => acc + (Number(c.stockQuantity) || 0), 0);
                            setPdpForm({ ...pdpForm, stockQuantity: sum, inStock: sum > 0 });
                          }}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                          title="Sync master stock with color sum"
                        >
                          Sync Master
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newId = 'col-' + Date.now();
                            const newColor: ProductColorVariant = {
                              id: newId,
                              name: 'Color ' + ((pdpForm.availableColors || []).length + 1),
                              hex: '#166534',
                              stockQuantity: 20
                            };
                            setPdpForm({
                              ...pdpForm,
                              availableColors: [...(pdpForm.availableColors || []), newColor]
                            });
                          }}
                          className="px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Color</span>
                        </button>
                      </div>
                    </div>

                    {/* Color items list */}
                    {(!pdpForm.availableColors || pdpForm.availableColors.length === 0) ? (
                      <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                        <p className="text-xs text-slate-500">Abhi koi colour add nahi hai.</p>
                        <button
                          type="button"
                          onClick={() => setPdpForm({ ...pdpForm, availableColors: DEFAULT_PALETTE.map(c => ({ ...c })) })}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Standard 10 Colors Load Karein
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {pdpForm.availableColors.map((c: any, index: number) => {
                          const stock = Number(c.stockQuantity) || 0;
                          const isSoldOut = stock <= 0;
                          return (
                            <div
                              key={c.id || index}
                              className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 relative group ${
                                isSoldOut 
                                  ? 'bg-rose-50/40 border-rose-200' 
                                  : 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                              }`}
                            >
                              {/* Top row: Color Picker Swatch & Color Name Input */}
                              <div className="flex items-center gap-2">
                                <label 
                                  className="relative w-6 h-6 rounded-full shrink-0 shadow-2xs border-2 border-slate-300 cursor-pointer overflow-hidden"
                                  style={{ backgroundColor: c.hex }}
                                  title="Click to pick color shade"
                                >
                                  <input
                                    type="color"
                                    value={c.hex}
                                    onChange={(e) => {
                                      const updated = [...pdpForm.availableColors];
                                      updated[index] = { ...updated[index], hex: e.target.value };
                                      setPdpForm({ ...pdpForm, availableColors: updated });
                                    }}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={c.name}
                                  onChange={(e) => {
                                    const updated = [...pdpForm.availableColors];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    setPdpForm({ ...pdpForm, availableColors: updated });
                                  }}
                                  className="w-full text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none bg-transparent"
                                  placeholder="Color Name"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = pdpForm.availableColors.filter((_: any, i: number) => i !== index);
                                    setPdpForm({ ...pdpForm, availableColors: updated });
                                  }}
                                  className="opacity-40 hover:opacity-100 text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer transition-opacity"
                                  title="Delete this color"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Middle row: Hex code & Stock Input */}
                              <div className="flex items-center gap-2">
                                <div className="relative w-20 shrink-0">
                                  <input
                                    type="text"
                                    value={c.hex}
                                    onChange={(e) => {
                                      const updated = [...pdpForm.availableColors];
                                      updated[index] = { ...updated[index], hex: e.target.value };
                                      setPdpForm({ ...pdpForm, availableColors: updated });
                                    }}
                                    className="w-full px-1.5 py-1 text-[10px] font-mono text-slate-600 bg-white border border-slate-200 rounded-lg text-center"
                                    placeholder="#000000"
                                  />
                                </div>

                                <div className="relative flex-1">
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => {
                                      const val = Math.max(0, parseInt(e.target.value) || 0);
                                      const updated = [...pdpForm.availableColors];
                                      updated[index] = { ...updated[index], stockQuantity: val };
                                      setPdpForm({ ...pdpForm, availableColors: updated });
                                    }}
                                    className={`w-full pl-2 pr-7 py-1 text-center font-mono font-bold text-xs rounded-lg border focus:outline-none focus:border-emerald-500 ${
                                      isSoldOut 
                                        ? 'border-rose-300 bg-rose-50/50 text-rose-800' 
                                        : 'border-slate-200 bg-white text-slate-800'
                                    }`}
                                    placeholder="0"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 font-mono">bx</span>
                                </div>
                              </div>

                              {/* Bottom status */}
                              <div className="flex items-center justify-between text-[10px] pt-0.5">
                                <span className="text-slate-400">Status:</span>
                                <strong className={isSoldOut ? 'text-rose-600 font-bold' : 'text-[#166534]'}>
                                  {isSoldOut ? 'Sold Out' : `${stock} Boxes`}
                                </strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>                </div>

                {/* 4. Full Specifications List */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#d97706]" />
                    <span>4. Technical Specifications Table</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• BRAND NAME</label>
                      <input
                        type="text"
                        value={pdpForm.brandName}
                        onChange={(e) => setPdpForm({ ...pdpForm, brandName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="ECOTEX INC."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Fabric</label>
                      <input
                        type="text"
                        value={pdpForm.fabricDetails}
                        onChange={(e) => setPdpForm({ ...pdpForm, fabricDetails: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="80 GSM Virgin Non-Woven Polypropylene"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Dimensions</label>
                      <input
                        type="text"
                        value={pdpForm.dimensions}
                        onChange={(e) => setPdpForm({ ...pdpForm, dimensions: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder='11.5"W x 21"H x 6.5" Gusset'
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Handles</label>
                      <input
                        type="text"
                        value={pdpForm.handles}
                        onChange={(e) => setPdpForm({ ...pdpForm, handles: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="Ultrasonic Thermal Welded Loops"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Printing</label>
                      <input
                        type="text"
                        value={pdpForm.printingMethod}
                        onChange={(e) => setPdpForm({ ...pdpForm, printingMethod: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="High-Precision Flexographic / Gravure Custom Imprint"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Compliance</label>
                      <input
                        type="text"
                        value={pdpForm.compliance}
                        onChange={(e) => setPdpForm({ ...pdpForm, compliance: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="Certified California SB 270 & ASTM D6400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Bag & Picture Packing</label>
                      <input
                        type="text"
                        value={pdpForm.packingDetails}
                        onChange={(e) => setPdpForm({ ...pdpForm, packingDetails: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="Export-Grade Heavy Duty Corrugated Cartons"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">• Guaranteed Fabric</label>
                      <input
                        type="text"
                        value={pdpForm.guaranteedFabric}
                        onChange={(e) => setPdpForm({ ...pdpForm, guaranteedFabric: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                        placeholder="100% Virgin Grade Recyclable Polypropylene"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">• Quality Standard Banner</label>
                    <input
                      type="text"
                      value={pdpForm.enrouteQuality}
                      onChange={(e) => setPdpForm({ ...pdpForm, enrouteQuality: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#d97706]"
                      placeholder="Enroute to Quality Standard"
                    />
                  </div>
                </div>

                {/* 4. Badges & Policies */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                    <span>4. Badges, Policies & Out of Stock Notification</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trust Badge 1</label>
                      <input
                        type="text"
                        value={pdpForm.trustBadge1}
                        onChange={(e) => setPdpForm({ ...pdpForm, trustBadge1: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                        placeholder="Fast Delivery"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trust Badge 2</label>
                      <input
                        type="text"
                        value={pdpForm.trustBadge2}
                        onChange={(e) => setPdpForm({ ...pdpForm, trustBadge2: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                        placeholder="Secure Store"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Trust Badge 3</label>
                      <input
                        type="text"
                        value={pdpForm.trustBadge3}
                        onChange={(e) => setPdpForm({ ...pdpForm, trustBadge3: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                        placeholder="Easy Return"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Retail Order Policy Text</label>
                    <textarea
                      rows={2}
                      value={pdpForm.retailPolicyText}
                      onChange={(e) => setPdpForm({ ...pdpForm, retailPolicyText: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Order Policy Text</label>
                    <textarea
                      rows={2}
                      value={pdpForm.wholesalePolicyText}
                      onChange={(e) => setPdpForm({ ...pdpForm, wholesalePolicyText: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-800 mb-1">Out of Stock Notice (When 0 Boxes)</label>
                    <textarea
                      rows={2}
                      value={pdpForm.outOfStockNotice}
                      onChange={(e) => setPdpForm({ ...pdpForm, outOfStockNotice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs font-medium text-rose-900"
                    />
                  </div>
                </div>

                {/* 5. Custom Buttons & Related Products Section */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d97706]" />
                    <span>5. Buttons, Tab Labels & Related Products Section</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Checkout Button Text</label>
                      <input
                        type="text"
                        value={pdpForm.checkoutButtonText || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, checkoutButtonText: e.target.value })}
                        placeholder="→ Express Checkout"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#d97706]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sold Out Button Text</label>
                      <input
                        type="text"
                        value={pdpForm.outOfStockButtonText || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, outOfStockButtonText: e.target.value })}
                        placeholder="Purchases Temporarily Closed (Sold Out)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Retail Order Tab Label</label>
                      <input
                        type="text"
                        value={pdpForm.retailTabLabel || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, retailTabLabel: e.target.value })}
                        placeholder="Retail Order"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Order Tab Label</label>
                      <input
                        type="text"
                        value={pdpForm.wholesaleTabLabel || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, wholesaleTabLabel: e.target.value })}
                        placeholder="Wholesale Order"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#166534]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Specifications Section Heading</label>
                      <input
                        type="text"
                        value={pdpForm.specsHeading || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, specsHeading: e.target.value })}
                        placeholder="Description"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Related Products Tag</label>
                      <input
                        type="text"
                        value={pdpForm.relatedTag || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, relatedTag: e.target.value })}
                        placeholder="Explore More Options"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Related Products Title</label>
                      <input
                        type="text"
                        value={pdpForm.relatedTitle || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, relatedTitle: e.target.value })}
                        placeholder="Related Products"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Related Back Button Text</label>
                      <input
                        type="text"
                        value={pdpForm.relatedBackBtnText || ''}
                        onChange={(e) => setPdpForm({ ...pdpForm, relatedBackBtnText: e.target.value })}
                        placeholder="View Full Catalog"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Related Products Subtitle</label>
                    <input
                      type="text"
                      value={pdpForm.relatedSubtitle || ''}
                      onChange={(e) => setPdpForm({ ...pdpForm, relatedSubtitle: e.target.value })}
                      placeholder="Frequently ordered together or alternative sizing options for your business."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Save Product Page Button */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  {productSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Single Product Page changes saved live!</span>
                    </span>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-extrabold shadow-md shadow-amber-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Single Product Page</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

                </div>
      </div>

      {/* Floating Save Actions Bar at Bottom */}
      <div className="sticky bottom-4 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#B2E2C5]/50 shadow-xl">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${hasUnpublishedChanges ? 'bg-amber-500 animate-pulse' : 'bg-[#86C59E]'}`} />
          <span className="text-xs font-bold text-slate-600">
            {hasUnpublishedChanges ? 'Unpublished draft changes. Click "Publish All Changes Now" to update storefront.' : 'Storefront is synchronized with the latest published content.'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto justify-end">
          {hasUnpublishedChanges && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Discard Changes
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap shrink-0 ${
              hasUnpublishedChanges
                ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-emerald-600/30 ring-2 ring-[#4ade80]/50 animate-pulse'
                : 'bg-[#4E9F76] hover:bg-[#86C59E] text-white shadow-[#4E9F76]/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#B2E2C5] shrink-0" />
                <span>Saved & Published!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default PageContentEditor;
