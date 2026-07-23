# SupportDesk — Customer Support Ticket Management System

A full-stack web application for managing customer support tickets, built as part of the AIKart Full Stack Developer Internship Assessment.

**Live Demo:** [aikart-support.vercel.app](https://aikart-support.vercel.app)

---

## Overview

SupportDesk enables organizations to create, track, and resolve customer support requests through a clean, responsive dashboard. Support teams can manage ticket priority, update statuses, and collaborate through a built-in comments system.

---

## Features

- **Authentication** — Secure user registration and login via Supabase Auth
- **Dashboard** — Real-time overview of ticket statistics (total, open, in progress, resolved)
- **Ticket Management** — Full CRUD operations with category, priority, and status control
- **Status Tracking** — Update tickets across four stages: Open, In Progress, Resolved, Closed
- **Comments** — Add internal comments on any ticket for team collaboration
- **Users Page** — View all registered users in the system
- **Settings** — Update profile information
- **Responsive UI** — Fully functional across desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

```

### Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'general',
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/        # Dashboard page and layout
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── tickets/          # Tickets list, new ticket, ticket detail
│   ├── users/            # Users management page
│   ├── settings/         # User settings page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Root redirect
├── components/
│   ├── ui/
│   │   ├── Badge.tsx     # Status and priority badges
│   │   └── Button.tsx    # Reusable button component
│   └── Sidebar.tsx       # Navigation sidebar
├── lib/
│   └── supabase.ts       # Supabase client
└── types/
    └── index.ts          # TypeScript type definitions
```

---

## Deployment

The application is deployed on Vercel with automatic deployments on every push to `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aryan8790/aikart-support)

---

## Author

**Aryan Tekade**
- GitHub: [@aryan8790](https://github.com/aryan8790)
- LinkedIn: [linkedin.com/in/aryan-tekade-b47423259](https://linkedin.com/in/aryan-tekade-b47423259)

---

## License

This project was built as part of the AIKart Full Stack Developer Internship Assessment.
