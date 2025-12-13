import React, { useEffect, useState } from "react";
import { usePersons } from "../../persons/hooks/usePersons";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { useSaveInvoice } from "../hooks/useSaveInvoice";
import Loader from "../../../components/loading/Loader";

import "./InvoiceForm.css";

/**
 * Výchozí prázdný stav formuláře
 * – používá se pro CREATE i RESET
 */
const EMPTY_INVOICE = {
  invoiceNumber: "",
  seller: { id: "" },
  buyer: { id: "" },
  issued: "",
  dueDate: "",
  product: "",
  price: "",
  vat: "",
  note: "",
};

/**
 * Formulář pro vytvoření / úpravu faktury
 */
export default function InvoiceForm({ id, onClose }) {
  /* ================= DATA ================= */

  const { data: persons = [] } = usePersons();
  const { data: invoiceDetail, isLoading } = useInvoiceDetail(id);
  const saveInvoice = useSaveInvoice(id);

  /* ================= STATE ================= */

  const [invoice, setInvoice] = useState(EMPTY_INVOICE);

  /* ================= EFFECTS ================= */

  /**
   * Při EDITACI:
   * - naplní formulář daty z backendu
   * Při CREATE:
   * - resetuje formulář
   */
  useEffect(() => {
    if (!id || !invoiceDetail) {
      setInvoice(EMPTY_INVOICE);
      return;
    }

    setInvoice({
      ...invoiceDetail,
      seller: invoiceDetail.seller
        ? { id: invoiceDetail.seller.id }
        : { id: "" },
      buyer: invoiceDetail.buyer
        ? { id: invoiceDetail.buyer.id }
        : { id: "" },
    });
  }, [id, invoiceDetail]);

  /* ================= HELPERS ================= */

  /**
   * Zavření formuláře + reset stavu
   */
  const closeWithAnimation = () => {
    const backdrop = document.querySelector(".invoice-form-backdrop");
    const card = document.querySelector(".invoice-form-card");

    backdrop?.classList.add("closing-form-backdrop");
    card?.classList.add("closing-form-card");

    setTimeout(() => {
      setInvoice(EMPTY_INVOICE);
      onClose();
    }, 300);
  };

  /**
   * Odeslání formuláře
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    saveInvoice.mutate(invoice, {
      onSuccess: () => {
        closeWithAnimation();
      },
    });
  };

  /* ================= RENDER ================= */

  if (isLoading) return <Loader />;

  return (
    <div
      className="invoice-form-backdrop"
      onClick={(e) => {
        if (e.target.classList.contains("invoice-form-backdrop")) {
          closeWithAnimation();
        }
      }}
    >
      <div className="invoice-form-card">

        <button className="close-btn" onClick={closeWithAnimation}>
          ×
        </button>

        <h2>{id ? "Upravit fakturu" : "Vytvořit fakturu"}</h2>

        <form onSubmit={handleSubmit} className="invoice-form-grid">

          {/* ČÍSLO */}
          <div>
            <label className="form-label">Číslo faktury</label>
            <input
              className="form-control"
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) =>
                setInvoice({ ...invoice, invoiceNumber: e.target.value })
              }
              required
            />
          </div>

          {/* PRODÁVAJÍCÍ */}
          <div>
            <label className="form-label">Prodávající</label>
            <select
              className="form-select"
              value={invoice.seller.id}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  seller: { id: Number(e.target.value) },
                })
              }
              required
            >
              <option value="">Vyberte osobu</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* NAKUPUJÍCÍ */}
          <div>
            <label className="form-label">Nakupující</label>
            <select
              className="form-select"
              value={invoice.buyer.id}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  buyer: { id: Number(e.target.value) },
                })
              }
              required
            >
              <option value="">Vyberte osobu</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATUMY */}
          <div>
            <label className="form-label">Datum vystavení</label>
            <input
              className="form-control"
              type="date"
              value={invoice.issued}
              onChange={(e) =>
                setInvoice({ ...invoice, issued: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="form-label">Datum splatnosti</label>
            <input
              className="form-control"
              type="date"
              value={invoice.dueDate}
              onChange={(e) =>
                setInvoice({ ...invoice, dueDate: e.target.value })
              }
              required
            />
          </div>

          {/* PRODUKT */}
          <div className="full-row">
            <label className="form-label">Předmět plnění</label>
            <input
              className="form-control"
              type="text"
              value={invoice.product}
              onChange={(e) =>
                setInvoice({ ...invoice, product: e.target.value })
              }
              required
            />
          </div>

          {/* CENA + DPH */}
          <div>
            <label className="form-label">Cena bez DPH (Kč)</label>
            <input
              className="form-control"
              type="number"
              value={invoice.price}
              onChange={(e) =>
                setInvoice({ ...invoice, price: Number(e.target.value) })
              }
              required
            />
          </div>

          <div>
            <label className="form-label">DPH (%)</label>
            <input
              className="form-control"
              type="number"
              value={invoice.vat}
              onChange={(e) =>
                setInvoice({ ...invoice, vat: Number(e.target.value) })
              }
              required
            />
          </div>

          {/* POZNÁMKA */}
          <div className="full-row">
            <label className="form-label">Poznámka</label>
            <textarea
              className="form-control"
              value={invoice.note}
              onChange={(e) =>
                setInvoice({ ...invoice, note: e.target.value })
              }
            />
          </div>

          {/* TLAČÍTKA */}
          <div className="full-row d-flex justify-content-end gap-2 mt-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeWithAnimation}
            >
              Zpět
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saveInvoice.isLoading}
            >
              {saveInvoice.isLoading ? "Ukládám…" : "Uložit fakturu"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
