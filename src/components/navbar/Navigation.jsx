import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserEmail } from "../../utils/jwt";
import "./Navbar.css";

const Navigation = () => {
  const location = useLocation();
  const isLogged = !!localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  // není přihlášen nebo dashboard ("/") → navbar se nerenderuje
  if (!isLogged) return null;
  if (location.pathname === "/") return null;

  const getGliderPosition = () => {
    if (location.pathname.startsWith("/persons")) return "translateX(0%)";
    if (
      location.pathname.startsWith("/invoices") &&
      !location.pathname.includes("statistics")
    )
      return "translateX(100%)";
    return "translateX(200%)";
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar glass-nav mb-4 main-navbar">
      <div className="container nav-inner">

        {/* BRAND – jen desktop */}
        <Link className="navbar-brand fw-bold desktop-only" to="/">
          ÚČETNÍ SYSTÉM
        </Link>

        {/* BURGER – jen mobil */}
        <button
          className="navbar-toggler mobile-only"
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV GROUP */}
        <div className="glass-nav-group">
          <div className={`glass-items ${menuOpen ? "open" : ""}`}>

            <Link
              to="/persons"
              onClick={closeMenu}
              className={`glass-item ${
                location.pathname.startsWith("/persons") ? "active" : ""
              }`}
            >
              <span className="nav-icon">
                <i className="bi bi-people" />
              </span>
              <span className="nav-label">Osoby</span>
            </Link>

            <Link
              to="/invoices"
              onClick={closeMenu}
              className={`glass-item ${
                location.pathname.startsWith("/invoices") &&
                !location.pathname.includes("statistics")
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-icon">
                <i className="bi bi-receipt" />
              </span>
              <span className="nav-label">Faktury</span>
            </Link>

            <Link
              to="/invoices/statistics"
              onClick={closeMenu}
              className={`glass-item ${
                location.pathname.includes("statistics") ? "active" : ""
              }`}
            >
              <span className="nav-icon">
                <i className="bi bi-bar-chart" />
              </span>
              <span className="nav-label">Statistiky</span>
            </Link>

            {/* LOGOUT – pouze mobil (na desktopu skryté přes CSS) */}
            <div
              className="glass-item logout-item"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth";
              }}
            >
              <span className="nav-icon">
                <i className="bi bi-box-arrow-right" />
              </span>
              <span className="nav-label">Odhlásit</span>
            </div>

            {/* GLIDER */}
            <div
              className="glass-glider"
              style={{ transform: getGliderPosition() }}
            />
          </div>
        </div>

        {/* USER INFO + DESKTOP LOGOUT */}
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
