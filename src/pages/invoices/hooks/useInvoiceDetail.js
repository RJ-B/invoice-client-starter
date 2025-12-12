import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

export const useInvoiceDetail = (id) =>
  useQuery({
    queryKey: ["invoice", id],
    queryFn: () => apiGet(`/api/invoices/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minut cache
  });
