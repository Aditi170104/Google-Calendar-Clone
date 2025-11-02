import { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function EventModal({ isOpen, onClose, event, onSave, onDelete }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
      
      setTitle(event.title || '');
      setDescription(event.description || '');
      setAllDay(event.allDay || false);
      
      // Format dates for input fields
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
      setStartTime(formatTime(start));
      setEndTime(formatTime(end));
    } else {
      // New event - default to current date/time
      const now = new Date();
      const later = new Date(now.getTime() + 60 * 60 * 1000);
      
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      setTitle('');
      setDescription('');
      setStartDate(formatDate(now));
      setEndDate(formatDate(later));
      setStartTime(formatTime(now));
      setEndTime(formatTime(later));
      setAllDay(false);
    }
    setError('');
  }, [event]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const start = allDay 
        ? new Date(startDate + 'T00:00:00')
        : new Date(startDate + 'T' + startTime);
      const end = allDay
        ? new Date(endDate + 'T23:59:59')
        : new Date(endDate + 'T' + endTime);

      if (start >= end) {
        setError('End time must be after start time');
        setSaving(false);
        return;
      }

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        allDay: allDay,
      };

      await onSave(event?.id, eventData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await onDelete(event.id);
        onClose();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete event');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Event Modal"
      className="event-modal"
      overlayClassName="event-modal-overlay"
      closeTimeoutMS={200}
    >
      <div className="event-modal-content">
        <div className="event-modal-header">
          <h2 className="event-modal-title">
            {event?.id ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="event-modal-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="event-modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="event-input title-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="checkbox"
              />
              <label htmlFor="allDay" className="checkbox-label">
                All day
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="event-input"
              />
              {!allDay && (
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="event-input"
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">End</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="event-input"
              />
              {!allDay && (
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="event-input"
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="event-input description-input"
              rows={4}
            />
          </div>
        </div>

        <div className="event-modal-footer">
          {event?.id && (
            <button
              onClick={handleDelete}
              className="btn-delete"
              disabled={saving}
            >
              Delete
            </button>
          )}
          <div className="footer-right">
            <button
              onClick={onClose}
              className="btn-cancel"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-save"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

