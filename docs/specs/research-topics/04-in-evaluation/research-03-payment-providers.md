# Research: Payment Providers

## Summary

Pick between Stripe and Paddle for launch. Focus on setup speed and monthly cost.

## Questions

- [ ] Which option should we choose right now?

## Findings

Both agents (cc, cu) recommend **Stripe** for launch due to lower transaction fees (~6.6% vs ~10% effective at $10/mo) and faster setup for a US-focused product. Paddle's merchant-of-record value doesn't justify the cost premium at this price point.

Claude (cc) discovered **Clerk Billing** — a native Stripe wrapper in our existing auth provider — that reduces integration to ~1-2 hours via drop-in components (`<PricingTable />`, `<UserProfile />` billing tab) and `has()` entitlement checks. Cursor (cu) recommended standard Stripe integration (3-5 days).

## Recommendation

**Use Stripe via Clerk Billing.** Lowest cost, fastest setup (~1-2 hours), and seamless integration with our existing Clerk auth. Clear upgrade path to Stripe Direct if we outgrow Clerk Billing's current limitations (USD-only, no tax/VAT yet).

## Output

### Selected Features

| Feature Name | Description | Priority | Create Command |
|---|---|---|---|
| payment-pricing-page | Add pricing page with Clerk `<PricingTable />` for Free vs Pro tiers | high | `aigon feature-create "payment-pricing-page"` |

### Not Selected
- payment-clerk-billing-setup: Dashboard/config task, not a code feature
- payment-entitlement-guards: Can be done as part of pricing page or separately later
- payment-profile-billing-tab: Medium priority, not selected for initial batch
- payment-free-trial: Medium priority, can be added later via dashboard config
- payment-annual-discount: Low priority
- payment-tax-setup: Not needed until selling beyond US
