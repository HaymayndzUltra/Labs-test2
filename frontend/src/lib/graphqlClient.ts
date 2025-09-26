import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const graphQLClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://example.com/graphql',
    fetch: async (...args) => {
      console.info('GraphQL stub fetch', args[0]);
      return fetch(...args);
    },
  }),
  cache: new InMemoryCache(),
});
