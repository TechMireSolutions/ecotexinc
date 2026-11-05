'use client';

import React, { useState, useEffect, useMemo } from 'react';

import { Product, ProductColorVariant } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  ArrowRight, 
  Minus, 
  Plus,
  Share2,
  AlertCircle,
  Package,
  Lock,
  Sparkles
} from 'lucide-react';
import { DYE_COLORS, DyeColor } from '../data/colors';
import { useStore } from '../store/useStore';
import { PRODUCTS } from '../data/products';

const DEFAULT_PALETTE: ProductColorVariant[] = [
  { id: 'white', name: 'White', hex: '#FFFFFF', stockQuantity: 25 },
  { id: 'black', name: 'Black', hex: '#18181b', stockQuantity: 50 },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#2563eb', stockQuantity: 30 },
  { id: 'red', name: 'Red', hex: '#dc2626', stockQuantity: 20 },
  { id: 'dark-green', name: 'Dark Green', hex: '#166534', stockQuantity: 50 },
  { id: 'navy-blue', name: 'Navy Blue', hex: '#1e3a8a', stockQuantity: 40 },
  { id: 'yellow', name: 'Yellow', hex: '#eab308', stockQuantity: 15 },
  { id: 'orange', name: 'Orange', hex: '#ea580c', stockQuantity: 20 },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#38bdf8', stockQuantity: 25 },
  { id: 'beige-cream', name: 'Beige / Cream', hex: '#f5ecd7', stockQuantity: 35 }
];

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigateHome: () => void;
  onAddToCart: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale', unitPrice?: number) => void;
  onOpenQuote: (product: Product) => void;
  onExpressCheckout?: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale', unitPrice?: number) => void;
  onSelectProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onNavigateHome,
  onAddToCart,
  onOpenQuote,
  onExpressCheckout,
  onSelectProduct,
  onEditProduct
}) => {
  const { products: storeProducts } = useStore();
  const allProducts = (storeProducts && storeProducts.length > 0) ? storeProducts : PRODUCTS;

  // 5 Related products for bottom section
  const relatedProducts = React.useMemo(() => {
    const others = allProducts.filter(p => p.id !== product.id);
    const sameCategory = others.filter(p => 
      p.category && product.category && p.category.toLowerCase() === product.category.toLowerCase()
    );
    const differentCategory = others.filter(p => 
      !p.category || !product.category || p.category.toLowerCase() !== product.category.toLowerCase()
    );
    return [...sameCategory, ...differentCategory].slice(0, 5);
  }, [allProducts, product.id, product.category]);
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [orderType, setOrderType] = useState<'retail' | 'wholesale'>('retail');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Dynamic Wholesale MOQ & Retail Limits from Product Settings
  const wholesaleMoq = product.wholesaleMinBoxes || product.wholesaleMoq || 5;
  const wholesaleMaxBoxes = product.wholesaleMaxBoxes;
  const retailFixedQty = product.retailQuantity || 15;
  const pcsPerBox = product.pcsPerBox || 200;

  // Fully dynamic product colors list from product configuration
  const productColors: ProductColorVariant[] = useMemo(() => {
    if (product.availableColors && product.availableColors.length > 0) {
      return product.availableColors.map((c, i) => {
        const id = c.id || ('col-' + i);
        const stock = c.stockQuantity !== undefined 
          ? c.stockQuantity 
          : (id && product.colorStock ? product.colorStock[id] : undefined) ?? (product.colorStock ? product.colorStock[c.name.toLowerCase()] : undefined) ?? 25;
        return {
          id,
          name: c.name,
          hex: c.hex || '#166534',
          stockQuantity: stock,
          bestFor: c.bestFor || product.bestFor,
          recommendedPrint: c.recommendedPrint || product.recommendedPrint
        };
      });
    }
    return DEFAULT_PALETTE.map(c => ({
      ...c,
      stockQuantity: (c.id && product.colorStock ? (product.colorStock as any)[c.id] : undefined) ?? c.stockQuantity
    }));
  }, [product.availableColors, product.colorStock, product.bestFor, product.recommendedPrint]);

  const [selectedColor, setSelectedColor] = useState<ProductColorVariant>(() => {
    const list = (product.availableColors && product.availableColors.length > 0)
      ? product.availableColors
      : DEFAULT_PALETTE;
    const initialName = ((product as any).color || product.availableColors?.[0]?.name)?.toLowerCase();
    const found = list.find(c => c.name.toLowerCase() === initialName);
    return found || list[3] || list[0] || DEFAULT_PALETTE[3]; // Default: Red or first
  });

  // Sync selectedColor if productColors list updates
  useEffect(() => {
    if (productColors.length > 0 && !productColors.some(c => (c.id && c.id === selectedColor.id) || c.name.toLowerCase() === selectedColor.name.toLowerCase())) {
      setSelectedColor(productColors[0]);
    }
  }, [productColors]);

  // Helper to determine exact stock in boxes for any color variant
  const getColorStock = (colorIdOrName: string): number => {
    if (product.inStock === false) return 0;
    const target = productColors.find(c => (c.id && c.id === colorIdOrName) || c.name.toLowerCase() === colorIdOrName.toLowerCase());
    if (target && target.stockQuantity !== undefined) {
      return Math.max(0, Number(target.stockQuantity) || 0);
    }
    if (product.colorStock && product.colorStock[colorIdOrName] !== undefined) {
      return Math.max(0, Number(product.colorStock[colorIdOrName]) || 0);
    }
    const found = Object.entries(product.colorStock || {}).find(([k]) => k.toLowerCase() === colorIdOrName.toLowerCase());
    if (found) return Math.max(0, Number(found[1]) || 0);
    return typeof product.stockQuantity === 'number' ? product.stockQuantity : 50;
  };

  const activeColorStock = getColorStock(selectedColor.id || selectedColor.name);
  const isColorOutOfStock = activeColorStock <= 0;
  const availableStock = activeColorStock;
  const isOutOfStock = product.inStock === false || isColorOutOfStock;

  const minQuantity = orderType === 'retail' ? retailFixedQty : wholesaleMoq;
  const maxQuantity = orderType === 'retail' ? Math.min(retailFixedQty, availableStock) : (wholesaleMaxBoxes ? Math.min(wholesaleMaxBoxes, availableStock) : availableStock);
  const [moqWarning, setMoqWarning] = useState<string | null>(null);

  const handleSelectColor = (c: ProductColorVariant) => {
    setSelectedColor(c);
    const newStock = getColorStock(c.id || c.name);
    const newMax = orderType === 'retail' ? Math.min(retailFixedQty, newStock) : newStock;
    if (newStock <= 0) {
      setQuantity(0);
      setMoqWarning(`${c.name} is currently out of stock.`);
      setTimeout(() => setMoqWarning(null), 4000);
    } else {
      if (quantity > newMax) {
        setQuantity(Math.max(1, newMax));
        setMoqWarning(`Quantity adjusted to ${newMax} boxes (maximum stock available for ${c.name}).`);
        setTimeout(() => setMoqWarning(null), 4000);
      } else if (quantity < minQuantity && newStock >= minQuantity) {
        setQuantity(minQuantity);
      } else if (quantity === 0 && newStock > 0) {
        setQuantity(orderType === 'retail' ? Math.min(retailFixedQty, newStock) : Math.min(wholesaleMoq, newStock));
      }
    }
  };

  // Scroll to top on mount or when product/orderType changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setMoqWarning(null);
    const curStock = getColorStock(selectedColor.id || selectedColor.name);
    if (curStock <= 0) {
      setQuantity(0);
    } else {
      setQuantity(orderType === 'retail' ? Math.min(retailFixedQty, curStock) : Math.min(wholesaleMoq, curStock));
    }
  }, [product, orderType, wholesaleMoq]);




  // Fixed product bag image (does not change on color swatch selection)
  const bagCutout = product.image || '/images/bag-green.png';

  // 4 Gallery images tailored for this product (dynamic from product with studio fallbacks)
  const defaultGalleryImages = [
    { 
      url: bagCutout, 
      label: 'Front Product Shot',
      badge: 'Studio Cutout'
    },
    { 
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85', 
      label: 'Lifestyle Editorial',
      badge: 'Editorial'
    },
    { 
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85', 
      label: 'Fabric Macro & Seam',
      badge: 'Macro Seam'
    },
    { 
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85', 
      label: 'Production Detail',
      badge: 'Workshop'
    }
  ];

  const galleryImages = [
    { 
      url: product.galleryImages?.[0] || bagCutout, 
      label: 'Front Product Shot',
      badge: 'Studio Cutout'
    },
    { 
      url: product.galleryImages?.[1] || defaultGalleryImages[1].url, 
      label: 'Lifestyle Editorial',
      badge: 'Editorial'
    },
    { 
      url: product.galleryImages?.[2] || defaultGalleryImages[2].url, 
      label: 'Fabric Macro & Seam',
      badge: 'Macro Seam'
    },
    { 
      url: product.galleryImages?.[3] || defaultGalleryImages[3].url, 
      label: 'Production Detail',
      badge: 'Workshop'
    }
  ];

  // Pricing calculations: Dedicated Retail & Wholesale options
  const retailUnitPrice = product.retailPricePerUnit !== undefined && product.retailPricePerUnit > 0
    ? product.retailPricePerUnit
    : (product.pricePerUnit ? Number((product.pricePerUnit * 1.45).toFixed(2)) : 86.99);

  const wholesaleUnitPrice = product.pricePerUnit || 59.99;
  const currentPrice = orderType === 'retail' ? retailUnitPrice : wholesaleUnitPrice;

  const originalPrice = orderType === 'retail'
    ? (product.retailOriginalPrice !== undefined && product.retailOriginalPrice > 0 
        ? product.retailOriginalPrice 
        : Number((retailUnitPrice * 1.25).toFixed(2)))
    : (product.originalPrice !== undefined && product.originalPrice > 0 
        ? product.originalPrice 
        : Number((wholesaleUnitPrice * 1.25).toFixed(2)));

  const handleIncrement = () => {
    if (orderType === 'retail') {
      if (quantity >= maxQuantity) {
        setMoqWarning(maxQuantity < 5 
          ? `Stock limit reached: only ${availableStock} boxes available in stock.`
          : `Retail orders are limited to a maximum of ${maxQuantity} boxes. For larger orders, please switch to Wholesale Order.`);
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
      if (wholesaleMaxBoxes && quantity > wholesaleMaxBoxes) {
        setMoqWarning(`Wholesale maximum order quantity is ${wholesaleMaxBoxes} boxes.`);
        setQuantity(wholesaleMaxBoxes);
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
    if (orderType === 'retail') {
      if (quantity !== retailFixedQty) {
        setMoqWarning(`Retail order quantity is fixed at ${retailFixedQty} boxes (neither less nor more).`);
        setQuantity(retailFixedQty);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    setMoqWarning(null);
    onAddToCart(product, selectedColor.name, quantity, orderType, currentPrice);
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
    if (orderType === 'retail') {
      if (quantity !== retailFixedQty) {
        setMoqWarning(`Retail order quantity is fixed at ${retailFixedQty} boxes (neither less nor more).`);
        setQuantity(retailFixedQty);
        setTimeout(() => setMoqWarning(null), 4000);
        return;
      }
    }
    setMoqWarning(null);
    if (onExpressCheckout) {
      onExpressCheckout(product, selectedColor.name, quantity, orderType, currentPrice);
    } else {
      onAddToCart(product, selectedColor.name, quantity, orderType);
    }
  };

  return (
    <div className="w-full bg-[#fbfcfb] text-[#111827] min-h-screen py-4 sm:py-10 selection:bg-[#166534] selection:text-white animate-fadeInUp">
      
      {/* Maximum Container matching Reference Image */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 lg:px-12">
        
        {/* Top Breadcrumb Header Bar */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-10 flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-[#166534] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span className="text-slate-300">&gt;</span>
            <button 
              onClick={onBack} 
              className="hover:text-[#166534] transition-colors cursor-pointer"
            >
              COLLECTIONS
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-[#111827] font-bold truncate">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2.5 ml-4 shrink-0">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:text-[#14532d] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </button>
          </div>
        </nav>

        {/* Main 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* ========================================================
              LEFT COLUMN: MAIN SHOWCASE IMAGE & 4-THUMBNAIL GALLERY
             ======================================================== */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Main Image Frame (Rounded-3xl, Drop Shadow, Heart Button, Brand Watermark) */}
            <div className="relative w-full aspect-[4/5] bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl flex items-center justify-center p-4 sm:p-10 group">
              
              {/* Product Visual */}
              <img
                src={galleryImages[activeImageIndex].url}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500 group-hover:scale-105 select-none"
              />

              {/* Floating Circular Wishlist Button (Top Right) */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Save to Wishlist"
                className="absolute top-5 right-5 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:text-red-500 transition-all active:scale-90 cursor-pointer z-10"
              >
                <Heart className={`w-5 h-5 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                }`} />
              </button>

              {/* Brand Signature Logo Watermark (Bottom Left - Replicating Reference Image) */}
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

            {/* 4 Thumbnails Gallery Strip */}
            <div className="mt-3 sm:mt-5 grid grid-cols-4 gap-2 sm:gap-4">
              {galleryImages.map((thumb, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white p-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-[#d97706] shadow-md ring-2 ring-amber-500/20 scale-102'
                        : 'border border-slate-200/90 hover:border-slate-300 opacity-80 hover:opacity-100'
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

          {/* ========================================================
              RIGHT COLUMN: EDITORIAL DETAILS, CONTROLS, SPECS
             ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category Label, Stock Status & Rating */}
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#d97706]">
                {product.categoryLabel || 'SUSTAINABLE NON-WOVEN'}
              </span>
              {isOutOfStock && (
                <>
                  <span className="text-slate-300 font-light">—</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <span>Out of Stock · Sold Out</span>
                  </div>
                </>
              )}

              <span className="text-slate-300 font-light">—</span>
              <div className="flex items-center gap-1 text-xs font-bold text-[#d97706]">
                <Star className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                <span>{product.rating !== undefined ? product.rating.toFixed(1) : '4.9'}</span>
              </div>
            </div>

            {/* Product Title (Luxury Editorial Serif Font) */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-normal text-[#111827] tracking-tight leading-[1.12] [text-wrap:balance]">
              {product.name}
            </h1>

            {/* Article No. & Volume No. Metadata */}
            <div className="mt-4 flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider pb-4 border-b border-slate-200/70">
              <div>
                <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">
                  ARTICLE NO.
                </span>
                <span className="font-bold text-[#111827]">
                  {product.articleNo || `EP-${product.id.slice(0, 6).toUpperCase()}`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] font-sans font-semibold tracking-widest">
                  VOLUME NO.
                </span>
                <span className="font-bold text-[#111827]">
                  {product.volumeNo || `${product.gsm || 45} GSM LUXURY`}
                </span>
              </div>
            </div>

            {/* Product Editorial Description */}
            <p className="mt-5 text-sm sm:text-[15px] text-[#4b5563] leading-relaxed font-light">
              {product.description || 'Discover the pinnacle of elegance with this masterfully crafted piece. Part of our exclusive Heritage Collection, it embodies the perfect blend of traditional artistry and modern sophistication.'}
            </p>

            {/* Commercial Color Dye Variants (10 Industry Colors with Recommended Applications) */}
            <div className="mt-6 pt-5 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span>Color Dye:</span>
                  <span className="text-slate-900 font-extrabold capitalize text-sm">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2">
                  {activeColorStock > 0 ? (
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                      {activeColorStock} boxes in stock
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-rose-800 bg-rose-100/90 border border-rose-300 px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                      🔴 Out of Stock
                    </span>
                  )}
                  <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {productColors.length} Commercial Options
                  </span>
                </div>
              </div>

              {/* Dynamic Swatch Circles from Configured Colors */}
              <div className="flex flex-wrap gap-2.5">
                {productColors.map((c, index) => {
                  const isSelected = (c.id && c.id === selectedColor.id) || c.name.toLowerCase() === selectedColor.name.toLowerCase();
                  const cStock = getColorStock(c.id || c.name);
                  const isSoldOut = cStock <= 0;
                  const isLight = ['#ffffff', '#fff', '#ffffff', '#f5ecd7', '#ffff00', '#fafafa'].includes((c.hex || '').toLowerCase());
                  return (
                    <button
                      key={c.id || index}
                      type="button"
                      onClick={() => handleSelectColor(c)}
                      title={`${c.name} - ${isSoldOut ? 'Out of Stock (0 boxes)' : `${cStock} boxes available in stock`}`}
                      className={`group relative w-10 h-10 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-[#0f172a] scale-110 shadow-md z-10' 
                          : isSoldOut
                          ? 'opacity-40 hover:opacity-75 shadow-2xs'
                          : 'hover:scale-105 opacity-90 hover:opacity-100 shadow-2xs'
                      }`}
                      style={{ 
                        backgroundColor: c.hex,
                        border: '1.5px solid #cbd5e1'
                      }}
                    >
                      {/* Diagonal Out-of-Stock Line */}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
                          <div className="w-[140%] h-[2px] bg-rose-600/90 -rotate-45 shadow-xs"></div>
                        </div>
                      )}

                      {isSelected ? (
                        <Check 
                          className="w-4 h-4 stroke-[3]" 
                          style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                        />
                      ) : (
                        <span className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          {isSoldOut ? '0' : c.name.slice(0, 3)}
                        </span>
                      )}

                      {/* Small stock badge */}
                      <span 
                        className={`absolute -bottom-1 -right-1 text-[8px] font-mono font-bold px-1 py-0.1 rounded-full shadow-2xs border ${
                          isSoldOut 
                            ? 'bg-rose-100 text-rose-700 border-rose-300' 
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {isSoldOut ? '0' : cStock}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Color Guide: Best For & Recommended Print Spec Card */}
              <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-50 via-emerald-50/20 to-stone-50 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                      style={{ backgroundColor: selectedColor.hex, border: `1px solid ${selectedColor.borderColor || '#cbd5e1'}` }} 
                    />
                    <span className="text-slate-500 font-medium">Best For:</span>
                    <strong className="text-slate-900">{product.bestFor || selectedColor.bestFor}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start sm:items-center gap-2 text-[11px] text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="text-slate-500 font-medium">Recommended Print: </span>
                    <span className="font-bold text-slate-900">{product.recommendedPrint || selectedColor.recommendedPrint}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Segmented Switcher Pill: RETAIL ORDER vs WHOLESALE ORDER */}
            <div className="mt-6 p-1 bg-[#f3f4f6] rounded-xl inline-flex w-full sm:w-auto self-start border border-slate-200/60">
              <button
                type="button"
                onClick={() => setOrderType('retail')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'retail'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                {product.retailTabLabel || 'Retail Order'}
              </button>
              <button
                type="button"
                onClick={() => setOrderType('wholesale')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  orderType === 'wholesale'
                    ? 'bg-white text-[#166534] shadow-sm'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                {product.wholesaleTabLabel || 'Wholesale Order'}
              </button>
            </div>

            {/* Unified Price & Packaging Specification Card */}
            <div className="mt-4 rounded-2xl border border-slate-200/90 bg-[#f8faf9] p-4 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-bold text-3xl sm:text-4xl text-[#d97706] font-mono tracking-tight">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-base font-mono text-slate-400 line-through">
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
                      Min: {wholesaleMoq}{wholesaleMaxBoxes ? ' · Max: ' + wholesaleMaxBoxes : ''} (Multiples of 5)
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
                    disabled={isOutOfStock || orderType === 'retail' || quantity <= minQuantity}
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
                    readOnly={orderType === 'retail'}
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
                            orderType === 'retail'
                              ? `Retail orders are fixed at exactly ${retailFixedQty} boxes.`
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
                    disabled={isOutOfStock || orderType === 'retail' || quantity >= maxQuantity}
                    onClick={handleIncrement}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isOutOfStock || quantity >= maxQuantity
                        ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                        : 'text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer'
                    }`}
                    aria-label="Increase quantity"
                    title={
                      quantity >= maxQuantity
                        ? (quantity >= availableStock ? `Stock limit reached (${availableStock} boxes available)` : `Retail order limit is ${maxQuantity} boxes`)
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
                    className="w-full sm:flex-1 h-12 bg-[#0f172a] hover:bg-[#166534] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart ({quantity.toLocaleString()} {quantity === 1 ? 'Box' : 'Boxes'} · {((quantity || 1) * pcsPerBox).toLocaleString()} pcs)</span>
                  </button>
                )}
              </div>



              {/* Out of Stock Notice Banner */}
              {isOutOfStock && (
                <div className="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Yeh item abhi out of stock ho chuka hai</p>
                    <p className="mt-0.5 text-rose-700/90 leading-relaxed">
                      {product.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.'}
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
                  <span>{product.retailPolicyText ? product.retailPolicyText : <>Retail order policy: <strong>1 se 5 boxes maximum</strong>. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar <strong>Wholesale Order</strong> select karein.</>}</span>
                </div>
              )}

              {/* Wholesale Policy Banner */}
              {orderType === 'wholesale' && !moqWarning && !isOutOfStock && (
                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{product.wholesalePolicyText ? product.wholesalePolicyText : <>Wholesale order: starting <strong>5 boxes</strong> se hai aur sabhi orders <strong>5 ke multiples</strong> mein place hote hain (5, 10, 15, 20...).</>}</span>
                </div>
              )}
            </div>

            {/* EXPRESS CHECKOUT Button */}
            <div className="mt-3">
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled={true}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4 text-slate-300" />
                  <span>{product.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExpressCheckout}
                  className="w-full h-12 rounded-xl border-2 border-[#0f172a] hover:bg-[#0f172a] hover:text-white text-[#0f172a] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  <span>{product.checkoutButtonText || '→ Express Checkout'}</span>
                </button>
              )}
            </div>

            {/* Description / Specifications */}
            <div className="mt-8 pt-6 border-t border-slate-200/70">
              <div className="border-b border-slate-200/70 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] pb-2 border-b-2 border-[#d97706] inline-block">
                  {product.specsHeading || 'Description'}
                </span>
              </div>

              {/* Specifications Bullet List */}
              <div className="pt-5 text-xs text-slate-600 leading-relaxed">
                <ul className="space-y-2 font-light">
                  <li>• <strong className="font-semibold text-slate-800">BRAND NAME :</strong> {product.brandName || 'ECOTEX INC.'}</li>
                  <li>• <strong className="font-semibold text-slate-800">Fabric :</strong> {product.fabricDetails || `${product.gsm || 45} GSM Virgin Non-Woven Polypropylene`}</li>
                  <li>• <strong className="font-semibold text-slate-800">Dimensions :</strong> {product.dimensions || '11.5"W x 21"H x 6.5" Gusset'}</li>
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
            <div className="mt-8 pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {product.trustBadge1 || 'Fast Delivery'}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {product.trustBadge2 || 'Secure Store'}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-[#d97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {product.trustBadge3 || 'Easy Return'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          RELATED PRODUCTS (Full Width across screen)
         ======================================================== */}
      {relatedProducts.length > 0 && (
        <section className="w-full max-w-[1840px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 mt-12 sm:mt-24 pt-12 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] mb-1 block">
                {product.relatedTag || 'Explore More Options'}
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
                {product.relatedTitle || 'Related Products'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {product.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d3419] hover:text-[#FF5722] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>{product.relatedBackBtnText || 'View Full Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Column Grid across full width */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
            {relatedProducts.map((relProd) => {
              const relIsOutOfStock = relProd.inStock === false || (typeof relProd.stockQuantity === 'number' && relProd.stockQuantity <= 0);

              return (
                <div
                  key={relProd.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(relProd);
                    }
                  }}
                  className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      relIsOutOfStock ? 'bg-rose-600 text-white' : 'bg-[#0d3419] text-white'
                    }`}>
                      {relIsOutOfStock ? 'SOLD OUT' : (relProd.badge || 'ECO FABRIC')}
                    </span>
                    {relProd.gsm && (
                      <span className="text-[10px] font-bold text-slate-500">
                        {relProd.gsm} GSM
                      </span>
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-full aspect-square bg-[#FAF8F5] rounded-xl flex items-center justify-center p-4 mb-3.5 overflow-hidden border border-slate-100">
                    <img
                      src={relProd.image || '/images/bag-green.png'}
                      alt={relProd.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/bag-green.png';
                      }}
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 select-none"
                      draggable={false}
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0d3419] transition-colors truncate mb-1">
                    {relProd.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-3.5">
                    {relProd.subtitle || relProd.dimensions || 'Industrial packaging'}
                  </p>

                  {/* Price & Action */}
                  <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="font-extrabold text-base text-slate-900">
                        ${relProd.pricePerUnit.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium ml-1">
                        / box
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#FF5722] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Added to Cart Feedback Banner */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#22c55e]" />
          <span>Added {product.name} to Cart</span>
        </div>
      )}

      

    </div>
  );
};

export default ProductDetailPage;
