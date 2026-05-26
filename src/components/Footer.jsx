export default function Footer() {
  return (
    <footer style={{ background: "var(--black)", color: "rgba(255,255,255,0.4)", padding: "48px 40px 28px", marginTop: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, maxWidth: 1200, margin: "0 auto", paddingBottom: 36 }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fff", letterSpacing: 3, fontWeight: 300 }}>CAMPOS</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: 5, color: "var(--gold)", marginTop: 2 }}>DE SOLANA</div>
          <p style={{ fontSize: 12, marginTop: 14, maxWidth: 260, lineHeight: 1.8 }}>Bodega familiar con más de 130 años elaborando vinos de excelencia en el corazón de España.</p>
        </div>
        {[
          ["Descubrir", ["Catálogo", "Colecciones", "Novedades"]],
          ["Empresa", ["Nuestra historia", "Sostenibilidad", "Prensa"]],
          ["Contacto", ["hola@camposdesolana.com", "+34 941 000 000", "La Rioja, España"]],
        ].map(([title, items]) => (
          <div key={title}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: 4, color: "var(--gold)", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
            {items.map(item => <p key={item} style={{ fontSize: 12, marginBottom: 8, lineHeight: 1.5, cursor: "default" }}>{item}</p>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(196,151,74,0.15)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 11 }}>© {new Date().getFullYear()} Campos de Solana. Todos los derechos reservados.</p>
        <p style={{ fontSize: 11 }}>La venta de alcohol está prohibida a menores de 18 años.</p>
      </div>
    </footer>
  );
}