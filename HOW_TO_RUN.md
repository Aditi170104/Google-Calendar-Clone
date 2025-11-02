# How to Run the Google Calendar Clone

Follow these step-by-step instructions to get the application running on your local machine.

## Prerequisites

Before you begin, make sure you have installed:
1. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (version 12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **npm** (comes with Node.js)

You can verify installations by running:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
psql --version   # Should show PostgreSQL version
```

---

## Step 1: Set Up PostgreSQL Database

1. **Start PostgreSQL service** (if not already running):
   - **Windows**: Open Services and start "postgresql-x64" service
   - **Mac**: Run `brew services start postgresql`
   - **Linux**: Run `sudo systemctl start postgresql`

2. **Create a database** for the project:
   ```bash
   # Open PostgreSQL command line
   psql -U postgres
   
   # In PostgreSQL prompt, run:
   CREATE DATABASE calendar_db;
   \q
   ```

   Note: Replace `postgres` with your PostgreSQL username if different.

---

## Step 2: Set Up Backend

1. **Navigate to the backend directory**:
   ```bash
   cd calendar-clone-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will install all required packages (Express, Prisma, etc.)

3. **Create environment file**:
   Create a file named `.env` in the `calendar-clone-backend` folder with this content:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/calendar_db?schema=public"
   PORT=5000
   ```
   
   **Important**: Replace:
   - `postgres` with your PostgreSQL username
   - `your_password` with your PostgreSQL password
   - `calendar_db` with your database name if different

   Example:
   ```env
   DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/calendar_db?schema=public"
   PORT=5000
   ```

4. **Set up the database schema**:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```
   
   When prompted for a migration name, you can press Enter or type a name like "init".

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   ✅ Server running on port 5000
   ```
   
   **Keep this terminal window open!**

---

## Step 3: Set Up Frontend

1. **Open a NEW terminal window** (keep the backend running)

2. **Navigate to the frontend directory**:
   ```bash
   cd calendar-clone-frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   
   You should see output like:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

---

## Step 4: Access the Application

1. **Open your web browser**

2. **Navigate to**:
   ```
   http://localhost:5173
   ```

3. **You should see the Google Calendar Clone interface!**

---

## Testing the Application

Once the app is running, try these actions:

### Create an Event:
1. Click the blue **"Create"** button in the top right
2. OR click on any date in the calendar
3. Fill in the event details (title is required)
4. Click **"Save"**

### Edit an Event:
1. Click on any existing event in the calendar
2. Modify the details
3. Click **"Save"**

### Delete an Event:
1. Click on an event to open the modal
2. Click the **"Delete"** button
3. Confirm the deletion

### Switch Views:
- Use the buttons in the calendar header: **Month**, **Week**, **Day**, **List**

---

## Troubleshooting

### Backend Issues

**Problem**: `Error: P1001: Can't reach database server`
- **Solution**: Make sure PostgreSQL is running
- Check your `DATABASE_URL` in `.env` file is correct

**Problem**: `Error: P2025: Record not found`
- **Solution**: This is normal when deleting non-existent events

**Problem**: `Port 5000 already in use`
- **Solution**: Either stop the process using port 5000, or change `PORT=5001` in `.env`

**Problem**: `Migration failed`
- **Solution**: 
  ```bash
  npx prisma migrate reset  # Resets database (WARNING: deletes data)
  npx prisma migrate dev    # Try again
  ```

### Frontend Issues

**Problem**: `Cannot connect to API` or events not loading
- **Solution**: Make sure backend is running on port 5000
- Check that `VITE_API_URL` in frontend `.env` matches backend URL

**Problem**: `Port 5173 already in use`
- **Solution**: Vite will automatically use the next available port (5174, 5175, etc.)

**Problem**: `Module not found`
- **Solution**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Database Issues

**Problem**: `Database does not exist`
- **Solution**: Create it manually:
  ```bash
  psql -U postgres
  CREATE DATABASE calendar_db;
  \q
  ```

**Problem**: `Permission denied`
- **Solution**: Check PostgreSQL user permissions and password

---

## Running in Production Mode

### Backend:
```bash
cd calendar-clone-backend
npm start
```

### Frontend:
```bash
cd calendar-clone-frontend
npm run build
npm run preview
```

---

## Quick Command Reference

### Backend Commands:
```bash
npm run dev        # Start development server with auto-reload
npm start          # Start production server
npx prisma studio  # Open Prisma Studio (database GUI)
npx prisma migrate dev    # Run migrations
npx prisma generate      # Generate Prisma client
```

### Frontend Commands:
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
```

---

## Stopping the Application

1. **Stop Frontend**: Press `Ctrl + C` in the frontend terminal
2. **Stop Backend**: Press `Ctrl + C` in the backend terminal

---

## Need Help?

If you encounter issues:
1. Check that both servers are running
2. Verify database connection string in `.env`
3. Check browser console for errors (F12)
4. Check backend terminal for error messages
5. Ensure PostgreSQL service is running

---

**That's it! Your Google Calendar Clone is now running! 🎉**

