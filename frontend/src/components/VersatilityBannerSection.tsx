'use client';

import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  ThumbsUp, 
  Globe2, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface VersatilityBannerSectionProps {
  onNavigateToShop?: () => void;
  onNavigateToContact?: () => void;
}

export const VersatilityBannerSection: React.FC<VersatilityBannerSectionProps> = ({
  onNavigateToShop,
  onNavigateToContact
}) => {
  const { siteSettings, siteImages } = useStore();
  const v = siteSettings?.versatilityConfig;
  const vConfig = {
    sustainableFashionTitle: v?.sustainableFashionTitle || 'Sustainable Fashion For A Greener Tomorrow',
    sustainableFashionSubtitle: v?.sustainableFashionSubtitle || 'Discover our eco-friendly bags made from sustainable materials. Join the movement to reduce environmental impact without compromising style!',
    featureCards: (v?.featureCards && v.featureCards.length > 0) ? v.featureCards : [
      { id: 'vc1', title: 'Eco-Friendly', description: 'Non-woven polypropylene bags are considered eco-friendly because they are reusable and can replace single-use plastic bags.' },
      { id: 'vc2', title: 'Durable', description: 'These bags are known for their strength and durability. They can withstand multiple uses and are capable of carrying heavy loads.' },
      { id: 'vc3', title: 'Customizable', description: 'Non-woven polypropylene bags can be easily customized with various designs, colors, and logos, making them a popular choice.' },
      { id: 'vc4', title: 'Breathable', description: 'The fabric structure allows air circulation, making it ideal for retail garments, food produce, and everyday merchandise.' }
    ],
    bannerTitle: v?.bannerTitle || 'Exploring The Versatility of Non-Woven PP Bags',
    bannerSubtitle: v?.bannerSubtitle || 'Dive deeper into the various styles, sizes, and designs available in non-woven polypropylene bags.',
    bannerButtonText: v?.bannerButtonText || 'View Collection',
    bannerImage: v?.bannerImage || siteImages?.facilityPhoto || '/images/versatility-banner-bg.jpg',
    bottomTrustBadges: (v?.bottomTrustBadges && v.bottomTrustBadges.length > 0) ? v.bottomTrustBadges : [
      'Fast Turnaround Times',
      'A friendly, open and honest service',
      'Ethical and Fairly Traded Products',
      'Expert Customer Service'
    ]
  };

  const bannerBg = vConfig.bannerImage || siteImages?.facilityPhoto || '/images/versatility-banner-bg.jpg';

  // SVG icons mapping for the 4 feature cards
  const featureIcons = [
    // 1. Eco-friendly
    <svg key="1" className="w-10 h-10 sm:w-12 sm:h-12 text-[#86C59E]" viewBox="0 0 48 48" fill="none">
      <rect x="12" y="16" width="24" height="26" rx="4" fill="#B2E2C5" />
      <path d="M18 16V12C18 8.686 20.686 6 24 6C27.314 6 30 8.686 30 12V16" stroke="#4E9F76" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 24C6.5 28 8 33 12 36" stroke="#4E9F76" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M40 24C41.5 20 40 15 36 12" stroke="#4E9F76" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M21 28C21 25 24 23 27 23C27 26 25 29 22 29C21.5 29 21 28.5 21 28Z" fill="white" />
      <path d="M21 29C23 27 25 25 27 23" stroke="#4E9F76" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
    // 2. Durable
    <svg key="2" className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 48 48" fill="none">
      <path d="M12 16L16 42H32L36 16H12Z" fill="#86C59E" />
      <path d="M16 16V10C16 7.79 17.79 6 20 6H28C30.21 6 32 7.79 32 10V16" stroke="#4E9F76" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 22H32" stroke="#B2E2C5" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 16V42" stroke="#4E9F76" strokeWidth="1.5" opacity="0.2" />
    </svg>,
    // 3. Customizable
    <svg key="3" className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="8" width="28" height="34" rx="3" fill="#4E9F76" />
      <rect x="18" y="14" width="12" height="5" rx="2.5" fill="white" />
      <circle cx="20" cy="27" r="1.5" fill="#B2E2C5" />
      <circle cx="28" cy="27" r="1.5" fill="#B2E2C5" />
      <path d="M20 33C21.5 35 26.5 35 28 33" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>,
    // 4. Breathable
    <svg key="4" className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" fill="#4E9F76" />
      <circle cx="24" cy="24" r="15" stroke="#B2E2C5" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M18 25C18 20 22 17 28 17C28 23 25 27 20 27" fill="#B2E2C5" />
      <path d="M19 26L27 18" stroke="#4E9F76" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 32C20 32 24 30 26 28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ];

  return (
    <div className="w-full bg-white font-sans text-[#0f172a] antialiased">

      {/* ========================================================
          PART 1: SUSTAINABLE FASHION FOR A GREENER TOMORROW
         ======================================================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="w-full max-w-[1820px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 text-center">
          
          {/* Main Title & Subtitle */}
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#0f172a]">
            {vConfig.sustainableFashionTitle}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {vConfig.sustainableFashionSubtitle}
          </p>

          {/* 4 Feature Columns */}
          <div className="mt-6 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8 text-center">
            {vConfig.featureCards.map((card, idx) => (
              <div 
                key={card.id || idx}
                className="flex flex-col items-center p-3 sm:p-5 rounded-2xl bg-[#fafbf9]/60 hover:bg-white border border-stone-200/60 hover:border-[#B2E2C5]/80 transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2.5 sm:mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {featureIcons[idx % featureIcons.length]}
                </div>
                <h3 className="text-xs sm:text-base font-bold text-[#0f172a] mb-1 sm:mb-2 group-hover:text-[#4E9F76] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[10px] xs:text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-xs">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          PART 2: EXPLORING THE VERSATILITY OF NON-WOVEN PP BAGS
          (FULL-WIDTH PANORAMIC BANNER)
         ======================================================== */}
      <section className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[420px] lg:min-h-[480px] flex items-center">
        {/* Background Graphic */}
        <div className="absolute inset-0">
          <img
            src={bannerBg}
            alt={vConfig.bannerTitle}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient to ensure flawless legibility across all screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0f172a]/40 to-[#0f172a]/70 lg:to-[#0f172a]/65" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16">
          <div className="max-w-xl lg:max-w-2xl ml-auto text-center lg:text-left">
            
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-5xl font-black uppercase text-white tracking-tight leading-[1.1] drop-shadow-md">
              {vConfig.bannerTitle}
            </h2>

            <p className="mt-4 text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wider text-slate-100/90 leading-relaxed drop-shadow-sm">
              {vConfig.bannerSubtitle}
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={onNavigateToShop}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-white text-white hover:bg-[#4E9F76] hover:border-[#4E9F76] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
              >
                <span>{vConfig.bannerButtonText || 'View Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          PART 3: 4 BOTTOM VALUE PROPS / TRUST BADGES
         ======================================================== */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
            
            {vConfig.bottomTrustBadges.map((badge, idx) => {
              const icons = [Clock, ThumbsUp, Globe2, HelpCircle];
              const IconComponent = icons[idx % icons.length] || ShieldCheck;

              return (
                <div key={idx} className="flex items-center justify-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-[#B2E2C5]/25 flex items-center justify-center shrink-0 text-[#4E9F76]">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    {badge}
                  </span>
                </div>
              );
            })}

          </div>
        </div>
      </section>

    </div>
  );
};

export default VersatilityBannerSection;
