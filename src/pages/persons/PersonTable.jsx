import React from "react";
import "./Person.css";

const PersonTable = ({ label, items, deletePerson, onShow, onEdit }) => {
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <p className="m-0 fw-semibold">
          {label} {items.length}
        </p>
      </div>

      <div className="table-responsive">
        <div className="table-scroll-area">
        <table className="table table-hover table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th style={{ width: "5%" }} className="text-center">#</th>
              <th>Jméno</th>
              <th className="text-center" style={{ width: "25%" }}>Akce</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="text-center">{index + 1}</td>
                <td>{item.name}</td>

                <td className="text-center">
                  <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-1">

                    {/* ZOBRAZIT – otevře DETAIL modal */}
                    <button
                      onClick={() => onShow(item.id)}
                      className="btn btn-info btn-sm w-100 w-md-auto"
                    >
                      Zobrazit
                    </button>

                    {/* UPRAVIT – otevře FORM modal */}
                    <button
                      onClick={() => onEdit(item.id)}
                      className="btn btn-warning btn-sm w-100 w-md-auto"
                    >
                      Upravit
                    </button>

                    {/* ODSTRANIT */}
                    <button
                      onClick={() => deletePerson(item.id)}
                      className="btn btn-danger btn-sm w-100 w-md-auto"
                    >
                      Odstranit
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

    </div>
  );
};

export default PersonTable;
