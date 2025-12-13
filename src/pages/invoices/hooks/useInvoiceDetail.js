import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

/**
 * Normalizuje detail faktury získaný z backendu.
 * Zajišťuje konzistentní strukturu dat pro UI.
 *
 * @param {any} data - Data vrácená z API
 * @returns {Object|null} Normalizovaný objekt faktury nebo null
 */
const normalizeInvoiceDetail = (data) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  return {
    id: data.id ?? null,
    invoiceNumber: data.invoiceNumber ?? "",
    issued: data.issued ?? "",
    dueDate: data.dueDate ?? "",
    product: data.product ?? "",
    price: Number(data.price ?? 0),
    vat: Number(data.vat ?? 0),
    note: data.note ?? "",

    seller: {
      id: data.seller?.id ?? null,
      name: data.seller?.name ?? "",
    },

    buyer: {
      id: data.buyer?.id ?? null,
      name: data.buyer?.name ?? "",
    },
  };
};

/**
 * Hook pro načtení detailu faktury podle ID.
 *
 * @param {number|string|null} id - ID faktury
 * @returns {Object} React Query výsledek (data, isLoading, error, ...)
 */
export const useInvoiceDetail = (id) =>
  useQuery({
    /**
     * Unikátní klíč dotazu – detail konkrétní faktury.
     */
    queryKey: ["invoice", id],

    /**
     * Dotaz se provede pouze v případě, že ID existuje.
     */
    enabled: !!id,

    /**
     * Načtení a normalizace dat z backendu.
     */
    queryFn: async () => {
      if (!id) return null;

      const data = await apiGet(`/api/invoices/${id}`);
      return normalizeInvoiceDetail(data);
    },

    /**
     * Data jsou považována za čerstvá po dobu 10 minut.
     */
    staleTime: 1000 * 60 * 10, // 10 minut
  });
