import React, { useState, useEffect } from 'react';
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

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setEventDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems: { tab: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'overview', label: 'Event Hub', icon: Eye },
    { tab: 'budget', label: 'Budget', icon: Wallet },
    { tab: 'timeline', label: 'Timeline & Tasks', icon: Clock },
    { tab: 'vendors', label: 'Vendors', icon: Users },
    { tab: 'creative', label: 'Creative Studio', icon: Palette },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0c14]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Event Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* Logo */}
            <button
              onClick={() => handleTabClick('landing')}
              className="flex items-center gap-2 text-left group transition-transform active:scale-95 shrink-0"
              aria-label="CelebrationAI Home"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-0.5 shadow-lg shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b0c14]">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300" />
                </div>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-['Outfit'] flex items-center gap-1">
                  Celebration<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-300">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium tracking-wider uppercase text-purple-300/80 -mt-1">
                  Smart Event Planner
                </span>
              </div>
            </button>

            {/* Event Switcher Dropdown (Responsive: compact on mobile, full on tablet/desktop) */}
            <div className="relative ml-1 sm:ml-2 md:ml-3">
              <button
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-slate-900/90 border border-slate-700/80 px-2 sm:px-3 py-1.5 text-xs text-slate-200 hover:border-purple-500/60 hover:bg-slate-800 transition-all max-w-[110px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-[240px]"
                title={activeEvent?.title || 'Select Event'}
              >
                <Calendar className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="truncate font-medium text-[11px] sm:text-xs">
                  {activeEvent?.title || 'Select Event'}
                </span>
                {activeEvent?.isDemo && (
                  <span className="hidden md:inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shrink-0">
                    DEMO
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-auto" />
              </button>

              {eventDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setEventDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#0f111a] border border-slate-800 p-2 shadow-2xl shadow-purple-950/40 z-50">
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

          {/* Desktop Navigation Links (>= lg: 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabClick(item.tab)}
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

          {/* Action CTAs, Settings & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Settings button */}
            <button
              onClick={() => handleTabClick('settings')}
              title="Settings"
              className={`p-2 rounded-xl border transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                activeTab === 'settings'
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* "Plan My Event" button: Full on sm+, compact/hidden on small mobile to prevent overflow */}
            <button
              onClick={onOpenWizard}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-200 animate-pulse" />
              <span>Plan My Event</span>
            </button>

            {/* Mobile / Tablet Menu Toggle Button (Visible below lg: 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center min-h-[38px] min-w-[38px]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-purple-400" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Panel */}
          <div className="relative z-50 lg:hidden border-t border-slate-800 bg-[#0c0d16] px-4 pt-3 pb-6 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-3 shadow-2xl">
            {/* Active Event Quick Info Card */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Event
                </span>
                <p className="text-xs font-bold text-white truncate mt-0.5">
                  {activeEvent?.title}
                </p>
                <p className="text-[10px] text-slate-400">
                  {activeEvent?.date} • ₹{activeEvent?.totalBudget?.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEventDropdownOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-medium border border-purple-500/30 shrink-0"
              >
                Switch
              </button>
            </div>

            {/* Prominent Mobile "Plan My Event" CTA */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWizard();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-900/40 active:scale-98 transition-all"
            >
              <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
              <span>Plan a New Event with AI</span>
            </button>

            {/* Navigation Tabs List */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 block mb-1">
                Navigation
              </span>

              <button
                onClick={() => handleTabClick('landing')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'landing'
                    ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
                <span>Home / Overview</span>
              </button>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleTabClick(item.tab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-slate-400'} shrink-0`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => handleTabClick('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Settings & Engine</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

