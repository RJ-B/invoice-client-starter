import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPost, apiPut } from "../../../utils/api";
import InputField from "@/components/input/InputField";
import InputCheck from "@/components/input/InputCheck";
import FlashMessage from "../../../components/FlashMessage";
import Country from "../Country";
import { useQueryClient } from "@tanstack/react-query";
import "./PersonForm.css";

/**
 * Formulářová karta pro vytvoření nebo úpravu osoby.
 *
 * @param {number|string|null} id - ID osoby (pokud existuje, jedná se o editaci)
 * @param {Function} onClose - Callback pro zavření modalu
 */
export default function PersonFormCard({ id, onClose }) {
  const queryClient = useQueryClient();

  /* ==================== UI STATES ==================== */

  const [closing, setClosing] = useState(false);
  const [sent, setSent] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  /* ==================== FORM DATA ==================== */

  const [person, setPerson] = useState({
    name: "",
    identificationNumber: "",
    taxNumber: "",
    accountNumber: "",
    bankCode: "",
    iban: "",
    telephone: "",
    mail: "",
    street: "",
    zip: "",
    city: "",
    country: Country.CZECHIA,
    note: "",
  });

  /* ==================== LOAD DATA (EDIT MODE) ==================== */

  useEffect(() => {
    if (id) {
      apiGet(`/api/persons/${id}`)
        .then((data) => setPerson(data))
        .catch((err) => setError(err.message));
    }
  }, [id]);

  /* ==================== CLOSE WITH ANIMATION ==================== */

  const startClosing = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300);
  };

  /* ==================== SUBMIT ==================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = id
      ? apiPut(`/api/persons/${id}`, person)
      : apiPost("/api/persons", person);

    request
      .then(() => {
        setSuccess(true);
        queryClient.invalidateQueries(["persons"]);
        startClosing();
      })
      .catch((err) => {
        setError(err.message);
        setSuccess(false);
      })
      .finally(() => setSent(true));
  };

  /* ==================== RENDER ==================== */

  return (
    <div
      className={`person-form-card-wide ${
        closing ? "closing-form-card" : "animate-card"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE BUTTON */}
      <button
        type="button"
        className="close-btn"
        onClick={startClosing}
      >
        ×
      </button>

      {/* TITLE */}
      <h2 className="mb-3">
        {id ? "Upravit osobu" : "Vytvořit osobu"}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {sent && (
        <FlashMessage
          theme={success ? "success" : ""}
          text={success ? "Osoba byla úspěšně uložena." : ""}
        />
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* =================== COLUMN 1 =================== */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-3">
            <InputField
              required
              type="text"
              name="name"
              label="Jméno"
              value={person.name}
              handleChange={(e) =>
                setPerson({ ...person, name: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="identificationNumber"
              label="IČO"
              value={person.identificationNumber}
              handleChange={(e) =>
                setPerson({
                  ...person,
                  identificationNumber: e.target.value,
                })
              }
            />

            <InputField
              required
              type="text"
              name="taxNumber"
              label="DIČ"
              value={person.taxNumber}
              handleChange={(e) =>
                setPerson({ ...person, taxNumber: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="telephone"
              label="Telefon"
              value={person.telephone}
              handleChange={(e) =>
                setPerson({ ...person, telephone: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="mail"
              label="Mail"
              value={person.mail}
              handleChange={(e) =>
                setPerson({ ...person, mail: e.target.value })
              }
            />
          </div>

          {/* =================== COLUMN 2 =================== */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-3">
            <InputField
              required
              type="text"
              name="accountNumber"
              label="Číslo účtu"
              value={person.accountNumber}
              handleChange={(e) =>
                setPerson({ ...person, accountNumber: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="bankCode"
              label="Kód banky"
              value={person.bankCode}
              handleChange={(e) =>
                setPerson({ ...person, bankCode: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="iban"
              label="IBAN"
              value={person.iban}
              handleChange={(e) =>
                setPerson({ ...person, iban: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="street"
              label="Ulice"
              value={person.street}
              handleChange={(e) =>
                setPerson({ ...person, street: e.target.value })
              }
            />
          </div>

          {/* =================== COLUMN 3 =================== */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-3">
            <InputField
              required
              type="text"
              name="zip"
              label="PSČ"
              value={person.zip}
              handleChange={(e) =>
                setPerson({ ...person, zip: e.target.value })
              }
            />

            <InputField
              required
              type="text"
              name="city"
              label="Město"
              value={person.city}
              handleChange={(e) =>
                setPerson({ ...person, city: e.target.value })
              }
            />

            <InputField
              type="text"
              name="note"
              label="Poznámka"
              value={person.note}
              handleChange={(e) =>
                setPerson({ ...person, note: e.target.value })
              }
            />
          </div>
        </div>

        {/* COUNTRY */}
        <div className="mt-4">
          <h5>Země</h5>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <InputCheck
              type="radio"
              name="country"
              label="Česká republika"
              value={Country.CZECHIA}
              checked={person.country === Country.CZECHIA}
              handleChange={(e) =>
                setPerson({ ...person, country: e.target.value })
              }
            />

            <InputCheck
              type="radio"
              name="country"
              label="Slovensko"
              value={Country.SLOVAKIA}
              checked={person.country === Country.SLOVAKIA}
              handleChange={(e) =>
                setPerson({ ...person, country: e.target.value })
              }
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-4">
          <button type="submit" className="btn btn-primary w-100">
            Uložit osobu
          </button>
        </div>
      </form>
    </div>
  );
}

/* ==================== PROP TYPES ==================== */

PersonFormCard.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onClose: PropTypes.func.isRequired,
};

PersonFormCard.defaultProps = {
  id: null,
};
