// Barra de navegación
import logoCampos from "../assets/wines/Logo/logo_horizontal_color.png";

function Navbar({ page, setPage, currentUser, onLogout, cartCount }) {
  const firstName = currentUser?.name?.split(" ")[0] || "Usuario";

  const navItems = [
    { key: "home", label: "Inicio" },
    { key: "catalog", label: "Catálogo" },
  ];

  const isActive = (key) => page === key;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 500,
        height: 92,
        padding: "0 46px",
        background: "rgba(248, 244, 238, 0.98)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 6px 22px rgba(26, 17, 8, 0.035)",
      }}
    >
      {}
      <button
        type="button"
        onClick={() => setPage("home")}
        aria-label="Ir al inicio"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={logoCampos}
          alt="Campos de Solana"
          style={{
            width: 150,
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
      </button>

      {}
      {currentUser && (
        <div
          style={{
            display: "flex",
            gap: 38,
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setPage(item.key)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--sans)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 2.6,
                textTransform: "uppercase",
                color: isActive(item.key) ? "var(--wine)" : "var(--muted)",
                transition: "var(--transition)",
                padding: "10px 0",
                borderBottom: isActive(item.key)
                  ? "1px solid var(--wine)"
                  : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.key)) {
                  e.currentTarget.style.color = "var(--wine)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.key)) {
                  e.currentTarget.style.color = "var(--muted)";
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {!currentUser ? (
          <>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setPage("login")}
              style={{
                padding: "14px 30px",
                fontSize: 12,
                letterSpacing: 2,
              }}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setPage("register")}
              style={{
                padding: "14px 32px",
                fontSize: 12,
                letterSpacing: 2,
              }}
            >
              Registrarse
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setPage("cart")}
              style={{
                background: isActive("cart") ? "var(--wine)" : "#fff",
                color: isActive("cart") ? "var(--gold-light)" : "var(--black)",
                border: isActive("cart")
                  ? "1px solid var(--wine)"
                  : "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "11px 17px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--sans)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                transition: "var(--transition)",
                boxShadow: isActive("cart")
                  ? "0 8px 18px rgba(107, 31, 42, 0.12)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive("cart")) {
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("cart")) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{ fontSize: 15 }}>🛒</span>
              <span>{cartCount || 0}</span>
            </button>

            <button
              type="button"
              onClick={() => setPage("history")}
              className="btn-outline"
              style={{
                borderColor: isActive("history")
                  ? "var(--wine)"
                  : "var(--border)",
                color: isActive("history") ? "var(--wine)" : "var(--black)",
                padding: "13px 26px",
              }}
            >
              Mis compras
            </button>

            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
                padding: "0 4px",
                maxWidth: 120,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={currentUser.name}
            >
              {firstName}
            </div>

            <button
              type="button"
              className="btn-outline"
              onClick={onLogout}
              style={{
                padding: "13px 26px",
              }}
            >
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;