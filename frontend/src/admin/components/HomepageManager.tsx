'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home,
  Sliders, 
  Sparkles, 
  Layers, 
  Users, 
  Factory, 
  Phone, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  MapPin,
  Mail,
  Globe,
  Clock,
  ThumbsUp,
  HelpCircle,
  Linkedin,
  Twitter,
  ChevronUp,
  ChevronDown,
  User
} from 'lucide-react';
import { useStore, HeroConfig } from '../../store/useStore';
import { apiService } from '../../services/apiService';
import { ImageUploader } from './ImageUploader';
import { 
  VersatilityConfig, 
  AboutConfig, 
  ContactConfig, 
  FacilitiesConfig, 
  SiteSettings,
  TeamMemberConfig 
} from '../../types';

const DEFAULT_TEAM_MEMBERS: TeamMemberConfig[] = [
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

type HomepageTab = 
  | 'all'
  | 'hero' 
  | 'sustainable-fashion' 
  | 'versatility' 
  | 'about' 
  | 'facilities' 
  | 'contact';

interface HomepageManagerProps {
  onNavigateToSection?: (section: string) => void;
}

export const HomepageManager: React.FC<HomepageManagerProps> = () => {
  const { 
    heroConfig, 
    updateHeroConfig, 
    siteSettings, 
    updateSiteSettings,
    siteImages,
    updateSiteImage
  } = useStore();

  const [activeTab, setActiveTab] = useState<HomepageTab>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local draft state for Hero
  const [localHero, setLocalHero] = useState<HeroConfig>(heroConfig);

  // Local draft state for Site Settings sections
  const [localVersatility, setLocalVersatility] = useState<VersatilityConfig>(
    siteSettings?.versatilityConfig || {
      sustainableFashionTitle: 'Sustainable Fashion For A Greener Tomorrow',
      sustainableFashionSubtitle: 'Discover our eco-friendly bags made from sustainable materials. Join the movement to reduce environmental impact without compromising style!',
      featureCards: [
        { id: 'vc1', title: 'Eco-Friendly', description: 'Non-woven polypropylene bags are considered eco-friendly because they are reusable and can replace single-use plastic bags.' },
        { id: 'vc2', title: 'Durable', description: 'These bags are known for their strength and durability. They can withstand multiple uses and are capable of carrying heavy loads.' },
        { id: 'vc3', title: 'Customizable', description: 'Non-woven polypropylene bags can be easily customized with various designs, colors, and logos, making them a popular choice.' },
        { id: 'vc4', title: 'Breathable', description: 'The fabric structure allows air circulation, making it ideal for retail garments, food produce, and everyday merchandise.' }
      ],
      bannerTitle: 'Exploring The Versatility of Non-Woven PP Bags',
      bannerSubtitle: 'Dive deeper into the various styles, sizes, and designs available in non-woven polypropylene bags.',
      bannerButtonText: 'View Collection',
      bannerImage: siteImages?.facilityPhoto || '/images/versatility-banner-bg.jpg',
      bottomTrustBadges: [
        'Fast Turnaround Times',
        'A friendly, open and honest service',
        'Ethical and Fairly Traded Products',
        'Expert Customer Service'
      ]
    }
  );

  const [localAbout, setLocalAbout] = useState<AboutConfig>(
    siteSettings?.aboutConfig || {
      heroTitle: 'About Us',
      heroSubtitle: 'A sustainable future for packaging. Engineered with purpose, manufactured for impact.',
      storyTitle: 'We Are Ecotex',
      missionQuote: 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.',
      storyParagraph1: 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.',
      storyParagraph2: 'From our corporate headquarters in California to state-of-the-art automated manufacturing facilities, every product is subjected to rigorous tensile testing, automated ultrasonic seam welding, and non-toxic water-based printing. We empower grocery retailers, boutique lifestyle brands, and logistics operations across the globe to achieve zero-waste compliance with full chain-of-custody audit trails.',
      founderName: 'Rashid Mahmood',
      founderRole: 'Managing Director & Founder, Ecotex Inc.',
      founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
      workshopImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
      whyChooseUsTitle: 'Why Choose Us',
      whyChooseUsSubtitle: 'We combine German ultrasonic welding machinery, ISO 9001 certified batch audits, and non-toxic soy formulations to deliver high-capacity packaging engineered to outlast disposable plastic.',
      whyChooseUsFeatures: [
        { title: '100% Recyclable Fabrics', description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.' },
        { title: 'Easy to Customize', description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.' }
      ],
      teamSectionTitle: 'Meet Our Team',
      teamSectionSubtitle: 'The experts behind global sustainable packaging.',
      teamMembers: (siteSettings?.aboutConfig?.teamMembers && siteSettings.aboutConfig.teamMembers.length > 0)
        ? siteSettings.aboutConfig.teamMembers
        : DEFAULT_TEAM_MEMBERS
    }
  );

  const [localFacilities, setLocalFacilities] = useState<FacilitiesConfig>(
    siteSettings?.facilitiesConfig || {
      title: 'State-of-the-Art Manufacturing & Fulfillment Facilities',
      subtitle: 'Dual-continental operations combining California wholesale fulfillment with high-speed automated manufacturing mills.',
      storySnippet: 'From automated ultrasonic welding to high-definition 8-color flexographic printing, our facilities are engineered for maximum circularity and zero-landfill compliance.',
      annualCapacity: '50,000,000+ Units / Year',
      certificationsMetric: 'ISO 9001:2015 & ASTM D6400',
      activeLinesMetric: '14 High-Speed Extrusion Lines',
      showOnHomepage: true,
      bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85',
      hubs: [
        {
          name: 'Corona Distribution & Testing Hub',
          tag: 'US Headquarters & Fulfillment',
          address: '1200 Industrial Parkway, Corona, CA 92881',
          capabilities: ['Same-Day Pallet Dispatch', 'ASTM Tensile Testing Lab', 'Custom Sample Prototyping'],
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
          googleMapsUrl: 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881'
        },
        {
          name: 'Primary Manufacturing Plant',
          tag: 'Heavy Industrial Production',
          address: 'Sector 15, Korangi Industrial Area, Karachi, PK',
          capabilities: ['Automated Ultrasonic Welding', '8-Color Flexographic Printing', 'Virgin PP & Bio-PLA Extrusion'],
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
          googleMapsUrl: 'https://maps.google.com/?q=Korangi+Industrial+Area+Karachi'
        }
      ]
    }
  );

  const [localContact, setLocalContact] = useState<ContactConfig>(
    siteSettings?.contactConfig || {
      headline: "Let's Engineer Your Sustainable Wholesale Packaging Solution",
      email: siteSettings?.email || 'orders@ecotexinc.com',
      phone: siteSettings?.phone || '+1 (951) 450-9773',
      secondaryPhone: siteSettings?.secondaryPhone || '(951) 555-ECOTEX',
      facilityAddress: siteSettings?.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881',
      plantAddress: siteSettings?.plantAddress || 'Sector 15, Korangi Industrial Area, Karachi, PK',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      twitterUrl: 'https://twitter.com',
      linkedinUrl: 'https://linkedin.com',
      googleMapsUrl: 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881',
      googleMapsEmbedUrl: 'https://maps.google.com/maps?q=1200%20Industrial%20Parkway%2C%20Corona%2C%20CA%2092881&t=&z=14&ie=UTF8&iwloc=&output=embed'
    }
  );

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && siteSettings && Object.keys(siteSettings).length > 0) {
      if (siteSettings.heroConfig || (heroConfig && heroConfig.title)) {
        setLocalHero(siteSettings.heroConfig || heroConfig);
      }
      if (siteSettings.versatilityConfig) {
        setLocalVersatility(siteSettings.versatilityConfig);
      }
      if (siteSettings.aboutConfig) {
        setLocalAbout({
          ...siteSettings.aboutConfig,
          teamMembers: (siteSettings.aboutConfig.teamMembers && siteSettings.aboutConfig.teamMembers.length > 0)
            ? siteSettings.aboutConfig.teamMembers
            : DEFAULT_TEAM_MEMBERS
        });
      }
      if (siteSettings.facilitiesConfig) {
        setLocalFacilities(siteSettings.facilitiesConfig);
      }
      if (siteSettings.contactConfig) {
        setLocalContact(siteSettings.contactConfig);
      }
      isInitialized.current = true;
    }
  }, [siteSettings, heroConfig]);

  // Team Member Management Handlers
  const handleAddTeamMember = () => {
    const newMember: TeamMemberConfig = {
      id: `tm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: 'New Executive Member',
      role: 'Director of Packaging Solutions',
      bio: 'Leading sustainable packaging engineering and client supply chain sustainability.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
      email: 'team@ecotexinc.com',
      linkedin: 'https://linkedin.com',
      twitter: ''
    };
    setLocalAbout(prev => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), newMember]
    }));
  };

  const handleUpdateTeamMember = (index: number, updates: Partial<TeamMemberConfig>) => {
    setLocalAbout(prev => {
      const current = [...(prev.teamMembers || [])];
      if (current[index]) {
        current[index] = { ...current[index], ...updates };
      }
      return { ...prev, teamMembers: current };
    });
  };

  const handleDeleteTeamMember = (index: number) => {
    const current = localAbout.teamMembers || [];
    const memberName = current[index]?.name || 'this team member';
    if (!window.confirm(`Are you sure you want to remove ${memberName}?`)) return;
    setLocalAbout(prev => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter((_, i) => i !== index)
    }));
  };

  const handleMoveTeamMember = (index: number, direction: 'up' | 'down') => {
    setLocalAbout(prev => {
      const current = [...(prev.teamMembers || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const [moved] = current.splice(index, 1);
      current.splice(targetIndex, 0, moved);
      return { ...prev, teamMembers: current };
    });
  };

  // Save all homepage changes atomically to backend and store
  const handleSaveAll = async () => {
    try {
      const fullSettingsPayload: Partial<SiteSettings> = {
        ...siteSettings,
        heroTitle: localHero.title || siteSettings?.heroTitle || '',
        heroSubtitle: localHero.subtitle || siteSettings?.heroSubtitle || '',
        heroButtonText: localHero.ctaText || siteSettings?.heroButtonText || 'Shop Now',
        heroBackgroundImage: localHero.backgroundImage || '',
        heroConfig: localHero,
        versatilityConfig: localVersatility,
        aboutConfig: localAbout,
        facilitiesConfig: localFacilities,
        contactConfig: localContact,
        facilityAddress: localContact.facilityAddress,
        plantAddress: localContact.plantAddress,
        email: localContact.email,
        phone: localContact.phone,
        secondaryPhone: localContact.secondaryPhone,
        aboutTitle: localAbout.storyTitle || siteSettings?.aboutTitle,
        aboutMission: localAbout.missionQuote || siteSettings?.aboutMission,
        aboutStory: localAbout.storyParagraph1 || siteSettings?.aboutStory,
        siteImages: {
          ...(siteSettings?.siteImages || {}),
          ...(siteImages || {}),
          facilityPhoto: localVersatility.bannerImage || siteImages?.facilityPhoto || '',
          heroBag: localHero.productImage || siteImages?.heroBag || ''
        }
      };

      // 1. Send single atomic PUT request to backend
      const saved = await apiService.updateSettings(fullSettingsPayload);

      // 2. Atomically update Zustand store with confirmed saved data
      useStore.setState((state) => ({
        siteSettings: { ...state.siteSettings, ...saved },
        heroConfig: localHero,
        siteImages: fullSettingsPayload.siteImages || state.siteImages
      }));

      // 3. Persist to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ecotex_site_settings', JSON.stringify(saved));
          localStorage.setItem('ecotex_hero_config', JSON.stringify(localHero));
          if (fullSettingsPayload.siteImages) {
            localStorage.setItem('ecotex_site_images', JSON.stringify(fullSettingsPayload.siteImages));
          }
        } catch (_) {}

        // 4. Trigger cross-window live update
        window.dispatchEvent(new CustomEvent('ecotex_homepage_updated', {
          detail: { hero: localHero, settings: saved }
        }));
      }

      setSaveSuccess(true);
      setToastMessage('All Homepage sections updated & published live!');
      setTimeout(() => {
        setSaveSuccess(false);
        setToastMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to save homepage sections:', err);
      setToastMessage('Failed to save sections. Please check connection.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const tabs: { id: HomepageTab; label: string; desc: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'hero', label: 'Hero Section', desc: 'Headline, subtext & panoramic scene', icon: Sliders, badge: 'Hero' },
    { id: 'sustainable-fashion', label: 'Sustainable Fashion', desc: '4 value feature proposition cards', icon: Sparkles, badge: 'Cards' },
    { id: 'versatility', label: 'Versatility Banner', desc: 'Panoramic banner & 4 trust badges', icon: Layers, badge: 'Banner' },
    { id: 'about', label: 'About Ecotex', desc: 'Brand story, mission & founder portrait', icon: Users, badge: 'Story' },
    { id: 'facilities', label: 'Facilities & Plants', desc: 'Manufacturing plants, specs & machinery', icon: Factory, badge: 'Hubs' },
    { id: 'contact', label: 'Contact Section', desc: 'Direct mill sales, phone & Google Maps', icon: Phone, badge: 'Direct' },
  ];

  const titleLines = (localHero.title || "It's time to\npack better.").split('\n');
  return (
    <div className="space-y-8 animate-fadeInUp pb-16 font-sans text-[#0f172a] select-none">
      
      {/* ========================================================
          PAGE HEADER & PUBLISH CONTROLS
         ======================================================== */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#B2E2C5]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-[#4E9F76] text-white shadow-xs">
              <Home className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">
                Homepage Master CMS
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pura Homepage edit karein: Hero, Sustainable Fashion, Versatility, Facilities, About, aur Contact.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#B2E2C5] text-[#166534] hover:bg-[#F4F9F5] text-xs font-bold transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleSaveAll}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#166534] via-[#15803d] to-[#16a34a] hover:from-[#14532d] hover:to-[#15803d] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-98 cursor-pointer whitespace-nowrap"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Published Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span>Save All Sections</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Success Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-fadeIn border border-[#22c55e]/50">
          <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          2-COLUMN LAYOUT: LEFT CMS SIDEBAR + RIGHT CONTENT AREA
          (Matches Website Content Layout)
         ======================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sticky Vertical Navigation Sidebar */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 space-y-3">
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#B2E2C5]/50 shadow-xs">
            <div className="px-3 py-2.5 mb-2.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Homepage CMS
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Homepage Sections
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#166534] bg-emerald-100/80 border border-emerald-300/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                {tabs.length} Sections
              </span>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 min-w-[160px] xs:min-w-[180px] lg:w-full text-left border group ${
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
          TAB 1: HERO SECTION
         ======================================================== */}
      {activeTab === 'hero' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#4E9F76]" />
                  <span>1. Hero Section (Headline, Tagline & Panoramic Scene)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Customise the large opening visual at the very top of your homepage.
                </p>
              </div>
              <span className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live on Home
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Controls */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 mb-1.5">
                    <label className="block text-xs font-bold text-[#0f172a]">
                      Hero Main Headline (Title)
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Use Enter for new line. Last word highlights in green!
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={localHero.title}
                    onChange={(e) => setLocalHero({ ...localHero, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76] font-mono"
                    placeholder="It's time to&#10;pack better."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                    Hero Subtitle (Paragraph Description)
                  </label>
                  <textarea
                    rows={3}
                    value={localHero.subtitle}
                    onChange={(e) => setLocalHero({ ...localHero, subtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76] leading-relaxed"
                    placeholder="Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={localHero.ctaText || 'Shop Now'}
                      onChange={(e) => setLocalHero({ ...localHero, ctaText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                      placeholder="Shop Now"
                    />
                  </div>
                </div>

                {/* Background Image Upload */}
                <div className="pt-2 border-t border-slate-100">
                  <ImageUploader
                    label="Hero Panoramic Background Image"
                    description="Upload an image from your computer or choose from presets below."
                    value={localHero.backgroundImage || '/images/home-hero-bg.jpg'}
                    onChange={(newUrl) => setLocalHero({ ...localHero, backgroundImage: newUrl })}
                    aspectRatio="wide"
                  />
                </div>
              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Live Hero Visual Preview</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Auto-renders</span>
                </div>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-[#07170e] flex flex-col justify-center p-6 text-left group">
                  {localHero.backgroundImage && localHero.backgroundImage !== 'none' && (
                    <img 
                      src={localHero.backgroundImage} 
                      alt="Hero preview" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60" 
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {titleLines.map((line, idx) => (
                        <span key={idx} className="block">
                          {idx === titleLines.length - 1 ? (
                            <>
                              <span>{line.split(' ').slice(0, -1).join(' ')} </span>
                              <span className="text-[#4ade80] underline decoration-[#4ade80]/40">
                                {line.split(' ').slice(-1)}
                              </span>
                            </>
                          ) : (
                            line
                          )}
                        </span>
                      ))}
                    </h4>
                    <p className="text-[11px] text-slate-200 line-clamp-3 leading-relaxed">
                      {localHero.subtitle}
                    </p>
                    <div>
                      <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#22c55e] text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                        {localHero.ctaText || 'Shop Now'} →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: SUSTAINABLE FASHION FOR A GREENER TOMORROW
         ======================================================== */}
      {activeTab === 'sustainable-fashion' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#4E9F76]" />
                  <span>2. Sustainable Fashion For A Greener Tomorrow (4 Value Cards)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Section heading, subtitle, and 4 feature value proposition cards.
                </p>
              </div>
              <span className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live on Home
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Section Headline Title
                </label>
                <input
                  type="text"
                  value={localVersatility.sustainableFashionTitle}
                  onChange={(e) => setLocalVersatility({
                    ...localVersatility,
                    sustainableFashionTitle: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="Sustainable Fashion For A Greener Tomorrow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Section Subtitle Description
                </label>
                <input
                  type="text"
                  value={localVersatility.sustainableFashionSubtitle}
                  onChange={(e) => setLocalVersatility({
                    ...localVersatility,
                    sustainableFashionSubtitle: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="Discover our eco-friendly bags made from sustainable materials..."
                />
              </div>
            </div>

            {/* 4 Feature Cards */}
            <div>
              <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>4 Value Proposition Cards (Titles & Descriptions)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(localVersatility.featureCards || []).map((card, idx) => (
                  <div key={card.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-[#F4F9F5]/50 hover:bg-white transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#4E9F76] uppercase tracking-wider">
                        Feature Card #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const newCards = [...localVersatility.featureCards];
                          newCards[idx] = { ...newCards[idx], title: e.target.value };
                          setLocalVersatility({ ...localVersatility, featureCards: newCards });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#4E9F76]"
                        placeholder="e.g. Eco-Friendly, Durable"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Description</label>
                      <textarea
                        rows={3}
                        value={card.description}
                        onChange={(e) => {
                          const newCards = [...localVersatility.featureCards];
                          newCards[idx] = { ...newCards[idx], description: e.target.value };
                          setLocalVersatility({ ...localVersatility, featureCards: newCards });
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#4E9F76] leading-relaxed"
                        placeholder="Feature card explanation..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: VERSATILITY SECTION (EXPLORING THE VERSATILITY)
         ======================================================== */}
      {activeTab === 'versatility' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#4E9F76]" />
                  <span>3. Exploring The Versatility of Non-Woven PP Bags</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Large photographic panoramic banner and 4 bottom trust badges.
                </p>
              </div>
              <span className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live on Home
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Panoramic Banner Title
                </label>
                <input
                  type="text"
                  value={localVersatility.bannerTitle}
                  onChange={(e) => setLocalVersatility({ ...localVersatility, bannerTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Banner Subtitle
                </label>
                <input
                  type="text"
                  value={localVersatility.bannerSubtitle}
                  onChange={(e) => setLocalVersatility({ ...localVersatility, bannerSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={localVersatility.bannerButtonText || 'View Collection'}
                  onChange={(e) => setLocalVersatility({ ...localVersatility, bannerButtonText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                />
              </div>
            </div>

            {/* Banner Background Image */}
            <div className="pt-2 border-t border-slate-100">
              <ImageUploader
                label="Panoramic Banner Background Image"
                description="Import high-resolution lifestyle packaging or warehouse background photo from your computer."
                value={localVersatility.bannerImage}
                onChange={(newUrl) => setLocalVersatility({ ...localVersatility, bannerImage: newUrl })}
                aspectRatio="wide"
              />
            </div>

            {/* 4 Bottom Trust Badges */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider mb-3">
                4 Bottom Value Props / Trust Badges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {(localVersatility.bottomTrustBadges || []).map((badge, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Badge #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => {
                        const newBadges = [...localVersatility.bottomTrustBadges];
                        newBadges[idx] = e.target.value;
                        setLocalVersatility({ ...localVersatility, bottomTrustBadges: newBadges });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#4E9F76]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: ABOUT SECTION
         ======================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#4E9F76]" />
                  <span>4. About Ecotex Section (Brand Story & Leadership)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Mission quote, company narrative, founder message, and laboratory certification.
                </p>
              </div>
              <span className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live on Home & About
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  About Section Headline Title
                </label>
                <input
                  type="text"
                  value={localAbout.storyTitle || 'We Are Ecotex'}
                  onChange={(e) => setLocalAbout({ ...localAbout, storyTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="We Are Ecotex"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Founder Name & Title
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={localAbout.founderName || 'Rashid Mahmood'}
                    onChange={(e) => setLocalAbout({ ...localAbout, founderName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="Founder Name"
                  />
                  <input
                    type="text"
                    value={localAbout.founderRole || 'Managing Director & Founder'}
                    onChange={(e) => setLocalAbout({ ...localAbout, founderRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="Founder Role"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                Core Mission Quote (Featured in italics)
              </label>
              <textarea
                rows={2}
                value={localAbout.missionQuote}
                onChange={(e) => setLocalAbout({ ...localAbout, missionQuote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 italic bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                placeholder="We engineered our circular manufacturing framework..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Story Paragraph 1 (Heritage & Products)
                </label>
                <textarea
                  rows={4}
                  value={localAbout.storyParagraph1}
                  onChange={(e) => setLocalAbout({ ...localAbout, storyParagraph1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Story Paragraph 2 (Operations & Facilities)
                </label>
                <textarea
                  rows={4}
                  value={localAbout.storyParagraph2}
                  onChange={(e) => setLocalAbout({ ...localAbout, storyParagraph2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76] leading-relaxed"
                />
              </div>
            </div>

            {/* Photos Uploaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
              <ImageUploader
                label="Founder Portrait Photo"
                description="Upload founder portrait photo from your computer."
                value={localAbout.founderImage}
                onChange={(newUrl) => setLocalAbout({ ...localAbout, founderImage: newUrl })}
                aspectRatio="portrait"
              />

              <ImageUploader
                label="Factory Workshop / Lab Collaboration Photo"
                description="Upload quality testing / engineering photo."
                value={localAbout.workshopImage}
                onChange={(newUrl) => setLocalAbout({ ...localAbout, workshopImage: newUrl })}
                aspectRatio="portrait"
              />
            </div>

            {/* ========================================================
                LEADERSHIP & VISION: MEET OUR TEAM (DYNAMIC MANAGEMENT)
               ======================================================== */}
            <div className="pt-6 border-t border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#4E9F76]/20 text-[#166534]">
                      <Users className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#166534]">
                      Leadership & Vision
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#0f172a] mt-1">
                    Meet Our Team Members Roster
                  </h4>
                  <p className="text-xs text-slate-500">
                    Website ke About page par show hone wale leadership team members add, edit ya delete karein.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-98 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Team Member</span>
                </button>
              </div>

              {/* Headings for Team Section on Storefront */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Team Section Badge / Tagline
                  </label>
                  <input
                    type="text"
                    value={localAbout.teamSectionTitle || 'MEET OUR TEAM'}
                    onChange={(e) => setLocalAbout({ ...localAbout, teamSectionTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="MEET OUR TEAM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] mb-1">
                    Team Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={localAbout.teamSectionSubtitle || 'The experts behind global sustainable packaging.'}
                    onChange={(e) => setLocalAbout({ ...localAbout, teamSectionSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="The experts behind global sustainable packaging."
                  />
                </div>
              </div>

              {/* Members Cards List */}
              <div className="space-y-5">
                {(localAbout.teamMembers || []).length === 0 ? (
                  <div className="text-center py-10 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Abhi tak koi team member add nahi kiya gaya</p>
                    <p className="text-xs text-slate-400 mt-1">Naya member shamil karne ke liye 'Add New Team Member' button par click karein.</p>
                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#15803d] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Member</span>
                    </button>
                  </div>
                ) : (
                  (localAbout.teamMembers || []).map((member, idx) => (
                    <div 
                      key={member.id || idx} 
                      className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4 hover:border-[#B2E2C5] transition-all"
                    >
                      {/* Member Card Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-[#dcfce7] text-[#166534] font-mono font-bold text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-[#0f172a] block">
                              {member.name || 'Untitled Member'}
                            </span>
                            <span className="text-xs text-[#166534] font-semibold">
                              {member.role || 'Designation'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveTeamMember(idx, 'up')}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                          )}
                          {idx < (localAbout.teamMembers || []).length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveTeamMember(idx, 'down')}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-xs cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTeamMember(idx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Body: Photo Uploader + Form Inputs */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Photo Column with Mini Preview */}
                        <div className="lg:col-span-4 space-y-3">
                          <ImageUploader
                            label="Member Portrait Photo"
                            description="Upload high quality portrait photo (3:4 ratio)."
                            value={member.image}
                            onChange={(newUrl) => handleUpdateTeamMember(idx, { image: newUrl })}
                            aspectRatio="portrait"
                          />

                          {/* Mini Storefront Preview Card */}
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                              Live Storefront Preview
                            </span>
                            <div className="relative w-28 mx-auto aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-slate-300">
                              <img 
                                src={member.image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'} 
                                alt=""
                                className="w-full h-full object-cover object-top grayscale"
                              />
                            </div>
                            <p className="font-bold text-xs text-[#0f172a] mt-2 truncate">{member.name || 'Name'}</p>
                            <p className="text-[11px] text-[#166534] font-medium truncate">{member.role || 'Role'}</p>
                          </div>
                        </div>

                        {/* Fields Column */}
                        <div className="lg:col-span-8 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => handleUpdateTeamMember(idx, { name: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                                placeholder="e.g. Rashid Mahmood"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Role / Title *
                              </label>
                              <input
                                type="text"
                                value={member.role}
                                onChange={(e) => handleUpdateTeamMember(idx, { role: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#166534] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                                placeholder="e.g. Managing Director & Founder"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>Email Address</span>
                              </label>
                              <input
                                type="email"
                                value={member.email || ''}
                                onChange={(e) => handleUpdateTeamMember(idx, { email: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                                placeholder="name@ecotexinc.com"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <Linkedin className="w-3 h-3 text-slate-400" />
                                <span>LinkedIn URL</span>
                              </label>
                              <input
                                type="text"
                                value={member.linkedin || ''}
                                onChange={(e) => handleUpdateTeamMember(idx, { linkedin: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                                placeholder="https://linkedin.com/in/..."
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                <Twitter className="w-3 h-3 text-slate-400" />
                                <span>Twitter / X</span>
                              </label>
                              <input
                                type="text"
                                value={member.twitter || ''}
                                onChange={(e) => handleUpdateTeamMember(idx, { twitter: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                                placeholder="https://twitter.com/..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Short Bio / Credentials (Optional)
                            </label>
                            <textarea
                              rows={2}
                              value={member.bio || ''}
                              onChange={(e) => handleUpdateTeamMember(idx, { bio: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76] leading-relaxed"
                              placeholder="Brief bio or engineering background..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: FACILITIES SECTION
         ======================================================== */}
      {activeTab === 'facilities' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Factory className="w-5 h-5 text-[#4E9F76]" />
                  <span>5. Manufacturing Facilities & Production Hubs</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Corona California US distribution hub, heavy manufacturing plants, machinery capabilities, and annual capacity metrics.
                </p>
              </div>
              <span className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live on Home & Facilities
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Facilities Section Title
                </label>
                <input
                  type="text"
                  value={localFacilities.title}
                  onChange={(e) => setLocalFacilities({ ...localFacilities, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Facilities Subtitle Description
                </label>
                <input
                  type="text"
                  value={localFacilities.subtitle}
                  onChange={(e) => setLocalFacilities({ ...localFacilities, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                Machinery & Engineering Narrative
              </label>
              <textarea
                rows={2}
                value={localFacilities.storySnippet || ''}
                onChange={(e) => setLocalFacilities({ ...localFacilities, storySnippet: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                placeholder="From automated ultrasonic welding to high-definition 8-color flexographic printing..."
              />
            </div>

            {/* 3 Capacity Metrics */}
            <div className="p-4 rounded-2xl bg-[#F4F9F5] border border-[#B2E2C5]/40 space-y-3">
              <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider">
                Industrial Capacity & Certification Metrics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Annual Capacity</label>
                  <input
                    type="text"
                    value={localFacilities.annualCapacity}
                    onChange={(e) => setLocalFacilities({ ...localFacilities, annualCapacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="50,000,000+ Units / Year"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Quality Standards</label>
                  <input
                    type="text"
                    value={localFacilities.certificationsMetric}
                    onChange={(e) => setLocalFacilities({ ...localFacilities, certificationsMetric: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="ISO 9001:2015 & ASTM D6400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Active Production Lines</label>
                  <input
                    type="text"
                    value={localFacilities.activeLinesMetric}
                    onChange={(e) => setLocalFacilities({ ...localFacilities, activeLinesMetric: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#4E9F76]"
                    placeholder="14 High-Speed Extrusion Lines"
                  />
                </div>
              </div>
            </div>

            {/* 2 Facility Hub Cards */}
            <div>
              <h4 className="text-xs font-black text-[#166534] uppercase tracking-wider mb-3">
                Manufacturing & Distribution Hub Locations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(localFacilities.hubs || []).map((hub, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#4E9F76] uppercase tracking-wider">
                        Hub #{idx + 1}: {idx === 0 ? 'US Headquarters' : 'Heavy Industrial Plant'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Facility Name</label>
                      <input
                        type="text"
                        value={hub.name}
                        onChange={(e) => {
                          const newHubs = [...localFacilities.hubs];
                          newHubs[idx] = { ...newHubs[idx], name: e.target.value };
                          setLocalFacilities({ ...localFacilities, hubs: newHubs });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={hub.address}
                        onChange={(e) => {
                          const newHubs = [...localFacilities.hubs];
                          newHubs[idx] = { ...newHubs[idx], address: e.target.value };
                          setLocalFacilities({ ...localFacilities, hubs: newHubs });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Key Capabilities (comma separated)</label>
                      <input
                        type="text"
                        value={(hub.capabilities || []).join(', ')}
                        onChange={(e) => {
                          const newHubs = [...localFacilities.hubs];
                          newHubs[idx] = { 
                            ...newHubs[idx], 
                            capabilities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                          };
                          setLocalFacilities({ ...localFacilities, hubs: newHubs });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
                      />
                    </div>

                    <div className="pt-2">
                      <ImageUploader
                        label="Hub Photo"
                        value={hub.image}
                        onChange={(newUrl) => {
                          const newHubs = [...localFacilities.hubs];
                          newHubs[idx] = { ...newHubs[idx], image: newUrl };
                          setLocalFacilities({ ...localFacilities, hubs: newHubs });
                        }}
                        aspectRatio="wide"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: CONTACT SECTION
         ======================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#4E9F76]" />
                  <span>6. Contact Us & Factory Location (Footer Inquiries)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Direct telephone numbers, sales desk email, California address, and Google Maps integration.
                </p>
              </div>
              <span className="self-start sm:self-auto shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live on Home & Contact
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Direct Sales Email
                </label>
                <input
                  type="email"
                  value={localContact.email}
                  onChange={(e) => setLocalContact({ ...localContact, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="orders@ecotexinc.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Primary Customer Service & Orders Phone
                </label>
                <input
                  type="text"
                  value={localContact.phone}
                  onChange={(e) => setLocalContact({ ...localContact, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0f172a] bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="+1 (951) 450-9773"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Secondary Phone / Toll-Free Desk
                </label>
                <input
                  type="text"
                  value={localContact.secondaryPhone || ''}
                  onChange={(e) => setLocalContact({ ...localContact, secondaryPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="(951) 555-ECOTEX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                  Google Maps Directions Link
                </label>
                <input
                  type="text"
                  value={localContact.googleMapsUrl || ''}
                  onChange={(e) => setLocalContact({ ...localContact, googleMapsUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                Physical Distribution Facility Address (Corona, CA)
              </label>
              <input
                type="text"
                value={localContact.facilityAddress}
                onChange={(e) => setLocalContact({ ...localContact, facilityAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#4E9F76]"
                placeholder="1200 Industrial Parkway, Corona, CA 92881"
              />
            </div>
          </div>
        </div>
      )}

      
          {/* Bottom Save Bar inside Right Content Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-200 bg-white p-5 sm:p-6 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Sabhi changes database aur browser storage mein foran live sync ho jayenge.</span>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-r from-[#166534] via-[#15803d] to-[#16a34a] hover:from-[#14532d] hover:to-[#15803d] text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 cursor-pointer whitespace-nowrap"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>Published Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 shrink-0" />
                  <span>Save & Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomepageManager;
