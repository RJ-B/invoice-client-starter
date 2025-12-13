import React from "react";
import PropTypes from "prop-types";
import "./Person.css";

/**
 * Tabulková komponenta pro zobrazení seznamu osob.
 *
 * Zobrazuje:
 * - skutečné ID osoby z databáze
 * - jméno osoby
 * - akční tlačítka
 */
const PersonTable = ({ label, items, deletePerson, onShow, onEdit }) => {
  /**
   * Ošetření vstupních dat – komponenta nikdy nepracuje s undefined.
   */
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <p className="m-0 fw-semibold">
          {label} {safeItems.length}
        </p>
      </div>

      <div className="table-responsive">
        <div className="table-scroll-area">
          <table className="table table-hover table-striped table-bordered align-middle">
            <thead className="table-primary">
              <tr>
                <th style={{ width: "10%" }} className="text-center">
                  ID
                </th>
                <th>Jméno</th>
                <th
                  className="text-center"
                  style={{ width: "25%" }}
                >
                  Akce
                </th>
              </tr>
            </thead>

            <tbody>
              {safeItems.map((item) => (
                <tr key={item.id}>
                  {/* SKUTEČNÉ ID Z DATABÁZE */}
                  <td className="text-center">{item.id}</td>

                  <td>{item.name}</td>

                  <td className="text-center">
                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-1">

                      <button
                        type="button"
                        onClick={() => onShow(item.id)}
                        className="btn btn-info btn-sm w-100 w-md-auto"
                      >
                        Zobrazit
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(item.id)}
                        className="btn btn-warning btn-sm w-100 w-md-auto"
                      >
                        Upravit
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePerson(item.id)}
                        className="btn btn-danger btn-sm w-100 w-md-auto"
                      >
                        Odstranit
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {safeItems.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    Žádné osoby k zobrazení
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonTable;

/* ==================== PROP TYPES ==================== */

PersonTable.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  deletePerson: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
