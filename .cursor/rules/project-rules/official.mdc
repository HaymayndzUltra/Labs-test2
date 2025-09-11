---
description: Official
alwaysApply: false
---


## Overview

[tRPC](https://trpc.io/) enables end-to-end typesafe APIs, allowing you to build and consume APIs without schemas, code generation, or runtime errors. These rules will help you follow best practices for tRPC v11.

## Project Structure

For a clean tRPC setup, follow this recommended structure:
```
.
├── src
│ ├── pages
│ │ ├── _app.tsx # add `createTRPCNext` setup here
│ │ ├── api
│ │ │ └── trpc
│ │ │ └── [trpc].ts # tRPC HTTP handler
│ │ ├── server
│ │ │ ├── routers
│ │ │ │ ├── _app.ts # main app router
│ │ │ │ ├── [feature].ts # feature-specific routers
│ │ │ │ └── [...]
│ │ │ ├── context.ts # create app context
│ │ │ └── trpc.ts # procedure helpers
│ │ └── utils
│ │ └── trpc.ts # typesafe tRPC hooks
```

## Server-Side Setup

### Initialize tRPC Backend

```typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server';

// Initialize tRPC backend (should be done once per backend)
const t = initTRPC.create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
```

### Create Router

```typescript
// server/routers/_app.ts
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const appRouter = router({
// Your procedures here
greeting: publicProcedure
.input(z.object({ name: z.string() }))
.query(({ input }) => {
return `Hello ${input.name}`;
}),
});

// Export type definition of API (not the router itself!)
export type AppRouter = typeof appRouter;
```

## Client-Side Setup

### Next.js Integration

```typescript
// utils/trpc.ts
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/routers/_app';

function getBaseUrl() {
if (typeof window !== 'undefined') return ''; // browser should use relative path
if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const trpc = createTRPCNext<AppRouter>({
config() {
return {
links: [
httpBatchLink({
url: `${getBaseUrl()}/api/trpc`,
// Include auth headers when needed
async headers() {
return {
// authorization: getAuthCookie(),
};
},
}),
],
};
},
ssr: false, // Set to true if you want to use server-side rendering
});
```