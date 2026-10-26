import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Utensils,
  Music,
  ShieldAlert,
  Clock,
  Palette,
  MapPin,
  Users,
  Calendar,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import type { EventPlan } from '../../types/event';
import { AIService } from '../../services/aiService';
import { Modal } from '../common/Modal';

interface EventOverviewProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const EventOverview: React.FC<EventOverviewProps> = ({ event, onUpdateEvent }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Refine section modal state
  const [refineModalOpen, setRefineModalOpen] = useState(false);
  const [targetSection, setTargetSection] = useState<'concept' | 'catering' | 'entertainment' | 'backup' | 'schedule'>('concept');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleOpenRefine = (section: 'concept' | 'catering' | 'entertainment' | 'backup' | 'schedule') => {
    setTargetSection(section);
    setRefinePrompt('');
    setRefineModalOpen(true);
  };

  const handleApplyRefine = async () => {
    setIsRefining(true);
    try {
      const updatedSection = await AIService.refineSection(event, targetSection, refinePrompt);
      const updatedAiPlan = {
        ...event.aiPlan,
        ...updatedSection,
      };

      const updatedEvent = {
        ...event,
        aiPlan: updatedAiPlan,
      };

      onUpdateEvent(updatedEvent);
      setRefineModalOpen(false);
    } catch (err) {
      console.error('Refine failed', err);
    } finally {
      setIsRefining(false);
    }
  };

  const plan = event.aiPlan || {
    conceptTitle: event.title,
    conceptSummary: 'Custom celebration plan',
    themeStyle: event.preferredTheme || 'Celebration Chic',
    colorPalette: [],
    vibeKeywords: ['Vibrant', 'Memorable'],
    cateringSuggestions: [],
    entertainmentIdeas: [],
    guestExperienceHighlights: [],
    costSavingTips: [],
    backupPlan: {
      weatherRisk: 'Indoor shelter backup',
      vendorContingency: 'Replacement agreements in place',
      powerSoundContingency: 'Backup generator reserved',
    },
    suggestedSchedule: [],
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#131522] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                AI Architecture Blueprint
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {plan.conceptTitle}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {plan.conceptSummary}
            </p>

            {/* Vibe Keywords */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Vibe Profile:
              </span>
              {plan.vibeKeywords?.map((vibe, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium"
                >
                  ✨ {vibe}
                </span>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 flex md:flex-col gap-2">
            <button
              onClick={() => handleOpenRefine('concept')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all shadow-md"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refine Concept</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Color Palette & Theme Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Color Palette Card */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <Palette className="h-4 w-4 text-pink-400" />
              <span>Curated Theme Palette</span>
            </h3>
            <span className="text-[11px] text-slate-400">Click swatch to copy HEX</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {plan.colorPalette?.map((color, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(color.hex)}
                className="group relative flex flex-col items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-center"
              >
                <div
                  className="h-12 w-full rounded-xl shadow-inner mb-2 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-semibold text-slate-200 truncate w-full">
                  {color.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                  {copiedHex === color.hex ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Check className="h-3 w-3" /> Copied!
                    </span>
                  ) : (
                    <span>{color.hex}</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
            <span className="font-semibold text-slate-200">Decoration Aesthetic: </span>
            {event.decorationStyle || plan.themeStyle}
          </div>
        </div>

        {/* Guest Experience Highlights */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-amber-400" />
              <span>Guest Experience Highlights</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {plan.guestExperienceHighlights?.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300"
              >
                <div className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                  {idx + 1}
                </div>
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Food & Catering + Entertainment & Music */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Food & Catering Suggestions */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <Utensils className="h-4 w-4 text-orange-400" />
              <span>Catering & Food Concepts</span>
            </h3>
            <button
              onClick={() => handleOpenRefine('catering')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refine Menu</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {plan.cateringSuggestions?.map((food, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-200"
              >
                <span className="text-orange-400 text-sm">🍽️</span>
                <p className="leading-relaxed">{food}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Entertainment & DJ Ideas */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <Music className="h-4 w-4 text-amber-400" />
              <span>Entertainment & DJ Program</span>
            </h3>
            <button
              onClick={() => handleOpenRefine('entertainment')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refine Ideas</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {plan.entertainmentIdeas?.map((ent, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-200"
              >
                <span className="text-amber-400 text-sm">🎵</span>
                <p className="leading-relaxed">{ent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Backup Plan & Risk Mitigation */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-cyan-400" />
            <span>Emergency Contingency & Backup Protocols</span>
          </h3>
          <button
            onClick={() => handleOpenRefine('backup')}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Regenerate Backups</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              🌧️ Weather & Rain Risk
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.backupPlan?.weatherRisk}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase text-indigo-400 flex items-center gap-1.5">
              ⚡️ Power & Audio Reliability
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.backupPlan?.powerSoundContingency}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase text-purple-400 flex items-center gap-1.5">
              🤝 Vendor Replacement
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {plan.backupPlan?.vendorContingency}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Day-Of Schedule */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>Event Day Master Timeline</span>
          </h3>
        </div>

        <div className="relative border-l-2 border-purple-500/30 ml-4 pl-6 space-y-5 py-2">
          {plan.suggestedSchedule?.map((slot, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-purple-600 border-2 border-[#0b0c14] group-hover:bg-amber-400 transition-colors" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-xs font-bold text-amber-300 font-mono shrink-0 w-24">
                  {slot.time}
                </span>
                <span className="text-xs text-slate-200 font-medium">{slot.activity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refine Section Modal */}
      <Modal
        isOpen={refineModalOpen}
        onClose={() => setRefineModalOpen(false)}
        title={`Refine ${targetSection.toUpperCase()} with AI`}
        subtitle="Prompt the AI to modify or enhance this specific section"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              What would you like to change or adjust?
            </label>
            <textarea
              rows={3}
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              placeholder="e.g. Make it more budget-friendly, switch to an authentic Awadhi menu, or add student games..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRefinePrompt('Make it more budget-friendly')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              💰 More Budget Friendly
            </button>
            <button
              type="button"
              onClick={() => setRefinePrompt('Suggest a traditional Indian theme and menu')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              👑 Royal Indian Traditional
            </button>
            <button
              type="button"
              onClick={() => setRefinePrompt('Add high-energy interactive crowd activities')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              ⚡️ High Energy Games
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setRefineModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyRefine}
              disabled={isRefining}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2"
            >
              {isRefining ? (
                <>
                  <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Update Section</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
