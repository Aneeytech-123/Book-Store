import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="brand small">Shelf<span>Life</span></Link>
          <p className="muted small">An online book store built with React, TypeScript, Spring Boot and MongoDB.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/catalogue">Catalogue</Link>
          <Link to="/register">Create account</Link>
          <Link to="/login">Log in</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </div>
    </footer>
  );
}
