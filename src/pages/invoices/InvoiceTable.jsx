import React from "react";
import PropTypes from "prop-types";

/**
 * Tabulka pro zobrazení seznamu faktur.
 * Komponenta předpokládá NORMALIZOVANÁ data z hooku.
 */
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
              <th style={{ width: "160px" }}>Číslo faktury</th>
              <th>Prodávající</th>
              <th>Nakupující</th>
              <th style={{ width: "120px", textAlign: "right" }}>Cena</th>
              <th style={{ width: "200px", textAlign: "center" }}>Akce</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="fw-semibold">
                    {item.invoiceNumber}
                  </td>

                  <td>{item.seller.name}</td>

                  <td>{item.buyer.name}</td>

                  <td className="fw-semibold text-success text-end">
                    {item.price} Kč
                  </td>

                  <td className="text-center">
                    <div className="d-flex flex-column flex-md-row gap-1 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info btn-sm w-100 w-md-auto"
                        onClick={() => onShow(item.id)}
                      >
                        Zobrazit
                      </button>

                      <button
                        type="button"
                        className="btn btn-warning btn-sm w-100 w-md-auto"
                        onClick={() => onEdit(item.id)}
                      >
                        Upravit
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm w-100 w-md-auto"
                        onClick={() => deleteInvoice(item.id)}
                      >
                        Odstranit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
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

/* ==================== PROP TYPES ==================== */

InvoiceTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      invoiceNumber: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      price: PropTypes.number.isRequired,
      seller: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      buyer: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  deleteInvoice: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
