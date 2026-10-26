import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  Filter,
  CheckCheck,
} from 'lucide-react';
import type { EventPlan, TaskItem, TaskPriority, TaskCategory } from '../../types/event';
import { PriorityBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Modal } from '../common/Modal';

interface TimelineViewProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ event, onUpdateEvent }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form states for Add/Edit Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('planning');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(event.date);
  const [taskPhase, setTaskPhase] = useState<'60_days' | '30_days' | '14_days' | '7_days' | '1_day' | 'event_day'>('14_days');

  const todayStr = new Date().toISOString().split('T')[0];

  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = event.tasks.filter((task) => {
    const isOverdue = !task.completed && task.dueDate < todayStr;

    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'overdue' && !isOverdue) return false;

    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

    return true;
  });

  const handleToggleTask = (id: string) => {
    const target = event.tasks.find((t) => t.id === id);
    const willBeCompleted = target ? !target.completed : false;

    const updatedTasks = event.tasks.map((t) =>
      t.id === id ? { ...t, completed: willBeCompleted } : t
    );

    // If task was just completed, trigger micro-celebration confetti!
    if (willBeCompleted) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#3b82f6', '#a855f7'],
        });
      } catch {
        // Safe fallback
      }
    }

    onUpdateEvent({
      ...event,
      tasks: updatedTasks,
    });
  };

  const handleOpenAddModal = (phase?: any) => {
    setEditingTaskId(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskCategory('planning');
    setTaskPriority('medium');
    setTaskDueDate(event.date);
    setTaskPhase(phase || '14_days');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate);
    setTaskPhase(task.phase);
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) return;

    let updatedTasks: TaskItem[];

    if (editingTaskId) {
      updatedTasks = event.tasks.map((t) =>
        t.id === editingTaskId
          ? {
              ...t,
              title: taskTitle.trim(),
              description: taskDesc.trim(),
              category: taskCategory,
              priority: taskPriority,
              dueDate: taskDueDate,
              phase: taskPhase,
            }
          : t
      );
    } else {
      const newTask: TaskItem = {
        id: `t-${Date.now()}`,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        category: taskCategory,
        priority: taskPriority,
        dueDate: taskDueDate,
        phase: taskPhase,
        completed: false,
      };
      updatedTasks = [...event.tasks, newTask];
    }

    onUpdateEvent({
      ...event,
      tasks: updatedTasks,
    });
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = event.tasks.filter((t) => t.id !== id);
    onUpdateEvent({
      ...event,
      tasks: updatedTasks,
    });
  };

  // Ready-made checklist template loader
  const handleLoadTemplate = (templateType: 'wedding' | 'birthday' | 'fest') => {
    const eventDate = new Date(event.date);
    const getOffsetDate = (offsetDays: number) => {
      const d = new Date(eventDate);
      d.setDate(d.getDate() - offsetDays);
      return d.toISOString().split('T')[0];
    };

    let templateTasks: TaskItem[] = [];

    if (templateType === 'wedding') {
      templateTasks = [
        {
          id: `t-tmpl-w1`,
          title: 'Book Mandap & Banquet Lawn',
          description: 'Sign contract and pay advance for 2 days.',
          category: 'booking',
          priority: 'high',
          dueDate: getOffsetDate(45),
          completed: false,
          phase: '30_days',
        },
        {
          id: `t-tmpl-w2`,
          title: 'Finalize Mehendi & Bridal Makeup Artists',
          description: 'Schedule trial sessions.',
          category: 'booking',
          priority: 'high',
          dueDate: getOffsetDate(30),
          completed: false,
          phase: '30_days',
        },
        {
          id: `t-tmpl-w3`,
          title: 'Mail Velvet Box Physical & WhatsApp Digital Invites',
          description: 'Follow up with RSVP confirmations.',
          category: 'guests',
          priority: 'high',
          dueDate: getOffsetDate(20),
          completed: false,
          phase: '14_days',
        },
        {
          id: `t-tmpl-w4`,
          title: 'Sangeet Choreography & DJ Music Playlist Finalization',
          description: 'Coordinate family dance routines.',
          category: 'creatives',
          priority: 'medium',
          dueDate: getOffsetDate(10),
          completed: false,
          phase: '7_days',
        },
        {
          id: `t-tmpl-w5`,
          title: 'Final Headcount & Sweet Box Distribution Check',
          description: 'Lock plates with caterer.',
          category: 'planning',
          priority: 'high',
          dueDate: getOffsetDate(3),
          completed: false,
          phase: '1_day',
        },
        {
          id: `t-tmpl-w6`,
          title: 'Baraat & Varmala Stage Execution',
          description: 'Coordinate dhol team, rose petals, and fireworks sparklers.',
          category: 'execution',
          priority: 'high',
          dueDate: event.date,
          completed: false,
          phase: 'event_day',
        },
      ];
    } else if (templateType === 'birthday') {
      templateTasks = [
        {
          id: `t-tmpl-b1`,
          title: 'Reserve Rooftop Lounge / Party Hall',
          description: 'Confirm audio permissions and cake cutting table.',
          category: 'booking',
          priority: 'high',
          dueDate: getOffsetDate(25),
          completed: false,
          phase: '30_days',
        },
        {
          id: `t-tmpl-b2`,
          title: 'Order Designer Theme Cake & Cupcakes',
          description: 'Confirm flavor and birthday topper design.',
          category: 'booking',
          priority: 'medium',
          dueDate: getOffsetDate(12),
          completed: false,
          phase: '14_days',
        },
        {
          id: `t-tmpl-b3`,
          title: 'Send WhatsApp Animated Video Invite with RSVP Link',
          description: 'Track responses in WhatsApp group.',
          category: 'guests',
          priority: 'high',
          dueDate: getOffsetDate(10),
          completed: false,
          phase: '14_days',
        },
        {
          id: `t-tmpl-b4`,
          title: 'Prepare Milestone Photo Slideshow & Trivia Games',
          description: 'Collect photos from friends and family.',
          category: 'creatives',
          priority: 'medium',
          dueDate: getOffsetDate(4),
          completed: false,
          phase: '7_days',
        },
        {
          id: `t-tmpl-b5`,
          title: 'Deliver Return Gifts & Setup Polaroid Memory Wall',
          description: 'Check balloons and neon sign lighting.',
          category: 'execution',
          priority: 'high',
          dueDate: event.date,
          completed: false,
          phase: 'event_day',
        },
      ];
    } else {
      templateTasks = [
        {
          id: `t-tmpl-f1`,
          title: 'Obtain Campus Dean & Municipal Sound Permission',
          description: 'File compliance paperwork for 10 PM sound limit.',
          category: 'planning',
          priority: 'high',
          dueDate: getOffsetDate(30),
          completed: false,
          phase: '30_days',
        },
        {
          id: `t-tmpl-f2`,
          title: 'Contract Celebrity Guest DJ & Line Array Audio Rig',
          description: 'Verify rider requirements.',
          category: 'booking',
          priority: 'high',
          dueDate: getOffsetDate(20),
          completed: false,
          phase: '14_days',
        },
        {
          id: `t-tmpl-f3`,
          title: 'Student Volunteer Briefing & Crowd Control Security',
          description: 'Distribute volunteer badges and radio channels.',
          category: 'planning',
          priority: 'high',
          dueDate: getOffsetDate(5),
          completed: false,
          phase: '7_days',
        },
        {
          id: `t-tmpl-f4`,
          title: 'Full Lighting, Laser & Audio Soundcheck at 6 PM',
          description: 'Verify amphitheatre illumination.',
          category: 'execution',
          priority: 'high',
          dueDate: getOffsetDate(1),
          completed: false,
          phase: '1_day',
        },
      ];
    }

    onUpdateEvent({
      ...event,
      tasks: [...event.tasks, ...templateTasks],
    });
  };

  const phases: { id: '60_days' | '30_days' | '14_days' | '7_days' | '1_day' | 'event_day'; title: string; desc: string }[] = [
    { id: '30_days', title: '30 Days Before', desc: 'Lock in venue, core budget & initial contracts' },
    { id: '14_days', title: '14 Days Before', desc: 'Confirm vendors, entertainment & send invitations' },
    { id: '7_days', title: '7 Days Before', desc: 'Finalize headcount, menu tasting & decor walkthrough' },
    { id: '1_day', title: '1 Day Before', desc: 'Soundcheck, rehearsal & vendor arrival times' },
    { id: 'event_day', title: 'Event Day', desc: 'Execute hour-by-hour schedule & guest hospitality' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#131525] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Actionable Milestones
              </span>
              <span className="text-xs text-slate-400">Event Date: {event.date}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Timeline & Smart Checklist
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Phased countdown, prioritized deliverables, and task execution management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* Progress bar & Template Loader Row */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 max-w-md">
            <ProgressBar
              value={progressPercent}
              label="Overall Checklist Completion"
              subLabel={`${completedTasks} of ${totalTasks} completed`}
              height="md"
            />
          </div>

          {/* Load Preset Checklist Templates */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block sm:inline">
              ⚡️ Load Checklist Template:
            </span>
            <button
              onClick={() => handleLoadTemplate('wedding')}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              💍 Wedding
            </button>
            <button
              onClick={() => handleLoadTemplate('birthday')}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              🎂 Birthday
            </button>
            <button
              onClick={() => handleLoadTemplate('fest')}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              🎸 College Fest
            </button>
          </div>
        </div>
      </div>

      {/* Task Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter:</span>
          </span>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Completed' },
            { id: 'overdue', label: 'Overdue' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                filterStatus === item.id
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Phased Timeline View */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseTasks = filteredTasks.filter((t) => t.phase === phase.id);
          const phaseCompleted = phaseTasks.filter((t) => t.completed).length;

          return (
            <div
              key={phase.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs">
                    <Clock className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
                      <span>{phase.title}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({phaseCompleted}/{phaseTasks.length} done)
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">{phase.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddModal(phase.id)}
                  className="self-start sm:self-auto text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Task to Phase</span>
                </button>
              </div>

              {/* Tasks in this phase */}
              {phaseTasks.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 italic">
                  No matching tasks in this phase.
                </p>
              ) : (
                <div className="space-y-2">
                  {phaseTasks.map((task) => {
                    const isOverdue = !task.completed && task.dueDate < todayStr;
                    return (
                      <div
                        key={task.id}
                        className={`group p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          task.completed
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                            : isOverdue
                            ? 'bg-rose-500/10 border-rose-500/30'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-0.5 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                            aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <Circle className="h-5 w-5 hover:text-emerald-400" />
                            )}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <p
                              className={`text-xs font-semibold leading-snug ${
                                task.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-100'
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                          <PriorityBadge priority={task.priority} />

                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span
                              className={
                                isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'
                              }
                            >
                              {task.dueDate}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] text-rose-400 font-bold ml-1">
                                (Overdue)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEditModal(task)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Edit Task"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                              title="Delete Task"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTaskId ? 'Edit Task' : 'Add New Checklist Task'}
        subtitle="Manage deliverables, deadlines, and milestone assignments"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Confirm DJ playlist, Finalize guest RSVP list"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Instructions
            </label>
            <textarea
              rows={2}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="e.g. Call caterer at 4 PM to verify ice bucket and mocktail counter supplies."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phase
              </label>
              <select
                value={taskPhase}
                onChange={(e) => setTaskPhase(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="30_days">30 Days Before</option>
                <option value="14_days">14 Days Before</option>
                <option value="7_days">7 Days Before</option>
                <option value="1_day">1 Day Before</option>
                <option value="event_day">Event Day</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveTask}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Save Task
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
