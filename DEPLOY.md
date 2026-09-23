# Preshy Beauty — Deploy & harden

## 1. Supabase database

1. Create project at supabase.com  
2. **SQL Editor** → run `supabase/schema.sql` (hardened RLS included)  
3. If you already ran the old open-write schema, also run `supabase/rls-harden.sql`  
4. Copy **Project URL**, **anon key**, **service_role key** into Vercel env

### Seed the catalog (all visitors see the same data)

**After deploy**, open `/admin/login` → Admin dashboard → **Seed catalog (if empty)**.

That calls `/api/seed` with the service role and fills products, services, stylists, extensions.

Use **Force re-seed** only if you want to replace existing rows.

---

## 2. Paystack — test first, then live

| Stage | Secret key | Public key |
|-------|------------|------------|
| Testing | `sk_test_...` | `pk_test_...` |
| Live | `sk_live_...` | `pk_live_...` |

1. Set `PAYSTACK_SECRET_KEY=sk_test_...` on Vercel  
2. Place a test order (card) — you should redirect to Paystack  
3. Confirm webhook (below) marks order paid  
4. Switch env to `sk_live_...` and redeploy  

Without a secret key, checkout stays in **safe demo mode** (no real charge).

### Webhook (recommended once you take real payments)

Paystack Dashboard → **Settings → API / Webhooks**:

```
https://YOUR_DOMAIN/api/paystack/webhook
```

Events: `charge.success`  

The route verifies `x-paystack-signature` and sets the order to `paid` in Supabase.

---

## 3. Vercel env vars

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SITE_URL` | Yes |
| `ADMIN_USER` | Yes |
| `ADMIN_PASSWORD` | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (seed + admin writes + webhook) |
| `PAYSTACK_SECRET_KEY` | For real payments (`sk_test_` first) |
| `SEED_SECRET` | Optional (defaults to admin password) |

```bash
npm install && npm run build
npx vercel --prod
```

---

## 4. RLS model (hardened)

| Table | Anon can |
|-------|----------|
| products, services, stylists, extensions | **SELECT only** |
| bookings, orders | **INSERT + SELECT** |
| Catalog writes | **Service role only** (seed + `/api/admin/mutate`) |

Public users cannot edit the shop catalog. Admin changes go through authenticated API routes.

---

## 5. Post-deploy checklist

- [ ] Run `schema.sql` (and `rls-harden.sql` if upgrading)
- [ ] Env vars set; redeploy
- [ ] Admin login works
- [ ] Click **Seed catalog (if empty)**
- [ ] Shop/Salon show seeded data on a second browser/device
- [ ] Book appointment → visible in Admin
- [ ] Checkout with `sk_test_` redirects to Paystack
- [ ] Webhook URL registered for live traffic
- [ ] WhatsApp button works

---

## 6. What still won’t break the site

- Missing Paystack → demo checkout  
- Missing Supabase → localStorage fallback  
- Failed seed → clear error message in Admin  
- Invalid webhook signature → 401, no data corruption  


## Admin auth (secure)

- `ADMIN_USER` and `ADMIN_PASSWORD` are **server-only** (no `NEXT_PUBLIC_`).
- Login: `/admin/login` → server sets **httpOnly** session cookie.
- Password is never sent to the browser bundle.
- Remove any old `NEXT_PUBLIC_ADMIN_*` variables from Vercel to clear the warning.
