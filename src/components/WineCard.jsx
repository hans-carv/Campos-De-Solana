import { useState } from "react";
import AgeVerificationModal from "./AgeVerificationModal";
import LoginRequiredModal from "./LoginRequiredModal";

export default function WineCard({
  wine,
  onAddToCart,
  onBuy,
  currentUser,
  setPage,
}) {
  const [hover, setHover] = useState(false);
  const [ageModal, setAgeModal] = useState({
    open: false,
    action: null,
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const stock = Number(wine?.stock) || 0;
  const price = Number(wine?.price) || 0;

  const tags = Array.isArray(wine?.tags)
    ? wine.tags.slice(0, 2)
    : [];

  const isOutOfStock = stock <= 0;

  const openActionFlow = (action) => {
    if (isOutOfStock) return;

    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }

    setAgeModal({
      open: true,
      action,
    });
  };

  const closeAgeModal = () => {
    setAgeModal({
      open: false,
      action: null,
    });
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const confirmAge = () => {
    if (ageModal.action === "cart" && typeof onAddToCart === "function") {
      onAddToCart(wine);
    }

    if (ageModal.action === "buy" && typeof onBuy === "function") {
      onBuy(wine);
    }

    closeAgeModal();
  };

  const goToLogin = () => {
    closeLoginModal();
    setPage("login");
  };

  const goToRegister = () => {
    closeLoginModal();
    setPage("register");
  };

  return (
    <>
      <article
        className="card"
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          opacity: isOutOfStock ? 0.7 : 1,
          transform: hover && !isOutOfStock ? "translateY(-5px)" : "none",
          transition: "var(--transition)",
          boxShadow:
            hover && !isOutOfStock
              ? "0 18px 34px rgba(0,0,0,0.14)"
              : "0 4px 14px rgba(0,0,0,0.05)",
          position: "relative",
          background: "#fff",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {isOutOfStock && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.22)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Imagen */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px 20px",
            position: "relative",
            minHeight: 280,
          }}
        >
          {/* Año */}
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
            }}
          >
            <span
              className="badge"
              style={{
                background: "rgba(196,151,74,0.22)",
                color: "var(--gold-soft)",
                fontSize: 10,
                letterSpacing: 1.4,
              }}
            >
              {wine?.year}
            </span>
          </div>

          {/* Destacado */}
          {wine?.featured && (
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
              }}
            >
              <span className="badge badge-gold">
                Destacado
              </span>
            </div>
          )}

          <div
            style={{
              width: "100%",
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* sombra */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 8,
                width: 95,
                height: 14,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.24)",
                filter: "blur(10px)",
              }}
            />

            <img
              src={wine?.image}
              alt={wine?.name || "Vino"}
              style={{
                maxHeight: 260,
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.34))",
                transition: "var(--transition)",
                transform:
                  hover && !isOutOfStock
                    ? "scale(1.07)"
                    : "scale(1)",
                position: "relative",
                zIndex: 2,
              }}
              onError={(e) => {
                e.currentTarget.src =
                  `https://via.placeholder.com/120x220/6B1F2A/FFFFFF?text=${encodeURIComponent(
                    wine?.name || "Vino"
                  )}`;
              }}
            />
          </div>
        </div>

        {/* Contenido */}
        <div
          style={{
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* badges */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <span className="badge badge-wine">
              {wine?.category}
            </span>

            <span className="badge badge-gold">
              {wine?.region}
            </span>

            {wine?.size && (
              <span
                className="badge"
                style={{
                  background: "var(--ivory)",
                  color: "var(--muted)",
                }}
              >
                {wine.size}
              </span>
            )}
          </div>

          {/* titulo */}
          <h3
            style={{
              fontFamily: "var(--serif)",
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 10,
              color: "var(--black)",
              minHeight: 54,
            }}
          >
            {wine?.name}
          </h3>

          {/* descripcion */}
          <p
            style={{
              fontSize: 14,
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: 14,

              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",

              minHeight: 72,
            }}
          >
            {wine?.description}
          </p>

          {/* tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    background: "var(--ivory)",
                    border: "1px solid var(--border)",
                    borderRadius: "999px",
                    padding: "5px 10px",
                    color: "var(--muted)",
                    letterSpacing: 0.4,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* footer */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 16,
              marginTop: "auto",
            }}
          >
            {/* precio y stock */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 30,
                  color: "var(--wine)",
                  lineHeight: 1,
                }}
              >
                Bs {price.toFixed(2)}
              </span>

              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isOutOfStock
                    ? "var(--danger)"
                    : "var(--wine-dark)",
                  background: "rgba(107,31,42,0.08)",
                  padding: "6px 10px",
                  borderRadius: "999px",
                }}
              >
                {isOutOfStock
                  ? "Agotado"
                  : `${stock} disponibles`}
              </span>
            </div>

            {/* botones */}
            <div
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <button
                type="button"
                className="btn-outline"
                disabled={isOutOfStock}
                onClick={() => openActionFlow("cart")}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock
                    ? "not-allowed"
                    : "pointer",
                  fontSize: 11,
                  padding: "12px 10px",
                }}
              >
                {isOutOfStock ? "Agotado" : "Añadir"}
              </button>

              <button
                type="button"
                className="btn-primary"
                disabled={isOutOfStock}
                onClick={() => openActionFlow("buy")}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock
                    ? "not-allowed"
                    : "pointer",
                  fontSize: 11,
                  padding: "12px 10px",
                }}
              >
                {isOutOfStock
                  ? "No disponible"
                  : "Comprar ahora"}
              </button>
            </div>
          </div>
        </div>
      </article>



      <LoginRequiredModal
        open={loginModalOpen}
        onCancel={closeLoginModal}
        onLogin={goToLogin}
        onRegister={goToRegister}
      />

      <AgeVerificationModal
        open={ageModal.open}
        onCancel={closeAgeModal}
        onConfirm={confirmAge}
      />
    </>
  );
}


