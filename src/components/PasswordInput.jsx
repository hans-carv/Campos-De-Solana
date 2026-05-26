// Campo reutilizable para contraseñas
import { useState } from "react";

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.7 10.7A2 2 0 0 0 12 14a2 2 0 0 0 1.3-.5" />
      <path d="M9.4 5.6A9.3 9.3 0 0 1 12 5.2c6 0 9.5 6.8 9.5 6.8a15.2 15.2 0 0 1-3 4" />
      <path d="M6.2 6.9C3.8 8.7 2.5 12 2.5 12s3.5 6.8 9.5 6.8a9.6 9.6 0 0 0 4-.8" />
    </svg>
  );
}

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder = "••••••••",
  onEnter,
}) {
  const [visible, setVisible] = useState(false);

  const togglePassword = () => {
    setVisible((current) => !current);
  };

  return (
    <div className="field">
      <label>{label}</label>

      <div className="password-field">
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) {
              onEnter();
            }
          }}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={togglePassword}
          title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && <span className="error">{error}</span>}
    </div>
  );
}