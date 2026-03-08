declare module "@tanstack/react-query" {
  export const useQuery: (...args: any[]) => any
  export const useInfiniteQuery: (...args: any[]) => any
  export const useMutation: (...args: any[]) => any
  export const useQueryClient: (...args: any[]) => any
  export const QueryClientProvider: any
  export class QueryClient {
    constructor(config?: any)
  }
}
