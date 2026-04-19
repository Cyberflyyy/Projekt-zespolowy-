# Tutoring Marketplace

Production-style full-stack tutoring marketplace: **Next.js 16 (App Router) · TypeScript · Tailwind · Supabase SSR · Stripe Checkout + Connect**. UI inspired by Notion (warm minimalism, serif headings, soft surfaces).

## Quick start

```bash
cp .env.local.example .env.local      # fill in values
npm install
npm run dev
```

Apply database migrations in order via the Supabase SQL editor (or `supabase db push`):

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_seed.sql`

Create a public Storage bucket named `avatars`.

## Stripe (test mode)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Roles

- `student` — browses tutors, books, pays.
- `tutor` — publishes listings, manages availability, onboards via Stripe Connect, receives payouts.
- `admin` — moderates users, listings, bookings, payments.

Promote a user to admin:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## Project structure

See the top-level folder structure for `app/`, `components/`, `lib/supabase/`, `lib/stripe/`, `lib/auth/`, `lib/db/`, `supabase/migrations/`.
