'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  ExternalLink, 
  Menu, 
  Search, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Inbox,
  LogOut,
  RefreshCw,
  Check,
  CheckCheck,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AdminTopBarProps {
  onToggleMobileSidebar: () => void;
  onViewLiveSite: () => void;
  onLogout: () => void;
  activeSectionTitle: string;
  isSidebarOpen?: boolean;
  onToggleDesktopSidebar?: () => void;
  onNavigateToSection?: (section: any) => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onToggleMobileSidebar,
  onViewLiveSite,
  onLogout,
  activeSectionTitle,
  isSidebarOpen = true,
  onToggleDesktopSidebar,
  onNavigateToSection
}) => {
  const { adminUser, quotes, orders } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [filterMode, setFilterMode] = useState<'unread' | 'all'>('unread');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Persistent read notification IDs in localStorage
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('ecotex_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleMarkAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = Array.from(new Set([...prev, id]));
      try {
        localStorage.setItem('ecotex_read_notifications', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleMarkAllAsRead = () => {
    const allIds = [
      ...quotes.filter(q => q.status === 'New').map(q => q.id),
      ...orders.filter(o => o.status === 'Pending' || o.status === 'In Production').map(o => o.id)
    ];
    setReadIds((prev) => {
      const next = Array.from(new Set([...prev, ...allIds]));
      try {
        localStorage.setItem('ecotex_read_notifications', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadQuotes = quotes.filter(q => q.status === 'New' && !readIds.includes(q.id));
  const pendingOrders = orders.filter(o => (o.status === 'Pending' || o.status === 'In Production') && !readIds.includes(o.id));
  const totalNotifications = unreadQuotes.length + pendingOrders.length;

  const allActiveQuotes = quotes.filter(q => q.status === 'New');
  const allActiveOrders = orders.filter(o => o.status === 'Pending' || o.status === 'In Production');

  const displayedQuotes = filterMode === 'unread' ? unreadQuotes : allActiveQuotes;
  const displayedOrders = filterMode === 'unread' ? pendingOrders : allActiveOrders;

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-[#B2E2C5]/25 px-2.5 xs:px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Left: Sidebar Toggle Button (Mobile & Desktop) & Active Section Title */}
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 min-w-0">
        {/* Universal Sidebar Open/Close Toggle Button */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              onToggleMobileSidebar();
            } else if (onToggleDesktopSidebar) {
              onToggleDesktopSidebar();
            }
          }}
          className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 border border-slate-200/90 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 group shadow-2xs hover:scale-105 active:scale-95 shrink-0"
          title={isSidebarOpen ? "Toggle Sidebar" : "Open Sidebar"}
          aria-label={isSidebarOpen ? "Toggle sidebar" : "Open sidebar"}
        >
          <Menu className="w-5 h-5 lg:hidden text-slate-700 group-hover:text-[#4E9F76]" />
          <span className="hidden lg:inline-flex">
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-slate-500 group-hover:text-[#4E9F76] transition-colors" />
            ) : (
              <PanelLeftOpen className="w-5 h-5 text-[#4E9F76]" />
            )}
          </span>
          {!isSidebarOpen && (
            <span className="hidden sm:inline text-xs font-bold text-[#4E9F76]">
              Open Sidebar
            </span>
          )}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#86C59E] animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#4E9F76] truncate">
              Ecotex Studio
            </span>
          </div>
          <h1 className="text-xs xs:text-sm sm:text-lg lg:text-xl font-black text-[#0f172a] tracking-tight truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
            {activeSectionTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {/* View Live Site Button (Mobile Icon / Desktop Full) */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex sm:hidden p-2 rounded-xl text-[#4E9F76] bg-[#B2E2C5]/15 border border-[#B2E2C5]/40 hover:bg-[#B2E2C5]/30 transition-all active:scale-95 shadow-xs cursor-pointer"
          title="View Live Site"
          aria-label="View Live Site"
        >
          <ExternalLink className="w-4 h-4 text-[#86C59E]" />
        </a>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#4E9F76] bg-[#B2E2C5]/15 border border-[#B2E2C5]/40 hover:bg-[#B2E2C5]/30 hover:border-[#86C59E] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#86C59E]" />
          <span>View Live Site</span>
        </a>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 transition-all border border-slate-200/80 hover:border-[#B2E2C5]/60 cursor-pointer active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#16a34a] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                {totalNotifications > 99 ? '99+' : totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#4E9F76]" />
                  <span>Activity Feed</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {totalNotifications > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4E9F76] hover:text-[#166534] hover:underline cursor-pointer transition-colors"
                      title="Mark all notifications as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    totalNotifications > 0 ? 'text-[#4E9F76] bg-[#B2E2C5]/20' : 'text-slate-500 bg-slate-100'
                  }`}>
                    {totalNotifications} Active
                  </span>
                </div>
              </div>

              {/* Filter Tabs: Unread / All */}
              <div className="flex items-center gap-1.5 pt-2.5 pb-1">
                <button
                  type="button"
                  onClick={() => setFilterMode('unread')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterMode === 'unread'
                      ? 'bg-[#4E9F76] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  Unread ({totalNotifications})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-[#4E9F76] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  All ({allActiveQuotes.length + allActiveOrders.length})
                </button>
              </div>

              {/* Notifications List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {displayedQuotes.length === 0 && displayedOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 font-medium">
                    <CheckCircle2 className="w-8 h-8 text-[#4E9F76] mx-auto opacity-70 mb-2" />
                    <p className="font-bold text-[#0f172a]">All caught up!</p>
                    <p className="mt-0.5 text-slate-500">No unread notifications in your feed.</p>
                  </div>
                ) : (
                  <>
                    {displayedQuotes.map((q) => {
                      const isRead = readIds.includes(q.id);
                      return (
                        <div 
                          key={q.id} 
                          onClick={() => {
                            handleMarkAsRead(q.id);
                            if (onNavigateToSection) {
                              onNavigateToSection('inbox');
                              setShowNotifications(false);
                            }
                          }}
                          className={`py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                            isRead ? 'opacity-50 bg-slate-50/40' : 'bg-emerald-50/30 hover:bg-emerald-50/60'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-md shrink-0">
                                  RFQ
                                </span>
                                <span className="font-bold text-[#166534] truncate">{q.id}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">{q.date}</span>
                            </div>
                            <p className="text-xs text-[#0f172a] font-semibold truncate mt-1">
                              {q.name} · {q.company || 'Wholesale Buyer'}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              Qty: {q.volume || '5,000 units'} · Category: {q.category || 'General'}
                            </p>
                          </div>
                          {!isRead && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(q.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-[#16a34a] hover:bg-emerald-100 transition-all opacity-80 group-hover:opacity-100 shrink-0 cursor-pointer mt-0.5"
                              title="Mark as read"
                              aria-label="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {displayedOrders.map((o) => {
                      const isRead = readIds.includes(o.id);
                      return (
                        <div 
                          key={o.id} 
                          onClick={() => {
                            handleMarkAsRead(o.id);
                            if (onNavigateToSection) {
                              onNavigateToSection('inbox');
                              setShowNotifications(false);
                            }
                          }}
                          className={`py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                            isRead ? 'opacity-50 bg-slate-50/40' : 'bg-blue-50/30 hover:bg-blue-50/60'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[9px] font-black uppercase tracking-wider text-blue-800 bg-blue-100/90 px-1.5 py-0.5 rounded-md shrink-0">
                                  Order
                                </span>
                                <span className="font-bold text-blue-800 truncate">{o.id}</span>
                              </div>
                              <span className="text-[11px] font-bold text-slate-700 shrink-0">
                                ${(o.total || o.totalAmount || 0).toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-[#0f172a] font-semibold truncate mt-1">
                              {o.customerName} · {o.status}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {o.items?.length || 1} item(s) · {o.paymentMethod || 'Online'}
                            </p>
                          </div>
                          {!isRead && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(o.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-all opacity-80 group-hover:opacity-100 shrink-0 cursor-pointer mt-0.5"
                              title="Mark as read"
                              aria-label="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-slate-100/70 transition-all border border-transparent hover:border-slate-200"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4E9F76] to-[#86C59E] text-white flex items-center justify-center font-black text-xs shadow-sm shadow-[#4E9F76]/20">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-[#0f172a] leading-none">
                {adminUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-1 leading-none">
                {adminUser?.role || 'Super Admin'}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#B2E2C5]/30 p-3 z-50 animate-fadeInUp">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-[#0f172a]">{adminUser?.name || 'Administrator'}</div>
                <div className="text-[11px] text-slate-400 truncate">{adminUser?.email || 'admin@ecotexinc.com'}</div>
              </div>
              <div className="py-1">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/10 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#86C59E]" />
                  <span>Open Storefront</span>
                </a>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
