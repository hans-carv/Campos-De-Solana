import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import axios from 'axios';

const COLORS = ['#6B1F2A', '#C4974A', '#8A6A28', '#1F618D', '#216B47', '#922B21', '#AF601A'];

// AHORA SOLO RECIBE "orders"
export default function DecisionSupportSystem({ orders = [] }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [activeReport, setActiveReport] = useState("rendimiento");
  const [chartType, setChartType] = useState("bar");
  const [performanceFilter, setPerformanceFilter] = useState("top");

  // Las sugerencias las seguimos trayendo del backend
  useEffect(() => {
    const fetchSugerencias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9090/api/admin/inteligencia/sugerencias", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSugerencias(res.data);
      } catch (err) {
        console.error("Error cargando sugerencias DSS");
      }
    };
    fetchSugerencias();
  }, []);

  const { salesData, cityData, trendData, typeData, userOrderData } = useMemo(() => {
    const salesMap = {};
    const cityMap = {};
    const typeMap = {};
    const trendMap = {};
    const userMap = {};

    orders.forEach(o => {
      const city = o.delivery?.department || "No definido";
      cityMap[city] = (cityMap[city] || 0) + o.total;
      const dateObj = new Date(o.date);
      const dateStr = isNaN(dateObj.getTime()) ? "Sin fecha" : dateObj.toLocaleDateString("es-ES", { month: 'short', day: 'numeric' });
      trendMap[dateStr] = (trendMap[dateStr] || 0) + o.total;
      userMap[o.userName] = (userMap[o.userName] || 0) + 1;
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(i => {
          const uniqueId = i.id || i.name; 
          
          if (!salesMap[uniqueId]) {
            salesMap[uniqueId] = { name: i.name || "Vino genérico", qty: 0 };
          }
          salesMap[uniqueId].qty += (i.qty || 1);
          
          // Categorías (esto no necesita ID, está bien por nombre)
          const cat = i.category || "General";
          typeMap[cat] = (typeMap[cat] || 0) + (i.qty || 1);
        });
      }
    });

    return {
      // Object.values(salesMap) nos devuelve directamente el array [{name: "...", qty: ...}, ...]
      salesData: Object.values(salesMap).sort((a, b) => b.qty - a.qty),
      cityData: Object.entries(cityMap).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total),
      typeData: Object.entries(typeMap).map(([name, value]) => ({ name, value })),
      trendData: Object.entries(trendMap).map(([date, total]) => ({ date, total })),
      userOrderData: Object.entries(userMap).map(([name, count]) => ({ name, orders: count })).sort((a, b) => b.orders - a.orders),
    };
  }, [orders]);

  const renderChart = () => {
    let data = [];
    let dataKey = "";
    let xAxisKey = "";

    if (activeReport === "rendimiento") {
      data = performanceFilter === "top" ? salesData.slice(0, 5) : [...salesData].reverse().slice(0, 5);
      dataKey = "qty";
      xAxisKey = "name";
    } else if (activeReport === "regiones") {
      data = cityData;
      dataKey = "total";
      xAxisKey = "name";
    } else if (activeReport === "tendencias") {
      data = trendData;
      dataKey = "total";
      xAxisKey = "date";
    } else if (activeReport === "tipos") {
      data = typeData;
      dataKey = "value";
      xAxisKey = "name";
    } else if (activeReport === "usuarios") {
      data = userOrderData.slice(0, 10);
      dataKey = "orders";
      xAxisKey = "name";
    }

    if (data.length === 0) return <p style={{ textAlign: "center", color: "var(--muted)", marginTop: "100px", fontFamily: "var(--serif)", fontSize: "18px" }}>No hay ventas registradas en este rango de fechas.</p>;

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={140} paddingAngle={5} dataKey={dataKey} label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, 'Valor']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--wine)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--wine)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={70}
              tickFormatter={(value) => {
                if (value.length > 12) {
                  return value.match(/.{1,12}/g).join('\n');
                }
                return value;
              }}
            />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke="var(--wine)" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip cursor={{ fill: 'rgba(196,151,74,0.1)' }} />
          <Bar dataKey={dataKey} fill={performanceFilter === "bottom" && activeReport === "rendimiento" ? "#922B21" : "var(--wine)"} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 300 }}>
          Inteligencia de Negocios
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', minHeight: '550px' }}>
        
        <div className="card" style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px', flexShrink: 0 }}>
          <div>
            <h4 style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, color: "var(--muted)", textTransform: "uppercase", marginBottom: 16 }}>
              Reporte Activo
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => { setActiveReport("rendimiento"); setChartType("bar"); }} style={{ textAlign: 'left', padding: '12px 16px', background: activeReport === "rendimiento" ? "var(--wine)" : "transparent", color: activeReport === "rendimiento" ? "#fff" : "var(--charcoal)", border: "1px solid", borderColor: activeReport === "rendimiento" ? "var(--wine)" : "var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "var(--trans)" }}>Rendimiento de Vinos</button>
              <button onClick={() => { setActiveReport("tipos"); setChartType("pie"); }} style={{ textAlign: 'left', padding: '12px 16px', background: activeReport === "tipos" ? "var(--wine)" : "transparent", color: activeReport === "tipos" ? "#fff" : "var(--charcoal)", border: "1px solid", borderColor: activeReport === "tipos" ? "var(--wine)" : "var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "var(--trans)" }}>Distribución por Tipo</button>
              <button onClick={() => { setActiveReport("regiones"); setChartType("pie"); }} style={{ textAlign: 'left', padding: '12px 16px', background: activeReport === "regiones" ? "var(--wine)" : "transparent", color: activeReport === "regiones" ? "#fff" : "var(--charcoal)", border: "1px solid", borderColor: activeReport === "regiones" ? "var(--wine)" : "var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "var(--trans)" }}>Ingresos por Región</button>
              <button onClick={() => { setActiveReport("tendencias"); setChartType("line"); }} style={{ textAlign: 'left', padding: '12px 16px', background: activeReport === "tendencias" ? "var(--wine)" : "transparent", color: activeReport === "tendencias" ? "#fff" : "var(--charcoal)", border: "1px solid", borderColor: activeReport === "tendencias" ? "var(--wine)" : "var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "var(--trans)" }}>Tendencias de Ventas</button>
              <button onClick={() => { setActiveReport("usuarios"); setChartType("bar"); }} style={{ textAlign: 'left', padding: '12px 16px', background: activeReport === "usuarios" ? "var(--wine)" : "transparent", color: activeReport === "usuarios" ? "#fff" : "var(--charcoal)", border: "1px solid", borderColor: activeReport === "usuarios" ? "var(--wine)" : "var(--border)", borderRadius: "var(--radius-md)", cursor: "pointer", transition: "var(--trans)" }}>Pedidos por Usuario</button>
              <button onClick={() => setActiveReport("sugerencias")} style={{ textAlign: 'left', padding: '12px 16px', background: activeReport === "sugerencias" ? "var(--gold)" : "transparent", color: activeReport === "sugerencias" ? "var(--wine-dark)" : "var(--charcoal)", border: "1px solid", borderColor: activeReport === "sugerencias" ? "var(--gold)" : "var(--border)", borderRadius: "var(--radius-md)", fontWeight: activeReport === "sugerencias" ? '600' : '400', cursor: "pointer", transition: "var(--trans)" }}>Alertas y Sugerencias</button>
            </div>
          </div>

          {activeReport !== "sugerencias" && (
            <div>
              <h4 style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 2, color: "var(--muted)", textTransform: "uppercase", marginBottom: 16 }}>Tipo de Gráfico</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => setChartType("bar")} className="btn-outline" style={{ flex: 1, borderColor: chartType === "bar" ? "var(--gold)" : "", color: chartType === "bar" ? "var(--gold)" : "" }}>Barras</button>
                <button onClick={() => setChartType("pie")} className="btn-outline" style={{ flex: 1, borderColor: chartType === "pie" ? "var(--gold)" : "", color: chartType === "pie" ? "var(--gold)" : "" }}>Anillo</button>
                <button onClick={() => setChartType("line")} className="btn-outline" style={{ flex: 1, borderColor: chartType === "line" ? "var(--gold)" : "", color: chartType === "line" ? "var(--gold)" : "" }}>Área</button>
              </div>
            </div>
          )}  
        </div>

        <div className="card" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, color: "var(--wine-dark)" }}>
              {activeReport === "rendimiento" && "Unidades vendidas por etiqueta"}
              {activeReport === "tipos" && "Distribución de ventas por tipo de vino"}
              {activeReport === "regiones" && "Distribución de ingresos por ciudad"}
              {activeReport === "tendencias" && "Fluctuación de ventas en el tiempo"}
              {activeReport === "usuarios" && "Top 10 Clientes Frecuentes"}
              {activeReport === "sugerencias" && "Sugerencias del Sistema de Soporte de Decisiones (DSS)"}
            </h3>

            {activeReport === "rendimiento" && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setPerformanceFilter("top")} className={performanceFilter === "top" ? "btn-primary" : "btn-outline"} style={{ padding: '6px 12px', fontSize: '13px' }}>Más Vendidos</button>
                <button onClick={() => setPerformanceFilter("bottom")} className={performanceFilter === "bottom" ? "btn-primary" : "btn-outline"} style={{ padding: '6px 12px', fontSize: '13px' }}>Menos Vendidos</button>
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, minHeight: '400px', width: '100%' }}>
            {activeReport === "sugerencias" ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sugerencias.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontStyle: "italic" }}>No hay alertas generadas por el sistema actualmente.</p>
                ) : (
                  sugerencias.map((sug, idx) => (
                    <div key={idx} style={{ padding: '16px 20px', background: sug.mensajeAlerta.includes("urgente") || sug.mensajeAlerta.includes("10%") ? '#fdf2f2' : '#f4f9f4', borderLeft: '4px solid', borderColor: sug.mensajeAlerta.includes("urgente") || sug.mensajeAlerta.includes("10%") ? '#922B21' : '#216B47', borderRadius: '0 var(--radius-md) var(--radius-md) 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '11px', background: sug.tipo === 'VINO' ? 'var(--wine)' : 'var(--gold)', color: sug.tipo === 'VINO' ? '#fff' : 'var(--wine-dark)', padding: '3px 8px', borderRadius: '4px', fontWeight: '600', marginRight: '12px' }}>
                          {sug.tipo}
                        </span>
                        <strong style={{ color: 'var(--wine-dark)', fontSize: '16px' }}>{sug.referencia}</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#555' }}>{sug.mensajeAlerta}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Métrica actual</span>
                        <p style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 'bold', color: 'var(--charcoal)' }}>
                          {sug.cantidad} {sug.tipo === 'VINO' ? 'uds.' : 'Bs.'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              renderChart()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}