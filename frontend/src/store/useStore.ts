import { create } from 'zustand';
import { Product, CategoryItem, Order, QuoteSubmission, SiteSettings, CartItem } from '../types';
import { PRODUCTS } from '../data/products';
import { BASE_URL, apiService } from '../services/apiService';

export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  badgeDoctor: string;
  badgeTrust: string;
  productImage: string;
  backgroundImage?: string;
  showcasePrice: number;
  casePackSize: number;
  variants: {
    id: string;
    colorName: string;
    hex: string;
    image: string;
  }[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  date: string;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export interface StoreState {
  // Storefront & CMS State
  products: Product[];
  categories: CategoryItem[];
  heroConfig: HeroConfig;
  siteSettings: SiteSettings;
  siteImages: Record<string, string>;
  mediaLibrary: MediaAsset[];
  orders: Order[];
  quotes: QuoteSubmission[];

  // E-Commerce Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartItemCount: () => number;

  // Admin Auth & Route Protection
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => boolean;

  // CMS Actions (Real-Time Sync)
  fetchSettings: () => Promise<SiteSettings | null>;
  fetchAllData: () => Promise<void>;
  updateHeroConfig: (updates: Partial<HeroConfig>) => void;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  updateSiteImage: (key: string, url: string) => void;
  
  // Product Catalog CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;

  // Categories CRUD
  addCategory: (category: Partial<CategoryItem> & { label: string }) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;

  // Media Library
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'date'>) => void;
  deleteMediaAsset: (id: string) => void;

  // Orders & RFQ Management
  fetchOrders: () => Promise<Order[]>;
  fetchQuotes: () => Promise<QuoteSubmission[]>;
  createOrder: (orderData: Partial<Order>) => Promise<Order> | Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: string) => void;
  deleteOrder: (id: string) => void;
  createQuote: (quoteData: Partial<QuoteSubmission>) => Promise<QuoteSubmission> | QuoteSubmission;
  updateQuote: (id: string, updates: Partial<QuoteSubmission>) => void;
  updateQuoteStatus: (id: string, status: string) => void;
  deleteQuote: (id: string) => void;

  // Analytics & Stats
  analytics: {
    activeVisitors: number;
    quoteRequestsCount: number;
    totalOrdersCount: number;
    grossRevenue: number;
    bagsDisplaced: number;
  };
  updateAnalytics: (updates: Partial<StoreState['analytics']>) => void;
}

// Initial Seeds
const INITIAL_HERO_CONFIG: HeroConfig = {
  title: "It's time to\npack better.",
  subtitle: "Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags for retail supermarkets, luxury boutiques, and global distributors.",
  ctaText: "Shop Now",
  badgeDoctor: "Recommended by doctors",
  badgeTrust: "Trusted by 21,000+ People",
  productImage: "",
  backgroundImage: "/images/home-hero-bg.jpg",
  showcasePrice: 0.25,
  casePackSize: 1000,
  variants: [
    { id: 'v1', colorName: 'Oceanic Navy Blue', hex: '#1e3a5f', image: '/images/bag-blue.png' },
    { id: 'v2', colorName: 'Ecotex Leaf Green', hex: '#4E9F76', image: '/images/bag-green.png' },
    { id: 'v3', colorName: 'Midnight Slate & Gold', hex: '#0f172a', image: '/images/bag-black.png' },
    { id: 'v4', colorName: 'Pure White Linen', hex: '#FFFFFF', image: '/images/bag-white.png' },
    { id: 'v5', colorName: 'Bio Amber Orange', hex: '#ea580c', image: '/images/bag-orange.png' }
  ]
};

const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Ecotex Inc.',
  tagline: 'Certified Sustainable Wholesale Packaging Direct From Manufacturer',
  heroTitle: "It's time to pack better.",
  heroSubtitle: "Engineered non-woven, compostable bio-PLA, and insulated wholesale carrier bags for retail supermarkets, luxury boutiques, and global distributors.",
  heroButtonText: 'Shop Now',
  announcement: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
  announcementActive: true,
  phone: '(951) 555-ECOTEX',
  secondaryPhone: '+1 (951) 450-9773',
  whatsappNumber: '+1 (951) 450-9773',
  email: 'orders@ecotexinc.com',
  supportEmail: 'orders@ecotexinc.com',
  facilityAddress: '1200 Industrial Parkway, Corona, CA 92881',
  plantAddress: 'Sector 15, Korangi Industrial Area, Karachi, PK',
  minOrderNotice: 'Free pallet freight on continental US orders over $1,000',
  leadTimeBlank: '2-4 Business Days',
  leadTimeCustom: '10-14 Business Days',
  aboutTitle: 'Engineered For Durability. Designed For Circularity.',
  aboutMission: 'Empowering commercial enterprises and supermarket chains with certified non-woven and compostable packaging that drastically reduces carbon footprints without sacrificing load capacity.',
  aboutStory: 'Founded with a dedication to manufacturing excellence, Ecotex operates state-of-the-art ultrasonic welding and automated flexographic printing facilities in California and Karachi.',
  footerTagline: 'One stop solution for your enterprise packaging needs.',
  copyrightNotice: 'Copyright 2026 © Ecotex Inc. All rights reserved.',
  esgMetrics: {
    plasticDisplaced: '50M+',
    carbonReduction: '-84%',
    reusableTrips: '125+',
    recyclablePercent: '100%'
  },
  logoConfig: {
    wordmarkPrefix: 'ECO',
    wordmarkSuffix: 'TEX',
    badgeText: 'INC.',
    subtitle: 'Sustainable Packaging',
    customLogoUrl: '/uploads/ECOTEXINCONESTOPSOLUTIONFORYOU-1791441249049-s4409.png',
    faviconUrl: '/uploads/ECOTEXINCONESTOPSOLUTIONFORYOU-1791441249049-s4409.png'
  },
  navbarConfig: {
    announcementText: '🌱 Certified Recycled & Compostable Wholesale Packaging · Direct from Corona, CA Facility',
    announcementActive: true,
    ctaButtonText: 'START SHOP',
    phoneDisplay: '(951) 555-ECOTEX'
  },
  orderNotifications: {
    emailEnabled: true,
    notificationEmail: 'orders@ecotexinc.com',
    whatsappEnabled: true,
    whatsappNumber: '+1 (951) 450-9773',
    whatsappGreeting: 'New Wholesale Order Received on EcoTex Storefront',
    autoOpenWhatsapp: true
  },
  versatilityConfig: {
    sustainableFashionTitle: 'Sustainable Fashion For A Greener Tomorrow',
    sustainableFashionSubtitle: 'Discover our eco-friendly bags made from sustainable materials. Join the movement to reduce environmental impact without compromising style!',
    featureCards: [
      { id: 'vc1', title: 'Eco-Friendly', description: 'Non-woven polypropylene bags are considered eco-friendly because they are reusable and can replace single-use plastic bags.' },
      { id: 'vc2', title: 'Durable', description: 'These bags are known for their strength and durability. They can withstand multiple uses and are capable of carrying heavy loads.' },
      { id: 'vc3', title: 'Customizable', description: 'Non-woven polypropylene bags can be easily customized with various designs, colors, and logos, making them a popular choice.' },
      { id: 'vc4', title: 'Breathable', description: 'The fabric structure allows air circulation, making it ideal for retail garments, food produce, and everyday merchandise.' }
    ],
    bannerTitle: 'Exploring The Versatility of Non-Woven PP Bags',
    bannerSubtitle: 'Dive deeper into the various styles, sizes, and designs available in non-woven polypropylene bags.',
    bannerButtonText: 'View Collection',
    bannerImage: '/images/versatility-banner-bg.jpg',
    bottomTrustBadges: [
      'Fast Turnaround Times',
      'A friendly, open and honest service',
      'Ethical and Fairly Traded Products',
      'Expert Customer Service'
    ]
  },
  sustainabilityConfig: {
    metrics: {
      plasticDisplaced: '50M+',
      carbonReduction: '-84%',
      reusableTrips: '125+',
      recyclablePercent: '100%'
    },
    circularSteps: [
      { step: '01', title: 'Responsible Material Sourcing', desc: 'Utilizing certified post-industrial virgin PP regrind, non-GMO corn-derived PLA resins, and reclaimed apparel cut-offs.' },
      { step: '02', title: 'Ultrasonic Zero-Solvent Welding', desc: 'Sonic molecular excitation bonds fabric panels with unbreakable tensile strength without toxic glues or volatile emissions.' },
      { step: '03', title: 'Extended Multi-Year Lifecycle', desc: 'Engineered to withstand 125+ heavy shopping cycles, each tote displaces hundreds of single-use polybags from city landfills.' },
      { step: '04', title: 'Pure Mechanical & Biological Recovery', desc: '100% pelletized back into polymer pellets at end-of-life, while our bio line returns to soil biomass within 90-180 days.' }
    ]
  },
  aboutConfig: {
    heroTitle: 'About Us',
    heroSubtitle: 'A sustainable future for packaging. Engineered with purpose, manufactured for impact.',
    missionQuote: 'We engineered our circular manufacturing framework around a simple premise: commercial packaging can protect goods and elevate brands without ever polluting our natural world.',
    storyParagraph1: 'Founded to combat the global crisis of single-use plastic waste, Ecotex Inc. operates as a vertically integrated packaging manufacturer. We specialize in high-tensile reusable non-woven polypropylene totes, certified compostable cornstarch blends, and reclaimed post-industrial cotton wiping textiles.',
    storyParagraph2: 'From our corporate headquarters in California to state-of-the-art automated manufacturing facilities, every product is subjected to rigorous tensile testing, automated ultrasonic seam welding, and non-toxic water-based printing. We empower grocery retailers, boutique lifestyle brands, and logistics operations across the globe to achieve zero-waste compliance with full chain-of-custody audit trails.',
    whyChooseUsTitle: 'Why Choose Us',
    whyChooseUsSubtitle: 'We combine German ultrasonic welding machinery, ISO 9001 certified batch audits, and non-toxic soy formulations to deliver high-capacity packaging engineered to outlast disposable plastic.',
    whyChooseUsFeatures: [
      { title: '100% Recyclable Fabrics', description: 'Manufactured with virgin and pre-consumer polypropylene, lab-certified for 125+ reuse cycles.' },
      { title: 'Easy to Customize', description: 'Flexible sizing, ultrasonic handle sealing, custom gusset depths, and pantone-matched dyed fabrics.' },
      { title: '24/7 B2B Global Support', description: 'Dedicated enterprise account directors for national retail chains, grocers, and FMCG brands.' },
      { title: 'Free Sample Verification', description: 'Physical pre-production specimen kits dispatched within 48 hours for tensile testing and color sign-off.' },
      { title: 'High-Definition Flexo Print', description: 'Zero-VOC soy and water-based ink flexography delivering photo-sharp photographic brand imprints.' },
      { title: 'Rapid Turnaround Times', description: 'Immediate dispatch for unbranded warehouse inventory and accelerated 10-14 day custom printed delivery.' }
    ],
    teamMembers: [
      {
        id: 'tm1',
        name: 'Rashid Mahmood',
        role: 'Managing Director & Founder',
        bio: 'Pioneered circular non-woven manufacturing across North America and South Asia with over two decades in sustainable polymer engineering.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85',
        email: 'rashid@ecotexinc.com',
        linkedin: '#'
      },
      {
        id: 'tm2',
        name: 'Farah Al-Sayed',
        role: 'Head of Quality & Materials Engineering',
        bio: 'Leads our ASTM D6400 biodegradable testing laboratories and Global Recycled Standard (GRS) chain-of-custody compliance.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
        email: 'farah@ecotexinc.com',
        linkedin: '#'
      },
      {
        id: 'tm3',
        name: 'Marcus Vance',
        role: 'Chief Sustainability Officer',
        bio: 'Oversees enterprise carbon reduction accounting and California SB 270 / SB 54 regulatory packaging compliance.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85',
        email: 'marcus@ecotexinc.com',
        linkedin: '#'
      }
    ]
  },
  facilitiesConfig: {
    title: 'State-of-the-Art Manufacturing & Fulfillment Facilities',
    subtitle: 'Dual-continental operations combining California wholesale fulfillment with high-speed automated manufacturing mills.',
    storySnippet: 'From automated ultrasonic welding to high-definition 8-color flexographic printing, our facilities are engineered for maximum circularity and zero-landfill compliance.',
    annualCapacity: '50,000,000+ Units / Year',
    certificationsMetric: 'ISO 9001:2015 & ASTM D6400',
    activeLinesMetric: '14 High-Speed Extrusion Lines',
    showOnHomepage: true,
    bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85',
    hubs: [
      {
        name: 'Corona Distribution & Testing Hub',
        tag: 'US Headquarters & Fulfillment',
        address: '1200 Industrial Parkway, Corona, CA 92881',
        capabilities: ['Same-Day Pallet Dispatch', 'ASTM Tensile Testing Lab', 'Custom Sample Prototyping'],
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        googleMapsUrl: 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881'
      },
      {
        name: 'Primary Manufacturing Plant',
        tag: 'Heavy Industrial Production',
        address: 'Sector 15, Korangi Industrial Area, Karachi, PK',
        capabilities: ['Automated Ultrasonic Welding', '8-Color Flexographic Printing', 'Virgin PP & Bio-PLA Extrusion'],
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
        googleMapsUrl: 'https://maps.google.com/?q=Korangi+Industrial+Area+Karachi'
      }
    ]
  },
  contactConfig: {
    headline: 'Let’s Engineer Your Sustainable Wholesale Packaging Solution',
    email: 'orders@ecotexinc.com',
    phone: '(951) 555-ECOTEX',
    secondaryPhone: '+1 (951) 450-9773',
    facilityAddress: '1200 Industrial Parkway, Corona, CA 92881',
    plantAddress: 'Sector 15, Korangi Industrial Area, Karachi, PK',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    twitterUrl: 'https://twitter.com',
    linkedinUrl: 'https://linkedin.com',
    googleMapsUrl: 'https://maps.google.com/?q=1200+Industrial+Parkway,+Corona,+CA+92881',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=1200%20Industrial%20Parkway%2C%20Corona%2C%20CA%2092881&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  shippingConfig: {
    freeShippingThreshold: 1000,
    standardShippingRate: 50,
    expressShippingRate: 120,
    estimatedTransitDays: '3-5 Business Days (Continental US)',
    freightCarrier: 'Direct LTL Pallet Freight (FedEx Freight / R+L Carriers / Old Dominion)',
    shippingPolicyNotice: 'All wholesale pallet orders ship FOB Corona, CA warehouse. Shrink-wrapped with corner guards on 40x48 heat-treated pallets.',
    warehouseHub: 'Corona Distribution & Fulfillment Center, 1200 Industrial Parkway, Corona, CA 92881',
    localPickupAvailable: true,
    sampleDispatchNotice: 'Free fabric swatches & physical sample bags dispatched within 24 hours via USPS Priority Mail.'
  },
  footerConfig: {
    newsletterTitle: 'Subscribe To Our Quarterly Newsletter',
    newsletterSubtitle: 'Receive direct mill pricing updates, material innovation whitepapers, and California SB 54 regulatory packaging briefs.',
    newsletterBgImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
    newsletterBtnText: 'Subscribe',
    newsletterActive: true,
    tagline: 'Direct manufacturer of certified circular non-woven, compostable bio-PLA, and insulated wholesale packaging for global commercial enterprise.',
    copyrightNotice: 'Copyright 2026 © Ecotex Inc. All rights reserved.',
    col1Title: 'ECOTEX',
    col2Title: 'SERVICES',
    col3Title: 'EVENTS',
    socialTwitter: 'https://twitter.com',
    socialFacebook: 'https://facebook.com',
    socialLinkedin: 'https://linkedin.com',
    socialInstagram: 'https://instagram.com',
    socialYoutube: 'https://youtube.com',
    termsNotice: 'TERMS & CONDITIONS',
    privacyNotice: 'PRIVACY POLICY',
    sitemapNotice: 'SITEMAP'
  },
  currencySymbol: '$',
  currencyCode: 'USD',
  taxRatePercent: 0,
  taxExemptionNotice: 'Valid California resale certificate required at checkout for wholesale sales tax exemption.',
  guaranteeNotice: '100% Quality & Defect Replacement Guarantee within 30 days of shipment receipt.',
  sampleKitPolicy: 'Complimentary fabric swatch ring and sample bags available for enterprise retail procurement.',
  quoteCalcConfig: {
    plateFee: 120,
    freeFreightThreshold: 1000,
    leadTimeBlank: '2-4 Business Days',
    leadTimeCustom: '10-14 Business Days'
  },
  shopConfig: {
    catalogTitle: 'Wholesale Catalog & Mill Collections',
    catalogSubtitle: 'Explore our full manufacturing catalog of certified eco-friendly industrial & retail packaging with wholesale pricing tiers.',
    showHeroBanner: true,
    heroBannerBadge: 'LIMITED TIME ONLY',
    heroBannerTitle: "Shop More,\nSave More!",
    heroBannerSubtitle: 'Discover amazing deals on your favorite sustainable products & eco-friendly essentials.',
    heroBannerBtnText: 'EXPLORE COLLECTION',
    heroBannerImage: '/images/shop-hero-podium.jpg',
    heroBannerDiscountBadge: 'UP TO 50% OFF',
    valueProp1Title: 'Best Prices',
    valueProp1Subtitle: 'Guaranteed',
    valueProp2Title: 'Secure',
    valueProp2Subtitle: 'Payments',
    valueProp3Title: 'Fast Delivery',
    valueProp3Subtitle: 'Worldwide',
    trustBar1Title: 'Free Shipping',
    trustBar1Subtitle: 'On orders over $75',
    trustBar2Title: 'Easy Returns',
    trustBar2Subtitle: '30-day returns',
    trustBar3Title: 'Premium Quality',
    trustBar3Subtitle: '100% original products',
    trustBar4Title: '24/7 Support',
    trustBar4Subtitle: "We're here to help",
    catalogSubtitle: 'Explore our full manufacturing catalog of certified eco-friendly industrial & retail packaging with wholesale pricing tiers.',
    testimonials: [
      {
        id: 'rev1',
        quote: "Switching our 42 regional grocery locations to Ecotex loop bags cut packaging overhead by 28% while exceeding state single-use mandates.",
        author: "Elena Vasquez",
        role: "VP Supply Chain",
        company: "SunWest Markets California",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: 'rev2',
        quote: "The custom gold flexo printing on their black matte totes gave our boutique clients an unmistakable luxury feel that shoppers reuse every single day.",
        author: "Marcus Vance",
        role: "Creative Director",
        company: "Artisan Living Brands NY",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: 'rev3',
        quote: "Flawless batch consistency across 150,000 custom printed units. Not a single torn handle during holiday freight distribution. Exceptional manufacturer.",
        author: "Sarah Lindqvist",
        role: "Head of Procurement",
        company: "Nordic Lifestyle Group",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: 'rev4',
        quote: "The heat-sealed seams hold up to 35 lbs without tearing. Their compostable PLA bags passed all our environmental compliance audits effortlessly.",
        author: "David Chen",
        role: "Global Logistics Director",
        company: "EcoWare Seattle",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: 'rev5',
        quote: "From artwork proofs to ocean freight delivery in 18 days flat. Ecotex's turnaround speed and volume wholesale pricing are unmatched in the US market.",
        author: "Amara Okafor",
        role: "Operations Lead",
        company: "BioRetail International",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
      },
      {
        id: 'rev6',
        quote: "Our retail stores have eliminated single-use bags entirely. Our shoppers love the durable aesthetic and often return just to buy extra totes.",
        author: "Julian Reynolds",
        role: "VP Merchandising",
        company: "Pacific Organic Grocers",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
      }
    ]
  },
  dealConfig: {
    enabled: true,
    productId: '',
    badge: 'ECO CHOICE',
    title: "Grab It Before\nIt's Gone!",
    subtitle: 'Commercial Wholesale Series',
    buttonText: 'SHOP THE DEAL',
    offerPrice: 0.25,
    originalPrice: 0.36,
    stockText: 'Ready for Immediate Dispatch',
    stockProgressPercent: 78,
    timerHours: 8,
    timerMinutes: 12,
    timerSeconds: 45
  }
};

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Collections', subtitle: 'Complete Catalog', tag: '64 STYLES', count: '64 Models', image: '/images/bag-green.png', description: 'Explore our full manufacturing catalog of certified eco-friendly industrial & retail packaging.', size: 'Custom Sizes', gsm: '40 - 140 GSM' },
  { id: 't-shirt', label: 'T-Shirt Bags', subtitle: 'High-Volume Retail', tag: 'REUSABLE', count: '12 Models', image: '/images/bag-green.png', description: 'High-tensile vest-handle grocery & supermarket bags engineered for high load bearing.', size: '11.5" x 21"', gsm: '45 GSM' },
  { id: 'non-woven', label: 'Non-Woven Totes', subtitle: 'Heavy Duty Reusable', tag: 'BESTSELLER', count: '24 Models', image: '/images/bag-green.png', description: 'Virgin & recycled polypropylene totes with ultrasonic welded seams.', size: '12" x 15"', gsm: '80 GSM' },
  { id: 'laminated', label: 'Laminated Carriers', subtitle: 'Waterproof Full-Color', tag: 'HIGH TENSILE', count: '16 Models', image: '/images/bag-blue.png', description: 'Glossy and matte laminated woven polypropylene with photorealistic gravure print.', size: '14" x 16"', gsm: '120 GSM' },
  { id: 'slider', label: 'Slider Zipper Bags', subtitle: 'Airtight Garment & Parts', tag: 'AIRTIGHT', count: '12 Models', image: '/images/bag-white.png', description: 'Smooth slide-lock closure bags for e-commerce apparel and food items.', size: '10" x 13"', gsm: '70 GSM' },
  { id: 'd-cut', label: 'D-Cut Punch Handle', subtitle: 'Boutique & Retail', tag: 'RETAIL READY', count: '18 Models', image: '/images/bag-orange.png', description: 'Reinforced die-cut oval handle carrier bags for fashion retail.', size: '12" x 15"', gsm: '55 GSM' },
  { id: 'biodegradable', label: 'Biodegradable PLA', subtitle: '100% Compostable', tag: 'ZERO PLASTIC', count: '8 Models', image: '/images/bite-hero-product.png', description: 'Certified ASTM D6400 compostable plant-starch packaging.', size: '12" x 15"', gsm: '55 GSM' }
];

const INITIAL_MEDIA: MediaAsset[] = [
  { id: 'm1', name: 'Bite Hero Jar Product', url: '/images/bite-hero-product.png', size: '1.2 MB', type: 'image/png', date: '2026-10-02' },
  { id: 'm2', name: 'Ecotex Leaf Green Bag', url: '/images/bag-green.png', size: '616 KB', type: 'image/png', date: '2026-10-02' },
  { id: 'm3', name: 'Ecotex Pure White Bag', url: '/images/bag-white.png', size: '574 KB', type: 'image/png', date: '2026-10-02' },
  { id: 'm4', name: 'Ecotex Luxury Black Bag', url: '/images/bag-black.png', size: '609 KB', type: 'image/png', date: '2026-10-02' },
  { id: 'm5', name: 'Ecotex Cobalt Blue Bag', url: '/images/bag-blue.png', size: '624 KB', type: 'image/png', date: '2026-10-02' },
  { id: 'm6', name: 'Ecotex Bio Orange Bag', url: '/images/bag-orange.png', size: '766 KB', type: 'image/png', date: '2026-10-02' },
  { id: 'm7', name: 'Versatility Banner Facility Photo', url: '/images/versatility-banner-bg.jpg', size: '691 KB', type: 'image/jpeg', date: '2026-10-02' }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@wholesalegrocers.com',
    customerCompany: 'Pacific Coast Supermarkets LLC',
    status: 'In Production',
    paymentTerms: 'Net 30 Wholesale',
    subtotal: 3500.00,
    shipping: 0.00,
    total: 3500.00,
    date: '2026-10-01',
    items: [
      { productName: 'The Ecotex Heavy-Duty Grocery Tote', quantity: 15000, price: 0.22, color: '#4E9F76' }
    ]
  },
  {
    id: 'ORD-9818',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@botanicorganics.co',
    customerCompany: 'Botanic Organics Boutique',
    status: 'Completed',
    paymentTerms: 'Credit Card (Prepaid)',
    subtotal: 920.00,
    shipping: 45.00,
    total: 965.00,
    date: '2026-09-28',
    items: [
      { productName: 'Boutique Die-Cut Retail Tote', quantity: 4000, price: 0.23, color: '#86C59E' }
    ]
  }
];

const INITIAL_QUOTES: QuoteSubmission[] = [
  {
    id: 'RFQ-5021',
    name: 'David Sterling',
    company: 'Sterling Apparel Brands Inc.',
    email: 'procurement@sterlingapparel.com',
    phone: '(415) 890-2144',
    category: 'slider',
    volume: '25,000 - 50,000 pcs',
    printing: '2-Color Custom Branding',
    message: 'Seeking custom branded frosted slider zipper bags with vented hole for spring catalog distribution.',
    status: 'New',
    date: '2026-10-02'
  },
  {
    id: 'RFQ-5019',
    name: 'Sarah Jenkins',
    company: 'Natural Harvest Co-Op',
    email: 'sjenkins@naturalharvest.org',
    phone: '(503) 712-9901',
    category: 'non-woven',
    volume: '10,000 pcs',
    printing: '1-Color Silkscreen',
    message: 'Need certified GRS non-woven grocery bags delivered to our Portland regional warehouse.',
    status: 'Quotation Sent',
    date: '2026-09-30'
  }
];

// Helper to load from localStorage
const loadLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`ecotex_${key}`);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch {
    return fallback;
  }
};

// Helper to get admin Bearer token headers for protected API requests
const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('ecotex_admin_token') || sessionStorage.getItem('ecotex_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to save to localStorage
const saveLocal = (key: string, val: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ecotex_${key}`, JSON.stringify(val));
  } catch (err) {
    console.warn(`LocalStorage write skipped for ecotex_${key}:`, err);
  }
};

export const useStore = create<StoreState>((set, get) => ({
  // Loaded State
  products: loadLocal('products', PRODUCTS),
  categories: loadLocal('categories', INITIAL_CATEGORIES),
  heroConfig: (() => {
    const loaded = loadLocal<HeroConfig>('hero_config', INITIAL_HERO_CONFIG);
    const resolvedBg = (loaded && loaded.backgroundImage === 'none')
      ? 'none'
      : (loaded && loaded.backgroundImage ? loaded.backgroundImage : INITIAL_HERO_CONFIG.backgroundImage);
    return {
      ...INITIAL_HERO_CONFIG,
      ...loaded,
      backgroundImage: resolvedBg
    };
  })(),
  siteSettings: loadLocal('site_settings', INITIAL_SETTINGS),
  siteImages: loadLocal('site_images', {
    heroBag: '/images/bite-hero-product.png',
    facilityPhoto: '/images/versatility-banner-bg.jpg',
    shopBanner: '/images/bag-green.png',
    aboutHero: '/images/versatility-banner-bg.jpg'
  }),
  mediaLibrary: loadLocal('media_library', INITIAL_MEDIA),
  orders: loadLocal('orders', INITIAL_ORDERS),
  quotes: loadLocal('quotes', INITIAL_QUOTES),

  // Cart State
  cart: loadLocal('cart', [
    {
      id: 'initial-sample-1',
      product: PRODUCTS[0],
      quantity: 25,
      selectedColor: '#4E9F76',
      unitPrice: 0.22
    }
  ]),
  isCartOpen: false,

  setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),

  addToCart: (product: Product, selectedColor: string, quantity: number, orderType?: 'retail' | 'wholesale') => {
    // Guard: Out of stock check - visible on storefront but cannot be purchased
    const isOutOfStock = product.inStock === false || (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
    if (isOutOfStock) {
      alert(`"${product.name}" is currently out of stock and cannot be added to cart.`);
      return;
    }

    const availableStock = typeof product.stockQuantity === 'number' ? product.stockQuantity : (product.inStock !== false ? 50 : 0);
    const determinedOrderType: 'retail' | 'wholesale' = orderType || (quantity > 5 ? 'wholesale' : 'retail');
    const isRetail = determinedOrderType === 'retail';
    const maxAllowed = isRetail ? Math.min(5, availableStock) : availableStock;
    const clampedQty = Math.max(1, Math.min(quantity, maxAllowed));

    // Pricing calculation
    let unitPrice = isRetail
      ? (product.pricePerUnit ? product.pricePerUnit * 1.45 : 0.45)
      : (product.pricePerUnit || 0.25);

    if (!isRetail && product.volumeTiers && product.volumeTiers.length > 0) {
      for (const tier of product.volumeTiers) {
        if (clampedQty >= tier.minQty) {
          unitPrice = tier.price;
        }
      }
    }

    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.product.id === product.id && 
                  item.selectedColor === selectedColor && 
                  (item.orderType || (item.quantity > 5 ? 'wholesale' : 'retail')) === determinedOrderType
      );

      let updatedCart: CartItem[];
      if (existingIndex > -1) {
        updatedCart = state.cart.map((item, index) => {
          if (index === existingIndex) {
            let newQty = item.quantity + clampedQty;
            if (newQty > maxAllowed) {
              newQty = maxAllowed;
            }
            let updatedPrice = unitPrice;
            if (!isRetail && product.volumeTiers) {
              for (const tier of product.volumeTiers) {
                if (newQty >= tier.minQty) updatedPrice = tier.price;
              }
            }
            return { ...item, quantity: newQty, unitPrice: updatedPrice, orderType: determinedOrderType };
          }
          return item;
        });
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${selectedColor}-${determinedOrderType}-${Date.now()}`,
          product,
          quantity: clampedQty,
          selectedColor,
          unitPrice,
          orderType: determinedOrderType
        };
        updatedCart = [...state.cart, newItem];
      }

      saveLocal('cart', updatedCart);
      return { cart: updatedCart, isCartOpen: true };
    });
  },

  updateCartQuantity: (itemId: string, delta: number) => {
    set((state) => {
      const updatedCart = state.cart
        .map((item) => {
          if (item.id === itemId) {
            let newQty = item.quantity + delta;
            if (newQty <= 0) return null;

            const availableStock = typeof item.product.stockQuantity === 'number' ? item.product.stockQuantity : (item.product.inStock !== false ? 50 : 0);
            const isRetail = item.orderType === 'retail' || (!item.orderType && item.quantity <= 5);
            const maxAllowed = isRetail ? Math.min(5, availableStock) : availableStock;
            if (newQty > maxAllowed) {
              newQty = maxAllowed;
            }

            // Recalculate tier
            let unitPrice = item.product.pricePerUnit;
            if (item.product.volumeTiers) {
              for (const tier of item.product.volumeTiers) {
                if (newQty >= tier.minQty) unitPrice = tier.price;
              }
            }
            return { ...item, quantity: newQty, unitPrice };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      saveLocal('cart', updatedCart);
      return { cart: updatedCart };
    });
  },

  removeFromCart: (itemId: string) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== itemId);
      saveLocal('cart', updatedCart);
      return { cart: updatedCart };
    });
  },

  clearCart: () => {
    saveLocal('cart', []);
    set({ cart: [] });
  },

  getCartSubtotal: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getCartItemCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Auth & Route Protection
  isAuthenticated: typeof window !== 'undefined' ? Boolean(localStorage.getItem('ecotex_admin_token') || sessionStorage.getItem('ecotex_admin_token')) : false,
  adminUser: typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('ecotex_admin_user') || sessionStorage.getItem('ecotex_admin_user') || 'null')) : null,
  adminToken: typeof window !== 'undefined' ? (localStorage.getItem('ecotex_admin_token') || sessionStorage.getItem('ecotex_admin_token')) : null,

  login: async (email: string, password: string, rememberMe = true) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanEmail, password: cleanPass })
      });

      if (res.ok) {
        const data = await res.json();
        const user = { name: data.user?.name || 'Executive Director', email: data.user?.email || cleanEmail, role: data.user?.role || 'Super Admin' };
        const token = data.token;

        if (typeof window !== 'undefined') {
          if (rememberMe) {
            localStorage.setItem('ecotex_admin_token', token);
            localStorage.setItem('ecotex_admin_user', JSON.stringify(user));
          } else {
            sessionStorage.setItem('ecotex_admin_token', token);
            sessionStorage.setItem('ecotex_admin_user', JSON.stringify(user));
          }
        }

        set({ isAuthenticated: true, adminToken: token, adminUser: user });
        return { success: true };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || errorData.error || 'Access Denied: Invalid administrator credentials.'
        };
      }
    } catch (networkErr) {
      return { success: false, error: 'Cannot connect to authentication server. Please check your connection.' };
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecotex_admin_token');
      localStorage.removeItem('ecotex_admin_user');
      sessionStorage.removeItem('ecotex_admin_token');
      sessionStorage.removeItem('ecotex_admin_user');
    }
    set({ isAuthenticated: false, adminToken: null, adminUser: null });
  },

  checkAuth: () => {
    const { isAuthenticated, adminToken } = get();
    if (!isAuthenticated || !adminToken) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ecotex_admin_token') || sessionStorage.getItem('ecotex_admin_token');
        if (token) {
          const user = JSON.parse(localStorage.getItem('ecotex_admin_user') || sessionStorage.getItem('ecotex_admin_user') || 'null');
          set({ isAuthenticated: true, adminToken: token, adminUser: user });
          return true;
        }
      }
      return false;
    }
    return true;
  },

  // Dynamic CMS Updates
  updateHeroConfig: (updates: Partial<HeroConfig>) => {
    set((state) => {
      const newConfig = { ...state.heroConfig, ...updates };
      saveLocal('hero_config', newConfig);
      // Sync with server if online
      fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ heroConfig: newConfig })
      }).catch(() => {});
      return { heroConfig: newConfig };
    });
  },

  // Live Server Data Synchronization
  fetchSettings: async () => {
    try {
      const serverSettings = await apiService.getSettings();
      if (serverSettings && typeof serverSettings === 'object' && Object.keys(serverSettings).length > 0) {
        set((state) => {
          const merged = { ...state.siteSettings, ...serverSettings };
          saveLocal('site_settings', merged);
          let updatedHero = { ...state.heroConfig };
          if (serverSettings.heroConfig) {
            updatedHero = { ...updatedHero, ...serverSettings.heroConfig };
          }
          if (serverSettings.heroTitle) {
            updatedHero.title = serverSettings.heroTitle;
          }
          if (serverSettings.heroSubtitle) {
            updatedHero.subtitle = serverSettings.heroSubtitle;
          }
          if (serverSettings.heroButtonText) {
            updatedHero.ctaText = serverSettings.heroButtonText;
          }
          if (serverSettings.heroBackgroundImage) {
            updatedHero.backgroundImage = serverSettings.heroBackgroundImage;
          }
          saveLocal('hero_config', updatedHero);
          return { siteSettings: merged, heroConfig: updatedHero };
        });
        return serverSettings;
      }
    } catch (err) {
      console.warn('Could not fetch server settings:', err);
    }
    return null;
  },

  fetchAllData: async () => {
    try {
      const [settingsRes, prodRes, catRes, ordsRes, qtsRes, statsRes, msgsRes] = await Promise.allSettled([
        apiService.getSettings(),
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getOrders(),
        apiService.getQuotes(),
        apiService.getStats(),
        apiService.getMessages(),
      ]);

      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        const serverSettings = settingsRes.value;
        if (serverSettings && typeof serverSettings === 'object' && Object.keys(serverSettings).length > 0) {
          set((state) => {
            const merged = { ...state.siteSettings, ...serverSettings };
            saveLocal('site_settings', merged);
            let updatedHero = { ...state.heroConfig };
            if (serverSettings.heroConfig) {
              updatedHero = { ...updatedHero, ...serverSettings.heroConfig };
            }
            if (serverSettings.heroTitle) {
              updatedHero.title = serverSettings.heroTitle;
            }
            if (serverSettings.heroSubtitle) {
              updatedHero.subtitle = serverSettings.heroSubtitle;
            }
            if (serverSettings.heroButtonText) {
              updatedHero.ctaText = serverSettings.heroButtonText;
            }
            if (serverSettings.heroBackgroundImage) {
              updatedHero.backgroundImage = serverSettings.heroBackgroundImage;
            }
            saveLocal('hero_config', updatedHero);

            let updatedImages = { ...state.siteImages };
            if (serverSettings.siteImages) {
              updatedImages = { ...updatedImages, ...serverSettings.siteImages };
              saveLocal('site_images', updatedImages);
            }
            return { siteSettings: merged, heroConfig: updatedHero, siteImages: updatedImages };
          });
        }
      }

      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value) && prodRes.value.length > 0) {
        set({ products: prodRes.value });
        saveLocal('products', prodRes.value);
      }

      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value) && catRes.value.length > 0) {
        set({ categories: catRes.value });
        saveLocal('categories', catRes.value);
      }

      if (ordsRes.status === 'fulfilled' && Array.isArray(ordsRes.value) && ordsRes.value.length > 0) {
        const serverOrders = [...ordsRes.value];
        set((state) => {
          const map = new Map<string, any>();
          serverOrders.forEach((o: any) => { if (o && o.id) map.set(o.id, o); });
          state.orders.forEach((o: any) => {
            if (o && o.id && !map.has(o.id)) {
              map.set(o.id, o);
            }
          });
          const mergedOrders = Array.from(map.values()) as Order[];
          mergedOrders.sort((a: any, b: any) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
          const grossRev = mergedOrders.reduce((sum, o) => sum + (Number(o.total || o.totalAmount) || 0), 0);
          saveLocal('orders', mergedOrders);
          return {
            orders: mergedOrders,
            analytics: {
              ...state.analytics,
              totalOrdersCount: mergedOrders.length,
              grossRevenue: grossRev > 0 ? grossRev : state.analytics.grossRevenue,
            }
          };
        });
      }

      if (qtsRes.status === 'fulfilled' && Array.isArray(qtsRes.value) && qtsRes.value.length > 0) {
        const serverQuotes = [...qtsRes.value];
        set((state) => {
          const map = new Map<string, any>();
          serverQuotes.forEach((q: any) => { if (q && q.id) map.set(q.id, q); });
          state.quotes.forEach((q: any) => {
            if (q && q.id && !map.has(q.id)) {
              map.set(q.id, q);
            }
          });
          const mergedQuotes = Array.from(map.values()) as QuoteSubmission[];
          mergedQuotes.sort((a: any, b: any) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
          saveLocal('quotes', mergedQuotes);
          return {
            quotes: mergedQuotes,
            analytics: {
              ...state.analytics,
              quoteRequestsCount: mergedQuotes.length,
            }
          };
        });
      }

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        const s = statsRes.value;
        set((state) => ({
          analytics: {
            ...state.analytics,
            totalOrdersCount: typeof s.totalOrders === 'number' ? s.totalOrders : state.analytics.totalOrdersCount,
            grossRevenue: typeof s.grossRevenue === 'number' ? s.grossRevenue : state.analytics.grossRevenue,
            quoteRequestsCount: typeof s.totalQuotes === 'number' ? s.totalQuotes : state.analytics.quoteRequestsCount,
            bagsDisplaced: typeof s.bagsDisplacedEstimate === 'number' ? s.bagsDisplacedEstimate : state.analytics.bagsDisplaced,
          }
        }));
      }

      if (msgsRes.status === 'fulfilled' && Array.isArray(msgsRes.value) && msgsRes.value.length > 0) {
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('ecotex_customer_messages_v1');
            const local = raw ? JSON.parse(raw) : [];
            const map = new Map();
            if (Array.isArray(local)) local.forEach((t: any) => map.set(t.id, t));
            msgsRes.value.forEach((t: any) => map.set(t.id, t));
            const merged = Array.from(map.values());
            localStorage.setItem('ecotex_customer_messages_v1', JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('ecotex_messages_updated', { detail: merged }));
          } catch (_) {}
        }
      }
    } catch (err) {
      console.warn('Failed to sync live data from server:', err);
    }
  },

  updateSiteSettings: (updates: Partial<SiteSettings>) => {
    set((state) => {
      const newSettings = { ...state.siteSettings, ...updates };
      saveLocal('site_settings', newSettings);
      fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newSettings)
      }).catch((err) => {
        console.warn('Failed to persist settings to API:', err);
      });
      return { siteSettings: newSettings };
    });
  },

  updateSiteImage: (key: string, url: string) => {
    set((state) => {
      const updatedImages = { ...state.siteImages, [key]: url };
      saveLocal('site_images', updatedImages);
      fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ siteImages: updatedImages })
      }).catch(() => {});
      return { siteImages: updatedImages };
    });
  },

  // Product CRUD
  addProduct: (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`
    };
    set((state) => {
      const updated = [newProduct, ...state.products];
      saveLocal('products', updated);
      fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newProduct)
      }).catch(() => {});
      return { products: updated };
    });
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    set((state) => {
      const updated = state.products.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updates };
        if (updates.stockQuantity !== undefined) {
          if (updates.stockQuantity <= 0) {
            merged.inStock = false;
            merged.stockQuantity = 0;
          } else if (updates.inStock === undefined) {
            merged.inStock = true;
          }
        }
        return merged;
      });
      saveLocal('products', updated);
      fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updates)
      }).catch(() => {});
      return { products: updated };
    });
  },

  deleteProduct: (id: string) => {
    set((state) => {
      const updated = state.products.filter((p) => p.id !== id);
      saveLocal('products', updated);
      fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).catch(() => {});
      return { products: updated };
    });
  },

  toggleProductStock: (id: string) => {
    set((state) => {
      const updated = state.products.map((p) => {
        if (p.id !== id) return p;
        const willBeInStock = !p.inStock;
        const newStockQty = willBeInStock ? ((typeof p.stockQuantity === 'number' && p.stockQuantity > 0) ? p.stockQuantity : 50) : 0;
        return {
          ...p,
          inStock: willBeInStock,
          stockQuantity: newStockQty
        };
      });
      saveLocal('products', updated);
      fetch(`${BASE_URL}/products/${id}/toggle-stock`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders() },
      }).catch(() => {});
      return { products: updated };
    });
  },

  // Categories CRUD
  addCategory: (categoryData: Partial<CategoryItem> & { label: string }) => {
    const slug = (categoryData.id || categoryData.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;
    const newCat: CategoryItem = {
      id: slug,
      label: categoryData.label,
      subtitle: categoryData.subtitle || 'Wholesale Packaging Line',
      tag: categoryData.tag || 'NEW',
      count: categoryData.count || '0 Models',
      image: categoryData.image || '/images/bag-green.png',
      description: categoryData.description || `High-tensile ${categoryData.label.toLowerCase()} packaging line.`
    };
    set((state) => {
      const updated = [...state.categories, newCat];
      saveLocal('categories', updated);
      fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newCat)
      }).catch(() => {});
      return { categories: updated };
    });
  },

  updateCategory: (id: string, updates: Partial<CategoryItem>) => {
    set((state) => {
      const updated = state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
      saveLocal('categories', updated);
      fetch(`${BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updates)
      }).catch(() => {});
      return { categories: updated };
    });
  },

  deleteCategory: (id: string) => {
    set((state) => {
      const updated = state.categories.filter((c) => c.id !== id);
      saveLocal('categories', updated);
      fetch(`${BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).catch(() => {});
      return { categories: updated };
    });
  },

  // Media Library
  addMediaAsset: (assetData: Omit<MediaAsset, 'id' | 'date'>) => {
    const newAsset: MediaAsset = {
      ...assetData,
      id: `media-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    set((state) => {
      const updated = [newAsset, ...state.mediaLibrary];
      saveLocal('media_library', updated);
      return { mediaLibrary: updated };
    });
  },

  deleteMediaAsset: (id: string) => {
    set((state) => {
      const updated = state.mediaLibrary.filter((m) => m.id !== id);
      saveLocal('media_library', updated);
      return { mediaLibrary: updated };
    });
  },

  // Orders & Quotes Fetching
  fetchOrders: async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        headers: { ...getAuthHeaders() },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          let mergedResult: Order[] = [];
          set((state) => {
            const map = new Map<string, any>();
            data.forEach((o: any) => { if (o && o.id) map.set(o.id, o); });
            state.orders.forEach((o: any) => {
              if (o && o.id && !map.has(o.id)) {
                map.set(o.id, o);
              }
            });
            const mergedOrders = Array.from(map.values()) as Order[];
            mergedOrders.sort((a: any, b: any) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
            mergedResult = mergedOrders;
            const grossRev = mergedOrders.reduce((sum, o) => sum + (Number(o.total || o.totalAmount) || 0), 0);
            saveLocal('orders', mergedOrders);
            return {
              orders: mergedOrders,
              analytics: {
                ...state.analytics,
                totalOrdersCount: mergedOrders.length,
                grossRevenue: grossRev > 0 ? grossRev : state.analytics.grossRevenue,
              }
            };
          });
          return mergedResult;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch orders from server:', err);
    }
    return get().orders;
  },

  fetchQuotes: async () => {
    try {
      const res = await fetch(`${BASE_URL}/quotes`, {
        headers: { ...getAuthHeaders() },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          let mergedResult: QuoteSubmission[] = [];
          set((state) => {
            const map = new Map<string, any>();
            data.forEach((q: any) => { if (q && q.id) map.set(q.id, q); });
            state.quotes.forEach((q: any) => {
              if (q && q.id && !map.has(q.id)) {
                map.set(q.id, q);
              }
            });
            const mergedQuotes = Array.from(map.values()) as QuoteSubmission[];
            mergedQuotes.sort((a: any, b: any) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
            mergedResult = mergedQuotes;
            saveLocal('quotes', mergedQuotes);
            return {
              quotes: mergedQuotes,
              analytics: {
                ...state.analytics,
                quoteRequestsCount: mergedQuotes.length,
              }
            };
          });
          return mergedResult;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch quotes from server:', err);
    }
    return get().quotes;
  },

  // Orders
  createOrder: async (orderData: Partial<Order>) => {
    const orderId = orderData.id || `ECX-${Math.floor(100000 + Math.random() * 900000)}`;
    const buyerName = orderData.buyerName || orderData.customerName || 'Commercial Buyer';
    const companyName = orderData.companyName || orderData.customerCompany || 'Wholesale Partner';
    const email = orderData.email || orderData.customerEmail || 'orders@client.com';
    const address = orderData.address || orderData.shippingAddress || '';
    const subtotal = Number(orderData.subtotal) || 0;
    const shipping = Number(orderData.shipping) || 0;
    const total = Number(orderData.total || orderData.totalAmount) || (subtotal + shipping);

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      buyerName,
      customerName: buyerName,
      companyName,
      customerCompany: companyName,
      email,
      customerEmail: email,
      address,
      shippingAddress: address,
      status: orderData.status || 'Pending',
      paymentTerms: orderData.paymentTerms || 'Credit Card / Instant ACH',
      subtotal,
      shipping,
      total,
      totalAmount: total,
      date: orderData.date || new Date().toISOString().split('T')[0],
      createdAt: (orderData as any).createdAt || new Date().toISOString(),
      items: orderData.items || []
    };

    set((state) => {
      const existingIdx = state.orders.findIndex(o => o.id === orderId);
      const updated = existingIdx >= 0 
        ? state.orders.map(o => o.id === orderId ? newOrder : o)
        : [newOrder, ...state.orders];
      saveLocal('orders', updated);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ecotex_order_placed', { detail: newOrder }));
        window.dispatchEvent(new CustomEvent('ecotex_orders_updated', { detail: updated }));
      }

      // Automatically deduct ordered stock from products inventory
      const updatedProducts = state.products.map((prod) => {
        const orderedItem = (newOrder.items || []).find(
          (it) => (it.productId || (it as any).id) === prod.id
        );
        if (orderedItem) {
          const currentStock = typeof prod.stockQuantity === 'number' ? prod.stockQuantity : (prod.inStock !== false ? 50 : 0);
          const orderedBoxes = Number(orderedItem.quantity) || 1;
          const newStock = Math.max(0, currentStock - orderedBoxes);
          return {
            ...prod,
            stockQuantity: newStock,
            inStock: newStock > 0
          };
        }
        return prod;
      });
      saveLocal('products', updatedProducts);

      return { 
        orders: updated,
        products: updatedProducts,
        analytics: {
          ...state.analytics,
          totalOrdersCount: updated.length,
          grossRevenue: state.analytics.grossRevenue + total
        }
      };
    });

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (res.ok) {
        const serverSaved = await res.json();
        set((state) => {
          const updated = state.orders.map(o => o.id === orderId ? { ...o, ...serverSaved } : o);
          saveLocal('orders', updated);
          return { orders: updated };
        });
        return serverSaved;
      }
    } catch (err) {
      console.warn('Network sync error creating order:', err);
    }
    return newOrder;
  },

  updateOrder: (id: string, updates: Partial<Order>) => {
    set((state) => {
      const updated = state.orders.map((o) => {
        if (o.id !== id) return o;
        const buyerName = updates.buyerName || updates.customerName || o.buyerName || o.customerName;
        const companyName = updates.companyName || updates.customerCompany || o.companyName || o.customerCompany;
        const email = updates.email || updates.customerEmail || o.email || o.customerEmail;
        const address = updates.address || updates.shippingAddress || o.address || o.shippingAddress;
        const merged = {
          ...o,
          ...updates,
          buyerName,
          customerName: buyerName,
          companyName,
          customerCompany: companyName,
          email,
          customerEmail: email,
          address,
          shippingAddress: address,
        };
        if (updates.items && Array.isArray(updates.items)) {
          merged.subtotal = updates.items.reduce(
            (s, it) => s + (Number(it.totalPrice) || (Number(it.price || it.unitPrice || 0) * Number(it.quantity || 1))),
            0
          );
          merged.total = merged.subtotal + (Number(merged.shipping) || 0);
          merged.totalAmount = merged.total;
        }
        return merged;
      });
      saveLocal('orders', updated);
      fetch(`${BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updates)
      }).catch(() => {});
      return { orders: updated };
    });
  },

  updateOrderStatus: (id: string, status: string) => {
    set((state) => {
      const updated = state.orders.map((o) => (o.id === id ? { ...o, status } : o));
      saveLocal('orders', updated);
      fetch(`${BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status })
      }).catch(() => {});
      return { orders: updated };
    });
  },

  deleteOrder: (id: string) => {
    set((state) => {
      const updated = state.orders.filter((o) => o.id !== id);
      saveLocal('orders', updated);
      fetch(`${BASE_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).catch(() => {});
      return {
        orders: updated,
        analytics: {
          ...state.analytics,
          totalOrdersCount: updated.length
        }
      };
    });
  },

  // Quotes
  createQuote: async (quoteData: Partial<QuoteSubmission>) => {
    const quoteId = quoteData.id || `RFQ-${Math.floor(5000 + Math.random() * 5000)}`;
    const newQuote: QuoteSubmission = {
      id: quoteId,
      name: quoteData.name || 'Commercial Buyer',
      company: quoteData.company || 'Retail Distributor',
      email: quoteData.email || 'quote@client.com',
      phone: quoteData.phone || '(555) 000-0000',
      category: quoteData.category || 'non-woven',
      volume: quoteData.volume || '10,000 pcs',
      printing: quoteData.printing || 'Custom Brand Silkscreen',
      message: quoteData.message || 'Direct quote request via Ecotex RFQ Engine.',
      status: 'New',
      date: new Date().toISOString().split('T')[0]
    };
    set((state) => {
      const existingIdx = state.quotes.findIndex(q => q.id === quoteId);
      const updated = existingIdx >= 0 
        ? state.quotes.map(q => q.id === quoteId ? newQuote : q)
        : [newQuote, ...state.quotes];
      saveLocal('quotes', updated);
      return { quotes: updated };
    });

    try {
      const res = await fetch(`${BASE_URL}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
      });
      if (res.ok) {
        const serverSaved = await res.json();
        set((state) => {
          const updated = state.quotes.map(q => q.id === quoteId ? serverSaved : q);
          saveLocal('quotes', updated);
          return { quotes: updated };
        });
        return serverSaved;
      }
    } catch (err) {
      console.warn('Network sync error creating quote:', err);
    }
    return newQuote;
  },

  updateQuote: (id: string, updates: Partial<QuoteSubmission>) => {
    set((state) => {
      const updated = state.quotes.map((q) => (q.id === id ? { ...q, ...updates } : q));
      saveLocal('quotes', updated);
      fetch(`${BASE_URL}/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updates)
      }).catch(() => {});
      return { quotes: updated };
    });
  },

  updateQuoteStatus: (id: string, status: string) => {
    set((state) => {
      const updated = state.quotes.map((q) => (q.id === id ? { ...q, status } : q));
      saveLocal('quotes', updated);
      fetch(`${BASE_URL}/quotes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status })
      }).catch(() => {});
      return { quotes: updated };
    });
  },

  deleteQuote: (id: string) => {
    set((state) => {
      const updated = state.quotes.filter((q) => q.id !== id);
      saveLocal('quotes', updated);
      fetch(`${BASE_URL}/quotes/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      }).catch(() => {});
      return {
        quotes: updated,
        analytics: {
          ...state.analytics,
          quoteRequestsCount: updated.length
        }
      };
    });
  },

  updateAnalytics: (updates: Partial<StoreState['analytics']>) => {
    set((state) => {
      const updated = { ...state.analytics, ...updates };
      saveLocal('analytics', updated);
      return { analytics: updated };
    });
  },

  // Live Analytics
  analytics: {
    activeVisitors: 48,
    quoteRequestsCount: 142,
    totalOrdersCount: 28,
    grossRevenue: 124850,
    bagsDisplaced: 52400000
  }
}));

// Automatically trigger live data sync on client initialization and listen to cross-tab storage changes
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key || !e.newValue) return;
    try {
      if (e.key === 'ecotex_products') {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) useStore.setState({ products: parsed });
      } else if (e.key === 'ecotex_categories') {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) useStore.setState({ categories: parsed });
      } else if (e.key === 'ecotex_hero_config') {
        useStore.setState({ heroConfig: JSON.parse(e.newValue) });
      } else if (e.key === 'ecotex_site_settings') {
        useStore.setState({ siteSettings: JSON.parse(e.newValue) });
      } else if (e.key === 'ecotex_orders') {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          const map = new Map<string, any>();
          parsed.forEach((o: any) => { if (o && o.id) map.set(o.id, o); });
          useStore.getState().orders.forEach((o: any) => { if (o && o.id && !map.has(o.id)) map.set(o.id, o); });
          const merged = Array.from(map.values()) as Order[];
          merged.sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime());
          useStore.setState({ orders: merged });
        }
      } else if (e.key === 'ecotex_quotes') {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) useStore.setState({ quotes: parsed });
      } else if (e.key === 'ecotex_media_library') {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) useStore.setState({ mediaLibrary: parsed });
      }
    } catch {}
  });

  setTimeout(() => {
    useStore.getState().fetchAllData();
  }, 10);
}
