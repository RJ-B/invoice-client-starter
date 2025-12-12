import React from "react";

export default function InvoiceTable({ items, deleteInvoice, onShow, onEdit }) {
  return (
    <div className="invoice-table-wrapper">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="m-0 fw-semibold">
          Počet faktur: {items.length}
        </p>
      </div>

      <div className="glass-table-scroll">

        <table className="table glass-table table-hover table-bordered align-middle">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Číslo faktury</th>
              <th>Prodávající</th>
              <th>Nakupující</th>
              <th style={{ width: "120px" }}>Cena</th>
              <th style={{ width: "200px" }}>Akce</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id || item._id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="fw-semibold">{item.invoiceNumber}</td>
                  <td>{item.seller?.name}</td>
                  <td>{item.buyer?.name}</td>
                  <td className="fw-semibold text-success">{item.price} Kč</td>

                  <td className="text-center">
                    <div className="d-flex flex-column flex-md-row gap-1 justify-content-center">

                      {/* Zobrazit = otevře modal s detailem */}
                      <button
                        className="btn btn-info btn-sm w-100 w-md-auto"
                        onClick={() => onShow(item.id || item._id)}
                      >
                        Zobrazit
                      </button>

                      {/* Upravit = otevře modal formulář */}
                      <button
                        className="btn btn-warning btn-sm w-100 w-md-auto"
                        onClick={() => onEdit(item.id || item._id)}
                      >
                        Upravit
                      </button>

                      {/* Smazat */}
                      <button
                        className="btn btn-danger btn-sm w-100 w-md-auto"
                        onClick={() => deleteInvoice(item.id || item._id)}
                      >
                        Odstranit
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Žádné faktury k zobrazení
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}
