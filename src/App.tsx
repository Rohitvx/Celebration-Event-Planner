import React, { useState, useEffect } from 'react';
import type { ActiveTab, EventPlan } from './types/event';
import { StorageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EventOverview } from './components/event/EventOverview';
import { BudgetPlanner } from './components/budget/BudgetPlanner';
import { TimelineView } from './components/timeline/TimelineView';
import { VendorManager } from './components/vendors/VendorManager';
import { CreativeStudio } from './components/creative/CreativeStudio';
import { SettingsView } from './components/settings/SettingsView';
import { EventWizard } from './components/wizard/EventWizard';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [activeEvent, setActiveEvent] = useState<EventPlan>(() => StorageService.getActiveEvent());
  const [allEvents, setAllEvents] = useState<EventPlan[]>(() => StorageService.getEvents());
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Sync state on custom event broadcasts
  useEffect(() => {
    const refresh = () => {
      setAllEvents(StorageService.getEvents());
      setActiveEvent(StorageService.getActiveEvent());
    };

    window.addEventListener('celebration:active-event-changed', refresh);
    window.addEventListener('celebration:event-updated', refresh);
    window.addEventListener('celebration:event-deleted', refresh);
    window.addEventListener('celebration:data-reset', refresh);

    return () => {
      window.removeEventListener('celebration:active-event-changed', refresh);
      window.removeEventListener('celebration:event-updated', refresh);
      window.removeEventListener('celebration:event-deleted', refresh);
      window.removeEventListener('celebration:data-reset', refresh);
    };
  }, []);

  const handleSelectEvent = (eventId: string) => {
    StorageService.setActiveEventId(eventId);
    const evt = StorageService.getEventById(eventId);
    if (evt) {
      setActiveEvent(evt);
    }
  };

  const handleUpdateEvent = (updated: EventPlan) => {
    StorageService.saveEvent(updated);
    setActiveEvent(updated);
    setAllEvents(StorageService.getEvents());
  };

  const handleEventCreated = (newEvent: EventPlan) => {
    StorageService.createEvent(newEvent);
    setActiveEvent(newEvent);
    setAllEvents(StorageService.getEvents());
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c14] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-clip w-full max-w-full">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeEvent={activeEvent}
        allEvents={allEvents}
        onSelectEvent={handleSelectEvent}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 min-w-0">
        {activeTab === 'landing' && (
          <LandingPage
            onOpenWizard={() => setIsWizardOpen(true)}
            onSelectEvent={(id) => {
              handleSelectEvent(id);
              setActiveTab('dashboard');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            event={activeEvent}
            setActiveTab={setActiveTab}
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        )}

        {activeTab === 'overview' && (
          <EventOverview
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorManager
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'creative' && (
          <CreativeStudio
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            activeEvent={activeEvent}
            onRefreshEvents={() => {
              setAllEvents(StorageService.getEvents());
              setActiveEvent(StorageService.getActiveEvent());
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* Event Creation Guided Wizard Modal */}
      <EventWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}

export default App;
