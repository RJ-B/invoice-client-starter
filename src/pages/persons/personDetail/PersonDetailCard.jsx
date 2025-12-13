import React from "react";
import PropTypes from "prop-types";
import { usePersonDetail } from "../hooks/usePersonDetail";
import Loader from "../../../components/loading/Loader";
import "./PersonDetail.css";
import Country from "../Country";

/**
 * Detailní karta osoby zobrazená v modálním okně.
 *
 * @param {number|string} id - ID osoby
 * @param {Function} onClose - Callback pro zavření modalu
 */
export default function PersonDetailCard({ id, onClose }) {
  /**
   * Načtení detailu osoby pomocí React Query hooku.
   */
  const { data: person, isLoading } = usePersonDetail(id);

  if (isLoading) return <Loader />;

  /**
   * Pokud osoba nebyla nalezena, komponenta se nevykreslí.
   * Logika zůstává beze změny.
   */
  if (!person) {
    console.error("❌ Person nenalezen:", id);
    return null;
  }

  /**
   * Zavření modalu s animační třídou.
   * Používá přímou práci s DOM (záměrně zachováno).
   */
  const closeWithAnimation = () => {
    const backdrop = document.querySelector(".person-detail-backdrop");
    const card = document.querySelector(".person-detail-card");

    backdrop.classList.add("closing-backdrop");
    card.classList.add("closing-card");

    setTimeout(() => onClose(), 300);
  };

  /**
   * Textová reprezentace země.
   */
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
      <div
        className="person-detail-card"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          type="button"
          className="close-btn"
          onClick={closeWithAnimation}
        >
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

/* ==================== PROP TYPES ==================== */

PersonDetailCard.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
};
