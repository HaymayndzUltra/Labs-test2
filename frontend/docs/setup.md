# Setup Guide

1. **Environment Variables**
   - Duplicate `.env.example` → `.env.local`.
   - Populate TODO values: `POSTHOG_KEY`, `HOTJAR_ID`, `OPENAI_API_KEY`, `N8N_WEBHOOK_URL`, `CONTENTFUL_TOKEN`, `SANITY_API_TOKEN`.
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run Development Server**
   ```bash
   npm run dev
   ```
4. **Analytics Verification**
   - Confirm PostHog events appear under the placeholder project.
   - Hotjar/LogRocket remain TODO until keys provided.
5. **Automation Stubs**
   - Replace `triggerN8nWorkflow` with live n8n/Zapier/Make endpoints.
   - Configure Supabase bucket for PDF export (see `lib/pdf` TODO placeholder).
6. **Deployment**
   - `npm run build` before deploying to Vercel.
   - Ensure environment variables exist in Vercel dashboard.
