import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const onLogout = async () => {
    close();
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          Shelf<span>Life</span>
        </Link>

        <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main">
          <NavLink to="/catalogue" onClick={close}>Browse</NavLink>
          <NavLink to="/cart" onClick={close}>
            Cart{count > 0 && <span className="cart-badge" aria-label={`${count} items`}>{count}</span>}
          </NavLink>
          {user ? (
            <>
              <span className="nav-user" title={user.email}>Hi, {user.fullName.split(" ")[0]}</span>
              <button className="nav-link-btn" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Log in</NavLink>
              <NavLink to="/register" className="nav-signup" onClick={close}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
