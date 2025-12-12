import React from "react";
import { Link } from "react-router-dom";
import FloatingLines from "../../components/background/FloatingLines.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <>
      {/* animované pozadí */}
      <div className="dashboard-bg">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      <div className="dashboard-container">
        <div className="dashboard-grid">

          <Link to="/persons" className="dash-box electric-border">
            <div className="eb-content">
              <i className="bi bi-people-fill dash-icon"></i>
              <span className="dash-label">Osoby</span>
            </div>
            <div className="eb-layers">
              <div className="eb-stroke"></div>
              <div className="eb-glow-1"></div>
              <div className="eb-glow-2"></div>
              <div className="eb-background"></div>
            </div>
          </Link>

          <Link to="/invoices" className="dash-box electric-border">
            <div className="eb-content">
              <i className="bi bi-receipt-cutoff dash-icon"></i>
              <span className="dash-label">Faktury</span>
            </div>
            <div className="eb-layers">
              <div className="eb-stroke"></div>
              <div className="eb-glow-1"></div>
              <div className="eb-glow-2"></div>
              <div className="eb-background-glow"></div>
            </div>
          </Link>

          <Link to="/invoices/statistics" className="dash-box electric-border">
            <div className="eb-content">
              <i className="bi bi-bar-chart-fill dash-icon"></i>
              <span className="dash-label">Statistiky</span>
            </div>
            <div className="eb-layers">
              <div className="eb-stroke"></div>
              <div className="eb-glow-1"></div>
              <div className="eb-glow-2"></div>
              <div className="eb-background-glow"></div>
            </div>
          </Link>

        </div>
      </div>
    </>
  );
}
