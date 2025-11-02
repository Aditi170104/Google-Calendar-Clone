export default function CalendarHeader({ onMenuClick, currentView, onViewChange, currentDate, calendarApi }) {
  const getDateRangeText = () => {
    if (!currentDate) return '';
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    const date = currentDate.date ? new Date(currentDate.date) : new Date(currentDate.start);
    const start = new Date(currentDate.start);
    const end = new Date(currentDate.end);
    const view = currentDate.view;

    // For month view - use the primary date, not the start (which might be from previous month)
    if (view === 'dayGridMonth' || view === 'month') {
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    // For day view
    if (view === 'timeGridDay' || view === 'day') {
      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    // For week view
    if (view === 'timeGridWeek' || view === 'week') {
      const startMonth = monthNames[start.getMonth()];
      const endMonth = monthNames[end.getMonth()];
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      
      // Same year
      if (startYear === endYear) {
        // Same month
        if (start.getMonth() === end.getMonth()) {
          return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${startYear}`;
        }
        // Different months
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${startYear}`;
      }
      // Different years
      return `${startMonth} ${start.getDate()}, ${startYear} - ${endMonth} ${end.getDate()}, ${endYear}`;
    }
    
    // For list view
    if (view === 'listWeek' || view === 'listMonth' || view === 'list') {
      return `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    }
    
    return '';
  };

  return (
    <header className="calendar-main-header">
      <div className="header-left">
        <button className="header-menu-button" onClick={onMenuClick} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        
        <div className="header-logo">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#4285f4">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
          </svg>
        </div>
        
        <h1 className="header-title">Calendar</h1>
      </div>

      <div className="header-center">
        <span className="header-date-range">{getDateRangeText()}</span>
      </div>

      <div className="header-right">
        {/* View Dropdown */}
        <div className="header-view-dropdown">
          <select 
            className="view-select" 
            value={currentView || 'month'} 
            onChange={(e) => onViewChange(e.target.value)}
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
            <option value="list">List</option>
          </select>
        </div>
        
        <div className="header-user">
          <div className="header-user-avatar">
            <span>AS</span>
          </div>
        </div>
      </div>
    </header>
  );
}

