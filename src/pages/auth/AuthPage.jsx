import FloatingLines from "../../components/background/FloatingLines";
import AuthCard from "./AuthCard";

/**
 * Stránka pro přihlášení / registraci uživatele.
 *
 * Zajišťuje:
 * - vykreslení animovaného pozadí
 * - zobrazení autentizační karty (login / registrace)
 *
 * Veškerá logika přihlášení a registrace
 * je zapouzdřena v komponentě AuthCard.
 */
export default function LoginPage() {
  return (
    <div className="auth-wrapper fullscreen">

      {/* ===== ANIMOVANÉ POZADÍ ===== */}
      <FloatingLines
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={[10, 15, 20]}
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
        animationSpeed={1.2}
        mixBlendMode="screen"
      />

      {/* ===== AUTENTIZAČNÍ KARTA ===== */}
      <AuthCard />

    </div>
  );
}
