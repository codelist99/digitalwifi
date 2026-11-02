# Wifi Digital System funnel

Exact rebuild of the Wifi Digital System VSL and WifiCode post-purchase funnel with a first-party Authorize.Net checkout, one-click OTO1–OTO7 purchases, downsells, thank-you onboarding, tracking, refunds, and a monthly admin dashboard.

## Local setup

Copy `.env.example` to `.env`, provide a dedicated `DATABASE_URL` plus the Authorize.Net credentials, then run:

```powershell
npm.cmd install
npm.cmd start
```

Open `/` for the VSL, `/checkout?product=front` for the $17 checkout, and `/admin` for reporting. The admin defaults to the current month and also supports a specific month or all-time totals.

## Funnel routes

`/` → `/checkout` → `/oto1` → `/oto2` → `/oto3` → `/oto4` → `/oto5` → `/oto6` → `/oto7` → `/thankyou`

Each OTO page supports its matching full-price and downsell product through the saved Authorize.Net customer profile created at checkout.
