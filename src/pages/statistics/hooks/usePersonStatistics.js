import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

export const usePersonStatistics = () =>
  useQuery({
    queryKey: ["personStatistics"],
    queryFn: () => apiGet("/api/persons/statistics"),
    staleTime: 1000 * 60 * 10,   // 10 min
    cacheTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
  });
