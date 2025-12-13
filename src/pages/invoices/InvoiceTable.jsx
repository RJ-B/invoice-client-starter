import React from "react";
import PropTypes from "prop-types";

/**
 * Tabulka pro zobrazení seznamu faktur.
 * Komponenta předpokládá NORMALIZOVANÁ data z hooku.
 *
 * POZNÁMKA:
 * - Sloupec # zobrazuje skutečné ID z databáze
 * - Pořadí řádků určuje backend / hook (ne index)
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
              <th style={{ width: "80px" }}>ID</th>
              <th>Číslo faktury</th>
              <th>Prodávající</th>
              <th>Nakupující</th>
              <th style={{ width: "120px" }}>Cena</th>
              <th style={{ width: "200px" }}>Akce</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  {/* === SKUTEČNÉ ID Z DB === */}
                  <td className="text-center fw-semibold">
                    {item.id}
                  </td>

                  <td className="fw-semibold">
                    {item.invoiceNumber}
                  </td>

                  <td>{item.seller.name}</td>
                  <td>{item.buyer.name}</td>

                  <td className="fw-semibold text-success">
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
                <td colSpan={6} className="text-center py-4 text-muted">
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
      invoiceNumber: PropTypes.string.isRequired,
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
