'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BiteStyleHero } from './components/BiteStyleHero';
import { AboutSection } from './components/AboutSection';
import { ShopSection } from './components/ShopSection';
import { VersatilityBannerSection } from './components/VersatilityBannerSection';
import { ContactSection } from './components/ContactSection';
import { HomepageAboutFacilitiesSection } from './components/HomepageAboutFacilitiesSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { SearchModal } from './components/SearchModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AdminDashboard } from './admin/components/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import { useStore } from './store/useStore';
import { ActiveSection, Product } from './types';
import { useLiveStorefront } from './hooks/useLiveStorefront';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quoteProductId, setQuoteProductId] = useState<string>('prod-1');
  const [cartInitialStep, setCartInitialStep] = useState<'cart' | 'checkout'>('cart');

  // Dynamic live storefront synchronization (/admin/api/settings & /admin/api/products)
  useLiveStorefront();

  // Zustand Global Store Integration
  const { 
    products,
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    getCartItemCount,
    isAuthenticated,
    checkAuth,
    logout,
    siteSettings
  } = useStore();

  // Dynamically update document favicon in browser tab
  useEffect(() => {
    const faviconUrl = siteSettings?.logoConfig?.faviconUrl || siteSettings?.logoConfig?.customLogoUrl;
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [siteSettings?.logoConfig?.faviconUrl, siteSettings?.logoConfig?.customLogoUrl]);

  // Dynamically update document title in browser tab
  useEffect(() => {
    const title = siteSettings?.siteTitle || siteSettings?.companyName;
    if (title && activeSection !== 'admin') {
      document.title = title;
    } else if (activeSection === 'admin') {
      document.title = 'Ecotex Studio | CMS Operations Dashboard';
    }
  }, [siteSettings?.siteTitle, siteSettings?.companyName, activeSection]);

  // URL Routing: Automatically detect /admin or /admin/login in browser URL
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      
      if (path === '/admin' || path === '/admin/' || path === '/admin/login' || path === '/admin-login' || path === '/adminlogin' || hash === '#admin') {
        setActiveSection('admin');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const handleOpenQuoteForProduct = (product: Product) => {
    setQuoteProductId(product.id);
    setActiveSection('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpressCheckout = (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale', unitPrice?: number) => {
    addToCart(product, selectedColor, quantity, orderType, unitPrice);
    setCartInitialStep('checkout');
    setIsCartOpen(true);
    setQuickViewProduct(null);
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewProduct(null); // Ensure popup modal is never triggered
    setActiveSection('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (section: ActiveSection) => {
    setActiveSection(section);
    setQuickViewProduct(null); // Clear any popup modal
    if (section !== 'product-detail') {
      setSelectedProduct(null); // Clear single product page data so modal never pops up
    }
    if (section === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Enterprise Custom CMS Admin Dashboard (Protected by Auth)
  if (activeSection === 'admin' || (typeof window !== 'undefined' && (window.location.pathname.startsWith('/admin') || window.location.pathname === '/admin-login' || window.location.pathname === '/adminlogin'))) {
    const isAuthed = checkAuth();
    const isExplicitLoginRoute = typeof window !== 'undefined' && (window.location.pathname === '/admin/login' || window.location.pathname === '/admin-login' || window.location.pathname === '/adminlogin');

    if (!isAuthed || isExplicitLoginRoute) {
      return (
        <AdminLogin
          onSuccess={() => {
            window.history.pushState({}, '', '/admin');
            setActiveSection('admin');
          }}
          onNavigateHome={() => {
            window.history.pushState({}, '', '/');
            handleNavigate('home');
          }}
        />
      );
    }

    return (
      <AdminDashboard
        onBackToSite={() => {
          window.open('/', '_blank', 'noopener,noreferrer');
        }}
        onLogout={() => {
          logout();
          window.history.pushState({}, '', '/admin/login');
          setActiveSection('admin');
        }}
      />
    );
  }

  const cartItemCount = Array.isArray(cart) ? cart.length : getCartItemCount();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F9F5] text-[#0f172a] font-sans antialiased selection:bg-[#B2E2C5]/40 selection:text-[#4E9F76]">

      {/* Global Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={handleNavigate}
        cartCount={cartItemCount}
        onOpenCart={() => {
          setCartInitialStep('cart');
          setIsCartOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuoteModal={() => {
          setActiveSection('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <div key={activeSection} className="animate-fadeInUp">
          
          {/* HOME SECTION */}
          {activeSection === 'home' && (
            <>
              {/* Preserved BiteStyle 3D Floating Centerpiece Hero */}
              <BiteStyleHero
                onNavigateToShop={() => handleNavigate('shop')}
                onOpenCart={() => setIsCartOpen(true)}
              />

              {/* Dynamic Products Catalog */}
              <ShopSection
                showHero={false}
                onQuickView={handleOpenProductDetail}
                onAddToCart={(p, color, qty) => addToCart(p, color, qty)}
                onOpenQuoteForProduct={handleOpenQuoteForProduct}
                onNavigateToShop={() => handleNavigate('shop')}
                isHomePage={true}
              />

              {/* Versatility Banner & Sustainable Fashion Section */}
              <VersatilityBannerSection
                onNavigateToShop={() => handleNavigate('shop')}
                onNavigateToContact={() => handleNavigate('contact')}
              />

              {/* About Ecotex & Manufacturing Facilities Section */}
              <HomepageAboutFacilitiesSection onNavigate={handleNavigate} />

              {/* Direct Mill & Corona Contact Section */}
              <ContactSection />
            </>
          )}

          {/* ABOUT US SECTION */}
          {activeSection === 'about' && (
            <>
              <AboutSection onNavigate={handleNavigate} />
              <VersatilityBannerSection
                onNavigateToShop={() => handleNavigate('shop')}
                onNavigateToContact={() => handleNavigate('contact')}
              />
            </>
          )}

          {/* SHOP SECTION */}
          {activeSection === 'shop' && (
            <ShopSection
              showCategories={false}
              showDeal={false}
              isHomePage={false}
              onQuickView={handleOpenProductDetail}
              onAddToCart={(p, color, qty) => addToCart(p, color, qty)}
              onOpenQuoteForProduct={handleOpenQuoteForProduct}
            />
          )}

          {/* PRODUCT DETAIL VIEW */}
          {activeSection === 'product-detail' && selectedProduct && (
            <ProductDetailPage
              product={products.find(p => p.id === selectedProduct.id) || selectedProduct}
              onBack={() => {
                handleNavigate('shop');
              }}
              onNavigateHome={() => {
                handleNavigate('home');
              }}
              onAddToCart={(p, color, qty, oType, price) => addToCart(p, color, qty, oType, price)}
              onOpenQuote={handleOpenQuoteForProduct}
              onExpressCheckout={handleExpressCheckout}
              onSelectProduct={handleOpenProductDetail}
            />
          )}

          {/* CONTACT & RFQ SECTION */}
          {activeSection === 'contact' && (
            <ContactSection />
          )}

        </div>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Working Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        initialStep={cartInitialStep}
        onUpdateQuantity={(id, qty) => {
          const item = cart.find(i => i.id === id);
          if (item) {
            updateCartQuantity(id, qty - item.quantity);
          }
        }}
        onRemoveItem={(id) => removeFromCart(id)}
        onClearCart={() => clearCart()}
      />

      {/* Quick View Modal */}
      {activeSection !== 'product-detail' && quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(p, color, qty, oType, price) => addToCart(p, color, qty, oType, price)}
          onOpenQuote={handleOpenQuoteForProduct}
          onExpressCheckout={handleExpressCheckout}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          handleOpenProductDetail(p);
        }}
      />

      {/* Direct WhatsApp Floating Connect Button */}
      <WhatsAppFloatingButton />

    </div>
  );
}
