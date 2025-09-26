import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { retryExchange } from '@urql/exchange-retry';
import { graphcacheExchange } from '@urql/exchange-graphcache';

export function createGraphQLClient(endpoint: string) {
  return new Client({
    url: endpoint,
    exchanges: [
      retryExchange({}),
      graphcacheExchange({}),
      cacheExchange,
      fetchExchange,
    ],
  });
}
