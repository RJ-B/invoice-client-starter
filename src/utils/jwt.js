/**
 * Získá e-mail (subject) přihlášeného uživatele z JWT tokenu uloženého v localStorage.
 *
 * Funkce:
 * - načte JWT token z localStorage
 * - dekóduje payload (Base64)
 * - vrátí hodnotu `sub` (standardní JWT subject)
 *
 * @returns {string|null} E-mail uživatele nebo null, pokud token neexistuje / je neplatný
 */
export function getUserEmail() {
  const token = localStorage.getItem("token");

  // Uživatel není přihlášen
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    // JWT má formát: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Base64 decode payload části
    const payloadBase64 = parts[1];

    // atob očekává správný base64 string
    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));

    const payload = JSON.parse(payloadJson);

    // JWT standardně ukládá identitu do `sub`
    return typeof payload.sub === "string" ? payload.sub : null;

  } catch (error) {
    console.error("JWT decode failed:", error);
    return null;
  }
}
