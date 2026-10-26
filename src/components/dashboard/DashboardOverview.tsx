import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Wallet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Users,
  MapPin,
  TrendingDown,
  Palette,
  ShieldCheck,
  ChevronRight,
  PartyPopper,
} from 'lucide-react';
import type { EventPlan, ActiveTab } from '../../types/event';
import { calculateBudgetSummary, formatINR } from '../../services/budgetTemplates';
import { AIService } from '../../services/aiService';
import { MetricCard } from '../common/MetricCard';
import { ProgressBar } from '../common/ProgressBar';

interface DashboardOverviewProps {
  event: EventPlan;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenWizard: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  event,
  setActiveTab,
  onOpenWizard,
}) => {
  // Budget stats
  const budgetSummary = calculateBudgetSummary(event.totalBudget, event.expenses);

  // Task stats
  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.completed).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Days until event
  const today = new Date();
  const eventDate = new Date(event.date);
  const diffTime = eventDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Interactive AI Assistant chat state
  const [userPrompt, setUserPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Namaste! I am your AI event architect for "${event.title}". You currently have ₹${budgetSummary.remaining.toLocaleString('en-IN')} remaining in your budget. How would you like to refine your plan today?`,
    },
  ]);
  const [isAskingAI, setIsAskingAI] = useState(false);

  const handleAskAI = async (promptText?: string) => {
    const textToSend = promptText || userPrompt;
    if (!textToSend.trim() || isAskingAI) return;

    setUserPrompt('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setIsAskingAI(true);

    try {
      const history = chatMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const reply = await AIService.chatWithAssistant(event, textToSend, history);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I've analyzed your event details. Based on your ${event.guestCount} guest scale in ${event.location}, I suggest reviewing the Budget and Timeline tabs to lock down key deliverables.`,
        },
      ]);
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Event Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {event.type.replace(/_/g, ' ')}
              </span>
              {event.isDemo && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Preloaded Demo Event
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {event.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {event.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-2">
              {event.aiPlan?.conceptSummary || 'AI-designed celebration with optimized budget and actionable milestones.'}
            </p>
          </div>

          {/* Countdown & Quick Action */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-center min-w-[110px]">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-['Outfit']">
                {daysRemaining}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Days To Go</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
              >
                <span>View Event Hub</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={onOpenWizard}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
              >
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>New Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Budget (INR)"
          value={formatINR(event.totalBudget)}
          subtitle={`₹${Math.round(event.totalBudget / (event.guestCount || 1)).toLocaleString('en-IN')} / guest`}
          icon={Wallet}
          iconColor="#eab308"
          onClick={() => setActiveTab('budget')}
        />

        <MetricCard
          title="Active Expenses"
          value={formatINR(budgetSummary.activeSpend)}
          subtitle={`${budgetSummary.utilizationPercentage}% of total budget`}
          icon={TrendingDown}
          iconColor={budgetSummary.isOverBudget ? '#f43f5e' : '#8b5cf6'}
          trend={{
            label: budgetSummary.isOverBudget
              ? `Over by ${formatINR(budgetSummary.overAmount)}`
              : `${budgetSummary.utilizationPercentage}% Allocated`,
            positive: !budgetSummary.isOverBudget,
          }}
          onClick={() => setActiveTab('budget')}
        />

        <MetricCard
          title="Remaining Balance"
          value={formatINR(budgetSummary.remaining)}
          subtitle="Available for contingency"
          icon={CheckCircle2}
          iconColor={budgetSummary.remaining >= 0 ? '#10b981' : '#f43f5e'}
          onClick={() => setActiveTab('budget')}
        />

        <MetricCard
          title="Checklist Progress"
          value={`${completedTasks}/${totalTasks}`}
          subtitle={`${taskPercent}% milestones completed`}
          icon={Clock}
          iconColor="#3b82f6"
          trend={{
            label: `${totalTasks - completedTasks} tasks remaining`,
            positive: completedTasks > 0,
          }}
          onClick={() => setActiveTab('timeline')}
        />
      </div>

      {/* Over-budget Warning Alert */}
      {budgetSummary.isOverBudget && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3 text-rose-300 text-xs">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-sm">Budget Alert: Spending Exceeds Target Budget</p>
            <p className="mt-0.5 text-slate-300">
              Your active expenses currently exceed your target budget by{' '}
              <strong className="text-rose-400">{formatINR(budgetSummary.overAmount)}</strong>. Check the
              Budget tab for AI Cost-Saving Recommendations to bring it back in line!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('budget')}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Review Budget
          </button>
        </div>
      )}

      {/* Main Split: AI Assistant & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive AI Event Assistant */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    CelebrationAI Assistant
                  </h3>
                  <p className="text-[11px] text-slate-400">Contextual planning for {event.title}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            {/* Quick Prompt Chips */}
            <div className="pt-3 pb-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Suggested Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Make it more budget-friendly',
                  'Suggest a traditional Indian theme',
                  'Give me a 1-day backup plan',
                  'What DJ & sound permit do I need?',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleAskAI(chip)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-900/80 transition-all text-left"
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/60 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAskingAI && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl p-3 rounded-bl-none border border-slate-700/60 flex items-center gap-2 text-purple-300 text-xs">
                    <div className="h-3 w-3 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
                    <span>Analyzing event parameters & Indian market data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAI();
            }}
            className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask anything (e.g. Suggest a cost-saving alternative for food)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAskingAI || !userPrompt.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all shadow-md shadow-purple-900/30"
              aria-label="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Event Snapshot & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          {/* Budget Utilization Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
                <Wallet className="h-4 w-4 text-amber-400" />
                <span>Budget Health</span>
              </h3>
              <button
                onClick={() => setActiveTab('budget')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                Open Details →
              </button>
            </div>

            <ProgressBar
              value={budgetSummary.utilizationPercentage}
              label="Budget Utilization"
              subLabel={`${formatINR(budgetSummary.activeSpend)} of ${formatINR(event.totalBudget)}`}
              height="md"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Expenses Logged
                </span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {event.expenses.length} Items
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Cost per Guest
                </span>
                <span className="text-amber-300 font-bold text-sm mt-0.5 block">
                  ₹{event.guestCount > 0 ? Math.round(event.totalBudget / event.guestCount).toLocaleString('en-IN') : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks & Milestones Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>Key Milestones</span>
              </h3>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                All Tasks →
              </button>
            </div>

            <div className="space-y-2.5">
              {event.tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        task.completed ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className={`truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{task.dueDate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Creative Studio Card */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/20 p-6 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Palette className="h-4 w-4 text-pink-400" />
                <span>Creative Studio</span>
              </h4>
              <p className="text-xs text-slate-400">
                {event.creativeAssets.length} Ready-to-use digital invites & speeches
              </p>
            </div>
            <button
              onClick={() => setActiveTab('creative')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all shrink-0"
            >
              Open Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
