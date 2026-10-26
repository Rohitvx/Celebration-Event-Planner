import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import type { EventPlan } from '../../types/event';

interface SettingsViewProps {
  activeEvent: EventPlan;
  onRefreshEvents: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ activeEvent, onRefreshEvents }) => {
  const [apiKey, setApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(StorageService.getApiKey());
  }, []);

  const handleSaveApiKey = () => {
    StorageService.setApiKey(apiKey);
    setSaveStatus('API Key saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all event data to the original demo showcases? Any custom changes will be reset.')) {
      StorageService.resetToSampleData();
      onRefreshEvents();
    }
  };

  const handleExportData = () => {
    const json = StorageService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celebration-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importData(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
          onRefreshEvents();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Error: Invalid backup JSON structure.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteActiveEvent = () => {
    if (window.confirm(`Are you sure you want to delete "${activeEvent.title}"?`)) {
      StorageService.deleteEvent(activeEvent.id);
      onRefreshEvents();
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#131525] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            System & Engine Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
          Settings & Data Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your AI provider, API keys, JSON data export/import, and demo reset.
        </p>
      </div>

      {/* AI Provider Settings */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              AI Intelligence Engine
            </h3>
            <p className="text-xs text-slate-400">
              Configure Google Gemini API key or use the zero-latency smart rule engine
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Smart Built-in Engine Active (No API Key Required)</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              CelebrationAI operates with a built-in Indian market event architecture engine that generates hyper-realistic INR budgets, milestones, and sample vendors instantly without needing any external API credentials.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Optional Google Gemini API Key (For Live LLM Generation)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0 transition-colors"
              >
                Save Key
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Your key is stored securely only in your browser’s localStorage and is never transmitted to any third-party server.
            </p>
            {saveStatus && (
              <p className="text-xs text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{saveStatus}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Backup & Data Persistence */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Data Backup & Restore
            </h3>
            <p className="text-xs text-slate-400">
              Export your plans to JSON or restore from a previously saved backup
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Download className="h-4 w-4 text-purple-400" />
                <span>Export Full Backup</span>
              </h4>
              <p className="text-xs text-slate-400">
                Download all your events, budgets, tasks, and creatives as a JSON file.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Download JSON Backup
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-cyan-400" />
                <span>Restore From Backup</span>
              </h4>
              <p className="text-xs text-slate-400">
                Upload a JSON backup file to restore your saved events.
              </p>
            </div>
            <label className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center cursor-pointer transition-colors block">
              <span>Choose Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <p
            className={`text-xs font-semibold pt-1 ${
              importStatus.includes('Error') ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {importStatus}
          </p>
        )}
      </div>

      {/* Demo Reset & Danger Zone */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Demo Environment & Event Controls
            </h3>
            <p className="text-xs text-slate-400">Reset to initial demo showcases or delete active event</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Reset to Factory Demo Events
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Reloads the College Freshers' Fest (₹2.5L) and 50th Birthday Party (₹1.2L) showcases.
            </p>
          </div>
          <button
            onClick={handleResetData}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors shrink-0"
          >
            Restore Demo Showcases
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
          <div>
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Delete Active Event
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Permanently delete "{activeEvent.title}". This cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDeleteActiveEvent}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete This Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
