# Research Findings: Payment Providers

**Agent:** Claude (cc)
**Research ID:** 03
**Date:** 2026-04-02

---

## Key Findings

### The Question

Which payment provider should BrewBoard use for its Pro subscription tier — Stripe or Paddle?

**Context:** BrewBoard is a Next.js 14 freemium SaaS using Clerk for authentication. The Pro tier (unlimited beer collections) needs a recurring subscription payment flow. The team is small and optimising for setup speed and low monthly cost.

---

### Option 1: Stripe (via Clerk Billing)

**The discovery that changes the calculus:** Clerk (our auth provider) ships a native billing integration called [Clerk Billing](https://clerk.com/billing) that wraps Stripe. It provides:

- **`<PricingTable />` component** — drop-in UI for plan selection and checkout
- **`<UserProfile />` billing tab** — customers manage subscriptions, view invoices
- **`has()` entitlement checks** — gate features with `has({ plan: 'pro' })` in server/client code
- **Automatic sync** — subscription status stored alongside user data, no webhooks to write
- **Free trials, annual billing, discount codes, add-ons** — all supported out of the box
- **Dev mode** — auto-connects to Stripe test account, zero config

This means the integration work is near-zero: define plans in the Clerk dashboard, drop two components into the app, and add `has()` checks where needed. No webhook endpoints, no Stripe SDK wiring, no subscription state sync.

**Pricing (Stripe via Clerk Billing):**
- Stripe processing: 2.9% + $0.30 per transaction
- Clerk Billing surcharge: 0.7% (same as Stripe Billing direct)
- No additional Clerk fee for billing features
- On a $10/month subscription: **~$0.66/txn (6.6% effective)**

**Current limitations of Clerk Billing:**
- USD only (no multi-currency yet)
- No tax/VAT handling (planned)
- No usage-based billing (planned)
- No refund support yet
- Not available in BR, IN, MY, MX, SG, TH

**Setup time:** ~1-2 hours (dashboard config + 2 components + entitlement checks)

---

### Option 2: Stripe (Direct Integration)

Using Stripe directly (without Clerk Billing) via Embedded Checkout and Stripe Billing:

**Pricing:**
- Processing: 2.9% + $0.30
- Stripe Billing: +0.7%
- Stripe Tax: +0.5% (optional, per jurisdiction)
- On a $10/month subscription: **~$0.66–$0.71/txn (6.6–7.1% effective)**

**What you build yourself:**
- Checkout session creation (server action)
- Webhook endpoint for subscription lifecycle events
- Customer ↔ user mapping and sync
- Subscription status storage and entitlement logic
- Customer portal or self-service UI

**Setup time:** 3-5 days for a standard subscription flow

**Advantages over Clerk Billing:**
- Multi-currency support
- Tax automation (Stripe Tax)
- Refunds
- Full API control and customisation
- Usage-based billing

---

### Option 3: Paddle (Merchant of Record)

Paddle acts as the legal seller — they handle tax compliance, disputes, and billing infrastructure globally.

**Pricing:**
- 5% + $0.50 per transaction (all-inclusive)
- Currency conversion adds ~2-3% on international sales
- On a $10/month subscription: **~$1.00/txn (10% effective)**
- Effective rate with international sales: potentially 12-13%

**What's included:**
- Global tax/VAT compliance (Paddle files and remits)
- Chargeback/dispute handling
- Subscription management, dunning, proration
- Checkout UI

**Setup time:** 1-2 days (official Next.js starter kit available)

**Disadvantages for BrewBoard:**
- No native Clerk integration — requires custom webhook sync for user ↔ subscription mapping
- Higher effective cost at our price point ($10/mo)
- USD-only payout with conversion fees on international revenue
- Less control over checkout experience
- Customer invoices come from "Paddle" not "BrewBoard"

---

### Cost Comparison at $10/month Pro Tier

| Provider | Per-txn cost | Effective rate | Setup time | Tax handling |
|---|---|---|---|---|
| **Stripe via Clerk Billing** | ~$0.66 | 6.6% | ~1-2 hours | Not yet (planned) |
| Stripe Direct | ~$0.66-$0.71 | 6.6-7.1% | 3-5 days | Stripe Tax (+0.5%) |
| Paddle | ~$1.00 | 10%+ | 1-2 days | Included |

At 100 Pro subscribers/month: Clerk Billing saves ~$34/mo vs Paddle, ~$408/year.
At 500 Pro subscribers/month: Clerk Billing saves ~$170/mo vs Paddle, ~$2,040/year.

### When Each Option Makes Sense

- **Paddle** makes sense at higher price points ($50+/mo) where the tax compliance value outweighs the fee premium, or if you're a solo founder with no time for tax compliance
- **Stripe Direct** makes sense when you need multi-currency, tax automation, or usage-based billing and have engineering capacity
- **Stripe via Clerk Billing** makes sense when you're already on Clerk, want the fastest path to market, and can live with USD-only for now

---

## Sources

- [Clerk Billing Overview](https://clerk.com/billing)
- [Clerk Billing Docs](https://clerk.com/docs/guides/billing/overview)
- [Clerk Billing for B2C SaaS (Next.js)](https://clerk.com/docs/nextjs/guides/billing/for-b2c)
- [Add subscriptions to your SaaS with Clerk Billing](https://clerk.com/blog/add-subscriptions-to-your-saas-with-clerk-billing)
- [Clerk + Stripe at Stripe Sessions](https://stripe.com/sessions/2025/instant-zero-integration-saas-billing-with-clerk-stripe)
- [Stripe Pricing](https://stripe.com/pricing)
- [Stripe Billing Docs](https://docs.stripe.com/billing/subscriptions/build-subscriptions)
- [Paddle Pricing](https://www.paddle.com/pricing)
- [Paddle Next.js Starter Kit](https://github.com/PaddleHQ/paddle-nextjs-starter-kit)
- [Paddle Fees Explained (2026)](https://dodopayments.com/blogs/paddle-fees-explained)
- [Stripe vs Paddle Comparison](https://designrevision.com/blog/stripe-vs-paddle)
- [Stripe vs Paddle for SaaS Billing 2026](https://kirweb.site/comparisons/stripe-vs-paddle-for-saas-billing/)
- [Paddle vs Stripe for Indie Hackers](https://calmops.com/programming/web/payment-processing-guide/)

---

## Recommendation

**Use Stripe via Clerk Billing.** This is the clear winner for BrewBoard right now:

1. **Near-zero integration effort** — we already use Clerk for auth, so billing is a dashboard toggle + two React components. No webhooks, no Stripe SDK, no subscription state management.
2. **Lowest cost** — 6.6% effective vs 10%+ for Paddle at our $10/month price point.
3. **Best DX** — entitlement checks via `has({ plan: 'pro' })` integrate directly with Clerk's auth middleware and component guards we already use.
4. **Clear upgrade path** — if we outgrow Clerk Billing (need multi-currency, tax automation, usage billing), we can migrate to Stripe Direct since Clerk Billing uses our own Stripe account under the hood. No vendor lock-in on the payment processor itself.

The main trade-off is no tax/VAT handling yet, but for a US-focused launch this is acceptable — we can add Stripe Tax directly or wait for Clerk to ship it.

**Paddle is not recommended** because: (a) higher fees at our price point, (b) no Clerk integration means building the sync layer Clerk Billing gives us for free, and (c) invoices branded "Paddle" not "BrewBoard" hurts brand trust for a consumer product.

---

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|---|---|---|---|
| payment-clerk-billing-setup | Configure Clerk Billing with Pro plan in dashboard, add Stripe account connection | high | none |
| payment-pricing-page | Add pricing page with Clerk `<PricingTable />` component showing Free vs Pro tiers | high | payment-clerk-billing-setup |
| payment-entitlement-guards | Gate Pro features (unlimited collections) using Clerk `has()` entitlement checks | high | payment-clerk-billing-setup |
| payment-profile-billing-tab | Enable billing management tab in `<UserProfile />` for subscription/invoice self-service | medium | payment-clerk-billing-setup |
| payment-free-trial | Configure 14-day free trial for Pro tier via Clerk Billing dashboard | medium | payment-clerk-billing-setup |
| payment-annual-discount | Add annual billing option with discount to reduce churn and improve LTV | low | payment-pricing-page |
