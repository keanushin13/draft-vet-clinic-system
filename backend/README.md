# PawCruz — Backend

Node.js + Express REST API for the PawCruz veterinary clinic management system. Uses Prisma ORM with a Supabase (PostgreSQL) database.

---

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Runtime        | Node.js                            |
| Framework      | Express 4                          |
| ORM            | Prisma 7                           |
| Database       | Supabase (PostgreSQL)              |
| Driver Adapter | `@prisma/adapter-pg`               |
| Auth           | JWT + OTP via Email                |
| Email          | Nodemailer                         |
| Security       | Helmet, xss-clean, csurf, bcryptjs |
| Hosting        | Render.com (production)            |

---

## Project Structure

```
backend/
├── controllers/
│   └── userController.js     # All auth logic
├── lib/
│   └── prisma.js             # Prisma client singleton
├── models/                   # (legacy, no longer used)
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history (if using migrate)
├── prisma.config.ts          # Prisma CLI config (datasource URLs)
├── routes/
│   └── userRoutes.js         # Express router
├── utils/
│   └── sendEmail.js          # Nodemailer helper
├── server.js                 # App entry point
└── .env                      # Environment variables (not committed)
```

---

## Environment Variables

Create a `.env` file in this folder:

```env
# Supabase / Prisma (PostgreSQL)
# Transaction mode (pgbouncer) — used by the running server
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session mode (direct) — used by Prisma CLI (db push / migrate)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

PORT=5000

# Nodemailer (Gmail app password)
EMAIL_USER=your@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Frontend origin for CORS and email links
CLIENT_URL=http://localhost:3000
PUBLIC_SERVER_URL=http://localhost:5000
```

Get `DATABASE_URL` and `DIRECT_URL` from:  
**Supabase → Project Settings → Database → Connection string**

---

## Setup

```bash
npm install
```

### Push schema to Supabase (first time or after schema changes)

Temporarily set `prisma.config.ts` to use `DIRECT_URL`, then:

```bash
npx prisma db push
```

Then restore `prisma.config.ts` to use `DATABASE_URL`.

### Generate Prisma client

```bash
npx prisma generate
```

### Run

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`.

---

## API Endpoints

All routes are prefixed with `/api`.

### Authentication Routes (`/users`)

| Method   | Path                     | Description                             |
| -------- | ------------------------ | --------------------------------------- |
| `POST`   | `/register`              | Register new user                       |
| `GET`    | `/verify-email/:token`   | Verify email (link from email)          |
| `POST`   | `/login`                 | Login step 1 — returns OTP to email     |
| `POST`   | `/verify-login-otp`      | Login step 2 — verify OTP               |
| `POST`   | `/resend-login-otp`      | Resend login OTP                        |
| `POST`   | `/forgot-password`       | Send password reset email               |
| `GET`    | `/reset-password/:token` | Password reset page (browser)           |
| `POST`   | `/reset-password/:token` | Submit new password                     |
| `GET`    | `/unlock/:token`         | Unlock locked account (link from email) |
| `POST`   | `/send-unlock-email`     | Request unlock email                    |
| `POST`   | `/update-password`       | Change password (logged in)             |
| `DELETE` | `/delete/:id`            | Delete user account                     |
| `GET`    | `/csrf-token`            | Get CSRF token                          |

### Roles

| Role           | Description                               |
| -------------- | ----------------------------------------- |
| `pet_owner`    | Default role — owners managing their pets |
| `staff`        | Clinic staff                              |
| `veterinarian` | Veterinarians                             |
| `admin`        | Full system access                        |

> `admin` role can only be assigned directly in the database — it is not selectable during registration.

---

## Security

- Passwords hashed with `bcryptjs` (salt rounds: 10)
- OTP hashed before storage
- Account locked after 5 failed login attempts (5-minute lockout)
- CSRF protection on mutating logged-in routes
- XSS sanitization on all request bodies
- Security headers via `helmet`
- Tokens (email verify, reset, unlock) expire after 5 minutes and are single-use

---

## CORS Configuration (Important for Mobile)

API allows requests from:

- ✅ `http://localhost:3000` (React Web Admin)
- ✅ `http://localhost:8081` (Expo Web)
- ✅ `http://localhost` & `https://localhost` (Capacitor Mobile App)
- ✅ Custom `CLIENT_URL` from `.env` (LAN frontend)

**Mobile Note**: Capacitor webview uses `https://localhost` origin. Update `server.js` if adding new origins.

---

## Deploy to Render.com

### Prerequisites

- GitHub repository with code
- Render.com account

### Steps

1. Create New Web Service on Render.com
2. Connect GitHub repo
3. Set Build: `npm install && npx prisma generate`
4. Set Start: `npm run start`
5. Add environment variables (DATABASE_URL, DIRECT_URL, EMAIL_USER, etc.)
6. Deploy — auto-deploys on git push

**Current Production**: `https://vet-clinic-system-api.onrender.com/api`

---

## Troubleshooting

### CORS Error on Mobile

- Ensure `https://localhost` in `server.js` `allowedOrigins`
- Rebuild Android: `npm run build:android`
- Check frontend `.env` API_URL

### Port 5000 Already in Use

```bash
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Database Connection Failed

- Verify DATABASE_URL and DIRECT_URL
- Test with `npx prisma studio`
