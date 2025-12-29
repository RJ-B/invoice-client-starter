import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiDelete, apiGet } from "../../utils/api";
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

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formInvoiceId, setFormInvoiceId] = useState(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [form, setForm] = useState({
    buyerName: "",
    sellerName: "",
    minPrice: "",
    maxPrice: "",
    limit: "",
  });

  const [filters, setFilters] = useState({});

  const [buyerSuggestions, setBuyerSuggestions] = useState([]);
  const [sellerSuggestions, setSellerSuggestions] = useState([]);

  const timeoutRef = useRef(null);

const fetchSuggestions = async (value, type) => {
  console.log("INPUT:", value, type);

  if (value.length < 2) {
    console.log("Too short, clearing");
    if (type === "buyer") setBuyerSuggestions([]);
    if (type === "seller") setSellerSuggestions([]);
    return;
  }

  try {
    const res = await apiGet(`/api/persons/search?query=${encodeURIComponent(value)}`);
    console.log("RAW RESPONSE:", res);

    const data = Array.isArray(res) ? res : res?.data;
    console.log("PARSED DATA:", data);

    if (!Array.isArray(data)) {
      console.error("NOT ARRAY:", data);
      return;
    }

    if (type === "buyer") setBuyerSuggestions(data);
    if (type === "seller") setSellerSuggestions(data);
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
};


  const applyFilters = () => {
    const cleaned = {};

    if (form.buyerName.trim()) cleaned.buyerName = form.buyerName.trim();
    if (form.sellerName.trim()) cleaned.sellerName = form.sellerName.trim();
    if (form.minPrice) cleaned.minPrice = Number(form.minPrice);
    if (form.maxPrice) cleaned.maxPrice = Number(form.maxPrice);
    if (form.limit) cleaned.limit = Number(form.limit);

    setFilters(cleaned);
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
    setFiltersOpen(false);
  };

  const params = new URLSearchParams(filters);
  const query = params.toString() ? `?${params}` : "";

  const endpoint =
    type === "sales"
      ? `/persons/identification/${ico}/sales`
      : type === "purchases"
      ? `/persons/identification/${ico}/purchases`
      : `/invoices${query}`;

  const { data: invoices, isLoading } = useInvoices(endpoint);

  if (isLoading) return <Loader />;

  return (
    <div className="invoice-card">
      <div className="invoice-header mb-3">
        <h1>Seznam faktur</h1>
        {!type && (
          <button className="btn-new-invoice" onClick={() => setShowForm(true)}>
            + Nová faktura
          </button>
        )}
      </div>

      {!type && (
        <div className="invoice-filter-panel">
          <div className="row g-2 mb-4">

            {/* SELLER */}
            <div className="col-md-3 position-relative">
              <div className="float-input">
                <input
                  className="form-control float-input__control"
                  placeholder=" "
                  value={form.sellerName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, sellerName: value });
                    fetchSuggestions(value, "seller");
                  }}
                  autoComplete="off"
                />
                <label className="float-input__label">Název prodávajícího</label>
              </div>

              {sellerSuggestions.length > 0 && (
                <ul className="suggestions">
                  {sellerSuggestions.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setForm({ ...form, sellerName: p.name });
                        setSellerSuggestions([]);
                      }}
                    >
                      {p.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* BUYER */}
            <div className="col-md-3 position-relative">
              <div className="float-input">
                <input
                  className="form-control float-input__control"
                  placeholder=" "
                  value={form.buyerName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, buyerName: value });
                    fetchSuggestions(value, "buyer");
                  }}
                  autoComplete="off"
                />
                <label className="float-input__label">Název kupujícího</label>
              </div>

              {buyerSuggestions.length > 0 && (
                <ul className="suggestions">
                  {buyerSuggestions.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setForm({ ...form, buyerName: p.name });
                        setBuyerSuggestions([]);
                      }}
                    >
                      {p.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* MIN PRICE */}
            <div className="col-md-2">
              <div className="float-input">
                <input
                  className="form-control float-input__control"
                  placeholder=" "
                  value={form.minPrice}
                  onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
                />
                <label className="float-input__label">Min cena</label>
              </div>
            </div>

            {/* MAX PRICE */}
            <div className="col-md-2">
              <div className="float-input">
                <input
                  className="form-control float-input__control"
                  placeholder=" "
                  value={form.maxPrice}
                  onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
                />
                <label className="float-input__label">Max cena</label>
              </div>
            </div>

            {/* LIMIT */}
            <div className="col-md-1">
              <div className="float-input">
                <input
                  className="form-control float-input__control"
                  placeholder=" "
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                />
                <label className="float-input__label">Limit</label>
              </div>
            </div>

            {/* BUTTON */}
            <div className="col-md-1 d-grid">
              <button className="btn-new-invoice" onClick={applyFilters}>
                Filtrovat
              </button>
            </div>

          </div>
        </div>

      )}

      <InvoiceTable
        items={invoices || []}
        deleteInvoice={() => {}}
        onShow={setSelectedInvoiceId}
        onEdit={(id) => {
          setFormInvoiceId(id);
          setShowForm(true);
        }}
      />

      {selectedInvoiceId && (
        <InvoiceDetailCard
          id={selectedInvoiceId}
          onClose={() => setSelectedInvoiceId(null)}
        />
      )}

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
