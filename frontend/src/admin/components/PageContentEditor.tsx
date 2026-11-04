'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  X,
  Edit3,
  Youtube,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  ArrowUp,
  ArrowDown,
  Search,
  Factory,
  ShoppingBag,
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
  | 'footer';

interface PageContentEditorProps {
  onNavigateToSection?: (section: string) => void;
}

export const PageContentEditor: React.FC<PageContentEditorProps> = ({ onNavigateToSection }) => {
  const { siteSettings, updateSiteSettings, products, updateProduct, updateHeroConfig } = useStore();
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
  const [activeTab, setActiveTab] = useState<EditorTab>('versatility');
  type HomeSectionTab = 'hero' | 'featured-products' | 'versatility' | 'about-facilities' | 'contact-info';
  const [activeHomeSection, setActiveHomeSection] = useState<HomeSectionTab>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFooterSocialModalOpen, setIsFooterSocialModalOpen] = useState(false);
  const [editingFooterSocialIdx, setEditingFooterSocialIdx] = useState<number | null>(null);
  const [footerSocialForm, setFooterSocialForm] = useState({ name: '', url: '' });

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
      const heroPayload = {
        title: formData.heroTitle || formData.heroConfig?.title || "It's time to\npack better.",
        subtitle: formData.heroSubtitle || formData.heroConfig?.subtitle || "Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags for retail supermarkets, luxury boutiques, and global distributors.",
        ctaText: formData.heroButtonText || formData.heroConfig?.ctaText || "Shop Now",
        backgroundImage: formData.heroBackgroundImage || formData.heroConfig?.backgroundImage || "/images/home-hero-bg.jpg"
      };
      const mergedPayload = {
        ...formData,
        heroTitle: heroPayload.title,
        heroSubtitle: heroPayload.subtitle,
        heroButtonText: heroPayload.ctaText,
        heroBackgroundImage: heroPayload.backgroundImage,
        heroConfig: {
          ...formData.heroConfig,
          ...heroPayload
        }
      };
      const updated = await apiService.updateSettings(mergedPayload);
      updateSiteSettings(updated || mergedPayload);
      if (updateHeroConfig) {
        updateHeroConfig(heroPayload);
      }
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

  const tabs: { id: EditorTab; label: string; pageRoute: string; icon: React.ElementType; desc: string }[] = [
    { id: 'versatility', label: '1. Home Page', pageRoute: '/', icon: Home, desc: 'Hero, products, versatility, facilities & contact' },
    { id: 'about', label: '2. About Us Page', pageRoute: '/#about', icon: Users, desc: 'Corporate narrative, mission, team & stats' },
    { id: 'shop', label: '3. Shop Page', pageRoute: '/#shop', icon: ShoppingBag, desc: 'Hero panoramic banner, trust badges & headings' },
    { id: 'contact', label: '4. Contact Us Page', pageRoute: '/#contact', icon: Phone, desc: 'Corona address, phones, emails & Google Map' },
    { id: 'footer', label: '5. Legal & Footer Page', pageRoute: '/#footer', icon: Globe, desc: 'Terms & conditions, privacy, newsletter & copyright' },
    { id: 'navbar', label: '6. Header & Navbar', pageRoute: '/', icon: Megaphone, desc: 'Top announcement marquee & header buttons' },
    { id: 'logo', label: '7. Logo & Branding', pageRoute: '/', icon: Recycle, desc: 'Visual brand logo & website favicon' },
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
            TAB 2: COMPLETE HEADER & NAVBAR CMS
           ======================================================== */}
        {activeTab === 'navbar' && (() => {
          const defaultNavLinks = [
            { id: 'nav-home', label: 'HOME', targetSection: 'home' as const },
            { id: 'nav-about', label: 'ABOUT US', targetSection: 'about' as const },
            { id: 'nav-shop', label: 'SHOP', targetSection: 'shop' as const },
            { id: 'nav-contact', label: 'CONTACT', targetSection: 'contact' as const }
          ];

          const currentNavLinks = (formData.navbarConfig?.navLinks && formData.navbarConfig.navLinks.length > 0)
            ? formData.navbarConfig.navLinks
            : defaultNavLinks;

          const handleUpdateLink = (idx: number, updates: Partial<typeof defaultNavLinks[0]>) => {
            const updated = [...currentNavLinks];
            updated[idx] = { ...updated[idx], ...updates };
            setFormData({
              ...formData,
              navbarConfig: {
                ...formData.navbarConfig!,
                navLinks: updated
              }
            });
          };

          const handleAddLink = () => {
            const newLink = {
              id: 'nav-' + Date.now().toString(36),
              label: 'NEW LINK',
              targetSection: 'shop' as const
            };
            setFormData({
              ...formData,
              navbarConfig: {
                ...formData.navbarConfig!,
                navLinks: [...currentNavLinks, newLink]
              }
            });
          };

          const handleDeleteLink = (idx: number) => {
            const updated = currentNavLinks.filter((_, i) => i !== idx);
            setFormData({
              ...formData,
              navbarConfig: {
                ...formData.navbarConfig!,
                navLinks: updated
              }
            });
          };

          const handleMoveLink = (idx: number, direction: 'up' | 'down') => {
            if (direction === 'up' && idx === 0) return;
            if (direction === 'down' && idx === currentNavLinks.length - 1) return;
            const updated = [...currentNavLinks];
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            const temp = updated[idx];
            updated[idx] = updated[targetIdx];
            updated[targetIdx] = temp;
            setFormData({
              ...formData,
              navbarConfig: {
                ...formData.navbarConfig!,
                navLinks: updated
              }
            });
          };

          const handleResetLinks = () => {
            setFormData({
              ...formData,
              navbarConfig: {
                ...formData.navbarConfig!,
                navLinks: defaultNavLinks
              }
            });
          };

          const announcementActive = formData.navbarConfig?.announcementActive !== false;
          const announcementText = formData.navbarConfig?.announcementText || formData.announcement || '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility';
          const ctaText = formData.navbarConfig?.ctaButtonText || 'START SHOP';
          const showCta = formData.navbarConfig?.showCtaButton !== false;
          const showSearch = formData.navbarConfig?.showSearch !== false;
          const showCart = formData.navbarConfig?.showCart !== false;
          const showPhone = formData.navbarConfig?.showPhone !== false;
          const ctaAction = formData.navbarConfig?.ctaButtonAction || 'shop';
          const phoneDisplay = formData.navbarConfig?.phoneDisplay || formData.phone || '(951) 555-ECOTEX';

          return (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Title & Description */}
              <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#B2E2C5]/30 text-[#166534]">
                      <Megaphone className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                      Header & Navbar Menu Manager
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage top announcement banner, navigation menu links (add, reorder, change text, change page targets), primary CTA pill button, and header utility icons.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#B2E2C5]/20 text-[#166534] border border-[#B2E2C5]/50 shrink-0 self-start md:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
                  <span>{currentNavLinks.length} Active Menu Links</span>
                </span>
              </div>

              {/* LIVE STOREFRONT NAVBAR PREVIEW */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#166534]" />
                    Live Navbar Visual Preview
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Matches current configuration
                  </span>
                </div>

                {/* Simulated Announcement Bar */}
                {announcementActive && (
                  <div className="bg-[#4E9F76] text-white py-1.5 px-4 text-center text-[10px] sm:text-[11px] font-semibold tracking-wide">
                    {announcementText}
                  </div>
                )}

                {/* Simulated Navbar Row */}
                <div className="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white/90 border-b border-slate-100">
                  {/* Left: Brand Logo Wordmark */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#166534] text-white flex items-center justify-center font-black text-xs">
                      E
                    </div>
                    <span className="font-black text-xs tracking-tight text-slate-900">
                      ECO<span className="text-[#166534]">TEX</span> INC.
                    </span>
                  </div>

                  {/* Center: Dynamic Nav Links Preview */}
                  <div className="hidden sm:flex items-center gap-4 lg:gap-6">
                    {currentNavLinks.map((link, idx) => (
                      <span key={link.id || idx} className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-700 hover:text-slate-950">
                        {link.label}
                      </span>
                    ))}
                  </div>

                  {/* Right: Utility Icons & CTA */}
                  <div className="flex items-center gap-2.5">
                    {showSearch && (
                      <div className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                        <Search className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {showCart && (
                      <div className="p-1.5 rounded-full bg-slate-100 text-slate-500 relative">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="absolute -top-1 -right-1 bg-[#166534] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                          0
                        </span>
                      </div>
                    )}
                    {showCta && (
                      <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d2e2da] text-[#144f33]">
                        {ctaText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* PART 1: NAVBAR MENU LINKS (ADD, EDIT, REORDER, TARGET SECTION) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider flex items-center gap-2">
                      <span>Navbar Navigation Links</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {currentNavLinks.length} Items
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Configure the exact links displayed in your website navbar. Reorder them or link each to a specific storefront page.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetLinks}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-bold transition-all cursor-pointer"
                      title="Reset to default 4 standard links (HOME, ABOUT US, SHOP, CONTACT)"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Standard Links</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#166534] text-white hover:bg-[#14532d] text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Navigation Link</span>
                    </button>
                  </div>
                </div>

                {/* Navigation Links Table / Card List */}
                <div className="space-y-2.5">
                  {currentNavLinks.map((link, idx) => (
                    <div
                      key={link.id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-[#86C59E] transition-all"
                    >
                      {/* Left: Reorder index & Label Input */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#166534] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                            Display Label Text
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(idx, { label: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#86C59E] tracking-wider uppercase"
                            placeholder="e.g. HOME, SHOP, CONTACT"
                          />
                        </div>
                      </div>

                      {/* Middle: Target Section Dropdown */}
                      <div className="w-full sm:w-56 shrink-0">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Target Storefront Section
                        </label>
                        <select
                          value={link.targetSection || 'home'}
                          onChange={(e) => handleUpdateLink(idx, { targetSection: e.target.value as any })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#86C59E] cursor-pointer"
                        >
                          <option value="home">Home Page (/)</option>
                          <option value="about">About Us Page (/#about)</option>
                          <option value="shop">Shop Catalog (/#shop)</option>
                          <option value="contact">Contact Us Page (/#contact)</option>
                        </select>
                      </div>

                      {/* Right: Move Up, Move Down & Delete Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleMoveLink(idx, 'up')}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveLink(idx, 'down')}
                          disabled={idx === currentNavLinks.length - 1}
                          title="Move down"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(idx)}
                          title="Delete navigation link"
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART 2: PRIMARY CTA PILL BUTTON (START SHOP) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                      Navbar Primary CTA Button (START SHOP)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Configure the signature rounded action button positioned on the right side of the navbar.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={showCta}
                      onChange={(e) => setFormData({
                        ...formData,
                        navbarConfig: { ...formData.navbarConfig!, showCtaButton: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#166534] rounded-md focus:ring-[#86C59E] accent-[#166534]"
                    />
                    <span className="text-xs font-bold text-slate-800">Show CTA Button</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Button Label Text
                    </label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setFormData({
                        ...formData,
                        navbarConfig: { ...formData.navbarConfig!, ctaButtonText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-white focus:outline-none focus:border-[#86C59E] uppercase tracking-wider"
                      placeholder="e.g. START SHOP, EXPLORE CATALOG, REQUEST QUOTE"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Button Action when Clicked
                    </label>
                    <select
                      value={ctaAction}
                      onChange={(e) => setFormData({
                        ...formData,
                        navbarConfig: { ...formData.navbarConfig!, ctaButtonAction: e.target.value as any }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#86C59E] cursor-pointer"
                    >
                      <option value="shop">Navigate to Shop Catalog (/#shop)</option>
                      <option value="contact">Open Contact & RFQ Quote Form (/#contact)</option>
                      <option value="cart">Open Shopping Bag / Cart Drawer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PART 3: TOP ANNOUNCEMENT MARQUEE BAR */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                      Top Announcement Marquee Bar
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Displays a notification banner above the navbar across the entire website.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={announcementActive}
                      onChange={(e) => setFormData({
                        ...formData,
                        announcementActive: e.target.checked,
                        navbarConfig: { ...formData.navbarConfig!, announcementActive: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#166534] rounded-md focus:ring-[#86C59E] accent-[#166534]"
                    />
                    <span className="text-xs font-bold text-slate-800">Display Announcement Bar</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Announcement Message Text
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setFormData({
                      ...formData,
                      announcement: e.target.value,
                      navbarConfig: { ...formData.navbarConfig!, announcementText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-[#86C59E]"
                    placeholder="🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility"
                  />
                </div>
              </div>

              {/* PART 4: HEADER UTILITY ICONS & MOBILE DRAWER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    Header Utility Icons & Mobile Drawer Settings
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Toggle visibility for the search icon, shopping bag with live counter, and mobile menu phone call link.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={showSearch}
                      onChange={(e) => setFormData({
                        ...formData,
                        navbarConfig: { ...formData.navbarConfig!, showSearch: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#166534] rounded accent-[#166534]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Search Modal Icon</span>
                      <span className="text-[10px] text-slate-400">Allows instant catalog search</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={showCart}
                      onChange={(e) => setFormData({
                        ...formData,
                        navbarConfig: { ...formData.navbarConfig!, showCart: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#166534] rounded accent-[#166534]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Shopping Bag Icon</span>
                      <span className="text-[10px] text-slate-400">Shows live cart badge count</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={showPhone}
                      onChange={(e) => setFormData({
                        ...formData,
                        navbarConfig: { ...formData.navbarConfig!, showPhone: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#166534] rounded accent-[#166534]"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Mobile Phone Link</span>
                      <span className="text-[10px] text-slate-400">Click-to-call in drawer</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Header & Mobile Phone Number Display
                  </label>
                  <input
                    type="text"
                    value={phoneDisplay}
                    onChange={(e) => setFormData({
                      ...formData,
                      phone: e.target.value,
                      navbarConfig: { ...formData.navbarConfig!, phoneDisplay: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#86C59E]"
                    placeholder="(951) 555-ECOTEX"
                  />
                </div>
              </div>

            </div>
          );
        })()}

        {/* ========================================================
            TAB 1: COMPLETE HOME PAGE CMS (ALL 5 SECTIONS)
           ======================================================== */}
        {activeTab === 'versatility' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header & Section Navigation Bar */}
            <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-[#B2E2C5]/30 text-[#166534]">
                    <Home className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                    Home Page - All Live Sections CMS
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Directly customize all 5 core sections displayed on the storefront Homepage: Hero Showcase, Products Collection, Versatility & Value Cards, About & Manufacturing Hubs, and Direct Mill Contact.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#B2E2C5]/20 text-[#166534] border border-[#B2E2C5]/50 shrink-0 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
                <span>5 Core Sections Active</span>
              </span>
            </div>

            {/* Horizontal Sub-Navigation Tabs for the 5 Home Page Sections */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-100">
              {[
                { id: 'hero', label: '1. Hero Showcase', icon: Sparkles, badge: 'Main Banner' },
                { id: 'featured-products', label: '2. Products Showcase', icon: ShoppingBag, badge: 'Catalog' },
                { id: 'versatility', label: '3. Versatility & Cards', icon: Layers, badge: 'Value Cards' },
                { id: 'about-facilities', label: '4. About & Facilities', icon: Factory, badge: 'Mill Hubs' },
                { id: 'contact-info', label: '5. Direct Mill Contact', icon: Phone, badge: 'Corona CA' }
              ].map((sec) => {
                const Icon = sec.icon;
                const isCurrent = activeHomeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveHomeSection(sec.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                      isCurrent
                        ? 'bg-[#166534] text-white border-[#166534] shadow-sm shadow-[#166534]/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-200' : 'text-[#4E9F76]'}`} />
                    <span>{sec.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-500'
                    }`}>
                      {sec.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ========================================================
                SECTION 1: HERO SHOWCASE (BiteStyleHero)
               ======================================================== */}
            {activeHomeSection === 'hero' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <span className="font-bold block">Storefront Hero Panoramic Showcase</span>
                    This section controls the top-most centerpiece of your website. Headlines support line breaks (press Enter), with dynamic glowing green styling automatically applied to the final word.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Hero Headline / Main Title * (Supports line breaks)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.heroTitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        heroTitle: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E] font-mono"
                      placeholder="It's time to\npack better."
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Tip: Write on multiple lines to stack headline text. The last word renders with a radiant emerald gradient.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Hero Paragraph / Narrative Subtitle *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.heroSubtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        heroSubtitle: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                      placeholder="Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags for retail supermarkets, luxury boutiques, and global distributors."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Primary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.heroButtonText || 'Shop Now'}
                        onChange={(e) => setFormData({
                          ...formData,
                          heroButtonText: e.target.value
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-white focus:outline-none focus:border-[#86C59E]"
                        placeholder="Shop Now"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Top Announcement Bar Message
                      </label>
                      <input
                        type="text"
                        value={formData.announcement || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          announcement: e.target.value
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#86C59E]"
                        placeholder="🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility"
                      />
                    </div>
                  </div>

                  {/* Hero Background Image Direct Upload */}
                  <div className="pt-2">
                    <ImageUploader
                      label="Hero Panoramic Background Image"
                      description="Import your custom panoramic photo from your computer (e.g. factory floor, showroom, or lifestyle warehouse scene). Defaults to /images/home-hero-bg.jpg."
                      value={formData.heroBackgroundImage || '/images/home-hero-bg.jpg'}
                      onChange={(newUrl) => setFormData({
                        ...formData,
                        heroBackgroundImage: newUrl
                      })}
                      aspectRatio="wide"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 2: FEATURED PRODUCTS SHOWCASE (ShopSection on Home)
               ======================================================== */}
            {activeHomeSection === 'featured-products' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block">Featured Products & New Arrivals Carousel</span>
                    This section displays your featured eco-friendly products directly on the Homepage with quick-add cart controls and instant wholesale quote triggers.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={formData.shopConfig?.newArrivalsHeading || 'New Arrivals'}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, newArrivalsHeading: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                      placeholder="New Arrivals"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      View All Catalog Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.shopConfig?.allProductsHeading || 'Shop All Products'}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, allProductsHeading: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] focus:outline-none focus:border-[#86C59E]"
                      placeholder="Shop All Products"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Section Description / Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.shopConfig?.newArrivalsSubtitle || 'High-tensile reusable non-woven polypropylene carrier bags engineered for commercial retail.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        shopConfig: { ...formData.shopConfig!, newArrivalsSubtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                      placeholder="High-tensile reusable non-woven polypropylene carrier bags engineered for commercial retail."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 3: VERSATILITY & VALUE CARDS (VersatilityBannerSection)
               ======================================================== */}
            {activeHomeSection === 'versatility' && (
              <div className="space-y-6 animate-fadeIn">
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
                SECTION 4: ABOUT ECOTEX & FACILITIES (HomepageAboutFacilitiesSection)
               ======================================================== */}
            {activeHomeSection === 'about-facilities' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Factory className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-emerald-950 block">About Ecotex & Manufacturing Facilities</span>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Controls the brand story, mission quote, executive founder profile, and international manufacturing & distribution hubs displayed on the Homepage.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.facilitiesConfig?.showOnHomepage !== false}
                      onChange={(e) => setFormData({
                        ...formData,
                        facilitiesConfig: { ...formData.facilitiesConfig!, showOnHomepage: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-[#166534] focus:ring-[#166534] accent-[#166534]"
                    />
                    <span className="text-xs font-bold text-emerald-950">Show on Homepage</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Section Category Tag
                    </label>
                    <input
                      type="text"
                      value={formData.aboutConfig?.sectionTagline || '| SUSTAINABILITY & CIRCULAR PACKAGING'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig!, sectionTagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-white focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Brand Story Title
                    </label>
                    <input
                      type="text"
                      value={formData.aboutConfig?.storyTitle || formData.aboutTitle || 'We Are Ecotex'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutTitle: e.target.value,
                        aboutConfig: { ...formData.aboutConfig!, storyTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Mission Statement / Italic Blockquote
                    </label>
                    <textarea
                      rows={2}
                      value={formData.aboutConfig?.missionQuote || formData.aboutMission || 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutMission: e.target.value,
                        aboutConfig: { ...formData.aboutConfig!, missionQuote: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-[#86C59E] italic"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Brand Story Paragraph #1
                    </label>
                    <textarea
                      rows={3}
                      value={formData.aboutConfig?.storyParagraph1 || formData.aboutStory || 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutStory: e.target.value,
                        aboutConfig: { ...formData.aboutConfig!, storyParagraph1: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                {/* Founder Info & Portrait Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    Executive Leadership & Founder Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Founder Name
                      </label>
                      <input
                        type="text"
                        value={formData.aboutConfig?.founderName || 'Rashid Mahmood'}
                        onChange={(e) => setFormData({
                          ...formData,
                          aboutConfig: { ...formData.aboutConfig!, founderName: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#86C59E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Founder Title / Role
                      </label>
                      <input
                        type="text"
                        value={formData.aboutConfig?.founderRole || 'Managing Director & Founder, Ecotex Inc.'}
                        onChange={(e) => setFormData({
                          ...formData,
                          aboutConfig: { ...formData.aboutConfig!, founderRole: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <ImageUploader
                        label="Founder Portrait Photo"
                        description="Upload executive portrait directly from your computer."
                        value={formData.aboutConfig?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85'}
                        onChange={(newUrl) => setFormData({
                          ...formData,
                          aboutConfig: { ...formData.aboutConfig!, founderImage: newUrl }
                        })}
                        aspectRatio="square"
                      />
                    </div>
                  </div>
                </div>

                {/* Facilities & Logistics Hubs */}
                <div className="p-5 rounded-2xl bg-[#F4F9F5] border border-[#B2E2C5]/40 space-y-4">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    Manufacturing & Logistics Hubs (Corona CA & Overseas Mill)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                        Hub #1: US Distribution Hub
                      </span>
                      <input
                        type="text"
                        value={formData.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881'}
                        onChange={(e) => setFormData({
                          ...formData,
                          facilityAddress: e.target.value
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800"
                        placeholder="Corona Facility Address"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                        Hub #2: Heavy Industrial Mill Plant
                      </span>
                      <input
                        type="text"
                        value={formData.plantAddress || 'Sector 15, Korangi Industrial Area, Karachi, PK'}
                        onChange={(e) => setFormData({
                          ...formData,
                          plantAddress: e.target.value
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800"
                        placeholder="Mill Plant Address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 5: DIRECT MILL & CORONA CONTACT (ContactSection on Home)
               ======================================================== */}
            {activeHomeSection === 'contact-info' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block">Direct Mill & Corona Contact Section</span>
                    This section manages the official addresses, telephone numbers, quote inquiry email, and Google Maps location displayed at the bottom of the Homepage.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Direct US Logistics Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        phone: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                      placeholder="+1 (951) 450-9773"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Official Quotes & Orders Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        email: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] focus:outline-none focus:border-[#86C59E]"
                      placeholder="orders@ecotexinc.com"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Corona CA Facility Address (US Headquarters)
                    </label>
                    <input
                      type="text"
                      value={formData.facilityAddress || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        facilityAddress: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                      placeholder="1200 Industrial Parkway, Corona, CA 92881"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Google Maps Navigation URL
                    </label>
                    <input
                      type="text"
                      value={formData.contactConfig?.googleMapsUrl || 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881'}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig!, googleMapsUrl: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                      placeholder="https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            TAB 5: ABOUT US & LEADERSHIP TEAM
           ======================================================== */}
        {activeTab === 'about' && (() => {
          const currentFeatures = (formData.aboutConfig?.whyChooseUsFeatures && formData.aboutConfig.whyChooseUsFeatures.length > 0)
            ? formData.aboutConfig.whyChooseUsFeatures
            : [
                {
                  title: '100% Recyclable Fabrics',
                  description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.'
                },
                {
                  title: 'Easy to Customize',
                  description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.'
                },
                {
                  title: '24/7 B2B Global Support',
                  description: 'Dedicated enterprise account directors for national retail chains, grocers, and FMCG brands.'
                },
                {
                  title: 'Free Sample Verification',
                  description: 'Physical pre-production specimen kits dispatched within 48 hours for tensile testing and color sign-off.'
                },
                {
                  title: 'High-Definition Flexo Print',
                  description: 'Zero-VOC soy and water-based ink flexography delivering photo-sharp photographic brand imprints.'
                },
                {
                  title: 'Rapid Turnaround Times',
                  description: 'Immediate dispatch for unbranded warehouse inventory and accelerated 10-14 day custom printed delivery.'
                }
              ];

          const defaultTeamFallback = [
            {
              id: 'tm1',
              name: 'Rashid Mahmood',
              role: 'Managing Director & Founder',
              image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85',
              bio: 'Pioneered circular non-woven manufacturing across North America and South Asia with over two decades in sustainable polymer engineering.',
              linkedin: '#',
              twitter: '#',
              email: 'rashid@ecotexinc.com'
            },
            {
              id: 'tm2',
              name: 'Farah Al-Sayed',
              role: 'Head of Quality & Materials Engineering',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
              bio: 'Leads our ASTM D6400 biodegradable testing laboratories and Global Recycled Standard (GRS) chain-of-custody compliance.',
              linkedin: '#',
              twitter: '#',
              email: 'farah@ecotexinc.com'
            },
            {
              id: 'tm3',
              name: 'Marcus Vance',
              role: 'Chief Sustainability Officer',
              image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85',
              bio: 'Oversees enterprise carbon reduction accounting and California SB 270 / SB 54 regulatory packaging compliance.',
              linkedin: '#',
              twitter: '#',
              email: 'marcus@ecotexinc.com'
            }
          ];

          const currentTeam = (formData.aboutConfig?.teamMembers && formData.aboutConfig.teamMembers.length > 0)
            ? formData.aboutConfig.teamMembers
            : defaultTeamFallback;

          return (
            <div className="space-y-6 animate-fadeIn">

              {/* Top Action Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Section Editor · Live Real-Time Storefront Sync
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      2. About Us Page
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Save 2.</span>
                </button>
              </div>

              {/* CARD 1: HERO BANNER & CINEMATIC BACKGROUND */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Editorial Hero Banner & Background
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Top masthead headline, descriptive subtitle, and high-resolution background image.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      placeholder="About Us"
                      value={formData.aboutConfig?.heroTitle ?? 'About Us'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, heroTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Hero Subtitle Narrative
                    </label>
                    <input
                      type="text"
                      placeholder="A sustainable future for packaging. Engineered with purpose, manufactured for impact."
                      value={formData.aboutConfig?.heroSubtitle ?? 'A sustainable future for packaging. Engineered with purpose, manufactured for impact.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, heroSubtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                {/* Direct Image File Import for About Hero Background */}
                <div className="pt-2">
                  <ImageUploader
                    label="About Us Page Hero Background Photo"
                    description="Import high-resolution facility / executive background photograph from your computer."
                    value={formData.aboutConfig?.heroBgImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85'}
                    onChange={(newUrl) => setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig, heroBgImage: newUrl }
                    })}
                    aspectRatio="wide"
                  />
                </div>
              </div>

              {/* CARD 2: CORPORATE NARRATIVE & FOUNDER LEADERSHIP */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Corporate Narrative & Founder Leadership
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Story headline, executive mission quote, company history paragraphs, and founder portrait.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Story Main Headline
                    </label>
                    <input
                      type="text"
                      placeholder="We Are Ecotex"
                      value={formData.aboutConfig?.storyTitle ?? 'We Are Ecotex'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, storyTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Founder Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Rashid Mahmood"
                      value={formData.aboutConfig?.founderName ?? 'Rashid Mahmood'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, founderName: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Founder Executive Title / Role
                    </label>
                    <input
                      type="text"
                      placeholder="Managing Director & Founder, Ecotex Inc."
                      value={formData.aboutConfig?.founderRole ?? 'Managing Director & Founder, Ecotex Inc.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, founderRole: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Leadership Badge Label
                    </label>
                    <input
                      type="text"
                      placeholder="Leadership"
                      value={formData.aboutConfig?.leadershipBadgeTitle ?? 'Leadership'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, leadershipBadgeTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Leadership Badge Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="20+ Years Sustainable Manufacturing"
                      value={formData.aboutConfig?.leadershipBadgeSubtitle ?? '20+ Years Sustainable Manufacturing'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, leadershipBadgeSubtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Executive Mission Quote
                  </label>
                  <textarea
                    rows={2}
                    placeholder="We engineered our circular manufacturing framework around a simple premise..."
                    value={formData.aboutConfig?.missionQuote ?? 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.'}
                    onChange={(e) => setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig, missionQuote: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Corporate Narrative Paragraph 1
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Founded to combat the global crisis of single-use plastic waste..."
                      value={formData.aboutConfig?.storyParagraph1 ?? 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, storyParagraph1: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Corporate Narrative Paragraph 2
                    </label>
                    <textarea
                      rows={4}
                      placeholder="From our corporate headquarters in California to state-of-the-art automated manufacturing..."
                      value={formData.aboutConfig?.storyParagraph2 ?? 'From our corporate headquarters in California to state-of-the-art automated manufacturing facilities, every product is subjected to rigorous tensile testing, automated ultrasonic seam welding, and non-toxic water-based printing. We empower grocery retailers, boutique lifestyle brands, and logistics operations across the globe to achieve zero-waste compliance with full chain-of-custody audit trails.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, storyParagraph2: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                    />
                  </div>
                </div>

                {/* Direct Image File Import for Founder Portrait */}
                <div className="pt-2">
                  <ImageUploader
                    label="Founder Official Executive Portrait Photo (Rashid Mahmood)"
                    description="Import high-resolution executive portrait directly from your computer (auto framed with floating leadership badge)."
                    value={formData.aboutConfig?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85'}
                    onChange={(newUrl) => setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig, founderImage: newUrl }
                    })}
                    aspectRatio="square"
                  />
                </div>
              </div>

              {/* CARD 3: WHY CHOOSE US & INDUSTRIAL MANUFACTURING STANDARDS */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Why Choose Us & Industrial Manufacturing Standards
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Section headline, workshop laboratory photograph, certifications badge, and 6 industrial feature cards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      placeholder="Why Choose Us"
                      value={formData.aboutConfig?.whyChooseUsTitle ?? 'Why Choose Us'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, whyChooseUsTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Workshop Stat Badge Value
                    </label>
                    <input
                      type="text"
                      placeholder="125+ Uses"
                      value={formData.aboutConfig?.statBadgeValue ?? '125+ Uses'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, statBadgeValue: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Workshop Stat Badge Label
                    </label>
                    <input
                      type="text"
                      placeholder="ASTM D6400 & GRS Certified"
                      value={formData.aboutConfig?.statBadgeLabel ?? 'ASTM D6400 & GRS Certified'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, statBadgeLabel: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Section Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    placeholder="We combine German ultrasonic welding machinery, ISO 9001 certified batch audits..."
                    value={formData.aboutConfig?.whyChooseUsSubtitle ?? 'We combine German ultrasonic welding machinery, ISO 9001 certified batch audits, and non-toxic soy formulations to deliver high-capacity packaging engineered to outlast disposable plastic.'}
                    onChange={(e) => setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig, whyChooseUsSubtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                  />
                </div>

                {/* Direct Image File Import for Workshop Photo */}
                <div className="pt-2">
                  <ImageUploader
                    label="Engineering Workshop & Testing Laboratory Photo"
                    description="Import high-resolution quality testing laboratory or automated factory floor photo from your computer."
                    value={formData.aboutConfig?.workshopImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85'}
                    onChange={(newUrl) => setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig, workshopImage: newUrl }
                    })}
                    aspectRatio="wide"
                  />
                </div>

                {/* 6 Precision Industrial Features Editor */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        6 Industrial Manufacturing Precision Features
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Customise the titles and descriptions displayed on the storefront split grid.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          aboutConfig: {
                            ...formData.aboutConfig,
                            whyChooseUsFeatures: [
                              {
                                title: '100% Recyclable Fabrics',
                                description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.'
                              },
                              {
                                title: 'Easy to Customize',
                                description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.'
                              },
                              {
                                title: '24/7 B2B Global Support',
                                description: 'Dedicated enterprise account directors for national retail chains, grocers, and FMCG brands.'
                              },
                              {
                                title: 'Free Sample Verification',
                                description: 'Physical pre-production specimen kits dispatched within 48 hours for tensile testing and color sign-off.'
                              },
                              {
                                title: 'High-Definition Flexo Print',
                                description: 'Zero-VOC soy and water-based ink flexography delivering photo-sharp photographic brand imprints.'
                              },
                              {
                                title: 'Rapid Turnaround Times',
                                description: 'Immediate dispatch for unbranded warehouse inventory and accelerated 10-14 day custom printed delivery.'
                              }
                            ]
                          }
                        });
                      }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Features</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            Feature {fIdx + 1}
                          </span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => {
                              const updated = [...currentFeatures];
                              updated[fIdx] = { ...updated[fIdx], title: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, whyChooseUsFeatures: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={feat.description}
                            onChange={(e) => {
                              const updated = [...currentFeatures];
                              updated[fIdx] = { ...updated[fIdx], description: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, whyChooseUsFeatures: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 4: EXECUTIVE LEADERSHIP TEAM MEMBERS */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Executive Leadership Team Members
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Customise member headshot portraits, executive credentials, bios, and direct channels.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newMember = {
                        id: 'tm_' + Date.now(),
                        name: 'New Executive Member',
                        role: 'Packaging Specialist',
                        bio: 'Specializing in sustainable packaging engineering and enterprise customer satisfaction.',
                        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
                        email: 'executive@ecotexinc.com',
                        linkedin: '#',
                        twitter: '#'
                      };
                      setFormData({
                        ...formData,
                        aboutConfig: {
                          ...formData.aboutConfig,
                          teamMembers: [...currentTeam, newMember]
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4E9F76] hover:bg-[#86C59E] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Team Section Headline
                    </label>
                    <input
                      type="text"
                      placeholder="Meet Our Team"
                      value={formData.aboutConfig?.teamSectionTitle ?? 'Meet Our Team'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, teamSectionTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Team Section Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="The experts behind global sustainable packaging."
                      value={formData.aboutConfig?.teamSectionSubtitle ?? 'The experts behind global sustainable packaging.'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, teamSectionSubtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                {/* Team Members List */}
                <div className="space-y-4 pt-2">
                  {currentTeam.map((member, idx) => (
                    <div
                      key={member.id || idx}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black text-slate-800">
                            {member.name || 'Untitled Member'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            · {member.role || 'Role unassigned'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...currentTeam];
                                const temp = updated[idx - 1];
                                updated[idx - 1] = updated[idx];
                                updated[idx] = temp;
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                                });
                              }}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {idx < currentTeam.length - 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...currentTeam];
                                const temp = updated[idx + 1];
                                updated[idx + 1] = updated[idx];
                                updated[idx] = temp;
                                setFormData({
                                  ...formData,
                                  aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                                });
                              }}
                              className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = currentTeam.filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                              });
                            }}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-500 transition-colors ml-1"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Headshot Photo Uploader */}
                      <ImageUploader
                        label="Profile Headshot Photo"
                        description="Import official portrait photograph from your computer."
                        value={member.image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85'}
                        onChange={(newUrl) => {
                          const updated = [...currentTeam];
                          updated[idx] = { ...updated[idx], image: newUrl };
                          setFormData({
                            ...formData,
                            aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                          });
                        }}
                        aspectRatio="square"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...currentTeam];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Role / Job Title
                          </label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => {
                              const updated = [...currentTeam];
                              updated[idx] = { ...updated[idx], role: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Executive Biography / Credentials
                        </label>
                        <textarea
                          rows={2}
                          value={member.bio}
                          onChange={(e) => {
                            const updated = [...currentTeam];
                            updated[idx] = { ...updated[idx], bio: e.target.value };
                            setFormData({
                              ...formData,
                              aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Direct Email
                          </label>
                          <input
                            type="email"
                            placeholder="executive@ecotexinc.com"
                            value={member.email || ''}
                            onChange={(e) => {
                              const updated = [...currentTeam];
                              updated[idx] = { ...updated[idx], email: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            LinkedIn URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://linkedin.com/in/..."
                            value={member.linkedin || ''}
                            onChange={(e) => {
                              const updated = [...currentTeam];
                              updated[idx] = { ...updated[idx], linkedin: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">
                            Twitter / X URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://twitter.com/..."
                            value={member.twitter || ''}
                            onChange={(e) => {
                              const updated = [...currentTeam];
                              updated[idx] = { ...updated[idx], twitter: e.target.value };
                              setFormData({
                                ...formData,
                                aboutConfig: { ...formData.aboutConfig, teamMembers: updated }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 5: FACTORY CONSULTATION CTA BANNER */}
              <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Bottom Factory Consultation Call-To-Action Banner
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Configure the bottom gradient banner leading enterprise buyers to factory consultations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Banner Headline
                    </label>
                    <input
                      type="text"
                      placeholder="Ready to Elevate Your Packaging Sustainability?"
                      value={formData.aboutConfig?.ctaTitle ?? 'Ready to Elevate Your Packaging Sustainability?'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, ctaTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Call-to-Action Button Label
                    </label>
                    <input
                      type="text"
                      placeholder="Request Factory Consultation →"
                      value={formData.aboutConfig?.ctaBtnText ?? 'Request Factory Consultation →'}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutConfig: { ...formData.aboutConfig, ctaBtnText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Banner Subtitle Narrative
                  </label>
                  <input
                    type="text"
                    placeholder="Talk to our packaging engineers in California or request custom prototypes."
                    value={formData.aboutConfig?.ctaSubtitle ?? 'Talk to our packaging engineers in California or request custom prototypes.'}
                    onChange={(e) => setFormData({
                      ...formData,
                      aboutConfig: { ...formData.aboutConfig, ctaSubtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

            </div>
          );
        })()}

        {/* ========================================================
            TAB 6: CORPORATE CONTACT & FACILITIES
           ======================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Top Action Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Section Editor · Live Real-Time Storefront Sync
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    4. Contact Us Page
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSave()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save 4.</span>
              </button>
            </div>

            {/* CARD 1: HERO HEADLINES & CINEMATIC PHOTO */}
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Hero Headlines & Edge-to-Edge Cinematic Photo
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Configure the prominent typography, narrative subtitle, and edge-to-edge background photograph.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary Headline First Line
                  </label>
                  <input
                    type="text"
                    placeholder="Get in"
                    value={formData.contactConfig?.headlineFirst ?? 'Get in'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, headlineFirst: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Rendered in large crisp bold white lettering (top line).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Accented Word / Second Line
                  </label>
                  <input
                    type="text"
                    placeholder="touch."
                    value={formData.contactConfig?.headlineSecond ?? 'touch.'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, headlineSecond: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    The trailing period '.' receives our vibrant brand accent green (#22c55e).
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Section Narrative Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Direct manufacturer of certified circular non-woven, compostable bio-PLA, and insulated wholesale packaging."
                  value={formData.contactConfig?.subtitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactConfig: { ...formData.contactConfig, subtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                />
              </div>

              {/* Direct Computer Image Upload for Cinematic Background */}
              <div className="pt-2">
                <ImageUploader
                  label="Cinematic Contact Hero Background Photo"
                  description="Import high-resolution facility, team, or manufacturing floor photograph from your computer (auto dark overlay applied)."
                  value={formData.contactConfig?.bgImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=85'}
                  onChange={(newUrl) => setFormData({
                    ...formData,
                    contactConfig: { ...formData.contactConfig, bgImage: newUrl }
                  })}
                  aspectRatio="wide"
                />
              </div>
            </div>

            {/* CARD 2: DIRECT TELECOMMUNICATION & CHANNELS */}
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Direct Telecommunication & Channels
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Live telephone lines, customer procurement email channels, and business operating hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary Corporate Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (951) 450-9773"
                    value={formData.contactConfig?.phone || formData.phone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      phone: e.target.value,
                      contactConfig: { ...formData.contactConfig, phone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Secondary Logistics Hotline
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (951) 450-9773"
                    value={formData.contactConfig?.secondaryPhone || formData.secondaryPhone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      secondaryPhone: e.target.value,
                      contactConfig: { ...formData.contactConfig, secondaryPhone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Orders & Procurement Email
                  </label>
                  <input
                    type="email"
                    placeholder="orders@ecotexinc.com"
                    value={formData.contactConfig?.email || formData.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      email: e.target.value,
                      contactConfig: { ...formData.contactConfig, email: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    placeholder="support@ecotexinc.com"
                    value={formData.contactConfig?.supportEmail || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, supportEmail: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Official Website Domain
                  </label>
                  <input
                    type="text"
                    placeholder="ecotexinc.com"
                    value={formData.contactConfig?.website || 'ecotexinc.com'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, website: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Commercial Operating Hours
                  </label>
                  <input
                    type="text"
                    placeholder="Mon - Fri: 8:00 AM - 5:00 PM PST"
                    value={formData.contactConfig?.businessHours || 'Mon - Fri: 8:00 AM - 5:00 PM PST'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, businessHours: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: MANUFACTURING & LOGISTICS FACILITIES */}
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Manufacturing & Logistics Facilities
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Physical warehousing and direct Google Maps navigation URL for 1-click turn-by-turn directions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      US Distribution Hub
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Primary Commercial Facility
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      US Distribution Facility Address (Corona, CA)
                    </label>
                    <input
                      type="text"
                      placeholder="1200 Industrial Parkway, Corona, CA 92881"
                      value={formData.contactConfig?.facilityAddress || formData.facilityAddress || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        facilityAddress: e.target.value,
                        contactConfig: { ...formData.contactConfig, facilityAddress: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Google Maps Navigation Link</span>
                      {formData.contactConfig?.googleMapsUrl && (
                        <a
                          href={formData.contactConfig.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Test Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="https://maps.google.com/?q=..."
                      value={formData.contactConfig?.googleMapsUrl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig, googleMapsUrl: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-700 focus:outline-none focus:border-[#86C59E]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Leave blank to auto-generate maps link from the facility address.
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      Direct Mill Plant
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Primary Extrusion & Converting
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Primary Manufacturing Mill Plant Address
                    </label>
                    <input
                      type="text"
                      placeholder="Sector 15, Korangi Industrial Area, Karachi, PK"
                      value={formData.contactConfig?.plantAddress || formData.plantAddress || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        plantAddress: e.target.value,
                        contactConfig: { ...formData.contactConfig, plantAddress: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mill Capabilities & Certifications Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="ISO 9001 & FSC Certified Extrusion Mill"
                      value={formData.contactConfig?.plantCapabilities || 'Primary Manufacturing Mill Plant · ISO 9001 & FSC Certified'}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig, plantCapabilities: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: INTERACTIVE RFQ & INQUIRY FORM SETTINGS */}
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Interactive Quote & Inquiry Form Settings
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Customize form titles, input field labels, submit button wording, and post-submission success feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Form Card Title (Optional Header)
                  </label>
                  <input
                    type="text"
                    placeholder="Request Direct Mill Pricing"
                    value={formData.contactConfig?.formTitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, formTitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Form Card Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="Direct mill pricing, custom flexo specs & pallet freight dispatch."
                    value={formData.contactConfig?.formSubtitle || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, formSubtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

              {/* 4 Input Field Labels */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Input Field Labels
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      First Name Field
                    </label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.contactConfig?.firstNameLabel || 'First Name'}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig, firstNameLabel: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Last Name Field
                    </label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.contactConfig?.lastNameLabel || 'Last Name'}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig, lastNameLabel: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Email Address Field
                    </label>
                    <input
                      type="text"
                      placeholder="Email Address"
                      value={formData.contactConfig?.emailLabel || 'Email Address'}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig, emailLabel: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Message Field
                    </label>
                    <input
                      type="text"
                      placeholder="Message"
                      value={formData.contactConfig?.messageLabel || 'Message'}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactConfig: { ...formData.contactConfig, messageLabel: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action & Feedback */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="SUBMIT"
                    value={formData.contactConfig?.submitBtnText || 'SUBMIT'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, submitBtnText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Submission Success Heading
                  </label>
                  <input
                    type="text"
                    placeholder="Thank You For Reaching Out!"
                    value={formData.contactConfig?.successHeading || 'Thank You For Reaching Out!'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, successHeading: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Reset / Another Message Label
                  </label>
                  <input
                    type="text"
                    placeholder="Send another message"
                    value={formData.contactConfig?.resetBtnText || 'Send another message'}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, resetBtnText: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Submission Success Message Body
                </label>
                <textarea
                  rows={2}
                  placeholder="Your message has been received. Our executive commercial team will connect with you within 2 business hours."
                  value={formData.contactConfig?.successMessage || 'Your message has been received. Our executive commercial team will connect with you within 2 business hours.'}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactConfig: { ...formData.contactConfig, successMessage: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E] resize-none"
                />
              </div>
            </div>

            {/* CARD 5: SOCIAL MEDIA PROFILES */}
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Corporate Social Media URLs
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Direct profile links for enterprise social channels.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/company/ecotex"
                    value={formData.contactConfig?.linkedinUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, linkedinUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/ecotexinc"
                    value={formData.contactConfig?.facebookUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, facebookUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/ecotexinc"
                    value={formData.contactConfig?.instagramUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, instagramUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://twitter.com/ecotexinc"
                    value={formData.contactConfig?.twitterUrl || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactConfig: { ...formData.contactConfig, twitterUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
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
            TAB 5: COMPLETE FOOTER & LEGAL CMS
           ======================================================== */}
        {activeTab === 'footer' && (() => {
          const defaultSocialLinks = [
            { id: 'li', name: 'LinkedIn', url: 'https://linkedin.com' },
            { id: 'tw', name: 'Twitter / X', url: 'https://twitter.com' },
            { id: 'fb', name: 'Facebook', url: 'https://facebook.com' },
            { id: 'ig', name: 'Instagram', url: 'https://instagram.com' },
            { id: 'yt', name: 'YouTube', url: 'https://youtube.com' }
          ];

          const currentSocialLinks = (formData.footerConfig?.socialLinks && formData.footerConfig.socialLinks.length > 0)
            ? formData.footerConfig.socialLinks
            : defaultSocialLinks;

          const defaultCol2Links = [
            { id: '1', label: 'Non-Woven Totes', url: 'shop' },
            { id: '2', label: 'D-Cut Bags', url: 'shop' },
            { id: '3', label: 'Laminated Gift Bags', url: 'shop' },
            { id: '4', label: 'Custom Flexo Print', url: 'contact' }
          ];

          const currentCol2Links = (formData.footerConfig?.col2Links && formData.footerConfig.col2Links.length > 0)
            ? formData.footerConfig.col2Links
            : defaultCol2Links;

          const defaultCol3Links = [
            { id: '1', label: 'Pack Expo 2026', url: '#quote-form' },
            { id: '2', label: 'Sustainable Retail', url: '#quote-form' },
            { id: '3', label: 'SB 270 Workshops', url: '#quote-form' },
            { id: '4', label: 'Sample Roadshow', url: '#quote-form' }
          ];

          const currentCol3Links = (formData.footerConfig?.col3Links && formData.footerConfig.col3Links.length > 0)
            ? formData.footerConfig.col3Links
            : defaultCol3Links;

          const getSocialIcon = (name: string, url: string) => {
            const n = (name || '').toLowerCase();
            const u = (url || '').toLowerCase();
            if (n.includes('tiktok') || u.includes('tiktok')) {
              return (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.67 6.34 6.34 0 0 0 9.35 22a6.33 6.33 0 0 0 6.32-6.33V9.17a8.28 8.28 0 0 0 4.84 1.55v-3.5a4.85 4.85 0 0 1-.92-.53z" />
                </svg>
              );
            }
            if (n.includes('whatsapp') || u.includes('whatsapp') || u.includes('wa.me')) return <Phone className="w-4 h-4 text-emerald-600" />;
            if (n.includes('linkedin') || u.includes('linkedin')) return <Linkedin className="w-4 h-4 text-blue-600" />;
            if (n.includes('twitter') || n.includes('x.com') || u.includes('twitter') || u.includes('x.com')) return <Twitter className="w-4 h-4 text-sky-500" />;
            if (n.includes('facebook') || u.includes('facebook')) return <Facebook className="w-4 h-4 text-blue-700" />;
            if (n.includes('instagram') || u.includes('instagram')) return <Instagram className="w-4 h-4 text-pink-600" />;
            if (n.includes('youtube') || u.includes('youtube')) return <Youtube className="w-4 h-4 text-red-600" />;
            return <Globe className="w-4 h-4 text-[#166534]" />;
          };

          const handleSaveSocial = () => {
            if (!footerSocialForm.name.trim() || !footerSocialForm.url.trim()) return;
            let updatedList = [...currentSocialLinks];
            if (editingFooterSocialIdx !== null && editingFooterSocialIdx >= 0) {
              updatedList[editingFooterSocialIdx] = {
                ...updatedList[editingFooterSocialIdx],
                name: footerSocialForm.name.trim(),
                url: footerSocialForm.url.trim()
              };
            } else {
              updatedList.push({
                id: 'soc-' + Date.now().toString(36),
                name: footerSocialForm.name.trim(),
                url: footerSocialForm.url.trim()
              });
            }
            setFormData({
              ...formData,
              footerConfig: {
                ...formData.footerConfig!,
                socialLinks: updatedList
              }
            });
            setIsFooterSocialModalOpen(false);
            setEditingFooterSocialIdx(null);
            setFooterSocialForm({ name: '', url: '' });
          };

          const handleDeleteSocial = (idx: number) => {
            const updated = currentSocialLinks.filter((_, i) => i !== idx);
            setFormData({
              ...formData,
              footerConfig: {
                ...formData.footerConfig!,
                socialLinks: updated
              }
            });
          };

          const handleUpdateCol2Link = (idx: number, newLabel: string) => {
            const updated = [...currentCol2Links];
            updated[idx] = { ...updated[idx], label: newLabel };
            setFormData({
              ...formData,
              footerConfig: { ...formData.footerConfig!, col2Links: updated }
            });
          };

          const handleUpdateCol3Link = (idx: number, newLabel: string) => {
            const updated = [...currentCol3Links];
            updated[idx] = { ...updated[idx], label: newLabel };
            setFormData({
              ...formData,
              footerConfig: { ...formData.footerConfig!, col3Links: updated }
            });
          };

          const newsletterActive = formData.footerConfig?.newsletterActive !== false;

          return (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Title */}
              <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#B2E2C5]/30 text-[#166534]">
                      <Globe className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">
                      Footer, Newsletter, Navigation Columns & Legal Policy Manager
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage all elements of your website footer: Newsletter banner, Company tagline & addresses, Navigation column titles and links, Social media channels (add/edit/delete), and Legal policies.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#B2E2C5]/20 text-[#166534] border border-[#B2E2C5]/50 shrink-0 self-start md:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
                  <span>5 Column Layout Active</span>
                </span>
              </div>

              {/* PART 1: TOP NEWSLETTER SUBSCRIPTION BANNER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                      1. Top Newsletter Subscription Banner
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Panoramic subscription strip displayed at the top of the footer across the website.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={newsletterActive}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, newsletterActive: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#166534] rounded-md focus:ring-[#86C59E] accent-[#166534]"
                    />
                    <span className="text-xs font-bold text-slate-800">Display Newsletter Banner</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Newsletter Banner Headline
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.newsletterTitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, newsletterTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#86C59E]"
                      placeholder="Subscribe To Our Quarterly Newsletter"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Subscribe Button Label Text
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.newsletterBtnText || 'Subscribe'}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, newsletterBtnText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] focus:outline-none focus:border-[#86C59E]"
                      placeholder="Subscribe"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Newsletter Subtitle Description
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.newsletterSubtitle || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, newsletterSubtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#86C59E]"
                      placeholder="Receive direct mill pricing updates, material innovation whitepapers, and California SB 54 regulatory packaging briefs."
                    />
                  </div>
                </div>

                {/* Direct Image File Import for Newsletter Background */}
                <div className="pt-2">
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
                </div>
              </div>

              {/* PART 2: COLUMN 1: BRAND TAGLINE & ADDRESS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    2. Column 1: Brand Wordmark, Tagline & Direct Facility Contacts
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Positioned on the left side under the Ecotex brand logo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Footer Brand Sub-tagline
                    </label>
                    <textarea
                      rows={2}
                      value={formData.footerConfig?.tagline || formData.footerTagline || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerTagline: e.target.value,
                        footerConfig: { ...formData.footerConfig!, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                      placeholder="Direct manufacturer of certified circular non-woven, compostable bio-PLA, and insulated wholesale packaging for global commercial enterprise."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      US Facility Address (Displayed in Footer)
                    </label>
                    <input
                      type="text"
                      value={formData.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881'}
                      onChange={(e) => setFormData({
                        ...formData,
                        facilityAddress: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#86C59E]"
                      placeholder="1200 Industrial Parkway, Corona, CA 92881"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Official Contact Email (Displayed in Footer)
                    </label>
                    <input
                      type="email"
                      value={formData.email || 'orders@ecotexinc.com'}
                      onChange={(e) => setFormData({
                        ...formData,
                        email: e.target.value
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] focus:outline-none focus:border-[#86C59E]"
                      placeholder="orders@ecotexinc.com"
                    />
                  </div>
                </div>
              </div>

              {/* PART 3: COLUMNS 2, 3 & 4: NAVIGATION TITLES & LINKS */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    3. Columns 2, 3 & 4: Navigation Column Titles & Link Items
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customize the 3 column headers and individual link labels displayed in the center of the footer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Column 2: ECOTEX */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Column 2 Header Title
                      </label>
                      <input
                        type="text"
                        value={formData.footerConfig?.col1Title || 'ECOTEX'}
                        onChange={(e) => setFormData({
                          ...formData,
                          footerConfig: { ...formData.footerConfig!, col1Title: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-900 bg-white tracking-wider uppercase focus:outline-none focus:border-[#86C59E]"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/80">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase">Default Links:</span>
                      <div className="text-slate-600 font-mono text-[11px] space-y-0.5">
                        <div>• Home</div>
                        <div>• About</div>
                        <div>• Shop</div>
                        <div>• Contact</div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: SERVICES */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Column 3 Header Title
                      </label>
                      <input
                        type="text"
                        value={formData.footerConfig?.col2Title || 'SERVICES'}
                        onChange={(e) => setFormData({
                          ...formData,
                          footerConfig: { ...formData.footerConfig!, col2Title: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-900 bg-white tracking-wider uppercase focus:outline-none focus:border-[#86C59E]"
                      />
                    </div>
                    <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase">Link Items:</span>
                      {currentCol2Links.map((link, idx) => (
                        <input
                          key={link.id || idx}
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateCol2Link(idx, e.target.value)}
                          className="w-full px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-medium text-slate-800 bg-white focus:outline-none focus:border-[#86C59E]"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Column 4: EVENTS */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Column 4 Header Title
                      </label>
                      <input
                        type="text"
                        value={formData.footerConfig?.col3Title || 'EVENTS'}
                        onChange={(e) => setFormData({
                          ...formData,
                          footerConfig: { ...formData.footerConfig!, col3Title: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-900 bg-white tracking-wider uppercase focus:outline-none focus:border-[#86C59E]"
                      />
                    </div>
                    <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase">Link Items:</span>
                      {currentCol3Links.map((link, idx) => (
                        <input
                          key={link.id || idx}
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateCol3Link(idx, e.target.value)}
                          className="w-full px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-medium text-slate-800 bg-white focus:outline-none focus:border-[#86C59E]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PART 4: COLUMN 5: SOCIAL MEDIA CHANNELS (FOLLOW) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider flex items-center gap-2">
                      <span>4. Social Media Channel Links (FOLLOW Column)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {currentSocialLinks.length} Configured
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Add, edit, or remove social media links. Official brand icons are automatically detected from the name or URL.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingFooterSocialIdx(null);
                      setFooterSocialForm({ name: '', url: '' });
                      setIsFooterSocialModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#166534] text-white hover:bg-[#14532d] text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Social Media Link</span>
                  </button>
                </div>

                {/* Social Media Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentSocialLinks.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#86C59E] transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                          {getSocialIcon(item.name, item.url)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">
                            {item.url}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFooterSocialIdx(idx);
                            setFooterSocialForm({ name: item.name, url: item.url });
                            setIsFooterSocialModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Edit social media link"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSocial(idx)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                          title="Remove social media link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART 5: BOTTOM LEGAL BAR & NOTICES */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    5. Bottom Legal Bar & Official Copyright Notice
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Positioned at the very bottom divider line of the website.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Terms & Conditions Link Text
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.termsNotice || 'TERMS & CONDITIONS'}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, termsNotice: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#86C59E] uppercase tracking-wider"
                      placeholder="TERMS & CONDITIONS"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Privacy Policy Link Text
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.privacyNotice || 'PRIVACY POLICY'}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, privacyNotice: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#86C59E] uppercase tracking-wider"
                      placeholder="PRIVACY POLICY"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Sitemap Link Text
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.sitemapNotice || 'SITEMAP'}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, sitemapNotice: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="SITEMAP"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Official Legal Copyright Notice
                    </label>
                    <input
                      type="text"
                      value={formData.footerConfig?.copyrightNotice || formData.copyrightNotice || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        copyrightNotice: e.target.value,
                        footerConfig: { ...formData.footerConfig!, copyrightNotice: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="Copyright 2026 © Ecotex Inc. All rights reserved."
                    />
                  </div>
                </div>
              </div>

              {/* PART 6: FULL LEGAL AGREEMENTS CONTENT (TERMS & PRIVACY) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#B2E2C5]/50 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                    6. Full Legal Policies & Compliance Content
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Edit the comprehensive Terms & Conditions policy narrative and California SB 54 privacy disclosure text.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Terms of Service & Wholesale Policies Agreement
                    </label>
                    <textarea
                      rows={5}
                      value={formData.footerConfig?.termsContent || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, termsContent: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-normal text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="All wholesale purchases from Ecotex Inc. are subject to pallet freight terms and California SB 54 regulatory compliance standards..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">
                      Privacy Policy & Enterprise Data Protection
                    </label>
                    <textarea
                      rows={5}
                      value={formData.footerConfig?.privacyContent || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        footerConfig: { ...formData.footerConfig!, privacyContent: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-normal text-slate-700 bg-white focus:outline-none focus:border-[#86C59E]"
                      placeholder="Ecotex Inc. respects your commercial privacy. Client artwork and custom flexo printing dies remain the exclusive intellectual property of the purchaser..."
                    />
                  </div>
                </div>
              </div>

              {/* SOCIAL MEDIA POPUP MODAL */}
              {isFooterSocialModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">
                          {editingFooterSocialIdx !== null ? 'Edit Social Media Link' : 'Add Social Media Link'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFooterSocialModalOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Platform / App Name *
                        </label>
                        <input
                          type="text"
                          value={footerSocialForm.name}
                          onChange={(e) => setFooterSocialForm({ ...footerSocialForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#86C59E]"
                          placeholder="e.g. LinkedIn, TikTok, WhatsApp, Facebook"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Official Profile / Channel URL *
                        </label>
                        <input
                          type="url"
                          value={footerSocialForm.url}
                          onChange={(e) => setFooterSocialForm({ ...footerSocialForm, url: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#86C59E]"
                          placeholder="https://linkedin.com/company/ecotexinc"
                        />
                      </div>

                      {/* Real-time Icon Detection Preview */}
                      {footerSocialForm.name && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Detected Icon:</span>
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center">
                            {getSocialIcon(footerSocialForm.name, footerSocialForm.url)}
                          </div>
                          <span className="font-semibold text-slate-800">{footerSocialForm.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsFooterSocialModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSocial}
                        disabled={!footerSocialForm.name.trim() || !footerSocialForm.url.trim()}
                        className="px-5 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#14532d] disabled:opacity-40 transition-colors shadow-xs"
                      >
                        {editingFooterSocialIdx !== null ? 'Save Changes' : 'Add Link'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

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
