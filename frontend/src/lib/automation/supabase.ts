import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export const uploadPdfStub = async (pdfBase64: string) => {
  console.info('Uploading PDF stub to Supabase (placeholder). Length:', pdfBase64.length);
  return { url: 'https://supabase.demo/proposals/sample.pdf' };
};
