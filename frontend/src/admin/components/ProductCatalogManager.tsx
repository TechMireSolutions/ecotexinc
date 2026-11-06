'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Eye, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Star,
  Truck,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product, ProductCategory, ProductColorVariant } from '../../types';

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
import { ImageUploader } from './ImageUploader';
import { CustomSelect } from './ui/CustomSelect';
import { DYE_COLORS } from '../../data/colors';

export const ProductCatalogManager: React.FC = () => {
  const { 
    products, 
    categories,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductStock,
    addMediaAsset
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Modal Navigation Tab
  const [modalTab, setModalTab] = useState<'basic' | 'gallery' | 'specs' | 'policies'>('basic');
  const [galleryPreviewIdx, setGalleryPreviewIdx] = useState(0);

  // Lock body scroll and handle Escape key for modals
  useEffect(() => {
    if (!isModalOpen && !isDeleteModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        } else if (isModalOpen) {
          setIsModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, isDeleteModalOpen]);

  const dynamicCategories = React.useMemo(() => {
    const list = categories.filter(c => c.id !== 'all');
    if (list.length > 0) {
      return list.map(c => ({ id: c.id as ProductCategory, label: c.label }));
    }
    return [
      { id: 'non-woven' as ProductCategory, label: 'Non-Woven Totes' },
      { id: 't-shirt' as ProductCategory, label: 'T-Shirt Bags' },
      { id: 'laminated' as ProductCategory, label: 'Laminated Carriers' },
      { id: 'slider' as ProductCategory, label: 'Slider Bags' },
      { id: 'd-cut' as ProductCategory, label: 'D-Cut Handles' },
      { id: 'food' as ProductCategory, label: 'Food Item Bags' },
      { id: 'biodegradable' as ProductCategory, label: 'Biodegradable PLA' }
    ];
  }, [categories]);

  const categoriesList = dynamicCategories;

  const badgesList = [
    'Best Seller',
    'Eco Choice',
    'Factory Direct',
    '100% Recyclable',
    'Heavy Duty',
    'High Tensile'
  ];

  const PRODUCT_IMAGE_PRESETS = [
    { label: 'Leaf Green', url: '/images/bag-green.png' },
    { label: 'Cobalt Blue', url: '/images/bag-blue.png' },
    { label: 'Linen White', url: '/images/bag-white.png' },
    { label: 'Luxury Black', url: '/images/bag-black.png' },
    { label: 'Bio Amber', url: '/images/bag-orange.png' },
    { label: 'PLA Bio Jar', url: '/images/bite-hero-product.png' }
  ];

  // Floating toast feedback
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if (saveToast.show) {
      const timer = setTimeout(() => {
        setSaveToast(prev => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [saveToast.show]);

  // Comprehensive Form State (All Single Product Page Elements)
  const [formData, setFormData] = useState({
    name: '',
    category: (categoriesList[0]?.id || 'non-woven') as ProductCategory,
    categoryLabel: categoriesList[0]?.label || 'Non-Woven Totes',
    subtitle: '',
    pricePerUnit: 59.99,
    originalPrice: 74.99,
    retailPricePerUnit: 86.99,
    retailOriginalPrice: 108.73,
    retailQuantity: 15,
    retailMinBoxes: 15,
    retailMaxBoxes: 15,
    moq: 1000,
    wholesaleMoq: 5,
    wholesaleMinBoxes: 5,
    wholesaleMaxBoxes: undefined as number | undefined,
    pcsPerBox: 200,
    stockQuantity: 50,
    availableColors: DEFAULT_PALETTE.map(c => ({ ...c })) as ProductColorVariant[],
    colorStock: {
      'white': 25,
      'black': 50,
      'royal-blue': 30,
      'red': 20,
      'dark-green': 50,
      'navy-blue': 40,
      'yellow': 15,
      'orange': 20,
      'sky-blue': 25,
      'beige-cream': 35
    } as Record<string, number>,
    gsm: 80,
    dimensions: '11.5"W x 21"H x 6.5" Gusset',
    material: 'Virgin Non-Woven Polypropylene',
    capacity: 'Up to 25 lbs',
    badge: 'Eco Choice',
    image: '/images/bag-green.png',
    inStock: true,
    description: 'High tensile enterprise carrier bag manufactured for supermarkets, boutique retail, and trade exhibitions.',

    // Extended Single Product Detail Elements
    rating: 4.9,
    articleNo: 'EP-NW-3040',
    volumeNo: '80 GSM LUXURY',
    gallery0: '/images/bag-green.png',
    gallery1: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
    gallery2: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
    gallery3: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
    brandName: 'ECOTEX INC.',
    fabricDetails: '80 GSM Virgin Non-Woven Polypropylene',
    handles: 'Ultrasonic Thermal Welded Loops',
    printingMethod: 'High-Precision Flexographic / Gravure Custom Imprint',
    compliance: 'Certified California SB 270 & ASTM D6400',
    packingDetails: 'Export-Grade Heavy Duty Corrugated Cartons',
    guaranteedFabric: '100% Virgin Grade Recyclable Polypropylene',
    enrouteQuality: 'Enroute to Quality Standard',
    bestFor: 'Supermarket grocers, retail boutiques',
    recommendedPrint: 'High-Precision Flexographic Custom Imprint',
    trustBadge1: 'Fast Delivery',
    trustBadge2: 'Secure Store',
    trustBadge3: 'Easy Return',
    retailPolicyText: 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
    wholesalePolicyText: 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
    outOfStockNotice: 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
    checkoutButtonText: '→ Express Checkout',
    outOfStockButtonText: 'Purchases Temporarily Closed (Sold Out)',
    retailTabLabel: 'Retail Order',
    wholesaleTabLabel: 'Wholesale Order',
    specsHeading: 'Description',
    relatedTag: 'Explore More Options',
    relatedTitle: 'Related Products',
    relatedSubtitle: 'Frequently ordered together or alternative sizing options for your business.',
    relatedBackBtnText: 'View Full Catalog'
  });

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.articleNo && p.articleNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || 
      p.category === selectedCategory || 
      (p.categoryLabel && p.categoryLabel.toLowerCase() === selectedCategory.toLowerCase());
    const isProdInStock = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
    const matchesStock = 
      stockFilter === 'all' || 
      (stockFilter === 'in-stock' && isProdInStock) || 
      (stockFilter === 'out-of-stock' && !isProdInStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalTab('basic');
    setGalleryPreviewIdx(0);
    const defaultCat = categoriesList[0] || { id: 'non-woven', label: 'Non-Woven Totes' };
    setFormData({
      name: '',
      category: defaultCat.id as ProductCategory,
      categoryLabel: defaultCat.label,
      subtitle: 'Commercial Wholesale Series',
      pricePerUnit: 59.99,
      originalPrice: 74.99,
      retailPricePerUnit: 86.99,
      retailOriginalPrice: 108.73,
      retailQuantity: 15,
      retailMinBoxes: 15,
      retailMaxBoxes: 15,
      moq: 1000,
      wholesaleMoq: 5,
      wholesaleMinBoxes: 5,
      wholesaleMaxBoxes: undefined,
      pcsPerBox: 200,
      stockQuantity: 50,
      availableColors: DEFAULT_PALETTE.map(c => ({ ...c })),
      colorStock: {
        'white': 25,
        'black': 50,
        'royal-blue': 30,
        'red': 20,
        'dark-green': 50,
        'navy-blue': 40,
        'yellow': 15,
        'orange': 20,
        'sky-blue': 25,
        'beige-cream': 35
      },
      gsm: 80,
      dimensions: '11.5"W x 21"H x 6.5" Gusset',
      material: 'Virgin Non-Woven Polypropylene',
      capacity: 'Up to 25 lbs',
      badge: 'Eco Choice',
      image: '/images/bag-green.png',
      inStock: true,
      description: 'High tensile enterprise carrier bag manufactured for supermarkets, boutique retail, and trade exhibitions.',

      rating: 4.9,
      articleNo: `EP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      volumeNo: '80 GSM LUXURY',
      gallery0: '/images/bag-green.png',
      gallery1: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      gallery2: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
      gallery3: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      brandName: 'ECOTEX INC.',
      fabricDetails: '80 GSM Virgin Non-Woven Polypropylene',
      handles: 'Ultrasonic Thermal Welded Loops',
      printingMethod: 'High-Precision Flexographic / Gravure Custom Imprint',
      compliance: 'Certified California SB 270 & ASTM D6400',
      packingDetails: 'Export-Grade Heavy Duty Corrugated Cartons',
      guaranteedFabric: '100% Virgin Grade Recyclable Polypropylene',
      enrouteQuality: 'Enroute to Quality Standard',
      bestFor: 'Supermarket grocers, retail boutiques',
      recommendedPrint: 'High-Precision Flexographic Custom Imprint',
      trustBadge1: 'Fast Delivery',
      trustBadge2: 'Secure Store',
      trustBadge3: 'Easy Return',
      retailPolicyText: 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
      checkoutButtonText: '→ Express Checkout',
      outOfStockButtonText: 'Purchases Temporarily Closed (Sold Out)',
      retailTabLabel: 'Retail Order',
      wholesaleTabLabel: 'Wholesale Order',
      specsHeading: 'Description',
      relatedTag: 'Explore More Options',
      relatedTitle: 'Related Products',
      relatedSubtitle: 'Frequently ordered together or alternative sizing options for your business.',
      relatedBackBtnText: 'View Full Catalog'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setModalTab('basic');
    setGalleryPreviewIdx(0);
    const currentStockQty = p.stockQuantity !== undefined ? p.stockQuantity : (p.inStock ? 50 : 0);
    const mainImg = p.image || '/images/bag-green.png';
    const gImgs = p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [
      mainImg,
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85'
    ];

    setFormData({
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel || 'Wholesale Packaging',
      subtitle: p.subtitle || '',
      pricePerUnit: p.pricePerUnit || 59.99,
      originalPrice: p.originalPrice || Math.round((p.pricePerUnit || 59.99) * 1.25 * 100) / 100,
      retailPricePerUnit: p.retailPricePerUnit !== undefined && p.retailPricePerUnit > 0 ? p.retailPricePerUnit : Math.round((p.pricePerUnit || 59.99) * 1.45 * 100) / 100,
      retailOriginalPrice: p.retailOriginalPrice !== undefined && p.retailOriginalPrice > 0 ? p.retailOriginalPrice : Math.round((p.retailPricePerUnit || (p.pricePerUnit || 59.99) * 1.45) * 1.25 * 100) / 100,
      retailQuantity: p.retailQuantity || 15,
      retailMinBoxes: p.retailQuantity || 15,
      retailMaxBoxes: p.retailQuantity || 15,
      moq: p.moq,
      wholesaleMoq: p.wholesaleMinBoxes || p.wholesaleMoq || 5,
      wholesaleMinBoxes: p.wholesaleMinBoxes || p.wholesaleMoq || 5,
      wholesaleMaxBoxes: p.wholesaleMaxBoxes,
      pcsPerBox: p.pcsPerBox || 200,
      stockQuantity: currentStockQty,
      availableColors: (p.availableColors && p.availableColors.length > 0)
        ? p.availableColors.map((c, i) => ({
            id: c.id || ('col-' + i),
            name: c.name,
            hex: c.hex || '#166534',
            stockQuantity: c.stockQuantity !== undefined 
              ? c.stockQuantity 
              : (c.id && p.colorStock ? p.colorStock[c.id] : undefined) ?? (p.colorStock ? p.colorStock[c.name.toLowerCase()] : undefined) ?? 25
          }))
        : DEFAULT_PALETTE.map(c => ({
            ...c,
            stockQuantity: (c.id && p.colorStock ? (p.colorStock as any)[c.id] : undefined) ?? c.stockQuantity
          })),
      colorStock: p.colorStock && Object.keys(p.colorStock).length > 0 ? { ...p.colorStock } : {
        'white': 25,
        'black': 50,
        'royal-blue': 30,
        'red': 20,
        'dark-green': 50,
        'navy-blue': 40,
        'yellow': 15,
        'orange': 20,
        'sky-blue': 25,
        'beige-cream': 35
      },
      gsm: p.gsm,
      dimensions: p.dimensions || '11.5"W x 21"H x 6.5" Gusset',
      material: p.material || 'Virgin Non-Woven Polypropylene',
      capacity: p.capacity || 'Up to 25 lbs',
      badge: p.badge || 'Factory Direct',
      image: mainImg,
      inStock: p.inStock && currentStockQty > 0,
      description: p.description || '',

      rating: p.rating !== undefined ? p.rating : 4.9,
      articleNo: p.articleNo || `EP-${p.id.slice(0, 6).toUpperCase()}`,
      volumeNo: p.volumeNo || `${p.gsm || 80} GSM LUXURY`,
      gallery0: gImgs[0] || mainImg,
      gallery1: gImgs[1] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85',
      gallery2: gImgs[2] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=85',
      gallery3: gImgs[3] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      brandName: p.brandName || 'ECOTEX INC.',
      fabricDetails: p.fabricDetails || `${p.gsm || 80} GSM Virgin Non-Woven Polypropylene`,
      handles: p.handles || 'Ultrasonic Thermal Welded Loops',
      printingMethod: p.printingMethod || 'High-Precision Flexographic / Gravure Custom Imprint',
      compliance: p.compliance || 'Certified California SB 270 & ASTM D6400',
      packingDetails: p.packingDetails || 'Export-Grade Heavy Duty Corrugated Cartons',
      guaranteedFabric: p.guaranteedFabric || '100% Virgin Grade Recyclable Polypropylene',
      enrouteQuality: p.enrouteQuality || 'Enroute to Quality Standard',
      bestFor: p.bestFor || 'Supermarket grocers, retail boutiques',
      recommendedPrint: p.recommendedPrint || 'High-Precision Flexographic Custom Imprint',
      trustBadge1: p.trustBadge1 || 'Fast Delivery',
      trustBadge2: p.trustBadge2 || 'Secure Store',
      trustBadge3: p.trustBadge3 || 'Easy Return',
      retailPolicyText: p.retailPolicyText || 'Retail order policy: 1 se 5 boxes maximum. Agar aapko 5 se zyada quantity chahiye, toh barah-e-karam upar Wholesale Order select karein.',
      wholesalePolicyText: p.wholesalePolicyText || 'Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain (5, 10, 15, 20...).',
      outOfStockNotice: p.outOfStockNotice || 'Product specifications aur details check ki ja sakti hain, magar ordering filhal closed hai. Stock replenish hotay hi buy button dobara live ho jayega.',
      checkoutButtonText: p.checkoutButtonText || '→ Express Checkout',
      outOfStockButtonText: p.outOfStockButtonText || 'Purchases Temporarily Closed (Sold Out)',
      retailTabLabel: p.retailTabLabel || 'Retail Order',
      wholesaleTabLabel: p.wholesaleTabLabel || 'Wholesale Order',
      specsHeading: p.specsHeading || 'Description',
      relatedTag: p.relatedTag || 'Explore More Options',
      relatedTitle: p.relatedTitle || 'Related Products',
      relatedSubtitle: p.relatedSubtitle || 'Frequently ordered together or alternative sizing options for your business.',
      relatedBackBtnText: p.relatedBackBtnText || 'View Full Catalog'
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a product title.');
      return;
    }

    const finalStockQuantity = Math.max(0, Number(formData.stockQuantity) || 0);
    const finalInStock = formData.inStock && finalStockQuantity > 0;

    const finalGalleryImages = [
      formData.gallery0.trim() || formData.image.trim(),
      formData.gallery1.trim(),
      formData.gallery2.trim(),
      formData.gallery3.trim()
    ].filter(Boolean);

    const payload: Partial<Product> = {
      name: formData.name.trim(),
      category: formData.category,
      categoryLabel: formData.categoryLabel.trim(),
      subtitle: formData.subtitle.trim(),
      pricePerUnit: Math.max(0.01, Number(formData.pricePerUnit) || 59.99),
      originalPrice: Math.max(0.01, Number(formData.originalPrice) || 74.99),
      retailPricePerUnit: Math.max(0.01, Number(formData.retailPricePerUnit) || 86.99),
      retailOriginalPrice: Math.max(0.01, Number(formData.retailOriginalPrice) || 108.73),
      retailQuantity: Math.max(1, Number(formData.retailQuantity) || 15),
      retailMinBoxes: Math.max(1, Number(formData.retailQuantity) || 15),
      retailMaxBoxes: Math.max(1, Number(formData.retailQuantity) || 15),
      moq: Number(formData.moq) || 1000,
      wholesaleMoq: Math.max(1, Number(formData.wholesaleMoq || formData.wholesaleMinBoxes) || 5),
      wholesaleMinBoxes: Math.max(1, Number(formData.wholesaleMinBoxes || formData.wholesaleMoq) || 5),
      wholesaleMaxBoxes: formData.wholesaleMaxBoxes ? Math.max(1, Number(formData.wholesaleMaxBoxes)) : undefined,
      pcsPerBox: Math.max(1, Number(formData.pcsPerBox) || 200),
      stockQuantity: finalStockQuantity,
      availableColors: (formData.availableColors || []).map(c => ({
        id: c.id || ('col-' + Math.random().toString(36).substring(2, 7)),
        name: (c.name || '').trim() || 'Custom Color',
        hex: c.hex || '#166534',
        stockQuantity: Math.max(0, Number(c.stockQuantity) || 0)
      })),
      colorStock: (formData.availableColors || []).reduce((acc, c) => {
        const stock = Math.max(0, Number(c.stockQuantity) || 0);
        const key = c.id || c.name.toLowerCase().replace(/\s+/g, '-');
        return { ...acc, [key]: stock, [c.name.toLowerCase()]: stock };
      }, {} as Record<string, number>),
      gsm: Number(formData.gsm) || 80,
      dimensions: formData.dimensions.trim(),
      material: formData.material.trim(),
      capacity: formData.capacity.trim(),
      badge: formData.badge.trim(),
      image: (formData.gallery0.trim() || formData.image.trim()) || '/images/bag-green.png',
      inStock: finalInStock,
      description: formData.description.trim(),

      // Single Product Page Extended Properties
      rating: Number(formData.rating) || 4.9,
      articleNo: formData.articleNo.trim(),
      volumeNo: formData.volumeNo.trim(),
      galleryImages: finalGalleryImages,
      brandName: formData.brandName.trim(),
      fabricDetails: formData.fabricDetails.trim(),
      handles: formData.handles.trim(),
      printingMethod: formData.printingMethod.trim(),
      compliance: formData.compliance.trim(),
      packingDetails: formData.packingDetails.trim(),
      guaranteedFabric: formData.guaranteedFabric.trim(),
      enrouteQuality: formData.enrouteQuality.trim(),
      bestFor: formData.bestFor.trim(),
      recommendedPrint: formData.recommendedPrint.trim(),
      trustBadge1: formData.trustBadge1.trim(),
      trustBadge2: formData.trustBadge2.trim(),
      trustBadge3: formData.trustBadge3.trim(),
      retailPolicyText: formData.retailPolicyText.trim(),
      wholesalePolicyText: formData.wholesalePolicyText.trim(),
      outOfStockNotice: formData.outOfStockNotice.trim(),
      checkoutButtonText: formData.checkoutButtonText.trim(),
      outOfStockButtonText: formData.outOfStockButtonText.trim(),
      retailTabLabel: formData.retailTabLabel.trim(),
      wholesaleTabLabel: formData.wholesaleTabLabel.trim(),
      specsHeading: formData.specsHeading.trim(),
      relatedTag: formData.relatedTag.trim(),
      relatedTitle: formData.relatedTitle.trim(),
      relatedSubtitle: formData.relatedSubtitle.trim(),
      relatedBackBtnText: formData.relatedBackBtnText.trim()
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct({
        ...payload,
        name: payload.name || 'New Wholesale Product',
        category: payload.category || 'non-woven',
        categoryLabel: payload.categoryLabel || 'Non-Woven Totes',
        subtitle: payload.subtitle || '',
        pricePerUnit: payload.pricePerUnit || 0.25,
        moq: payload.moq || 1000,
        pcsPerBox: payload.pcsPerBox || 200,
        stockQuantity: finalStockQuantity,
        gsm: payload.gsm || 80,
        dimensions: payload.dimensions || '11.5"W x 21"H x 6.5" Gusset',
        material: payload.material || 'Virgin Non-Woven Polypropylene',
        capacity: payload.capacity || 'Up to 25 lbs',
        badge: payload.badge || 'Eco Choice',
        image: payload.image || '/images/bag-green.png',
        inStock: finalInStock,
        description: payload.description || '',
        certifications: ['GRS Certified', '100% Recyclable'],
        availableColors: [
          { name: 'Dark Green', hex: '#166534' },
          { name: 'Navy Blue', hex: '#1e3a8a' },
          { name: 'Pure White', hex: '#ffffff' }
        ],
        features: ['Heavy Duty', 'Heat Welded Loops', 'Reusable'],
        ecoImpact: '100% Recyclable Polypropylene',
        leadTime: '3-5 Business Days',
        volumeTiers: [
          { minQty: 1000, price: 0.25 },
          { minQty: 5000, price: 0.22 },
          { minQty: 10000, price: 0.19 }
        ]
      } as any);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const activeGalleryPreviewUrl = [
    formData.gallery0,
    formData.gallery1,
    formData.gallery2,
    formData.gallery3
  ][galleryPreviewIdx] || formData.image || '/images/bag-green.png';

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg xs:text-xl font-black text-[#0f172a] flex items-center gap-2">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#166534] shrink-0" />
            <span>Product Catalog & Single Page Manager</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage wholesale products, 4-photo galleries, technical specs, pricing, and live inventory.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white text-xs font-extrabold transition-all shadow-md shadow-[#166534]/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, article no, or copy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4">
          <CustomSelect
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categoriesList.map(c => ({ value: c.id, label: c.label }))
            ]}
            className="w-full"
            buttonClassName="w-full bg-slate-50 border-slate-200 text-xs font-semibold py-2"
          />
        </div>

        {/* Stock Filter */}
        <div className="sm:col-span-3">
          <CustomSelect
            value={stockFilter}
            onChange={(val) => setStockFilter(val as any)}
            options={[
              { value: 'all', label: 'All Stock Status' },
              { value: 'in-stock', label: 'In Stock Only' },
              { value: 'out-of-stock', label: 'Out of Stock' }
            ]}
            className="w-full"
            buttonClassName="w-full bg-slate-50 border-slate-200 text-xs font-semibold py-2"
          />
        </div>
      </div>

      {/* Products View: Mobile Card List (block md:hidden) */}
      <div className="block md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 font-medium">
            No products found matching filters.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isProdInStock = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={p.image || '/images/bag-green.png'}
                      alt={p.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/bag-green.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-[#0f172a] text-xs truncate max-w-[170px]">{p.name}</span>
                      {p.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 shrink-0">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{p.categoryLabel || p.category}</span>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                      <span className="font-bold text-slate-700">{p.articleNo || `EP-${p.id.slice(0, 6).toUpperCase()}`}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-bold">{p.pcsPerBox || 200} pcs/box</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">Wholesale Price</span>
                    <div className="font-black text-[#166534] text-sm font-mono">
                      ${p.pricePerUnit.toFixed(2)}
                      {p.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                          ${p.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-normal"> /box</span>
                    </div>
                  </div>

                  {/* Stock Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleProductStock(p.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      isProdInStock
                        ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100/80 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isProdInStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span>
                      {isProdInStock
                        ? `${typeof p.stockQuantity === 'number' ? `${p.stockQuantity} boxes` : 'In Stock'}`
                        : 'Sold Out'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {isProdInStock ? 'Purchasing Active' : 'Ordering Closed'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(p)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#d97706] border border-amber-200/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Single Page</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductToDelete(p);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Products Table (hidden md:block) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8faf9] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Article / Volume</th>
                <th className="py-3.5 px-6">Price / Box</th>
                <th className="py-3.5 px-6">Pack Spec</th>
                <th className="py-3.5 px-6">Stock Level</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isProdInStock = p.inStock && (p.stockQuantity === undefined || p.stockQuantity > 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={p.image || '/images/bag-green.png'}
                              alt={p.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/bag-green.png';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-[#0f172a] text-xs hover:text-[#166534] transition-colors line-clamp-1">
                                {p.name}
                              </span>
                              {p.badge && (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {p.categoryLabel || p.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Article & Volume */}
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <span className="font-bold text-slate-800 block">
                          {p.articleNo || `EP-${p.id.slice(0, 6).toUpperCase()}`}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {p.volumeNo || `${p.gsm || 80} GSM`}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-xs text-[#166534] font-mono">
                          ${p.pricePerUnit.toFixed(2)}
                          {p.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                              ${p.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">per box</span>
                      </td>

                      {/* Pack Spec */}
                      <td className="py-4 px-6 font-mono text-xs">
                        <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                          {p.pcsPerBox || 200} pcs/box
                        </span>
                      </td>

                      {/* Stock Level */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all w-fit cursor-pointer ${
                              isProdInStock
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            }`}
                            title="Click to toggle Stock Status"
                          >
                            <span className={`w-2 h-2 rounded-full ${isProdInStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>
                              {isProdInStock
                                ? `${typeof p.stockQuantity === 'number' ? `${p.stockQuantity} boxes` : 'In Stock'}`
                                : '0 boxes (Sold Out)'}
                            </span>
                          </button>
                          <span className="text-[10px] text-slate-400 pl-1">
                            {isProdInStock ? 'Purchasing Active' : 'Visible · Sold Out Notice'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#d97706] border border-amber-200/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                            title="Edit Single Product Page & All Content"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Single Page</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProductToDelete(p);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          FULL SINGLE PRODUCT PAGE & CATALOG EDIT MODAL
         ======================================================== */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-black/50 border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#fbfdfb] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#d97706] flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0f172a]">
                    {editingProduct ? `Edit Single Product: ${editingProduct.name}` : 'Add New Wholesale Product'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Change any title, 4-photo gallery, specs, prices, badges, and policies visible on this product page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 pt-3 border-b border-slate-100 bg-slate-50/50 shrink-0 overflow-x-auto scrollbar-none">
              {[
                { id: 'basic' as const, label: '1. General & Pricing', icon: Package },
                { id: 'gallery' as const, label: '2. 4-Photo Gallery', icon: ImageIcon },
                { id: 'specs' as const, label: '3. Tech Specifications', icon: FileText },
                { id: 'policies' as const, label: '4. Badges & Policies', icon: ShieldCheck }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                      isActive
                        ? 'border-[#d97706] text-[#d97706] bg-white shadow-2xs font-extrabold'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Scrollable Body */}
            <form id="product-full-form" onSubmit={handleSaveProduct} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              
              {/* ========================================================
                  TAB 1: GENERAL & PRICING
                 ======================================================== */}
              {modalTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* General Info Card */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#d97706]" />
                      <span>Product Titles, Metadata & Categories</span>
                    </h4>

                    {/* Product Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Product Title (H1 Headline on Single Page) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#0f172a] bg-white focus:outline-none focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/15 transition-all shadow-2xs"
                        placeholder="e.g. Heavy-Duty Gusseted Supermarket Tote"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category Label (Top Orange Tag)
                        </label>
                        <input
                          type="text"
                          value={formData.categoryLabel}
                          onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="SUSTAINABLE NON-WOVEN"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Article No. (Metadata Tag)
                        </label>
                        <input
                          type="text"
                          value={formData.articleNo}
                          onChange={(e) => setFormData({ ...formData, articleNo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono bg-white"
                          placeholder="EP-NW-3040"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Volume Tag (Metadata Tag)
                        </label>
                        <input
                          type="text"
                          value={formData.volumeNo}
                          onChange={(e) => setFormData({ ...formData, volumeNo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono bg-white"
                          placeholder="80 GSM LUXURY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Customer Rating (Stars)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="1.0"
                            max="5.0"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.9 })}
                            className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                          />
                          <Star className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 fill-amber-500" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Store Category
                        </label>
                        <CustomSelect
                          value={formData.category}
                          onChange={(val) => {
                            const cat = val as ProductCategory;
                            const found = categoriesList.find(c => c.id === cat);
                            setFormData({ 
                              ...formData, 
                              category: cat,
                              categoryLabel: found ? found.label.toUpperCase() : 'SUSTAINABLE NON-WOVEN'
                            });
                          }}
                          options={categoriesList.map(c => ({ value: c.id, label: c.label }))}
                          className="w-full"
                          buttonClassName="w-full bg-white border-slate-200 text-xs font-semibold py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Store Highlight Badge
                        </label>
                        <CustomSelect
                          value={formData.badge}
                          onChange={(val) => setFormData({ ...formData, badge: val })}
                          options={badgesList.map(b => ({ value: b, label: b }))}
                          className="w-full"
                          buttonClassName="w-full bg-white border-slate-200 text-xs font-semibold py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing, Packaging & Minimums Card */}
                  {/* Packaging Specification Card */}
                  <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-emerald-600" />
                          <span>Master Packaging Spec (Pieces Per Box)</span>
                        </h4>
                        <p className="text-[11px] text-emerald-800/80 mt-0.5">
                          Har 1 box mein kitne pieces pack hain. Yeh calculation Wholesale & Retail dono prices pr live apply hoti hai.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-900 whitespace-nowrap">1 Box =</span>
                        <div className="relative w-32">
                          <input
                            type="number"
                            step="10"
                            min="1"
                            required
                            value={formData.pcsPerBox}
                            onChange={(e) => setFormData({ ...formData, pcsPerBox: Math.max(1, parseInt(e.target.value) || 200) })}
                            className="w-full pl-3 pr-10 py-1.5 rounded-xl border border-emerald-300 text-xs sm:text-sm font-bold text-emerald-950 bg-white shadow-2xs focus:outline-none focus:border-emerald-600"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 font-mono">Pcs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Pricing Grid: Wholesale Order vs Retail Order */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 1. WHOLESALE ORDER MODE CARD */}
                    <div className="bg-emerald-50/40 p-4.5 rounded-2xl border-2 border-emerald-200 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">
                            1. Wholesale Order Mode (Bulk)
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300/80 px-2 py-0.5 rounded-full">
                          MOQ: {formData.wholesaleMoq || 5} Boxes{formData.wholesaleMaxBoxes ? ' · Max: ' + formData.wholesaleMaxBoxes + ' Boxes' : ''}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-emerald-900 mb-1">
                            Wholesale Box Price ($) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-700">$</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={formData.pricePerUnit}
                              onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-3 py-2 rounded-xl border border-emerald-300 text-sm font-bold text-[#166534] bg-white focus:outline-none focus:border-emerald-600"
                              placeholder="59.99"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-700 mt-1 block">
                            ≈ ${( (formData.pricePerUnit || 0) / (formData.pcsPerBox || 200) ).toFixed(3)} / pc
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            Wholesale Strike Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.originalPrice}
                              onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 bg-white"
                              placeholder="74.99"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Strikethrough compare-at price
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Wholesale MOQ (Boxes) *
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            required
                            value={formData.wholesaleMoq}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 5);
                              setFormData({ ...formData, wholesaleMoq: val, wholesaleMinBoxes: val });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-slate-800 bg-white"
                            placeholder="5"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Wholesale Tab Label
                          </label>
                          <input
                            type="text"
                            value={formData.wholesaleTabLabel}
                            onChange={(e) => setFormData({ ...formData, wholesaleTabLabel: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#166534] bg-white"
                            placeholder="Wholesale Order"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Wholesale Policy Notice Text
                        </label>
                        <textarea
                          rows={2}
                          value={formData.wholesalePolicyText}
                          onChange={(e) => setFormData({ ...formData, wholesalePolicyText: e.target.value })}
                          className="w-full p-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-emerald-600"
                          placeholder="Wholesale order: starting 5 boxes se hai aur sabhi orders 5 ke multiples mein place hote hain..."
                        />
                      </div>
                    </div>

                    {/* 2. RETAIL ORDER MODE CARD */}
                    <div className="bg-amber-50/40 p-4.5 rounded-2xl border-2 border-amber-200 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                            2. Retail Order Mode (Small Quantities)
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 border border-amber-300/80 px-2 py-0.5 rounded-full">
                          Fixed: {formData.retailQuantity || 15} Boxes
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-amber-950 mb-1">
                            Retail Box Price ($) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700">$</span>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={formData.retailPricePerUnit}
                              onChange={(e) => setFormData({ ...formData, retailPricePerUnit: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-3 py-2 rounded-xl border border-amber-300 text-sm font-bold text-[#d97706] bg-white focus:outline-none focus:border-amber-600"
                              placeholder="86.99"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-amber-700 mt-1 block">
                            ≈ ${( (formData.retailPricePerUnit || 0) / (formData.pcsPerBox || 200) ).toFixed(3)} / pc
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">
                            Retail Strike Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.retailOriginalPrice}
                              onChange={(e) => setFormData({ ...formData, retailOriginalPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-6 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 bg-white"
                              placeholder="108.73"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Strikethrough compare-at price
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Retail Fixed Quantity (Boxes) *
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            required
                            value={formData.retailQuantity || formData.retailMaxBoxes || 15}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 15);
                              setFormData({
                                ...formData,
                                retailQuantity: val,
                                retailMinBoxes: val,
                                retailMaxBoxes: val
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs font-bold text-slate-800 bg-white"
                            placeholder="15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Retail Tab Label
                          </label>
                          <input
                            type="text"
                            value={formData.retailTabLabel}
                            onChange={(e) => setFormData({ ...formData, retailTabLabel: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-amber-900 bg-white"
                            placeholder="Retail Order"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Retail Policy Notice Text
                        </label>
                        <textarea
                          rows={2}
                          value={formData.retailPolicyText}
                          onChange={(e) => setFormData({ ...formData, retailPolicyText: e.target.value })}
                          className="w-full p-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-amber-600"
                          placeholder="Retail order policy: Fixed 15 boxes per order. Isse kam ya zyada quantity ke liye barah-e-karam Wholesale Order select karein."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock Inventory & Live Status Card */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-800">
                          Available Stock (Boxes) *
                        </label>
                        <p className="text-[10px] text-slate-500">
                          Jab stock 0 hoga toh single product page pr Out of Stock banner active ho jayega.
                        </p>
                      </div>

                      <div className="relative w-40">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          required
                          value={formData.stockQuantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const finalVal = isNaN(val) ? 0 : Math.max(0, val);
                            setFormData({
                              ...formData,
                              stockQuantity: finalVal,
                              inStock: finalVal > 0
                            });
                          }}
                          className={`w-full pl-3 pr-14 py-2 rounded-xl border text-sm font-bold text-center transition-all ${
                            formData.stockQuantity > 0 && formData.inStock
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500'
                              : 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500'
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">boxes</span>
                      </div>
                    </div>

                    {/* Quick Stock Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick:</span>
                      {[
                        { label: '0 (Sold Out)', value: 0 },
                        { label: '10 Boxes', value: 10 },
                        { label: '25 Boxes', value: 25 },
                        { label: '50 Boxes', value: 50 },
                        { label: '100 Boxes', value: 100 },
                        { label: '500 Boxes', value: 500 }
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            stockQuantity: preset.value,
                            inStock: preset.value > 0
                          })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            formData.stockQuantity === preset.value
                              ? preset.value === 0 
                                ? 'bg-rose-600 text-white shadow-2xs' 
                                : 'bg-[#166534] text-white shadow-2xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Color Palette & Stock Inventory Card */}
                  <div className="bg-slate-50/70 p-4.5 rounded-2xl border-2 border-emerald-200/90 space-y-3.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-600" />
                          <span>Dynamic Color Palette & Stock Inventory</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Apni marzi se koi bhi naya colour add karein, color picker se shade chunein, aur har colour ka stock set karein (jaise Red mein 20 boxes).
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-600">Total:</span>
                        <span className="text-xs font-mono font-bold text-[#166534] bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                          {(formData.availableColors || []).reduce((acc, c) => acc + (Number(c.stockQuantity) || 0), 0)} Boxes
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const total = (formData.availableColors || []).reduce((acc, c) => acc + (Number(c.stockQuantity) || 0), 0);
                            setFormData({ ...formData, stockQuantity: total, inStock: total > 0 });
                          }}
                          className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline px-2 py-1 rounded-lg hover:bg-emerald-100/50 cursor-pointer transition-colors"
                          title="Sync master stock quantity with the sum of all colors"
                        >
                          Sync Master
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newId = 'col-' + Date.now();
                            const newColor: ProductColorVariant = {
                              id: newId,
                              name: 'Color ' + ((formData.availableColors || []).length + 1),
                              hex: '#166534',
                              stockQuantity: 20
                            };
                            setFormData({
                              ...formData,
                              availableColors: [...(formData.availableColors || []), newColor]
                            });
                          }}
                          className="px-3 py-1.5 bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Color</span>
                        </button>
                      </div>
                    </div>

                    {/* Color items list */}
                    {(!formData.availableColors || formData.availableColors.length === 0) ? (
                      <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300 space-y-2">
                        <p className="text-xs text-slate-500">Abhi koi colour add nahi hai.</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, availableColors: DEFAULT_PALETTE.map(c => ({ ...c })) })}
                          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Standard 10 Colors Load Karein
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {formData.availableColors.map((c, index) => {
                          const stock = Number(c.stockQuantity) || 0;
                          const isSoldOut = stock <= 0;
                          return (
                            <div
                              key={c.id || index}
                              className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 relative group ${
                                isSoldOut 
                                  ? 'bg-rose-50/40 border-rose-200' 
                                  : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300'
                              }`}
                            >
                              {/* Top row: Color Picker Swatch & Color Name Input */}
                              <div className="flex items-center gap-2">
                                <label 
                                  className="relative w-6 h-6 rounded-full shrink-0 shadow-2xs border-2 border-slate-300 cursor-pointer overflow-hidden"
                                  style={{ backgroundColor: c.hex }}
                                  title="Click to pick color shade"
                                >
                                  <input
                                    type="color"
                                    value={c.hex}
                                    onChange={(e) => {
                                      const updated = [...formData.availableColors];
                                      updated[index] = { ...updated[index], hex: e.target.value };
                                      setFormData({ ...formData, availableColors: updated });
                                    }}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={c.name}
                                  onChange={(e) => {
                                    const updated = [...formData.availableColors];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    setFormData({ ...formData, availableColors: updated });
                                  }}
                                  className="w-full text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none bg-transparent"
                                  placeholder="Color Name"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = formData.availableColors.filter((_, i) => i !== index);
                                    setFormData({ ...formData, availableColors: updated });
                                  }}
                                  className="opacity-40 hover:opacity-100 text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer transition-opacity"
                                  title="Delete this color"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Middle row: Hex code & Stock Input */}
                              <div className="flex items-center gap-2">
                                <div className="relative w-20 shrink-0">
                                  <input
                                    type="text"
                                    value={c.hex}
                                    onChange={(e) => {
                                      const updated = [...formData.availableColors];
                                      updated[index] = { ...updated[index], hex: e.target.value };
                                      setFormData({ ...formData, availableColors: updated });
                                    }}
                                    className="w-full px-1.5 py-1 text-[10px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-lg text-center"
                                    placeholder="#000000"
                                  />
                                </div>

                                <div className="relative flex-1">
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => {
                                      const val = Math.max(0, parseInt(e.target.value) || 0);
                                      const updated = [...formData.availableColors];
                                      updated[index] = { ...updated[index], stockQuantity: val };
                                      setFormData({ ...formData, availableColors: updated });
                                    }}
                                    className={`w-full pl-2 pr-7 py-1 text-center font-mono font-bold text-xs rounded-lg border focus:outline-none focus:border-emerald-500 ${
                                      isSoldOut 
                                        ? 'border-rose-300 bg-rose-50/50 text-rose-800' 
                                        : 'border-slate-200 bg-slate-50/50 text-slate-800'
                                    }`}
                                    placeholder="0"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 font-mono">bx</span>
                                </div>
                              </div>

                              {/* Bottom status */}
                              <div className="flex items-center justify-between text-[10px] pt-0.5">
                                <span className="text-slate-400">Status:</span>
                                <strong className={isSoldOut ? 'text-rose-600 font-bold' : 'text-[#166534]'}>
                                  {isSoldOut ? 'Sold Out' : `${stock} Boxes`}
                                </strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>                </div>
              )}

              {/* ========================================================
                  TAB 2: 4-PHOTO GALLERY
                 ======================================================== */}
              {modalTab === 'gallery' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                    <ImageIcon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">4-Image Gallery on Single Product Page</p>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        Slot 1 represents the main hero showcase cutout. Slots 2, 3, and 4 populate the 4-thumbnail gallery strip below the hero image.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* Left 7 Cols: 4 Slots Input */}
                    <div className="lg:col-span-7 space-y-4">
                      
                      {/* Slot 1 */}
                      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-[#d97706] text-white flex items-center justify-center text-[10px]">1</span>
                            <span>Main Hero Image / Cutout (Slot 1) *</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">Primary Product View</span>
                        </div>

                        <ImageUploader
                          label=""
                          description="Click Browse File or drag & drop to upload product photo directly from your device"
                          value={formData.gallery0}
                          onChange={(url) => setFormData({ ...formData, gallery0: url, image: url })}
                          aspectRatio="portrait"
                        />

                        {/* Presets */}
                        <div className="pt-2 border-t border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">Quick Preset Colorways:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {PRODUCT_IMAGE_PRESETS.map((pr) => (
                              <button
                                key={pr.url}
                                type="button"
                                onClick={() => setFormData({ ...formData, gallery0: pr.url, image: pr.url })}
                                className="px-2.5 py-1 rounded-lg text-[10px] bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer font-semibold transition-all shadow-2xs"
                              >
                                {pr.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Slot 2 */}
                      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-slate-700 text-white flex items-center justify-center text-[10px]">2</span>
                            <span>Gallery Thumbnail 2</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">Fabric Texture / Studio View</span>
                        </div>

                        <ImageUploader
                          label=""
                          description="Upload fabric texture or studio close-up photo directly from computer"
                          value={formData.gallery1}
                          onChange={(url) => setFormData({ ...formData, gallery1: url })}
                          aspectRatio="portrait"
                        />
                      </div>

                      {/* Slot 3 */}
                      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-slate-700 text-white flex items-center justify-center text-[10px]">3</span>
                            <span>Gallery Thumbnail 3</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">Manufacturing / Workshop</span>
                        </div>

                        <ImageUploader
                          label=""
                          description="Upload factory workshop or precision manufacturing photo"
                          value={formData.gallery2}
                          onChange={(url) => setFormData({ ...formData, gallery2: url })}
                          aspectRatio="portrait"
                        />
                      </div>

                      {/* Slot 4 */}
                      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-md bg-slate-700 text-white flex items-center justify-center text-[10px]">4</span>
                            <span>Gallery Thumbnail 4</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">Retail Pack / Lifestyle</span>
                        </div>

                        <ImageUploader
                          label=""
                          description="Upload carton pack, pallet, or retail lifestyle photo"
                          value={formData.gallery3}
                          onChange={(url) => setFormData({ ...formData, gallery3: url })}
                          aspectRatio="portrait"
                        />
                      </div>

                    </div>

                    {/* Right 5 Cols: Live Interactive 4-Thumbnail Mockup */}
                    <div className="lg:col-span-5 bg-[#fbfdfb] p-4 rounded-3xl border border-[#d97706]/30 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Single Page Gallery Preview</span>
                        <span className="text-[#d97706] font-mono">Live Sync</span>
                      </div>

                      {/* Main Preview Box */}
                      <div className="w-full aspect-[4/5] bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center relative shadow-sm overflow-hidden">
                        <img
                          src={activeGalleryPreviewUrl}
                          alt="Gallery Preview"
                          className="w-full h-full object-contain filter drop-shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/bag-green.png';
                          }}
                        />
                        <span className="absolute bottom-2 right-2 text-[9px] bg-slate-900/70 text-white px-2 py-0.5 rounded-full font-mono">
                          Slot {galleryPreviewIdx + 1}
                        </span>
                      </div>

                      {/* 4 Thumbnails Strip */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          formData.gallery0,
                          formData.gallery1,
                          formData.gallery2,
                          formData.gallery3
                        ].map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setGalleryPreviewIdx(idx)}
                            className={`aspect-square rounded-xl bg-white p-1 border transition-all cursor-pointer overflow-hidden ${
                              galleryPreviewIdx === idx
                                ? 'border-[#d97706] ring-2 ring-amber-500/30 shadow-xs'
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={url || '/images/bag-green.png'}
                              alt={`Slot ${idx + 1}`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/bag-green.png';
                              }}
                            />
                          </button>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* ========================================================
                  TAB 3: TECH SPECIFICATIONS & COPY
                 ======================================================== */}
              {modalTab === 'specs' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#d97706]" />
                      <span>Single Product Page Specifications Table (Exact Bullets)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • BRAND NAME
                        </label>
                        <input
                          type="text"
                          value={formData.brandName}
                          onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="ECOTEX INC."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Fabric Details
                        </label>
                        <input
                          type="text"
                          value={formData.fabricDetails}
                          onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="80 GSM Virgin Non-Woven Polypropylene"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Dimensions
                        </label>
                        <input
                          type="text"
                          value={formData.dimensions}
                          onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder='11.5"W x 21"H x 6.5" Gusset'
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Handles
                        </label>
                        <input
                          type="text"
                          value={formData.handles}
                          onChange={(e) => setFormData({ ...formData, handles: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Ultrasonic Thermal Welded Loops"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Printing
                        </label>
                        <input
                          type="text"
                          value={formData.printingMethod}
                          onChange={(e) => setFormData({ ...formData, printingMethod: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="High-Precision Flexographic / Gravure Custom Imprint"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Compliance
                        </label>
                        <input
                          type="text"
                          value={formData.compliance}
                          onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Certified California SB 270 & ASTM D6400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Bag & Picture Packing
                        </label>
                        <input
                          type="text"
                          value={formData.packingDetails}
                          onChange={(e) => setFormData({ ...formData, packingDetails: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Export-Grade Heavy Duty Corrugated Cartons"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          • Guaranteed Fabric
                        </label>
                        <input
                          type="text"
                          value={formData.guaranteedFabric}
                          onChange={(e) => setFormData({ ...formData, guaranteedFabric: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="100% Virgin Grade Recyclable Polypropylene"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        • Quality Standard Banner (Final Highlighted Bullet)
                      </label>
                      <input
                        type="text"
                        value={formData.enrouteQuality}
                        onChange={(e) => setFormData({ ...formData, enrouteQuality: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                        placeholder="Enroute to Quality Standard"
                      />
                    </div>
                  </div>

                  {/* Editorial Copy & Color Strip Guidance */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Recommendations & Editorial Description</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Best For (Shown in Dynamic Color Guide Card)
                        </label>
                        <input
                          type="text"
                          value={formData.bestFor}
                          onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Supermarket grocers, retail boutiques"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Recommended Imprint (Shown in Dynamic Color Guide Card)
                        </label>
                        <input
                          type="text"
                          value={formData.recommendedPrint}
                          onChange={(e) => setFormData({ ...formData, recommendedPrint: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="High-Precision Flexographic Custom Imprint"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Product Editorial Description Copy
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#d97706]"
                        placeholder="Discover the pinnacle of elegance with this masterfully crafted piece..."
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================
                  TAB 4: BADGES, POLICIES & NOTICES
                 ======================================================== */}
              {modalTab === 'policies' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* 3 Bottom Trust Badges */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#d97706]" />
                      <span>3 Bottom Trust Badges (Shown below Description)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Trust Badge 1</span>
                        </label>
                        <input
                          type="text"
                          value={formData.trustBadge1}
                          onChange={(e) => setFormData({ ...formData, trustBadge1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                          placeholder="Fast Delivery"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Trust Badge 2</span>
                        </label>
                        <input
                          type="text"
                          value={formData.trustBadge2}
                          onChange={(e) => setFormData({ ...formData, trustBadge2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                          placeholder="Secure Store"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                          <span>Trust Badge 3</span>
                        </label>
                        <input
                          type="text"
                          value={formData.trustBadge3}
                          onChange={(e) => setFormData({ ...formData, trustBadge3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                          placeholder="Easy Return"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ordering Policy Text Banners */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Retail & Wholesale Order Policy Banners</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Retail Order Policy Text (Shown when Retail tab is active)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.retailPolicyText}
                        onChange={(e) => setFormData({ ...formData, retailPolicyText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500"
                        placeholder="Retail order policy notice..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 mb-1">
                        Wholesale Order Policy Text (Shown when Wholesale tab is active)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.wholesalePolicyText}
                        onChange={(e) => setFormData({ ...formData, wholesalePolicyText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-emerald-500"
                        placeholder="Wholesale order policy notice..."
                      />
                    </div>
                  </div>

                  {/* Out of Stock Notice Banner */}
                  <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Out of Stock Notification Message (When Stock is 0 Boxes)</span>
                    </h4>
                    <p className="text-[11px] text-rose-700/80">
                      Yeh text customer ko tab show hoga jab is product ka stock 0 boxes ho jaye.
                    </p>
                    <textarea
                      rows={2}
                      value={formData.outOfStockNotice}
                      onChange={(e) => setFormData({ ...formData, outOfStockNotice: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs font-medium bg-white text-rose-900 focus:outline-none focus:border-rose-500"
                      placeholder="Product specifications aur details check ki ja sakti hain..."
                    />
                  </div>

                  {/* Buttons & Related Products Section Customizer */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#d97706]" />
                      <span>Single Product Page Buttons & Section Titles</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Checkout Button Text (When In Stock)
                        </label>
                        <input
                          type="text"
                          value={formData.checkoutButtonText}
                          onChange={(e) => setFormData({ ...formData, checkoutButtonText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#d97706]"
                          placeholder="→ Express Checkout"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sold Out Button Text (When Stock is 0)
                        </label>
                        <input
                          type="text"
                          value={formData.outOfStockButtonText}
                          onChange={(e) => setFormData({ ...formData, outOfStockButtonText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500"
                          placeholder="Purchases Temporarily Closed (Sold Out)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Retail Order Tab Label
                        </label>
                        <input
                          type="text"
                          value={formData.retailTabLabel}
                          onChange={(e) => setFormData({ ...formData, retailTabLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Retail Order"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Wholesale Order Tab Label
                        </label>
                        <input
                          type="text"
                          value={formData.wholesaleTabLabel}
                          onChange={(e) => setFormData({ ...formData, wholesaleTabLabel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#166534]"
                          placeholder="Wholesale Order"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Specifications Heading
                        </label>
                        <input
                          type="text"
                          value={formData.specsHeading}
                          onChange={(e) => setFormData({ ...formData, specsHeading: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Description"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Related Products Tag
                        </label>
                        <input
                          type="text"
                          value={formData.relatedTag}
                          onChange={(e) => setFormData({ ...formData, relatedTag: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Explore More Options"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Related Products Title
                        </label>
                        <input
                          type="text"
                          value={formData.relatedTitle}
                          onChange={(e) => setFormData({ ...formData, relatedTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="Related Products"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Related Back Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.relatedBackBtnText}
                          onChange={(e) => setFormData({ ...formData, relatedBackBtnText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                          placeholder="View Full Catalog"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Related Products Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.relatedSubtitle}
                        onChange={(e) => setFormData({ ...formData, relatedSubtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
                        placeholder="Frequently ordered together or alternative sizing options for your business."
                      />
                    </div>
                  </div>

                </div>
              )}

              </div>

              {/* Modal Fixed Sticky Footer */}
              <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-2.5 shrink-0">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  All changes save directly to the database and sync instantly to the single product page.
                </span>

                <div className="flex items-center gap-2 xs:ml-auto w-full xs:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 xs:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSaveProduct}
                    className="flex-1 xs:flex-none px-6 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98] text-center whitespace-nowrap shrink-0"
                  >
                    {editingProduct ? 'Save & Publish' : 'Create Product'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn transition-all"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-black/40 border border-red-200 space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-xl bg-red-50">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#0f172a]">
                Confirm Product Deletion
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#0f172a]">{productToDelete.name}</strong>? This model will be immediately removed from the live wholesale storefront.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Model
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
