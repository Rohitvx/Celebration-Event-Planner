import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Wallet,
  Clock,
  Users,
  Palette,
  ShieldCheck,
  CheckCircle2,
  PartyPopper,
  Zap,
  Sliders,
  DollarSign,
  HeartHandshake,
  Music,
} from 'lucide-react';
import type { EventType, ActiveTab } from '../../types/event';
import { formatINR } from '../../services/budgetTemplates';

interface LandingPageProps {
  onOpenWizard: () => void;
  onSelectEvent: (eventId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWizard,
  onSelectEvent,
  setActiveTab,
}) => {
  // Quick interactive estimator state
  const [estType, setEstType] = useState<EventType>('freshers');
  const [estGuests, setEstGuests] = useState<number>(200);
  const [estBudget, setEstBudget] = useState<number>(150000);

  const calculateQuickEstimate = () => {
    const costPerGuest = Math.round(estBudget / estGuests);
    const cateringEst = Math.round(estBudget * 0.32);
    const venueEst = Math.round(estBudget * 0.22);
    const entertainmentEst = Math.round(estBudget * 0.18);
    return { costPerGuest, cateringEst, venueEst, entertainmentEst };
  };

  const estimate = calculateQuickEstimate();

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Mesh & Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-purple-700/20 via-indigo-600/20 to-amber-500/15 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-[600px] -left-40 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-[900px] -right-40 h-[450px] w-[450px] rounded-full bg-indigo-600/15 blur-3xl" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-inner animate-pulse-glow">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Next-Gen Event Architecture • Powered by CelebrationAI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] max-w-5xl mx-auto leading-[1.1]">
          Turn Event Ideas Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-400 to-pink-400">
            Flawless Celebrations
          </span>{' '}
          with Smart AI
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          From high-energy college fests and birthday galas to royal weddings and milestone anniversaries.
          Get personalized AI concepts, INR budget optimization, actionable timelines, and instant creative invitations.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenWizard}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 hover:from-amber-300 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-2xl shadow-purple-600/40 hover:scale-[1.03] active:scale-95 transition-all"
          >
            <Sparkles className="h-5 w-5 text-amber-200" />
            <span>Plan My Event Now</span>
            <ArrowRight className="h-5 w-5 ml-1" />
          </button>

          <button
            onClick={() => {
              onSelectEvent('demo-freshers-2026');
              setActiveTab('dashboard');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm hover:border-purple-500/50 transition-all"
          >
            <PartyPopper className="h-4 w-4 text-amber-400" />
            <span>Explore Demo: College Freshers (₹2.5L)</span>
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
          <div className="p-3 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">₹0 to ₹50L+</p>
            <p className="text-xs text-slate-400 mt-1">Calibrated INR Budgets</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-['Outfit']">8 Categories</p>
            <p className="text-xs text-slate-400 mt-1">Automatic Allocation</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-['Outfit']">100% Actionable</p>
            <p className="text-xs text-slate-400 mt-1">Milestone Timelines</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-['Outfit']">Instant Copies</p>
            <p className="text-xs text-slate-400 mt-1">WhatsApp & Social Invites</p>
          </div>
        </div>
      </section>

      {/* Interactive Quick Event Estimator Widget */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/95 to-[#0e101a] border border-purple-500/30 p-6 sm:p-10 shadow-2xl shadow-purple-950/30 relative overflow-hidden">
          {/* Top banner tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sliders className="h-4 w-4" />
                <span>Instant Budget & Scale Estimator</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                Simulate Your Event Parameters in Real-Time
              </h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 self-start sm:self-auto">
              No sign-up required
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Event Type selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Event Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'freshers', label: "Freshers' Party" },
                    { id: 'birthday', label: 'Birthday Bash' },
                    { id: 'wedding', label: 'Royal Wedding' },
                    { id: 'college_fest', label: 'College Fest' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setEstType(item.id as EventType)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        estType === item.id
                          ? 'bg-purple-600/30 border-purple-500 text-white font-semibold shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Expected Guests</span>
                  <span className="text-purple-300 font-bold text-sm bg-purple-950/60 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                    {estGuests} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={estGuests}
                  onChange={(e) => setEstGuests(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>20 Intimate</span>
                  <span>250 Grand</span>
                  <span>1,000 Mega</span>
                </div>
              </div>

              {/* Budget Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-slate-300">Target Budget (INR)</span>
                  <span className="text-amber-300 font-bold text-sm bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                    {formatINR(estBudget)}
                  </span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="2000000"
                  step="10000"
                  value={estBudget}
                  onChange={(e) => setEstBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹30K</span>
                  <span>₹5 Lakh</span>
                  <span>₹20 Lakh</span>
                </div>
              </div>
            </div>

            {/* Live Estimation Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#141624] to-[#0c0d15] rounded-2xl p-6 border border-slate-700/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>AI Allocation Snapshot</span>
                <span className="text-xs text-purple-400 font-normal">Approx.</span>
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Budget Per Guest:</span>
                  <span className="text-white font-bold">{formatINR(estimate.costPerGuest)} / head</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Est. Food & Catering:</span>
                  <span className="text-orange-400 font-semibold">{formatINR(estimate.cateringEst)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Est. Venue & Spaces:</span>
                  <span className="text-purple-400 font-semibold">{formatINR(estimate.venueEst)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Est. DJ & Entertainment:</span>
                  <span className="text-amber-400 font-semibold">{formatINR(estimate.entertainmentEst)}</span>
                </div>
              </div>

              <button
                onClick={onOpenWizard}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Generate Full Plan With These Specs</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Suites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2 font-['Outfit']">
            Comprehensive Event Architecture
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Everything You Need From Idea To Event Day
          </p>
          <p className="mt-3 text-slate-400 text-sm">
            CelebrationAI integrates real financial logic, milestone workflows, and creative assets into one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 border border-slate-800 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-950/20">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Smart Event Creation & AI Concepts</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Guided wizard captures your date, guest count, location, food preferences, and vibe to synthesize a personalized event theme and backup risk plans.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Custom themes & color palettes with HEX chips
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Weather, sound, and power backup contingency plans
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 border border-slate-800 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-950/20">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Smart Budget Planner (INR)</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Interactive financial dashboard across 8 categories with automatic budget distribution, planned vs actual spend, and over-budget warnings.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Itemized expense tracker with payment statuses
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                AI cost-saving alternatives that save 15-25%
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 border border-slate-800 hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-950/20">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Milestone Timeline & Checklist</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Automated countdown from 60 days before down to the hour-by-hour day-of schedule. Filterable tasks with priorities and confetti celebrations.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Phase breakdowns (30d, 14d, 7d, 1d, Event Day)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Pre-loaded templates for weddings, birthdays & fests
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 border border-slate-800 hover:border-pink-500/40 transition-all hover:shadow-xl hover:shadow-pink-950/20">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Personalized Creative Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Instant AI copy generation for WhatsApp invites, Instagram captions, hashtags, host welcome speeches, and catchy event taglines.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                1-click copy to clipboard with toast notification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Refine by tone: royal, student hype, emotional, formal
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 border border-slate-800 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-950/20">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Vendor & Venue Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Maintain and compare service providers from caterers to DJs and photographers. Track quote receipts, ratings, bookings, and direct budget links.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Realistic Indian market quotes and vetted specs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Side-by-side comparison and booking status pills
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 border border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-950/20">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">Offline Ready & Gemini Powered</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Works out-of-the-box with local storage persistence and built-in smart AI fallback. Plug in your Google Gemini API key anytime for live generative streaming.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Full JSON backup export & restore support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                Zero external dependencies required for full demo
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pre-loaded Demo Events Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="rounded-3xl bg-[#0c0d15] border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Live Demo Showcases
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Explore Pre-Configured Celebration Plans
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Test drive CelebrationAI with two diverse real-world Indian event scenarios with budgets, tasks, vendors, and invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo 1: College Freshers' Fest */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-[#12131d] border border-purple-500/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    College Fest • 350 Guests
                  </span>
                  <span className="text-sm font-extrabold text-amber-300 font-['Outfit']">
                    ₹2,50,000
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  Neon Euphoria 2026 — Fresher Welcome
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Cyberpunk neon glow party with UV lighting tunnels, DJ Rayne, laser cannons, woodfire pizza bars, and 360-degree video booths in Bengaluru.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">8 Expenses • 7 Tasks • 4 Vendors</span>
                <button
                  onClick={() => {
                    onSelectEvent('demo-freshers-2026');
                    setActiveTab('dashboard');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all"
                >
                  <span>Open This Event</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Demo 2: Royal 50th Birthday Party */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-[#12131d] border border-amber-500/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    50th Birthday • 65 Guests
                  </span>
                  <span className="text-sm font-extrabold text-amber-300 font-['Outfit']">
                    ₹1,20,000
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  Royal Velvet Jubilee — Rajiv’s 50th Birthday
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Intimate Rajasthani royal heritage evening at Whispering Palms Haveli in Jaipur with live acoustic Bollywood ghazals, memory lane walkway, and royal feast.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">6 Expenses • 3 Tasks • 2 Vendors</span>
                <button
                  onClick={() => {
                    onSelectEvent('demo-birthday-golden');
                    setActiveTab('dashboard');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-900/30 transition-all"
                >
                  <span>Open This Event</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/30 p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 text-amber-300 mb-4 border border-amber-400/20">
            <PartyPopper className="h-8 w-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Ready to Plan an Unforgettable Celebration?
          </h2>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            Create your custom plan in under two minutes with AI-assisted budgeting, timelines, and creative invitations.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 hover:from-amber-300 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="h-5 w-5 text-amber-200" />
              <span>Launch Event Creator</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
