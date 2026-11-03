'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  Minus, 
  Plus,
  Share2,
  AlertCircle,
  Package,
  Lock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { DYE_COLORS, DyeColor } from '../data/colors';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
  onOpenQuote: (product: Product) => void;
  onExpressCheckout?: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenQuote,
  onExpressCheckout
}) => {
  if (!product) return null;

  const { siteSettings } = useStore();

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const [selectedColor, setSelectedColor] = useState<DyeColor>(() => {
    return DYE_COLORS.find(c => c.name.toLowerCase() === ((product as any).color || product.availableColors?.[0]?.name)?.toLowerCase()) || DYE_COLORS[4]; // Default: Dark Green
  });

  // Fixed product bag image (does not change on color swatch selection)
  const bagCutout = product.image || '/images/bag-green.png';

  const galleryImages = [
    { url: bagCutout, label: 'Front Product Shot' },
    { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85', label: 'Lifestyle Editorial' },
    { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85', label: 'Fabric Macro & Seam' },
    { url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85', label: 'Production Detail' }
  ];

  const wholesaleMoq = product.wholesaleMinBoxes || product.wholesaleMoq || 5;
  const wholesaleMaxBoxes = product.wholesaleMaxBoxes;
  const retailFixedQty = product.retailQuantity || 15;
  const pcsPerBox = product.pcsPerBox || 200;
  const isOutOfStock = product.inStock === false || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
  const availableStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock !== false ? 50 : 0);

  const minQuantity = orderType === 'retail' ? retailFixedQty : wholesaleMoq;
  const maxQuantity = orderType === 'retail' ? Math.min(retailFixedQty, availableStock) : (wholesaleMaxBoxes ? Math.min(wholesaleMaxBoxes, availableStock) : availableStock);
  const [moqWarning, setMoqWarning] = useState<string | null>(null);

  // Sync state when product changes or orderType toggles
  useEffect(() => {
    setActiveImageIndex(0);
    setMoqWarning(null);
    setQuantity(orderType === 'retail' ? Math.min(retailFixedQty, availableStock) : Math.min(wholesaleMoq, availableStock));
  }, [product, orderType, wholesaleMoq, availableStock]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Pricing calculations
  const retailUnitPrice = product.pricePerUnit ? (product.pricePerUnit * 1.45) : 0.45;
  const wholesaleUnitPrice = product.pricePerUnit || 0.25;
  const currentPrice = orderType === 'retail' ? retailUnitPrice : wholesaleUnitPrice;
  const originalPrice = (currentPrice * 1.25);

  const handleIncrement = () => {
    if (orderType === 'retail') {
      if (quantity >= maxQuantity) {
        setMoqWarning(maxQuantity < 5 
          ? `Stock limit reached: only ${availableStock} boxes available in stock.`
          : `Retail orders are fixed at exactly ${retailFixedQty} boxes.`);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      setQuantity(prev => Math.min(maxQuantity, prev + 1));
    } else {
      // Wholesale: step of 5 up to maxQuantity (availableStock)
      if (quantity >= maxQuantity) {
        setMoqWarning(`Stock limit reached: only ${availableStock} boxes available in stock.`);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      setQuantity(prev => {
        if (prev < 5) return Math.min(maxQuantity, 5);
        const next = (prev % 5 !== 0) ? Math.floor(prev / 5) * 5 + 5 : prev + 5;
        return Math.min(maxQuantity, next);
      });
    }
    setMoqWarning(null);
  };

  const handleDecrement = () => {
    if (orderType === 'retail') {
      setQuantity(prev => Math.max(1, prev - 1));
    } else {
      // Wholesale: step of 5, minimum 5
      setQuantity(prev => {
        if (prev <= 5) return 5;
        if (prev % 5 !== 0) return Math.max(5, Math.floor(prev / 5) * 5);
        return Math.max(5, prev - 5);
      });
    }
    setMoqWarning(null);
  };

  const handleAddToCartClick = () => {
    if (isOutOfStock) {
      setMoqWarning('This product is currently out of stock and cannot be added to cart.');
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (quantity > availableStock) {
      setMoqWarning(`Cannot add to cart: only ${availableStock} boxes available in stock.`);
      setQuantity(availableStock);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (orderType === 'wholesale') {
      if (quantity < wholesaleMoq) {
        setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq} boxes.`);
        setQuantity(wholesaleMoq);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      if (quantity % 5 !== 0) {
        const rounded = Math.min(availableStock, Math.ceil(quantity / 5) * 5);
        setMoqWarning(`Wholesale orders must be in multiples of 5. Updated to ${rounded} boxes.`);
        setQuantity(rounded);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    if (orderType === 'retail' && quantity > 5) {
      setMoqWarning('Retail orders are limited to a maximum of 5 boxes. Please switch to Wholesale Order for larger quantities.');
      setQuantity(Math.min(5, availableStock));
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    onAddToCart(product, selectedColor.name, quantity, orderType);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleExpressCheckout = () => {
    if (isOutOfStock) {
      setMoqWarning('This product is currently out of stock and cannot be ordered.');
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (quantity > availableStock) {
      setMoqWarning(`Cannot order: only ${availableStock} boxes available in stock.`);
      setQuantity(availableStock);
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    if (orderType === 'wholesale') {
      if (quantity < wholesaleMoq) {
        setMoqWarning(`Wholesale minimum order quantity is ${wholesaleMoq} boxes.`);
        setQuantity(wholesaleMoq);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
      if (quantity % 5 !== 0) {
        const rounded = Math.min(availableStock, Math.ceil(quantity / 5) * 5);
        setMoqWarning(`Wholesale orders must be in multiples of 5. Updated to ${rounded} boxes.`);
        setQuantity(rounded);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    if (orderType === 'retail' && quantity > 5) {
      setMoqWarning('Retail orders are limited to a maximum of 5 boxes. Please switch to Wholesale Order for larger quantities.');
      setQuantity(Math.min(5, availableStock));
      setTimeout(() => setMoqWarning(null), 4000);
      return;
    }
    setMoqWarning(null);
    if (onExpressCheckout) {
      onExpressCheckout(product, selectedColor.name, quantity, orderType);
    } else {
      onAddToCart(product, selectedColor.name, quantity, orderType);
      onClose();
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 animate-fadeIn transition-all"
    >
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/40 overflow-hidden border border-slate-200 my-auto text-[#111827] max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar: Breadcrumbs & Close Button */}
        <div className="px-4 sm:px-10 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
            <button onClick={onClose} className="hover:text-[#166534] transition-colors cursor-pointer">
              HOME
            </button>
            <span className="text-slate-300">&gt;</span>
            <button onClick={onClose} className="hover:text-[#166534] transition-colors cursor-pointer">
              COLLECTIONS
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-[#111827] font-bold truncate">
              {product.name}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer ml-4 shrink-0 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Exactly Matching Reference Image Layout */}
        <div className="overflow-y-auto px-4 sm:px-10 py-5 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ====================================================
                LEFT COLUMN: MAIN IMAGE & 4-THUMBNAIL GALLERY
               ==================================================== */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Main Image Frame with Floating Wishlist Heart */}
              <div className="relative w-full aspect-[4/5] sm:aspect-square bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md flex items-center justify-center p-6 group">
                <img
                  src={galleryImages[activeImageIndex].url}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105 select-none"
                />

                {/* Floating Circular Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Save to Wishlist"
                  className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-red-500 transition-all active:scale-90 cursor-pointer"
                >
                  <Heart className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                  }`} />
                </button>

                {/* Brand Signature Logo Watermark (Bottom Left) */}
                <div className="absolute bottom-5 left-6 select-none opacity-75 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <span className="font-serif italic font-bold text-2xl tracking-tighter">E</span>
                    <div className="flex flex-col -space-y-1">
                      <span className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-800 font-sans">
                        ECOTEX
                      </span>
                      <span className="text-[7px] font-bold tracking-[0.3em] uppercase text-slate-500 font-sans">
                        ORIGINALS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Thumbnails Strip Below Main Image */}
              <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4">
                {galleryImages.map((thumb, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-2xl overflow-hidden bg-white p-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-2 border-[#d97706] shadow-md ring-2 ring-amber-500/20 scale-102'
                          : 'border border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={thumb.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>

            </div>

            {/* ====================================================
                RIGHT COLUMN: DETAILS, ORDER SWITCHER, CTA, SPECS
               ==================================================== */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              
              {/* Category, Stock Status & Rating Row */}
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#d97706]">
                  {product.categoryLabel || 'SUSTAINABLE NON-WOVEN'}
                </span>
                
                {isOutOfStock && (
                  <>
                    <span className="text-slate-300">—</span>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                      <span>Out of Stock</span>
                    </div>
                  </>
                )}

                <span className="text-slate-300">—</span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#d97706]">
                  <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Main Product Heading */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#111827] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Article No. & Volume No. Row */}
              <div className="mt-2.5 flex items-center gap-6 text-[11px] font-mono text-slate-500 uppercase tracking-wider pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">ARTICLE NO.</span>
                  <span className="font-bold text-[#111827]">EP-{product.id.slice(0, 6).toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">VOLUME NO.</span>
                  <span className="font-bold text-[#111827]">{product.gsm} GSM LUXURY</span>
                </div>
              </div>

              {/* Descriptive Paragraph */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {product.description || 'Discover the pinnacle of elegance with this masterfully crafted piece. Part of our exclusive Heritage Collection, it embodies the perfect blend of traditional artistry and modern sophistication.'}
              </p>

              {/* Commercial Color Dye Variants (10 Industry Colors with Recommended Applications) */}
              <div className="mt-5 pt-4 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span>Color Dye:</span>
                    <span className="text-slate-900 font-extrabold capitalize text-xs sm:text-sm">{selectedColor.name}</span>
                  </label>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    10 Commercial Colors
                  </span>
                </div>

                {/* 10 Swatch Circles */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {DYE_COLORS.map((c) => {
                    const isSelected = selectedColor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={`${c.name} - ${c.bestFor}`}
                        className={`group relative aspect-square rounded-xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                          isSelected 
                            ? 'ring-2 ring-offset-2 ring-[#0f172a] scale-105 shadow-md z-10' 
                            : 'hover:scale-105 opacity-90 hover:opacity-100 shadow-2xs'
                        }`}
                        style={{ 
                          backgroundColor: c.hex,
                          border: `1.5px solid ${c.borderColor || '#cbd5e1'}`
                        }}
                      >
                        {isSelected ? (
                          <Check 
                            className="w-3.5 h-3.5 stroke-[3]" 
                            style={{ color: c.textColor || '#ffffff' }}
                          />
                        ) : (
                          <span className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: c.textColor || '#ffffff' }}>
                            {c.name.slice(0, 3)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Color Guide: Best For & Recommended Print Spec Card */}
                <div className="mt-2.5 p-3 bg-gradient-to-r from-slate-50 via-emerald-50/20 to-stone-50 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" 
                        style={{ backgroundColor: selectedColor.hex, border: `1px solid ${selectedColor.borderColor || '#cbd5e1'}` }} 
                      />
                      <span className="text-slate-500 font-medium">Best For:</span>
                      <strong className="text-slate-900">{selectedColor.bestFor}</strong>
                    </div>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-start sm:items-center gap-1.5 text-[10px] text-slate-600">
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <span className="text-slate-500 font-medium">Recommended Print: </span>
                      <span className="font-bold text-slate-900">{selectedColor.recommendedPrint}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segmented Switcher Pill: RETAIL ORDER vs WHOLESALE ORDER */}
              <div className="mt-5 p-1 bg-[#f3f4f6] rounded-xl inline-flex w-full sm:w-auto self-start border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setOrderType('retail')}
                  className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    orderType === 'retail'
                      ? 'bg-white text-[#111827] shadow-sm'
                      : 'text-slate-500 hover:text-[#111827]'
                  }`}
                >
                  Retail Order
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('wholesale')}
                  className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    orderType === 'wholesale'
                      ? 'bg-white text-[#166534] shadow-sm'
                      : 'text-slate-500 hover:text-[#111827]'
                  }`}
                >
                  Wholesale Order
                </button>
              </div>

              {/* Unified Price & Packaging Specification Card */}
              <div className="mt-4 rounded-2xl border border-slate-200/90 bg-[#f8faf9] p-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-bold text-2xl sm:text-3xl text-[#d97706] font-mono tracking-tight">
                      ${currentPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-mono text-slate-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      / Box
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {orderType === 'wholesale' ? (
                      <span className="text-xs font-bold text-[#166534] bg-emerald-100/90 border border-emerald-300/80 px-3 py-1 rounded-full font-mono shadow-2xs">
                        MOQ: {wholesaleMoq} Boxes
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                        Retail Order
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-divider & Box Capacity Breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-600">Packaging Spec:</span>
                    <span className="font-bold text-slate-900 bg-white border border-slate-200/90 px-2 py-0.5 rounded-md font-mono text-[11px] shadow-2xs">
                      1 Box = {pcsPerBox.toLocaleString()} Pcs
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-[11px] bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-md shadow-2xs">
                    ≈ ${(currentPrice / pcsPerBox).toFixed(3)} / pc
                  </span>
                </div>
              </div>

              {/* Explicit Quantity Label & Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 whitespace-nowrap">
                      Order Quantity
                    </span>
                    {orderType === 'retail' ? (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        Fixed: {retailFixedQty} Boxes
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Multiples of 5
                      </span>
                    )}
                  </div>
                  <span className={`font-mono text-xs font-bold whitespace-nowrap ${isOutOfStock ? 'text-rose-600' : 'text-[#166534]'}`}>
                    {isOutOfStock ? '🔴 Out of Stock' : `Total: ${quantity.toLocaleString()} ${quantity === 1 ? 'box' : 'boxes'} (${((quantity || 1) * pcsPerBox).toLocaleString()} pcs)`}
                  </span>
                </div>

                {/* Quantity Stepper & ADD TO CART Row */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Stepper with Editable Input */}
                  <div className={`w-full sm:w-44 h-12 rounded-xl border border-slate-300 bg-white flex items-center justify-between px-2 shadow-xs ${isOutOfStock ? 'opacity-50 pointer-events-none bg-slate-50' : ''}`}>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity <= minQuantity}
                      onClick={handleDecrement}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isOutOfStock || quantity <= minQuantity
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                      }`}
                      aria-label="Decrease quantity"
                      title={quantity <= minQuantity ? `Minimum order is ${minQuantity} box${minQuantity > 1 ? 'es' : ''}` : 'Decrease'}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      disabled={isOutOfStock}
                      step={orderType === 'wholesale' ? 5 : 1}
                      min={minQuantity}
                      max={maxQuantity}
                      value={isOutOfStock ? 0 : quantity}
                      onChange={(e) => {
                        if (isOutOfStock) return;
                        const val = parseInt(e.target.value);
                        if (isNaN(val)) {
                          setQuantity(minQuantity);
                        } else {
                          if (val > maxQuantity) {
                            setQuantity(maxQuantity);
                            setMoqWarning(
                              orderType === 'retail' && maxQuantity === 5
                                ? 'Retail orders are limited to a maximum of 5 boxes. For bulk orders, please select Wholesale Order.'
                                : `Stock limit reached: only ${availableStock} boxes available in stock.`
                            );
                            setTimeout(() => setMoqWarning(null), 4000);
                          } else if (val < minQuantity) {
                            setQuantity(minQuantity);
                            setMoqWarning(null);
                          } else {
                            setQuantity(val);
                            setMoqWarning(null);
                          }
                        }
                      }}
                      onBlur={() => {
                        if (isOutOfStock) return;
                        if (quantity < minQuantity) {
                          setQuantity(minQuantity);
                        } else if (quantity > maxQuantity) {
                          setQuantity(maxQuantity);
                        } else if (orderType === 'wholesale' && quantity % 5 !== 0) {
                          const rounded = Math.min(maxQuantity, Math.max(5, Math.ceil(quantity / 5) * 5));
                          setQuantity(rounded);
                          setMoqWarning(`Wholesale orders must be in multiples of 5 (adjusted to ${rounded} boxes).`);
                          setTimeout(() => setMoqWarning(null), 4000);
                        }
                      }}
                      className="w-20 text-center font-mono font-bold text-sm text-[#111827] focus:outline-none bg-transparent"
                      aria-label="Quantity amount"
                    />
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= maxQuantity}
                      onClick={handleIncrement}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isOutOfStock || quantity >= maxQuantity
                          ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                          : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                      }`}
                      aria-label="Increase quantity"
                      title={
                        quantity >= maxQuantity
                          ? (quantity >= availableStock ? `Stock limit reached (${availableStock} boxes available)` : 'Retail order limit is 5 boxes')
                          : (orderType === 'wholesale' ? 'Increase by 5 boxes' : 'Increase')
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ADD TO CART Button (Disabled if Out of Stock, Solid Black if active) */}
                  {isOutOfStock ? (
                    <button
                      type="button"
                      disabled={true}
                      className="w-full sm:flex-1 h-12 bg-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-not-allowed shadow-none"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Out Of Stock (Sold Out)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      className="w-full sm:flex-1 h-12 bg-[#0f172a] hover:bg-[#166534] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Cart ({quantity.toLocaleString()} {quantity === 1 ? 'Box' : 'Boxes'} · {((quantity || 1) * pcsPerBox).toLocaleString()} pcs)</span>
                    </button>
                  )}
                </div>

                {/* Wholesale Quick Select Presets (Disabled if exceeds availableStock) */}
                {orderType === 'wholesale' && !isOutOfStock && (
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick:</span>
                    {[5, 10, 25, 50, 100, 250, 500, 1000].map((preset) => {
                      const isExceedingStock = preset > availableStock;
                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={isExceedingStock}
                          onClick={() => {
                            if (isExceedingStock) return;
                            setQuantity(preset);
                            setMoqWarning(null);
                          }}
                          title={isExceedingStock ? `Stock limit is ${availableStock} boxes (${preset} is unavailable)` : `Select ${preset} boxes`}
                          className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                            isExceedingStock
                              ? 'opacity-35 cursor-not-allowed line-through bg-slate-100 text-slate-400 border-slate-200'
                              : quantity === preset
                              ? 'bg-[#166534] text-white border-[#166534] font-bold shadow-xs cursor-pointer'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900 cursor-pointer'
                          }`}
                        >
                          {preset.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Out of Stock Notice Banner */}
                {isOutOfStock && (
                  <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Yeh item abhi out of stock ho chuka hai</p>
                      <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                        Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.
                      </p>
                    </div>
                  </div>
                )}

                {/* Validation Warning Alert */}
                {moqWarning && (
                  <div className="mt-2.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{moqWarning}</span>
                  </div>
                )}

                {/* Retail Policy Banner */}
                {orderType === 'retail' && !moqWarning && !isOutOfStock && (
                  <div className="mt-2 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/70 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Retail order policy: <strong>1 se 5 boxes maximum</strong>. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar <strong>Wholesale Order</strong> select karein.</span>
                  </div>
                )}

                {/* Wholesale Policy Banner */}
                {orderType === 'wholesale' && !moqWarning && !isOutOfStock && (
                  <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Wholesale order: starting <strong>5 boxes</strong> se hai aur sabhi orders <strong>5 ke multiples</strong> mein place hote hain (5, 10, 15, 20...).</span>
                  </div>
                )}
              </div>

              {/* EXPRESS CHECKOUT / REQUEST QUOTE Button */}
              <div className="mt-3">
                {isOutOfStock ? (
                  <button
                    type="button"
                    disabled={true}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4 text-slate-300" />
                    <span>Purchases Temporarily Closed (Sold Out)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleExpressCheckout}
                    className="w-full h-12 rounded-xl border-2 border-[#0f172a] hover:bg-[#0f172a] hover:text-white text-[#0f172a] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 cursor-pointer"
                  >
                    <span>→ Express Checkout</span>
                  </button>
                )}
              </div>

              {/* Description / Specifications */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] pb-2 border-b-2 border-[#d97706] inline-block">
                    {product.specsHeading || 'Description'}
                  </span>
                </div>

                {/* Specifications Bullet List */}
                <div className="pt-4 text-xs text-slate-600 leading-relaxed">
                  <ul className="space-y-1.5 font-light">
                    <li>• <strong className="font-semibold text-slate-800">BRAND NAME :</strong> {product.brandName || siteSettings?.companyName || 'ECOTEX INC.'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Fabric :</strong> {product.fabricDetails || `${product.gsm || 45} GSM Virgin Non-Woven Polypropylene`}</li>
                    <li>• <strong className="font-semibold text-slate-800">Dimensions :</strong> {product.dimensions || '12"W x 15"H with Reinforced Gusset'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Handles :</strong> {product.handles || 'Ultrasonic Thermal Welded Loops'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Printing :</strong> {product.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Compliance :</strong> {product.compliance || 'Certified California SB 270 & ASTM D6400'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Bag & Picture Packing :</strong> {product.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons'}</li>
                    <li>• <strong className="font-semibold text-slate-800">Guaranteed Fabric :</strong> {product.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene'}</li>
                    <li>• <strong className="font-semibold text-slate-800">{product.enrouteQuality || 'Enroute to Quality Standard'}</strong></li>
                  </ul>
                </div>

              </div>

              {/* 3 Trust Badges Row (Below Description) */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {product.trustBadge1 || siteSettings?.shopConfig?.trustBar1Title || 'Fast Delivery'}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {product.trustBadge2 || siteSettings?.shopConfig?.trustBar3Title || 'Secure Store'}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {product.trustBadge3 || siteSettings?.shopConfig?.trustBar2Title || 'Easy Return'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Added to Cart Feedback Banner */}
        {addedToast && (
          <div className="absolute bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
            <Check className="w-4 h-4 text-[#22c55e]" />
            <span>Added {product.name} to Cart</span>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductDetailModal;
