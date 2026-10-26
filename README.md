# CelebrationAI — Your Smart Event Planning Assistant 🎉

**CelebrationAI** is an AI-powered celebration and event planning web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It is tailored for modern Indian celebrations — birthdays, weddings, anniversaries, college freshers' parties, campus cultural fests, graduations, and community galas.

---

## 🌟 Key Features

### 1. 🧙‍♂️ Smart Event Creation Wizard
- **Guided 3-Step Wizard:** Collects event type, date, location, guest count, target budget in INR, venue preference (indoor, outdoor, hybrid, rooftop, beach, ballroom), food preferences (veg, non-veg, Jain, cocktail finger food, thali), theme, and special constraints.
- **One-Click Presets:** Instant presets for a 300-student College Freshers' party, 250-guest Royal Wedding, 75-guest 25th Rooftop Birthday, and 500-student Cultural Fest.
- **Micro-Animations & Confetti:** Celebratory feedback on milestone completion.

### 2. 🤖 Context-Aware AI Event Assistant
- **Bespoke Event Concepts:** Generates custom themes, aesthetic summaries, vibe keywords, and color palettes with copyable HEX codes.
- **Interactive Conversational AI:** Chat with the assistant directly from the dashboard to refine plans, request budget cuts, or adjust catering.
- **Section-by-Section Refinement:** Re-generate individual sections (Concept, Catering, Entertainment, Emergency Backup, Schedule) without losing budget or task data.
- **Emergency Contingency Protocols:** Structured risk mitigation for weather, audio/sound permits, and vendor replacements.

### 3. 💰 Smart INR Budget Planner
- **Automatic Budget Allocation:** Dynamically distributes funds across 8 core categories based on proven industry benchmarks:
  - *Venue & Spaces*
  - *Food & Catering*
  - *Decor & Ambience*
  - *Photography & Cinema*
  - *Entertainment & DJ*
  - *Invites & Favors*
  - *Logistics & Transport*
  - *Emergency & Miscellaneous*
- **Itemized Expense Tracker:** Add, edit, delete expenses with payment status tracking (`Pending`, `Deposit Paid`, `Paid in Full`).
- **Deficit Alerts & Progress Gauges:** Immediate visual warnings when expenses exceed target allocations.
- **AI Cost-Saving Recommendations:** Concrete recommendations showing estimated INR savings (e.g., save ₹18,000 on sound, ₹22,000 on finger-food catering) with one-click application to the active budget.

### 4. ⏱️ Milestone Timeline & Task Checklist
- **Phased Preparation Countdown:** Structured milestones for 30 Days Before, 14 Days Before, 7 Days Before, 1 Day Before, and Event Day.
- **Filterable Task Checklist:** Filter by status (`All`, `Pending`, `Completed`, `Overdue`) and priority (`High`, `Medium`, `Low`).
- **Ready-Made Checklist Templates:** One-click injection of curated task templates for Weddings, Birthdays, and College Fests.
- **Milestone Confetti:** Triggers confetti bursts when tasks are completed.

### 5. 👥 Vendor & Venue Management
- **Curated Vendor Directory:** Sample listings calibrated to realistic Indian market rates for caterers, DJs, photographers, venues, and decorators.
- **Quotation Comparison:** Track vendor status (`Inquiry`, `Quote Received`, `Shortlisted`, `Booked`, `Rejected`).
- **One-Click Budget Sync:** Automatically add accepted vendor quotes into your itemized Budget Planner.

### 6. 🎨 Personalized Creative Studio
- **AI Text Generator:** Instant creation of:
  - WhatsApp & Digital Invitations (customized by tone: Student Hype, Royal Indian, Emotional, Formal)
  - Instagram Reels Captions & Trending Hashtags
  - Host Opening Speeches & Milestone Toasts
  - Catchy Event Taglines & Day-Of Schedules
- **One-Click Copy:** Click-to-copy button with toast feedback.

### 7. ⚙️ Settings & Data Resilience
- **Dual AI Engine:** Built-in zero-latency smart rule engine (works 100% offline) or optional Google Gemini API key integration.
- **JSON Backup & Restore:** Complete export and import of all event data.
- **Demo Reset:** One-click button to reload the two pre-configured showcase events.

---

## 🎯 Pre-Loaded Demo Showcases

The application comes pre-loaded with two detailed demo events:

1. **Neon Euphoria 2026 — College Freshers' Welcome**
   - **Type:** College Fest / Freshers' Party
   - **Scale:** 350 Guests | Budget: ₹2,50,000
   - **Location:** The Grand Courtyard & Amphitheatre, Bengaluru
   - **Highlights:** Cyberpunk neon glow theme, UV blacklight tunnels, DJ Rayne booking, 360-degree slow-mo video booth, finger-food slider counters, digital WhatsApp passes.

2. **Royal Velvet Jubilee — Rajiv's 50th Birthday**
   - **Type:** Milestone Birthday
   - **Scale:** 65 Guests | Budget: ₹1,20,000
   - **Location:** Whispering Palms Heritage Lawn & Haveli, Jaipur
   - **Highlights:** Rajasthani royal heritage theme, acoustic retro Bollywood ghazal ensemble, nostalgic 50-year memory lane walkway, royal buffet.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd "c:/Users/rohit/Celebration & Event Planner"

# Install dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Architecture

```
Celebration & Event Planner/
├── src/
│   ├── types/
│   │   └── event.ts             # Core TypeScript models (EventPlan, Expense, Task, Vendor, etc.)
│   ├── services/
│   │   ├── storage.ts           # LocalStorage persistence, demo events seed & JSON backup
│   │   ├── aiService.ts         # Dual AI engine (Gemini API + smart local generator)
│   │   └── budgetTemplates.ts   # Indian event allocation benchmark formulas & INR formatters
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Event switcher, navigation tabs, quick CTA
│   │   │   └── Footer.tsx       # Branding and quick links
│   │   ├── common/
│   │   │   ├── MetricCard.tsx   # Ambient glowing stat card
│   │   │   ├── ProgressBar.tsx  # Dynamic health progress bar
│   │   │   ├── Badge.tsx        # Priority, status & category badges
│   │   │   └── Modal.tsx        # Accessible dialog wrapper
│   │   ├── landing/
│   │   │   └── LandingPage.tsx  # Hero, interactive Quick Estimator, feature grid, demo openers
│   │   ├── wizard/
│   │   │   └── EventWizard.tsx  # Guided 3-step event creation wizard with presets
│   │   ├── dashboard/
│   │   │   └── DashboardOverview.tsx # Metrics, budget health, days countdown, AI chat assistant
│   │   ├── event/
│   │   │   └── EventOverview.tsx # AI concept breakdown, palette swatches, menu, schedule, backup plan
│   │   ├── budget/
│   │   │   └── BudgetPlanner.tsx # 8 category allocation cards, expense table, AI cost-saving tips
│   │   ├── timeline/
│   │   │   └── TimelineView.tsx # Phased timeline, filterable tasks, templates, confetti
│   │   ├── vendors/
│   │   │   └── VendorManager.tsx # Service vendor directory, quotes, budget synchronization
│   │   ├── creative/
│   │   │   └── CreativeStudio.tsx # AI invitation, caption, speech generator with 1-click copy
│   │   └── settings/
│   │       └── SettingsView.tsx # Gemini API key, JSON export/import, demo reset
│   ├── App.tsx                  # Master state orchestration & view router
│   ├── index.css                # Tailwind CSS v4 setup and custom animation styles
│   └── main.tsx                 # React DOM root entry
├── index.html                   # HTML template with Google Fonts (Outfit & Plus Jakarta Sans)
├── package.json                 # Dependencies & build scripts
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
└── README.md                    # Project documentation & demo guide
```

---

## 🔒 Security & Privacy
- **No Hardcoded Keys:** Environment variables and browser localStorage are used. No secrets are committed into code.
- **Client-Side Privacy:** All event details, budgets, and guest information remain inside the user's browser localStorage unless explicitly exported as JSON.
- **Graceful Fallbacks:** The app runs with 100% functionality even when no API key or external network is provided.

---

## 🔮 Future Enhancements
- Multi-user collaboration with real-time Supabase sync and role-based permissions.
- Direct WhatsApp Business API integration for automated RSVP tracking.
- Interactive 2D/3D venue floor planner for seating arrangements.
- Payment gateway integration for vendor advance deposits.
