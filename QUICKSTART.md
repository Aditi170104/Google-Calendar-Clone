# Quick Start Guide

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)

## Setup Steps

### 1. Backend Setup (Terminal 1)

```bash
cd calendar-clone-backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/calendar_db?schema=public"
PORT=5000
```

Set up database:
```bash
npx prisma generate
npx prisma migrate dev
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup (Terminal 2)

```bash
cd calendar-clone-frontend
npm install
```

(Optional) Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start dev server:
```bash
npm run dev
```

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Testing the Application

1. **Create an Event**: Click the "Create" button or click on any date
2. **Edit an Event**: Click on any existing event
3. **Delete an Event**: Click on an event, then click "Delete"
4. **Switch Views**: Use the view buttons (Month, Week, Day, List) in the calendar header

## Troubleshooting

- **Backend won't start**: Check PostgreSQL is running and DATABASE_URL is correct
- **Frontend can't connect**: Ensure backend is running on port 5000
- **Database errors**: Run `npx prisma migrate dev` again

