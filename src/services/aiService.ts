import type {
  AIPlanSection,
  CreativeAsset,
  EventPlan,
  EventType,
  ExpenseItem,
  FoodPreference,
  TaskItem,
  VenueType,
  VendorItem,
} from '../types/event';
import { StorageService } from './storage';
import { DEFAULT_ALLOCATION_PERCENTAGES } from './budgetTemplates';

export interface EventCreationParams {
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  preferredTheme: string;
  decorationStyle: string;
  foodPreference: FoodPreference;
  venueType: VenueType;
  specialRequirements: string;
}

/**
 * Intelligent AI Engine for CelebrationAI
 * Integrates optional real Gemini API if key is supplied,
 * with guaranteed hyper-realistic, localized Indian market planning fallback.
 */
export const AIService = {
  /**
   * Main generator: creates complete event plan with AI concept,
   * itemized INR expenses, actionable timeline tasks, realistic vendors, and creative copies.
   */
  async generateEventPlan(params: EventCreationParams): Promise<EventPlan> {
    const id = `event-${Date.now()}`;
    const now = new Date().toISOString();

    // Check if user has Gemini key configured
    const apiKey = StorageService.getApiKey() || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

    let aiPlan: AIPlanSection;

    if (apiKey) {
      try {
        aiPlan = await this.callGeminiForPlan(params, apiKey);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart local generator:', err);
        aiPlan = this.synthesizeSmartLocalPlan(params);
      }
    } else {
      // Simulate brief realistic AI reasoning latency (400ms) for delightful UX
      await new Promise((resolve) => setTimeout(resolve, 400));
      aiPlan = this.synthesizeSmartLocalPlan(params);
    }

    // Build balanced INR expenses calibrated to total budget
    const expenses = this.generateItemizedExpenses(params);

    // Build timeline tasks adapted to the event date and type
    const tasks = this.generateActionableTasks(params);

    // Build realistic vendor suggestions tailored to location and event type
    const vendors = this.generateVendorDirectory(params);

    // Build initial creative studio starter pack
    const creativeAssets = this.generateStarterCreatives(params, aiPlan);

    const fullPlan: EventPlan = {
      id,
      title: params.title || `${this.formatTypeName(params.type)} Celebration`,
      type: params.type,
      date: params.date,
      location: params.location || 'India',
      guestCount: params.guestCount,
      totalBudget: params.totalBudget,
      preferredTheme: params.preferredTheme,
      decorationStyle: params.decorationStyle,
      foodPreference: params.foodPreference,
      venueType: params.venueType,
      specialRequirements: params.specialRequirements,
      createdAt: now,
      updatedAt: now,
      aiPlan,
      expenses,
      tasks,
      vendors,
      creativeAssets,
    };

    return fullPlan;
  },

  /**
   * Refine or regenerate an individual section of an existing plan
   */
  async refineSection(
    currentPlan: EventPlan,
    section: 'concept' | 'catering' | 'entertainment' | 'backup' | 'schedule',
    userPrompt: string
  ): Promise<Partial<AIPlanSection>> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const isBudgetFocus = userPrompt.toLowerCase().includes('budget') || userPrompt.toLowerCase().includes('save') || userPrompt.toLowerCase().includes('cheap');
    const isTraditional = userPrompt.toLowerCase().includes('traditional') || userPrompt.toLowerCase().includes('indian') || userPrompt.toLowerCase().includes('desi');

    if (section === 'concept') {
      return {
        conceptTitle: isTraditional
          ? `Parampara & Utsav: A Grand Heritage ${this.formatTypeName(currentPlan.type)}`
          : isBudgetFocus
          ? `SmartChic: High-Impact Aesthetic ${this.formatTypeName(currentPlan.type)}`
          : `Spectacular Elegance: Reimagined ${currentPlan.title}`,
        conceptSummary: isTraditional
          ? `Infused with rich Indian heritage, traditional marigold florals, live classical instrumental welcome, and authentic cultural hospitality for ${currentPlan.guestCount} guests.`
          : isBudgetFocus
          ? `Streamlined high-impact format maximizing visual photo-ops and social moments while optimizing per-guest catering and rental spends under ₹${currentPlan.totalBudget.toLocaleString('en-IN')}.`
          : `A bespoke celebration custom-calibrated for ${currentPlan.guestCount} guests in ${currentPlan.location}, combining lively entertainment and heartfelt hospitality.`,
      };
    }

    if (section === 'catering') {
      return {
        cateringSuggestions: isTraditional
          ? [
              'Royal Rajasthani & Awadhi Thali with Dal Baati Churma and fragrant Dum Biryani',
              'Live Chaat & Golgappa counter with 5 flavored waters',
              'Traditional Brass Urli Beverage Station with Kesar Badam Milk & Masala Chai',
              'Hot Jalebi with Rabri & Warm Gulab Jamun live counter',
            ]
          : isBudgetFocus
          ? [
              'Curated Street Food live cart: Pav Bhaji, Momos, and Grilled Sandwiches (saves 30% vs heavy buffet)',
              'Finger Food Sliders & Peri-Peri Fries with refreshing cooler mocktails',
              'Single Signature Main Course: Dum Handi Biryani with Raita & Salan',
              'Individual Gourmet Dessert Pots & Ice Cream Sundae Bar',
            ]
          : [
              'Artisanal grazing tables with cheeses, dips, and Mediterranean flatbreads',
              'Live Teppanyaki & Wood-fired stone oven pizza station',
              'Signature crafted mocktails infused with fresh botanical herbs and citrus',
              'Gourmet dessert platter featuring Belgian chocolate tarts and seasonal fruit parfaits',
            ],
      };
    }

    if (section === 'entertainment') {
      return {
        entertainmentIdeas: isTraditional
          ? [
              'Live Sufi & Bollywood Acoustic Qawwali fusion band',
              'Traditional Dhol drummers welcome entrance for high-energy fanfare',
              'Interactive Dandiya or Antakshari family round',
            ]
          : isBudgetFocus
          ? [
              'Campus / Local talented student DJ with curated high-energy Spotify playlist',
              'Digital Interactive Trivia & Quiz hosted via QR code on guests’ smartphones',
              'DIY photo-prop challenge with prizes for the best Instagram reel',
            ]
          : [
              'Celebrity Emcee / Host to orchestrate lively group games and storytelling',
              'Synchronized intelligent lighting show paired with live percussionist & DJ',
              'Surprise flashmob or choreographed family/friend performance',
            ],
      };
    }

    if (section === 'backup') {
      return {
        backupPlan: {
          weatherRisk: `Monsoon / Rain contingency: Waterproof canopy pre-booked or indoor banquet backup at ${currentPlan.location}.`,
          vendorContingency: `All key vendors signed with a guaranteed 4-hour replacement clause in case of equipment or personnel emergency.`,
          powerSoundContingency: `Dedicated dual-line generator with automatic changeover switch (AMF) to ensure no audio interruption.`,
        },
      };
    }

    return {};
  },

  /**
   * Conversational Assistant Chat
   */
  async chatWithAssistant(
    event: EventPlan,
    userMessage: string,
    _history: { role: string; text: string }[]
  ): Promise<string> {
    const query = userMessage.toLowerCase();
    const guestCount = event.guestCount;
    const budget = event.totalBudget;
    const formattedBudget = `₹${budget.toLocaleString('en-IN')}`;

    // Contextual responses based on actual event details
    if (query.includes('budget') || query.includes('cost') || query.includes('save') || query.includes('money')) {
      return `For **${event.title}** with a budget of **${formattedBudget}** and **${guestCount} guests** (approx. ₹${Math.round(budget / guestCount).toLocaleString('en-IN')} per guest):
1. **Catering Strategy:** Switch from a 25-item lavish buffet to a curated 12-item live counter + signature biryani menu. This cuts food wastage and immediately saves approx ₹${Math.round(budget * 0.08).toLocaleString('en-IN')}.
2. **Decor Smart Spend:** Focus 70% of your decor budget on 2 high-impact focal points (the stage/backdrop and the entrance arch) where photos happen. Use warm fairy lights and ambient uplighting rather than expensive fresh floral walls.
3. **Invitations:** Transition completely to digital animated WhatsApp invitations with interactive RSVP links to save printing & courier costs.
Would you like me to update your budget planner with these allocations?`;
    }

    if (query.includes('theme') || query.includes('traditional') || query.includes('decor')) {
      return `Here are 3 distinct creative themes tailored for **${event.title}** (${event.location}, ${event.venueType} venue):
- **Theme 1: Royal Marigold & Velvet Heritage (Desi Opulence)**
  * *Color Palette:* Deep Crimson, Saffron, Antique Gold, Emerald.
  * *Elements:* Brass urlis with floating candles, marigold canopies, warm fairy light tunnels, wooden diwans with mirror-work cushions.
- **Theme 2: Bohemian Sunset Garden (Contemporary Chic)**
  * *Color Palette:* Dusty Rose, Sage Green, Champagne, Ivory.
  * *Elements:* Pampas grass arches, fairy light canopies, rattan lounge seating, botanical greens.
- **Theme 3: Retro Neon Disco (Electrifying Energy)**
  * *Color Palette:* Electric Cyan, Hot Pink, Cyber Violet, Midnight Black.
  * *Elements:* UV blacklights, holographic backdrops, neon sign photo walls, glow wristbands.
Which of these vibes would you like to apply to your event?`;
    }

    if (query.includes('vendor') || query.includes('caterer') || query.includes('dj') || query.includes('photographer')) {
      return `For **${event.title}** in **${event.location}**:
- **Venue & Sound Permissions:** For a ${event.venueType} setup with ${guestCount} guests, ensure local municipal sound clearance is filed 7 days in advance for music past 10 PM.
- **Catering Rule of Thumb:** Cater for ${Math.round(guestCount * 1.08)} portions (a +8% buffer) to prevent food shortage without over-committing budget.
- **Photography Tip:** Request both 1 cinematic reel video specialist (for 30-sec Instagram highlights) and 1 traditional portrait photographer for family group shots.
Check the **Vendors tab** where I have pre-calculated sample vendor quotes within your ${formattedBudget} budget!`;
    }

    if (query.includes('schedule') || query.includes('timeline') || query.includes('flow')) {
      return `Here is an optimized timeline for **${event.title}** to keep your ${guestCount} guests engaged:
- **T-0 min (Entrance):** Guest arrival, signature welcome drinks, and instant photo-booth moments.
- **T+45 min (Opening):** Emcee welcome, lighting of the lamp / cake cutting / opening performance.
- **T+90 min (Interactive Highlight):** Group trivia, awards, speeches, or dance showcase.
- **T+120 min (Feast):** Live food counters and dinner buffet open while soft background music plays.
- **T+180 min (Peak Energy):** DJ floor opens with high-energy tracks and celebratory confetti blast!
- **T+240 min (Wrap-up):** Return favors distribution, final group photograph, and warm send-off.`;
    }

    // Default intelligent response
    return `I am analyzing your event **"${event.title}"** scheduled for **${event.date}** in **${event.location}** for **${guestCount} guests** with a budget of **${formattedBudget}**.

Here is what I recommend prioritizing right now:
1. **Confirm Key Bookings:** Ensure your ${event.venueType} venue and primary caterer are locked in with advance deposits.
2. **Review AI Budget:** Check the Budget tab to see the recommended allocation of ${formattedBudget} across all 8 essential categories.
3. **Explore Creative Studio:** Generate customized WhatsApp invitations and Instagram captions ready to share with your guests.

What specific aspect would you like to refine next? Budget savings, menu ideas, or theme details?`;
  },

  /**
   * Internal Gemini API caller (when user provides key)
   */
  async callGeminiForPlan(params: EventCreationParams, apiKey: string): Promise<AIPlanSection> {
    const prompt = `You are CelebrationAI, an expert Indian event architect. Generate a complete structured event plan for:
Event Name: ${params.title}
Event Type: ${params.type}
Date: ${params.date}
Location: ${params.location}
Guest Count: ${params.guestCount}
Total Budget: INR ${params.totalBudget}
Theme: ${params.preferredTheme}
Decor Style: ${params.decorationStyle}
Food Preference: ${params.foodPreference}
Venue Type: ${params.venueType}
Special Requirements: ${params.specialRequirements}

Return ONLY valid JSON matching this exact structure:
{
  "conceptTitle": "string",
  "conceptSummary": "string",
  "themeStyle": "string",
  "colorPalette": [{"name": "string", "hex": "#hex"}],
  "vibeKeywords": ["string"],
  "cateringSuggestions": ["string"],
  "entertainmentIdeas": ["string"],
  "guestExperienceHighlights": ["string"],
  "costSavingTips": [{"tip": "string", "estimatedSavingsINR": 10000}],
  "backupPlan": {
    "weatherRisk": "string",
    "vendorContingency": "string",
    "powerSoundContingency": "string"
  },
  "suggestedSchedule": [{"time": "string", "activity": "string"}]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');
    return JSON.parse(rawText) as AIPlanSection;
  },

  /**
   * Smart deterministic generator that produces deep, personalized results based on inputs
   */
  synthesizeSmartLocalPlan(params: EventCreationParams): AIPlanSection {
    const type = params.type;
    const isCollege = type === 'freshers' || type === 'college_fest' || type === 'graduation';
    const isWedding = type === 'wedding' || type === 'anniversary';
    const isBirthday = type === 'birthday';

    const conceptTitle = isCollege
      ? `${params.title || 'Euphoria Fest'} — Ignite The Legacy`
      : isWedding
      ? `${params.title || 'Eternal Vows'} — A Royal Symphony`
      : isBirthday
      ? `${params.title || 'Milestone Celebration'} — Joyous Memories`
      : `${params.title || 'Celebration'} — An Evening to Remember`;

    const conceptSummary = isCollege
      ? `A dynamic, high-octane celebration crafted for ${params.guestCount} students in ${params.location || 'campus'}. Features immersive ${params.preferredTheme || 'vibrant'} decor, pulse-pounding sound stages, interactive social media photo zones, and seamless youth hospitality.`
      : isWedding
      ? `A magical, heartfelt celebration honoring love and family traditions. Designed for ${params.guestCount} guests with ${params.decorationStyle || 'elegant florals'}, personalized hospitality, royal culinary delights, and unforgettable sentimental milestones.`
      : isBirthday
      ? `A vibrant and joyous birthday experience celebrating life with ${params.guestCount} close family and friends. Highlights include heartfelt milestone tributes, personalized photo galleries, and an energetic party atmosphere.`
      : `A meticulously planned gathering for ${params.guestCount} guests in ${params.location}, optimizing entertainment and hospitality within a smart ₹${params.totalBudget.toLocaleString('en-IN')} budget.`;

    const colorPalette = isCollege
      ? [
          { name: 'Electric Cyan', hex: '#00f0ff' },
          { name: 'Neon Purple', hex: '#8a2be2' },
          { name: 'Bright Magenta', hex: '#ff1493' },
          { name: 'Deep Onyx', hex: '#111827' },
        ]
      : isWedding
      ? [
          { name: 'Royal Crimson', hex: '#800020' },
          { name: 'Champagne Gold', hex: '#d4af37' },
          { name: 'Pearl Cream', hex: '#fdfbf7' },
          { name: 'Emerald Green', hex: '#046307' },
        ]
      : [
          { name: 'Celebration Violet', hex: '#7c3aed' },
          { name: 'Rose Gold', hex: '#b76e79' },
          { name: 'Amber Sunshine', hex: '#f59e0b' },
          { name: 'Midnight Navy', hex: '#0f172a' },
        ];

    const vibeKeywords = isCollege
      ? ['High-Energy', 'Electrifying', 'Memorable', 'Youthful', 'Social-First']
      : isWedding
      ? ['Timeless', 'Opulent', 'Soulful', 'Heartwarming', 'Magical']
      : ['Festive', 'Cherished', 'Lively', 'Welcoming', 'Vibrant'];

    const cateringSuggestions =
      params.foodPreference === 'pure_veg' || params.foodPreference === 'jain_available'
        ? [
            'Artisanal Paneer Tikka & Saffron Malai Chaap starters with mint chutney',
            'Live Delhi Chaat & Crispy Pani Puri counter with mineral water infusions',
            'Rich Royal Thali: Dal Makhani, Paneer Lababdar, Vegetable Pulao & Tandoori Breads',
            'Hot Moong Dal Halwa, Rabri Jalebi & Gourmet Kulfi counter',
          ]
        : params.foodPreference === 'cocktail_finger_food'
        ? [
            'Gourmet Slider & Mini Burger Bar with peri-peri fries',
            'Crispy Chicken Popcorn & Paneer Bites with spicy dips',
            'Wood-fired thin crust mini pizzas served hot from live oven',
            'Mocktail bar: Electric Blue Curacao, Virgin Mojito, and Mango Chili Fizz',
          ]
        : [
            'Welcome Drinks: Saffron Kesar Thandai & Sparkling Berry Coolers',
            'Mixed Starters: Murgh Malai Tikka, Crispy Corn Tarts, and Fish Amritsari',
            'Main Buffet: Awadhi Dum Biryani, Mutton Rogan Josh, Paneer Butter Masala, and Assorted Naans',
            'Dessert Extravaganza: Warm Walnut Brownie with Vanilla Gelato & Gulab Jamun',
          ];

    const entertainmentIdeas = isCollege
      ? [
          'High-energy student DJ battle with laser cannons and fog blasters',
          'Mr. & Ms. Contest with creative rapid-fire questions and talent showcase',
          '360-degree rotating slow-motion video booth with instant WhatsApp sharing',
        ]
      : isWedding
      ? [
          'Live 4-piece acoustic Bollywood & Sufi ensemble',
          'Choreographed family Sangeet dance performances',
          'Surprise retrospective couple documentary film',
        ]
      : [
          'Emcee hosting interactive trivia, musical chairs & milestone games',
          'Live acoustic singer performing retro and trending classics',
          'Personalized photo memory wall with instant polaroid souvenirs',
        ];

    const guestExperienceHighlights = [
      'Personalized welcome badge / gift favor upon arrival',
      'Dedicated Instagram-worthy photo zone with customized neon name sign',
      'Real-time photo sharing via QR code memory gallery',
      'Comfortable lounge seating area for easy conversations',
    ];

    const costSavingTips = [
      {
        tip: 'Optimize guest RSVP tracking 5 days prior to reduce food head-count buffer from 15% to 5%',
        estimatedSavingsINR: Math.round(params.totalBudget * 0.07),
      },
      {
        tip: 'Bundle photography and cinematic videography with a single studio team for combined discount',
        estimatedSavingsINR: Math.round(params.totalBudget * 0.04),
      },
      {
        tip: 'Use digital animated WhatsApp invitations instead of physical boxed cards',
        estimatedSavingsINR: Math.min(10000, Math.round(params.totalBudget * 0.03)),
      },
    ];

    const backupPlan = {
      weatherRisk:
        params.venueType === 'outdoor'
          ? `Emergency weather plan: Waterproof high-peak marquee tent and adjacent indoor shelter reserved in case of sudden rain.`
          : `Indoor climate-controlled venue with backup AC power units verified.`,
      vendorContingency: `Key service agreements include pre-vetted replacement clauses for caterer, sound engineer, and decorator.`,
      powerSoundContingency: `Dedicated 25kVA silent generator unit on standby with automatic switch-over to prevent sound interruption.`,
    };

    const suggestedSchedule = [
      { time: '05:00 PM', activity: 'Venue Open, Guest Welcome Drinks & Photo Booth Sessions' },
      { time: '06:00 PM', activity: 'Opening Remarks, Emcee Kick-off & Welcome Speeches' },
      { time: '07:00 PM', activity: 'Main Showcase: Performances, Milestone Ceremony & Games' },
      { time: '08:15 PM', activity: 'Celebration Feast: Dinner Buffet & Live Food Counters Open' },
      { time: '09:15 PM', activity: 'Open Dance Floor & Music Finale' },
      { time: '10:30 PM', activity: 'Return Gifts Handout & Warm Send-Off' },
    ];

    return {
      conceptTitle,
      conceptSummary,
      themeStyle: params.preferredTheme || 'Contemporary Celebration Chic',
      colorPalette,
      vibeKeywords,
      cateringSuggestions,
      entertainmentIdeas,
      guestExperienceHighlights,
      costSavingTips,
      backupPlan,
      suggestedSchedule,
    };
  },

  /**
   * Generate balanced expenses matching user's budget and event type
   */
  generateItemizedExpenses(params: EventCreationParams): ExpenseItem[] {
    const budget = params.totalBudget;
    const percentages = DEFAULT_ALLOCATION_PERCENTAGES[params.type] || DEFAULT_ALLOCATION_PERCENTAGES.birthday;

    const items: ExpenseItem[] = [
      {
        id: `exp-${Date.now()}-1`,
        category: 'venue',
        name: `${this.formatVenueName(params.venueType)} Booking & Setup Fee`,
        plannedAmount: Math.round((budget * percentages.venue) / 100),
        actualAmount: 0,
        status: 'pending',
        notes: `Selected for ${params.guestCount} guests in ${params.location}`,
      },
      {
        id: `exp-${Date.now()}-2`,
        category: 'catering',
        name: `Food Buffet & Live Counters (${params.guestCount} guests)`,
        plannedAmount: Math.round((budget * percentages.catering) / 100),
        actualAmount: 0,
        status: 'pending',
        notes: `Preference: ${params.foodPreference.replace(/_/g, ' ')}`,
      },
      {
        id: `exp-${Date.now()}-3`,
        category: 'decoration',
        name: `Theme Decor, Floral Stages & Ambient Lighting`,
        plannedAmount: Math.round((budget * percentages.decoration) / 100),
        actualAmount: 0,
        status: 'pending',
        notes: `Style: ${params.decorationStyle || 'Modern Festive'}`,
      },
      {
        id: `exp-${Date.now()}-4`,
        category: 'photography',
        name: `Candid Photography & Highlights Video`,
        plannedAmount: Math.round((budget * percentages.photography) / 100),
        actualAmount: 0,
        status: 'pending',
      },
      {
        id: `exp-${Date.now()}-5`,
        category: 'entertainment',
        name: `DJ Console, Sound Rigs, Mic & Lighting`,
        plannedAmount: Math.round((budget * percentages.entertainment) / 100),
        actualAmount: 0,
        status: 'pending',
      },
      {
        id: `exp-${Date.now()}-6`,
        category: 'invitations',
        name: `Custom Digital Invites, Favors & Welcome Kit`,
        plannedAmount: Math.round((budget * percentages.invitations) / 100),
        actualAmount: 0,
        status: 'pending',
      },
      {
        id: `exp-${Date.now()}-7`,
        category: 'logistics',
        name: `Guest Transport, Valet & Staff Coordination`,
        plannedAmount: Math.round((budget * percentages.logistics) / 100),
        actualAmount: 0,
        status: 'pending',
      },
      {
        id: `exp-${Date.now()}-8`,
        category: 'miscellaneous',
        name: `Emergency Buffer & Unforeseen Spends`,
        plannedAmount: Math.round((budget * percentages.miscellaneous) / 100),
        actualAmount: 0,
        status: 'pending',
      },
    ];

    return items;
  },

  /**
   * Generate actionable timeline tasks based on event date
   */
  generateActionableTasks(params: EventCreationParams): TaskItem[] {
    const eventDate = new Date(params.date);
    const formatDate = (daysOffset: number) => {
      const d = new Date(eventDate);
      d.setDate(d.getDate() - daysOffset);
      return d.toISOString().split('T')[0];
    };

    return [
      {
        id: `t-${Date.now()}-1`,
        title: 'Lock In & Finalize Venue Booking',
        description: `Confirm reservation in ${params.location} with signed contract and deposit.`,
        category: 'booking',
        priority: 'high',
        dueDate: formatDate(30),
        completed: false,
        phase: '30_days',
      },
      {
        id: `t-${Date.now()}-2`,
        title: 'Finalize Catering Menu Tasting & Quote',
        description: `Verify food portions for ${params.guestCount} guests with dietary requirements.`,
        category: 'booking',
        priority: 'high',
        dueDate: formatDate(25),
        completed: false,
        phase: '30_days',
      },
      {
        id: `t-${Date.now()}-3`,
        title: 'Book DJ / Entertainment & Sound System',
        description: 'Ensure audio engineer and sound permits are confirmed.',
        category: 'booking',
        priority: 'medium',
        dueDate: formatDate(14),
        completed: false,
        phase: '14_days',
      },
      {
        id: `t-${Date.now()}-4`,
        title: 'Distribute Digital Invitations with RSVP Link',
        description: 'Send out customized WhatsApp messages and track confirmations.',
        category: 'guests',
        priority: 'high',
        dueDate: formatDate(14),
        completed: false,
        phase: '14_days',
      },
      {
        id: `t-${Date.now()}-5`,
        title: 'Confirm Final Headcount with Caterer & Venue',
        description: 'Lock in exact plates and table arrangements.',
        category: 'planning',
        priority: 'high',
        dueDate: formatDate(7),
        completed: false,
        phase: '7_days',
      },
      {
        id: `t-${Date.now()}-6`,
        title: 'Walkthrough Rehearsal & Lighting/Sound Check',
        description: 'Test microphones, playlist cues, and entrance lighting.',
        category: 'execution',
        priority: 'high',
        dueDate: formatDate(1),
        completed: false,
        phase: '1_day',
      },
      {
        id: `t-${Date.now()}-7`,
        title: 'Welcome Guests & Execute Day-Of Schedule',
        description: 'Coordinate with emcee, photographer, and catering lead.',
        category: 'execution',
        priority: 'high',
        dueDate: params.date,
        completed: false,
        phase: 'event_day',
      },
    ];
  },

  /**
   * Generate localized vendor recommendations
   */
  generateVendorDirectory(params: EventCreationParams): VendorItem[] {
    const loc = params.location || 'City Center';
    const budget = params.totalBudget;

    return [
      {
        id: `v-${Date.now()}-1`,
        name: `Grand Haven Banquet & Gardens`,
        category: 'venue',
        contactPerson: 'Sanjay Verma',
        phone: '+91 98200 45671',
        email: 'events@grandhaven.in',
        estimatedPrice: Math.round(budget * 0.22),
        status: 'quote_received',
        rating: 4.8,
        notes: `Accommodates up to ${params.guestCount + 50} guests with valet parking.`,
        location: loc,
      },
      {
        id: `v-${Date.now()}-2`,
        name: `Royal Spice Gourmet Caterers`,
        category: 'catering',
        contactPerson: 'Chef Ananya Rao',
        phone: '+91 98450 78912',
        email: 'contact@royalspicecaterers.com',
        estimatedPrice: Math.round(budget * 0.32),
        status: 'quote_received',
        rating: 4.9,
        notes: `Specializes in live interactive food counters and regional cuisine.`,
        location: loc,
      },
      {
        id: `v-${Date.now()}-3`,
        name: `Aura Floral & Production Studio`,
        category: 'decoration',
        contactPerson: 'Karan Mehra',
        phone: '+91 99100 33455',
        email: 'hello@auraproductions.in',
        estimatedPrice: Math.round(budget * 0.15),
        status: 'shortlisted',
        rating: 4.7,
        notes: `Customized stage backdrop, entrance arch, and table centerpieces.`,
        location: loc,
      },
      {
        id: `v-${Date.now()}-4`,
        name: `Lumière Cinematic Stories`,
        category: 'photography',
        contactPerson: 'Preeti Deshmukh',
        phone: '+91 97690 11223',
        email: 'info@lumierestories.co',
        estimatedPrice: Math.round(budget * 0.09),
        status: 'inquiry',
        rating: 4.8,
        notes: `Includes 2 candid photographers, teaser reel, and full high-res photo gallery.`,
        location: loc,
      },
    ];
  },

  /**
   * Generate initial creative assets
   */
  generateStarterCreatives(params: EventCreationParams, aiPlan: AIPlanSection): CreativeAsset[] {
    return [
      {
        id: `cr-${Date.now()}-1`,
        type: 'invitation',
        title: 'WhatsApp Official Invitation Card',
        content: `🎉 *You are Invited!* 🎉\n\nJoin us for the grand celebration of *${params.title}*!\n\n📅 *Date:* ${params.date}\n📍 *Venue:* ${params.location}\n✨ *Theme:* ${params.preferredTheme || aiPlan.themeStyle}\n👔 *Dress Code:* Festive Elegance\n\nExpect an unforgettable evening of delicious food, great music, and joyous moments. Kindly confirm your attendance!\n\n_We can't wait to celebrate with you!_`,
        tags: ['WhatsApp', 'Digital Invite'],
      },
      {
        id: `cr-${Date.now()}-2`,
        type: 'caption',
        title: 'Social Media & Instagram Captions',
        content: `Making memories that will outlast the music! ✨🥂 Blessed to celebrate ${params.title} with the best people in the world.\n\n#CelebrationAI #${params.type}Party #GoodTimes #MemoriesMade #CelebrationVibes`,
        tags: ['Instagram', 'Social Media'],
      },
      {
        id: `cr-${Date.now()}-3`,
        type: 'speech',
        title: 'Opening Host / Welcome Speech',
        content: `“Good evening ladies and gentlemen, honored guests, and dear friends! On behalf of everyone here, a heartfelt welcome to ${params.title}. Today is not just about a date on the calendar — it is about the friendships, the laughter, and the shared journey that brings all of us together in this room. Tonight, let the conversations flow, let the music take over, and let us make memories that we will look back on with smiles for years to come. Please enjoy the evening!”`,
        tags: ['Host Speech', 'Opening'],
      },
    ];
  },

  /**
   * Helper formatting
   */
  formatTypeName(type: EventType): string {
    const map: Record<EventType, string> = {
      birthday: 'Birthday',
      wedding: 'Wedding',
      anniversary: 'Anniversary',
      freshers: "Freshers' Party",
      college_fest: 'College Fest',
      graduation: 'Graduation Celebration',
      community: 'Community Event',
      corporate: 'Corporate Gala',
    };
    return map[type] || 'Celebration';
  },

  formatVenueName(v: VenueType): string {
    const map: Record<VenueType, string> = {
      indoor: 'Banquet Hall & AC Indoor Venue',
      outdoor: 'Open Lawn & Garden Venue',
      hybrid: 'Indoor-Outdoor Courtyard Venue',
      beach: 'Beachfront Pavilion',
      rooftop: 'Panoramic Rooftop Terrace',
      banquet: 'Luxury Hotel Ballroom',
    };
    return map[v] || 'Event Venue';
  },
};
