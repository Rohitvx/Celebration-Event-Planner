import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Wallet,
  CheckCircle2,
  PartyPopper,
  Flame,
  Cake,
  Heart,
  GraduationCap,
  Music,
  Building,
} from 'lucide-react';
import type { EventType, FoodPreference, VenueType, EventPlan } from '../../types/event';
import { AIService } from '../../services/aiService';
import { Modal } from '../common/Modal';

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (plan: EventPlan) => void;
}

export const EventWizard: React.FC<EventWizardProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('birthday');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('Bengaluru');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [totalBudget, setTotalBudget] = useState<number>(150000); // ₹1,50,000
  const [venueType, setVenueType] = useState<VenueType>('indoor');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('veg_non_veg');
  const [preferredTheme, setPreferredTheme] = useState('Festive Elegance & Fairy Lights');
  const [decorationStyle, setDecorationStyle] = useState('Warm floral arches, ambient lanterns, photowall');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Quick preset loader
  const loadPreset = (presetType: 'freshers' | 'wedding' | 'birthday' | 'college_fest') => {
    if (presetType === 'freshers') {
      setTitle("Cosmic Kickoff — 2026 Freshers' Bash");
      setType('freshers');
      setLocation('Bengaluru Amphitheatre');
      setGuestCount(300);
      setTotalBudget(220000);
      setVenueType('hybrid');
      setFoodPreference('cocktail_finger_food');
      setPreferredTheme('Cyberpunk Glow & EDM');
      setDecorationStyle('UV blacklights, neon ribbons, LED tunnels');
      setSpecialRequirements('High-octane sound rig, 360 photo booth, mocktail taps.');
    } else if (presetType === 'wedding') {
      setTitle('The Royal Vivah — Ananya & Rohan');
      setType('wedding');
      setLocation('Udaipur Heritage Lawn');
      setGuestCount(250);
      setTotalBudget(1500000);
      setVenueType('outdoor');
      setFoodPreference('buffet_multi_cuisine');
      setPreferredTheme('Rajputana Royal Grandeur');
      setDecorationStyle('Marigold canopies, brass urlis, mirror-work draperies');
      setSpecialRequirements('Live Sufi & Sangeet ensemble, fireworks entry.');
    } else if (presetType === 'birthday') {
      setTitle('Silver Starlight — 25th Birthday Gala');
      setType('birthday');
      setLocation('Mumbai Rooftop Lounge');
      setGuestCount(75);
      setTotalBudget(100000);
      setVenueType('rooftop');
      setFoodPreference('veg_non_veg');
      setPreferredTheme('Silver Chrome & Midnight Violet');
      setDecorationStyle('Custom neon birthday signage, metallic balloon clusters');
      setSpecialRequirements('Acoustic guitarist, polaroid memory table.');
    } else if (presetType === 'college_fest') {
      setTitle('Tarang 2026 — Annual Cultural Fest');
      setType('college_fest');
      setLocation('Delhi University Grounds');
      setGuestCount(500);
      setTotalBudget(350000);
      setVenueType('outdoor');
      setFoodPreference('cocktail_finger_food');
      setPreferredTheme('Indie Pop & Bohemian Bazaar');
      setDecorationStyle('Fairy light canopies, acoustic stage, food truck avenue');
      setSpecialRequirements('Battle of the bands sound setup, crowd barrier control.');
    }
    setErrorMessage('');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!title.trim()) {
        setErrorMessage('Please enter an event name.');
        return;
      }
      if (!date) {
        setErrorMessage('Please select an event date.');
        return;
      }
      if (!location.trim()) {
        setErrorMessage('Please specify an event location.');
        return;
      }
    } else if (currentStep === 2) {
      if (guestCount < 5) {
        setErrorMessage('Guest count must be at least 5.');
        return;
      }
      if (totalBudget < 5000) {
        setErrorMessage('Please specify a realistic budget in INR (minimum ₹5,000).');
        return;
      }
    }
    setErrorMessage('');
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const plan = await AIService.generateEventPlan({
        title,
        type,
        date,
        location,
        guestCount,
        totalBudget,
        preferredTheme,
        decorationStyle,
        foodPreference,
        venueType,
        specialRequirements,
      });

      // Launch joyful celebration confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#f59e0b', '#06b6d4'],
        });
      } catch {
        // Safe fallback if canvas-confetti unsupported
      }

      onEventCreated(plan);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const eventTypes: { id: EventType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'birthday', label: 'Birthday', icon: Cake },
    { id: 'wedding', label: 'Wedding', icon: Heart },
    { id: 'freshers', label: "Freshers' Party", icon: Flame },
    { id: 'college_fest', label: 'College Fest', icon: Music },
    { id: 'anniversary', label: 'Anniversary', icon: PartyPopper },
    { id: 'graduation', label: 'Graduation', icon: GraduationCap },
    { id: 'community', label: 'Community', icon: Building },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Event Plan"
      subtitle={`Step ${currentStep} of 3 — AI Powered Event Architecture`}
      maxWidth="2xl"
    >
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            1
          </div>
          <span className={`text-xs font-semibold ${currentStep >= 1 ? 'text-white' : 'text-slate-400'}`}>
            Basics
          </span>
        </div>
        <div className="h-0.5 w-12 bg-slate-800" />
        <div className="flex items-center gap-2">
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            2
          </div>
          <span className={`text-xs font-semibold ${currentStep >= 2 ? 'text-white' : 'text-slate-400'}`}>
            Budget & Venue
          </span>
        </div>
        <div className="h-0.5 w-12 bg-slate-800" />
        <div className="flex items-center gap-2">
          <div
            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 3 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            3
          </div>
          <span className={`text-xs font-semibold ${currentStep === 3 ? 'text-white' : 'text-slate-400'}`}>
            Theme & AI
          </span>
        </div>
      </div>

      {/* Preset Quick Chips */}
      {currentStep === 1 && (
        <div className="mb-6 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            ⚡️ Or Quick Load a Sample Preset:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset('freshers')}
              className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-300 hover:bg-purple-900 transition-colors"
            >
              🎉 300-Student Freshers
            </button>
            <button
              type="button"
              onClick={() => loadPreset('birthday')}
              className="text-xs px-2.5 py-1 rounded-lg bg-pink-950/70 border border-pink-500/40 text-pink-300 hover:bg-pink-900 transition-colors"
            >
              🎂 25th Rooftop Birthday
            </button>
            <button
              type="button"
              onClick={() => loadPreset('wedding')}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 hover:bg-amber-900 transition-colors"
            >
              💍 Royal Heritage Wedding
            </button>
            <button
              type="button"
              onClick={() => loadPreset('college_fest')}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors"
            >
              🎸 500-Student Fest
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Basics */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {eventTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Event Name / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Euphoria 2026, Rajiv's 50th Birthday, Rohit & Sneha Sangeet"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Event Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                City / Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Mumbai, Jaipur, Delhi NCR"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Scale, Budget & Venue */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expected Guest Count *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Include family, friends, or student attendees.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Total Budget in INR (₹) *
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-3 h-4 w-4 text-amber-400" />
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold text-amber-300 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Approx. ₹{guestCount > 0 ? Math.round(totalBudget / guestCount).toLocaleString('en-IN') : 0} per guest
              </p>
            </div>
          </div>

          {/* Quick budget chip selector */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Quick Budget Tiers:</span>
            <div className="flex flex-wrap gap-2">
              {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTotalBudget(amt)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    totalBudget === amt
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  ₹{(amt / 100000).toFixed(amt >= 100000 ? 1 : 0).replace('.0', '')} Lakh
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Venue Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'indoor', label: 'AC Indoor Banquet' },
                { id: 'outdoor', label: 'Open Lawn / Garden' },
                { id: 'hybrid', label: 'Courtyard / Amphitheatre' },
                { id: 'rooftop', label: 'Rooftop Terrace' },
                { id: 'beach', label: 'Beachside Pavilion' },
                { id: 'banquet', label: 'Luxury Ballroom' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVenueType(v.id as VenueType)}
                  className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                    venueType === v.id
                      ? 'bg-purple-600/30 border-purple-500 text-white font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Food & Catering Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'veg_non_veg', label: 'Veg & Non-Veg Buffet' },
                { id: 'pure_veg', label: '100% Pure Vegetarian' },
                { id: 'jain_available', label: 'Jain Food Options' },
                { id: 'cocktail_finger_food', label: 'Sliders & Finger Food' },
                { id: 'buffet_multi_cuisine', label: 'Grand Multi-Cuisine' },
                { id: 'traditional_thali', label: 'Traditional Royal Thali' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFoodPreference(f.id as FoodPreference)}
                  className={`p-2 rounded-xl border text-xs font-medium text-center transition-all ${
                    foodPreference === f.id
                      ? 'bg-orange-500/20 border-orange-500 text-orange-200 font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Style, Theme & Special Requirements */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Preferred Theme / Vibe
            </label>
            <input
              type="text"
              value={preferredTheme}
              onChange={(e) => setPreferredTheme(e.target.value)}
              placeholder="e.g. Neon Cyberpunk, Royal Rajasthani, Bohemian Sunset, Bollywood Retro"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Decoration Style & Elements
            </label>
            <input
              type="text"
              value={decorationStyle}
              onChange={(e) => setDecorationStyle(e.target.value)}
              placeholder="e.g. Fairy light canopies, brass urlis with candles, LED vortex tunnel, balloon arches"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Special Requirements or Constraints
            </label>
            <textarea
              rows={3}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g. Need DJ setup with laser effects, strict 10 PM sound curfew, wheelchair accessibility, custom mocktail bar."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {/* AI Plan Preview Summary */}
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 p-4 rounded-xl border border-purple-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>AI Engine Ready to Synthesize</span>
            </div>
            <p className="text-slate-300">
              CelebrationAI will generate a bespoke concept, INR budget breakdown for 8 categories, actionable milestone timeline, localized vendor directory, and starter digital invites for:
            </p>
            <div className="font-medium text-slate-200">
              • <strong className="text-white">{title || 'Celebration'}</strong> in {location} ({date}) for{' '}
              <strong className="text-purple-300">{guestCount} guests</strong> with a budget of{' '}
              <strong className="text-amber-300">₹{totalBudget.toLocaleString('en-IN')}</strong>.
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 hover:from-amber-300 hover:via-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Synthesizing AI Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-200" />
                <span>Generate My AI Plan</span>
              </>
            )}
          </button>
        )}
      </div>
    </Modal>
  );
};
