import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiPut } from "../../../utils/api";

/**
 * Normalizuje data faktury před odesláním na backend.
 *
 * @param {any} data - Data z formuláře
 * @returns {Object} Payload připravený pro API
 */
const normalizeInvoicePayload = (data) => {
  if (!data || typeof data !== "object") {
    return {};
  }

  return {
    invoiceNumber: data.invoiceNumber ?? "",
    issued: data.issued ?? null,
    dueDate: data.dueDate ?? null,
    product: data.product ?? "",
    price: Number(data.price ?? 0),
    vat: Number(data.vat ?? 0),
    note: data.note ?? "",

    seller: data.seller?.id
      ? { id: data.seller.id }
      : null,

    buyer: data.buyer?.id
      ? { id: data.buyer.id }
      : null,
  };
};

/**
 * Hook pro vytvoření nebo aktualizaci faktury.
 *
 * @param {number|string|null} id - ID faktury (pokud existuje, provede se update)
 */
export const useSaveInvoice = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Uloží fakturu na backend (POST / PUT).
     */
    mutationFn: async (invoice) => {
      const payload = normalizeInvoicePayload(invoice);

      if (id) {
        return apiPut(`/api/invoices/${id}`, payload);
      }

      return apiPost("/api/invoices", payload);
    },

    /**
     * Po úspěšném uložení zneplatní cache seznamu faktur.
     */
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
    },
  });
};
