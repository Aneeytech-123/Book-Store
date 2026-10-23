import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogue from "./pages/Catalogue";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

const TITLES: Record<string, string> = {
  "/": "Home",
  "/login": "Log in",
  "/register": "Create account",
  "/catalogue": "Catalogue",
  "/cart": "Cart",
};

/** Logged-in users don't need the login or registration pages. */
function GuestOnly({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/catalogue" replace /> : children;
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${TITLES[pathname] ?? "Not found"} | ShelfLife`;
  }, [pathname]);

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
