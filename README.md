# Wifi Digital System funnel

Exact rebuild of the Wifi Digital System VSL and WifiCode post-purchase funnel with a first-party NMI checkout, one-click OTO1–OTO7 purchases, downsells, thank-you onboarding, tracking, refunds, and a monthly admin dashboard.

## Local setup

Copy `.env.example` to `.env`, provide a dedicated `DATABASE_URL` plus the NMI public/private keys, then run:

```powershell
npm.cmd install
npm.cmd start
```

Open `/` for the VSL, `/checkout?product=front` for the $17 checkout, and `/admin` for reporting. The admin defaults to the current month and also supports a specific month or all-time totals.

## Funnel routes

`/` → `/checkout` → `/oto1` → `/oto2` → `/oto3` → `/oto4` → `/oto5` → `/oto6` → `/oto7` → `/thankyou`

Each OTO page supports its matching full-price and downsell product through the saved NMI customer vault created at checkout.

## Fraud Deflect FDID

Set `FD_CLIENT_ID` to the team/client identifier supplied by Fraud Deflect. The server loads FDID only on the NMI purchase journey: `/checkout`, `/oto1` through `/oto7` (including downsell actions), and `/thankyou`. The checkout email is stored in `sessionStorage` as `userEmail` and reused to initialize the same Fraud Deflect session across the funnel.
