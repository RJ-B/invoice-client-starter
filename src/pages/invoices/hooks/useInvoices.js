import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

export const useInvoices = (endpoint = "/invoices") => {
  return useQuery({
    queryKey: ["invoices", endpoint],
    queryFn: () => apiGet(`/api${endpoint}`),
    staleTime: 1000 * 60 * 5,    // 5 min
    cacheTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
  });
};
