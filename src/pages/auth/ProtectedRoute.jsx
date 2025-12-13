import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

/**
 * Ochranná routa pro stránky dostupné pouze přihlášeným uživatelům.
 *
 * Kontroluje přítomnost autentizačního tokenu v localStorage.
 * Pokud token neexistuje, uživatel je přesměrován na přihlašovací stránku.
 *
 * Logika zůstává záměrně jednoduchá – samotná validace tokenu
 * (např. expirace, role, oprávnění) probíhá na backendu.
 *
 * @param {React.ReactNode} children - Komponenta / stránka k zobrazení po ověření
 */
const ProtectedRoute = ({ children }) => {
  /**
   * Načtení tokenu z localStorage.
   * Používá se pouze jako základní kontrola přihlášení.
   */
  const token = localStorage.getItem("token");

  /**
   * Uživatel není přihlášen → přesměrování na auth stránku.
   */
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  /**
   * Uživatel je přihlášen → povolíme přístup ke stránce.
   */
  return children;
};

export default ProtectedRoute;

/* ==================== PROP TYPES ==================== */

ProtectedRoute.propTypes = {
  /** Obsah chráněné stránky */
  children: PropTypes.node.isRequired,
};
