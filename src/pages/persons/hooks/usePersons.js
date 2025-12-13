import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

/**
 * Normalizuje a stabilně seřadí seznam osob získaný z backendu.
 *
 * - zaručí pole
 * - zaručí strukturu objektu
 * - ZARUČÍ STÁLÉ POŘADÍ (podle ID)
 *
 * @param {any} data - Data vrácená z API
 * @returns {Array<Object>} Normalizované a seřazené osoby
 */
const normalizePersons = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((person) => ({
      id: person?.id ?? null,
      name: person?.name ?? "",
      identificationNumber: person?.identificationNumber ?? "",
      taxNumber: person?.taxNumber ?? "",
    }))
    .filter((person) => person.id !== null)
    .sort((a, b) => {
      // stabilní řazení – ID z databáze
      if (typeof a.id === "number" && typeof b.id === "number") {
        return a.id - b.id;
      }
      return String(a.id).localeCompare(String(b.id));
    });
};

/**
 * Hook pro načtení seznamu osob.
 *
 * - React Query cache
 * - normalizace dat
 * - STABILNÍ POŘADÍ
 */
export const usePersons = () =>
  useQuery({
    queryKey: ["persons"],
    queryFn: async () => {
      try {
        const data = await apiGet("/api/persons");
        return normalizePersons(data);
      } catch (error) {
        throw new Error(
          error?.response?.data?.message ||
          "Nepodařilo se načíst seznam osob."
        );
      }
    },
    staleTime: 1000 * 60 * 5,    // 5 minut
    cacheTime: 1000 * 60 * 30,   // 30 minut
    refetchOnWindowFocus: false,
    retry: 1,
  });
