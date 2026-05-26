// Modal para confirmar mayoría de edad
export default function AgeVerificationModal({ open, onCancel, onConfirm }) {
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
            fontSize: 26,
          }}
        >
          ✺
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
          Confirmación requerida
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
          Venta exclusiva para mayores de 18 años
        </h2>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--muted)",
            marginBottom: 24,
          }}
        >
          Para continuar con la compra, confirma que eres mayor de edad y que el
          consumo de alcohol es permitido para ti.
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
            No, volver
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onConfirm}
            style={{
              minWidth: 160,
            }}
          >
            Sí, continuar
          </button>
        </div>
      </div>
    </div>
  );
}