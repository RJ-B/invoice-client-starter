import React, { useState } from "react";
import { apiDelete } from "../../utils/api";
import PersonTable from "./PersonTable";
import { usePersons } from "./hooks/usePersons";
import { useQueryClient } from "@tanstack/react-query";
import "./Person.css";

import Loader from "../../components/loading/Loader";

// MODAL COMPONENTS
import PersonDetailCard from "./personDetail/PersonDetailCard";
import PersonFormCard from "./personForm/PersonFormCard";

const PersonIndex = () => {
  const queryClient = useQueryClient();
  const { data: persons, isLoading } = usePersons();

  // === MODAL STATES ===
  const [showDetailId, setShowDetailId] = useState(null);
  const [showEditId, setShowEditId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const deletePerson = async (id) => {
    try {
      await apiDelete("/api/persons/" + id);
      queryClient.invalidateQueries(["persons"]);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="person-card">

      {/* HEADER */}
      <div className="person-header">
        <h1>Seznam osob</h1>
        <button className="btn-new-person" onClick={() => setShowCreate(true)}>
          + Nová osoba
        </button>
      </div>

      {/* TABLE */}
      <PersonTable
        deletePerson={deletePerson}
        items={persons}
        label="Počet osob:"
        onShow={(id) => setShowDetailId(id)}
        onEdit={(id) => setShowEditId(id)}
      />

      {/* ===================================================== */}
      {/*                     DETAIL MODAL                      */}
      {/* ===================================================== */}
      {showDetailId && (
        <div className="person-detail-backdrop animate-backdrop">
          <PersonDetailCard
            id={showDetailId}
            onClose={() => setShowDetailId(null)}
          />
        </div>
      )}

      {/* ===================================================== */}
      {/*                     EDIT MODAL                        */}
      {/* ===================================================== */}
      {showEditId && (
        <div className="person-form-backdrop">
          <PersonFormCard
            id={showEditId}
            onClose={() => setShowEditId(null)}
          />
        </div>
      )}

      {/* ===================================================== */}
      {/*                     CREATE MODAL                      */}
      {/* ===================================================== */}
      {showCreate && (
        <div className="person-form-backdrop">
          <PersonFormCard onClose={() => setShowCreate(false)} />
        </div>
      )}

    </div>
  );
};

export default PersonIndex;
