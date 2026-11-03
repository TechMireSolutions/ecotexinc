import React, { useRef, useState } from 'react';
import { 
  Recycle, 
  Sliders, 
  Headphones, 
  PackageCheck, 
  Printer, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Linkedin, 
  Twitter, 
  Mail,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ActiveSection } from '../types';
import { useStore } from '../store/useStore';

interface AboutSectionProps {
  onNavigate: (section: ActiveSection) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { siteSettings } = useStore();
  const currentSettings = siteSettings;
  const aConfig = siteSettings?.aboutConfig;

  // Mobile horizontal slider controls for Team section
  const teamSliderRef = useRef<HTMLDivElement>(null);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);

  const scrollTeam = (direction: 'left' | 'right') => {
    if (teamSliderRef.current) {
      const scrollAmount = teamSliderRef.current.clientWidth * 0.75;
      teamSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleTeamScroll = () => {
    if (teamSliderRef.current) {
      const { scrollLeft, clientWidth } = teamSliderRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveTeamIndex(Math.max(0, index));
    }
  };

  const defaultFeatures = [
    {
      icon: Recycle,
      title: '100% Recyclable Fabrics',
      description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.'
    },
    {
      icon: Sliders,
      title: 'Easy to Customize',
      description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.'
    },
    {
      icon: Headphones,
      title: '24/7 B2B Global Support',
      description: 'Dedicated enterprise account directors for national retail chains, grocers, and FMCG brands.'
    },
    {
      icon: PackageCheck,
      title: 'Free Sample Verification',
      description: 'Physical pre-production specimen kits dispatched within 48 hours for tensile testing and color sign-off.'
    },
    {
      icon: Printer,
      title: 'High-Definition Flexo Print',
      description: 'Zero-VOC soy and water-based ink flexography delivering photo-sharp photographic brand imprints.'
    },
    {
      icon: Zap,
      title: 'Rapid Turnaround Times',
      description: 'Immediate dispatch for unbranded warehouse inventory and accelerated 10-14 day custom printed delivery.'
    }
  ];

  const features = aConfig?.whyChooseUsFeatures && aConfig.whyChooseUsFeatures.length > 0
    ? aConfig.whyChooseUsFeatures.map((f, i) => ({
        ...f,
        icon: defaultFeatures[i % defaultFeatures.length].icon
      }))
    : defaultFeatures;

  const teamMembers = (aConfig?.teamMembers && aConfig.teamMembers.length > 0)
    ? aConfig.teamMembers
    : [
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

  return (
    <div className="w-full bg-white text-[#0f172a] font-sans antialiased selection:bg-[#166534] selection:text-white">

      {/* ========================================================
          1. EDITORIAL HERO BANNER (UMBRA REFERENCE STYLE)
         ======================================================== */}
      <section className="relative w-full h-[360px] sm:h-[560px] md:h-[620px] bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Background Visual: Corporate studio founders environment */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: `url('${aConfig?.heroBgImage || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=85'}')`
          }}
        />
        {/* Editorial Vignette & Dark Tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/70" />

        {/* Center Overlay Typography */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#22c55e] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            Ecotex Inc. Packaging Heritage
          </span>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.12em] sm:tracking-[0.18em] uppercase text-white leading-none">
            {aConfig?.heroTitle || 'About Us'}
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            {aConfig?.heroSubtitle || 'A sustainable future for packaging. Engineered with purpose, manufactured for impact.'}
          </p>

          {/* Minimalist Breadcrumb with Green Accent */}
          <nav className="mt-8 flex items-center justify-center gap-2 text-xs font-medium tracking-wider text-slate-400" aria-label="Breadcrumb">
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-[#86C59E] font-bold">/</span>
            <span className="text-white font-semibold">About Us</span>
          </nav>
        </div>
      </section>

      {/* ========================================================
          2. "WE ARE ECOTEX" & FOUNDER SHOWCASE (SPLIT 2-COLUMN)
         ======================================================== */}
      <section className="py-16 sm:py-24 lg:py-32 w-full max-w-[1820px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left Column: Brand Story & Narrative */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            
            {/* Small Sub-heading in Green */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#4E9F76]">
                | SUSTAINABILITY & INNOVATION
              </span>
            </div>

            {/* Large Section Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0f172a] uppercase leading-[1.08] mb-8">
              {aConfig?.storyTitle || currentSettings?.aboutTitle || 'We Are Ecotex'}
            </h2>

            {/* Intro Quote / Lead Paragraph */}
            <blockquote className="border-l-4 border-[#4E9F76] pl-5 sm:pl-6 my-2 text-lg sm:text-xl lg:text-2xl font-medium text-slate-900 leading-relaxed italic">
              "{aConfig?.missionQuote || currentSettings?.aboutMission || 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.'}"
            </blockquote>

            {/* Detailed Story Body */}
            <div className="mt-6 space-y-5 text-sm sm:text-base lg:text-lg text-[#475569] leading-relaxed font-normal">
              <p>
                {aConfig?.storyParagraph1 || currentSettings?.aboutStory || 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.'}
              </p>
              <p>
                {aConfig?.storyParagraph2 || 'From our corporate headquarters in California to state-of-the-art automated manufacturing facilities, every product is subjected to rigorous tensile testing, automated ultrasonic seam welding, and non-toxic water-based printing. We empower grocery retailers, boutique lifestyle brands, and logistics operations across the globe to achieve zero-waste compliance with full chain-of-custody audit trails.'}
              </p>
            </div>

            {/* Digital Calligraphic Founder Signature */}
            <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col items-start">
              {/* Stylized Signature Vector */}
              <svg className="w-52 h-16 text-slate-800" viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rashid Mahmood signature">
                <path 
                  d="M15 48 C 35 15, 45 10, 60 30 C 72 45, 68 55, 85 25 C 95 10, 110 40, 130 35 C 150 30, 140 20, 165 25 C 185 30, 195 45, 225 20" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M 40 45 Q 90 52 180 38" 
                  stroke="currentColor" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="mt-2 text-sm font-bold uppercase tracking-wider text-[#0f172a]">
                {aConfig?.founderName || 'Rashid Mahmood'}
              </span>
              <span className="text-xs font-semibold text-[#166534] tracking-wide">
                {aConfig?.founderRole || 'Managing Director & Founder, Ecotex Inc.'}
              </span>
            </div>

          </div>

          {/* Right Column: Sleek High-Contrast Founder Portrait */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl xl:max-w-2xl group">
              {/* Architectural Frame Offset Backdrop */}
              <div className="absolute inset-0 bg-[#dcfce7] rounded-3xl transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-100 border border-slate-200 aspect-[4/5]">
                <img 
                  src={aConfig?.founderImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85"} 
                  alt="Rashid Mahmood, Founder of Ecotex Inc."
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                {/* Floating Micro Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/40 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">Leadership</p>
                    <p className="text-xs text-[#166534] font-semibold">20+ Years Sustainable Manufacturing</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#166534] text-white flex items-center justify-center shadow-sm">
                    <Leaf className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. "WHY CHOOSE US" & MANUFACTURING PROCESS (SPLIT SECTION - FULL WIDTH)
         ======================================================== */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#f8fafc] border-y border-slate-200/80 w-full">
        <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            
            {/* Left Side: Collaboration Workshop Image */}
            <div className="lg:col-span-5 xl:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img 
                  src={aConfig?.workshopImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"} 
                  alt="Ecotex engineering team inspecting sustainable fabric samples" 
                  className="w-full h-[480px] sm:h-[560px] lg:h-[640px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-transparent to-transparent" />
                
                {/* Corner Stat Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200/80 shadow-2xl max-w-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-[#dcfce7] text-[#166534]">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-2xl font-mono font-black text-[#0f172a]">125+ Uses</p>
                      <p className="text-xs font-semibold text-slate-500">ASTM D6400 & GRS Certified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Section Title & 6-Item Clean Grid */}
            <div className="lg:col-span-7 xl:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
              
              <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#166534] mb-3 block">
                | INDUSTRIAL PRECISION & STANDARDS
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0f172a] uppercase leading-tight mb-4">
                {aConfig?.whyChooseUsTitle || 'Why Choose Us'}
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-[#475569] leading-relaxed mb-8 max-w-4xl">
                {aConfig?.whyChooseUsSubtitle || 'We combine German ultrasonic welding machinery, ISO 9001 certified batch audits, and non-toxic soy formulations to deliver high-capacity packaging engineered to outlast disposable plastic.'}
              </p>

              {/* 6-Item Grid (2 cols x 3 rows - Full Spacious Layout) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-7">
                {features.map((feat, index) => {
                  const Icon = feat.icon;
                  return (
                    <div 
                      key={index}
                      className="group p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#166534] hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5 mb-2 sm:mb-3">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#166534] group-hover:text-white transition-all duration-300 shadow-2xs">
                          <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
                        </div>
                        <h4 className="text-xs sm:text-base font-bold text-[#0f172a] tracking-tight group-hover:text-[#166534] transition-colors leading-tight">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-[11px] sm:text-sm text-[#475569] leading-relaxed sm:pl-14">
                        {feat.description}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. "MEET OUR TEAM" LEADERSHIP CARDS (1-LINE MOBILE SLIDER / 3-COL DESKTOP)
         ======================================================== */}
      <section className="py-14 sm:py-24 lg:py-32 w-full max-w-[1820px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        
        {/* Section Header with Mobile Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase text-[#166534] block mb-2">
              | LEADERSHIP & VISION |
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a] uppercase">
              {aConfig?.teamSectionTitle || 'Meet Our Team'}
            </h2>
            <p className="mt-2 text-xs sm:text-base text-[#475569] max-w-xl">
              {aConfig?.teamSectionSubtitle || 'The experts behind global sustainable packaging.'}
            </p>
          </div>

          {/* Mobile Navigation Arrows (Visible only on mobile/tablet) */}
          {teamMembers.length > 1 && (
            <div className="flex md:hidden items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => scrollTeam('left')}
                className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer hover:bg-stone-50 transition-all"
                aria-label="Previous Team Member"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTeam('right')}
                className="w-9 h-9 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-stone-700 active:scale-95 cursor-pointer hover:bg-stone-50 transition-all"
                aria-label="Next Team Member"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* 1-Line Horizontal Swipeable Carousel on Mobile / 3-Column Grid on Desktop */}
        <div 
          ref={teamSliderRef}
          onScroll={handleTeamScroll}
          className="flex md:grid overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 snap-x snap-mandatory md:snap-none scrollbar-none md:grid-cols-3 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {teamMembers.map((member, index) => (
            <div 
              key={member.id || index}
              className="group relative flex flex-col items-center shrink-0 w-[78vw] xs:w-[68vw] sm:w-[320px] md:w-auto snap-center md:snap-align-none"
            >
              {/* Photo Container */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out select-none"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
              </div>

              {/* Floating Bottom White Badge */}
              <div className="relative -mt-14 w-[90%] bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200 text-center transition-transform duration-300 group-hover:-translate-y-1.5">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0f172a]">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#166534] mt-0.5 tracking-wide">
                  {member.role}
                </p>

                {/* Micro Social Icons */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-3 text-slate-400">
                  {member.linkedin && member.linkedin !== '#' && (
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter && member.twitter !== '#' && (
                    <a 
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                      aria-label={`${member.name} Twitter`}
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-full hover:bg-[#dcfce7] hover:text-[#166534] transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Mobile Indicator Dots */}
        {teamMembers.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
            {teamMembers.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (teamSliderRef.current) {
                    const target = teamSliderRef.current.children[idx] as HTMLElement;
                    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeTeamIndex === idx
                    ? 'w-6 bg-[#166534]'
                    : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to team member ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA banner below team */}
        <div className="mt-20 p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-r from-[#166534] to-[#15803d] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to Elevate Your Packaging Sustainability?</h3>
            <p className="text-sm sm:text-base text-emerald-100 mt-2">Talk to our packaging engineers in California or request custom prototypes.</p>
          </div>
          <button 
            onClick={() => onNavigate('contact')}
            className="px-8 py-4 rounded-xl font-bold text-sm bg-white text-[#166534] hover:bg-emerald-50 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Request Factory Consultation →
          </button>
        </div>

      </section>

    </div>
  );
};
