import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

/* ===== Normalizace a validace dat ===== */
const normalizePersonStatistics = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    personId: item?.personId ?? null,
    personName: item?.personName ?? "Neznámý subjekt",
    revenue: Number(item?.revenue ?? 0),
  }));
};

export const usePersonStatistics = () =>
  useQuery({
    queryKey: ["personStatistics"],
    queryFn: async () => {
      try {
        const data = await apiGet("/api/persons/statistics");
        return normalizePersonStatistics(data);
      } catch (error) {
        throw new Error(
          error?.response?.data?.message ||
          "Nepodařilo se načíst statistiky osob."
        );
      }
    },
    staleTime: 1000 * 60 * 10,   // 10 min
    cacheTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
    retry: 1,
  });
