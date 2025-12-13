import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { apiDelete } from "../../utils/api";
import { usePersons } from "./hooks/usePersons";

import PersonTable from "./PersonTable";
import Loader from "../../components/loading/Loader";

// MODAL COMPONENTS
import PersonDetailCard from "./personDetail/PersonDetailCard";
import PersonFormCard from "./personForm/PersonFormCard";

import "./Person.css";

/**
 * Hlavní komponenta pro správu osob.
 *
 * Zajišťuje:
 * - načtení seznamu osob
 * - mazání osob
 * - otevření modálních oken (detail, editace, vytvoření)
 */
const PersonIndex = () => {
  const queryClient = useQueryClient();

  /**
   * Načtení seznamu osob pomocí custom hooku.
   * @property {Array<Object>} data - seznam osob
   * @property {boolean} isLoading - stav načítání
   */
  const { data: persons, isLoading } = usePersons();

  /* ==================== MODAL STATES ==================== */

  /** ID osoby zobrazené v detailním modalu */
  const [showDetailId, setShowDetailId] = useState(null);

  /** ID osoby upravované ve formuláři */
  const [showEditId, setShowEditId] = useState(null);

  /** Stav otevření formuláře pro vytvoření nové osoby */
  const [showCreate, setShowCreate] = useState(false);

  /* ==================== METODY ==================== */

  /**
   * Odstraní osobu podle ID a znovu načte seznam osob.
   *
   * @param {number|string} id - Identifikátor osoby
   */
  const deletePerson = async (id) => {
    try {
      await apiDelete("/api/persons/" + id);

      // znovunačtení seznamu osob
      queryClient.invalidateQueries(["persons"]);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  /* ==================== STAVY ==================== */

  if (isLoading) {
    return <Loader />;
  }

  /* ==================== RENDER ==================== */

  return (
    <div className="person-card">

      {/* ===== HEADER ===== */}
      <div className="person-header">
        <h1>Seznam osob</h1>

        <button
          type="button"
          className="btn-new-person"
          onClick={() => setShowCreate(true)}
        >
          + Nová osoba
        </button>
      </div>

      {/* ===== TABULKA OSOB ===== */}
      <PersonTable
        label="Počet osob:"
        items={persons}
        deletePerson={deletePerson}
        onShow={(id) => setShowDetailId(id)}
        onEdit={(id) => setShowEditId(id)}
      />

      {/* ================= DETAIL MODAL ================= */}
      {showDetailId && (
        <div className="person-detail-backdrop animate-backdrop">
          <PersonDetailCard
            id={showDetailId}
            onClose={() => setShowDetailId(null)}
          />
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditId && (
        <div className="person-form-backdrop">
          <PersonFormCard
            id={showEditId}
            onClose={() => setShowEditId(null)}
          />
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
      {showCreate && (
        <div className="person-form-backdrop">
          <PersonFormCard
            onClose={() => setShowCreate(false)}
          />
        </div>
      )}

    </div>
  );
};

export default PersonIndex;
