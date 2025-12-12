import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

export const usePersons = () =>
  useQuery({
    queryKey: ["persons"],
    queryFn: () => apiGet("/api/persons"),
    staleTime: 1000 * 60 * 5,    // 5 min
    cacheTime: 1000 * 60 * 30,   // 30 min
    refetchOnWindowFocus: false,
  });
