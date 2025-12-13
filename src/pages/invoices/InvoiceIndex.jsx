import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { apiDelete } from "../../utils/api";
import InvoiceTable from "./InvoiceTable";
import { useQueryClient } from "@tanstack/react-query";
import { useInvoices } from "./hooks/useInvoices";
import Loader from "../../components/loading/Loader";

import InvoiceDetailCard from "./invoiceDetail/InvoiceDetailCard";
import InvoiceForm from "./invoiceForm/InvoiceForm";

import "./Invoice.css";

/**
 * Stránka se seznamem faktur + filtry + modaly.
 *
 * Poznámka k mazání:
 * - po smazání je potřeba invalidovat queryKey, který používá hook useInvoices(endpoint)
 * - hook má queryKey ["invoices", endpoint], takže invalidujeme prefixem ["invoices"]
 */
const InvoiceIndex = ({ type }) => {
  const { ico } = useParams();
  const queryClient = useQueryClient();

  /* =========================
     MODALS
     ========================= */
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formInvoiceId, setFormInvoiceId] = useState(null);

  /* =========================
     FILTERS
     ========================= */
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [form, setForm] = useState({
    buyerID: "",
    sellerID: "",
    product: "",
    minPrice: "",
    maxPrice: "",
    limit: "",
  });

  const [filters, setFilters] = useState({});

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (!type && val !== "" && val !== null && val !== undefined) {
      params.append(key, val);
    }
  });

  const query = params.toString() ? `?${params.toString()}` : "";

  const endpoint =
    type === "sales"
      ? `/persons/identification/${ico}/sales`
      : type === "purchases"
      ? `/persons/identification/${ico}/purchases`
      : `/invoices${query}`;

  const { data: invoices, isLoading } = useInvoices(endpoint);

  /**
   * Aplikuje filtry:
   * - vyčistí prázdné hodnoty
   * - převede čísla
   * - invaliduje seznam faktur
   */
  const applyFilters = () => {
    const cleaned = {};

    if (form.buyerID.trim()) cleaned.buyerID = form.buyerID.trim();
    if (form.sellerID.trim()) cleaned.sellerID = form.sellerID.trim();
    if (form.product.trim()) cleaned.product = form.product.trim();
    if (form.minPrice && !isNaN(form.minPrice))
      cleaned.minPrice = Number(form.minPrice);
    if (form.maxPrice && !isNaN(form.maxPrice))
      cleaned.maxPrice = Number(form.maxPrice);
    if (form.limit && !isNaN(form.limit)) cleaned.limit = Number(form.limit);

    setFilters(cleaned);

    // Důležité: invalidujeme prefixem, protože queryKey je ["invoices", endpoint]
    queryClient.invalidateQueries({ queryKey: ["invoices"] });

    // zavřít filtry na mobilu
    setFiltersOpen(false);
  };

  /**
   * Smaže fakturu a obnoví seznam.
   *
   * @param {number|string} id - ID faktury z databáze
   */
  const deleteInvoice = async (id) => {
    if (id === null || id === undefined || id === "") {
      alert("Nelze odstranit fakturu – chybí ID.");
      return;
    }

    const ok = window.confirm("Opravdu chcete fakturu odstranit?");
    if (!ok) return;

    try {
      await apiDelete("/api/invoices/" + id);

      // Pokud má uživatel otevřený detail smazané faktury, zavřeme ho
      if (selectedInvoiceId === id) {
        setSelectedInvoiceId(null);
      }

      // Spolehlivá invalidace všech seznamů faktur
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    } catch (error) {
      console.error("Chyba při mazání faktury:", error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Nepodařilo se odstranit fakturu."
      );
    }
  };

  if (isLoading) return <Loader />;

  const title =
    type === "sales"
      ? "Vystavené faktury"
      : type === "purchases"
      ? "Přijaté faktury"
      : "Seznam faktur";

  return (
    <div className="invoice-card">
      {/* HEADER */}
      <div className="invoice-header mb-3">
        <h1>{title}</h1>
        {!type && (
          <button className="btn-new-invoice" onClick={() => setShowForm(true)}>
            + Nová faktura
          </button>
        )}
      </div>

      {/* ================= FILTERS ================= */}
      {!type && (
        <>
          {/* MOBILE TOGGLE */}
          <button
            className="btn btn-outline-primary w-100 mb-3 d-md-none"
            onClick={() => setFiltersOpen((prev) => !prev)}
          >
            🔍 Filtry
          </button>

          {/* FILTER PANEL */}
          <div
            className={`invoice-filter-panel ${filtersOpen ? "open" : ""} d-md-block`}
          >
            <div className="row g-2 mb-4">
              <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                <input
                  className="form-control"
                  placeholder="buyerID"
                  value={form.buyerID}
                  onChange={(e) =>
                    setForm({ ...form, buyerID: e.target.value })
                  }
                />
              </div>

              <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                <input
                  className="form-control"
                  placeholder="sellerID"
                  value={form.sellerID}
                  onChange={(e) =>
                    setForm({ ...form, sellerID: e.target.value })
                  }
                />
              </div>

              <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                <input
                  className="form-control"
                  placeholder="produkt"
                  value={form.product}
                  onChange={(e) =>
                    setForm({ ...form, product: e.target.value })
                  }
                />
              </div>

              <div className="col-6 col-sm-6 col-md-3 col-lg-2">
                <input
                  className="form-control"
                  placeholder="min cena"
                  value={form.minPrice}
                  onChange={(e) =>
                    setForm({ ...form, minPrice: e.target.value })
                  }
                />
              </div>

              <div className="col-6 col-sm-6 col-md-3 col-lg-2">
                <input
                  className="form-control"
                  placeholder="max cena"
                  value={form.maxPrice}
                  onChange={(e) =>
                    setForm({ ...form, maxPrice: e.target.value })
                  }
                />
              </div>

              <div className="col-6 col-sm-4 col-md-2 col-lg-1">
                <input
                  className="form-control"
                  placeholder="limit"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                />
              </div>

              <div className="col-6 col-sm-4 col-md-2 col-lg-1 d-grid">
                <button className="btn btn-primary" onClick={applyFilters}>
                  Filtrovat
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TABLE */}
      <InvoiceTable
        items={invoices || []}
        deleteInvoice={deleteInvoice}
        onShow={setSelectedInvoiceId}
        onEdit={(id) => {
          setFormInvoiceId(id);
          setShowForm(true);
        }}
      />

      {/* DETAIL */}
      {selectedInvoiceId && (
        <div className="invoice-detail-backdrop animate-backdrop">
          <InvoiceDetailCard
            id={selectedInvoiceId}
            onClose={() => setSelectedInvoiceId(null)}
          />
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <InvoiceForm
          id={formInvoiceId}
          onClose={() => {
            setShowForm(false);
            setFormInvoiceId(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoiceIndex;
