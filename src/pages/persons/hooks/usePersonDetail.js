import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

export const usePersonDetail = (id) =>
  useQuery({
    queryKey: ["person", id],
    queryFn: () => apiGet(`/api/persons/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60,       // 1 min
    cacheTime: 1000 * 60 * 30,  // 30 min
    refetchOnWindowFocus: false,
  });
