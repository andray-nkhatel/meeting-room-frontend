# Meeting Room Booking System - Frontend

This is the frontend for a Meeting Room Booking System built with React and Bootstrap. It connects to the backend API controllers for auth, bookings, rooms, and user management.

## Features

- User authentication (login/register)
- Room browsing with filtering options
- Room availability checking
- Booking creation and management
- Admin features for user management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running (ASP.NET Core Web API)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd meeting-room-booking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL:
   - Create a `.env` file in the root directory
   - Add the following line, replacing the URL with your API server:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/src/api` - API service layer for communicating with the backend
- `/src/components` - Reusable components
- `/src/contexts` - React contexts for global state management
- `/src/pages` - Page components
- `/src/utils` - Utility functions

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject`