# Research Findings: payment providers

**Agent:** Cursor (cu)
**Research ID:** 03
**Date:** 2026-04-02

---

## Key Findings

**Stripe** and **Paddle** both support subscriptions and SaaS billing, but they optimize for different trade-offs: **lower per-transaction cost and maximum control (Stripe)** versus **merchant-of-record (MoR) simplicity and bundled tax/compliance (Paddle)**.

### Monthly cost (cash out the door)

- **Neither** charges a typical **monthly platform fee** at small scale; you mostly pay **per successful charge** plus optional add-ons.
- **Stripe (US card-present style pricing):** commonly **~2.9% + $0.30** per successful card charge (region-specific; verify [Stripe pricing](https://stripe.com/pricing)). You are the seller of record; global tax/VAT usually needs **Stripe Tax** (usage-based) and/or registration work, which adds **operational** cost rather than a single line item.
- **Paddle:** commonly quoted at roughly **~5% + $0.50** per transaction (verify [Paddle pricing](https://www.paddle.com/pricing)); **Paddle is MoR**, so a large part of what you “pay extra” vs Stripe is **tax handling, compliance, and dispute handling** bundled into that rate—not apples-to-apples vs raw Stripe card fees alone.

**Net:** For **minimizing variable fees on the same revenue**, **Stripe usually wins**. For **minimizing total burden when selling globally without a finance/tax stack**, effective cost often **narrows** once Stripe Tax, FX, chargebacks, and compliance time are included—depends on geography and volume.

### Setup speed

- **Stripe:** A basic **Checkout** or **Billing** flow can be **live in hours to a few days** for a team that already knows Stripe; complexity grows when you add **tax**, **multi-currency**, **usage-based** billing, and **dunning**—you own more product/engineering surface area.
- **Paddle:** Integration is **opinionated** (MoR checkout, fewer “build your own” paths than Stripe). Vendors often describe **days** to go live; you trade UI/control for **less** tax/VAT and MoR responsibility on your side.

**Net:** **Fastest time-to-first-charge** for a **US-centric** MVP with a developer who knows the APIs: often **Stripe**. **Fastest path to “we sell in many countries and don’t want to own tax registration”**: often **Paddle** (at higher take rate).

### When to pick which

| Criterion | Lean Stripe | Lean Paddle |
|-----------|-------------|-------------|
| Primary markets first | US / single region | EU/UK/global from day one |
| Team capacity | Can own billing edge cases + integrations | Want MoR + fewer compliance threads |
| Checkout UX | Need deep customization | Overlay/hosted checkout is fine |
| Fee sensitivity | High (optimize % of revenue) | Accept higher % for bundled ops |

## Sources

- Stripe pricing: https://stripe.com/pricing  
- Paddle pricing: https://www.paddle.com/pricing  
- Stripe Billing: https://stripe.com/billing  
- Paddle Merchant of Record overview: https://www.paddle.com/solutions/paddle-for-saas  

*(Third-party comparisons vary; always confirm current rates and terms on official pages before signing.)*

## Recommendation

**Choose Stripe for launch** if the goal is **lowest transaction fees**, **fast iteration** for engineers already comfortable with Stripe, and **initial** focus on **one primary region** (or you are ready to layer **Stripe Tax** and processes as you expand).

**Choose Paddle for launch** if you need **MoR + global tax handling** from the first paid customer with **minimal** finance/compliance overhead and are willing to pay **higher take rate** and accept **less** checkout customization.

For this research question (“right now” with **setup speed + monthly cost** as the lens), **Stripe is the default** unless the product is **explicitly global-paid-from-day-one** and the team **cannot** own tax/compliance yet—in that case, **Paddle** is the better fit despite higher fees.

## Suggested Features

| Feature Name | Description | Priority | Depends On |
|--------------|-------------|----------|------------|
| payments-stripe-checkout | Add Stripe Checkout (or Billing) for subscriptions with webhook-driven entitlements | high | none |
| billing-customer-portal | Stripe Customer Portal for plan changes/cancel (or equivalent) | medium | payments-stripe-checkout |
| tax-stripe-tax | Enable Stripe Tax once selling beyond home region | medium | payments-stripe-checkout |
