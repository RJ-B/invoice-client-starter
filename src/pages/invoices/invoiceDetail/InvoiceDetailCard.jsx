import React from "react";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import Loader from "../../../components/loading/Loader";
import "./InvoiceDetail.css";

export default function InvoiceDetailCard({ id, onClose }) {
  const { data: invoice, isLoading } = useInvoiceDetail(id);

  if (isLoading) return <Loader />;

  const closeWithAnimation = () => {
    const backdrop = document.querySelector(".invoice-detail-backdrop");
    const card = document.querySelector(".invoice-detail-card");

    backdrop.classList.add("closing-backdrop");
    card.classList.add("closing-card");

    setTimeout(() => onClose(), 300);
  };

  // Výpočty
  const priceVAT = (invoice.price * (invoice.vat / 100)).toFixed(2);
  const totalPrice = (invoice.price * (1 + invoice.vat / 100)).toFixed(2);

  return (
    <div
      className="invoice-detail-backdrop animate-backdrop"
      onClick={(e) => {
        if (e.target.classList.contains("invoice-detail-backdrop")) {
          closeWithAnimation();
        }
      }}
    >
      <div className="invoice-detail-card animate-card">

        <button className="close-btn" onClick={closeWithAnimation}>×</button>

        <h2>
          Faktura{" "}
          <span className="text-muted fs-5">#{invoice.invoiceNumber}</span>
        </h2>

        {/* ======================= ROWS ======================= */}
        <div className="detail-row">
          <span className="label">Datum vystavení:</span>
          <span className="value">{invoice.issued}</span>
        </div>

        <div className="detail-row">
          <span className="label">Datum splatnosti:</span>
          <span className="value">{invoice.dueDate}</span>
        </div>

        <div className="detail-row">
          <span className="label">Prodávající:</span>
          <span className="value">{invoice.seller?.name}</span>
        </div>

        <div className="detail-row">
          <span className="label">Nakupující:</span>
          <span className="value">{invoice.buyer?.name}</span>
        </div>

        <div className="detail-row">
          <span className="label">Předmět:</span>
          <span className="value">{invoice.product}</span>
        </div>

        <div className="detail-row">
          <span className="label">Cena bez DPH:</span>
          <span className="value">{invoice.price} Kč</span>
        </div>

        <div className="detail-row">
          <span className="label">DPH:</span>
          <span className="value">{invoice.vat}%</span>
        </div>

        <div className="detail-row">
          <span className="label">DPH v Kč:</span>
          <span className="value">{priceVAT} Kč</span>
        </div>

        <div className="detail-row">
          <span className="label">Celkem s DPH:</span>
          <span className="value fw-bold">{totalPrice} Kč</span>
        </div>

        {invoice.note && (
          <div className="detail-row">
            <span className="label">Poznámka:</span>
            <span className="value">{invoice.note}</span>
          </div>
        )}

      </div>
    </div>
  );
}
