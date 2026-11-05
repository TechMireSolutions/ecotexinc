'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Inbox, 
  FileText, 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  Eye, 
  X, 
  ChevronRight,
  Send,
  Calendar,
  DollarSign,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Save,
  Check,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { QuoteSubmission, Order } from '../../types';
import { StatusBadgeDropdown } from './ui/StatusBadgeDropdown';
import { CustomSelect } from './ui/CustomSelect';

export const RfqOrdersInbox: React.FC = () => {
  const { 
    quotes, 
    orders, 
    products,
    siteSettings,
    updateSiteSettings,
    fetchOrders,
    fetchQuotes,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    createQuote,
    updateQuote,
    deleteQuote,
    updateQuoteStatus 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'quotes' | 'orders'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // WhatsApp Order Alert Config Modal
  const [isWhatsAppConfigOpen, setIsWhatsAppConfigOpen] = useState(false);
  const [waAlertNumber, setWaAlertNumber] = useState('');
  const [waAlertEmail, setWaAlertEmail] = useState('');
  const [waAlertEnabled, setWaAlertEnabled] = useState(true);

  const handleOpenWhatsAppConfig = () => {
    const notifs = siteSettings?.orderNotifications;
    setWaAlertNumber(notifs?.whatsappNumber || siteSettings?.whatsappNumber || '+92 332 8784015');
    setWaAlertEmail(notifs?.notificationEmail || siteSettings?.email || 'orders@ecotexinc.com');
    setWaAlertEnabled(notifs?.whatsappEnabled !== false);
    setIsWhatsAppConfigOpen(true);
  };

  const handleSaveWhatsAppConfig = () => {
    const currentNotifs = siteSettings?.orderNotifications || {
      emailEnabled: true,
      notificationEmail: 'orders@ecotexinc.com',
      whatsappEnabled: true,
      whatsappNumber: '+92 332 8784015',
      whatsappGreeting: 'New Wholesale Order Received on EcoTex Storefront',
      autoOpenWhatsapp: true
    };

    updateSiteSettings({
      whatsappNumber: waAlertNumber.trim(),
      orderNotifications: {
        ...currentNotifs,
        whatsappNumber: waAlertNumber.trim(),
        notificationEmail: waAlertEmail.trim(),
        whatsappEnabled: waAlertEnabled
      }
    });

    setIsWhatsAppConfigOpen(false);
    showToast('WhatsApp Order Alert number updated to ' + waAlertNumber.trim());
  };

  // Selected Detail Modal
  const [selectedQuote, setSelectedQuote] = useState<QuoteSubmission | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Edit / Create Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteSubmission | null>(null);

  // Form states for Orders
  const [orderForm, setOrderForm] = useState({
    id: '',
    customerName: '',
    customerCompany: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentTerms: 'Credit Card / Instant ACH',
    status: 'Pending',
    productName: '',
    quantity: 1000,
    unitPrice: 0.25,
    shippingCost: 0,
  });

  // Form states for Quotes
  const [quoteForm, setQuoteForm] = useState({
    id: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Non-Woven Totes',
    volume: '10,000 units',
    printing: 'Custom 2-Color Flexo Logo',
    message: '',
    status: 'New'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto-sync from backend on mount
  useEffect(() => {
    fetchOrders?.();
    fetchQuotes?.();
  }, [fetchOrders, fetchQuotes]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchOrders ? fetchOrders() : Promise.resolve(),
        fetchQuotes ? fetchQuotes() : Promise.resolve()
      ]);
      showToast('Live orders and quotes synchronized from server');
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Lock body scroll and handle Escape key for modals
  const isAnyModalOpen = Boolean(selectedQuote || selectedOrder || isOrderModalOpen || isQuoteModalOpen || isWhatsAppConfigOpen);
  useEffect(() => {
    if (!isAnyModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedQuote(null);
        setSelectedOrder(null);
        setIsOrderModalOpen(false);
        setIsQuoteModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyModalOpen]);

  // Order Handlers
  const handleOpenCreateOrder = () => {
    setEditingOrder(null);
    setOrderForm({
      id: `ECX-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: '',
      customerCompany: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      paymentTerms: 'Credit Card / Instant ACH',
      status: 'Pending',
      productName: products[0]?.name || 'High-Tensile Polypropylene Bag',
      quantity: 1000,
      unitPrice: 0.25,
      shippingCost: 0,
    });
    setIsOrderModalOpen(true);
  };

  const handleOpenEditOrder = (order: Order) => {
    setEditingOrder(order);
    const firstItem = order.items?.[0];
    const unitPrice = firstItem ? (firstItem.price || firstItem.unitPrice || 0.25) : 0.25;
    const qty = firstItem ? (Number(firstItem.quantity) || 1) : 1000;
    const prodName = firstItem ? (firstItem.productName || firstItem.name || 'High-Tensile Polypropylene Bag') : 'High-Tensile Polypropylene Bag';

    setOrderForm({
      id: order.id,
      customerName: order.customerName || order.buyerName || '',
      customerCompany: order.customerCompany || order.companyName || '',
      customerEmail: order.customerEmail || order.email || '',
      customerPhone: (order as any).phone || (order as any).customerPhone || '',
      shippingAddress: order.shippingAddress || order.address || '',
      paymentTerms: order.paymentTerms || 'Credit Card / Instant ACH',
      status: order.status || 'Pending',
      productName: prodName,
      quantity: qty,
      unitPrice: unitPrice,
      shippingCost: Number(order.shipping) || 0,
    });
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.customerName.trim()) {
      alert('Please enter a customer or buyer name.');
      return;
    }

    const calculatedSubtotal = (Number(orderForm.quantity) || 1) * (Number(orderForm.unitPrice) || 0);
    const calculatedTotal = calculatedSubtotal + (Number(orderForm.shippingCost) || 0);

    const itemsPayload = [
      {
        id: `item-${Date.now()}`,
        productId: 'prod-custom',
        name: orderForm.productName.trim() || 'Custom Bag',
        productName: orderForm.productName.trim() || 'Custom Bag',
        quantity: Number(orderForm.quantity) || 1,
        unitPrice: Number(orderForm.unitPrice) || 0,
        price: Number(orderForm.unitPrice) || 0,
        totalPrice: calculatedSubtotal,
        color: 'Default',
        customPrint: true
      }
    ];

    if (editingOrder) {
      updateOrder(editingOrder.id, {
        customerName: orderForm.customerName.trim(),
        buyerName: orderForm.customerName.trim(),
        customerCompany: orderForm.customerCompany.trim(),
        companyName: orderForm.customerCompany.trim(),
        customerEmail: orderForm.customerEmail.trim(),
        email: orderForm.customerEmail.trim(),
        shippingAddress: orderForm.shippingAddress.trim(),
        address: orderForm.shippingAddress.trim(),
        paymentTerms: orderForm.paymentTerms,
        status: orderForm.status as any,
        subtotal: calculatedSubtotal,
        shipping: Number(orderForm.shippingCost) || 0,
        total: calculatedTotal,
        totalAmount: calculatedTotal,
        items: itemsPayload
      });
      showToast(`Order ${editingOrder.id} updated successfully!`);
    } else {
      createOrder({
        id: orderForm.id.trim() || `ECX-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: orderForm.customerName.trim(),
        buyerName: orderForm.customerName.trim(),
        customerCompany: orderForm.customerCompany.trim() || 'Wholesale Client',
        companyName: orderForm.customerCompany.trim() || 'Wholesale Client',
        customerEmail: orderForm.customerEmail.trim() || 'orders@client.com',
        email: orderForm.customerEmail.trim() || 'orders@client.com',
        shippingAddress: orderForm.shippingAddress.trim() || 'Standard Delivery',
        address: orderForm.shippingAddress.trim() || 'Standard Delivery',
        paymentTerms: orderForm.paymentTerms,
        status: orderForm.status as any,
        subtotal: calculatedSubtotal,
        shipping: Number(orderForm.shippingCost) || 0,
        total: calculatedTotal,
        totalAmount: calculatedTotal,
        items: itemsPayload
      });
      showToast(`New Order ${orderForm.id} created successfully!`);
    }

    setIsOrderModalOpen(false);
    if (selectedOrder) setSelectedOrder(null);
  };

  const handleDeleteOrder = (order: Order) => {
    if (window.confirm(`Are you sure you want to permanently delete order ${order.id}?`)) {
      deleteOrder(order.id);
      if (selectedOrder?.id === order.id) setSelectedOrder(null);
      showToast(`Order ${order.id} deleted.`);
    }
  };

  // Quote Handlers
  const handleOpenCreateQuote = () => {
    setEditingQuote(null);
    setQuoteForm({
      id: `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      company: '',
      email: '',
      phone: '',
      category: 'Non-Woven Totes',
      volume: '10,000 units',
      printing: 'Custom 2-Color Flexo Logo',
      message: '',
      status: 'New'
    });
    setIsQuoteModalOpen(true);
  };

  const handleOpenEditQuote = (quote: QuoteSubmission) => {
    setEditingQuote(quote);
    setQuoteForm({
      id: quote.id,
      name: quote.name || '',
      company: quote.company || '',
      email: quote.email || '',
      phone: quote.phone || '',
      category: quote.category || quote.bagType || 'Non-Woven Totes',
      volume: quote.volume || (quote.quantity ? `${quote.quantity} units` : '10,000 units'),
      printing: quote.printing || 'Custom Flexo Printing',
      message: quote.message || '',
      status: quote.status || 'New'
    });
    setIsQuoteModalOpen(true);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name.trim() || !quoteForm.email.trim()) {
      alert('Please enter both name and email.');
      return;
    }

    if (editingQuote) {
      updateQuote(editingQuote.id, {
        name: quoteForm.name.trim(),
        company: quoteForm.company.trim(),
        email: quoteForm.email.trim(),
        phone: quoteForm.phone.trim(),
        category: quoteForm.category.trim(),
        volume: quoteForm.volume.trim(),
        printing: quoteForm.printing.trim(),
        message: quoteForm.message.trim(),
        status: quoteForm.status as any
      });
      showToast(`Quote ${editingQuote.id} updated successfully!`);
    } else {
      createQuote({
        id: quoteForm.id.trim() || `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name: quoteForm.name.trim(),
        company: quoteForm.company.trim() || 'Enterprise Client',
        email: quoteForm.email.trim(),
        phone: quoteForm.phone.trim(),
        category: quoteForm.category.trim(),
        volume: quoteForm.volume.trim(),
        printing: quoteForm.printing.trim(),
        message: quoteForm.message.trim(),
        status: quoteForm.status as any
      });
      showToast(`New RFQ quote ${quoteForm.id} created successfully!`);
    }

    setIsQuoteModalOpen(false);
    if (selectedQuote) setSelectedQuote(null);
  };

  const handleDeleteQuote = (quote: QuoteSubmission) => {
    if (window.confirm(`Are you sure you want to permanently delete quote ${quote.id}?`)) {
      deleteQuote(quote.id);
      if (selectedQuote?.id === quote.id) setSelectedQuote(null);
      showToast(`Quote ${quote.id} deleted.`);
    }
  };

  // Sort Quotes newest first
  const sortedQuotes = [...quotes].sort(
    (a, b) => new Date((b as any).createdAt || b.date || 0).getTime() - new Date((a as any).createdAt || a.date || 0).getTime()
  );

  // Filter Quotes
  const filteredQuotes = sortedQuotes.filter(q => {
    const matchesSearch = 
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.company && q.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort Orders newest first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date((b as any).createdAt || b.date || 0).getTime() - new Date((a as any).createdAt || a.date || 0).getTime()
  );

  // Filter Orders
  const filteredOrders = sortedOrders.filter(o => {
    const custName = (o.customerName || o.buyerName || '').toLowerCase();
    const custEmail = (o.customerEmail || o.email || '').toLowerCase();
    const custCompany = (o.customerCompany || o.companyName || '').toLowerCase();
    const orderId = (o.id || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = 
      custName.includes(query) ||
      custEmail.includes(query) ||
      custCompany.includes(query) ||
      orderId.includes(query);
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const newQuotesCount = quotes.filter(q => q.status === 'New').length;

  return (
    <div className="space-y-6 animate-fadeInUp pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
      
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#B2E2C5]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#B2E2C5]/20 text-[#4E9F76]">
              <Inbox className="w-4 h-4" />
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#4E9F76]">
              Procurement & Sales Desk
            </span>
          </div>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-black text-[#0f172a] mt-1">
            RFQ & Production Orders Inbox
          </h2>
          <p className="text-xs text-slate-500">
            Create, edit, delete, and inspect live customer orders and enterprise wholesale RFQ quotes.
          </p>
        </div>

        <div>
            <button
              type="button"
              onClick={handleOpenWhatsAppConfig}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 font-bold text-xs shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Configure phone number receiving WhatsApp order notifications"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></div>
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>WhatsApp Alerts:</span>
              <span className="font-mono text-[11px] bg-white text-emerald-950 font-black px-2 py-0.5 rounded-md border border-emerald-200">
                {siteSettings?.orderNotifications?.whatsappNumber || siteSettings?.whatsappNumber || '+92 332 8784015'}
              </span>
            </button>
          </div>

          {/* Action Buttons: Add Order / Add Quote + Refresh */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full sm:w-auto">
          {activeTab === 'orders' ? (
            <button
              onClick={handleOpenCreateOrder}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Create Order</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateQuote}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Create RFQ Quote</span>
            </button>
          )}

          {/* Tab Switcher & Manual Refresh */}
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-2xl flex-1 xs:flex-none">
            <button
              onClick={() => {
                setActiveTab('orders');
                setStatusFilter('all');
              }}
              className={`flex-1 xs:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-[#4E9F76] shadow-xs'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Orders</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                pendingOrdersCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-[#B2E2C5]/20 text-[#4E9F76]'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('quotes');
                setStatusFilter('all');
              }}
              className={`flex-1 xs:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-white text-[#4E9F76] shadow-xs'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Quotes</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                newQuotesCount > 0 ? 'bg-blue-100 text-blue-800' : 'bg-[#B2E2C5]/20 text-[#4E9F76]'
              }`}>
                {quotes.length}
              </span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Orders from Server"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#86C59E] hover:bg-slate-50 text-slate-600 hover:text-[#4E9F76] transition-all shadow-xs cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#4E9F76]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#B2E2C5]/30 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={activeTab === 'quotes' ? "Search inquiries by buyer name, company, email, or RFQ ID..." : "Search orders by order ID, buyer, company, or email..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0f172a] focus:outline-none focus:border-[#86C59E] focus:ring-2 focus:ring-[#B2E2C5]/30"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="w-full sm:w-auto">
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={
                activeTab === 'quotes' ? [
                  { value: 'all', label: 'All Statuses' },
                  { value: 'New', label: 'New', dot: 'bg-emerald-500' },
                  { value: 'In Review', label: 'In Review', dot: 'bg-amber-500' },
                  { value: 'Quotation Sent', label: 'Quotation Sent', dot: 'bg-blue-500' },
                  { value: 'Approved', label: 'Approved', dot: 'bg-emerald-600' },
                  { value: 'Declined', label: 'Declined', dot: 'bg-rose-500' }
                ] : [
                  { value: 'all', label: 'All Statuses' },
                  { value: 'Pending', label: 'Pending', dot: 'bg-amber-500' },
                  { value: 'In Production', label: 'In Production', dot: 'bg-purple-500' },
                  { value: 'Shipped', label: 'Shipped', dot: 'bg-sky-500' },
                  { value: 'Completed', label: 'Completed', dot: 'bg-emerald-500' }
                ]
              }
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Quotes View (Mobile Cards + Desktop Table) */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {/* Mobile Card List (block md:hidden) */}
          <div className="block md:hidden space-y-3">
            {filteredQuotes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#B2E2C5]/30 p-8 text-center text-slate-400 font-medium">
                No quotation requests matching your filter.
                <div className="mt-3">
                  <button
                    onClick={handleOpenCreateQuote}
                    className="px-4 py-2 bg-[#4E9F76] text-white rounded-xl text-xs font-bold"
                  >
                    + Create New Quote
                  </button>
                </div>
              </div>
            ) : (
              filteredQuotes.map((q) => (
                <div key={q.id} className="bg-white rounded-3xl border border-[#B2E2C5]/40 p-4 shadow-xs space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-[#0f172a]">{q.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium">· {q.date || 'Recent'}</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 mt-0.5 truncate">{q.name}</div>
                      <div className="text-[11px] text-[#4E9F76] font-semibold truncate">{q.company || 'Enterprise Wholesaler'}</div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadgeDropdown
                        value={q.status}
                        onChange={(val) => updateQuoteStatus(q.id, val)}
                        options={['New', 'In Review', 'Quotation Sent', 'Approved', 'Declined']}
                      />
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium text-[11px]">Product:</span>
                      <span className="font-semibold text-slate-800 capitalize truncate max-w-[180px]">{q.category || q.bagType || 'Wholesale Packaging'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium text-[11px]">Volume:</span>
                      <span className="font-black text-[#4E9F76]">
                        {q.volume || (q.quantity ? `${Number(q.quantity).toLocaleString()} units` : '10,000 units')}
                      </span>
                    </div>
                    {q.printing && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <span className="text-slate-400 font-medium text-[11px]">Printing:</span>
                        <span className="text-slate-600 font-medium truncate max-w-[170px]">{q.printing}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px] font-medium">{q.email}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedQuote(q)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] bg-slate-100 hover:bg-[#B2E2C5]/20 transition-all cursor-pointer"
                        title="View Detail"
                        aria-label="View Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditQuote(q)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] bg-slate-100 hover:bg-[#B2E2C5]/20 transition-all cursor-pointer"
                        title="Edit Quote"
                        aria-label="Edit Quote"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuote(q)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer"
                        title="Delete Quote"
                        aria-label="Delete Quote"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#B2E2C5]/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">RFQ ID & Date</th>
                    <th className="py-4 px-6">Buyer & Organization</th>
                    <th className="py-4 px-6">Product & Volume</th>
                    <th className="py-4 px-6">Printing Requirement</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredQuotes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No quotation requests matching your filter.
                        <div className="mt-3">
                          <button
                            onClick={handleOpenCreateQuote}
                            className="px-4 py-2 bg-[#4E9F76] text-white rounded-xl text-xs font-bold"
                          >
                            + Create New Quote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ID & Date */}
                        <td className="py-4 px-6">
                          <div className="font-black text-[#0f172a]">{q.id}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{q.date || 'Recent'}</div>
                        </td>

                        {/* Buyer */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#0f172a]">{q.name}</div>
                          <div className="text-[11px] text-[#4E9F76] font-medium">{q.company || 'Enterprise Wholesaler'}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{q.email}</div>
                        </td>

                        {/* Product & Volume */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-800 capitalize">
                            {q.category || q.bagType || 'Wholesale Packaging'}
                          </div>
                          <div className="text-[11px] font-black text-[#4E9F76] mt-0.5 flex items-center gap-1">
                            <span className="text-slate-400 font-normal">Qty:</span>
                            <span>{q.volume || (q.quantity ? `${Number(q.quantity).toLocaleString()} units` : '10,000 units')}</span>
                          </div>
                        </td>

                        {/* Printing */}
                        <td className="py-4 px-6">
                          <span className="text-slate-600 font-medium">
                            {q.printing || 'Custom Flexo Print'}
                          </span>
                        </td>

                        {/* Status Selector */}
                        <td className="py-4 px-6">
                          <StatusBadgeDropdown
                            value={q.status}
                            onChange={(val) => updateQuoteStatus(q.id, val)}
                            options={['New', 'In Review', 'Quotation Sent', 'Approved', 'Declined']}
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedQuote(q)}
                              className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 transition-colors cursor-pointer"
                              title="View Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditQuote(q)}
                              className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 transition-colors cursor-pointer"
                              title="Edit Quote"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(q)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Quote"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders View (Mobile Cards + Desktop Table) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Mobile Card List (block md:hidden) */}
          <div className="block md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#B2E2C5]/30 p-8 text-center text-slate-400 font-medium">
                No production orders found matching your search.
                <div className="mt-3">
                  <button
                    onClick={handleOpenCreateOrder}
                    className="px-4 py-2 bg-[#4E9F76] text-white rounded-xl text-xs font-bold"
                  >
                    + Create New Order
                  </button>
                </div>
              </div>
            ) : (
              filteredOrders.map((o) => (
                <div key={o.id} className="bg-white rounded-3xl border border-[#B2E2C5]/40 p-4 shadow-xs space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-[#0f172a]">{o.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium">· {o.date || 'Recent'}</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 mt-0.5 truncate">{o.customerName || o.buyerName || 'Commercial Buyer'}</div>
                      <div className="text-[11px] text-[#4E9F76] font-semibold truncate">{o.customerCompany || o.companyName || 'Wholesale Client'}</div>
                    </div>
                    <div className="shrink-0">
                      <StatusBadgeDropdown
                        value={o.status}
                        onChange={(val) => updateOrderStatus(o.id, val)}
                        options={['Pending', 'In Production', 'Shipped', 'Completed']}
                      />
                    </div>
                  </div>

                  {/* Order Financials & Line Items */}
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium text-[11px]">Wholesale Total:</span>
                      <span className="font-black text-sm text-[#4E9F76]">
                        ${(o.total || o.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Payment Terms:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[170px]">{o.paymentTerms || 'Credit Card / Instant ACH'}</span>
                    </div>
                    {o.items && o.items.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Item Summary:</span>
                        {o.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="line-clamp-1 font-medium text-slate-700 flex items-center gap-1.5 text-[11px]">
                            <span className="font-bold text-[#4E9F76]">{(Number(item.quantity) || 1).toLocaleString()}x</span>
                            <span className="truncate">{item.productName || item.name || 'Custom Bag'}</span>
                          </div>
                        ))}
                        {o.items.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-medium italic">+ {o.items.length - 2} more item(s)</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px] font-medium">{o.customerEmail || o.email || '—'}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] bg-slate-100 hover:bg-[#B2E2C5]/20 transition-all cursor-pointer"
                        title="View Detail"
                        aria-label="View Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditOrder(o)}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] bg-slate-100 hover:bg-[#B2E2C5]/20 transition-all cursor-pointer"
                        title="Edit Order"
                        aria-label="Edit Order"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(o)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer"
                        title="Delete Order"
                        aria-label="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (hidden md:block) */}
          <div className="hidden md:block bg-white rounded-3xl border border-[#B2E2C5]/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Order ID & Date</th>
                    <th className="py-4 px-6">Customer & Company</th>
                    <th className="py-4 px-6">Items & Quantity</th>
                    <th className="py-4 px-6">Total & Payment</th>
                    <th className="py-4 px-6">Production Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No production orders found matching your search.
                        <div className="mt-3">
                          <button
                            onClick={handleOpenCreateOrder}
                            className="px-4 py-2 bg-[#4E9F76] text-white rounded-xl text-xs font-bold"
                          >
                            + Create New Order
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-black text-[#0f172a]">{o.id}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{o.date || 'Recent'}</div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-bold text-[#0f172a]">{o.customerName || o.buyerName || 'Commercial Buyer'}</div>
                          <div className="text-[11px] text-[#4E9F76] font-medium">{o.customerCompany || o.companyName || 'Wholesale Client'}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{o.customerEmail || o.email || '—'}</div>
                        </td>

                        <td className="py-4 px-6">
                          {o.items && o.items.length > 0 ? (
                            o.items.map((item, idx) => (
                              <div key={idx} className="line-clamp-1 font-medium text-slate-700 flex items-center gap-1.5">
                                <span className="font-bold text-[#4E9F76]">
                                  {(Number(item.quantity) || 1).toLocaleString()}x
                                </span>
                                <span>{item.productName || item.name || 'Custom Bag'}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-500 font-medium">Qty: 1,000x Custom Spec Packaging</div>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-black text-[#4E9F76]">
                            ${(o.total || o.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{o.paymentTerms || 'Credit Card / Instant ACH'}</div>
                        </td>

                        <td className="py-4 px-6">
                          <StatusBadgeDropdown
                            value={o.status}
                            onChange={(val) => updateOrderStatus(o.id, val)}
                            options={['Pending', 'In Production', 'Shipped', 'Completed']}
                          />
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 transition-colors cursor-pointer"
                              title="View Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditOrder(o)}
                              className="p-2 rounded-xl text-slate-600 hover:text-[#4E9F76] hover:bg-[#B2E2C5]/15 transition-colors cursor-pointer"
                              title="Edit Order"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(o)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedQuote(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200/80 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4E9F76] bg-[#B2E2C5]/20 px-2 py-0.5 rounded-full">
                  RFQ Inbound Dossier
                </span>
                <h3 className="text-lg font-black text-[#0f172a] mt-1">
                  Quote {selectedQuote.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400 font-semibold block">Buyer Name</span>
                  <span className="font-bold text-[#0f172a] text-sm">{selectedQuote.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Company / Chain</span>
                  <span className="font-bold text-[#4E9F76] text-sm">{selectedQuote.company || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Contact Email</span>
                  <span className="font-medium text-slate-700">{selectedQuote.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Phone</span>
                  <span className="font-medium text-slate-700">{selectedQuote.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Packaging Category:</span>
                  <span className="font-bold text-[#0f172a] capitalize">{selectedQuote.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Order Volume:</span>
                  <span className="font-black text-[#4E9F76]">
                    {selectedQuote.volume || (selectedQuote.quantity ? `${Number(selectedQuote.quantity).toLocaleString()} units` : '10,000 units')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Printing Specification:</span>
                  <span className="font-medium text-slate-700">{selectedQuote.printing}</span>
                </div>
              </div>

              {selectedQuote.message && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-slate-400 font-semibold block">Client Specifications / Note:</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {selectedQuote.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <StatusBadgeDropdown
                  value={selectedQuote.status}
                  onChange={(val) => {
                    updateQuoteStatus(selectedQuote.id, val);
                    setSelectedQuote({ ...selectedQuote, status: val as any });
                  }}
                  options={['New', 'In Review', 'Quotation Sent', 'Approved', 'Declined']}
                />
                <button
                  onClick={() => {
                    handleOpenEditQuote(selectedQuote);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2 rounded-xl bg-[#4E9F76] text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Order Detail Modal */}
      {selectedOrder && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl shadow-black/40 border border-slate-200/80 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#86C59E] bg-[#86C59E]/15 px-2 py-0.5 rounded-full">
                  Wholesale Freight Order
                </span>
                <h3 className="text-lg font-black text-[#0f172a] mt-1">
                  Order {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-semibold block">Customer Name</span>
                  <span className="font-bold text-[#0f172a]">{selectedOrder.customerName || selectedOrder.buyerName || 'Commercial Buyer'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Company</span>
                  <span className="font-bold text-[#4E9F76]">{selectedOrder.customerCompany || selectedOrder.companyName || 'Wholesale Client'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Email</span>
                  <span className="text-slate-600 truncate block">{selectedOrder.customerEmail || selectedOrder.email || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Payment Terms</span>
                  <span className="text-slate-600 font-semibold">{selectedOrder.paymentTerms || 'Credit Card / Instant ACH'}</span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-semibold block">Shipping Destination</span>
                  <span className="text-slate-700 font-medium">{selectedOrder.shippingAddress || selectedOrder.address || 'Standard Freight Dispatch'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-200/80 rounded-2xl p-4 divide-y divide-slate-100">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px] mb-2">
                  Line Items Queued
                </span>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => {
                    const unitP = item.price || item.unitPrice || 0;
                    const qty = item.quantity || 1;
                    return (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#0f172a]">{item.productName || item.name || 'Custom Bag'}</div>
                          <div className="text-slate-400 text-[11px]">
                            Qty: {qty.toLocaleString()} pcs @ ${unitP.toFixed(2)}/pc
                          </div>
                        </div>
                        <div className="font-black text-[#4E9F76]">
                          ${(qty * unitP).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-2 text-slate-400 italic text-[11px]">Wholesale Bag Consignment</div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-[#B2E2C5]/15 rounded-2xl">
                <span className="font-bold text-[#0f172a]">Wholesale Total:</span>
                <span className="text-base font-black text-[#4E9F76]">
                  ${(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <StatusBadgeDropdown
                  value={selectedOrder.status}
                  onChange={(val) => {
                    updateOrderStatus(selectedOrder.id, val);
                    setSelectedOrder({ ...selectedOrder, status: val as any });
                  }}
                  options={['Pending', 'In Production', 'Shipped', 'Completed']}
                />
                <button
                  onClick={() => {
                    handleOpenEditOrder(selectedOrder);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-[#4E9F76] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CREATE / EDIT ORDER MODAL */}
      {isOrderModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsOrderModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">
                  {editingOrder ? `Edit Order #${editingOrder.id}` : 'Create New Wholesale Order'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingOrder ? 'Update buyer details, line items, and consignment specifications' : 'Record a new manual factory production order'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Customer / Buyer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="e.g. Elena Vasquez"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={orderForm.customerCompany}
                    onChange={(e) => setOrderForm({ ...orderForm, customerCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="e.g. SunWest Markets California"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="buyer@company.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Payment Terms
                  </label>
                  <select
                    value={orderForm.paymentTerms}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  >
                    <option value="Credit Card / Instant ACH">Credit Card / Instant ACH</option>
                    <option value="Net 30 Enterprise Terms">Net 30 Enterprise Terms</option>
                    <option value="50% Deposit / 50% on Bill of Lading">50% Deposit / 50% on Bill of Lading</option>
                    <option value="Wire Transfer / ACH Prepay">Wire Transfer / ACH Prepay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Shipping Destination Address
                </label>
                <input
                  type="text"
                  value={orderForm.shippingAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, shippingAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  placeholder="e.g. 1420 Harbor Blvd, Suite 200, Long Beach, CA 90802"
                />
              </div>

              {/* Line Items & Pricing */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Product Item & Quantities
                </span>
                
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">
                    Product Model / Packaging Type
                  </label>
                  <input
                    type="text"
                    value={orderForm.productName}
                    onChange={(e) => setOrderForm({ ...orderForm, productName: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="Product name..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">
                      Quantity (pcs)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">
                      Price per Piece ($)
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      min={0}
                      value={orderForm.unitPrice}
                      onChange={(e) => setOrderForm({ ...orderForm, unitPrice: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">
                      Freight Shipping ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={orderForm.shippingCost}
                      onChange={(e) => setOrderForm({ ...orderForm, shippingCost: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 font-bold">
                  <span className="text-slate-600">Calculated Total:</span>
                  <span className="text-[#4E9F76] text-sm">
                    ${((Number(orderForm.quantity) || 1) * (Number(orderForm.unitPrice) || 0) + (Number(orderForm.shippingCost) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Production & Dispatch Status
                </label>
                <select
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Production">In Production</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingOrder ? 'Update Order' : 'Create Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CREATE / EDIT QUOTE MODAL */}
      {isQuoteModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsQuoteModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/40 border border-slate-200/80 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#4E9F76]/15 text-[#4E9F76] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0f172a]">
                  {editingQuote ? `Edit Quote #${editingQuote.id}` : 'Create New Wholesale Quote (RFQ)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingQuote ? 'Update enterprise client requirements, volume, or quotation progress' : 'Submit or record a direct customer wholesale packaging inquiry'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Buyer / Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="e.g. David Sterling"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="e.g. Pacific Grocers Co."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="david@pacificgrocers.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Packaging Category / Bag Type
                  </label>
                  <input
                    type="text"
                    value={quoteForm.category}
                    onChange={(e) => setQuoteForm({ ...quoteForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="e.g. Non-Woven Totes, D-Cut"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Volume / Quantity Desired
                  </label>
                  <input
                    type="text"
                    value={quoteForm.volume}
                    onChange={(e) => setQuoteForm({ ...quoteForm, volume: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                    placeholder="e.g. 25,000 units"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Printing Specification
                </label>
                <input
                  type="text"
                  value={quoteForm.printing}
                  onChange={(e) => setQuoteForm({ ...quoteForm, printing: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  placeholder="e.g. Full-bleed flexographic printing, 2 sides"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer Message / Custom Specs
                </label>
                <textarea
                  rows={3}
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                  placeholder="Additional specifications or requests..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quotation Status
                </label>
                <select
                  value={quoteForm.status}
                  onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4E9F76]"
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4E9F76] hover:bg-[#3d8560] text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingQuote ? 'Update Quote' : 'Create Quote'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Quick WhatsApp Alert Config Modal */}
      {isWhatsAppConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-[#166534] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg uppercase tracking-tight">
                    WhatsApp Order Dispatch Alerts
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Order notifications receiver phone configuration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppConfigOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                Jab bhi koi customer storefront se order place karega, is phone number par live order details aur link WhatsApp message ke through land hogi.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>WhatsApp Phone Number (Admin Receiver) *</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Country Code Required</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={waAlertNumber}
                    onChange={(e) => setWaAlertNumber(e.target.value)}
                    placeholder="+92 332 8784015 or +1 (951) 450-9773"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 border-emerald-300 focus:border-[#25D366] rounded-xl focus:outline-none font-bold text-slate-900"
                  />
                  <Phone className="w-4 h-4 text-[#25D366] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Example: <code className="font-mono text-emerald-800 font-bold">+92 332 8784015</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Order Notification Copy Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={waAlertEmail}
                    onChange={(e) => setWaAlertEmail(e.target.value)}
                    placeholder="orders@ecotexinc.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-[#166534] focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">WhatsApp Order Alerts Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waAlertEnabled}
                    onChange={(e) => setWaAlertEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {waAlertEnabled ? 'Enabled' : 'Paused'}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <a
                  href={'https://wa.me/' + waAlertNumber.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent('Test alert from Ecotex Inc Orders Desk')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Test this WhatsApp number</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsWhatsAppConfigOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWhatsAppConfig}
                className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md shadow-[#25D366]/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Number</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
