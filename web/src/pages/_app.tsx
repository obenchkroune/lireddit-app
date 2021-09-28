import { ChakraProvider } from '@chakra-ui/react';
import { Provider, createClient } from 'urql';

import theme from '../theme';

const client = createClient({
  url: 'http://localhost:3001/graphql',
  fetchOptions: {
    credentials: 'include',
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;