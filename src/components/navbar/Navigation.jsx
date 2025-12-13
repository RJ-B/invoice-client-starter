import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserEmail } from "../../utils/jwt";
import "./Navbar.css";

/**
 * Hlavní navigační lišta aplikace.
 *
 * Zobrazuje se pouze:
 * - pokud je uživatel přihlášen
 * - pokud se nenachází na dashboardu ("/")
 *
 * Obsahuje:
 * - navigaci mezi Osoby / Faktury / Statistiky
 * - animovaný "glider" indikátor aktivní sekce
 * - logout akce (mobil + desktop)
 */
const Navigation = () => {
  const location = useLocation();

  /**
   * Stav přihlášení – kontrola přítomnosti JWT tokenu.
   * Používá se pouze pro rozhodnutí o renderu navigace.
   */
  const isLogged = Boolean(localStorage.getItem("token"));

  /**
   * Stav otevření mobilního menu (burger).
   */
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Navigace se nerenderuje:
   * - pokud uživatel není přihlášen
   * - pokud je na hlavní stránce (dashboard)
   */
  if (!isLogged) return null;
  if (location.pathname === "/") return null;

  /**
   * Určuje pozici "glideru" podle aktuální URL.
   * Používá se pouze pro vizuální indikaci aktivní položky.
   *
   * @returns {string} CSS transform hodnota
   */
  const getGliderPosition = () => {
    if (location.pathname.startsWith("/persons")) {
      return "translateX(0%)";
    }

    if (
      location.pathname.startsWith("/invoices") &&
      !location.pathname.includes("statistics")
    ) {
      return "translateX(100%)";
    }

    // statistiky
    return "translateX(200%)";
  };

  /**
   * Zavře mobilní menu po kliknutí na položku.
   */
  const closeMenu = () => setMenuOpen(false);

  /**
   * Odhlášení uživatele.
   * Odstraní token a přesměruje na auth stránku.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <nav className="navbar glass-nav mb-4 main-navbar">
      <div className="container nav-inner">

        {/* ================= BRAND (desktop) ================= */}
        <Link className="navbar-brand fw-bold desktop-only" to="/">
          ÚČETNÍ SYSTÉM
        </Link>

        {/* ================= BURGER (mobil) ================= */}
        <button
          className="navbar-toggler mobile-only"
          type="button"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ================= NAV GROUP ================= */}
        <div className="glass-nav-group">
          <div className={`glass-items ${menuOpen ? "open" : ""}`}>

            {/* ===== OSOBY ===== */}
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

            {/* ===== FAKTURY ===== */}
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

            {/* ===== STATISTIKY ===== */}
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

            {/* ===== LOGOUT (mobil) ===== */}
            <div
              className="glass-item logout-item"
              onClick={handleLogout}
              role="button"
            >
              <span className="nav-icon">
                <i className="bi bi-box-arrow-right" />
              </span>
              <span className="nav-label">Odhlásit</span>
            </div>

            {/* ===== GLIDER ===== */}
            <div
              className="glass-glider"
              style={{ transform: getGliderPosition() }}
            />
          </div>
        </div>

        {/* ================= USER INFO + DESKTOP LOGOUT ================= */}
        <ul className="navbar-nav ms-auto align-items-center desktop-only">
          <li className="nav-item d-flex align-items-center me-3 text-white">
            <i className="bi bi-person-circle fs-5 me-2" />
            <span>{getUserEmail() || "Uživatel"}</span>
          </li>

          <li className="nav-item">
            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={handleLogout}
              type="button"
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
