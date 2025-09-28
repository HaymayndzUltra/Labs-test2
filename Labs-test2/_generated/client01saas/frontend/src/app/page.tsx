import Link from 'next/link';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PropWise';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Welcome to {APP_NAME}</h1>
        <p className="text-lg text-gray-600">
          Multi-tenant property operations with real-time analytics, automation cues, and secure organization-level isolation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
          >
            View dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-md border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Tenant lifecycle</h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage tenants, units, rent schedules, and maintenance requests with column-level org isolation enforced in the API.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Automation ready</h3>
          <p className="mt-2 text-sm text-gray-600">
            Trigger overdue payment nudges, ticket escalations, and PDF summaries that can be scheduled or exported on demand.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Analytics without guesswork</h3>
          <p className="mt-2 text-sm text-gray-600">
            Prebuilt cards, trend charts, and a heatmap powered by curated SQL bindings keep the dashboard trustworthy on day one.
          </p>
        </div>
      </section>
    </div>
  );
}
