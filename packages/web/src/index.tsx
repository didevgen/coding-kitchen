import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import * as React from 'react';
import { render } from 'react-dom';
import { createUploadLink } from 'apollo-upload-client';
import Cookies from 'js-cookie';

import App from './App';
import { typePolicies } from './localState/typePolicies';

const GRAPHQL_API_URL = 'http://localhost:8080/graphql';

const httpLink = createUploadLink({
  uri: GRAPHQL_API_URL
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');
  return {
    headers: {
      ...headers,
      authorization: token ? token : ''
    }
  };
});

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({extensions, message, locations, path}) => {
            // tslint:disable-next-line:prettier
            if (extensions?.code === 'UNAUTHENTICATED') {
                window.location.href = '/login';
                return;
            }

            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

const client = new ApolloClient({
    link: ApolloLink.from([errorLink as any, authLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies
    })
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
