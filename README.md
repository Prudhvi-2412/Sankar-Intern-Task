# Lead Management System

A mini CRM built with React, Node.js, Express, and Supabase PostgreSQL.

## Features

- Add leads with name, phone, and source.
- View all leads in a clean table.
- Update lead status: Interested, Not Interested, or Converted.
- Delete leads.
- Form validation on frontend and backend.
- Search by name or phone.
- Filter by source and status.
- Dashboard counts for total, interested, converted, and not interested leads.

## Project Structure

```text
backend/
  database.sql
  src/server.js
frontend/
  src/main.jsx
  src/styles.css
```

## Supabase Setup

1. Open your Supabase project.
2. Go to SQL Editor.
3. Run the SQL from `backend/database.sql`.
4. Copy your project URL and service role key into `backend/.env`.

Use this backend env shape:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Use this frontend env shape:

```env
VITE_API_URL=http://localhost:5000/api
```

Never expose the service role key in frontend code.

## Run Locally

Install backend dependencies:

```bash
cd backend
npm install
npm run dev
```

Install frontend dependencies in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`.

## API Endpoints

- `POST /api/leads` - Add a lead.
- `GET /api/leads` - Get all leads. Supports `search`, `status`, and `source` query params.
- `PATCH /api/leads/:id/status` - Update a lead status.
- `DELETE /api/leads/:id` - Delete a lead.
