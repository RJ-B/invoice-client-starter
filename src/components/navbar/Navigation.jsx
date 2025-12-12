import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserEmail } from "../../utils/jwt";
import "./Navbar.css";

const Navigation = () => {
  const location = useLocation();
  const isLogged = !!localStorage.getItem("token");

  if (!isLogged) return null;

  const getGliderPosition = () => {
    if (location.pathname.startsWith("/persons")) return "translateX(0%)";
    if (location.pathname.startsWith("/invoices") && !location.pathname.includes("statistics"))
      return "translateX(100%)";
    return "translateX(200%)";
  };

  return (
    <nav className="navbar glass-nav mb-4 main-navbar">
      <div className="container nav-inner">

<Link className="navbar-brand fw-bold desktop-only" to="/">
  ÚČETNÍ SYSTÉM
</Link>


        <div className="glass-nav-group">
<div className="glass-items">

  <Link
    to="/persons"
    className={`glass-item ${location.pathname.startsWith("/persons") ? "active" : ""}`}
  >
    <span className="nav-icon"><i className="bi bi-people" /></span>
    <span className="nav-label">Osoby</span>
  </Link>

  <Link
    to="/invoices"
    className={`glass-item ${
      location.pathname.startsWith("/invoices") &&
      !location.pathname.includes("statistics")
        ? "active"
        : ""
    }`}
  >
    <span className="nav-icon"><i className="bi bi-receipt" /></span>
    <span className="nav-label">Faktury</span>
  </Link>

  <Link
    to="/invoices/statistics"
    className={`glass-item ${location.pathname.includes("statistics") ? "active" : ""}`}
  >
    <span className="nav-icon"><i className="bi bi-bar-chart" /></span>
    <span className="nav-label">Statistiky</span>
  </Link>

  {/* LOGOUT – ikona jako ostatní */}
  <div
    className="glass-item logout-item"
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }}
  >
    <span className="nav-icon"><i className="bi bi-box-arrow-right" /></span>
    <span className="nav-label">Odhlásit</span>
  </div>

  <div className="glass-glider" style={{ transform: getGliderPosition() }} />
</div>


        </div>

        <ul className="navbar-nav ms-auto align-items-center desktop-only">
          <li className="nav-item d-flex align-items-center me-3 text-white">
            <i className="bi bi-person-circle fs-5 me-2"></i>
            <span>{getUserEmail()}</span>
          </li>

          <li className="nav-item">
            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth";
              }}
            >
              Odhlásit
            </button>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navigation;
