import { useState } from "react";
import axios from "axios";
import PasswordInput from "../components/PasswordInput";

function LoginPage({ onLogin, setPage, showToast }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.email.trim()) {
      e.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Correo no válido.";
    }

    if (!form.password) {
      e.password = "La contraseña es obligatoria.";
    }

    return e;
  };

  const updateField = (key, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));

    setErrors({});
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setIsLoading(true);

    try {
      // Usando el endpoint correcto y la lógica de decodificación JWT del código antiguo
      const response = await axios.post("http://localhost:9090/api/auth/login", {
        email: form.email,
        password: form.password
      });

      const token = response.data.token || response.data;
      localStorage.setItem("token", token);

      // Lógica para decodificar el payload del JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      
      const nombreExtraido = decoded.sub.split("@")[0];

      // Formateando el usuario como lo espera la aplicación
      const user = { 
        id: Date.now(),
        name: nombreExtraido,
        email: decoded.sub, 
        role: decoded.rol === "ROLE_ADMIN" ? "admin" : "cliente" 
      };

      onLogin(user); 
      showToast(`Bienvenido, ${user.name}`, "success");
      
    } catch (error) {
      setErrors({
        general: "Correo o contraseña incorrectos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="page-enter auth-page"
      style={{
        position: "relative",
      }}
    >
      <button
        type="button"
        className="btn-back"
        onClick={() => setPage("home")}
        style={{
          position: "absolute",
          top: 32,
          left: 40,
        }}
      >
        <span className="btn-back-icon">←</span>
        Volver
      </button>

      <div className="auth-card auth-card-login">
        <div className="auth-heading">
          <div className="auth-eyebrow">Bienvenido</div>
          <h2 className="auth-title">Iniciar Sesión</h2>
          <div className="auth-title-line" />
        </div>

        {errors.general && (
          <div
            style={{
              background: "rgba(107, 31, 42, 0.08)",
              border: "1px solid rgba(107, 31, 42, 0.2)",
              borderRadius: "var(--radius)",
              padding: "12px 14px",
              marginBottom: 22,
              fontSize: 13,
              color: "var(--wine)",
              textAlign: "center",
            }}
          >
            {errors.general}
          </div>
        )}

        <div className="field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            disabled={isLoading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <PasswordInput
          label="Contraseña"
          value={form.password}
          onChange={(value) => updateField("password", value)}
          error={errors.password}
          onEnter={handleSubmit}
          disabled={isLoading}
        />

        <button
          type="button"
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: 10,
            padding: "15px 28px",
            fontSize: 13,
            letterSpacing: 2.5,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Iniciando..." : "Entrar"}
        </button>

        <div
          style={{
            marginTop: 26,
            textAlign: "center",
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => setPage("register")}
            disabled={isLoading}
            style={{
              background: "none",
              border: "none",
              color: "var(--wine)",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Regístrate
          </button>
        </div>
        
        {}
        <div style={{ marginTop: 20, padding: "12px", background: "var(--ivory)", borderRadius: "var(--radius)", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
          Admin: admin@camposdesolana.com / admin123
        </div>
      </div>
    </div>
  );
}

export default LoginPage;