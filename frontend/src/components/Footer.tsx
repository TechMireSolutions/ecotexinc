import React, { useState } from 'react';
import { ActiveSection, SocialLinkItem } from '../types';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';
import { 
  Check, 
  ArrowRight, 
  Recycle,
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Youtube,
  Globe,
  Phone
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (section: ActiveSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const siteSettings = useStore((state) => state.siteSettings);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Dynamic Social Links from Site Settings
  const socialLinks: SocialLinkItem[] = React.useMemo(() => {
    if (Array.isArray(siteSettings?.footerConfig?.socialLinks) && siteSettings.footerConfig.socialLinks.length > 0) {
      return siteSettings.footerConfig.socialLinks;
    }
    const list: SocialLinkItem[] = [];
    const fc = siteSettings?.footerConfig || {};
    const cc = siteSettings?.contactConfig || {};
    if (fc.socialTwitter || cc.twitterUrl) list.push({ id: 'tw', name: 'Twitter / X', url: fc.socialTwitter || cc.twitterUrl || 'https://twitter.com' });
    if (fc.socialFacebook || cc.facebookUrl) list.push({ id: 'fb', name: 'Facebook', url: fc.socialFacebook || cc.facebookUrl || 'https://facebook.com' });
    if (fc.socialLinkedin || cc.linkedinUrl) list.push({ id: 'li', name: 'LinkedIn', url: fc.socialLinkedin || cc.linkedinUrl || 'https://linkedin.com' });
    if (fc.socialYoutube) list.push({ id: 'yt', name: 'YouTube', url: fc.socialYoutube || 'https://youtube.com' });
    if (fc.socialInstagram || cc.instagramUrl) list.push({ id: 'ig', name: 'Instagram', url: fc.socialInstagram || cc.instagramUrl || 'https://instagram.com' });
    if (list.length > 0) return list;
    return [
      { id: 'tw', name: 'Twitter / X', url: 'https://twitter.com' },
      { id: 'fb', name: 'Facebook', url: 'https://facebook.com' },
      { id: 'li', name: 'LinkedIn', url: 'https://linkedin.com' },
      { id: 'yt', name: 'YouTube', url: 'https://youtube.com' },
      { id: 'ig', name: 'Instagram', url: 'https://instagram.com' }
    ];
  }, [siteSettings?.footerConfig, siteSettings?.contactConfig]);

  const renderSocialIcon = (name: string, url: string) => {
    const n = (name || '').toLowerCase();
    const u = (url || '').toLowerCase();
    if (n.includes('tiktok') || u.includes('tiktok')) {
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.67 6.34 6.34 0 0 0 9.35 22a6.33 6.33 0 0 0 6.32-6.33V9.17a8.28 8.28 0 0 0 4.84 1.55v-3.5a4.85 4.85 0 0 1-.92-.53z" />
        </svg>
      );
    }
    if (n.includes('whatsapp') || u.includes('whatsapp') || u.includes('wa.me')) {
      return <Phone className="w-4 h-4" />;
    }
    if (n.includes('linkedin') || u.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (n.includes('twitter') || n.includes('x.com') || u.includes('twitter') || u.includes('x.com')) return <Twitter className="w-4 h-4" />;
    if (n.includes('facebook') || u.includes('facebook')) return <Facebook className="w-4 h-4" />;
    if (n.includes('instagram') || u.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (n.includes('youtube') || u.includes('youtube')) return <Youtube className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
  };

  const handleNav = (section: ActiveSection) => {
    if (onNavigate) {
      onNavigate(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#0a1811] text-slate-300 font-sans antialiased">

      {/* ========================================================
          1. TOP NEWSLETTER BANNER (EXACT LAYOUT OF REFERENCE IMAGE 2)
             Photographic background with fused pill subscription bar
         ======================================================== */}
      {siteSettings?.footerConfig?.newsletterActive !== false && (
      <div className="relative w-full overflow-hidden py-10 sm:py-16 px-4 md:px-12 lg:px-16 border-b border-white/10">
        
        {/* Background Editorial Photo with Dark Emerald Tint */}
        <div className="absolute inset-0">
          <img
            src={siteSettings?.footerConfig?.newsletterBgImage || "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80"}
            alt="Corporate procurement and packaging design workspace"
            className="w-full h-full object-cover object-center grayscale opacity-30"
          />
          {/* Lighter Ecotex Green gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f5132]/90 via-[#198754]/85 to-[#0f5132]/90" />
        </div>

        {/* Banner Content (Split 50/50: Title on Left, Fused Pill on Right) */}
        <div className="relative z-10 w-full max-w-[1820px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Heading */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-[0.12em] text-white">
              {siteSettings?.footerConfig?.newsletterTitle || 'Subscribe To Our Quarterly Newsletter'}
            </h3>
            {siteSettings?.footerConfig?.newsletterSubtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                {siteSettings.footerConfig.newsletterSubtitle}
              </p>
            )}
          </div>

          {/* Right: Pill-Shaped Input & Subscribe Button */}
          <div className="w-full lg:w-auto max-w-xl">
            {!newsletterSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex items-center w-full">
                <div className="relative flex items-center w-full bg-white rounded-full p-1 shadow-2xl border border-white/20">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0f172a] placeholder:text-slate-400 bg-transparent focus:outline-none rounded-l-full"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-8 py-2.5 sm:py-3 bg-[#22c55e] hover:bg-[#16a34a] text-[#07140e] font-black text-xs uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {siteSettings?.footerConfig?.newsletterBtnText || 'Subscribe'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#166534] border border-[#22c55e]/40 py-3 px-6 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg animate-fadeIn">
                <Check className="w-4 h-4 text-[#22c55e]" />
                <span>Thank you! You are subscribed to our quarterly briefing.</span>
              </div>
            )}
          </div>

        </div>
      </div>
      )}

      {/* ========================================================
          2. MAIN FOOTER BODY (5 COLUMNS - EXACT MATCH TO IMAGE 2)
         ======================================================== */}
      <div className="w-full max-w-[1820px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* Column 1: Brand Logo & Address (4 cols) */}
          <div className="lg:col-span-4">
            {/* Dynamic Brand Logo */}
            <div className="flex items-center">
              <Logo variant="dark" size="md" />
            </div>

            {/* Address & Email */}
            {(siteSettings?.footerConfig?.tagline || siteSettings?.footerTagline || siteSettings?.tagline) && (
              <p className="mt-4 text-xs text-slate-400 font-light leading-relaxed max-w-sm">
                {siteSettings?.footerConfig?.tagline || siteSettings?.footerTagline || siteSettings?.tagline}
              </p>
            )}

            {/* Address & Email */}
            <div className="mt-5 space-y-1.5 text-xs text-slate-300 font-light leading-relaxed">
              <p className="font-normal text-white">
                {siteSettings?.facilityAddress || siteSettings?.contactConfig?.facilityAddress || '1200 Industrial Parkway, Corona, CA 92881'}
              </p>
              <p className="pt-2">
                <a 
                  href={`mailto:${siteSettings?.email || siteSettings?.contactConfig?.email || 'orders@ecotexinc.com'}`} 
                  className="text-[#86efac] hover:text-[#22c55e] transition-colors underline font-medium"
                >
                  {siteSettings?.email || siteSettings?.contactConfig?.email || 'orders@ecotexinc.com'}
                </a>
              </p>
            </div>
          </div>


          {/* Middle 3 Columns: ECOTEX, SERVICES, EVENTS (in 1 line on mobile & tablets) */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-3 sm:gap-6">
            
            {/* Column 2: ECOTEX Navigation */}
            <div>
              <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-white mb-3 sm:mb-4">
                {siteSettings?.footerConfig?.col1Title || 'ECOTEX'}
              </h5>
              <ul className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs text-slate-300">
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleNav('home')} 
                    className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleNav('about')} 
                    className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleNav('shop')} 
                    className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                  >
                    Shop
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => handleNav('contact')} 
                    className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: SERVICES / PRODUCTS */}
            <div>
              <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-white mb-3 sm:mb-4">
                {siteSettings?.footerConfig?.col2Title || 'SERVICES'}
              </h5>
              <ul className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs text-slate-300">
                {((siteSettings?.footerConfig?.col2Links && siteSettings.footerConfig.col2Links.length > 0)
                  ? siteSettings.footerConfig.col2Links
                  : [
                      { id: '1', label: 'Non-Woven Totes', url: 'shop' },
                      { id: '2', label: 'D-Cut Bags', url: 'shop' },
                      { id: '3', label: 'Laminated Gift Bags', url: 'shop' },
                      { id: '4', label: 'Custom Flexo Print', url: 'contact' }
                    ]
                ).map((link, idx) => (
                  <li key={link.id || idx}>
                    <button 
                      type="button" 
                      onClick={() => handleNav((link.url === 'contact' ? 'contact' : 'shop') as ActiveSection)} 
                      className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: EVENTS / STANDARDS */}
            <div>
              <h5 className="text-[11px] sm:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.18em] text-white mb-3 sm:mb-4">
                {siteSettings?.footerConfig?.col3Title || 'EVENTS'}
              </h5>
              <ul className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs text-slate-300">
                {((siteSettings?.footerConfig?.col3Links && siteSettings.footerConfig.col3Links.length > 0)
                  ? siteSettings.footerConfig.col3Links
                  : [
                      { id: '1', label: 'Pack Expo 2026', url: '#quote-form' },
                      { id: '2', label: 'Sustainable Retail', url: '#quote-form' },
                      { id: '3', label: 'SB 270 Workshops', url: '#quote-form' },
                      { id: '4', label: 'Sample Roadshow', url: '#quote-form' }
                    ]
                ).map((link, idx) => (
                  <li key={link.id || idx}>
                    <a 
                      href={link.url || '#quote-form'} 
                      onClick={(e) => {
                        if (link.url === 'contact' || link.url === '#contact' || link.url === '#quote-form') {
                          e.preventDefault();
                          handleNav('contact');
                        }
                      }}
                      className="hover:text-[#22c55e] transition-colors cursor-pointer text-left"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Column 5: FOLLOW (2 cols) */}
          <div className="lg:col-span-2">
            <h5 className="text-xs font-black uppercase tracking-[0.18em] text-white mb-4">
              FOLLOW
            </h5>
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              {socialLinks.map((item) => (
                <a
                  key={item.id || item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  title={item.name}
                  className="hover:text-[#22c55e] transition-colors p-1"
                >
                  {renderSocialIcon(item.name, item.url)}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================
            3. BOTTOM LEGAL BAR (DIVIDER LINE + TERMS + COPYRIGHT)
           ======================================================== */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Left: TERMS & CONDITIONS, PRIVACY POLICY, SITEMAP */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-semibold tracking-wider uppercase text-[10px] sm:text-[11px]">
            <a href="#privacy" className="hover:text-[#22c55e] transition-colors">
              {siteSettings?.footerConfig?.termsNotice || 'TERMS & CONDITIONS'}
            </a>
            <a href="#privacy" className="hover:text-[#22c55e] transition-colors">
              {siteSettings?.footerConfig?.privacyNotice || 'PRIVACY POLICY'}
            </a>
            <a href="#sitemap" className="hover:text-[#22c55e] transition-colors">
              {siteSettings?.footerConfig?.sitemapNotice || 'SITEMAP'}
            </a>
          </div>



          {/* Right: Copyright */}
          <div className="text-center sm:text-right text-[10px] sm:text-[11px] text-slate-400 font-light">
            <span>{siteSettings?.footerConfig?.copyrightNotice || siteSettings?.copyrightNotice || 'Copyright 2026 © Ecotex Inc. All rights reserved.'}</span>
          </div>


        </div>

      </div>

    </footer>
  );
};

export default Footer;
