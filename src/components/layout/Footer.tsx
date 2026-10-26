import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import type { ActiveTab } from '../../types/event';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenWizard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenWizard }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#07080d] py-12 mt-16 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-amber-400 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#0b0c14]">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-['Outfit']">
                Celebration<span className="text-purple-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Your smart full-lifecycle event planning assistant. Powered by AI for Indian celebrations — birthdays, weddings, anniversaries, college fests, and community gatherings with calibrated INR budgets.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smart Engine Ready • Indian Rupee (₹) Native • Offline Fallback Enabled</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-['Outfit']">
              Planning Suites
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Event Control Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Smart INR Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Milestone Timeline & Checklist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('creative')}
                  className="hover:text-purple-300 transition-colors"
                >
                  AI Creative Studio & Invites
                </button>
              </li>
            </ul>
          </div>

          {/* Get Started CTA */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-['Outfit']">
              Get Started
            </h4>
            <p className="text-xs text-slate-400">
              Have an upcoming party or college fest? Let CelebrationAI build a plan in 60 seconds.
            </p>
            <button
              onClick={onOpenWizard}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/30 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Plan My Event Now
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CelebrationAI. Built with modern React, Vite & Tailwind CSS.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>for memorable celebrations everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
