# Preshy Beauty

Apparel & hair salon for **Ndola Town Centre, Zambia**.

## Features
- Shop (apparel) + hair extensions
- Hair services: wigs, Spanish curls, fish tails, deep wave, bone straight, braids…
- Booking + admin CRM
- **Supabase database** (with localStorage fallback)
- **Paystack** ZMW checkout (demo mode if not configured)
- **WhatsApp** floating chat
- Contact: +260 978 974 055 · +260 962 598 440

## Setup
```bash
npm install
cp .env.example .env.local
# Fill Supabase + Paystack + admin credentials
# Run supabase/schema.sql in Supabase SQL editor
npm run dev
```

## Deploy
See **[DEPLOY.md](./DEPLOY.md)** — Vercel + Supabase + Paystack step-by-step.

## Admin
`/admin/login` — credentials from env (`NEXT_PUBLIC_ADMIN_USER` / `NEXT_PUBLIC_ADMIN_PASSWORD`)
