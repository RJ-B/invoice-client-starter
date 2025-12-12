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

// === renderer osy X — popisky vždy otočeny o 90° ===
const renderTick = ({ x, y, payload }) => {
  const textX = x + 3;        // přesná pozice sloupce
  const textY = y + 50;   // posunutí dolů

  return (
    <g transform={`translate(${textX}, ${textY})`}>
      <text
        textAnchor="middle"       // zarovná přesně pod střed sloupce
        fontSize={12}
        transform="rotate(-90)"   // rotace kolem aktuálního bodu
      >
        {payload.value}
      </text>
    </g>
  );
};


const InvoiceStatistics = () => {
  const { data: general, isLoading: isLoadingGeneral } = useInvoiceStatistics();
  const { data: byPersons, isLoading: isLoadingPersons } = usePersonStatistics();

  if (isLoadingGeneral || isLoadingPersons) {
    return <Loader />;
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">

        {/* sjednocená šířka jako zbytek aplikace */}
        <div className="col-12 col-md-11 col-lg-10 col-xl-9 col-xxl-8">

          <h1 className="mb-4">Statistiky faktur</h1>

          {/* ===== KPI boxy ===== */}
          <div className="row g-3 mb-4">

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm p-3 text-center h-100">
                <h5>Obrat tento rok</h5>
                <p className="fs-3 fw-bold text-primary">
                  {general.currentYearSum} Kč
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm p-3 text-center h-100">
                <h5>Obrat celkem</h5>
                <p className="fs-3 fw-bold text-success">
                  {general.allTimeSum} Kč
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm p-3 text-center h-100">
                <h5>Počet faktur</h5>
                <p className="fs-3 fw-bold text-dark">
                  {general.invoicesCount}
                </p>
              </div>
            </div>

          </div>

          {/* ===== Graf ===== */}
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Příjmy společností (tržby)</h4>

            {byPersons.length === 0 ? (
              <p className="text-center mt-3 text-muted">
                Žádné statistiky společností nejsou k dispozici.
              </p>
            ) : (
              <div className="invoice-chart-container" style={{ width: "100%", height: 420 }}>
                
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={byPersons.map((p) => ({
                      ...p,
                      key: p.personId,
                      revenue: Number(p.revenue ?? 0),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* osy X – rotované popisky */}
                    <XAxis
                      dataKey="personName"
                      interval={0}
                      tick={renderTick}
                      height={140} // více místa pro rotaci
                    />

                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="revenue" fill="#0d6efd" name="Příjmy (Kč)" />
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
