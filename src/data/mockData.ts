import { Artisan, SubService, TradeCategory, GhanaPostAddress } from '../types';

export const GHANA_POST_SAMPLE_ADDRESSES: GhanaPostAddress[] = [
  {
    code: 'GA-183-9021',
    region: 'Greater Accra',
    district: 'Ayawaso West',
    area: 'East Legon, Near American House',
    latitude: 5.6358,
    longitude: -0.1582,
  },
  {
    code: 'GA-042-3109',
    region: 'Greater Accra',
    district: 'Korle Klottey',
    area: 'Osu, Ring Road East',
    latitude: 5.5560,
    longitude: -0.1821,
  },
  {
    code: 'GS-019-4820',
    region: 'Greater Accra',
    district: 'Ledzokuku',
    area: 'Spintex Road, Batsonaa',
    latitude: 5.6120,
    longitude: -0.1130,
  },
  {
    code: 'AK-039-1234',
    region: 'Ashanti',
    district: 'Kumasi Metropolitan',
    area: 'Adum, Near Central Market',
    latitude: 6.6885,
    longitude: -1.6244,
  },
  {
    code: 'GT-085-7142',
    region: 'Greater Accra',
    district: 'Tema Metropolitan',
    area: 'Tema Community 1',
    latitude: 5.6420,
    longitude: 0.0050,
  },
  {
    code: 'WS-204-1102',
    region: 'Western',
    district: 'Sekondi Takoradi',
    area: 'Takoradi Market Circle',
    latitude: 4.8980,
    longitude: -1.7580,
  }
];

export const CATEGORY_DEFINITIONS: Record<
  TradeCategory, 
  { label: string; iconEmoji: string; description: string; subServices: SubService[] }
> = {
  plumber: {
    label: 'Plumbers',
    iconEmoji: '🚰',
    description: 'Pipe leaks, toilet repair, water heater & tank booster pumps',
    subServices: [
      { id: 'p1', name: 'Pipe Leak & Burst Pipe Repair', baseEstimateGhs: 150 },
      { id: 'p2', name: 'Toilet & Cistern Installation', baseEstimateGhs: 250 },
      { id: 'p3', name: 'Water Tank (Polytank) & Booster Pump', baseEstimateGhs: 450 },
      { id: 'p4', name: 'Kitchen Sink & Drain Unclogging', baseEstimateGhs: 120 },
      { id: 'p5', name: 'Shower Mixer & Tap Replacement', baseEstimateGhs: 180 },
    ],
  },
  electrician: {
    label: 'Electricians',
    iconEmoji: '⚡',
    description: 'House wiring, circuit breakers, changeover switches & generators',
    subServices: [
      { id: 'e1', name: 'Total Power Outage & Fault Tracing', baseEstimateGhs: 200 },
      { id: 'e2', name: 'Circuit Breaker & Distribution Board (DB)', baseEstimateGhs: 350 },
      { id: 'e3', name: 'Automatic Changeover Switch Installation', baseEstimateGhs: 400 },
      { id: 'e4', name: 'Lighting, Chandeliers & Sockets Fix', baseEstimateGhs: 160 },
      { id: 'e5', name: 'Inverter & Solar Backup Wiring', baseEstimateGhs: 600 },
    ],
  },
  carpenter: {
    label: 'Carpenters',
    iconEmoji: '🪚',
    description: 'Custom kitchen cabinets, security doors, roofing & furniture',
    subServices: [
      { id: 'c1', name: 'Kitchen Cabinet Design & Build', baseEstimateGhs: 800 },
      { id: 'c2', name: 'Wooden & Security Door Hanging', baseEstimateGhs: 250 },
      { id: 'c3', name: 'Wardrobe & Closet Custom Fitting', baseEstimateGhs: 650 },
      { id: 'c4', name: 'Roofing Truss & Ceiling Leak Repair', baseEstimateGhs: 400 },
      { id: 'c5', name: 'Bed Frame & Dining Table Restoration', baseEstimateGhs: 300 },
    ],
  },
  painter: {
    label: 'Painters',
    iconEmoji: '🎨',
    description: 'Interior & exterior screeding, POP finish, anti-fungal coats',
    subServices: [
      { id: 'pt1', name: 'Full Interior Wall Screeding & Painting', baseEstimateGhs: 500 },
      { id: 'pt2', name: 'Exterior Weatherproof Shielding', baseEstimateGhs: 750 },
      { id: 'pt3', name: 'POP Ceiling Finishing & Moulding', baseEstimateGhs: 450 },
      { id: 'pt4', name: 'Dampness & Peel Anti-Fungal Treatment', baseEstimateGhs: 350 },
      { id: 'pt5', name: 'Feature Accent Wall Texture Art', baseEstimateGhs: 300 },
    ],
  },
  mason: {
    label: 'Masons / Tile Fixers',
    iconEmoji: '🧱',
    description: 'Porcelain & ceramic tiling, block work, plastering & paving',
    subServices: [
      { id: 'm1', name: 'Floor & Wall Porcelain Tiling (per sq m)', baseEstimateGhs: 400 },
      { id: 'm2', name: 'Cracked Wall Repair & Re-Plastering', baseEstimateGhs: 300 },
      { id: 'm3', name: 'Compound Interlocking Paving Stones', baseEstimateGhs: 700 },
      { id: 'm4', name: 'Septic Soakaway & Biofil Digester', baseEstimateGhs: 950 },
      { id: 'm5', name: 'Bathroom Waterproofing & Regrouting', baseEstimateGhs: 250 },
    ],
  },
  ac_tech: {
    label: 'AC Technicians',
    iconEmoji: '❄️',
    description: 'Split unit installation, gas top-up, chemical servicing & repairs',
    subServices: [
      { id: 'ac1', name: 'Complete Chemical Servicing & Deep Wash', baseEstimateGhs: 180 },
      { id: 'ac2', name: 'R410A / R22 Refrigerant Gas Refill', baseEstimateGhs: 280 },
      { id: 'ac3', name: 'New Split Unit AC Installation', baseEstimateGhs: 350 },
      { id: 'ac4', name: 'Water Dripping & Drain Pipe Clearing', baseEstimateGhs: 130 },
      { id: 'ac5', name: 'Compressor & Capacitor Replacement', baseEstimateGhs: 450 },
    ],
  },
};

export const INITIAL_ARTISANS: Artisan[] = [
  {
    id: 'artisan-kojo-painter',
    name: 'Kojo Mensah',
    phone: '+233 24 331 9088',
    trade: 'painter',
    tradeTitle: 'Certified Painter',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalReviews: 112,
    locationArea: 'Kumasi, Ashanti Region',
    ghanaPostGps: 'AS-032-1234',
    latitude: 6.6885,
    longitude: -1.6244,
    distanceKm: 1.8,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 8,
    startingPriceGhs: 220,
    emergencyAvailable: true,
    bio: 'Passionate painter specializing in flawless interior screeding, POP ceilings, weatherproof exterior coatings, and living room transformations in Kumasi and surrounding areas.',
    subServices: [
      'Full Interior Wall Screeding & Painting',
      'Exterior Weatherproof Shielding',
      'POP Ceiling Finishing & Moulding',
      'Decorative Venetian Feature Walls'
    ],
    portfolio: [
      {
        id: 'port-km1',
        title: 'Transforming a living space in Adum, Kumasi',
        category: 'painter',
        beforePhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
        description: 'Repaired rough damaged plaster, applied double-coat white emulsion screed, and installed clean warm recessed ceiling downlights.',
        completionTime: '3 Days',
        estimatedCostGhs: 1450,
        isFeatured: true,
        createdAt: '2026-09-10'
      },
      {
        id: 'port-km2',
        title: 'Master Bedroom Luxury Satin Finish',
        category: 'painter',
        beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
        description: 'Interior bedroom makeover using moisture-resistant washable silk paint and custom feature headboard wall.',
        completionTime: '2 Days',
        estimatedCostGhs: 950,
        isFeatured: false,
        createdAt: '2026-08-25'
      },
      {
        id: 'port-km3',
        title: 'Modern 2-Storey Villa Weatherproof Exterior Shield',
        category: 'painter',
        beforePhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        description: 'Exterior high-adhesion fungal resistant coating protecting against tropical rainfall.',
        completionTime: '6 Days',
        estimatedCostGhs: 3200,
        isFeatured: false,
        createdAt: '2026-07-30'
      }
    ],
    reviews: [
      {
        id: 'rev-km1',
        clientName: 'Kwabena Darko',
        clientPhoneMasked: '+233 24 *** 881',
        rating: 5,
        comment: 'Kojo is very meticulous! No paint drops on the baseboards, smooth as glass screeding, and delivered right on budget. Highly recommended!',
        date: '2 days ago',
        jobCategory: 'Full Interior Wall Screeding & Painting',
        verifiedBooking: true
      },
      {
        id: 'rev-km2',
        clientName: 'Akosua Serwaa',
        clientPhoneMasked: '+233 20 *** 419',
        rating: 5,
        comment: 'Transformed our dark living room into a bright modern space in just 3 days. Trustworthy and polite.',
        date: '1 week ago',
        jobCategory: 'Interior Living Room Transformation',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 680,
      jobEnquiries: 54,
      completedJobs: 112,
      ratingAverage: 4.8
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-11-20',
      renewDaysLeft: 48,
      autoRenew: true
    }
  },
  {
    id: 'artisan-kwame-plumber',
    name: 'Kwame Mensah',
    phone: '+233 24 491 8234',
    trade: 'plumber',
    tradeTitle: 'Master Certified Plumber',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalReviews: 84,
    locationArea: 'East Legon & Spintex',
    ghanaPostGps: 'GA-183-9021',
    latitude: 5.6358,
    longitude: -0.1582,
    distanceKm: 2.1,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 12,
    startingPriceGhs: 150,
    emergencyAvailable: true,
    bio: 'Over 12 years of residential plumbing experience in Accra. Specializing in high-pressure water pumps, concealed pipe leak detection, and German standard bathroom fittings. Always punctual and tidy.',
    subServices: [
      'Pipe Leak & Burst Pipe Repair',
      'Water Tank (Polytank) & Booster Pump',
      'Toilet & Cistern Installation',
      'Shower Mixer & Tap Replacement'
    ],
    portfolio: [
      {
        id: 'port-p1',
        title: 'Complete Bathroom Overhaul & Hansgrohe Shower Setup',
        category: 'plumber',
        beforePhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=80',
        description: 'Replaced corroded galvanized pipes with modern PPR tubing and installed concealed pressure-balanced mixer shower.',
        completionTime: '2 Days',
        estimatedCostGhs: 850,
        isFeatured: true,
        createdAt: '2026-08-14'
      },
      {
        id: 'port-p2',
        title: 'Emergency 5000L Polytank & Automatic Booster Pump',
        category: 'plumber',
        beforePhoto: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80',
        description: 'Connected backup water storage tank with digital float switch to overcome low GWCL mains pressure.',
        completionTime: '8 Hours',
        estimatedCostGhs: 600,
        isFeatured: false,
        createdAt: '2026-07-28'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        clientName: 'Dr. Evelyn Baah',
        clientPhoneMasked: '+233 20 *** 410',
        rating: 5,
        comment: 'Kwame saved our house from serious flooding on a Sunday night when our main burst. Arrived within 30 minutes with all replacement PPR fittings. Exceptional service!',
        date: '3 days ago',
        jobCategory: 'Pipe Leak & Burst Pipe Repair',
        verifiedBooking: true
      },
      {
        id: 'rev-2',
        clientName: 'Nana Yaw Osei',
        clientPhoneMasked: '+233 24 *** 991',
        rating: 5,
        comment: 'Very professional, polite, and left the bathroom spotless. He gave an accurate estimate upfront with no hidden add-ons. Highly recommended!',
        date: '2 weeks ago',
        jobCategory: 'Toilet & Cistern Installation',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 520,
      jobEnquiries: 42,
      completedJobs: 88,
      ratingAverage: 4.9
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-10-18',
      renewDaysLeft: 28,
      autoRenew: true
    }
  },
  {
    id: 'artisan-kofi-electrician',
    name: 'Kofi Asante',
    phone: '+233 20 812 3901',
    trade: 'electrician',
    tradeTitle: 'Energy Commission Certified Electrician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalReviews: 112,
    locationArea: 'Osu, Cantonments & Labone',
    ghanaPostGps: 'GA-042-3109',
    latitude: 5.5560,
    longitude: -0.1821,
    distanceKm: 3.5,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 15,
    startingPriceGhs: 200,
    emergencyAvailable: true,
    bio: 'Licensed by the Energy Commission of Ghana. Expertise in three-phase wiring, automatic changeover switches for Perkins/CAT generators, and modern smart LED architectural lighting.',
    subServices: [
      'Total Power Outage & Fault Tracing',
      'Automatic Changeover Switch Installation',
      'Circuit Breaker & Distribution Board (DB)',
      'Lighting, Chandeliers & Sockets Fix'
    ],
    portfolio: [
      {
        id: 'port-e1',
        title: 'Industrial DB Board Rewiring & Surge Protection',
        category: 'electrician',
        beforePhoto: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        description: 'Replaced fire-hazard tangled fuse box with Siemens circuit breakers, RCCB safety trip, and surge protection.',
        completionTime: '6 Hours',
        estimatedCostGhs: 550,
        isFeatured: true,
        createdAt: '2026-09-02'
      }
    ],
    reviews: [
      {
        id: 'rev-e1',
        clientName: 'Patricia Akuffo',
        clientPhoneMasked: '+233 55 *** 128',
        rating: 5,
        comment: 'Master Kofi diagnosed an elusive earthing problem that three other electricians could not find. Fixed it safely and explained everything clearly.',
        date: '1 week ago',
        jobCategory: 'Total Power Outage & Fault Tracing',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 680,
      jobEnquiries: 58,
      completedJobs: 130,
      ratingAverage: 4.95
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-10-12',
      renewDaysLeft: 22,
      autoRenew: true
    }
  },
  {
    id: 'artisan-emmanuel-ac',
    name: 'Emmanuel Osei',
    phone: '+233 27 560 9944',
    trade: 'ac_tech',
    tradeTitle: 'HVAC & Inverter AC Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    rating: 4.85,
    totalReviews: 67,
    locationArea: 'Airport Residential & Dzorwulu',
    ghanaPostGps: 'GA-183-9021',
    latitude: 5.6020,
    longitude: -0.1800,
    distanceKm: 1.8,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 9,
    startingPriceGhs: 180,
    emergencyAvailable: true,
    bio: 'Specialized in Gree, Daikin, and Samsung Inverter AC units. Chemical deep pressure wash, refrigerant gas detection, and silent copper pipe routing.',
    subServices: [
      'Complete Chemical Servicing & Deep Wash',
      'R410A / R22 Refrigerant Gas Refill',
      'Compressor & Capacitor Replacement',
      'New Split Unit AC Installation'
    ],
    portfolio: [
      {
        id: 'port-ac1',
        title: 'Deep Coil Chemical Foam Cleaning & Deodorizing',
        category: 'ac_tech',
        beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
        description: 'Cleaned mould-clogged condenser and evaporator blower wheels, restoring ice-cold airflow and dropping energy draw by 35%.',
        completionTime: '2 Hours',
        estimatedCostGhs: 220,
        isFeatured: true,
        createdAt: '2026-08-30'
      }
    ],
    reviews: [
      {
        id: 'rev-ac1',
        clientName: 'Kojo Adjei',
        clientPhoneMasked: '+233 24 *** 719',
        rating: 5,
        comment: 'The AC was blowing warm air in the hot afternoon. Emmanuel came with vacuum pump, tested pressure, fixed micro-leak, and refilled gas. Blowing freezing cold now!',
        date: '5 days ago',
        jobCategory: 'R410A / R22 Refrigerant Gas Refill',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 410,
      jobEnquiries: 34,
      completedJobs: 71,
      ratingAverage: 4.85
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-10-05',
      renewDaysLeft: 15,
      autoRenew: true
    }
  },
  {
    id: 'artisan-akwasi-carpenter',
    name: 'Akwasi Boateng',
    phone: '+233 54 398 1120',
    trade: 'carpenter',
    tradeTitle: 'Master Wood Craftsman & Joiner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalReviews: 53,
    locationArea: 'Spintex & Sakumono',
    ghanaPostGps: 'GS-019-4820',
    latitude: 5.6120,
    longitude: -0.1130,
    distanceKm: 4.2,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 14,
    startingPriceGhs: 250,
    emergencyAvailable: false,
    bio: 'Authentic Ghanaian hardwoods (Teak, Odum, Mahogany) and high-gloss acrylic MDF cabinetry. Soft-close hinges, reinforced security door installation, and bespoke wardrobe closets.',
    subServices: [
      'Kitchen Cabinet Design & Build',
      'Wooden & Security Door Hanging',
      'Wardrobe & Closet Custom Fitting',
      'Bed Frame & Dining Table Restoration'
    ],
    portfolio: [
      {
        id: 'port-c1',
        title: 'Modern High-Gloss Island & Kitchen Cabinetry',
        category: 'carpenter',
        beforePhoto: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&auto=format&fit=crop&q=80',
        description: 'Tore down decaying plywood cupboards and built waterproof Marine Board cabinets with quartz countertop.',
        completionTime: '4 Days',
        estimatedCostGhs: 3400,
        isFeatured: true,
        createdAt: '2026-08-20'
      }
    ],
    reviews: [
      {
        id: 'rev-c1',
        clientName: 'Abena Mansa',
        clientPhoneMasked: '+233 26 *** 883',
        rating: 5,
        comment: 'Akwasi is a true artisan! Built our master bedroom walk-in closet in record time with beautiful detailing. Very honest and trustworthy.',
        date: '3 weeks ago',
        jobCategory: 'Wardrobe & Closet Custom Fitting',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 380,
      jobEnquiries: 29,
      completedJobs: 56,
      ratingAverage: 4.88
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-10-25',
      renewDaysLeft: 35,
      autoRenew: true
    }
  },
  {
    id: 'artisan-samuel-painter',
    name: 'Samuel Tetteh',
    phone: '+233 24 990 4431',
    trade: 'painter',
    tradeTitle: 'Master Screeder & Decorative Finisher',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    rating: 4.82,
    totalReviews: 48,
    locationArea: 'Tema & Sakumono',
    ghanaPostGps: 'GT-085-7142',
    latitude: 5.6420,
    longitude: 0.0050,
    distanceKm: 5.9,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 10,
    startingPriceGhs: 300,
    emergencyAvailable: false,
    bio: 'Expert wall screeding with ultra-smooth silk emulsion and anti-fungal exterior coats formulated for the humid coastal climate. Clean edges and zero overspray.',
    subServices: [
      'Full Interior Wall Screeding & Painting',
      'Exterior Weatherproof Shielding',
      'POP Ceiling Finishing & Moulding',
      'Dampness & Peel Anti-Fungal Treatment'
    ],
    portfolio: [
      {
        id: 'port-pt1',
        title: 'Living Room Screeding & Venetian Feature Wall',
        category: 'painter',
        beforePhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
        description: 'Treated severe moisture peel on coastal wall, applied double-coat screed, and painted in warm beige finish.',
        completionTime: '3 Days',
        estimatedCostGhs: 1200,
        isFeatured: true,
        createdAt: '2026-08-11'
      }
    ],
    reviews: [
      {
        id: 'rev-pt1',
        clientName: 'George Lamptey',
        clientPhoneMasked: '+233 20 *** 552',
        rating: 5,
        comment: 'Zero paint drops on our tiles or windows. Samuel brought protective tarps for everything and finished ahead of schedule.',
        date: '1 month ago',
        jobCategory: 'Full Interior Wall Screeding & Painting',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 310,
      jobEnquiries: 22,
      completedJobs: 49,
      ratingAverage: 4.82
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-11-01',
      renewDaysLeft: 42,
      autoRenew: true
    }
  },
  {
    id: 'artisan-joseph-mason',
    name: 'Joseph Addo',
    phone: '+233 50 144 8872',
    trade: 'mason',
    tradeTitle: 'Master Tiler & Structural Mason',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalReviews: 76,
    locationArea: 'Dansoman, Kaneshie & Achimota',
    ghanaPostGps: 'GA-042-3109',
    latitude: 5.5450,
    longitude: -0.2520,
    distanceKm: 6.4,
    isGhanaCardVerified: true,
    isPro: true,
    isAvailable: true,
    experienceYears: 16,
    startingPriceGhs: 350,
    emergencyAvailable: false,
    bio: 'Precision laser-level porcelain 60x60 and 120x60 floor tiling. Biofil digester construction and structural reinforced brickwork.',
    subServices: [
      'Floor & Wall Porcelain Tiling (per sq m)',
      'Cracked Wall Repair & Re-Plastering',
      'Bathroom Waterproofing & Regrouting',
      'Septic Soakaway & Biofil Digester'
    ],
    portfolio: [
      {
        id: 'port-m1',
        title: 'Continuous Polished Spanish Porcelain Floor Tiling',
        category: 'mason',
        beforePhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        description: 'Levelled uneven concrete floor and laid 120sqm of Italian porcelain with razor-thin 1.5mm epoxy grout lines.',
        completionTime: '5 Days',
        estimatedCostGhs: 2800,
        isFeatured: true,
        createdAt: '2026-07-19'
      }
    ],
    reviews: [
      {
        id: 'rev-m1',
        clientName: 'Mrs. Cynthia Appiah',
        clientPhoneMasked: '+233 24 *** 004',
        rating: 5,
        comment: 'Joseph is a perfectionist with tiling! No hollow tiles, perfect slopes in our walk-in shower drain.',
        date: '2 weeks ago',
        jobCategory: 'Floor & Wall Porcelain Tiling (per sq m)',
        verifiedBooking: true
      }
    ],
    stats: {
      profileViews: 490,
      jobEnquiries: 38,
      completedJobs: 82,
      ratingAverage: 4.9
    },
    subscription: {
      plan: 'pro',
      expiresAt: '2026-10-20',
      renewDaysLeft: 30,
      autoRenew: true
    }
  }
];

export const INITIAL_JOB_REQUESTS = [
  {
    id: '230006',
    clientId: 'client-user-1',
    clientName: 'Afia Pokuaa',
    clientPhone: '+233 24 555 8921',
    artisanId: 'artisan-kojo-painter',
    artisanName: 'Kojo M.',
    artisanTrade: 'Certified Painter',
    category: 'painter' as TradeCategory,
    subService: 'Painter needed for Bedroom',
    description: 'Master bedroom wall sanding, double coat anti-damp emulsion, and light beige accent headboard wall in Kumasi.',
    locationAddress: 'Adum Central, Kumasi',
    ghanaPostCode: 'AS-032-1234',
    mediaPhotos: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80'
    ],
    preferredDate: '2026-09-22',
    preferredTimeWindow: 'Morning (8:00 AM - 12:00 PM)',
    estimatedCostRangeGhs: 'GH₵ 350 - GH₵ 550',
    status: 'work_in_progress' as const,
    quote: {
      id: 'quote-230006',
      jobId: '230006',
      items: [
        { id: 'qi-1', description: 'Labor: Wall screeding, prep & painting', type: 'labor' as const, costGhs: 260 },
        { id: 'qi-2', description: 'Materials: Deluxe Washable Emulsion & primer', type: 'material' as const, costGhs: 190 }
      ],
      totalLaborGhs: 260,
      totalMaterialsGhs: 190,
      grandTotalGhs: 450,
      notes: 'Workmanship guarantee included. Painter arrived on site with all tarps and tools.',
      validUntil: '2026-09-25',
      status: 'accepted' as const,
      sentAt: '09:15 AM'
    },
    createdAt: '2026-09-21T07:45:00Z',
    isUrgent: false
  },
  {
    id: '230008',
    clientId: 'client-user-1',
    clientName: 'Afia Pokuaa',
    clientPhone: '+233 24 555 8921',
    artisanId: 'artisan-kojo-painter',
    artisanName: 'Kojo M.',
    artisanTrade: 'Certified Painter',
    category: 'painter' as TradeCategory,
    subService: 'Painter needed for Bedroom',
    description: 'Kids bedroom ceiling POP touch-up and warm pastel yellow wall painting.',
    locationAddress: 'Adum Central, Kumasi',
    ghanaPostCode: 'AS-032-1234',
    mediaPhotos: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'
    ],
    preferredDate: '2026-09-23',
    preferredTimeWindow: 'Afternoon (1:00 PM - 5:00 PM)',
    estimatedCostRangeGhs: 'GH₵ 280 - GH₵ 420',
    status: 'work_in_progress' as const,
    quote: {
      id: 'quote-230008',
      jobId: '230008',
      items: [
        { id: 'qi-1', description: 'Labor: POP ceiling repair & wall paint', type: 'labor' as const, costGhs: 200 },
        { id: 'qi-2', description: 'Materials: White acrylic POP paste & ceiling paint', type: 'material' as const, costGhs: 140 }
      ],
      totalLaborGhs: 200,
      totalMaterialsGhs: 140,
      grandTotalGhs: 340,
      notes: 'Second phase of apartment painting.',
      validUntil: '2026-09-26',
      status: 'accepted' as const,
      sentAt: '11:30 AM'
    },
    createdAt: '2026-09-21T09:00:00Z',
    isUrgent: false
  },
  {
    id: '255007',
    clientId: 'client-user-1',
    clientName: 'Afia Pokuaa',
    clientPhone: '+233 24 555 8921',
    artisanId: 'artisan-kwame-plumber',
    artisanName: 'Kwame Mensah',
    artisanTrade: 'Master Certified Plumber',
    category: 'plumber' as TradeCategory,
    subService: 'Plumber - Completed',
    description: 'Kitchen sink high pressure mixer tap replacement and main pipe flush.',
    locationAddress: 'East Legon, Accra',
    ghanaPostCode: 'GA-183-9021',
    mediaPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ],
    preferredDate: '2026-09-18',
    preferredTimeWindow: 'Morning',
    estimatedCostRangeGhs: 'GH₵ 180',
    status: 'job_completed' as const,
    paymentMethod: 'momo_mtn' as const,
    isPaid: true,
    paidAt: '2026-09-18T14:30:00Z',
    quote: {
      id: 'quote-255007',
      jobId: '255007',
      items: [
        { id: 'qi-1', description: 'Labor: Pipe replacement & leak test', type: 'labor' as const, costGhs: 120 },
        { id: 'qi-2', description: 'Materials: Flexible steel connectors', type: 'material' as const, costGhs: 60 }
      ],
      totalLaborGhs: 120,
      totalMaterialsGhs: 60,
      grandTotalGhs: 180,
      notes: 'Job successfully finished and water pressure tested.',
      validUntil: '2026-09-20',
      status: 'accepted' as const,
      sentAt: '12:00 PM'
    },
    createdAt: '2026-09-18T08:00:00Z',
    isUrgent: false
  },
  {
    id: 'job-sample-101',
    clientId: 'client-user-1',
    clientName: 'Afia Pokuaa',
    clientPhone: '+233 24 555 8921',
    artisanId: 'artisan-kwame-plumber',
    artisanName: 'Kwame Mensah',
    artisanTrade: 'Master Certified Plumber',
    category: 'plumber' as TradeCategory,
    subService: 'Pipe Leak & Burst Pipe Repair',
    description: 'Under-sink kitchen copper pipe leaking water onto cabinet base. Need emergency leak arrest and pipe section replacement.',
    locationAddress: 'East Legon, near American House, Accra',
    ghanaPostCode: 'GA-183-9021',
    mediaPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
    ],
    preferredDate: '2026-09-22',
    preferredTimeWindow: 'Morning (8:00 AM - 12:00 PM)',
    estimatedCostRangeGhs: 'GH₵ 150 - GH₵ 280',
    status: 'estimate_received' as const,
    quote: {
      id: 'quote-101',
      jobId: 'job-sample-101',
      items: [
        { id: 'qi-1', description: 'Labor: Leak inspection, pipe cut & PPR soldering', type: 'labor' as const, costGhs: 120 },
        { id: 'qi-2', description: 'Materials: 2x 25mm PPR couplings & high-temp ball valve', type: 'material' as const, costGhs: 95 }
      ],
      totalLaborGhs: 120,
      totalMaterialsGhs: 95,
      grandTotalGhs: 215,
      notes: 'Includes 3-month workmanship guarantee. I will bring high pressure test kit.',
      validUntil: '2026-09-25',
      status: 'pending' as const,
      sentAt: '10:15 AM'
    },
    createdAt: '2026-09-21T08:30:00Z',
    isUrgent: true
  }
];
