import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ActiveSection } from '../types';
import { ShoppingBag, Search, Menu, X, ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

interface NavbarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenQuoteModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { siteSettings, cart } = useStore();
  const displayCartCount = Array.isArray(cart) ? cart.length : (cartCount || 0);

  const ctaText = siteSettings?.navbarConfig?.ctaButtonText || siteSettings?.heroButtonText || 'START SHOP';
  const announcementText = siteSettings?.navbarConfig?.announcementText || siteSettings?.announcement || '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility';
  const announcementActive = siteSettings?.navbarConfig?.announcementActive !== undefined
    ? siteSettings?.navbarConfig?.announcementActive
    : (siteSettings?.announcementActive !== false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNavLinks: { id: string; label: string; targetSection: ActiveSection }[] = [
    { id: 'home', label: 'HOME', targetSection: 'home' },
    { id: 'about', label: 'ABOUT US', targetSection: 'about' },
    { id: 'shop', label: 'SHOP', targetSection: 'shop' },
    { id: 'contact', label: 'CONTACT', targetSection: 'contact' }
  ];

  const configuredLinks = siteSettings?.navbarConfig?.navLinks;
  const navLinks = (configuredLinks && configuredLinks.length > 0)
    ? configuredLinks.map(l => ({
        id: l.id || l.label.toLowerCase().replace(/\s+/g, '-'),
        label: l.label,
        targetSection: (l.targetSection || 'home') as ActiveSection
      }))
    : defaultNavLinks;

  const showCtaButton = siteSettings?.navbarConfig?.showCtaButton !== false;
  const showSearch = siteSettings?.navbarConfig?.showSearch !== false;
  const showCart = siteSettings?.navbarConfig?.showCart !== false;
  const showPhone = siteSettings?.navbarConfig?.showPhone !== false;
  const ctaAction = siteSettings?.navbarConfig?.ctaButtonAction || 'shop';
  const phoneDisplay = siteSettings?.navbarConfig?.phoneDisplay || siteSettings?.phone || '(951) 555-ECOTEX';

  const handleCtaClick = () => {
    if (ctaAction === 'cart') {
      onOpenCart();
    } else if (ctaAction === 'contact') {
      handleNavClick('contact');
    } else {
      handleNavClick('shop');
    }
  };

  const handleNavClick = (sectionId: ActiveSection) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Announcement Bar if enabled */}
      {announcementActive && (
        <div className="bg-[#4E9F76] text-white py-2 px-3 text-center text-[11px] sm:text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 select-none">
          <span>{announcementText}</span>
        </div>
      )}

      {/* ========================================================
          NAVBAR: EXACT LAYOUT REPLICATION FROM REFERENCE IMAGE
          Left: Brand Wordmark | Center: Uppercase Nav Links | Right: Pill Button
         ======================================================== */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled
            ? 'shadow-xs border-b border-slate-200/70 bg-white/80 backdrop-blur-xl'
            : 'border-b border-slate-200/40 bg-white/65 backdrop-blur-lg'
          }`}
      >
        <div className="w-full max-w-[1820px] mx-auto px-3.5 sm:px-10 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between h-18 sm:h-20">

            {/* 1. Left Zone: Brand Wordmark (matching reference image "CLASSIC" position) */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
                aria-label="Ecotex Inc. Homepage"
              >
                <Logo size="md" />
              </button>
            </div>

            {/* 2. Middle Zone: Clean Uppercase Nav Links (matching reference image typography & spacing) */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-11">
              {navLinks.map((link) => {
                const isActive = activeSection === link.targetSection || (activeSection === 'product-detail' && link.targetSection === 'shop');
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.targetSection)}
                    className={`text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer relative py-1.5 ${isActive
                        ? 'text-[#111827] font-bold'
                        : 'text-slate-500 hover:text-[#111827]'
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#166534] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 3. Right Zone: Search, Cart + Signature Pill Button (matching reference image) */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Search Icon Trigger */}
              {showSearch && (
                <button
                  onClick={onOpenSearch}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                  aria-label="Search eco products"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>
              )}

              {/* Shopping Bag Trigger with Live Counter */}
              {showCart && (
                <button
                  onClick={onOpenCart}
                  className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                  aria-label={`Shopping bag with ${displayCartCount} entries`}
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  {displayCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#166534] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-mono shadow-xs">
                      {displayCartCount > 99 ? '99+' : displayCartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Signature Rounded Pill CTA Button (START SHOP) */}
              {showCtaButton && (
                <button
                  onClick={handleCtaClick}
                  className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d2e2da] text-[#144f33] hover:bg-[#166534] hover:text-white transition-all duration-300 shadow-2xs hover:shadow-xs active:scale-96 cursor-pointer whitespace-nowrap"
                >
                  <span>{ctaText}</span>
                </button>
              )}


              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>


            </div>

          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER
         ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 border-l border-slate-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="py-6 space-y-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.targetSection;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.targetSection)}
                      className={`w-full text-left px-4 py-3 min-h-[44px] rounded-xl text-xs font-bold tracking-[0.18em] uppercase transition-colors flex items-center justify-between cursor-pointer ${isActive
                          ? 'bg-[#edf4e7] text-[#166534]'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <div className="w-2 h-2 rounded-full bg-[#166534]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {showCtaButton && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleCtaClick();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d2e2da] text-[#144f33] hover:bg-[#166534] hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {showPhone && (
                <a
                  href={`tel:${phoneDisplay.replace(/[^0-9]/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#166534]" />
                  <span>Corona, CA · {phoneDisplay}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
