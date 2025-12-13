import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/api";
import "./AuthCard.css";

/**
 * AuthCard
 *
 * Komponenta zajišťující:
 * - přihlášení uživatele (email + heslo)
 * - registraci uživatele
 * - přihlášení / registraci přes Google
 * - animované přepínání mezi login a register kartou
 */
export default function AuthCard() {
  /* ==================== STAVY ==================== */

  /** Přepnutí karty (login / registrace) */
  const [flipped, setFlipped] = useState(false);

  /** Přihlašovací údaje */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /** Registrační údaje */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  /** Zpráva pro uživatele (chyba / úspěch) */
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  /* ==================== POMOCNÉ FUNKCE ==================== */

  /**
   * Vymaže všechna pole formuláře a hlášku.
   */
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setMsg("");
  };

  /**
   * Přepne kartu (login ↔ registrace) a vyčistí formulář.
   */
  const flipCard = () => {
    setFlipped((prev) => !prev);
    clearForm();
  };

  /* ========================================================
     LOGIN — EMAIL + HESLO
     ======================================================== */

  /**
   * Zpracování přihlášení uživatele.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await apiPost("/api/auth/login", { email, password });

      // uložení tokenu a dat uživatele
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));

      navigate("/");
    } catch (err) {
      setMsg("Neplatný email nebo heslo.");
    }
  };

  /* ========================================================
     REGISTRACE
     ======================================================== */

  /**
   * Zpracování registrace uživatele.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await apiPost("/api/auth/register", {
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      setMsg("Registrace proběhla úspěšně.");

      // po krátké prodlevě přepneme zpět na login
      setTimeout(() => {
        setFlipped(false);
        clearForm();
      }, 1000);
    } catch {
      setMsg("Registrace se nezdařila – e-mail může být již použit.");
    }
  };

  /* ========================================================
     GOOGLE LOGIN / REGISTRACE
     ======================================================== */

  /**
   * Inicializace Google Identity Services.
   */
  const handleGoogleInit = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const login = await apiPost("/api/auth/google", {
            idToken: response.credential,
          });

          localStorage.setItem("token", login.token);
          localStorage.setItem("user", JSON.stringify(login));

          navigate("/");
        } catch (error) {
          setMsg("Google přihlášení selhalo.");
        }
      },
      ux_mode: "popup",
      scope: "email profile",
    });
  };

  /**
   * Vykreslení Google přihlašovacích tlačítek.
   */
  const renderGoogleButtons = () => {
    if (!window.google) return;

    const loginBtn = document.getElementById("google-login-btn");
    if (loginBtn) {
      window.google.accounts.id.renderButton(loginBtn, {
        type: "standard",
        shape: "circle",
        theme: "outline",
        size: "large",
      });
    }

    const registerBtn = document.getElementById("google-register-btn");
    if (registerBtn) {
      window.google.accounts.id.renderButton(registerBtn, {
        type: "standard",
        shape: "circle",
        theme: "outline",
        size: "large",
      });
    }
  };

  /**
   * Inicializace Google loginu po načtení komponenty.
   */
  useEffect(() => {
    handleGoogleInit();
    setTimeout(renderGoogleButtons, 300);
  }, []);

  /** Určuje, zda je zpráva úspěšná */
  const isSuccess = msg.includes("úspěšně");

  /* ==================== RENDER ==================== */

  return (
    <div className={`auth-card ${flipped ? "flipped" : ""}`}>

      {/* ========================================================
                          LOGIN SIDE
      ======================================================== */}
      <div className="auth-side front">
        <h1 className="welcome-title">Vítejte zpátky</h1>
        <p className="welcome-subtitle">Přihlašte se do svého účtu</p>

        {msg && (
          <div className={`auth-msg ${isSuccess ? "success" : "error"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">

          <div className="input-floating">
            <input
              type="email"
              required
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-floating">
            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Heslo</label>
          </div>

          <div className="extra-row">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>

            <button type="button" className="forgot-btn">
              Forgot password?
            </button>
          </div>

          <button className="primary-btn login-btn">
            PŘIHLÁSIT SE
          </button>

          <div className="divider">Nebo</div>

          <div className="icons-row">
            <div id="google-login-btn"></div>
          </div>

          <p className="switch-text-bottom">
            Nemáte účet?
            <button
              type="button"
              className="switch-btn-bottom"
              onClick={flipCard}
            >
              Registrovat se
            </button>
          </p>
        </form>
      </div>

      {/* ========================================================
                         REGISTER SIDE
      ======================================================== */}
      <div className="auth-side back">
        <h1 className="welcome-title">Vytvořte účet</h1>
        <p className="welcome-subtitle">Přidejte se k nám</p>

        {msg && (
          <div className={`auth-msg ${isSuccess ? "success" : "error"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">

          <div className="row-form">

            <div className="col-md-6">
              <div className="input-floating">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label>Jméno</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-floating">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label>Příjmení</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-floating">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label>Telefon</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-floating">
                <input
                  type="email"
                  required
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Email</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-floating">
                <input
                  type="password"
                  required
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Heslo</label>
              </div>
            </div>

          </div>

          <button className="primary-btn register-btn">
            VYTVOŘIT ÚČET
          </button>

          <div className="divider">Nebo se registrujte přes</div>

          <div className="icons-row">
            <div id="google-register-btn"></div>
          </div>

          <p className="switch-text-bottom">
            Máte již účet?
            <button
              type="button"
              className="switch-btn-bottom"
              onClick={flipCard}
            >
              Přihlásit se
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
