import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/api";

import { FcGoogle } from "react-icons/fc";

import "./AuthCard.css";

export default function AuthCard() {
  const [flipped, setFlipped] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setMsg("");
  };

  const flipCard = () => {
    setFlipped((prev) => !prev);
    clearForm();
  };

  // =============================================
  // LOGIN (email + heslo)
  // =============================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await apiPost("/api/auth/login", { email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));

      navigate("/");
    } catch (err) {
      setMsg("Neplatný email nebo heslo.");
    }
  };

  // =============================================
  // REGISTRACE
  // =============================================
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
      setTimeout(() => {
        setFlipped(false);
        clearForm();
      }, 1000);
    } catch {
      setMsg("Registrace se nezdařila – e-mail může být již použit.");
    }
  };

  // =============================================
  // GOOGLE LOGIN
  // =============================================
  const handleGoogleLogin = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await apiPost("/api/auth/google", {
            googleId: null,
            email: null,
            fullName: null,
            picture: null,
            idToken: response.credential,
          });

          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res));

          navigate("/");
        } catch {
          setMsg("Google přihlášení selhalo.");
        }
      },
    });

    google.accounts.id.prompt();
  };

  const isSuccess = msg.includes("úspěšně");

  return (
    <div className={`auth-card ${flipped ? "flipped" : ""}`}>

      {/* LOGIN */}
      <div className="auth-side front">
        <h2 className="auth-title">Přihlášení</h2>

        {msg && (
          <div className={`auth-msg ${isSuccess ? "success" : "error"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-box">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>E-mail</label>
          </div>

          <div className="input-box">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Heslo</label>
          </div>

          <button className="primary-btn">Přihlásit se</button>
        </form>

        <div className="social-container">
          <button className="social-btn desktop-only" onClick={handleGoogleLogin}>
            <FcGoogle size={20} className="me-2" />
            Pokračovat přes Google
          </button>
        </div>

        <p className="switch-text">
          Nemáte účet?{" "}
          <button type="button" className="switch-btn" onClick={flipCard}>
            Registrace
          </button>
        </p>
      </div>

      {/* REGISTER */}
      <div className="auth-side back">
        <h2 className="auth-title">Registrace</h2>

        {msg && (
          <div className={`auth-msg ${isSuccess ? "success" : "error"}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-box">
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label>Jméno</label>
          </div>

          <div className="input-box">
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label>Příjmení</label>
          </div>

          <div className="input-box">
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label>Telefon</label>
          </div>

          <div className="input-box">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>E-mail</label>
          </div>

          <div className="input-box">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Heslo</label>
          </div>

          <button className="primary-btn">Vytvořit účet</button>
        </form>

        <p className="switch-text">
          Už máte účet?{" "}
          <button type="button" className="switch-btn" onClick={flipCard}>
            Přihlásit se
          </button>
        </p>
      </div>
    </div>
  );
}
