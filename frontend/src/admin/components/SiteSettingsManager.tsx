'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Upload, 
  Globe, 
  User, 
  Lock, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  AlertCircle, 
  Eye, 
  Image as ImageIcon, 
  Megaphone, 
  DollarSign, 
  Truck, 
  Layers, 
  ExternalLink,
  Key,
  LogOut,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SiteSettings, LogoConfig, OrderNotificationsConfig, ShippingConfig, FooterConfig } from '../../types';
import { BASE_URL, apiService } from '../../services/apiService';

interface SiteSettingsManagerProps {
  onLogout?: () => void;
}

type SettingsTab = 'identity' | 'shipping' | 'footer' | 'commerce' | 'announcement' | 'business' | 'account';

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({ onLogout }) => {
  const { siteSettings, updateSiteSettings, adminUser, logout } = useStore();

  // Local Form State initialized from siteSettings
  const [formData, setFormData] = useState<SiteSettings>(siteSettings || {
    companyName: 'Ecotex Inc.',
    siteTitle: 'Ecotex Inc. | Wholesale Sustainable Packaging & Polypropylene Bags',
    metaDescription: 'Vertically integrated manufacturer of circular non-woven polypropylene bags, compostable blends, and reusable commercial textiles. Direct from Corona, CA.',
    tagline: 'Industrial-Grade Sustainable Packaging Solutions',
    heroTitle: 'Wholesale Sustainable Packaging & Polypropylene Bags',
    heroSubtitle: 'Direct factory pricing on lab-certified reusable non-woven bags.',
    announcement: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
    announcementActive: true,
    phone: '+1 (800) 555-ECOTEX',
    secondaryPhone: '+1 (951) 898-8800',
    email: 'sales@ecotexinc.com',
    facilityAddress: '1250 E. Ontario Ave, Corona, CA 92881',
    plantAddress: 'EcoTex Mill Facility, Corona Industrial Corridor, CA',
    minOrderNotice: 'Wholesale orders require MOQ of 500 units per custom imprint run',
    leadTimeBlank: '48-72 Hours',
    leadTimeCustom: '10-14 Business Days',
    logoConfig: {
      wordmarkPrefix: 'ECO',
      wordmarkSuffix: 'TEX',
      badgeText: 'INC.',
      subtitle: 'SUSTAINABLE PACKAGING',
      faviconUrl: '/favicon.ico',
      customLogoUrl: ''
    }
  });

  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Account management state
  const [adminName, setAdminName] = useState(adminUser?.name || 'Operations Director');
  const [adminEmail, setAdminEmail] = useState(adminUser?.email || 'admin@ecotexinc.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Favicon upload ref
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  const [faviconUploading, setFaviconUploading] = useState(false);

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && siteSettings && Object.keys(siteSettings).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...siteSettings,
        logoConfig: {
          ...prev.logoConfig,
          ...(siteSettings.logoConfig || {})
        }
      }));
      isInitialized.current = true;
    }
  }, [siteSettings]);

  // Toast auto-dismiss
  useEffect(() => {
    if (saveToast.show) {
      const timer = setTimeout(() => {
        setSaveToast(prev => ({ ...prev, show: false }));
      }, 3500);
return () => clearTimeout(timer);
    }
  }, [saveToast.show]);

  // Generic Field Updater with Cross-Field Sync
  const handleFieldChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      if (field === 'whatsappNumber') {
        updates.orderNotifications = {
          emailEnabled: prev.orderNotifications?.emailEnabled ?? true,
          notificationEmail: prev.orderNotifications?.notificationEmail || prev.email || 'orders@ecotexinc.com',
          whatsappEnabled: prev.orderNotifications?.whatsappEnabled ?? true,
          whatsappGreeting: prev.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront',
          autoOpenWhatsapp: prev.orderNotifications?.autoOpenWhatsapp ?? true,
          ...(prev.orderNotifications || {}),
          whatsappNumber: value
        };
      } else if (field === 'email' || field === 'supportEmail') {
        updates.email = value;
        updates.supportEmail = value;
        updates.orderNotifications = {
          emailEnabled: prev.orderNotifications?.emailEnabled ?? true,
          whatsappEnabled: prev.orderNotifications?.whatsappEnabled ?? true,
          whatsappNumber: prev.orderNotifications?.whatsappNumber || prev.whatsappNumber || prev.phone || '+1 (951) 450-9773',
          whatsappGreeting: prev.orderNotifications?.whatsappGreeting || 'New Wholesale Order Received on EcoTex Storefront',
          autoOpenWhatsapp: prev.orderNotifications?.autoOpenWhatsapp ?? true,
          ...(prev.orderNotifications || {}),
          notificationEmail: value
        };
      }
      return { ...prev, ...updates };
    });
  };

  // Nested LogoConfig Updater
  const handleLogoConfigChange = (field: keyof LogoConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      logoConfig: {
        ...(prev.logoConfig || {}),
        [field]: value
      }
    }));
  };

    // Shipping & Fulfillment Updater
  const handleShippingChange = (field: keyof ShippingConfig, value: any) => {
    setFormData(prev => {
      const updatedShipping = {
        ...(prev.shippingConfig || {
          freeShippingThreshold: 1000,
          standardShippingRate: 50,
          expressShippingRate: 120,
          estimatedTransitDays: '3-5 Business Days (Continental US)',
          freightCarrier: 'Direct LTL Pallet Freight (FedEx Freight / R+L Carriers / Old Dominion)',
          shippingPolicyNotice: 'All wholesale pallet orders ship FOB Corona, CA warehouse. Shrink-wrapped with corner guards on 40x48 heat-treated pallets.',
          warehouseHub: 'Corona Distribution & Fulfillment Center, 1200 Industrial Parkway, Corona, CA 92881',
          localPickupAvailable: true,
          sampleDispatchNotice: 'Free fabric swatches & physical sample bags dispatched within 24 hours via USPS Priority Mail.'
        }),
        [field]: value
      };
      const extraUpdates: Partial<SiteSettings> = { shippingConfig: updatedShipping };
      if (field === 'freeShippingThreshold') {
        extraUpdates.quoteCalcConfig = {
          plateFee: prev.quoteCalcConfig?.plateFee ?? 120,
          freeFreightThreshold: Number(value),
          leadTimeBlank: prev.quoteCalcConfig?.leadTimeBlank ?? '2-4 Business Days',
          leadTimeCustom: prev.quoteCalcConfig?.leadTimeCustom ?? '10-14 Business Days'
        };
      }
      return { ...prev, ...extraUpdates };
    });
  };

  // Footer & Legal Configuration Updater
  const handleFooterChange = (field: keyof FooterConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      footerConfig: {
        ...(prev.footerConfig || {
          newsletterTitle: 'Subscribe To Our Quarterly Newsletter',
          newsletterSubtitle: 'Receive direct mill pricing updates, material innovation whitepapers, and California SB 54 regulatory packaging briefs.',
          newsletterBgImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
          newsletterBtnText: 'Subscribe',
          newsletterActive: true,
          tagline: 'Direct manufacturer of certified circular non-woven, compostable bio-PLA, and insulated wholesale packaging for global commercial enterprise.',
          copyrightNotice: 'Copyright 2026 © Ecotex Inc. All rights reserved.',
          col1Title: 'ECOTEX',
          col2Title: 'SERVICES',
          col3Title: 'EVENTS',
          socialTwitter: 'https://twitter.com',
          socialFacebook: 'https://facebook.com',
          socialLinkedin: 'https://linkedin.com',
          socialInstagram: 'https://instagram.com',
          socialYoutube: 'https://youtube.com',
          termsNotice: 'TERMS & CONDITIONS',
          privacyNotice: 'PRIVACY POLICY',
          sitemapNotice: 'SITEMAP'
        }),
        [field]: value
      }
    }));
  };

  // Favicon File Upload
  const handleFaviconUpload = async (file: File) => {
    if (!file) return;
    setFaviconUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: uploadFormData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url || data.filePath;
        handleLogoConfigChange('faviconUrl', uploadedUrl);

        // Immediate dynamic update of link rel="icon"
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = uploadedUrl;
      } else {
        // Fallback to base64 data url
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Url = e.target?.result as string;
          handleLogoConfigChange('faviconUrl', base64Url);
          let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
          if (link) link.href = base64Url;
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Favicon upload server error, falling back to FileReader:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        handleLogoConfigChange('faviconUrl', base64Url);
      };
      reader.readAsDataURL(file);
    } finally {
      setFaviconUploading(false);
    }
  };

  // Save Settings to Backend and Global Store
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 1. Persist to API Server atomically
      const updated = await apiService.updateSettings(formData);

      // 2. Update Global Zustand Store and LocalStorage
      updateSiteSettings(updated || formData);

      // 3. Dispatch live storefront update
      window.dispatchEvent(new CustomEvent('ecotex_homepage_updated', {
        detail: { settings: updated || formData }
      }));

      // 3. Immediately reflect siteTitle and favicon in the current browser tab
      if (formData.siteTitle) {
        document.title = formData.siteTitle;
      }
      if (formData.logoConfig?.faviconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) link.href = formData.logoConfig.faviconUrl;
      }

      setSaveToast({
        show: true,
        message: 'Site settings and preferences updated successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error saving site settings:', err);
      setSaveToast({
        show: true,
        message: 'Saved locally, but failed to synchronize with backend server.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update Admin Profile Info
  const handleUpdateAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...(adminUser || {}),
      name: adminName.trim(),
      email: adminEmail.trim(),
      role: 'Super Admin'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecotex_admin_user', JSON.stringify(updatedUser));
      sessionStorage.setItem('ecotex_admin_user', JSON.stringify(updatedUser));
    }
    useStore.setState({ adminUser: updatedUser });

    setSaveToast({
      show: true,
      message: 'Admin account details updated successfully!',
      type: 'success'
    });
  };

  // Change Admin Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    // In this CMS, credentials are stored in admin credentials store / local token
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecotex_admin_pass_hash', btoa(newPassword));
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage({ type: 'success', text: 'Password successfully changed! Use your new credentials for next login.' });
  };

  const settingsTabs: { id: SettingsTab; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'identity', label: 'Site Identity & SEO', desc: 'Brand title, favicon & SEO meta', icon: Globe },
    { id: 'account', label: 'Admin Security', desc: 'Password & administrator credentials', icon: User },
    { id: 'announcement', label: 'Header Announcement', desc: 'Top notice banner & alerts', icon: Megaphone },
    { id: 'business', label: 'Business & Contacts', desc: 'Facility addresses & phone lines', icon: Building2 },
    { id: 'shipping', label: 'Shipping & Fulfillment', desc: 'Free threshold, rates & logistics', icon: Truck },
    { id: 'footer', label: 'Footer & Policies', desc: 'Newsletter, links & copyright', icon: Layers },
    { id: 'commerce', label: 'Store Defaults', desc: 'Order limits, plates & lead times', icon: DollarSign }
  ];

  const currentFavicon = formData.logoConfig?.faviconUrl || '/favicon.ico';
  const currentTitle = formData.siteTitle || formData.companyName || 'Ecotex Inc.';

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">

      {/* Floating Toast Notification */}
      {saveToast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold animate-fadeInUp ${
          saveToast.type === 'success' 
            ? 'bg-[#166534] text-white border-emerald-400/40 shadow-emerald-950/20' 
            : 'bg-red-700 text-white border-red-400/40 shadow-red-950/20'
        }`}>
          {saveToast.type === 'success' ? <Check className="w-5 h-5 stroke-[2.5]" /> : <AlertCircle className="w-5 h-5" />}
          <span>{saveToast.message}</span>
        </div>
      )}

      {/* Top Header Card & Quick Action Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#B2E2C5]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-[#dcfce7] text-[#166534]">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-[#166534]">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0f172a] uppercase">
            Site & Account Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
            Configure site metadata, favicon, browser title, administrator account details, and core store preferences.
          </p>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Save className="w-4 h-4 shrink-0" />}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left Sticky Vertical Navigation Sidebar + Right Content Panel */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sticky Vertical Navigation Sidebar */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 space-y-3">
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#B2E2C5]/50 shadow-xs">
            <div className="px-3 py-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Settings Menu
                </span>
                <span className="text-xs font-bold text-slate-900">
                  System Preferences
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#166534] bg-emerald-100/80 border border-emerald-300/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                {settingsTabs.length} Tabs
              </span>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-thin">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-w-[190px] lg:w-full text-left border group ${
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
        <div className="flex-1 min-w-0 w-full space-y-6">
      {/* ========================================================
          TAB 1: SITE IDENTITY & SEO (FAVICON, SITE TITLE, META)
         ======================================================== */}
      {activeTab === 'identity' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 1. Live Browser Tab Mockup Preview */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Browser Tab Mockup
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Chrome / Edge / Safari View</span>
            </div>

            {/* Window Browser Chrome simulation */}
            <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800/80 max-w-xl">
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="bg-slate-900 rounded-xl px-4 py-2 flex items-center gap-3 border border-slate-800 shadow-inner">
                {/* Simulated Favicon */}
                <div className="w-4 h-4 rounded-xs shrink-0 flex items-center justify-center overflow-hidden bg-white/10">
                  <img 
                    src={currentFavicon} 
                    alt="Favicon" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback icon visualizer
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                {/* Simulated Tab Title */}
                <span className="text-xs font-medium text-slate-200 truncate">
                  {currentTitle}
                </span>
                <span className="ml-auto text-[10px] text-slate-500">×</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 6 cols: Favicon Upload & Configuration */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#166534]" />
                  Website Favicon
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The micro icon shown in browser tabs, bookmarks, and mobile shortcut tiles (Recommended: 32×32 or 64×64 PNG / ICO / SVG).
                </p>
              </div>

              {/* Favicon Preview & Action Row */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#f8faf8] border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-xs shrink-0 relative group">
                  <img 
                    src={currentFavicon} 
                    alt="Favicon Preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', '/favicon.ico');
                    }}
                  />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <input
                    type="file"
                    ref={faviconFileInputRef}
                    accept="image/png, image/x-icon, image/svg+xml, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFaviconUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => faviconFileInputRef.current?.click()}
                      disabled={faviconUploading}
                      className="px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{faviconUploading ? 'Uploading...' : 'Upload File'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">Supports .ico, .png, .svg, .webp</p>
                </div>
              </div>

              {/* Direct URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Direct Favicon URL
                </label>
                <input
                  type="text"
                  value={formData.logoConfig?.faviconUrl || ''}
                  onChange={(e) => handleLogoConfigChange('faviconUrl', e.target.value)}
                  placeholder="https://example.com/favicon.png or /favicon.ico"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Standard Brand Icon Presets
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Green Bag Icon', url: '/images/bag-green.png' },
                    { label: 'Classic Favicon', url: '/favicon.ico' },
                    { label: 'Orange Bag Icon', url: '/images/bag-orange.png' },
                    { label: 'Black Bag Icon', url: '/images/bag-black.png' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLogoConfigChange('faviconUrl', preset.url)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#166534] text-left text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                    >
                      <img src={preset.url} alt="" className="w-5 h-5 object-contain" />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 6 cols: Site Title & Google SEO Snippet */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#166534]" />
                  Browser & SEO Site Title
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The primary HTML title tag shown in search engine results and the browser title bar.
                </p>
              </div>

              {/* Site Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Site Title *
                  </label>
                  <span className={`text-[10px] font-mono ${(formData.siteTitle?.length || 0) > 65 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.siteTitle?.length || 0} / 60-70 characters
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.siteTitle || ''}
                  onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                  placeholder="Ecotex Inc. | Wholesale Sustainable Packaging & Polypropylene Bags"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                />
              </div>

              {/* Meta Description Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Meta Description (Search Snippet)
                  </label>
                  <span className={`text-[10px] font-mono ${(formData.metaDescription?.length || 0) > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {formData.metaDescription?.length || 0} / 155-160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.metaDescription || ''}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  placeholder="Vertically integrated manufacturer of circular non-woven polypropylene bags..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Google Search Engine Result Preview */}
              <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Google Search Engine Snippet Preview
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">ecotexinc.com</span>
                  <span>› wholesale › packaging</span>
                </div>
                <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                  {currentTitle}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {formData.metaDescription || 'High-capacity reusable non-woven polypropylene bags engineered for enterprise retail and FMCG compliance.'}
                </p>
              </div>

            </div>

          </div>

          {/* Site Wordmark & Logo Typography */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Brand Wordmark Typography (Header & Navbar Logo)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Wordmark Prefix</label>
                <input
                  type="text"
                  value={formData.logoConfig?.wordmarkPrefix || 'ECO'}
                  onChange={(e) => handleLogoConfigChange('wordmarkPrefix', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Wordmark Suffix</label>
                <input
                  type="text"
                  value={formData.logoConfig?.wordmarkSuffix || 'TEX'}
                  onChange={(e) => handleLogoConfigChange('wordmarkSuffix', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Badge Tag</label>
                <input
                  type="text"
                  value={formData.logoConfig?.badgeText || 'INC.'}
                  onChange={(e) => handleLogoConfigChange('badgeText', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 2: ADMIN ACCOUNT & SECURITY
         ======================================================== */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Left Column: Account Profile Details */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] text-white flex items-center justify-center font-black text-xl shadow-md">
                AD
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f172a]">
                  {adminName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {adminEmail}
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Administrator</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateAdminProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0f172a] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Update Profile Info
              </button>
            </form>

            {/* Logout Action */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sign Out of Session</h4>
                <p className="text-[11px] text-slate-500">Safely log out of this browser</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onLogout) onLogout();
                }}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Column: Change Password */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#166534]" />
                Security & Password
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Update the administrator master credentials for accessing `/admin`.
              </p>
            </div>

            {passwordMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passwordMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {passwordMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Change Admin Password
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================
          TAB 4: HEADER & ANNOUNCEMENT BAR
         ======================================================== */}
      {activeTab === 'announcement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Top Announcement Ribbon Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Controls the top thin banner running at the very top of all customer-facing storefront pages.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8faf8] border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-900">Show Announcement Bar</p>
              <p className="text-[11px] text-slate-500">Enable or hide the announcement bar across all storefront pages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementActive !== false}
                onChange={(e) => handleFieldChange('announcementActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]" />
            </label>
          </div>

          {/* Announcement Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Announcement Message
            </label>
            <input
              type="text"
              value={formData.announcement || ''}
              onChange={(e) => handleFieldChange('announcement', e.target.value)}
              placeholder="🌱 Certified Recycled & Compostable Wholesale Packaging..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
            />
          </div>

          {/* Header Action Button & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Header CTA Button Text
              </label>
              <input
                type="text"
                value={formData.navbarConfig?.ctaButtonText || formData.heroButtonText || 'START SHOP'}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    heroButtonText: e.target.value,
                    navbarConfig: {
                      ...(prev.navbarConfig || { announcementText: '', announcementActive: true, phoneDisplay: '', ctaButtonText: '' }),
                      ctaButtonText: e.target.value
                    }
                  }));
                }}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Header Support Phone Display
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: BUSINESS & MILL CONTACTS
         ======================================================== */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] uppercase tracking-wide">
              Corporate Headquarters & Contact Details
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Used in footer credentials, quote proposals, contact forms, and email notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Legal Name
              </label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Primary Sales & Support Email</span>
                <span className="text-[10px] text-[#166534] font-bold">Email Inquiries</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Official Desk WhatsApp Number</span>
                <span className="text-[10px] text-[#25D366] font-bold">Website Floating Button</span>
              </label>
              <input
                type="text"
                placeholder="+1 (951) 450-9773 or +92 330 8738606"
                value={formData.whatsappNumber || formData.orderNotifications?.whatsappNumber || ''}
                onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#25D366] focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Toll-Free Phone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Factory Mill Line (Secondary)
              </label>
              <input
                type="text"
                value={formData.secondaryPhone || ''}
                onChange={(e) => handleFieldChange('secondaryPhone', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Corporate Facility Address
              </label>
              <input
                type="text"
                value={formData.facilityAddress || ''}
                onChange={(e) => handleFieldChange('facilityAddress', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manufacturing Plant Address
              </label>
              <input
                type="text"
                value={formData.plantAddress || ''}
                onChange={(e) => handleFieldChange('plantAddress', e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB: SHIPPING & FULFILLMENT
         ======================================================== */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#166534] mb-1">
              <Truck className="w-4 h-4" />
              <span>Logistics & Fulfillment</span>
            </div>
            <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">
              Shipping & Delivery Rates
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure free freight qualifications, standard carrier fees, estimated transit windows, and warehouse dispatch policies.
            </p>
          </div>

          {/* Section 1: Freight Pricing Rules */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#166534]" />
              <span>Wholesale Freight & Order Calculations</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Free Shipping Subtotal Threshold ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.shippingConfig?.freeShippingThreshold ?? 1000}
                    onChange={(e) => handleShippingChange('freeShippingThreshold', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-slate-800"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Orders equal or greater qualify for 100% free pallet freight.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Standard Flat Freight Rate ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={formData.shippingConfig?.standardShippingRate ?? 50}
                    onChange={(e) => handleShippingChange('standardShippingRate', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-slate-800"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Applied at checkout when cart subtotal is under threshold.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Express Expedited Rate ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.shippingConfig?.expressShippingRate ?? 120}
                    onChange={(e) => handleShippingChange('expressShippingRate', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-slate-800"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  For priority freight rush orders requested via quotation.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Carriers & Dispatch Origin */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#166534]" />
              <span>Origin Hub & Freight Carriers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estimated Delivery / Transit Window
                </label>
                <input
                  type="text"
                  value={formData.shippingConfig?.estimatedTransitDays ?? '3-5 Business Days (Continental US)'}
                  onChange={(e) => handleShippingChange('estimatedTransitDays', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="e.g. 3-5 Business Days (Continental US)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Designated Freight Carriers
                </label>
                <input
                  type="text"
                  value={formData.shippingConfig?.freightCarrier ?? 'Direct LTL Pallet Freight (FedEx Freight / R+L / Old Dominion)'}
                  onChange={(e) => handleShippingChange('freightCarrier', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="e.g. FedEx Freight, R+L Carriers"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Distribution & Warehouse Hub
                </label>
                <input
                  type="text"
                  value={formData.shippingConfig?.warehouseHub ?? 'Corona Distribution & Fulfillment Center, 1200 Industrial Parkway, Corona, CA 92881'}
                  onChange={(e) => handleShippingChange('warehouseHub', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Allow Free Local Warehouse Dock Pickup (Will-Call)</span>
                  <span className="text-[11px] text-slate-400">Allows commercial enterprise buyers in Southern California to dispatch their own trucks.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleShippingChange('localPickupAvailable', !formData.shippingConfig?.localPickupAvailable)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${formData.shippingConfig?.localPickupAvailable ? 'bg-[#166534]' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${formData.shippingConfig?.localPickupAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Wholesale Freight & Sample Policies */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#166534]" />
              <span>Freight Policy Notice & Swatch Dispatch</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wholesale Freight Policy Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.shippingConfig?.shippingPolicyNotice ?? 'All wholesale pallet orders ship FOB Corona, CA warehouse. Shrink-wrapped with corner guards on 40x48 heat-treated pallets.'}
                  onChange={(e) => handleShippingChange('shippingPolicyNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Free Fabric Swatches & Physical Sample Dispatch Notice
                </label>
                <input
                  type="text"
                  value={formData.shippingConfig?.sampleDispatchNotice ?? 'Free fabric swatches & physical sample bags dispatched within 24 hours via USPS Priority Mail.'}
                  onChange={(e) => handleShippingChange('sampleDispatchNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

{/* ========================================================
          TAB: FOOTER & LEGAL
         ======================================================== */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#166534] mb-1">
              <Layers className="w-4 h-4" />
              <span>Site-Wide Footer & Legal</span>
            </div>
            <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">
              Footer Configuration & Policies
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage the top newsletter CTA banner, footer columns, social channels, legal links, and copyright notices.
            </p>
          </div>

          {/* Section 1: Newsletter Subscription Banner */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#166534]" />
                  <span>Newsletter Subscription Strip</span>
                </h4>
                <span className="text-[11px] text-slate-400">Full-width photographic subscription banner right above the footer columns.</span>
              </div>
              <button
                type="button"
                onClick={() => handleFooterChange('newsletterActive', formData.footerConfig?.newsletterActive === false ? true : false)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${formData.footerConfig?.newsletterActive !== false ? 'bg-[#166534]' : 'bg-slate-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${formData.footerConfig?.newsletterActive !== false ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Headline Title
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterTitle ?? 'Subscribe To Our Quarterly Newsletter'}
                  onChange={(e) => handleFooterChange('newsletterTitle', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subscribe Button Text
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterBtnText ?? 'Subscribe'}
                  onChange={(e) => handleFooterChange('newsletterBtnText', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Subtitle / Value Proposition
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.newsletterSubtitle ?? 'Receive direct mill pricing updates, material innovation whitepapers, and California SB 54 regulatory packaging briefs.'}
                  onChange={(e) => handleFooterChange('newsletterSubtitle', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Newsletter Background Image URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formData.footerConfig?.newsletterBgImage ?? 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80'}
                    onChange={(e) => handleFooterChange('newsletterBgImage', e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  />
                  {formData.footerConfig?.newsletterBgImage && (
                    <img
                      src={formData.footerConfig.newsletterBgImage}
                      alt="Newsletter preview"
                      className="w-16 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Footer Brand Description & Tagline */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#166534]" />
              <span>Footer Brand Mission & Tagline</span>
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Footer Mission / Bio Paragraph
              </label>
              <textarea
                rows={3}
                value={formData.footerConfig?.tagline ?? formData.tagline ?? 'Direct manufacturer of certified circular non-woven, compostable bio-PLA, and insulated wholesale packaging for global commercial enterprise.'}
                onChange={(e) => {
                  handleFooterChange('tagline', e.target.value);
                  handleFieldChange('tagline', e.target.value);
                }}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none resize-y"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Appears beneath the EcoTex logo in Column 1 of the footer.
              </span>
            </div>
          </div>

          {/* Section 3: Navigation Column Headers */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#166534]" />
              <span>Navigation Column Headers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Column 2 Title
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.col1Title ?? 'ECOTEX'}
                  onChange={(e) => handleFooterChange('col1Title', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Column 3 Title
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.col2Title ?? 'SERVICES'}
                  onChange={(e) => handleFooterChange('col2Title', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Column 4 Title
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.col3Title ?? 'EVENTS'}
                  onChange={(e) => handleFooterChange('col3Title', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Social Channels */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#166534]" />
              <span>Social Media Channel Links</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.socialLinkedin ?? formData.contactConfig?.linkedinUrl ?? 'https://linkedin.com'}
                  onChange={(e) => handleFooterChange('socialLinkedin', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="https://linkedin.com/company/ecotexinc"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Twitter / X URL
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.socialTwitter ?? formData.contactConfig?.twitterUrl ?? 'https://twitter.com'}
                  onChange={(e) => handleFooterChange('socialTwitter', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="https://twitter.com/ecotexinc"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Facebook Page URL
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.socialFacebook ?? formData.contactConfig?.facebookUrl ?? 'https://facebook.com'}
                  onChange={(e) => handleFooterChange('socialFacebook', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="https://facebook.com/ecotexinc"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.socialInstagram ?? formData.contactConfig?.instagramUrl ?? 'https://instagram.com'}
                  onChange={(e) => handleFooterChange('socialInstagram', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="https://instagram.com/ecotexinc"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  YouTube Channel URL
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.socialYoutube ?? 'https://youtube.com'}
                  onChange={(e) => handleFooterChange('socialYoutube', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="https://youtube.com/@ecotexinc"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Legal & Copyright Notices */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#166534]" />
              <span>Bottom Legal Bar & Notices</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Copyright Notice
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.copyrightNotice ?? formData.copyrightNotice ?? 'Copyright 2026 © Ecotex Inc. All rights reserved.'}
                  onChange={(e) => {
                    handleFooterChange('copyrightNotice', e.target.value);
                    handleFieldChange('copyrightNotice', e.target.value);
                  }}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Terms & Conditions Link Text
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.termsNotice ?? 'TERMS & CONDITIONS'}
                  onChange={(e) => handleFooterChange('termsNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Privacy Policy Link Text
                </label>
                <input
                  type="text"
                  value={formData.footerConfig?.privacyNotice ?? 'PRIVACY POLICY'}
                  onChange={(e) => handleFooterChange('privacyNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

{/* ========================================================
          TAB 5: COMMERCE & STORE DEFAULTS
         ======================================================== */}
      {activeTab === 'commerce' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#166534] mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Commercial Preferences</span>
            </div>
            <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">
              Store Defaults, Currency & Policies
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Default lead times, wholesale MOQ limits, store currency, sales tax, defect replacement guarantees, and sample swatch rules.
            </p>
          </div>

          {/* Section 1: Lead Times & MOQ */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#166534]" />
              <span>Production Lead Times & MOQ</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Warehouse Unbranded Dispatch Lead Time
                </label>
                <input
                  type="text"
                  value={formData.leadTimeBlank || '2-4 Business Days'}
                  onChange={(e) => handleFieldChange('leadTimeBlank', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="e.g. 2-4 Business Days"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Custom Printed Flexography Lead Time
                </label>
                <input
                  type="text"
                  value={formData.leadTimeCustom || '10-14 Business Days'}
                  onChange={(e) => handleFieldChange('leadTimeCustom', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  placeholder="e.g. 10-14 Business Days"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wholesale Minimum Order Quantity (MOQ) Notice
                </label>
                <input
                  type="text"
                  value={formData.minOrderNotice || ''}
                  onChange={(e) => handleFieldChange('minOrderNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-medium"
                  placeholder="e.g. Free pallet freight on continental US orders over $1,000"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Currency & Sales Tax */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#166534]" />
              <span>Currency & Sales Tax Settings</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.currencySymbol || '$'}
                  onChange={(e) => handleFieldChange('currencySymbol', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-bold text-center"
                  placeholder="$"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Currency Code (ISO)
                </label>
                <input
                  type="text"
                  value={formData.currencyCode || 'USD'}
                  onChange={(e) => handleFieldChange('currencyCode', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-center uppercase"
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estimated Sales Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.25"
                    value={formData.taxRatePercent ?? 0}
                    onChange={(e) => handleFieldChange('taxRatePercent', Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none font-semibold text-slate-800"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wholesale Tax Exemption & Resale Certificate Policy
                </label>
                <input
                  type="text"
                  value={formData.taxExemptionNotice || 'Valid California resale certificate required at checkout for wholesale sales tax exemption.'}
                  onChange={(e) => handleFieldChange('taxExemptionNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Guarantees & Defect Policy */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#166534]" />
              <span>Manufacturer Guarantees & Sample Kit Rules</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  30-Day Defect Replacement Guarantee Policy
                </label>
                <textarea
                  rows={2}
                  value={formData.guaranteeNotice || '100% Quality & Defect Replacement Guarantee within 30 days of shipment receipt.'}
                  onChange={(e) => handleFieldChange('guaranteeNotice', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Free Sample Swatch & Kit Procurement Policy
                </label>
                <textarea
                  rows={2}
                  value={formData.sampleKitPolicy || 'Complimentary fabric swatch ring and sample bags available for enterprise retail procurement.'}
                  onChange={(e) => handleFieldChange('sampleKitPolicy', e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none resize-y"
                />
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Bottom Sticky Action Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Configured settings will instantly apply to both admin and customer storefront.</span>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full sm:w-auto shrink-0 whitespace-nowrap flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Save className="w-4 h-4 shrink-0" />}
              <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SiteSettingsManager;
