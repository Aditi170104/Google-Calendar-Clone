import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { eventService } from '../services/api';

export default function Calendar({ view, onEventClick, onDateClick, onCreateClick, refreshTrigger, selectedDate, onCurrentDateChange, calendarApiRef, onCalendarApiReady }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState(view || 'dayGridMonth');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  // Helper to generate consistent colors based on event title - using Google Calendar color palette
  const getEventColor = (title) => {
    // Google Calendar's official color palette
    const colors = [
      '#4285f4', // Google Blue (default)
      '#ea4335', // Red
      '#fbbc04', // Yellow/Orange
      '#34a853', // Green
      '#9aa0a6', // Gray
      '#673ab7', // Deep Purple
      '#ff9800', // Orange
      '#00bcd4', // Cyan
      '#e91e63', // Pink
      '#5c6bc0', // Indigo
      '#009688', // Teal
    ];
    if (!title) return colors[0];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const allEvents = await eventService.getEvents();
      
      // Ensure we have an array - API service returns [] on error
      if (!Array.isArray(allEvents)) {
        console.warn('getEvents did not return an array');
        setEvents([]);
        setLoading(false);
        return;
      }
      
      // Transform events for FullCalendar with error handling
      const transformedEvents = allEvents
        .map(event => {
          try {
            if (!event || !event.startTime || !event.endTime) {
              console.warn('Invalid event data:', event);
              return null;
            }
            return {
              id: event.id || `event-${Date.now()}-${Math.random()}`,
              title: event.title || 'Untitled Event',
              start: event.startTime,
              end: event.endTime,
              allDay: event.allDay || false,
              extendedProps: {
                description: event.description || '',
              },
              backgroundColor: getEventColor(event.title || ''),
              borderColor: getEventColor(event.title || ''),
            };
          } catch (err) {
            console.error('Error transforming event:', err, event);
            return null;
          }
        })
        .filter(Boolean); // Remove null entries
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Handle view change from FullCalendar
  const handleDatesSet = (arg) => {
    if (arg && arg.view && calendarRef.current) {
      const newView = arg.view.type;
      if (newView !== currentView) {
        setCurrentView(newView);
      }
      
      // Get the actual current date from the calendar API
      let actualDate = arg.start;
      try {
        const api = calendarRef.current.getApi();
        if (api && typeof api.getDate === 'function') {
          actualDate = api.getDate();
        }
      } catch (e) {
        // Fallback to arg.start
      }
      
      // For month view, calculate the primary month being shown
      if (newView === 'dayGridMonth' && arg.start) {
        // Use a date in the middle of the range to determine the primary month
        const midDate = new Date(arg.start.getTime() + (arg.end.getTime() - arg.start.getTime()) / 2);
        actualDate = midDate;
      }
      
      if (actualDate) {
        setCurrentDate(actualDate);
        setDateRange({ start: arg.start, end: arg.end });
        if (onCurrentDateChange) {
          onCurrentDateChange({ 
            date: actualDate, 
            start: arg.start, 
            end: arg.end, 
            view: newView 
          });
        }
      }
    }
  };

  // Expose calendar API to parent - try multiple times to ensure it's ready
  useEffect(() => {
    const setupCalendarApi = () => {
      if (calendarRef.current && !loading) {
        try {
          const api = calendarRef.current.getApi();
          if (api) {
            console.log('Calendar API ready:', api);
            if (calendarApiRef) {
              calendarApiRef.current = api;
            }
            if (onCalendarApiReady) {
              onCalendarApiReady(api);
            }
            return true;
          }
        } catch (error) {
          console.error('Error getting calendar API:', error);
        }
      }
      return false;
    };

    // Try immediately
    if (setupCalendarApi()) {
      return;
    }

    // If not ready, try after a short delay
    const timeoutId = setTimeout(() => {
      setupCalendarApi();
    }, 100);

    // Also try on next render
    const intervalId = setInterval(() => {
      if (setupCalendarApi()) {
        clearInterval(intervalId);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [loading, calendarApiRef, onCalendarApiReady]);

  const handleDateClick = (info) => {
    if (onDateClick) {
      onDateClick(info.date);
    }
  };

  const handleEventClick = (info) => {
    if (onEventClick) {
      onEventClick({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay,
        description: info.event.extendedProps?.description || '',
      });
    }
  };

  // Update view when prop changes
  useEffect(() => {
    if (view && calendarRef.current) {
      try {
        const calendarApi = calendarRef.current.getApi();
        if (calendarApi && calendarApi.view) {
          let targetView = 'dayGridMonth';
          
          switch (view) {
            case 'day':
              targetView = 'timeGridDay';
              break;
            case 'week':
              targetView = 'timeGridWeek';
              break;
            case 'list':
              targetView = 'listWeek';
              break;
            case 'month':
            default:
              targetView = 'dayGridMonth';
              break;
          }
          
          if (calendarApi.view.type !== targetView) {
            calendarApi.changeView(targetView);
          }
        }
      } catch (error) {
        console.error('Error changing view:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Navigate to selected date from sidebar - only after calendar is mounted
  useEffect(() => {
    if (selectedDate && calendarRef.current && !loading) {
      try {
        const calendarApi = calendarRef.current.getApi();
        if (calendarApi && calendarApi.view) {
          calendarApi.gotoDate(selectedDate);
        }
      } catch (error) {
        console.error('Error navigating to date:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, loading]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        backgroundColor: '#fff'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #f1f3f4',
          borderTop: '3px solid #1a73e8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          events={Array.isArray(events) ? events : []}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          editable={false}
          selectable={false}
          headerToolbar={false}
          initialView="dayGridMonth"
          height="auto"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          firstDay={1}
          weekNumbers={false}
          dayMaxEvents={true}
          moreLinkClick="popover"
          eventDisplay="block"
          nowIndicator={true}
          scrollTime="08:00:00"
          scrollTimeReset={false}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List',
          }}
          className="google-calendar-style"
        />
      </div>
    </div>
  );
}

