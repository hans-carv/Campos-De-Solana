import { useState } from "react";
import axios from "axios";
import PasswordInput from "../components/PasswordInput";

export default function RegisterPage({ onRegister, setPage, showToast }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {};
    const email = form.email.trim().toLowerCase();

    if (!form.name.trim()) {
      e.name = "El nombre es obligatorio.";
    }

    if (!email) {
      e.email = "El correo es obligatorio.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      e.email = "Correo no válido.";
    }

    if (!form.phone.trim()) {
      e.phone = "El teléfono es obligatorio.";
    } else if (!/^[67]\d{7}$/.test(form.phone)) {
      e.phone = "Ingresa un celular boliviano válido de 8 dígitos.";
    }

    if (!form.password) {
      e.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 6) {
      e.password = "Mínimo 6 caracteres.";
    }

    if (!form.confirm) {
      e.confirm = "Debes confirmar la contraseña.";
    } else if (form.password !== form.confirm) {
      e.confirm = "Las contraseñas no coinciden.";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setIsLoading(true);

    try {
      const newUser = {
        nombreCompleto: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: `+591 ${form.phone}`,
        password: form.password
      };

      const response = await axios.post("http://localhost:9090/api/auth/registro", newUser);

      if (response.status === 201 || response.status === 200) {
        const userData = {
          id: response.data.idUsuario || Date.now(),
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          role: "cliente"
        };
        
        onRegister(userData);
        showToast("Cuenta creada con éxito. Bienvenido.", "success");
      }
    } catch (error) {
      if (error.response && (error.response.status === 409 || error.response.status === 400)) {
        setErrors({ email: "Verifica los datos. Es posible que el correo ya esté registrado." });
        showToast("Error en los datos ingresados.", "error");
      } else {
        setErrors({ general: "Error al crear la cuenta. Intente más tarde." });
        showToast("Hubo un error al registrarse.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (key, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
    setErrors({});
  };

  const normalField = (key, label, type = "text", placeholder = "") => (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => updateField(key, e.target.value)}
        disabled={isLoading}
      />
      {errors[key] && <span className="error">{errors[key]}</span>}
    </div>
  );

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

      <div className="auth-card auth-card-register">
        <div className="auth-heading">
          <div className="auth-eyebrow">Únete a nosotros</div>
          <h2 className="auth-title">Crear Cuenta</h2>
          <div className="auth-title-line" />
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 330,
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--muted)",
            }}
          >
            Regístrate para comprar vinos, guardar tus pedidos y revisar el
            estado de tus compras.
          </p>
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

        {normalField("name", "Nombre completo", "text", "Ana García")}
        {normalField("email", "Correo electrónico", "email", "tu@correo.com")}

        <div className="field">
          <label>Teléfono</label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              background: "var(--white)",
              overflow: "hidden",
              transition: "var(--transition)",
            }}
          >
            <span
              style={{
                alignSelf: "stretch",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 16px",
                minWidth: 64,
                borderRight: "1px solid var(--border)",
                background: "var(--ivory)",
                color: "var(--wine)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
              }}
            >
              +591
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={8}
              placeholder="70000000"
              value={form.phone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 8);
                updateField("phone", onlyNumbers);
              }}
              disabled={isLoading}
              style={{
                border: "none",
                boxShadow: "none",
                borderRadius: 0,
                background: "transparent",
              }}
            />
          </div>
          {errors.phone && <span className="error">{errors.phone}</span>}
          {!errors.phone && (
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 2,
              }}
            >
              Usaremos este número para el seguimiento del pedido.
            </span>
          )}
        </div>

        <PasswordInput
          label="Contraseña"
          value={form.password}
          onChange={(value) => updateField("password", value)}
          error={errors.password}
          disabled={isLoading}
        />

        <PasswordInput
          label="Confirmar contraseña"
          value={form.confirm}
          onChange={(value) => updateField("confirm", value)}
          error={errors.confirm}
          onEnter={handleSubmit}
          disabled={isLoading}
        />

        <button
          type="button"
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            marginTop: 12,
            padding: "15px 28px",
            fontSize: 13,
            letterSpacing: 2.5,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Crear cuenta"}
        </button>

        <div
          style={{
            marginTop: 26,
            textAlign: "center",
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => setPage("login")}
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
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}