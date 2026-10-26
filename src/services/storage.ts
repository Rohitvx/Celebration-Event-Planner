import type { EventPlan } from '../types/event';

const STORAGE_KEYS = {
  EVENTS: 'celebration_ai_events',
  ACTIVE_ID: 'celebration_ai_active_id',
  GEMINI_KEY: 'celebration_ai_gemini_key',
  SETTINGS: 'celebration_ai_settings',
};

// Rich Sample Event 1: College Freshers' Bash
export const SAMPLE_FRESHERS_EVENT: EventPlan = {
  id: 'demo-freshers-2026',
  title: 'Neon Euphoria 2026 — Fresher Welcome',
  type: 'freshers',
  date: '2026-11-20',
  location: 'The Grand Courtyard & Amphitheatre, Bengaluru',
  guestCount: 350,
  totalBudget: 250000, // ₹2,50,000
  preferredTheme: 'Cyberpunk Neon Glow & Retro Beats',
  decorationStyle: 'UV blacklights, neon string art, LED tunnel entrance, LED glow sticks',
  foodPreference: 'cocktail_finger_food',
  venueType: 'hybrid',
  specialRequirements: 'High-energy DJ setup, strobe lights with smoke machine, mocktail bar, and 360-degree video booth.',
  createdAt: '2026-10-20T10:00:00Z',
  updatedAt: '2026-10-25T14:30:00Z',
  isDemo: true,
  aiPlan: {
    conceptTitle: 'Neon Euphoria — The Electric Genesis',
    conceptSummary:
      'An immersive cyber-synth fresher celebration designed to break the ice instantly. Juniors step through a luminous glowing LED vortex into a pulsating arena with neon wristbands that sync with beats, live student performances, and an electrifying DJ duel.',
    themeStyle: 'Cyberpunk Neon Glow with Holographic Accents',
    colorPalette: [
      { name: 'Electric Cyan', hex: '#00f0ff' },
      { name: 'Neon Magenta', hex: '#ff007f' },
      { name: 'Cyber Violet', hex: '#7000ff' },
      { name: 'Volt Lime', hex: '#39ff14' },
      { name: 'Deep Space', hex: '#0a0a14' },
    ],
    vibeKeywords: ['High Voltage', 'Futuristic', 'Inclusive', 'Instagrammable', 'Unforgettable'],
    cateringSuggestions: [
      'Gourmet Slider & Mini Burger Bar with peri-peri seasoned wedges',
      'Live Wood-Fired Mini Pizza Station (Veggie Supreme, Paneer Tikka, Peri-Peri Chicken)',
      'Molecular Mocktail Bar: Electric Blue Lagoon, Smoked Berry Fizz, and Spiced Mango Twist',
      'Churros & Waffle Bites with warm Nutella and caramel fountain',
    ],
    entertainmentIdeas: [
      'Dual DJ Battle with campus guest DJ and synchronized laser show',
      'The "Crown of Euphoria" — Mr. & Ms. Fresher ramp-walk and rapid-fire talent rounds',
      'Interactive 360-Degree Slow-Mo Video Booth with custom neon digital filters',
      'Silent Disco Lounge corner for students who want alternative beats',
    ],
    guestExperienceHighlights: [
      'Personalized glowing RFID/NFC wristband that syncs with music beats on arrival',
      'Neon body paint & biodegradable glow makeup touch-up stations at the entrance',
      'Digital memory wall: QR-code scanned live photo drops projected on the main amphitheatre wall',
      'Fresher Survival Kit gift bag containing holographic journal, stickers, and metal water flask',
    ],
    costSavingTips: [
      {
        tip: 'Partner with campus music club for acoustic PA equipment rather than third-party sub-rentals',
        estimatedSavingsINR: 18000,
      },
      {
        tip: 'Opt for finger-food finger stations instead of a seated heavy buffet to slash food wastage by 35%',
        estimatedSavingsINR: 22000,
      },
      {
        tip: 'Use digital animated QR invitations instead of physical print cards',
        estimatedSavingsINR: 6500,
      },
    ],
    backupPlan: {
      weatherRisk:
        'Indoor campus auditorium is reserved on standby in case of November evening showers in Bengaluru.',
      vendorContingency:
        'Alternative backup generator vendor on 1-hour standby call for uninterrupted sound stage.',
      powerSoundContingency:
        'Separate dedicated 15kVA circuit strictly reserved for the sound console to prevent trip-outs.',
    },
    suggestedSchedule: [
      { time: '04:30 PM', activity: 'Gates Open: Neon Makeup Bar, Glow Wristband Handouts & Photo Zone' },
      { time: '05:30 PM', activity: 'Dean & Student Council Welcome Speech & Senior Flashmob' },
      { time: '06:15 PM', activity: 'Mr. & Ms. Fresher Round 1: Creative Ramp Walk & Witty Intros' },
      { time: '07:30 PM', activity: 'Catering Bar Opens: Live Pizzas, Sliders & Mocktail Taps' },
      { time: '08:15 PM', activity: 'Fresher Crowning Ceremony & Award Presentations' },
      { time: '08:45 PM', activity: 'EDM & Bollywood DJ Extravaganza with Laser Cannon Climax' },
      { time: '10:30 PM', activity: 'Grand Confetti Drop, Pack-up & Safe Campus Shuttles Departure' },
    ],
  },
  expenses: [
    {
      id: 'e1',
      category: 'venue',
      name: 'College Amphitheatre Booking Fee & Lighting Rigging',
      plannedAmount: 35000,
      actualAmount: 35000,
      status: 'paid_in_full',
      notes: 'Included campus security support',
    },
    {
      id: 'e2',
      category: 'catering',
      name: 'Finger Food Buffet & Mocktail Bar (350 pax @ ₹180)',
      plannedAmount: 63000,
      actualAmount: 60000,
      status: 'deposit_paid',
      notes: 'Advance paid ₹25,000, balance on event day',
    },
    {
      id: 'e3',
      category: 'decoration',
      name: 'UV Blacklight Rigs, Neon Tunnel & Glow Decor',
      plannedAmount: 30000,
      actualAmount: 28000,
      status: 'deposit_paid',
      notes: 'Provided by Prism Visuals',
    },
    {
      id: 'e4',
      category: 'entertainment',
      name: 'DJ Rayne Live Set, Sound Rigs & Laser Cannons',
      plannedAmount: 55000,
      actualAmount: 55000,
      status: 'paid_in_full',
      notes: 'Contract signed for 4 hours performance',
    },
    {
      id: 'e5',
      category: 'photography',
      name: '360 Slow-Mo Video Booth + 2 Candid Photographers',
      plannedAmount: 22000,
      actualAmount: 20000,
      status: 'deposit_paid',
    },
    {
      id: 'e6',
      category: 'invitations',
      name: 'Digital Passes & Glow Wristbands with UV Ink',
      plannedAmount: 10000,
      actualAmount: 9500,
      status: 'paid_in_full',
    },
    {
      id: 'e7',
      category: 'logistics',
      name: 'Campus Late-Night Shuttles & Guard Honorariums',
      plannedAmount: 12000,
      actualAmount: 10000,
      status: 'pending',
    },
    {
      id: 'e8',
      category: 'miscellaneous',
      name: 'First Aid Kit, Extra Glow Sticks & Contest Prizes',
      plannedAmount: 15000,
      actualAmount: 12500,
      status: 'paid_in_full',
    },
  ],
  tasks: [
    {
      id: 't1',
      title: 'Finalize Amphitheatre Booking & Campus Approvals',
      description: 'Submit administrative letter to Dean of Student Affairs for campus clearance.',
      category: 'planning',
      priority: 'high',
      dueDate: '2026-10-28',
      completed: true,
      phase: '30_days',
    },
    {
      id: 't2',
      title: 'Sign Agreement with DJ Rayne & Sound Engineer',
      description: 'Confirm audio console specs and playlist censorship guidelines.',
      category: 'booking',
      priority: 'high',
      dueDate: '2026-11-02',
      completed: true,
      phase: '30_days',
    },
    {
      id: 't3',
      title: 'Order 400x LED Glow Wristbands & Neon Paints',
      description: 'Procure wholesale from Bangalore electric market.',
      category: 'creatives',
      priority: 'medium',
      dueDate: '2026-11-06',
      completed: true,
      phase: '14_days',
    },
    {
      id: 't4',
      title: 'Design & Launch Digital WhatsApp Invites with QR Code',
      description: 'Distribute through class representatives with RSVP links.',
      category: 'guests',
      priority: 'high',
      dueDate: '2026-11-08',
      completed: false,
      phase: '14_days',
    },
    {
      id: 't5',
      title: 'Finalize Food Menu & Count Confirmation with Caterer',
      description: 'Ensure 60% veg and 40% non-veg ratio with mocktail refill agreements.',
      category: 'booking',
      priority: 'high',
      dueDate: '2026-11-13',
      completed: false,
      phase: '7_days',
    },
    {
      id: 't6',
      title: 'Sound Check & UV Light Test in Amphitheatre',
      description: 'Do complete run-through at 7 PM to inspect illumination level.',
      category: 'execution',
      priority: 'high',
      dueDate: '2026-11-19',
      completed: false,
      phase: '1_day',
    },
    {
      id: 't7',
      title: 'Brief Student Volunteers & Host EMCEE team',
      description: 'Hand out radios, schedules, and crowd control assignments.',
      category: 'execution',
      priority: 'medium',
      dueDate: '2026-11-20',
      completed: false,
      phase: 'event_day',
    },
  ],
  vendors: [
    {
      id: 'v1',
      name: 'Sonic Pulse Audio & DJ Rayne',
      category: 'entertainment',
      contactPerson: 'Arun Rayne',
      phone: '+91 98450 12345',
      email: 'booking@sonicpulse.in',
      estimatedPrice: 55000,
      status: 'booked',
      rating: 4.9,
      notes: 'Includes line-array speakers, 2 subs, 4 strobe lights, and dry ice smoke.',
      location: 'Indiranagar, Bengaluru',
    },
    {
      id: 'v2',
      name: 'Saffron Crust Street & Mocktails',
      category: 'catering',
      contactPerson: 'Chef Kabir',
      phone: '+91 97412 88990',
      email: 'events@saffroncrust.in',
      estimatedPrice: 60000,
      status: 'booked',
      rating: 4.7,
      notes: 'Specializing in student finger-food and live woodfire oven counters.',
      location: 'Koramangala, Bengaluru',
    },
    {
      id: 'v3',
      name: 'Prism Illumination & Neon Art',
      category: 'decoration',
      contactPerson: 'Divya M.',
      phone: '+91 98860 44211',
      email: 'info@prismvisuals.com',
      estimatedPrice: 28000,
      status: 'booked',
      rating: 4.8,
      notes: 'Setting up 12 UV blacklight cannons and a 16ft glowing tunnel.',
      location: 'HSR Layout, Bengaluru',
    },
    {
      id: 'v4',
      name: 'Spin360 Photo Experiences',
      category: 'photography',
      contactPerson: 'Rohan Shetty',
      phone: '+91 99001 77654',
      email: 'rohan@spin360.co',
      estimatedPrice: 20000,
      status: 'booked',
      rating: 4.6,
      notes: 'Includes on-site instant WhatsApp video delivery station.',
      location: 'Whitefield, Bengaluru',
    },
  ],
  creativeAssets: [
    {
      id: 'c1',
      type: 'tagline',
      title: 'Festive Taglines & Monikers',
      content:
        '1. Neon Euphoria 2026: Where the Sparks Fly & The Beats Drop!\n2. Level Up: The Ultimate Fresher Inception.\n3. Turn Up The Glow: Welcome to Campus Life at 10,000 Volts!',
      tags: ['Freshers', 'Youth', 'Hype'],
    },
    {
      id: 'c2',
      type: 'invitation',
      title: 'WhatsApp Official Fresher Invite',
      content:
        '⚡️ *ATTENTION FRESHERS OF 2026!* ⚡️\n\nThe countdown is officially ON! Step into a neon-soaked dimension of electrifying music, endless munchies, and memories that will define your college journey.\n\n🎉 *Event:* Neon Euphoria 2026 — Official Freshers Welcome\n📅 *Date:* Friday, 20th November 2026\n⏰ *Time:* 4:30 PM onwards\n📍 *Venue:* The Grand Courtyard & Amphitheatre\n👗 *Dress Code:* Neon Glow, Holographic, or Street Chic\n\n✨ *What awaits you:* Dual DJ Battle • Live Mocktail & Pizza Bar • 360° Slow-Mo Cam • The Mr. & Ms. Fresher Crown 👑\n\n👉 *Claim Your Glow Pass:* Scan your student barcode at the gate!\n_See you under the blacklights!_',
      tags: ['WhatsApp', 'Digital Invite', 'Student Friendly'],
    },
    {
      id: 'c3',
      type: 'caption',
      title: 'Instagram Hype Captions & Hashtags',
      content:
        'Left our doubts at the door and stepped straight into the glow! ⚡️💜 Welcome to the tribe, batch of 2026. This is just chapter one! 🚀✨\n\n#NeonEuphoria2026 #FresherParty #CampusVibes #ElectricNights #CollegeChronicles #BengaluruStudents #GlowHardOrGoHome',
      tags: ['Instagram', 'Reels', 'Social Media'],
    },
  ],
};

// Sample Event 2: Royal 50th Birthday Party
export const SAMPLE_BIRTHDAY_EVENT: EventPlan = {
  id: 'demo-birthday-golden',
  title: 'Royal Velvet Jubilee — Rajiv’s 50th Birthday',
  type: 'birthday',
  date: '2026-12-15',
  location: 'Whispering Palms Heritage Lawn & Haveli, Jaipur',
  guestCount: 65,
  totalBudget: 120000, // ₹1,20,000
  preferredTheme: 'Royal Heritage & Champagne Velvet',
  decorationStyle: 'Warm fairy lights, brass marigold urlis, velvet drapery, vintage photo gallery',
  foodPreference: 'buffet_multi_cuisine',
  venueType: 'outdoor',
  specialRequirements: 'Live acoustic ghazal & retro Bollywood band, 50-year nostalgic memory lane display, customized keepsake gifts for all guests.',
  createdAt: '2026-10-18T09:00:00Z',
  updatedAt: '2026-10-24T18:00:00Z',
  isDemo: true,
  aiPlan: {
    conceptTitle: 'Golden Echoes — Half a Century of Grace',
    conceptSummary:
      'An intimate, royal evening celebrating five decades of love, family, and achievements. Guests are welcomed with floral petal showers and traditional shehnai/acoustic strings, transitioning into a moonlit heritage lawn adorned with velvet cushions and candlelit banquet tables.',
    themeStyle: 'Royal Rajasthan Heritage & Champagne Gold',
    colorPalette: [
      { name: 'Royal Crimson', hex: '#800020' },
      { name: 'Champagne Gold', hex: '#d4af37' },
      { name: 'Ivory Cream', hex: '#fffdd0' },
      { name: 'Emerald Velvet', hex: '#046307' },
    ],
    vibeKeywords: ['Nostalgic', 'Opulent', 'Heartwarming', 'Soulful', 'Elegant'],
    cateringSuggestions: [
      'Welcome drinks: Royal Saffron Kesar Thandai & Sparkling Pomegranate Bellini',
      'Starters: Paneer Angara, Galouti Kebab on saffron sheermal, Crispy Corn Tarts',
      'Main Course: Dal Bukhara slow-simmered, Dum Biryani, Paneer Lababdar with artisanal breads',
      'Dessert: Hot Rabri Jalebi live counter & Belgian Dark Chocolate Truffle Cake',
    ],
    entertainmentIdeas: [
      'Live 3-piece acoustic ensemble playing soulful Kishore Kumar & RD Burman golden melodies',
      'Surprise 15-minute documentary film featuring childhood friends, college buddies, and family',
      'The "50 Reasons We Love You" memory tree where guests pin handwritten heartfelt notes',
    ],
    guestExperienceHighlights: [
      'Vintage photo walkway documenting milestones from 1976 to 2026',
      'Custom silver-plated commemorative coins and artisanal scented candles as return favors',
      'Live portrait caricature artist capturing guests in royal attire',
    ],
    costSavingTips: [
      {
        tip: 'Source seasonal marigolds and brass urlis directly from local Mandi for a 40% decor saving',
        estimatedSavingsINR: 14000,
      },
      {
        tip: 'Combine dessert and celebration cake display to avoid double sweet-dish redundancy',
        estimatedSavingsINR: 6000,
      },
    ],
    backupPlan: {
      weatherRisk: 'Covered haveli pillared veranda ready if evening winter winds get chilly.',
      vendorContingency: 'Local caterer kitchen located within 3 km for any rapid replenishment.',
      powerSoundContingency: 'Silent in-house 10kVA solar-inverter backup available on site.',
    },
    suggestedSchedule: [
      { time: '06:30 PM', activity: 'Guest Arrival: Saffron Welcome Drink, Rose Petal Greeting & Caricature Corner' },
      { time: '07:15 PM', activity: 'Acoustic Bollywood Retro Band Performance begins' },
      { time: '08:00 PM', activity: 'Screening of the "Half Century of Rajiv" Surprise Milestone Tribute Film' },
      { time: '08:30 PM', activity: 'Grand Cake Cutting Ceremony with Champagne Toast & Family Speeches' },
      { time: '09:00 PM', activity: 'Royal Heritage Dinner Buffet Opens' },
      { time: '10:15 PM', activity: 'Return Gift Presentation, Group Photographs & Warm Farewell' },
    ],
  },
  expenses: [
    {
      id: 'eb1',
      category: 'venue',
      name: 'Haveli Lawn Rental & Seating Setup',
      plannedAmount: 28000,
      actualAmount: 28000,
      status: 'paid_in_full',
    },
    {
      id: 'eb2',
      category: 'catering',
      name: 'Royal Heritage Buffet (65 pax @ ₹750/head)',
      plannedAmount: 48750,
      actualAmount: 48000,
      status: 'deposit_paid',
    },
    {
      id: 'eb3',
      category: 'decoration',
      name: 'Fairy Light Canopies, Brass Urlis & Velvet Drapes',
      plannedAmount: 18000,
      actualAmount: 16500,
      status: 'paid_in_full',
    },
    {
      id: 'eb4',
      category: 'photography',
      name: 'Portrait Photographer & Videographer',
      plannedAmount: 12000,
      actualAmount: 12000,
      status: 'deposit_paid',
    },
    {
      id: 'eb5',
      category: 'entertainment',
      name: 'Acoustic Retro 3-Piece Ghazal Band',
      plannedAmount: 12000,
      actualAmount: 10000,
      status: 'deposit_paid',
    },
    {
      id: 'eb6',
      category: 'invitations',
      name: 'Royal Wax-Sealed Velvet Box Invites & Favors',
      plannedAmount: 7000,
      actualAmount: 6500,
      status: 'paid_in_full',
    },
  ],
  tasks: [
    {
      id: 'tb1',
      title: 'Collect 50 Childhood and Family Photos for Surprise Video',
      description: 'Digitize old albums and send to the video editor.',
      category: 'creatives',
      priority: 'high',
      dueDate: '2026-11-20',
      completed: true,
      phase: '30_days',
    },
    {
      id: 'tb2',
      title: 'Order 3-Tier Golden Truffle Birthday Cake',
      description: 'Confirm eggless chocolate truffle with edible gold leaf detailing.',
      category: 'booking',
      priority: 'medium',
      dueDate: '2026-12-05',
      completed: false,
      phase: '14_days',
    },
    {
      id: 'tb3',
      title: 'Finalize Acoustic Band Song Playlist',
      description: 'Pick favorite 70s and 80s RD Burman and Kishore Kumar classics.',
      category: 'planning',
      priority: 'medium',
      dueDate: '2026-12-08',
      completed: true,
      phase: '7_days',
    },
  ],
  vendors: [
    {
      id: 'vb1',
      name: 'Whispering Palms Haveli & Gardens',
      category: 'venue',
      contactPerson: 'Bhawani Singh',
      phone: '+91 94140 22334',
      email: 'events@whisperingpalmsjaipur.com',
      estimatedPrice: 28000,
      status: 'booked',
      rating: 4.9,
      notes: 'Included royal round table setup and garden illumination.',
      location: 'Civil Lines, Jaipur',
    },
    {
      id: 'vb2',
      name: 'Royal Rasoi Caterers',
      category: 'catering',
      contactPerson: 'Mahesh Sharma',
      phone: '+91 98290 88771',
      email: 'rasoi@royalheritage.in',
      estimatedPrice: 48000,
      status: 'booked',
      rating: 4.8,
      notes: 'Renowned for Dal Bukhara and live rabri jalebi counter.',
      location: 'MI Road, Jaipur',
    },
  ],
  creativeAssets: [
    {
      id: 'cb1',
      type: 'invitation',
      title: 'Royal Family WhatsApp & Card Invite',
      content:
        '✨ *Celebrating 50 Years of Wonderful Memories!* ✨\n\nFive decades of kindness, laughter, and inspiring journeys. We invite you to join us for an evening of vintage music, royal feasting, and heartfelt joy as we celebrate the Golden 50th Birthday of our beloved\n\n🌟 *Rajiv Malhotra* 🌟\n\n📅 *Date:* Tuesday, 15th December 2026\n⏰ *Time:* 6:30 PM onwards\n📍 *Venue:* Whispering Palms Heritage Lawn, Civil Lines, Jaipur\n👔 *Attire:* Indian Festive / Elegant Evening Wear\n\n_Your presence and blessings are the greatest gift._\nWarmly,\nMalhotra Family',
      tags: ['Royal', 'Family', 'Warm'],
    },
    {
      id: 'cb2',
      type: 'speech',
      title: 'Emotional Daughter’s Birthday Toast',
      content:
        '“Good evening everyone. Standing here looking at Dad, 50 doesn’t look like half a century of age — it looks like fifty years of courage, unconditional love, and late-night life advice. Thank you for teaching me how to stay grounded in the storms and how to dance in the sunshine. Here is to the man who made our family our favorite place in the world. Happy 50th Birthday, Dad! Cheers!”',
      tags: ['Speech', 'Emotional', 'Birthday Toast'],
    },
  ],
};

// Initial default events
const DEFAULT_EVENTS: EventPlan[] = [SAMPLE_FRESHERS_EVENT, SAMPLE_BIRTHDAY_EVENT];

export const StorageService = {
  getEvents(): EventPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
        return DEFAULT_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_EVENTS;
    }
  },

  getEventById(id: string): EventPlan | undefined {
    const events = this.getEvents();
    return events.find((e) => e.id === id);
  },

  getActiveEventId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    if (id) {
      const exists = this.getEventById(id);
      if (exists) return id;
    }
    const events = this.getEvents();
    const firstId = events[0]?.id || SAMPLE_FRESHERS_EVENT.id;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, firstId);
    return firstId;
  },

  getActiveEvent(): EventPlan {
    const id = this.getActiveEventId();
    const event = this.getEventById(id);
    if (event) return event;
    const events = this.getEvents();
    return events[0] || SAMPLE_FRESHERS_EVENT;
  },

  setActiveEventId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
    window.dispatchEvent(new CustomEvent('celebration:active-event-changed', { detail: id }));
  },

  saveEvent(updatedEvent: EventPlan): void {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === updatedEvent.id);
    const stamped = { ...updatedEvent, updatedAt: new Date().toISOString() };

    if (index >= 0) {
      events[index] = stamped;
    } else {
      events.unshift(stamped);
    }

    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('celebration:event-updated', { detail: stamped }));
  },

  createEvent(newEvent: EventPlan): void {
    const events = this.getEvents();
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.setActiveEventId(newEvent.id);
  },

  deleteEvent(id: string): void {
    let events = this.getEvents();
    events = events.filter((e) => e.id !== id);
    if (events.length === 0) {
      events = [SAMPLE_FRESHERS_EVENT];
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    this.setActiveEventId(events[0].id);
    window.dispatchEvent(new CustomEvent('celebration:event-deleted', { detail: id }));
  },

  resetToSampleData(): EventPlan[] {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
    this.setActiveEventId(SAMPLE_FRESHERS_EVENT.id);
    window.dispatchEvent(new CustomEvent('celebration:data-reset'));
    return DEFAULT_EVENTS;
  },

  getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
  },

  setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
  },

  exportData(): string {
    const events = this.getEvents();
    return JSON.stringify({ events, version: '1.0', exportedAt: new Date().toISOString() }, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.events) && parsed.events.length > 0) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(parsed.events));
        this.setActiveEventId(parsed.events[0].id);
        window.dispatchEvent(new CustomEvent('celebration:data-reset'));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
