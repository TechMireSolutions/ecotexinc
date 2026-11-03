'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { DashboardOverview } from './DashboardOverview';
import { HomepageManager } from './HomepageManager';
import { HeroBannerManager } from './HeroBannerManager';
import { ShopBannerManager } from './ShopBannerManager';
import { CategoriesManager } from './CategoriesManager';
import { ProductCatalogManager } from './ProductCatalogManager';
import { OffersDealsManager } from './OffersDealsManager';
import { PageContentEditor } from './PageContentEditor';
import { RfqOrdersInbox } from './RfqOrdersInbox';
import { MediaLibraryManager } from './MediaLibraryManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { X } from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  onLogout
}) => {
  const { isAuthenticated, checkAuth, logout, fetchOrders, fetchQuotes } = useStore();

  // Real-time synchronization for orders & quotes across storefront and admin
  useEffect(() => {
    const syncData = () => {
      fetchOrders?.();
      fetchQuotes?.();
    };

    // Initial sync
    syncData();

    // Auto-poll every 5 seconds for live order & quote updates
    const interval = setInterval(syncData, 5000);

    // Instant local events from storefront checkout or cross-tab sync
    const handleOrderEvent = () => syncData();
    window.addEventListener('ecotex_order_placed', handleOrderEvent);
    window.addEventListener('storage', handleOrderEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('ecotex_order_placed', handleOrderEvent);
      window.removeEventListener('storage', handleOrderEvent);
    };
  }, [fetchOrders, fetchQuotes]);
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Enforce Route Protection
  useEffect(() => {
    const isAuthed = checkAuth();
    if (!isAuthed) {
      window.history.pushState({}, '', '/admin/login');
      // Dispatch popstate so routing handles it
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const getSectionTitle = (section: AdminSection): string => {
    switch (section) {
      case 'overview': return 'Operations Dashboard';
      case 'homepage': return 'Homepage Master CMS';
      case 'hero': return 'Hero 3D Showcase';
      case 'shop-banner': return 'Shop Page Hero Banner & Showcase';
      case 'categories': return 'Product Categories';
      case 'products': return 'Products Catalog';
      case 'offers': return 'Special Offers & Deals';
      case 'content': return 'Pages Content Editor';
      case 'rfq-orders': return 'Orders & Quotes';
      case 'media': return 'Media Library';
      case 'settings': return 'Site Settings';
      default: return 'Admin Studio';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F5] flex text-[#0f172a] select-none font-sans antialiased">
      
      {/* Desktop Persistent / Collapsible Sidebar */}
      <aside className={`hidden lg:block h-screen sticky top-0 shrink-0 z-40 transition-all duration-300 ease-in-out overflow-hidden ${
        isSidebarOpen ? 'w-80 border-r border-[#B2E2C5]/30' : 'w-0 border-r-0'
      }`}>
        <div className="w-80 h-full">
          <AdminSidebar
            activeSection={activeSection}
            onSelectSection={(sec) => setActiveSection(sec)}
            onViewLiveSite={onBackToSite}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 xs:w-80 max-w-[85vw] h-full bg-white z-10 shadow-2xl flex flex-col animate-slideInLeft overflow-hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 z-20 cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>

            <AdminSidebar
              activeSection={activeSection}
              onSelectSection={(sec) => {
                setActiveSection(sec);
                setIsMobileSidebarOpen(false);
              }}
              onViewLiveSite={() => {
                setIsMobileSidebarOpen(false);
                onBackToSite();
              }}
              onLogout={handleLogout}
              onToggleSidebar={() => setIsMobileSidebarOpen(false)}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <AdminTopBar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onViewLiveSite={onBackToSite}
          onLogout={handleLogout}
          activeSectionTitle={getSectionTitle(activeSection)}
          isSidebarOpen={isSidebarOpen}
          onToggleDesktopSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Dynamic Studio Views */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 w-full min-w-0 max-w-full overflow-x-hidden">
          {activeSection === 'overview' && (
            <DashboardOverview onNavigateToSection={(sec) => setActiveSection(sec)} />
          )}

          {activeSection === 'homepage' && (
            <HomepageManager onNavigateToSection={(sec) => setActiveSection(sec as any)} />
          )}

          {activeSection === 'hero' && (
            <HeroBannerManager />
          )}

          {activeSection === 'shop-banner' && (
            <ShopBannerManager onViewShop={onBackToSite} />
          )}

          {activeSection === 'categories' && (
            <CategoriesManager />
          )}

          {activeSection === 'products' && (
            <ProductCatalogManager />
          )}

          {activeSection === 'offers' && (
            <OffersDealsManager />
          )}

          {activeSection === 'content' && (
            <PageContentEditor onNavigateToSection={(sec) => setActiveSection(sec as any)} />
          )}

          {activeSection === 'rfq-orders' && (
            <RfqOrdersInbox />
          )}

          {activeSection === 'media' && (
            <MediaLibraryManager />
          )}

          {activeSection === 'settings' && (
            <SiteSettingsManager onLogout={handleLogout} />
          )}
        </main>

      </div>

    </div>
  );
};
