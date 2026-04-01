import { PricingTable } from '@clerk/nextjs';

export default function PricingPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-stone-900 dark:text-amber-50">Plans & Pricing</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2 text-lg">
          Choose the plan that fits your collection
        </p>
      </header>

      <div className="mb-8">
        <PricingTable />
      </div>

      <div className="mt-8 p-6 bg-amber-100 dark:bg-stone-800 rounded-xl border border-amber-200 dark:border-stone-700">
        <h2 className="text-xl font-semibold text-stone-800 dark:text-amber-50 mb-3">What&apos;s included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-stone-700 dark:text-stone-300 mb-2">Free</h3>
            <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
              <li>✓ Up to 10 beers in your collection</li>
              <li>✓ Star ratings</li>
              <li>✓ Basic search</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-2">Pro</h3>
            <ul className="space-y-1 text-stone-600 dark:text-stone-400 text-sm">
              <li>✓ Unlimited beer collection</li>
              <li>✓ Star ratings</li>
              <li>✓ Advanced search & filters</li>
              <li>✓ Social sharing</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-stone-500 hover:text-stone-700 dark:hover:text-stone-300">
          ← Back to my collection
        </a>
      </div>
    </main>
  );
}
