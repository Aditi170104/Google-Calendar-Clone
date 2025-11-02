import { useState, useRef, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import Sidebar from './components/Sidebar';
import CalendarHeader from './components/CalendarHeader';
import { eventService } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState({ date: new Date(), start: new Date(), end: new Date(), view: 'month' });
  const calendarApiRef = useRef(null);
  const [calendarApi, setCalendarApi] = useState(null);

  // Debug: log when calendar API changes
  useEffect(() => {
    console.log('Calendar API state updated:', calendarApi);
    if (calendarApi) {
      console.log('Calendar API methods available:', {
        today: typeof calendarApi.today,
        prev: typeof calendarApi.prev,
        next: typeof calendarApi.next,
        gotoDate: typeof calendarApi.gotoDate
      });
    }
  }, [calendarApi]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSidebarDateSelect = (date) => {
    setSelectedDate(date);
    // Optionally navigate calendar to this date
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventId, eventData) => {
    try {
      if (eventId) {
        // Update existing event
        await eventService.updateEvent(eventId, eventData);
      } else {
        // Create new event
        await eventService.createEvent(eventData);
      }
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      // Trigger refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleCreateClick = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setIsModalOpen(true);
  };

  // Determine event data for modal
  const modalEvent = selectedEvent || (selectedDate ? {
    start: selectedDate,
    end: new Date(selectedDate.getTime() + 60 * 60 * 1000),
    title: '',
    description: '',
    allDay: false,
  } : null);

  return (
    <div className="app-container">
      <CalendarHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
        currentDate={currentDate}
        calendarApi={calendarApi}
      />
      <div className="app-layout">
        {sidebarOpen && (
          <Sidebar
            onDateSelect={handleSidebarDateSelect}
            onCreateClick={handleCreateClick}
            selectedDate={selectedDate}
          />
        )}
        <main className="main-content">
          <Calendar
            view={currentView}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            onCreateClick={handleCreateClick}
            refreshTrigger={refreshTrigger}
            selectedDate={selectedDate}
            onCurrentDateChange={setCurrentDate}
            calendarApiRef={calendarApiRef}
            onCalendarApiReady={setCalendarApi}
          />
        </main>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={modalEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
