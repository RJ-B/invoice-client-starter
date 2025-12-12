import React from "react";
import { usePersonDetail } from "../hooks/usePersonDetail";
import Loader from "../../../components/loading/Loader";
import "./PersonDetail.css";
import Country from "../Country";

export default function PersonDetailCard({ id, onClose }) {
  const { data: person, isLoading } = usePersonDetail(id);

  if (isLoading) return <Loader />;

  if (!person) {
    console.error("❌ Person nenalezen:", id);
    return null;
  }

  const closeWithAnimation = () => {
    const backdrop = document.querySelector(".person-detail-backdrop");
    const card = document.querySelector(".person-detail-card");

    backdrop.classList.add("closing-backdrop");
    card.classList.add("closing-card");

    setTimeout(() => onClose(), 300);
  };

  const countryLabel =
    person.country === Country.CZECHIA
      ? "Česká republika"
      : "Slovensko";

  return (
    <div
      className="person-detail-backdrop"
      onClick={(e) => {
        if (e.target.classList.contains("person-detail-backdrop")) {
          closeWithAnimation();
        }
      }}
    >
      <div className="person-detail-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-btn" onClick={closeWithAnimation}>
          ×
        </button>

        {/* TITLE */}
        <h2>
          {person.name}
          <span className="text-muted fs-5">
            {" "}({person.identificationNumber})
          </span>
        </h2>

        {/* ======================== IDENTIFIKACE ======================== */}
        <div className="detail-row">
          <span className="label">IČO:</span>
          <span className="value">{person.identificationNumber}</span>
        </div>

        <div className="detail-row">
          <span className="label">DIČ:</span>
          <span className="value">{person.taxNumber || "—"}</span>
        </div>

        {/* ======================== KONTAKT ======================== */}
        <div className="detail-row">
          <span className="label">Telefon:</span>
          <span className="value">{person.telephone || "—"}</span>
        </div>

        <div className="detail-row">
          <span className="label">Mail:</span>
          <span className="value">{person.mail || "—"}</span>
        </div>

        {/* ======================== BANKOVNÍ ÚDAJE ======================== */}
        <div className="detail-row">
          <span className="label">Číslo účtu:</span>
          <span className="value">
            {person.accountNumber}/{person.bankCode}
          </span>
        </div>

        <div className="detail-row">
          <span className="label">IBAN:</span>
          <span className="value">{person.iban || "—"}</span>
        </div>

        {/* ======================== ADRESA ======================== */}
        <div className="detail-row">
          <span className="label">Adresa:</span>
          <span className="value">
            {person.street || "—"}
            <br />
            {person.zip} {person.city}
            <br />
            {countryLabel}
          </span>
        </div>

        {/* ======================== POZNÁMKA ======================== */}
        {person.note && (
          <div className="detail-row">
            <span className="label">Poznámka:</span>
            <span className="value">{person.note}</span>
          </div>
        )}

      </div>
    </div>
  );
}
