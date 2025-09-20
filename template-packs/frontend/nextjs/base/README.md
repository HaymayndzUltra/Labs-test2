# {{PROJECT_NAME}} Frontend

This is a Next.js 15 application using the App Router.

## Getting Started

### Prerequisites
- Node.js 18+ (20/22 preferred)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/            # App Router pages and layouts
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and API client
├── types/          # TypeScript type definitions
└── styles/         # Global styles and Tailwind config
```

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **SWR** for data fetching
- **Axios** for API calls
- **React Hook Form** with Zod validation
- **Jest** for testing

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## React 19 Upgrade Notes (codemods & checks)

When upgrading or generating with React 19:

1. Dependencies
   - React/ReactDOM 19.1.x
   - TypeScript 5.9+
   - eslint-config-next ^15.x (flat config compatible)

2. Run codemods (review before commit)
   - Apply React 19 migration codemods for actions, form submission changes, and removed legacy patterns.
   - Verify client components only where needed; prefer server components by default.

3. Acceptance checks
   - `next build` succeeds with no type errors
   - `next start` boots, all App Router pages render
   - Forms submit correctly under React 19
   - ESLint passes with `eslint-config-next@15`
   - No bundle size regression >10%

Tip: If Jest fails after upgrade, align `babel-jest` with `jest@29` or migrate the test runner consistently.