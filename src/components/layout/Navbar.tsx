import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  LayoutDashboard,
  Wallet,
  Clock,
  Users,
  Palette,
  Settings,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Eye,
} from 'lucide-react';
import type { ActiveTab, EventPlan } from '../../types/event';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeEvent: EventPlan;
  allEvents: EventPlan[];
  onSelectEvent: (eventId: string) => void;
  onOpenWizard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeEvent,
  allEvents,
  onSelectEvent,
  onOpenWizard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  const navItems: { tab: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'overview', label: 'Event Hub', icon: Eye },
    { tab: 'budget', label: 'Budget', icon: Wallet },
    { tab: 'timeline', label: 'Timeline & Tasks', icon: Clock },
    { tab: 'vendors', label: 'Vendors', icon: Users },
    { tab: 'creative', label: 'Creative Studio', icon: Palette },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0c14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-0.5 shadow-lg shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b0c14]">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit'] flex items-center gap-1.5">
                  Celebration<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium tracking-wider uppercase text-purple-300/80 -mt-1">
                  Smart Event Planner
                </span>
              </div>
            </button>

            {/* Event Switcher Dropdown */}
            <div className="relative ml-2 sm:ml-4">
              <button
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 text-xs text-slate-200 hover:border-purple-500/60 hover:bg-slate-800 transition-all max-w-[190px] sm:max-w-[240px]"
              >
                <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="truncate font-medium">{activeEvent?.title || 'Select Event'}</span>
                {activeEvent?.isDemo && (
                  <span className="hidden md:inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                    DEMO
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-auto" />
              </button>

              {eventDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setEventDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0f111a] border border-slate-800 p-2 shadow-2xl shadow-purple-950/40 z-20">
                    <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                      Your Events ({allEvents.length})
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {allEvents.map((evt) => (
                        <button
                          key={evt.id}
                          onClick={() => {
                            onSelectEvent(evt.id);
                            setEventDropdownOpen(false);
                            if (activeTab === 'landing') setActiveTab('dashboard');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                            evt.id === activeEvent?.id
                              ? 'bg-purple-600/20 text-purple-300 font-medium border border-purple-500/30'
                              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-medium truncate">{evt.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {evt.date} • ₹{evt.totalBudget.toLocaleString('en-IN')}
                            </p>
                          </div>
                          {evt.isDemo && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0 font-semibold border border-amber-500/30">
                              DEMO
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setEventDropdownOpen(false);
                          onOpenWizard();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/30 transition-all"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Create New Event
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              title="Settings"
              className={`p-2 rounded-xl border transition-colors ${
                activeTab === 'settings'
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenWizard}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-200 animate-pulse" />
              <span>Plan My Event</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0c0d16] px-4 pt-3 pb-6 space-y-1">
          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              activeTab === 'landing' ? 'bg-purple-600/20 text-purple-300' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            Home / Landing
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-purple-600/20 text-purple-300' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
