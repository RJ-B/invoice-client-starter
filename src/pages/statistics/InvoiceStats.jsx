import { useState } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useInvoiceStatistics } from "./hooks/useInvoiceStatistics";
import { usePersonStatistics } from "./hooks/usePersonStatistics";

import "./invoiceStats.css";
import Loader from "../../components/loading/Loader";

/* ===== Renderer osy X (otočené popisky) ===== */
const renderTick = ({ x, y, payload }) => {
  if (!payload?.value) return null;

  return (
    <g transform={`translate(${x + 3}, ${y + 50})`}>
      <text
        textAnchor="middle"
        fontSize={12}
        transform="rotate(-90)"
      >
        {payload.value}
      </text>
    </g>
  );
};

renderTick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.shape({
    value: PropTypes.string,
  }),
};

/* ===== Hlavní komponenta ===== */
const InvoiceStatistics = () => {
  const {
    data: general,
    isLoading: isLoadingGeneral,
    error: generalError,
  } = useInvoiceStatistics();

  const {
    data: byPersons,
    isLoading: isLoadingPersons,
    error: personsError,
  } = usePersonStatistics();

  const [showStats, setShowStats] = useState(false);

  /* ===== Loading ===== */
  if (isLoadingGeneral || isLoadingPersons) {
    return <Loader />;
  }

  /* ===== Error state ===== */
  if (generalError || personsError) {
    return (
      <div className="container py-4 text-center text-danger">
        Nepodařilo se načíst statistiky.
      </div>
    );
  }

  /* ===== Bezpečné hodnoty ===== */
  const safeGeneral = {
    currentYearSum: general?.currentYearSum ?? 0,
    allTimeSum: general?.allTimeSum ?? 0,
    invoicesCount: general?.invoicesCount ?? 0,
  };

  const safePersons = Array.isArray(byPersons)
    ? byPersons.map((p) => ({
        ...p,
        revenue: Number(p?.revenue ?? 0),
        personName: p?.personName ?? "Neznámý subjekt",
      }))
    : [];

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-11 col-lg-10 col-xl-9 col-xxl-8">

          <h1 className="mb-4">Statistiky faktur</h1>

          {/* ===== Mobilní tlačítko ===== */}
          <button
            className="btn btn-outline-primary w-100 mb-3 d-md-none"
            onClick={() => setShowStats((prev) => !prev)}
            type="button"
          >
            Přehled statistik
          </button>

          {/* ===== KPI panel ===== */}
          <div className={`invoice-stats-panel ${showStats ? "open" : ""}`}>
            <div className="row g-3 mb-4">

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm p-3 text-center h-100">
                  <h5>Obrat tento rok</h5>
                  <p className="fs-3 fw-bold text-primary">
                    {safeGeneral.currentYearSum} Kč
                  </p>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm p-3 text-center h-100">
                  <h5>Obrat celkem</h5>
                  <p className="fs-3 fw-bold text-success">
                    {safeGeneral.allTimeSum} Kč
                  </p>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card shadow-sm p-3 text-center h-100">
                  <h5>Počet faktur</h5>
                  <p className="fs-3 fw-bold text-dark">
                    {safeGeneral.invoicesCount}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ===== Graf ===== */}
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Příjmy společností (tržby)</h4>

            {safePersons.length === 0 ? (
              <p className="text-center mt-3 text-muted">
                Žádné statistiky společností nejsou k dispozici.
              </p>
            ) : (
              <div className="invoice-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safePersons}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="personName"
                      interval={0}
                      tick={renderTick}
                      height={140}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="revenue"
                      fill="#0d6efd"
                      name="Příjmy (Kč)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceStatistics;
