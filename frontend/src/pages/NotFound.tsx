import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container narrow section">
      <div className="card center">
        <h1>Page not found</h1>
        <p className="muted">The page you're looking for isn't on our shelves.</p>
        <Link to="/" className="btn btn-dark">Back to home</Link>
      </div>
    </div>
  );
}
