'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2,
  AlertCircle, 
  ArrowLeft,
  ArrowRight,
  Trash2,
  Truck,
  ShieldCheck,
  PackageCheck,
  Mail,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { CustomSelect } from '../admin/components/ui/CustomSelect';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  initialStep?: 'cart' | 'checkout';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  initialStep = 'cart'
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Credit Card / Instant ACH');
  const [orderRef, setOrderRef] = useState('');
  const [whatsAppNoticeUrl, setWhatsAppNoticeUrl] = useState<string | null>(null);
  const [dispatchedNotifs, setDispatchedNotifs] = useState<{ email?: string; emailEnabled?: boolean; whatsapp?: string; whatsappEnabled?: boolean }>({});
  const { createOrder, siteSettings, categories } = useStore();

  const formatPrice = (val: number) => {
    if (val >= 1000) return `${Math.round(val).toLocaleString()}`;
    return `${val.toFixed(2)}`;
  };

  // Close on Escape key and handle body overflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (checkoutStep === 'checkout') {
          setCheckoutStep('cart');
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, checkoutStep, onClose]);

  // Synchronize step when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (initialStep === 'checkout' && items.length > 0) {
        setCheckoutStep('checkout');
      } else if (checkoutStep !== 'confirmation') {
        setCheckoutStep('cart');
      }
    }
  }, [isOpen, initialStep]);

  // Price & calculations
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const freeFreightThreshold = siteSettings?.shippingConfig?.freeShippingThreshold ?? siteSettings?.quoteCalcConfig?.freeFreightThreshold ?? 1000;
  const standardShippingRate = siteSettings?.shippingConfig?.standardShippingRate ?? 50;
  const isFreeFreight = subtotal >= freeFreightThreshold || items.length === 0;
  const estimatedShipping = isFreeFreight ? 0 : standardShippingRate;
  const grandTotal = subtotal + estimatedShipping;
  const totalBagsDisplaced = items.reduce((sum, item) => sum + item.quantity * 250, 0);
  const freightProgress = Math.min(100, Math.round((subtotal / freeFreightThreshold) * 100));

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `ECX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(newRef);

    const formattedEmail = `${buyerName.toLowerCase().replace(/\s+/g, '.')}@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`;
    const fullShippingAddress = `${address}, ${city}, ${state} ${zip}`.trim();

    const orderPayload = {
      id: newRef,
      buyerName,
      customerName: buyerName,
      companyName,
      customerCompany: companyName,
      email: formattedEmail,
      customerEmail: formattedEmail,
      address: fullShippingAddress,
      shippingAddress: fullShippingAddress,
      city,
      state,
      zip,
      status: 'Pending',
      paymentTerms,
      subtotal,
      shipping: estimatedShipping,
      total: grandTotal,
      totalAmount: grandTotal,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        name: item.product.name,
        quantity: item.quantity,
        price: item.unitPrice,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        color: item.selectedColor
      }))
    };

    // Save order through store and sync to backend API
    try {
      await createOrder(orderPayload);
    } catch (err) {
      console.warn('Order submission handled locally:', err);
    }

    // Dynamic Notification config from Site Settings
    const notifConfig = siteSettings?.orderNotifications || {
      emailEnabled: true,
      notificationEmail: 'orders@ecotexinc.com',
      whatsappEnabled: true,
      whatsappNumber: '+1 (951) 450-9773',
      whatsappGreeting: 'New Wholesale Order Received on EcoTex Storefront',
      autoOpenWhatsapp: true
    };

    const recipientEmail = notifConfig.notificationEmail || siteSettings?.email || 'orders@ecotexinc.com';
    const recipientPhone = notifConfig.whatsappNumber || siteSettings?.phone || '+1 (951) 450-9773';

    setDispatchedNotifs({
      email: recipientEmail,
      emailEnabled: notifConfig.emailEnabled,
      whatsapp: recipientPhone,
      whatsappEnabled: notifConfig.whatsappEnabled
    });

    // Construct WhatsApp message if enabled
    let waUrl: string | null = null;
    if (notifConfig.whatsappEnabled && notifConfig.whatsappNumber) {
      const cleanPhone = notifConfig.whatsappNumber.replace(/[^0-9]/g, '');
      const itemsSummary = items
        .map(i => `• ${i.product.name} (x${i.quantity}) - $${(i.unitPrice * i.quantity).toLocaleString()}`)
        .join('\n');

      const waMessage = 
`📦 *NEW ORDER ALERT - ECOTEX INC*
----------------------------------
*Order Reference:* ${newRef}
*Customer:* ${buyerName}
*Company:* ${companyName || 'Direct Account'}
*Shipping Destination:* ${fullShippingAddress}
*Payment Terms:* ${paymentTerms}

*Order Items:*
${itemsSummary}

*Subtotal:* $${Math.round(subtotal).toLocaleString()}
*Shipping:* ${estimatedShipping === 0 ? 'FREE Freight' : `$${estimatedShipping}`}
*Grand Total:* $${Math.round(grandTotal).toLocaleString()}
----------------------------------
Notification automatically generated via EcoTex Storefront.`;

      waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      setWhatsAppNoticeUrl(waUrl);

      if (notifConfig.autoOpenWhatsapp) {
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch (err) {
          console.warn('Auto-open WhatsApp alert prevented by browser:', err);
        }
      }
    } else {
      setWhatsAppNoticeUrl(null);
    }

    setCheckoutStep('confirmation');
  };

  const handleFinish = () => {
    onClearCart();
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="cart-drawer-curtain"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#f6f3ed] text-[#1c1b18] antialiased flex flex-col min-h-screen"
        >
          
          {/* ========================================================
              CLEAN TOP NAVIGATION BAR
              Left: Brand Wordmark + "Continue Shopping" link
              Right: Elegant Pill Close Button
             ======================================================== */}
          <motion.header 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full px-4 sm:px-12 lg:px-16 py-4 sm:py-6 flex items-center justify-between border-b border-[#cfc8bd]/50 shrink-0 bg-[#f6f3ed]/90 backdrop-blur-xs sticky top-0 z-20"
          >
            {/* Left: Brand Logo + Back link */}
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <span className="hidden sm:inline-block w-px h-5 bg-[#cfc8bd]" />
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-serif text-[#666] hover:text-[#166534] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            {/* Right: Close button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-[#1c1b18] hover:text-[#166534] transition-colors cursor-pointer px-3.5 py-1.5 rounded-full border border-[#cfc8bd]/70 hover:border-[#166534] bg-white/70 shadow-2xs"
              aria-label="Close bag"
            >
              <span>Close</span>
              <X className="w-4 h-4 stroke-[1.5]" />
            </motion.button>
          </motion.header>

          {/* ========================================================
              MAIN BODY
             ======================================================== */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-12 lg:px-16 py-6 sm:py-12">
            
            {/* ----------------------------------------------------
                STEP 1: BAG REVIEW
               ---------------------------------------------------- */}
            {checkoutStep === 'cart' && (
              <>
                {/* Header row: "Your Bag" + items counter + clear cart */}
                <div className="flex items-center justify-between pb-6 sm:pb-8 border-b border-[#cfc8bd]/50 mb-8 sm:mb-10">
                  <div className="flex items-center gap-3">
                    <motion.h1 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45 }}
                      className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1c1b18] tracking-tight leading-none"
                    >
                      Your Bag
                    </motion.h1>
                    {items.length > 0 && (
                      <span className="text-xs font-mono font-medium text-[#166534] bg-[#dcfce7] px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>

                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="inline-flex items-center gap-1.5 text-xs text-[#777] hover:text-[#dc2626] transition-colors cursor-pointer px-2.5 py-1 rounded hover:bg-[#ede7df]/50"
                      title="Clear all items"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Clear all</span>
                    </button>
                  )}
                </div>

                {/* ------------------------------------------------
                    ENHANCED EMPTY STATE
                   ------------------------------------------------ */}
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-xl mx-auto py-8 sm:py-14 text-center"
                  >
                    {/* Visual Icon Badge */}
                    <div className="w-20 h-20 rounded-full bg-[#ede7df] border border-[#cfc8bd]/60 flex items-center justify-center mx-auto mb-6 text-[#166534] shadow-xs">
                      <ShoppingBag className="w-9 h-9 stroke-[1.25]" />
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1c1b18] mb-3">
                      Your bag is currently empty
                    </h2>
                    
                    <p className="text-sm text-[#666] font-light max-w-md mx-auto mb-8 leading-relaxed">
                      Explore our sustainable non-woven totes, biodegradable pouches, and custom-printed wholesale carriers for your brand.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: '#166534' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onClose}
                      className="bg-[#000000] text-white px-8 py-3.5 text-xs font-serif tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md inline-flex items-center gap-2 group"
                    >
                      <span>Explore Collections</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </motion.button>

                    {/* Quick Wholesale Categories */}
                    <div className="mt-12 pt-8 border-t border-[#cfc8bd]/40">
                      <p className="text-[11px] uppercase tracking-widest font-mono text-[#888] mb-3.5">
                        Popular Wholesale Categories
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {(categories && categories.length > 0 ? categories.filter(c => c.id !== 'all') : [
                          { id: '1', label: 'Non-Woven Totes' },
                          { id: '2', label: 'Slider Bags' },
                          { id: '3', label: 'D-Cut Carry Bags' }
                        ]).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={onClose}
                            className="px-3.5 py-1.5 text-xs font-serif text-[#1c1b18] bg-white border border-[#cfc8bd]/60 hover:border-[#166534] hover:text-[#166534] transition-colors rounded-full cursor-pointer shadow-2xs"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3 Trust Guarantees */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-[#666] font-light">
                      <div className="p-3.5 bg-white/60 border border-[#cfc8bd]/40 rounded-lg">
                        <span className="block font-medium text-[#1c1b18] mb-0.5">Direct Mill</span>
                        <span>Wholesale Pricing</span>
                      </div>
                      <div className="p-3.5 bg-white/60 border border-[#cfc8bd]/40 rounded-lg">
                        <span className="block font-medium text-[#1c1b18] mb-0.5">Free Freight</span>
                        <span>Orders Over $1,000</span>
                      </div>
                      <div className="p-3.5 bg-white/60 border border-[#cfc8bd]/40 rounded-lg">
                        <span className="block font-medium text-[#1c1b18] mb-0.5">Custom Printing</span>
                        <span>Full Color PMS Match</span>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  /* ------------------------------------------------
                      CART ITEMS + ORDER SUMMARY GRID
                     ------------------------------------------------ */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    
                    {/* LEFT COLUMN: PRODUCTS TABLE */}
                    <div className="lg:col-span-8 w-full">
                      
                      {/* Column Headers */}
                      <div className="hidden sm:grid grid-cols-12 pb-3 border-b border-[#cfc8bd] text-xs sm:text-sm font-serif text-[#666] uppercase tracking-wider">
                        <div className="col-span-3 sm:col-span-2">Product</div>
                        <div className="col-span-4 sm:col-span-5 pl-2 sm:pl-4">Description</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right pr-2">Price</div>
                        <div className="col-span-1 text-right">Remove</div>
                      </div>

                      {/* Product Rows List */}
                      <div className="divide-y divide-[#cfc8bd]/60">
                        {items.map((item, index) => {
                          const bagThumbnail = item.product.image || (
                            item.product.id.includes('tshirt') || item.product.id.includes('loop') ? '/images/bag-green.png' :
                            item.product.id.includes('dcut') || item.product.id.includes('punch') ? '/images/bag-orange.png' :
                            item.product.id.includes('box') || item.product.id.includes('heavy') ? '/images/bag-black.png' :
                            item.product.id.includes('laminated') || item.product.id.includes('boutique') ? '/images/bag-white.png' :
                            '/images/bag-blue.png'
                          );

                          const rowTotal = item.unitPrice * item.quantity;

                          const isWholesaleItem = item.orderType === 'wholesale' || (!item.orderType && (item.quantity > 5 || (item.quantity % 5 === 0 && item.unitPrice <= (item.product.pricePerUnit || 0.35))));
                          const availableStock = typeof item.product.stockQuantity === 'number' ? item.product.stockQuantity : (item.product.inStock !== false ? 50 : 0);
                          const retailFixedQty = item.product.retailQuantity || item.product.retailMinBoxes || 15;
                          const isRetailFixed = !isWholesaleItem;
                          const minQty = isWholesaleItem ? (item.product.wholesaleMinBoxes || item.product.wholesaleMoq || 5) : retailFixedQty;
                          const maxQty = isWholesaleItem ? (item.product.wholesaleMaxBoxes || availableStock) : retailFixedQty;
                          const isAtMin = isRetailFixed || item.quantity <= minQty;
                          const isAtMax = isRetailFixed || item.quantity >= maxQty;

                          return (
                            <motion.div 
                              key={item.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20, height: 0 }}
                              transition={{ duration: 0.35, delay: index * 0.05 }}
                              className="py-4 sm:py-6 group"
                            >
                              {/* ----------------- MOBILE STACKED VIEW (< sm) ----------------- */}
                              <div className="sm:hidden flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-16 h-18 bg-white rounded-md overflow-hidden p-1.5 flex items-center justify-center border border-[#cfc8bd]/50 shrink-0 shadow-2xs">
                                    <img src={bagThumbnail} alt={item.product.name} className="w-full h-full object-contain" />
                                  </div>
                                  <div className="flex-1 min-w-0 pr-1">
                                    <div className="flex items-start justify-between gap-1">
                                      <h3 className="font-serif text-sm text-[#1c1b18] font-semibold leading-tight line-clamp-1">
                                        {item.product.name}
                                      </h3>
                                      <button
                                        type="button"
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-[#888] hover:text-[#dc2626] p-1 -mt-1 -mr-1 cursor-pointer"
                                        aria-label="Remove item"
                                      >
                                        <X className="w-4 h-4 stroke-[1.5]" />
                                      </button>
                                    </div>
                                    <p className="text-[11px] text-[#777] font-light mt-0.5">
                                      {item.product.gsm} GSM · {item.product.dimensions}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-1">
                                      {isWholesaleItem ? (
                                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                          Wholesale
                                        </span>
                                      ) : (
                                        <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                          Retail
                                        </span>
                                      )}
                                      <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                        📦 {item.product.pcsPerBox || 200} pcs/box
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      disabled={isAtMin}
                                      title={isRetailFixed ? `Retail order quantity is fixed at ${retailFixedQty} boxes` : (isWholesaleItem ? 'Decrease by 5 boxes' : 'Decrease')}
                                      onClick={() => {
                                        if (isRetailFixed || isAtMin) return;
                                        if (isWholesaleItem) {
                                          onUpdateQuantity(item.id, Math.max(minQty, item.quantity - 5));
                                        } else {
                                          onUpdateQuantity(item.id, Math.max(minQty, item.quantity - 1));
                                        }
                                      }}
                                      className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-sm ${
                                        isAtMin ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-[#cfc8bd] text-[#1c1b18] hover:bg-white cursor-pointer'
                                      }`}
                                    >
                                      –
                                    </button>
                                    <span className="font-mono text-xs font-bold min-w-[28px] text-center">
                                      {item.quantity.toLocaleString()} boxes
                                    </span>
                                    <button
                                      type="button"
                                      disabled={isAtMax}
                                      title={isRetailFixed ? `Retail order quantity is fixed at ${retailFixedQty} boxes` : (isWholesaleItem ? 'Increase by 5 boxes' : 'Increase')}
                                      onClick={() => {
                                        if (isRetailFixed || isAtMax) return;
                                        if (isWholesaleItem) {
                                          onUpdateQuantity(item.id, Math.min(maxQty, item.quantity + 5));
                                        } else {
                                          onUpdateQuantity(item.id, Math.min(maxQty, item.quantity + 1));
                                        }
                                      }}
                                      className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-sm ${
                                        isAtMax ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-[#cfc8bd] text-[#1c1b18] hover:bg-white cursor-pointer'
                                      }`}
                                    >
                                      +
                                    </button>
                                    {isRetailFixed && (
                                      <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-medium">
                                        🔒 Fixed
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-right font-serif text-base font-bold text-[#166534]">
                                    ${rowTotal < 100 ? rowTotal.toFixed(2) : Math.round(rowTotal).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              {/* ----------------- DESKTOP TABLE VIEW (sm:) ----------------- */}
                              <div className="hidden sm:grid grid-cols-12 items-center">
                              {/* 1. Thumbnail */}
                              <div className="col-span-3 sm:col-span-2">
                                <div className="w-16 h-18 sm:w-20 sm:h-22 bg-white rounded-md overflow-hidden p-2 flex items-center justify-center border border-[#cfc8bd]/50 group-hover:border-[#166534]/40 transition-colors shadow-2xs">
                                  <img
                                    src={bagThumbnail}
                                    alt={item.product.name}
                                    className="w-full h-full object-contain filter drop-shadow-xs"
                                  />
                                </div>
                              </div>

                              {/* 2. Description */}
                              <div className="col-span-4 sm:col-span-5 pl-2 sm:pl-4 pr-2">
                                <h3 className="font-serif text-sm sm:text-base text-[#1c1b18] font-normal leading-snug group-hover:text-[#166534] transition-colors">
                                  {item.product.name}
                                </h3>
                                <p className="text-xs text-[#777] font-light mt-0.5">
                                  {item.product.gsm} GSM · {item.product.dimensions}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                  {item.orderType === 'wholesale' ? (
                                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                                      Wholesale (Min {item.product.wholesaleMinBoxes || item.product.wholesaleMoq || 5} Boxes · Step 5)
                                    </span>
                                  ) : (
                                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                                      Retail ({item.product.retailQuantity ? `${item.product.retailQuantity} boxes` : `1–${item.product.retailMaxBoxes || 15} boxes max`})
                                    </span>
                                  )}
                                  <span className="inline-block text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                                    📦 {item.product.pcsPerBox || 200} pcs/box ({((item.quantity || 1) * (item.product.pcsPerBox || 200)).toLocaleString()} pcs)
                                  </span>
                                  {(item.product.inStock === false || (typeof item.product.stockQuantity === 'number' && item.product.stockQuantity <= 0)) && (
                                    <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded">
                                      ⚠️ Out of Stock
                                    </span>
                                  )}
                                </div>
                                {/* Mobile Quantity Badge so it is NEVER hidden */}
                                <div className="sm:hidden mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#cfc8bd]/60 text-[11px] font-mono font-bold text-[#166534]">
                                  <span>Quantity:</span>
                                  <span>{(item.quantity || 1).toLocaleString()} {(item.quantity || 1) === 1 ? 'box' : 'boxes'}</span>
                                </div>
                              </div>

                              {/* 3. Quantity: Responsive Stepper with dynamic limits */}
                              {(() => {
                                const isWholesaleItem = item.orderType === 'wholesale';
                                const availableStock = typeof item.product.stockQuantity === 'number' ? item.product.stockQuantity : (item.product.inStock !== false ? 50 : 0);
                                const retailFixedQty = item.product.retailQuantity || item.product.retailMinBoxes || 15;
                                const isRetailFixed = !isWholesaleItem;
                                const minQty = isWholesaleItem ? (item.product.wholesaleMinBoxes || item.product.wholesaleMoq || 5) : retailFixedQty;
                                const maxQty = isWholesaleItem ? (item.product.wholesaleMaxBoxes || availableStock) : retailFixedQty;
                                const isAtMin = isRetailFixed || item.quantity <= minQty;
                                const isAtMax = isRetailFixed || item.quantity >= maxQty;

                                return (
                                  <div className="col-span-2 flex flex-col items-center justify-center select-none">
                                    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-serif">
                                      <motion.button
                                        whileTap={{ scale: isAtMin ? 1 : 0.8 }}
                                        type="button"
                                        disabled={isAtMin}
                                        onClick={() => {
                                          if (isRetailFixed || isAtMin) return;
                                          if (isWholesaleItem) {
                                            onUpdateQuantity(item.id, Math.max(minQty, item.quantity - 5));
                                          } else {
                                            onUpdateQuantity(item.id, Math.max(minQty, item.quantity - 1));
                                          }
                                        }}
                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-colors text-sm leading-none font-bold ${
                                          isAtMin
                                            ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                                            : 'border-[#cfc8bd] hover:border-[#1c1b18] hover:bg-white text-[#1c1b18] cursor-pointer'
                                        }`}
                                        aria-label="Decrease quantity"
                                        title={isRetailFixed ? `Retail quantity is locked at ${retailFixedQty} boxes` : (isWholesaleItem ? 'Wholesale step is 5 boxes' : 'Decrease')}
                                      >
                                        –
                                      </motion.button>
                                      <span className={`font-mono text-xs sm:text-sm font-bold tabular-nums min-w-[28px] text-center px-1 ${item.quantity > availableStock ? 'text-rose-600' : 'text-[#1c1b18]'}`}>
                                        {item.quantity < 1000 ? item.quantity : `${item.quantity.toLocaleString()}`}
                                      </span>
                                      <motion.button
                                        whileTap={{ scale: isAtMax ? 1 : 0.8 }}
                                        type="button"
                                        disabled={isAtMax}
                                        onClick={() => {
                                          if (isRetailFixed || isAtMax) return;
                                          if (isWholesaleItem) {
                                            onUpdateQuantity(item.id, Math.min(maxQty, item.quantity + 5));
                                          } else {
                                            onUpdateQuantity(item.id, Math.min(maxQty, item.quantity + 1));
                                          }
                                        }}
                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center transition-colors text-sm leading-none font-bold ${
                                          isAtMax
                                            ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                                            : 'border-[#cfc8bd] hover:border-[#1c1b18] hover:bg-white text-[#1c1b18] cursor-pointer'
                                        }`}
                                        aria-label="Increase quantity"
                                        title={
                                          isRetailFixed
                                            ? `Retail quantity is locked at ${retailFixedQty} boxes`
                                            : (isAtMax
                                                ? (item.quantity >= availableStock ? `Available stock limit reached (${availableStock} boxes in stock)` : `Maximum wholesale order reached`)
                                                : (isWholesaleItem ? 'Increase by 5 boxes' : 'Increase quantity'))
                                        }
                                      >
                                        +
                                      </motion.button>
                                    </div>
                                    {isRetailFixed && (
                                      <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-sans font-medium mt-1">
                                        🔒 Fixed {retailFixedQty} boxes
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* 4. Price */}
                              <div className="col-span-2 text-right pr-2 font-serif text-sm sm:text-base text-[#1c1b18]">
                                ${rowTotal < 100 ? rowTotal.toFixed(2) : Math.round(rowTotal).toLocaleString()}
                              </div>

                              {/* 5. Delete Button */}
                              <div className="col-span-1 text-right">
                                <motion.button
                                  whileHover={{ scale: 1.2, color: '#dc2626' }}
                                  whileTap={{ scale: 0.8 }}
                                  type="button"
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-[#888] hover:text-[#dc2626] p-1 transition-colors cursor-pointer inline-flex items-center justify-end"
                                  aria-label={`Remove ${item.product.name} from bag`}
                                >
                                  <X className="w-4 h-4 stroke-[1.5]" />
                                </motion.button>
                              </div>
                              </div>

                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Environmental displacement note */}
                      <div className="mt-8 p-3.5 bg-white/60 border border-[#cfc8bd]/50 rounded-lg flex items-center gap-2.5 text-xs text-[#555] font-light">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#166534]"></span>
                        </span>
                        <span>
                          Bulk order displaces approximately <strong className="font-medium text-[#166534]">{totalBagsDisplaced.toLocaleString()}</strong> single-use bags.
                        </span>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: ENHANCED ORDER SUMMARY */}
                    <div className="lg:col-span-4 w-full">
                      <div className="bg-white/80 border border-[#cfc8bd]/70 p-6 rounded-xl shadow-xs flex flex-col">
                        
                        <h2 className="font-serif text-base sm:text-lg text-[#1c1b18] font-normal pb-3 border-b border-[#cfc8bd]/60">
                          Order Summary
                        </h2>

                        {/* Free Freight Incentive Meter */}
                        <div className="py-3 border-b border-[#cfc8bd]/40">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="inline-flex items-center gap-1.5 text-[#166534] font-medium">
                              <Truck className="w-3.5 h-3.5" />
                              {subtotal >= freeFreightThreshold ? 'Free Freight Qualified!' : `Add $${Math.round(freeFreightThreshold - subtotal).toLocaleString()} for Free Freight`}
                            </span>
                            <span className="font-mono text-[11px] text-[#666]">{freightProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#ede7df] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#166534] transition-all duration-500 rounded-full" 
                              style={{ width: `${freightProgress}%` }} 
                            />
                          </div>
                        </div>

                        {/* Line Items */}
                        <div className="py-3.5 space-y-2.5 text-sm font-serif text-[#1c1b18]">
                          <div className="flex items-center justify-between">
                            <span className="text-[#666]">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                            <span className="font-mono font-medium">{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#666]">Freight Shipping</span>
                            <span className="font-medium text-[#166534]">{estimatedShipping === 0 ? 'FREE' : `$${estimatedShipping}`}</span>
                          </div>
                        </div>

                        {/* Total Box */}
                        <div className="bg-[#ece4db] px-5 py-4 rounded-lg flex items-center justify-between font-serif text-lg text-[#1c1b18] mt-1 shadow-2xs">
                          <span className="font-medium">Total</span>
                          <span className="font-normal font-mono text-xl text-[#166534]">
                            {formatPrice(grandTotal)}
                          </span>
                        </div>

                        {/* Checkout CTA */}
                        {(() => {
                          const hasOutOfStockItems = items.some(item => item.product.inStock === false || (typeof item.product.stockQuantity === 'number' && item.product.stockQuantity <= 0));
                          const overStockItems = items.filter(item => {
                            const stock = typeof item.product.stockQuantity === 'number' ? item.product.stockQuantity : (item.product.inStock !== false ? 50 : 0);
                            return item.quantity > stock;
                          });

                          if (hasOutOfStockItems) {
                            return (
                              <div className="mt-4">
                                <button
                                  type="button"
                                  disabled={true}
                                  className="w-full bg-slate-200 text-slate-500 py-3.5 px-4 text-xs font-serif tracking-wider uppercase cursor-not-allowed text-center flex items-center justify-center gap-2 rounded-md"
                                >
                                  <span>Cannot Checkout · Out of Stock Item</span>
                                </button>
                                <p className="text-[11px] text-rose-600 mt-1.5 text-center font-medium">
                                  Please remove out-of-stock items before proceeding to checkout.
                                </p>
                              </div>
                            );
                          }

                          if (overStockItems.length > 0) {
                            return (
                              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                  <span>Stock Limit Exceeded ({overStockItems.length} item{overStockItems.length > 1 ? 's' : ''})</span>
                                </div>
                                <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                                  Cart quantity exceeds available stock. Please reduce quantity or auto-adjust below.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    overStockItems.forEach(item => {
                                      const stock = typeof item.product.stockQuantity === 'number' ? item.product.stockQuantity : (item.product.inStock !== false ? 50 : 0);
                                      onUpdateQuantity(item.id, Math.max(1, stock));
                                    });
                                  }}
                                  className="mt-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#14532d] py-2 px-3 rounded transition-colors cursor-pointer w-full text-center shadow-xs"
                                >
                                  Auto-Adjust to Available Stock
                                </button>
                                <button
                                  type="button"
                                  disabled={true}
                                  className="w-full bg-slate-200 text-slate-500 py-3 px-4 text-xs font-serif tracking-wider uppercase cursor-not-allowed text-center flex items-center justify-center gap-2 rounded-md mt-2"
                                >
                                  <span>Cannot Checkout · Exceeds Stock Limit</span>
                                </button>
                              </div>
                            );
                          }

                          return (
                            <motion.button
                              whileHover={{ scale: 1.02, backgroundColor: '#166534' }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setCheckoutStep('checkout')}
                              className="w-full bg-[#000000] text-white py-4 px-6 text-xs sm:text-sm font-serif tracking-widest uppercase transition-all duration-300 mt-4 cursor-pointer text-center flex items-center justify-center gap-2 group shadow-sm hover:shadow-md rounded-md"
                            >
                              <span>Proceed to Checkout</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </motion.button>
                          );
                        })()}

                        {/* Trust Assurance */}
                        <div className="mt-4 pt-3 border-t border-[#cfc8bd]/30 flex items-center justify-center gap-1.5 text-[11px] text-[#777]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
                          <span>Direct Wholesale PO & Secure Invoice</span>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </>
            )}

            {/* ----------------------------------------------------
                STEP 2: CHECKOUT INFORMATION
               ---------------------------------------------------- */}
            {checkoutStep === 'checkout' && (
              <motion.div 
                key="checkout-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto py-4"
              >
                
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-[#1c1b18] hover:text-[#166534] transition-colors mb-6 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Bag</span>
                </button>

                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1c1b18] mb-2">
                  Order Details
                </h2>
                <p className="text-sm text-[#666] font-light mb-6">
                  Please enter your delivery facility and billing information to complete your order.
                </p>

                {/* Compact Order Items Preview */}
                <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#cfc8bd]/60">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 pb-2 border-b border-[#cfc8bd]/40">
                    <span>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <button 
                      type="button" 
                      onClick={() => setCheckoutStep('cart')}
                      className="text-xs text-[#166534] hover:underline cursor-pointer lowercase font-medium"
                    >
                      edit items
                    </button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                            <img src={item.product.image || '/images/bag-green.png'} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1c1b18] truncate">{item.product.name}</p>
                            <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-stone-800 shrink-0 ml-3">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="David Miller"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#cfc8bd] rounded-md focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sierra Grocers Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#cfc8bd] rounded-md focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                      Delivery Facility Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1200 Industrial Parkway, Dock #4"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-[#cfc8bd] rounded-md focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Corona"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#cfc8bd] rounded-md focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#cfc8bd] rounded-md focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                        ZIP *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="92881"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#cfc8bd] rounded-md focus:border-[#166534] focus:ring-1 focus:ring-[#166534] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-[#1c1b18] mb-1.5 uppercase tracking-wider">
                      Payment / Procurement Terms
                    </label>
                    <CustomSelect
                      value={paymentTerms}
                      onChange={(val) => setPaymentTerms(val)}
                      options={[
                        { value: 'Credit Card / Instant ACH', label: 'Credit Card / Instant ACH' },
                        { value: 'Corporate Net 30 Terms', label: 'Corporate Net 30 Terms (Approved Accounts)' },
                        { value: 'Wire Transfer / Pro-Forma Invoice', label: 'Wire Transfer / Pro-Forma Invoice' }
                      ]}
                      className="w-full"
                      buttonClassName="w-full bg-white border-[#cfc8bd] text-sm py-2.5 font-sans"
                    />
                  </div>

                  {/* Total review bar */}
                  <div className="bg-[#ece4db] px-5 py-4 rounded-lg flex items-center justify-between font-serif text-lg text-[#1c1b18]">
                    <span>Total Due</span>
                    <span className="font-mono font-bold text-[#166534]">${Math.round(grandTotal).toLocaleString()}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015, backgroundColor: '#166534' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#000000] text-white py-4 px-6 text-sm font-serif tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-md rounded-md"
                  >
                    Place Order (${Math.round(grandTotal).toLocaleString()})
                  </motion.button>

                </form>

              </motion.div>
            )}

            {/* ----------------------------------------------------
                STEP 3: ORDER CONFIRMATION
               ---------------------------------------------------- */}
            {checkoutStep === 'confirmation' && (
              <motion.div 
                key="confirmation-step"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto py-12 text-center"
              >
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-[#166534] text-white flex items-center justify-center mx-auto mb-6 shadow-md"
                >
                  <PackageCheck className="w-8 h-8" />
                </motion.div>

                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1c1b18] mb-3">
                  Order Transmitted
                </h2>
                <p className="text-sm text-[#555] font-light max-w-md mx-auto leading-relaxed mb-8">
                  Thank you, <strong>{buyerName}</strong> ({companyName}). Your order reference has been logged at our Corona, CA facility.
                </p>

                <div className="bg-white/80 p-6 border border-[#cfc8bd] rounded-xl text-left font-serif text-sm space-y-3 mb-6 shadow-xs">
                  <div className="flex justify-between border-b border-[#cfc8bd]/60 pb-2">
                    <span className="text-[#666]">Reference Number:</span>
                    <span className="font-mono font-bold text-[#166534]">{orderRef}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#cfc8bd]/60 pb-2">
                    <span className="text-[#666]">Total Value:</span>
                    <span className="font-mono font-bold">${Math.round(grandTotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#cfc8bd]/60 pb-2">
                    <span className="text-[#666]">Fulfillment Center:</span>
                    <span>Corona, CA 92881</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Terms:</span>
                    <span>{paymentTerms}</span>
                  </div>
                </div>

                {/* Notification Dispatch Status Box */}
                {(dispatchedNotifs.emailEnabled || dispatchedNotifs.whatsappEnabled) && (
                  <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-left text-xs font-serif text-[#1c1b18] shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span className="font-sans font-semibold uppercase tracking-wider text-[11px] text-emerald-900">
                        Automated Order Dispatch
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {dispatchedNotifs.emailEnabled && (
                        <div className="flex items-center justify-between gap-3 text-emerald-950/80 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>EcoTex Email Alert:</span>
                          </div>
                          <span className="font-mono font-semibold text-emerald-900 truncate max-w-[200px]">
                            {dispatchedNotifs.email || 'orders@ecotexinc.com'}
                          </span>
                        </div>
                      )}

                      {dispatchedNotifs.whatsappEnabled && whatsAppNoticeUrl && (
                        <div className="bg-white/70 p-3 rounded-lg border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-emerald-950/80">
                            <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>WhatsApp Dispatch ({dispatchedNotifs.whatsapp}):</span>
                          </div>
                          <a
                            href={whatsAppNoticeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white font-sans text-xs font-medium transition-colors shadow-xs"
                          >
                            <span>Open WhatsApp Alert</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#166534' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  className="w-full bg-[#000000] text-white py-4 px-6 text-sm font-serif tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-md rounded-md"
                >
                  Continue Shopping
                </motion.button>

              </motion.div>
            )}

          </main>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

