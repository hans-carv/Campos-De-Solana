// Modal para solicitar inicio de sesión antes de comprar
export default function LoginRequiredModal({
  open,
  onCancel,
  onLogin,
  onRegister,
}) {
  if (!open) return null;

  return (
    <div className="overlay">
      <div
        className="modal"
        style={{
          maxWidth: 460,
          textAlign: "center",
          padding: "38px 34px",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            margin: "0 auto 18px",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--gold)",
            fontSize: 24,
          }}
        >
          🛒
        </div>

        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 4,
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Acceso requerido
        </div>

        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: 34,
            fontWeight: 400,
            color: "var(--wine)",
            lineHeight: 1.1,
            marginBottom: 14,
          }}
        >
          Inicia sesión para continuar
        </h2>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--muted)",
            marginBottom: 24,
          }}
        >
          Puedes revisar el catálogo libremente, pero para añadir vinos al
          carrito o realizar una compra necesitas iniciar sesión.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="btn-outline"
            onClick={onCancel}
            style={{
              minWidth: 140,
            }}
          >
            Volver
          </button>

          <button
            type="button"
            className="btn-outline"
            onClick={onRegister}
            style={{
              minWidth: 140,
            }}
          >
            Registrarme
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onLogin}
            style={{
              minWidth: 150,
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}