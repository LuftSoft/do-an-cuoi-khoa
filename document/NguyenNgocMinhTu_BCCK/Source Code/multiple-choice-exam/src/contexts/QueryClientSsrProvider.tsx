import type { DehydratedState, QueryClient } from '@tanstack/react-query';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { FC, ReactNode } from 'react';

interface QueryClientSsrProviderProps {
  queryClient: QueryClient;
  dehydratedState: DehydratedState;
  children: ReactNode;
}

const QueryClientSsrProvider: FC<QueryClientSsrProviderProps> = ({
  queryClient,
  dehydratedState,
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default QueryClientSsrProvider;
