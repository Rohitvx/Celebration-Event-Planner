import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Send,
  MessageSquare,
  Share2,
  Mic,
  Tag,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import type { EventPlan, CreativeAsset } from '../../types/event';

interface CreativeStudioProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({ event, onUpdateEvent }) => {
  const [selectedType, setSelectedType] = useState<'invitation' | 'caption' | 'speech' | 'tagline' | 'schedule'>('invitation');
  const [tone, setTone] = useState<'vibrant' | 'royal' | 'heartwarming' | 'formal' | 'student_hype'>('vibrant');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCreative = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 450));

    let title = '';
    let content = '';
    let tags: string[] = [];

    const isStudent = tone === 'student_hype' || event.type === 'freshers' || event.type === 'college_fest';
    const isRoyal = tone === 'royal' || event.type === 'wedding';
    const isEmotional = tone === 'heartwarming';

    if (selectedType === 'invitation') {
      title = `${isRoyal ? 'Royal Imperial' : isStudent ? 'Electrifying WhatsApp' : 'Festive'} Invitation`;
      tags = ['WhatsApp', 'Digital Invite', tone];

      if (isStudent) {
        content = `⚡️ *ATTENTION FRESHERS & BATCHMATES!* ⚡️\n\nThe most anticipated night of the semester is finally here! Get ready to step into a neon universe of unstoppable beats, delicious bites, and unforgettable energy.\n\n🎉 *Event:* ${event.title}\n📅 *Date:* ${event.date}\n📍 *Venue:* ${event.location}\n⏰ *Time:* 5:00 PM onwards\n👗 *Vibe / Dress Code:* Neon Glow & Street Chic\n\n✨ *Highlights:* DJ Battle • Live Mocktail Bar • 360 Video Booth • Crown Contest\n\n👉 *Entry:* Show your digital college pass at the gate.\n_Don't just hear about it on Monday — BE THERE!_ 🚀🔥`;
      } else if (isRoyal) {
        content = `✨ *A Royal Celebration of Love & Grace* ✨\n\nWith the blessings of the Almighty, we cordially invite you and your esteemed family to grace the auspicious celebration of\n\n🌟 *${event.title}* 🌟\n\n📅 *Date:* ${event.date}\n📍 *Venue:* ${event.location}\n⏰ *Auspicious Time:* 6:30 PM onwards\n👗 *Attire:* Traditional Indian Elegance\n\n_Your gracious presence will add warmth and splendor to our joyous milestone._\n\nWarm regards,\nHost Family & Friends`;
      } else {
        content = `🎉 *You're Invited to Celebrate!* 🎉\n\nJoin us as we raise a toast to good times, laughter, and lifelong memories at\n\n✨ *${event.title}* ✨\n\n📅 *Date:* ${event.date}\n📍 *Location:* ${event.location}\n⏰ *Time:* 6:00 PM onwards\n\nDelicious food, refreshing drinks, and great music await you! Kindly RSVP by replying to this message.\n\n_Looking forward to celebrating together!_ 🥂`;
      }
    } else if (selectedType === 'caption') {
      title = 'Instagram Captions & Trending Hashtags';
      tags = ['Instagram', 'Reels', 'Social'];

      if (isStudent) {
        content = `Left our notebooks at home and turned the volume all the way UP! ⚡️💜 Batch of 2026, welcome to the madness!\n\nSwipe to see who owned the dance floor 👉✨\n\n#${event.title.replace(/\s+/g, '')} #FresherDiaries #CollegeVibes #CampusLife #ElectricNights #GoodVibesOnly #PartyHard`;
      } else if (isRoyal) {
        content = `A night bathed in gold, love, and timeless memories. 👑✨ Grateful for every blessing that brought us all together.\n\n#${event.title.replace(/\s+/g, '')} #RoyalCelebration #HeritageVibes #FamilyFirst #UnforgettableMoments #Elegance`;
      } else {
        content = `Smiles, sparkles, and a room full of favorite people! 🥂 Celebrating ${event.title} in the best possible way.\n\n#CelebrationAI #MemoriesMade #Grateful #PartyTime #SpecialMoments`;
      }
    } else if (selectedType === 'speech') {
      title = 'Host / Emcee Welcome Speech';
      tags = ['Speech', 'Opening Ceremony', tone];

      if (isStudent) {
        content = `“Good evening Bengaluru! Make some noise freshers! 🎤 Tonight isn't just another party on the calendar — tonight is the official launchpad of the best years of your life! Look around this room: the people dancing next to you will be your project partners, your late-night chai buddies, and your lifelong best friends. Leave your stage fear at the entrance, hit the dance floor, and let’s make Neon Euphoria unforgettable! Let's get this party STARTED!”`;
      } else if (isEmotional) {
        content = `“Good evening everyone. Looking across this room and seeing so many familiar, cherished faces, my heart is completely full. Events like tonight remind us that life’s richest treasures are the memories and relationships we build along the way. Thank you from the bottom of our hearts for traveling, taking time out of your busy lives, and being here to share this milestone with us. Please eat well, laugh loudly, and celebrate with us tonight!”`;
      } else {
        content = `“A very warm welcome to all our distinguished guests and beloved friends to ${event.title}! Today we gather to celebrate shared happiness and special milestones. On behalf of our entire hosting team, we thank you for your presence and wish you a fantastic evening of great food, music, and conversation. Enjoy the celebration!”`;
      }
    } else if (selectedType === 'tagline') {
      title = 'Event Taglines & Monikers';
      tags = ['Branding', 'Hype'];
      content = `1. ${event.title}: Where Memories Spark & Hearts Connect!\n2. Elevate the Vibe: The Ultimate ${event.type.replace(/_/g, ' ')} Experience.\n3. Beyond Ordinary: Celebrating Life at Full Volume.\n4. Golden Hours, Timeless Memories.`;
    } else {
      title = 'Day-Of Schedule Template';
      tags = ['Schedule', 'Timeline'];
      content = `• 05:00 PM — Guest Arrival & Signature Welcome Mocktails\n• 06:00 PM — Emcee Kick-Off & Opening Ceremony\n• 07:15 PM — Performances, Games & Cake Cutting\n• 08:30 PM — Grand Dinner Feast & Live Counters Open\n• 09:30 PM — DJ Dance Floor Climax & Confetti Drop\n• 10:45 PM — Return Favors & Warm Goodbyes`;
    }

    const newAsset: CreativeAsset = {
      id: `cr-${Date.now()}`,
      type: selectedType,
      title: customPrompt.trim() ? `${title} (Custom: "${customPrompt.slice(0, 20)}...")` : title,
      content,
      tags,
    };

    onUpdateEvent({
      ...event,
      creativeAssets: [newAsset, ...event.creativeAssets],
    });

    setCustomPrompt('');
    setIsGenerating(false);
  };

  const handleDeleteAsset = (id: string) => {
    const updated = event.creativeAssets.filter((a) => a.id !== id);
    onUpdateEvent({
      ...event,
      creativeAssets: updated,
    });
  };

  const typeTabs: { id: 'invitation' | 'caption' | 'speech' | 'tagline' | 'schedule'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'invitation', label: 'Invitations', icon: MessageSquare },
    { id: 'caption', label: 'Captions & Hashtags', icon: Share2 },
    { id: 'speech', label: 'Speeches & Monologues', icon: Mic },
    { id: 'tagline', label: 'Event Taglines', icon: Tag },
    { id: 'schedule', label: 'Schedules', icon: Clock },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#131525] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                Creative Copy Studio
              </span>
              <span className="text-xs text-slate-400">For: {event.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Personalized Creative Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AI text generator for WhatsApp invitations, Instagram reels, host opening speeches, and taglines.
            </p>
          </div>
        </div>

        {/* Studio Generator Controls */}
        <div className="mt-6 space-y-4">
          {/* Format Tabs */}
          <div className="flex flex-wrap gap-2">
            {typeTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                      : 'bg-slate-950/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tone Selector & Prompt Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2">
            <div className="md:col-span-3">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Voice & Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
              >
                <option value="vibrant">Vibrant & Celebratory</option>
                <option value="student_hype">High-Energy Student Hype</option>
                <option value="royal">Royal & Traditional Indian</option>
                <option value="heartwarming">Heartwarming & Emotional</option>
                <option value="formal">Polished & Formal</option>
              </select>
            </div>

            <div className="md:col-span-6">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Custom Instructions (Optional)
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Include dress code, mention surprise performance, add Hinglish punchline..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-3 self-end">
              <button
                onClick={handleGenerateCreative}
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 hover:from-amber-300 hover:via-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-200" />
                    <span>Generate Asset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Creative Cards Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
            <span>Your Generated Creatives Library</span>
            <span className="text-xs text-slate-400 font-normal">
              ({event.creativeAssets.length} saved copies)
            </span>
          </h2>
          <span className="text-xs text-slate-400">1-Click Copy to WhatsApp or Social Media</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {event.creativeAssets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {asset.type}
                      </span>
                      {asset.tags?.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">{asset.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 shrink-0 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Content Box */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line max-h-60 overflow-y-auto">
                  {asset.content}
                </div>
              </div>

              {/* Copy CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Ready to paste into WhatsApp, Instagram or script
                </span>
                <button
                  onClick={() => copyText(asset.id, asset.content)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    copiedId === asset.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200'
                  }`}
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
