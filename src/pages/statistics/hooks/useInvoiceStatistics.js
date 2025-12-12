import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

export const useInvoiceStatistics = () =>
  useQuery({
    queryKey: ["invoiceStatistics"],
    queryFn: () => apiGet("/api/invoices/statistics"),
    staleTime: 1000 * 60 * 10,   // 10 min
    cacheTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
  });
