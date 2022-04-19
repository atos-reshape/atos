import { QueryClient, QueryFunctionContext } from 'react-query';

export type QueryFunctionParams = QueryFunctionContext & {
  queryKey: [string, Record<string, any>?];
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      useErrorBoundary: false
    }
  }
});
