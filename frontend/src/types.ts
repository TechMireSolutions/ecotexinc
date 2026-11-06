export type ProductCategory = 
  | 'all'
  | 'non-woven'
  | 'biodegradable'
  | 'gift-bags'
  | 't-shirt'
  | 'recycled-textiles'
  | string;

export interface ProductColorVariant {
  id?: string;
  name: string;
  hex: string;
  stockQuantity?: number;
  inStock?: boolean;
  borderColor?: string;
  bestFor?: string;
  recommendedPrint?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  subtitle: string;
  pricePerUnit: number; // base bulk price for 1,000+ units
  moq: number; // minimum order quantity
  wholesaleMoq?: number; // wholesale minimum order quantity
  wholesaleMinBoxes?: number; // wholesale minimum boxes allowed (MOQ)
  wholesaleMaxBoxes?: number; // wholesale maximum boxes allowed
  retailQuantity?: number; // fixed retail order quantity in boxes (e.g. 15)
  retailMinBoxes?: number; // retail minimum boxes allowed
  pcsPerBox?: number; // number of pieces inside 1 box (dynamic pack size e.g. 200, 500 pcs/box)
  stockQuantity?: number; // Available inventory count in boxes (0 means out of stock)
  colorStock?: Record<string, number>; // Inventory count in boxes per color variant
  gsm: number; // Grams per square meter
  dimensions: string; // e.g., '12"W x 14"H x 4"D'
  material: string; // e.g., 'Virgin & Recycled Non-Woven Polypropylene'
  capacity: string; // e.g. 'Up to 25 lbs'
  certifications: string[]; // e.g. ['GRS Certified', '100% Recyclable', 'FDA Compliant']
  availableColors: ProductColorVariant[];
  description: string;
  features: string[];
  bestFor: string;
  ecoImpact: string;
  inStock: boolean;
  leadTime: string;
  volumeTiers: { minQty: number; price: number }[];
  image?: string;
  badge?: string;

  // Single Product Detail Page Extended Fields
  rating?: number;
  articleNo?: string;
  volumeNo?: string;
  galleryImages?: string[];
  retailPricePerUnit?: number;
  retailOriginalPrice?: number;
  retailMaxBoxes?: number;
  originalPrice?: number;
  recommendedPrint?: string;
  brandName?: string;
  fabricDetails?: string;
  handles?: string;
  printingMethod?: string;
  compliance?: string;
  packingDetails?: string;
  guaranteedFabric?: string;
  enrouteQuality?: string;
  retailPolicyText?: string;
  wholesalePolicyText?: string;
  trustBadge1?: string;
  trustBadge2?: string;
  trustBadge3?: string;
  outOfStockTitle?: string;
  outOfStockNotice?: string;
  checkoutButtonText?: string;
  outOfStockButtonText?: string;
  retailTabLabel?: string;
  wholesaleTabLabel?: string;
  specsHeading?: string;
  relatedTag?: string;
  relatedTitle?: string;
  relatedSubtitle?: string;
  relatedBackBtnText?: string;
}


export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedHandle?: string;
  customPrint?: boolean;
  unitPrice: number;
  orderType?: 'retail' | 'wholesale';
}

export interface QuoteCalculation {
  productId: string;
  productName: string;
  quantity: number;
  printSides: '1-side' | '2-sides' | 'full-wrap' | 'blank';
  colorCount: 1 | 2 | 4; // 1-color, 2-color, or 4-color process (CMYK)
  estimatedUnitPrice: number;
  totalCost: number;
  plateFee: number;
  estimatedDeliveryWeeks: number;
  carbonSavedKg: number;
}

export interface ContactFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  inquiryType: 'Wholesale Quote' | 'Custom Branding' | 'Sample Kit Request' | 'Distributor Partnership' | 'General';
  estimatedVolume: string;
  message: string;
}

export interface Order {
  id: string;
  buyerName?: string;
  companyName?: string;
  customerName?: string;
  customerEmail?: string;
  email?: string;
  phone?: string;
  customerCompany?: string;
  shippingAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  paymentTerms: string;
  subtotal?: number;
  shipping?: number;
  total?: number;
  totalAmount?: number;
  status: 'Pending' | 'In Production' | 'Dispatched' | 'Completed' | 'Cancelled' | string;
  date?: string;
  createdAt?: string;
  notifications?: any;
  items: {
    productId?: string;
    productName?: string;
    name?: string;
    quantity: number;
    price?: number;
    unitPrice?: number;
    totalPrice?: number;
    color?: string;
  }[];
}

export interface QuoteSubmission {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  category?: string;
  volume?: string;
  printing?: string;
  message?: string;
  bagType?: string;
  quantity?: number;
  status: 'New' | 'Reviewed' | 'Quotation Sent' | 'Closed' | string;
  date?: string;
}


export interface LogoConfig {
  wordmarkPrefix?: string;
  wordmarkSuffix?: string;
  badgeText?: string;
  subtitle?: string;
  customLogoUrl?: string;
  faviconUrl?: string;
}

export interface NavLinkItem {
  id: string;
  label: string;
  targetSection: 'home' | 'about' | 'shop' | 'contact';
}

export interface NavbarConfig {
  announcementText: string;
  announcementActive: boolean;
  ctaButtonText: string;
  ctaButtonAction?: 'shop' | 'contact' | 'cart';
  showCtaButton?: boolean;
  phoneDisplay: string;
  showPhone?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  navLinks?: NavLinkItem[];
}

export interface VersatilityCard {
  id: string;
  title: string;
  description: string;
}

export interface VersatilityConfig {
  sustainableFashionTitle: string;
  sustainableFashionSubtitle: string;
  featureCards: VersatilityCard[];
  bannerTitle: string;
  bannerSubtitle: string;
  bannerButtonText: string;
  bannerImage: string;
  bottomTrustBadges: string[];
}

export interface CircularStep {
  step: string;
  title: string;
  desc: string;
}

export interface SustainabilityConfig {
  metrics: {
    plasticDisplaced: string;
    carbonReduction: string;
    reusableTrips: string;
    recyclablePercent: string;
  };
  circularSteps: CircularStep[];
}

export interface TeamMemberConfig {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  linkedin: string;
  twitter?: string;
}

export interface AboutFeature {
  title: string;
  description: string;
}

export interface AboutConfig {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBgImage?: string;
  storyTitle?: string;
  missionQuote?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  founderName?: string;
  founderRole?: string;
  founderImage?: string;
  leadershipBadgeTitle?: string;
  leadershipBadgeSubtitle?: string;
  workshopImage?: string;
  statBadgeValue?: string;
  statBadgeLabel?: string;
  whyChooseUsTitle?: string;
  whyChooseUsSubtitle?: string;
  whyChooseUsFeatures?: AboutFeature[];
  teamSectionTitle?: string;
  teamSectionSubtitle?: string;
  teamMembers?: TeamMemberConfig[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaBtnText?: string;
  [key: string]: any;
}

export interface ContactConfig {
  headline?: string;
  headlineFirst?: string;
  headlineSecond?: string;
  subtitle?: string;
  email?: string;
  supportEmail?: string;
  phone?: string;
  secondaryPhone?: string;
  website?: string;
  businessHours?: string;
  facilityAddress?: string;
  plantAddress?: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  bgImage?: string;
  formTitle?: string;
  formSubtitle?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  submitBtnText?: string;
  successHeading?: string;
  successMessage?: string;
  resetBtnText?: string;
  trustBadge1?: string;
  trustBadge2?: string;
  trustBadge3?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  [key: string]: any;
}

export interface FacilityHub {
  name: string;
  tag: string;
  address: string;
  capabilities: string[];
  image?: string;
  googleMapsUrl?: string;
}

export interface FacilitiesConfig {
  title: string;
  subtitle: string;
  storySnippet?: string;
  annualCapacity: string;
  certificationsMetric: string;
  activeLinesMetric: string;
  hubs: FacilityHub[];
  bannerImage?: string;
  showOnHomepage?: boolean;
}

export interface ShippingConfig {
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  estimatedTransitDays: string;
  freightCarrier: string;
  shippingPolicyNotice: string;
  warehouseHub: string;
  localPickupAvailable?: boolean;
  sampleDispatchNotice?: string;
}

export interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  url?: string;
}

export interface FooterConfig {
  newsletterTitle: string;
  newsletterSubtitle?: string;
  newsletterBgImage?: string;
  newsletterBtnText?: string;
  newsletterActive?: boolean;
  tagline: string;
  copyrightNotice: string;
  col1Title?: string;
  col2Title?: string;
  col3Title?: string;
  col2Links?: FooterLinkItem[];
  col3Links?: FooterLinkItem[];
  socialLinks?: SocialLinkItem[];
  socialTwitter?: string;
  socialFacebook?: string;
  socialLinkedin?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  termsNotice?: string;
  privacyNotice?: string;
  sitemapNotice?: string;
  termsContent?: string;
  privacyContent?: string;
}

export interface QuoteCalcConfig {
  plateFee: number;
  freeFreightThreshold: number;
  leadTimeBlank: string;
  leadTimeCustom: string;
}

export interface TestimonialConfig {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatar: string;
}

export interface ShopConfig {
  catalogTitle: string;
  catalogSubtitle: string;
  testimonials: TestimonialConfig[];
  galleryImages?: { url: string; caption: string }[];
  // Home Page Shop Hero Banner
  showHeroBanner?: boolean;
  heroBannerBadge?: string;
  heroBannerTitle?: string;
  heroBannerSubtitle?: string;
  heroBannerBtnText?: string;
  heroBannerImage?: string;
  heroBannerDiscountBadge?: string;
  valueProp1Title?: string;
  valueProp1Subtitle?: string;
  valueProp2Title?: string;
  valueProp2Subtitle?: string;
  valueProp3Title?: string;
  valueProp3Subtitle?: string;
  // 4-Item Value Propositions Strip
  trustBar1Title?: string;
  trustBar1Subtitle?: string;
  trustBar2Title?: string;
  trustBar2Subtitle?: string;
  trustBar3Title?: string;
  trustBar3Subtitle?: string;
  trustBar4Title?: string;
  trustBar4Subtitle?: string;
  // Section Headings & Buttons
  categoriesHeading?: string;
  categoriesSubheading?: string;
  newArrivalsHeading?: string;
  allProductsHeading?: string;
  newArrivalsBtnText?: string;
  newArrivalsHideBtnText?: string;
}

export interface DealConfig {
  enabled: boolean;
  productId: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  offerPrice?: number;
  originalPrice?: number;
  stockText: string;
  stockProgressPercent: number;
  timerHours: number;
  timerMinutes: number;
  timerSeconds: number;
  customImage?: string;
}

export interface OrderNotificationsConfig {
  emailEnabled: boolean;
  notificationEmail: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappGreeting?: string;
  autoOpenWhatsapp?: boolean;
}

export interface SiteSettings {
  siteTitle?: string;
  metaDescription?: string;
  companyName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText?: string;
  announcement: string;
  announcementActive?: boolean;
  phone: string;
  secondaryPhone?: string;
  whatsappNumber?: string;
  email: string;
  supportEmail?: string;
  facilityAddress: string;
  plantAddress?: string;
  minOrderNotice: string;
  leadTimeBlank?: string;
  leadTimeCustom?: string;
  aboutTitle?: string;
  aboutMission?: string;
  aboutStory?: string;
  footerTagline?: string;
  copyrightNotice?: string;
  esgMetrics?: {
    plasticDisplaced: string;
    carbonReduction: string;
    reusableTrips: string;
    recyclablePercent: string;
  };
  logoConfig?: LogoConfig;
  navbarConfig?: NavbarConfig;
  versatilityConfig?: VersatilityConfig;
  sustainabilityConfig?: SustainabilityConfig;
  aboutConfig?: AboutConfig;
  contactConfig?: ContactConfig;
  facilitiesConfig?: FacilitiesConfig;
  shippingConfig?: ShippingConfig;
  footerConfig?: FooterConfig;
  currencySymbol?: string;
  currencyCode?: string;
  taxRatePercent?: number;
  taxExemptionNotice?: string;
  guaranteeNotice?: string;
  sampleKitPolicy?: string;
  quoteCalcConfig?: QuoteCalcConfig;
  shopConfig?: ShopConfig;
  dealConfig?: DealConfig;
  orderNotifications?: OrderNotificationsConfig;
  [key: string]: any;
}


export interface CategoryItem {
  id: string;
  label: string;
  subtitle: string;
  tag: string;
  count: string;
  image: string;
  description: string;
  size?: string;
  gsm?: string | number;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  channel?: 'web' | 'email' | 'whatsapp' | 'phone';
  notifications?: {
    whatsapp?: { target?: string | null; dispatched?: boolean; url?: string | null };
    email?: { target?: string | null; dispatched?: boolean };
  };
}

export interface CustomerThread {
  id: string;
  customerName: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  status: 'New' | 'In Discussion' | 'Quoted' | 'Resolved';
  isUnread: boolean;
  channel: 'Direct Web Inquiry' | 'Contact Form' | 'RFQ Quote' | 'Custom Request' | 'WhatsApp' | 'Live Web Chat';
  lastUpdated: string;
  messages: ChatMessage[];
}

export type ActiveSection = 'home' | 'about' | 'shop' | 'contact' | 'product-detail' | 'admin';

