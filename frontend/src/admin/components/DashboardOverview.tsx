import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Edit3,
  X,
  Save,
  Check
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store/useStore';
import { AdminSection } from './AdminSidebar';
import { StatusBadgeDropdown } from './ui/StatusBadgeDropdown';

interface DashboardOverviewProps {
  onNavigateToSection: (section: AdminSection) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToSection
}) => {
  const { 
    analytics, 
    products, 
    orders, 
    quotes, 
    siteSettings, 
    updateSiteSettings, 
    updateAnalytics, 
    updateQuoteStatus, 
    updateOrderStatus,
    fetchOrders,
    fetchQuotes
  } = useStore();

  React.useEffect(() => {
    fetchOrders?.();
    fetchQuotes?.();
  }, [fetchOrders, fetchQuotes]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dashboardConfig = siteSettings?.dashboardConfig || {};
  const welcomeBadge = dashboardConfig.welcomeBadge || 'Industrial Facility Direct · Sanity-Style CMS';
  const welcomeTitle = dashboardConfig.welcomeTitle || 'Wholesale Operations & Dynamic CMS Studio';
  const welcomeSubtitle = dashboardConfig.welcomeSubtitle || 'Real-time management for live hero colorways, wholesale product catalog, ESG metric counters, and incoming supermarket bag RFQs.';
  const visitorsSubtext = dashboardConfig.activeVisitorsSubtext || '+18.4% from last week';
  const catalogSubtext = dashboardConfig.catalogSubtext || 'Active production models';
  const revenueSubtext = dashboardConfig.grossRevenueSubtext || 'Direct mill contracts';

  // Form state for Dashboard & KPIs
  const [formData, setFormData] = useState({
    welcomeBadge,
    welcomeTitle,
    welcomeSubtitle,
    activeVisitors: analytics.activeVisitors || 48,
    activeVisitorsSubtext: visitorsSubtext,
    catalogSubtext: catalogSubtext,
    grossRevenueSubtext: revenueSubtext,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = () => {
    setFormData({
      welcomeBadge,
      welcomeTitle,
      welcomeSubtitle,
      activeVisitors: analytics.activeVisitors || 48,
      activeVisitorsSubtext: visitorsSubtext,
      catalogSubtext: catalogSubtext,
      grossRevenueSubtext: revenueSubtext,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      dashboardConfig: {
        welcomeBadge: formData.welcomeBadge.trim(),
        welcomeTitle: formData.welcomeTitle.trim(),
        welcomeSubtitle: formData.welcomeSubtitle.trim(),
        activeVisitorsSubtext: formData.activeVisitorsSubtext.trim(),
        catalogSubtext: formData.catalogSubtext.trim(),
        grossRevenueSubtext: formData.grossRevenueSubtext.trim(),
      }
    });

    updateAnalytics({
      activeVisitors: Number(formData.activeVisitors) || 48
    });

    setIsEditModalOpen(false);
    showToast('Dashboard & KPI configuration updated successfully!');
  };

  const totalCatalogCount = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const newQuotes = quotes.filter(q => q.status === 'New');
  const sortedOrders = [...orders].sort((a, b) => new Date((b as any).createdAt || b.date || 0).getTime() - new Date((a as any).createdAt || a.date || 0).getTime());
  const recentOrders = sortedOrders.slice(0, 5);
  const sortedQuotes = [...quotes].sort((a, b) => new Date((b as any).createdAt || b.date || 0).getTime() - new Date((a as any).createdAt || a.date || 0).getTime());
  const recentQuotes = sortedQuotes.slice(0, 5);

  // Computed real gross pipeline from orders or analytics
  const realGrossRevenue = orders.length > 0 
    ? orders.reduce((sum, o) => sum + (Number(o.total || o.totalAmount) || 0), 0)
    : analytics.grossRevenue;

  const statsCards = [
    {
      title: 'Active B2B Sessions',
      value: (analytics.activeVisitors || 48).toLocaleString(),
      subtext: visitorsSubtext,
      icon: Users,
      trend: 'up',
      badgeColor: 'bg-[#B2E2C5]/20 text-[#4E9F76]'
    },
    {
      title: 'Quote Requests (RFQ)',
      value: quotes.length.toString(),
      subtext: `${newQuotes.length} pending review`,
      icon: FileText,
      trend: 'neutral',
      badgeColor: 'bg-[#B2E2C5]/25 text-[#4E9F76]'
    },
    {
      title: 'Wholesale Catalog',
      value: `${inStockCount}/${totalCatalogCount}`,
      subtext: catalogSubtext,
      icon: Package,
      trend: 'up',
      badgeColor: 'bg-[#86C59E]/15 text-[#4E9F76]'
    },
    {
      title: 'Gross Pipeline Value',
      value: `$${realGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
      subtext: revenueSubtext,
      icon: DollarSign,
      trend: 'up',
      badgeColor: 'bg-[#4E9F76]/15 text-[#4E9F76]'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4E9F76] via-[#007018] to-[#0f172a] text-white p-4 xs:p-5 sm:p-7 lg:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-[#B2E2C5] w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B2E2C5] shrink-0" />
              <span className="truncate">{welcomeBadge}</span>
            </div>
            
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer w-fit self-start xs:self-auto"
              title="Edit Dashboard Welcome Banner & KPI Subtexts"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B2E2C5]" />
              <span>Edit Banner & KPIs</span>
            </button>
          </div>

          <h2 className="text-xl xs:text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {welcomeTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
            {welcomeSubtitle}
          </p>

          <div className="mt-5 sm:mt-6 flex flex-col xs:flex-row flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigateToSection('products')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#86C59E] hover:bg-[#B2E2C5] text-[#0f172a] font-bold text-xs transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => onNavigateToSection('hero')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B2E2C5] shrink-0" />
              <span>Customize Hero 3D Showcase</span>
            </button>
            <button
              onClick={() => onNavigateToSection('shop-banner')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Edit Shop Page Banner</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#86C59E]/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#B2E2C5]/30 shadow-xs hover:shadow-md transition-all hover:border-[#86C59E]/60 group relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.badgeColor} transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#4E9F76]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#86C59E]" />
                  <span>{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dashboard Config Modal */}
      {isEditModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsEditModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">
                  Customize Dashboard & KPIs
                </h3>
                <p className="text-xs text-slate-500">
                  Edit welcome texts, B2B visitor counters, and KPI metric captions dynamically.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Welcome Banner Badge Label
                </label>
                <input
                  type="text"
                  value={formData.welcomeBadge}
                  onChange={(e) => setFormData({ ...formData, welcomeBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  placeholder="e.g. Industrial Facility Direct · Sanity-Style CMS"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Welcome Banner Title
                </label>
                <input
                  type="text"
                  value={formData.welcomeTitle}
                  onChange={(e) => setFormData({ ...formData, welcomeTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  placeholder="e.g. Wholesale Operations & Dynamic CMS Studio"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Welcome Banner Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.welcomeSubtitle}
                  onChange={(e) => setFormData({ ...formData, welcomeSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  placeholder="Banner description..."
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">
                  KPI Card Customization
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Active B2B Sessions Count
                    </label>
                    <input
                      type="number"
                      value={formData.activeVisitors}
                      onChange={(e) => setFormData({ ...formData, activeVisitors: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      B2B Sessions Subtext
                    </label>
                    <input
                      type="text"
                      value={formData.activeVisitorsSubtext}
                      onChange={(e) => setFormData({ ...formData, activeVisitorsSubtext: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                      placeholder="+18.4% from last week"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Wholesale Catalog Subtext
                    </label>
                    <input
                      type="text"
                      value={formData.catalogSubtext}
                      onChange={(e) => setFormData({ ...formData, catalogSubtext: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                      placeholder="Active production models"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Gross Pipeline Subtext
                    </label>
                    <input
                      type="text"
                      value={formData.grossRevenueSubtext}
                      onChange={(e) => setFormData({ ...formData, grossRevenueSubtext: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                      placeholder="Direct mill contracts"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Dashboard Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Two Column Layout: Recent RFQ Submissions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent RFQ Inbox Preview */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#B2E2C5]/20 text-[#4E9F76] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">Recent RFQ Sample Inquiries</h3>
                  <p className="text-[11px] text-slate-400">Customer requests for enterprise bag quotes</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToSection('rfq-orders')}
                className="text-xs font-bold text-[#4E9F76] hover:text-[#86C59E] flex items-center gap-1 transition-colors"
              >
                <span>View All ({quotes.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentQuotes.map((q) => (
                <div key={q.id} className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-xs text-[#0f172a] truncate">{q.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px] sm:max-w-none">({q.company || 'Enterprise'})</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                        q.status === 'New' 
                          ? 'bg-[#B2E2C5]/30 text-[#4E9F76] border border-[#B2E2C5]' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {q.volume} · {q.printing} · {q.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 self-stretch sm:self-center pt-1 sm:pt-0 shrink-0">
                    <StatusBadgeDropdown
                      value={q.status}
                      onChange={(val) => updateQuoteStatus(q.id, val)}
                      options={['New', 'In Review', 'Quotation Sent', 'Approved', 'Declined']}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateToSection('rfq-orders')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#B2E2C5]/15 text-slate-700 hover:text-[#4E9F76] text-xs font-bold transition-all text-center"
            >
              Open Complete Quotes & Sample Inbox
            </button>
          </div>
        </div>

        {/* Recent Wholesale Production Orders */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#B2E2C5]/30 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">Production & Freight Orders</h3>
                  <p className="text-[11px] text-slate-400">Live factory orders queued for shipment</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToSection('rfq-orders')}
                className="text-xs font-bold text-[#4E9F76] hover:text-[#86C59E] flex items-center gap-1 transition-colors"
              >
                <span>View All ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentOrders.map((o) => (
                <div key={o.id} className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-xs text-[#0f172a]">{o.id}</span>
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px] sm:max-w-none">{o.customerCompany || o.companyName || o.customerName || o.buyerName || 'Wholesale Client'}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ${(o.total || o.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} · {o.paymentTerms}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 self-stretch sm:self-center pt-1 sm:pt-0 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      o.status === 'Completed'
                        ? 'bg-[#B2E2C5]/20 text-[#4E9F76]'
                        : o.status === 'In Production'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigateToSection('rfq-orders')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#B2E2C5]/15 text-slate-700 hover:text-[#4E9F76] text-xs font-bold transition-all text-center"
            >
              Manage Wholesale Freight Orders
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
