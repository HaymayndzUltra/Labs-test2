import { createClient as createSanityClient } from 'sanity';
import { createClient as createContentfulClient } from 'contentful';

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo';
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createSanityClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const contentfulClient = createContentfulClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'demo',
  accessToken: process.env.CONTENTFUL_TOKEN || 'placeholder',
});
