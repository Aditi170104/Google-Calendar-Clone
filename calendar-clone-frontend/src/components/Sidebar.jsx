import { useState } from 'react';

export default function Sidebar({ onDateSelect, onCreateClick, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    try {
      const selected = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
      return (
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  const handleDateClick = (date) => {
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="sidebar">
      {/* Create Button */}
      <button className="sidebar-create-button" onClick={onCreateClick}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <span>Create</span>
      </button>

      {/* Mini Calendar */}
      <div className="mini-calendar">
        <div className="mini-calendar-header">
          <button
            className="mini-calendar-nav"
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <span className="mini-calendar-month">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            className="mini-calendar-nav"
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="mini-calendar-weekdays">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        <div className="mini-calendar-days">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="mini-calendar-day empty"></div>;
            }

            const today = isToday(date);
            const selected = isSelected(date);
            const hovered = hoveredDate && date.getTime() === hoveredDate.getTime();

            return (
              <button
                key={date.getTime()}
                className={`mini-calendar-day ${today ? 'today' : ''} ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>


      {/* My Calendars Section */}
      <div className="sidebar-section">
        <details className="sidebar-section-details" open>
          <summary className="sidebar-section-summary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span>My calendars</span>
          </summary>
          <div className="sidebar-calendar-list">
            <label className="sidebar-calendar-item">
              <input type="checkbox" defaultChecked />
              <span>My Calendar</span>
            </label>
            <label className="sidebar-calendar-item">
              <input type="checkbox" defaultChecked />
              <span>Tasks</span>
            </label>
            <label className="sidebar-calendar-item">
              <input type="checkbox" defaultChecked />
              <span>Birthdays</span>
            </label>
          </div>
        </details>
      </div>

      {/* Other Calendars Section */}
      <div className="sidebar-section">
        <details className="sidebar-section-details">
          <summary className="sidebar-section-summary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span>Other calendars</span>
          </summary>
          <div className="sidebar-calendar-list">
            <button className="sidebar-add-calendar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Add calendar</span>
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}

