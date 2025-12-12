import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiDelete } from "../../utils/api";
import InvoiceTable from "./InvoiceTable";
import { useQueryClient } from "@tanstack/react-query";
import { useInvoices } from "./hooks/useInvoices";
import Loader from "../../components/loading/Loader";

import InvoiceDetailCard from "./invoiceDetail/InvoiceDetailCard";
import InvoiceForm from "./invoiceForm/InvoiceForm";

import "./Invoice.css";

const InvoiceIndex = ({ type }) => {
  const { ico } = useParams();
  const queryClient = useQueryClient();

  // ------------------------------------------------------
  //   MODAL STATE — DETAIL
  // ------------------------------------------------------
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const openDetail = (id) => {
    setSelectedInvoiceId(id);
  };

  const closeDetail = () => {
    setSelectedInvoiceId(null);
  };

  // ------------------------------------------------------
  //   MODAL STATE — FORM (edit / create)
  // ------------------------------------------------------
  const [showForm, setShowForm] = useState(false);
  const [formInvoiceId, setFormInvoiceId] = useState(null);

  const openCreate = () => {
    setFormInvoiceId(null);
    setShowForm(true);
  };

  const openEdit = (id) => {
    setFormInvoiceId(id);
    setShowForm(true);
  };

  const closeForm = () => {
    setFormInvoiceId(null);
    setShowForm(false);
  };

  // ------------------------------------------------------
  //   FILTERS + API
  // ------------------------------------------------------
  const [form, setForm] = useState({
    buyerID: "",
    sellerID: "",
    product: "",
    minPrice: "",
    maxPrice: "",
    limit: ""
  });

  const [filters, setFilters] = useState({});

  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, val]) => {
    if (!type && val !== null && val !== "" && val !== undefined) {
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

  const deleteInvoice = async (id) => {
    await apiDelete("/api/invoices/" + id);
    queryClient.invalidateQueries(["invoices"]);
  };

  const title =
    type === "sales"
      ? "Vystavené faktury"
      : type === "purchases"
      ? "Přijaté faktury"
      : "Seznam faktur";

  const applyFilters = () => {
    const cleaned = {};

    if (form.buyerID.trim() !== "") cleaned.buyerID = form.buyerID.trim();
    if (form.sellerID.trim() !== "") cleaned.sellerID = form.sellerID.trim();
    if (form.product.trim() !== "") cleaned.product = form.product.trim();

    if (form.minPrice.trim() !== "" && !isNaN(form.minPrice)) {
      cleaned.minPrice = Number(form.minPrice);
    }
    if (form.maxPrice.trim() !== "" && !isNaN(form.maxPrice)) {
      cleaned.maxPrice = Number(form.maxPrice);
    }
    if (form.limit.trim() !== "" && !isNaN(form.limit)) {
      cleaned.limit = Number(form.limit);
    }

    setFilters(cleaned);
    queryClient.invalidateQueries(["invoices"]);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="invoice-card">

      {/* HEADER */}
      <div className="invoice-header mb-3">
        <h1>{title}</h1>

        {!type && (
          <button className="btn-new-invoice" onClick={openCreate}>
            + Nová faktura
          </button>
        )}
      </div>

      {/* FILTER FORM */}
      {!type && (
        <div className="row g-2 mb-4">

          <div className="col-12 col-sm-6 col-md-3 col-lg-2">
            <input
              className="form-control"
              placeholder="buyerID"
              value={form.buyerID}
              onChange={(e) => setForm({ ...form, buyerID: e.target.value })}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3 col-lg-2">
            <input
              className="form-control"
              placeholder="sellerID"
              value={form.sellerID}
              onChange={(e) => setForm({ ...form, sellerID: e.target.value })}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3 col-lg-2">
            <input
              className="form-control"
              placeholder="produkt"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
            />
          </div>

          <div className="col-6 col-sm-6 col-md-3 col-lg-2">
            <input
              className="form-control"
              placeholder="min cena"
              value={form.minPrice}
              onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
            />
          </div>

          <div className="col-6 col-sm-6 col-md-3 col-lg-2">
            <input
              className="form-control"
              placeholder="max cena"
              value={form.maxPrice}
              onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
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
      )}

      {/* TABLE WITH ACTIONS */}
      <InvoiceTable
        items={invoices || []}
        deleteInvoice={deleteInvoice}
        onShow={openDetail}
        onEdit={openEdit}
      />

      {/* =============================== */}
      {/* MODAL — DETAIL FAKTURY */}
      {/* =============================== */}
      {selectedInvoiceId && (
        <div className="invoice-detail-backdrop animate-backdrop">
          <InvoiceDetailCard id={selectedInvoiceId} onClose={closeDetail} />
          </div>
        
      )}

      {/* =============================== */}
      {/* MODAL — FORM (EDIT / CREATE) */}
      {/* =============================== */}
      {showForm && (
        <InvoiceForm id={formInvoiceId} onClose={closeForm} />
      )}

    </div>
  );
};

export default InvoiceIndex;
