import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

/**
 * Normalizuje detail osoby získaný z backendu.
 * Zajišťuje konzistentní strukturu dat pro UI.
 *
 * @param {any} data - Data vrácená z API
 * @returns {Object|null} Normalizovaný objekt osoby nebo null
 */
const normalizePersonDetail = (data) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  return {
    id: data.id ?? null,
    name: data.name ?? "",
    identificationNumber: data.identificationNumber ?? "",
    taxNumber: data.taxNumber ?? "",
    accountNumber: data.accountNumber ?? "",
    bankCode: data.bankCode ?? "",
    iban: data.iban ?? "",
    telephone: data.telephone ?? "",
    mail: data.mail ?? "",
    street: data.street ?? "",
    zip: data.zip ?? "",
    city: data.city ?? "",
    country: data.country ?? null,
    note: data.note ?? "",
  };
};

/**
 * Hook pro načtení detailu konkrétní osoby.
 *
 * @param {number|string|null} id - Identifikátor osoby
 * @returns {Object} Výsledek React Query hooku (data, isLoading, error, atd.)
 */
export const usePersonDetail = (id) =>
  useQuery({
    queryKey: ["person", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;

      try {
        const data = await apiGet(`/api/persons/${id}`);
        return normalizePersonDetail(data);
      } catch (error) {
        throw new Error(
          error?.response?.data?.message ||
          "Nepodařilo se načíst detail osoby."
        );
      }
    },
    staleTime: 1000 * 60,       // 1 min
    cacheTime: 1000 * 60 * 30,  // 30 min
    refetchOnWindowFocus: false,
    retry: 1,
  });
