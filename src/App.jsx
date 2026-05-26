import "./styles/global.css";
import { useState, useRef, useEffect, useCallback } from "react";

import initialWines from "./data/wines";
import ADMIN from "./data/admin";

import useLocalStorage from "./hooks/useLocalStorage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import HistoryPage from "./pages/HistoryPage";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  const [page, setPage] = useState("home");

  const [currentUser, setCurrentUser] = useLocalStorage("cs_user", null);
  const [users, setUsers] = useLocalStorage("cs_users", [ADMIN]);
  const [wines, setWines] = useLocalStorage("cs_wines", initialWines);
  const [cart, setCart] = useLocalStorage("cs_cart", []);
  
  const [orders, setOrders] = useLocalStorage("cs_orders", []);

  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
  setToast({ msg, type });
  clearTimeout(toastRef.current);
  toastRef.current = setTimeout(() => {
    setToast(null);
  }, 3000);
}, []);

  const handleLogin = (user) => {
    setCurrentUser(user);

    if (user.role === "admin") {
      setPage("admin");
    } else {
      setPage("catalog");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("token");
    setPage("home");
  };

  const handleRegister = (user) => {
    setUsers((prev) => [...prev, user]);
    setCurrentUser(user);
    setPage("catalog");
  };

  const addToCart = (wine) => {
    if (wine.stock === 0) {
      showToast("Este producto está agotado", "error");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === wine.id);

      if (existing) {
        if (existing.qty >= wine.stock) {
          showToast("No hay más stock disponible para este vino", "error");
          return prev;
        }

        return prev.map((item) =>
          item.id === wine.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...wine, qty: 1 }];
    });

    showToast("Producto agregado al carrito");
  };

  const buyNow = (wine) => {
    if (!currentUser) {
      showToast("Inicia sesión para comprar", "error");
      setPage("login");
      return;
    }

    if (wine.stock === 0) {
      showToast("Este producto está agotado", "error");
      return;
    }

    addToCart(wine);
    setPage("cart");
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Producto eliminado del carrito");
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (qty > item.stock) {
          showToast("No hay más stock disponible para este vino", "error");
          return item;
        }

        return { ...item, qty };
      })
    );
  };

  const renderPage = () => {
    if (currentUser?.role === "admin") {
      return (
        <AdminDashboard
          wines={wines}
          setWines={setWines}
          users={users}
          orders={orders} 
          showToast={showToast}
        />
      );
    }

    switch (page) {
      case "home":
        return <HomePage setPage={setPage} wines={wines} />;

      case "catalog":
        return (
          <CatalogPage
            onAddToCart={addToCart}
            onBuy={buyNow}
            showToast={showToast}
            currentUser={currentUser}
            setPage={setPage}
          />
        );

      case "cart":
        return (
          <CartPage
            cart={cart}
            setCart={setCart}
            onRemove={removeFromCart}
            onUpdateQty={updateQty}
            showToast={showToast}
            setPage={setPage}
          />
        );

      case "history":
        return (
          <HistoryPage
            currentUser={currentUser}
            showToast={showToast}
          />
        );

      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
            setPage={setPage}
            showToast={showToast}
          />
        );

      case "register":
        return (
          <RegisterPage
            onRegister={handleRegister}
            setPage={setPage}
            showToast={showToast}
          />
        );

      default:
        return <HomePage setPage={setPage} wines={wines} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar
        page={page}
        setPage={setPage}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
      />

      <main style={{ flex: 1 }}>{renderPage()}</main>

      {(!currentUser || currentUser.role !== "admin") && <Footer />}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}