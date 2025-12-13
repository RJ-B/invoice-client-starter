import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

/* ===== Pomocná validace dat ===== */
const normalizeInvoiceStatistics = (data) => {
  if (!data || typeof data !== "object") {
    return {
      currentYearSum: 0,
      allTimeSum: 0,
      invoicesCount: 0,
    };
  }

  return {
    currentYearSum: Number(data.currentYearSum ?? 0),
    allTimeSum: Number(data.allTimeSum ?? 0),
    invoicesCount: Number(data.invoicesCount ?? 0),
  };
};

export const useInvoiceStatistics = () =>
  useQuery({
    queryKey: ["invoiceStatistics"],
    queryFn: async () => {
      try {
        const data = await apiGet("/api/invoices/statistics");
        return normalizeInvoiceStatistics(data);
      } catch (error) {
        throw new Error(
          error?.response?.data?.message ||
          "Nepodařilo se načíst statistiky faktur."
        );
      }
    },
    staleTime: 1000 * 60 * 10,   // 10 min
    cacheTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
    retry: 1,
  });
