import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../../utils/api";

/**
 * Normalizuje jednu fakturu ze seznamu.
 * Zajišťuje stabilní a konzistentní strukturu dat pro UI.
 *
 * @param {any} item - Položka faktury z backendu
 * @returns {Object|null} Normalizovaný objekt faktury
 */
const normalizeInvoiceItem = (item) => {
  if (!item || typeof item !== "object") {
    return null;
  }

  // === ID (vždy number, jinak zahodit) ===
  const id =
    item.id !== undefined && item.id !== null
      ? Number(item.id)
      : item._id !== undefined && item._id !== null
      ? Number(item._id)
      : null;

  if (id === null || Number.isNaN(id)) {
    return null;
  }

  return {
    id,

    // 🔑 DŮLEŽITÉ: invoiceNumber VŽDY string
    invoiceNumber:
      item.invoiceNumber !== undefined && item.invoiceNumber !== null
        ? String(item.invoiceNumber)
        : "",

    price: Number(item.price ?? 0),

    seller: {
      id: item.seller?.id ?? null,
      name: item.seller?.name ?? "",
    },

    buyer: {
      id: item.buyer?.id ?? null,
      name: item.buyer?.name ?? "",
    },
  };
};

/**
 * Hook pro načtení seznamu faktur.
 *
 * VLASTNOSTI:
 * - normalizace dat
 * - stabilní řazení podle ID z databáze
 * - žádné přeskakování položek po editaci
 * - kompatibilní s InvoiceTable + PropTypes
 */
export const useInvoices = (endpoint = "/invoices") =>
  useQuery({
    queryKey: ["invoices", endpoint],

    queryFn: async () => {
      const data = await apiGet(`/api${endpoint}`);

      if (!Array.isArray(data)) {
        return [];
      }

      return data
        .map(normalizeInvoiceItem)
        .filter(Boolean)
        .sort((a, b) => a.id - b.id); // ✅ STABILNÍ ŘAZENÍ
    },

    staleTime: 1000 * 60 * 5,   // 5 minut
    cacheTime: 1000 * 60 * 30,  // 30 minut
    refetchOnWindowFocus: false,
    retry: 1,
  });
