import { useState, useEffect } from "react";
import axios from "axios";
import DecisionSupportSystem from "./DecisionSupportSystem";

export default function AdminDashboard({ showToast }) {
  const [tab, setTab] = useState("overview");
  const [showWineForm, setShowWineForm] = useState(false);
  const [editWine, setEditWine] = useState(null);
  const [formWine, setFormWine] = useState({ name: "", year: "", category: "Tinto", region: "", price: "", stock: "", description: "", image: "", tags: "" });

  const [wines, setWines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");

  // Nuevos estados para los filtros del DSS
  const [dssFechaInicio, setDssFechaInicio] = useState("");
  const [dssFechaFin, setDssFechaFin] = useState("");
  const [dssEstadoPedido, setDssEstadoPedido] = useState("Todos");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const resWines = await axios.get("http://localhost:9090/api/vinos", { headers });
        setWines(resWines.data.map(v => ({
          id: v.idVino || v.id,
          name: v.nombre || v.name || "",
          year: v.anio || v.year || new Date().getFullYear(),
          category: v.categoria || v.category || "Tinto",
          region: v.region || "",
          price: v.precio || v.price || 0,
          stock: v.stock || 0,
          description: v.descripcion || v.description || "",
          image: v.imagenUrl || v.image || "",
          tags: []
        })));

        const params = new URLSearchParams();
        if (dssFechaInicio) params.append("fechaInicio", dssFechaInicio);
        if (dssFechaFin) params.append("fechaFin", dssFechaFin);
        if (dssEstadoPedido !== "Todos") params.append("estado", dssEstadoPedido);

        const urlPedidos = tab === "analytics" 
            ? `http://localhost:9090/api/admin/pedidos?${params.toString()}` 
            : "http://localhost:9090/api/admin/pedidos";

        const resOrders = await axios.get(urlPedidos, { headers }).catch(() => ({ data: [] }));
        const rawOrders = Array.isArray(resOrders.data) ? resOrders.data : [];
        setOrders(rawOrders.map(o => ({
          id: o.idPedido || o.id || Math.random(),
          userName: o.usuario?.nombreCompleto || o.userName || "Cliente",
          userEmail: o.usuario?.email || o.userEmail || "",
          total: o.total || 0,
          status: o.estado || "En espera",
          date: o.fechaCompra || o.fechaPedido || o.date || new Date(),
          delivery: {
            department: o.ciudadEnvio ? o.ciudadEnvio.split(" - ")[0] : "No definido"
          },
          items: (o.detalles || o.items || []).map((d, idx) => ({
            id: d.idDetalle || d.id || idx,
            name: d.vino?.nombre || d.name || "Vino",
            qty: d.cantidad || d.qty || 1,
            price: d.precioUnitario || d.price || 0,
            category: d.vino?.categoria || d.category || "Tinto"
          }))
        })));

        const resUsers = await axios.get("http://localhost:9090/api/admin/usuarios", { headers }).catch(() => ({ data: [] }));
        const rawUsers = Array.isArray(resUsers.data) ? resUsers.data : [];
        setUsers(rawUsers.map(u => ({
          id: u.idUsuario || u.id || Math.random(),
          name: u.nombreCompleto || u.name || "Usuario",
          email: u.email || "",
          phone: u.telefono || u.phone || "",
          createdAt: u.fechaRegistro || u.createdAt || new Date()
        })));

      } catch (error) {
        if (typeof showToast === 'function') {
           showToast("No se pudo conectar con el servidor", "error");
        } else {
           console.error("No se pudo conectar con el servidor");
        }
      }
    };
    
    fetchAdminData();
  }, [tab, dssFechaInicio, dssFechaFin, dssEstadoPedido]); // <- Sintaxis corregida

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  
  const tabs = [
    { key: "overview", label: "Resumen" },
    { key: "analytics", label: "Analítica" },
    { key: "wines", label: "Vinos" },
    { key: "orders", label: "Pedidos" },
    { key: "users", label: "Usuarios" },
  ];

  const openNew = () => {
    setEditWine(null);
    setFormWine({ name: "", year: new Date().getFullYear(), category: "Tinto", region: "", price: "", stock: 50, description: "", image: "", tags: "" });
    setShowWineForm(true);
  };

  const openEdit = w => {
    setEditWine(w);
    setFormWine({ ...w, tags: w.tags ? w.tags.join(", ") : "" });
    setShowWineForm(true);
  };

  const saveWine = async () => {
    if (!formWine.name.trim() || !formWine.price) { 
      if (showToast) showToast("Nombre y precio son obligatorios.", "error"); 
      return; 
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        nombre: formWine.name,
        anio: parseInt(formWine.year),
        categoria: formWine.category,
        region: formWine.region,
        precio: parseFloat(formWine.price),
        stock: parseInt(formWine.stock) || 0,
        descripcion: formWine.description,
        imagenUrl: formWine.image || "https://placehold.co/300x400/6B1F2A/FFFFFF?text=Vino"
      };

      if (editWine) {
        await axios.put(`http://localhost:9090/api/vinos/${editWine.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:9090/api/vinos", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const resWines = await axios.get("http://localhost:9090/api/vinos");
      setWines(resWines.data.map(v => ({
        id: v.idVino || v.id,
        name: v.nombre || v.name || "",
        year: v.anio || v.year || new Date().getFullYear(),
        category: v.categoria || v.category || "Tinto",
        region: v.region || "",
        price: v.precio || v.price || 0,
        stock: v.stock || 0,
        description: v.descripcion || v.description || "",
        image: v.imagenUrl || v.image || "",
        tags: []
      })));

      setShowWineForm(false);
      if (showToast) showToast(editWine ? "Vino actualizado." : "Vino añadido al catálogo.", "success");
    } catch (error) {
      if (showToast) showToast("Error al guardar el vino en el servidor.", "error");
    }
  };

  const deleteWine = async id => {
    if (!window.confirm("¿Eliminar este vino del catálogo?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9090/api/vinos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWines(ws => ws.filter(w => w.id !== id));
      if (showToast) showToast("Vino eliminado.", "success");
    } catch (error) {
      if (showToast) showToast("Error al eliminar el vino.", "error");
    }
  };

  const updateOrderStatusAdmin = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:9090/api/pedidos/${orderId}/estado`, 
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (showToast) showToast(`Estado actualizado a: ${newStatus}`, "success");
    } catch (error) {
      if (showToast) showToast("Error al actualizar el estado.", "error");
    }
  };

  const filteredDashboardOrders = orders.filter(o => {
    const matchesSearch = o.userName.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toString().includes(orderSearch);
    const matchesStatus = orderStatusFilter ? o.status === orderStatusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-enter" style={{ padding: "0", minHeight: "80vh", display: "flex" }}>
      <div style={{ width: 220, background: "var(--wine-dark)", padding: "40px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "0 28px 32px", borderBottom: "1px solid rgba(196,151,74,0.2)" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 300, color: "#fff", letterSpacing: 2 }}>CAMPOS</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: 4, color: "var(--gold)", marginTop: 2 }}>DE SOLANA</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.35)", marginTop: 10, textTransform: "uppercase" }}>Panel de control</div>
        </div>
        <div style={{ padding: "20px 12px", flex: 1 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              width: "100%", textAlign: "left", padding: "11px 16px",
              background: tab === t.key ? "rgba(196,151,74,0.18)" : "transparent",
              border: "none", borderLeft: tab === t.key ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === t.key ? "var(--gold-soft)" : "rgba(255,255,255,0.55)",
              fontFamily: "var(--sans)", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
              cursor: "pointer", transition: "var(--trans)", borderRadius: "0 var(--radius) var(--radius) 0", marginBottom: 4,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "40px 48px", overflow: "auto" }}>
        
        {tab === "overview" && (
          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, marginBottom: 32 }}>Resumen General</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
              {[
                { label: "Ingresos totales", value: `${totalRevenue.toFixed(2)} Bs.`, icon: "💰" },
                { label: "Pedidos totales", value: orders.length, icon: "📦" },
                { label: "Usuarios registrados", value: users.length, icon: "👤" },
                { label: "Vinos en catálogo", value: wines.length, icon: "🍷" },
              ].map((s, idx) => (
                <div key={idx} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "24px 20px" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: "var(--wine)" }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--muted)", marginTop: 4, letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, marginBottom: 16 }}>Últimos pedidos</h3>
            {orders.length === 0 ? <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Sin pedidos aún.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {orders.slice(-5).reverse().map(o => (
                  <div key={o.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>Pedido #{o.id}</span>
                      <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 10 }}>por {o.userName}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{new Date(o.date).toLocaleDateString("es-ES")}</span>
                      <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--wine)" }}>{o.total.toFixed(2)} Bs.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "analytics" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', background: '#fff' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha Inicio</label>
                <input 
                  type="date" 
                  value={dssFechaInicio} 
                  onChange={(e) => setDssFechaInicio(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha Fin</label>
                <input 
                  type="date" 
                  value={dssFechaFin} 
                  onChange={(e) => setDssFechaFin(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <label style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado del Pedido</label>
                <select 
                  value={dssEstadoPedido} 
                  onChange={(e) => setDssEstadoPedido(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="Todos">Todos (Ingresos Proyectados)</option>
                  <option value="Entregado">Completados (Caja Real)</option>
                  <option value="En espera">En Espera</option>
                  <option value="Enviado">Enviados</option>
                </select>
              </div>
            </div>
            
            <DecisionSupportSystem 
              orders={orders}
            />
          </div>
        )}

        {tab === "wines" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300 }}>Gestión de Vinos</h2>
              <button className="btn-primary" onClick={openNew}>+ Añadir vino</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {wines.map(w => (
                <div key={w.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <img src={w.image} alt={w.name} style={{ height: 52, width: 32, objectFit: "contain" }}
                    onError={e => { e.currentTarget.src = `https://via.placeholder.com/32x52/6B1F2A/FFFFFF?text=V`; }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--serif)", fontSize: 16, fontWeight: 400 }}>{w.name}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{w.category} · {w.region} · {w.year}</p>
                  </div>
                  <span className="badge badge-wine">{w.stock} ud.</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--wine)", minWidth: 80, textAlign: "right" }}>{w.price.toFixed(2)} Bs.</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" onClick={() => openEdit(w)}>Editar</button>
                    <button className="btn-danger" onClick={() => deleteWine(w.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, marginBottom: 28 }}>Todos los Pedidos</h2>
            
            <div className="card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Buscar por ID o Cliente..." 
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none' }}
              />
              <select 
                value={orderStatusFilter} 
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', background: '#fff' }}
              >
                <option value="">Todos los estados</option>
                <option value="En espera">En espera</option>
                <option value="Enviado">Enviado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            {filteredDashboardOrders.length === 0 ? <p style={{ color: "var(--muted)", fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 20 }}>No hay pedidos que coincidan con la búsqueda.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filteredDashboardOrders.slice().reverse().map(o => (
                  <div key={o.id} className="card" style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>Pedido #{o.id}</span>
                        <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 10 }}>
                          {o.userName} ({o.userEmail})
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatusAdmin(o.id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', background: '#fff', cursor: 'pointer' }}
                        >
                          <option value="En espera">En espera</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>{new Date(o.date).toLocaleDateString("es-ES")}</span>
                        <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--wine)" }}>{o.total.toFixed(2)} Bs.</span>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                      {o.items.map((item, idx) => (
                        <div key={item.id || `item-${idx}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)", padding: "3px 0" }}>
                          <span>{item.name} ×{item.qty}</span>
                          <span>{(item.price * item.qty).toFixed(2)} Bs.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "users" && (
          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300, marginBottom: 28 }}>Usuarios Registrados</h2>
            {users.length === 0 ? <p style={{ color: "var(--muted)", fontStyle: "italic", fontFamily: "var(--serif)", fontSize: 20 }}>No hay usuarios registrados.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {users.map(u => (
                  <div key={u.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%", background: "var(--wine-dark)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--gold-soft)", fontSize: 13, fontWeight: 600, flexShrink: 0,
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500 }}>{u.name}</p>
                      <p style={{ fontSize: 12, color: "var(--muted)" }}>{u.email}</p>
                    </div>
                    {u.phone && <span style={{ fontSize: 12, color: "var(--muted)" }}>{u.phone}</span>}
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>Desde {new Date(u.createdAt).toLocaleDateString("es-ES")}</span>
                    <span className="badge badge-wine">Cliente</span>
                    <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 60, textAlign: "right" }}>
                      {orders.filter(o => o.userId === u.id || o.userEmail === u.email).length} pedidos
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showWineForm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowWineForm(false)}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, marginBottom: 28 }}>
              {editWine ? "Editar vino" : "Añadir nuevo vino"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Nombre del vino *</label>
                <input value={formWine.name} onChange={e => setFormWine(f => ({ ...f, name: e.target.value }))} placeholder="Reserva Especial Tempranillo" />
              </div>
              <div className="field">
                <label>Añada *</label>
                <input type="number" value={formWine.year} onChange={e => setFormWine(f => ({ ...f, year: e.target.value }))} placeholder="2020" />
              </div>
              <div className="field">
                <label>Categoría</label>
                <select value={formWine.category} onChange={e => setFormWine(f => ({ ...f, category: e.target.value }))}>
                  {["Tinto", "Blanco", "Rosado", "Espumoso", "Dulce"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Precio (Bs.) *</label>
                <input type="number" step="0.01" value={formWine.price} onChange={e => setFormWine(f => ({ ...f, price: e.target.value }))} placeholder="120.00" />
              </div>
              <div className="field">
                <label>Stock (uds.)</label>
                <input type="number" value={formWine.stock} onChange={e => setFormWine(f => ({ ...f, stock: e.target.value }))} placeholder="50" />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Región</label>
                <input value={formWine.region} onChange={e => setFormWine(f => ({ ...f, region: e.target.value }))} placeholder="Tarija" />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Descripción</label>
                <textarea rows={3} value={formWine.description} onChange={e => setFormWine(f => ({ ...f, description: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>URL de imagen</label>
                <input value={formWine.image} onChange={e => setFormWine(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Etiquetas (separadas por comas)</label>
                <input value={formWine.tags} onChange={e => setFormWine(f => ({ ...f, tags: e.target.value }))} placeholder="Roble francés, 18 meses, Premium" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn-outline" onClick={() => setShowWineForm(false)}>Cancelar</button>
              <button className="btn-primary" onClick={saveWine}>{editWine ? "Guardar cambios" : "Añadir vino"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
