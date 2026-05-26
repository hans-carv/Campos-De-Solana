import { useState, useEffect } from "react";
import axios from "axios";

const ORDER_STATUS = {
  PENDING: "En espera",
  SHIPPING: "Enviado",
  DELIVERED: "Entregado"
};

export default function HistoryPage({ currentUser, showToast }) {
  const [orders, setOrders] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9090/api/pedidos/historial", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const rawData = response.data;
        const ordersList = Array.isArray(rawData) ? rawData : (rawData.content || rawData.data || rawData.pedidos || []);

        const mappedOrders = ordersList.map(o => {
          let deliveryData = {};
          
          if (o.ciudadEnvio) {
            const splitCiudad = o.ciudadEnvio.split(" - ");
            deliveryData.department = splitCiudad[0] || "";
            deliveryData.address = splitCiudad[1] || o.ciudadEnvio;
          }

          if (o.referencia) {
            const splitRef = o.referencia.split(" - Ref: ");
            deliveryData.contactPhone = splitRef[0]?.replace("Tel: ", "") || "";
            deliveryData.reference = splitRef[1] || o.referencia;
          }

          return {
            id: o.idPedido,
            userName: currentUser?.name || "Cliente",
            date: o.fechaCompra,
            status: o.estado || ORDER_STATUS.PENDING,
            total: o.total || 0,
            delivery: {
              deliveryDate: o.fechaEntregaDeseada,
              ...deliveryData
            },
            items: (o.detalles || o.items || []).map(d => ({
              id: d.idDetalle || d.vino?.idVino,
              name: d.vino?.nombre || d.nombreVino || "Vino",
              qty: d.cantidad || 1,
              price: d.precioUnitario || d.precio || 0
            }))
          };
        });

        mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(mappedOrders);
      } catch (error) {
        showToast("Error al obtener los pedidos del servidor.", "error");
      } finally {
        setCargando(false);
      }
    };

    fetchOrders();
  }, [currentUser, showToast]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:9090/api/pedidos/${orderId}/estado`, 
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Estado actualizado a: ${newStatus}`, "success");
    } catch (error) {
      showToast("No se pudo actualizar el estado del pedido.", "error");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return {
          label: "Pendiente",
          backgroundColor: "rgba(196,151,74,0.16)",
          color: "#8A6A28",
          border: "1px solid rgba(196,151,74,0.45)",
        };
      case ORDER_STATUS.SHIPPING:
        return {
          label: "Enviado",
          backgroundColor: "rgba(52,152,219,0.12)",
          color: "#1F618D",
          border: "1px solid rgba(52,152,219,0.35)",
        };
      case ORDER_STATUS.DELIVERED:
        return {
          label: "Entregado",
          backgroundColor: "rgba(34,120,70,0.12)",
          color: "#216B47",
          border: "1px solid rgba(34,120,70,0.35)",
        };
      default:
        return {
          label: status,
          backgroundColor: "var(--ivory)",
          color: "var(--muted)",
          border: "1px solid var(--border)",
        };
    }
  };

  const statusSteps = [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.SHIPPING,
    ORDER_STATUS.DELIVERED,
  ];

  const getStatusIndex = (status) => {
    return statusSteps.indexOf(status);
  };

  const formatDate = (date) => {
    if (!date) return "No definido";

    const dateObj = new Date(date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dateObj.getTime() + userTimezoneOffset);

    return localDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderActions = (order) => {
    const isAdmin = currentUser?.role === "admin";

    if (!isAdmin) return null;

    switch (order.status) {
      case ORDER_STATUS.PENDING:
        return (
          <button
            className="btn-primary"
            onClick={() => handleUpdateOrderStatus(order.id, ORDER_STATUS.SHIPPING)}
          >
            Enviar pedido
          </button>
        );
      case ORDER_STATUS.SHIPPING:
        return (
          <button
            className="btn-primary"
            onClick={() => handleUpdateOrderStatus(order.id, ORDER_STATUS.DELIVERED)}
          >
            Marcar como entregado
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="page-enter"
      style={{
        padding: "56px 40px",
        maxWidth: 980,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: 42 }}>
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: 9,
            letterSpacing: 5,
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Seguimiento de compras
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontSize: 48,
            fontWeight: 300,
            color: "var(--black)",
          }}
        >
          Historial de Pedidos
        </h1>
        <p
          style={{
            color: "var(--muted)",
            marginTop: 10,
            maxWidth: 620,
          }}
        >
          Consulta tus compras realizadas, revisa productos y realiza seguimiento
          del estado actual de cada pedido.
        </p>
      </div>

      {cargando ? (
        <div style={{ textAlign: "center", padding: "60px 30px", color: "var(--wine)", fontSize: 18 }}>
          Cargando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "60px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 50,
              opacity: 0.2,
              marginBottom: 16,
            }}
          >
            📦
          </div>
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: 32,
              fontWeight: 300,
              marginBottom: 12,
            }}
          >
            No tienes pedidos todavía
          </h2>
          <p style={{ color: "var(--muted)" }}>
            Cuando confirmes una compra aparecerá aquí.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            const statusIndex = getStatusIndex(order.status);
            const delivery = order.delivery || {};

            return (
              <div
                key={order.id}
                className="card"
                style={{
                  padding: "26px 30px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                    flexWrap: "wrap",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        letterSpacing: 1.5,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Pedido #{order.id}
                    </p>
                    <h2
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: 28,
                        fontWeight: 400,
                        color: "var(--wine-dark)",
                        marginTop: 4,
                      }}
                    >
                      {order.userName}
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        marginTop: 4,
                      }}
                    >
                      Pedido realizado: {formatDate(order.date)} ·{" "}
                      {order.items.length} producto(s)
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 1.3,
                      textTransform: "uppercase",
                      ...statusStyle,
                    }}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: 16,
                    marginBottom: 18,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  <InfoItem
                    label="Fecha de entrega"
                    value={delivery.deliveryDate ? formatDate(delivery.deliveryDate) : "No definido"}
                    icon="📅"
                  />
                  <InfoItem
                    label="Departamento"
                    value={delivery.department}
                    icon="📍"
                  />
                  <InfoItem
                    label="Dirección"
                    value={delivery.address}
                    icon="🏠"
                  />
                  <InfoItem
                    label="Teléfono"
                    value={delivery.contactPhone}
                    icon="📞"
                  />
                  {delivery.reference && delivery.reference !== "N/A" && (
                    <InfoItem
                      label="Referencia"
                      value={delivery.reference}
                      icon="📝"
                    />
                  )}
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 18,
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={`${order.id}-${item.id || idx}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        fontSize: 13,
                        color: "var(--charcoal)",
                      }}
                    >
                      <span>
                        {item.name}{" "}
                        <span style={{ color: "var(--muted)" }}>
                          x{item.qty}
                        </span>
                      </span>
                      <span>Bs {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border)",
                    paddingTop: 18,
                    marginBottom: 22,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: 1.5,
                    }}
                  >
                    Total pagado
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 30,
                      color: "var(--wine)",
                    }}
                  >
                    Bs {order.total.toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                    marginBottom: 22,
                  }}
                >
                  {statusSteps.map((step, index) => {
                    const isActive = index <= statusIndex;
                    return (
                      <div
                        key={step}
                        title={step}
                        style={{
                          height: 8,
                          borderRadius: 20,
                          background: isActive
                            ? "var(--gold)"
                            : "var(--ivory)",
                          border: "1px solid var(--border)",
                          transition: "background 0.3s ease",
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {renderActions(order)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div style={{
      background: "var(--ivory)",
      padding: "12px 16px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "flex-start",
      gap: 12
    }}>
      {icon && (
        <span style={{ fontSize: 16, marginTop: 2 }}>{icon}</span>
      )}
      <div>
        <p
          style={{
            fontSize: 10,
            letterSpacing: 1.3,
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 4,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "var(--charcoal)",
            lineHeight: 1.4,
            fontWeight: 500
          }}
        >
          {value || "No definido"}
        </p>
      </div>
    </div>
  );
}