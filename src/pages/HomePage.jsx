import React from 'react';
import HeroGSAP from '../components/HeroGSAP';

export default function HomePage({ setPage, wines }) {
  const wineList = Array.isArray(wines) ? wines : [];
  const featured = wineList.slice(0, 3);

  return (
    <div className="page-enter">
      <HeroGSAP setPage={setPage} />

      <div style={{ height: 4, background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

      <section style={{ background: "var(--black)", padding: "28px 40px", display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap" }}>
        {[
          ["130+", "Años de historia"],
          ["6", "Variedades de uva"],
          ["18", "Premios internacionales"],
          ["42", "Países destino"],
        ].map(([number, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, color: "var(--gold)" }}> {number} </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: 4 }}> {label} </div>
          </div>
        ))}
      </section>

      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: 5, color: "var(--gold)", textTransform: "uppercase", marginBottom: 12 }}> Selección destacada </div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 44, fontWeight: 300, color: "var(--black)" }}> Nuestros Vinos </h2>
          <div style={{ width: 60, height: 1, background: "var(--gold)", margin: "20px auto 0" }} />
        </div>

        {featured.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "44px 24px", color: "var(--muted)" }}> No hay vinos destacados disponibles por el momento. </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {featured.map((wine) => (
              <MiniWineCard key={wine.id} wine={wine} setPage={setPage} />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <button type="button" className="btn-primary" onClick={() => setPage("catalog")}> Ver catálogo completo → </button>
        </div>
      </section>

      <section style={{ background: "var(--ivory)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300, fontStyle: "italic", color: "var(--wine-dark)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}> “El vino es poesía en botella, la expresión más pura del terroir y del tiempo.” </p>
        <div style={{ marginTop: 20, fontFamily: "var(--sans)", fontSize: 10, letterSpacing: 3, color: "var(--muted)", textTransform: "uppercase" }}> — Fundadores de Campos de Solana </div>
      </section>
    </div>
  );
}

function MiniWineCard({ wine, setPage }) {
  return (
    <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ height: 150, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img
          src={wine.image}
          alt={wine.name}
          style={{ height: 140, objectFit: "contain", filter: "drop-shadow(0 6px 18px rgba(107,31,42,0.18))" }}
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/90x130/6B1F2A/FFFFFF?text=${encodeURIComponent(wine.year)}`;
          }}
        />
      </div>

      <div>
        <span className="badge badge-wine">{wine.tipo || wine.category}</span>
        <h3 style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, marginTop: 10, lineHeight: 1.3 }}>
          {wine.name}
        </h3>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          {wine.region} · {wine.anio || wine.year}
        </p>
      </div>

      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, flex: 1 }}>
        {wine.description?.length > 100 ? `${wine.description.substring(0, 100)}…` : wine.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--wine)", fontWeight: 400 }}>
          ${wine.price?.toFixed(2)}
        </span>
        <button type="button" className="btn-primary" style={{ padding: "9px 18px", fontSize: 10 }} onClick={() => setPage("catalog")}>
          Ver más
        </button>
      </div>
    </div>
  );
}