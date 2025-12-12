import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiPut } from "../../../utils/api";

export const useSaveInvoice = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice) => {
      if (id) {
        return await apiPut("/api/invoices/" + id, invoice);
      }
      return await apiPost("/api/invoices", invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
    }
  });
};
