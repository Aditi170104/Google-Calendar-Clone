# Google Calendar Clone

A high-fidelity full-stack clone of Google Calendar built with React, Node.js, Express, and PostgreSQL. This project demonstrates smooth user interactions, modern UI design, and complete CRUD functionality for calendar events.

![Calendar Clone](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-blue)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Business Logic & Edge Cases](#business-logic--edge-cases)
- [Animations & Interactions](#animations--interactions)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)

## Features

### Frontend
- ✅ **Multiple View Modes**: Monthly, Weekly, Daily, and List views
- ✅ **Event Management**: Create, edit, and delete events with a beautiful modal interface
- ✅ **Interactive Calendar**: Click on dates or events to create/modify events
- ✅ **High-Fidelity UI**: Designed to closely match Google Calendar's visual design
- ✅ **Smooth Animations**: Transitions and hover effects for better UX
- ✅ **Responsive Design**: Works seamlessly across different screen sizes
- ✅ **Real-time Updates**: Immediate reflection of changes in the calendar

### Backend
- ✅ **RESTful API**: Complete CRUD operations for events
- ✅ **Database Integration**: PostgreSQL with Prisma ORM
- ✅ **Overlap Detection**: Warns users when events overlap
- ✅ **Date Range Queries**: Efficient event fetching for specific date ranges
- ✅ **Error Handling**: Comprehensive error handling and validation

## Technology Stack

### Frontend
- **React 19.1.1**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **FullCalendar**: Powerful calendar library for React
- **Axios**: HTTP client for API requests
- **React Modal**: Accessible modal component

### Backend
- **Node.js**: JavaScript runtime
- **Express 5.1.0**: Web application framework
- **Prisma 6.18.0**: Modern ORM for database management
- **PostgreSQL**: Relational database
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Architecture

### System Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
│   Port: 5173    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│  Express Server │
│   (Backend)     │
│   Port: 5000    │
└────────┬────────┘
         │
         │ Prisma ORM
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

### Component Structure

**Frontend:**
- `App.jsx`: Main application component managing state and routing
- `Calendar.jsx`: FullCalendar wrapper with view configurations
- `EventModal.jsx`: Modal for creating/editing events
- `services/api.js`: API service layer for backend communication

**Backend:**
- `index.js`: Express server setup and middleware
- `routes/eventRoutes.js`: Route definitions
- `controllers/eventController.js`: Business logic and data operations
- `prismaClient.js`: Prisma client singleton

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd calendar-clone-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `calendar-clone-backend` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/calendar_db?schema=public"
   PORT=5000
   ```
   Replace `username`, `password`, and `calendar_db` with your PostgreSQL credentials.

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd calendar-clone-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   Create a `.env` file in the `calendar-clone-frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   If not set, it defaults to `http://localhost:5000/api`

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`

### Running the Complete Application

1. **Start PostgreSQL** (if not already running)
2. **Start the backend server** (from `calendar-clone-backend` directory)
3. **Start the frontend server** (from `calendar-clone-frontend` directory)
4. **Open your browser** and navigate to `http://localhost:5173`

## Project Structure

```
calendar-clone/
├── calendar-clone-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── eventController.js
│   │   ├── routes/
│   │   │   └── eventRoutes.js
│   │   ├── index.js
│   │   └── prismaClient.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── .env
│
├── calendar-clone-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar.jsx
│   │   │   └── EventModal.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
│
└── README.md
```

## Business Logic & Edge Cases

### Event Overlap Detection

The system detects overlapping events but allows them (matching Google Calendar behavior). When creating or updating an event that overlaps with existing events, the API returns a warning:

```json
{
  "event": { ... },
  "warning": "Event overlaps an existing event",
  "overlappingId": "event-id"
}
```

### Date Range Queries

The backend efficiently queries events for specific date ranges using Prisma:

```javascript
where: {
  AND: [
    { startTime: { lt: end } },
    { endTime: { gt: start } }
  ]
}
```

This ensures only events that overlap with the requested range are returned.

### Validation

- **Title**: Required field, cannot be empty
- **Start/End Times**: Must be valid dates, end time must be after start time
- **All-Day Events**: Automatically set start to 00:00 and end to 23:59:59

### Error Handling

- **404 Errors**: Event not found responses
- **400 Errors**: Validation errors (invalid dates, missing fields)
- **500 Errors**: Server-side errors with descriptive messages
- **Database Errors**: Prisma error codes are handled appropriately (P2025 for not found)

### Time Zone Handling

Currently, the application uses the local timezone of the server/browser. All times are stored and retrieved in ISO 8601 format, ensuring consistency across different environments.

## Animations & Interactions

### Modal Animations

The event modal uses smooth fade-in and slide-up animations:

```css
@keyframes fadeIn {
  from { opacity: 0; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
}
```

### Calendar Interactions

- **Hover Effects**: Events lift slightly with shadow on hover
- **Button Transitions**: All buttons have smooth color and shadow transitions
- **Date Selection**: Clicking dates smoothly opens the modal
- **Event Clicking**: Events have pointer cursor and hover states

### CSS Transitions

All interactive elements use consistent transitions:

```css
transition: all 0.2s ease-out;
```

This creates a cohesive, smooth user experience matching Google Calendar's feel.

### Color System

Events are assigned colors based on a hash of their title, ensuring consistent colors for similar events:

```javascript
const colors = [
  '#4285f4', // Google Blue
  '#34a853', // Green
  '#fbbc04', // Yellow
  '#ea4335', // Red
  // ... more colors
];
```

## API Documentation

### Base URL
```
http://localhost:5000/api/events
```

### Endpoints

#### GET /api/events
Get all events or events within a date range.

**Query Parameters (optional):**
- `start`: ISO 8601 date string
- `end`: ISO 8601 date string

**Response:**
```json
[
  {
    "id": "clx...",
    "title": "Meeting",
    "description": "Team meeting",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T11:00:00.000Z",
    "allDay": false,
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T09:00:00.000Z"
  }
]
```

#### GET /api/events/:id
Get a single event by ID.

**Response:**
```json
{
  "id": "clx...",
  "title": "Meeting",
  "description": "Team meeting",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "allDay": false
}
```

#### POST /api/events
Create a new event.

**Request Body:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "allDay": false
}
```

**Response:**
```json
{
  "id": "clx...",
  "title": "New Event",
  "description": "Event description",
  "startTime": "2024-01-15T10:00:00.000Z",
  "endTime": "2024-01-15T11:00:00.000Z",
  "allDay": false
}
```

#### PUT /api/events/:id
Update an existing event.

**Request Body:**
```json
{
  "title": "Updated Event",
  "description": "Updated description",
  "startTime": "2024-01-15T14:00:00.000Z",
  "endTime": "2024-01-15T15:00:00.000Z",
  "allDay": false
}
```

**Response:**
```json
{
  "id": "clx...",
  "title": "Updated Event",
  "description": "Updated description",
  "startTime": "2024-01-15T14:00:00.000Z",
  "endTime": "2024-01-15T15:00:00.000Z",
  "allDay": false
}
```

#### DELETE /api/events/:id
Delete an event.

**Response:**
```json
{
  "success": true
}
```

## Future Enhancements

### Short-term Improvements
1. **Recurring Events**: Support for daily, weekly, monthly, and yearly recurring events
2. **Event Reminders**: Email or browser notifications before events
3. **Event Search**: Search functionality to find events by title or description
4. **Event Categories/Tags**: Organize events with categories and color coding
5. **Multi-user Support**: User authentication and personal calendars

### Medium-term Enhancements
1. **Event Invitations**: Invite other users to events
2. **Calendar Sharing**: Share calendars with other users
3. **Import/Export**: Import events from Google Calendar, Outlook, or iCal format
4. **Mobile App**: React Native mobile application
5. **Offline Support**: Service workers for offline functionality

### Long-term Features
1. **Time Zone Support**: Multi-timezone event support
2. **Video Conferencing Integration**: Zoom, Meet, Teams integration
3. **Calendar Analytics**: Insights into calendar usage patterns
4. **Smart Scheduling**: AI-powered scheduling suggestions
5. **Integration with Other Services**: Gmail, Slack, etc.

## Contributing

This is an assignment project, but suggestions and improvements are welcome!

## License

This project is created for educational purposes.

## Contact

For questions or issues, please open an issue in the repository.

---

**Note**: This project is a high-fidelity clone created as an assignment. It demonstrates full-stack development skills, modern UI/UX practices, and comprehensive system design.

