import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import BookCover from "../components/BookCover";

const FREE_DELIVERY_FROM = 999;
const DELIVERY_FEE = 49;

export default function Cart() {
  const { items, subtotal, count, setQuantity, remove, clear } = useCart();
  const { user } = useAuth();
  const [placed, setPlaced] = useState(false);

  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  if (placed) {
    return (
      <div className="container narrow section">
        <div className="card center">
          <div className="success-icon">✓</div>
          <h1>Order placed!</h1>
          <p className="muted">Thanks, {user?.fullName.split(" ")[0]}. This is a demo store, so no payment was taken.</p>
          <Link to="/catalogue" className="btn btn-dark">Keep browsing</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container narrow section">
        <div className="card center">
          <h1>Your cart is empty</h1>
          <p className="muted">Find something good to read in the catalogue.</p>
          <Link to="/catalogue" className="btn btn-dark">Browse books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="eyebrow">Cart</span>
          <h1>Your cart</h1>
          <p className="muted">{count} {count === 1 ? "item" : "items"}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clear}>Empty cart</button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map(({ book, quantity }) => (
            <li key={book.id} className="cart-item">
              <BookCover book={book} size="sm" />
              <div className="ci-info">
                <h3>{book.title}</h3>
                <p className="muted small">{book.author}</p>
                <p className="price">{formatPrice(book.price)}</p>
              </div>
              <div className="qty" aria-label={`Quantity for ${book.title}`}>
                <button onClick={() => setQuantity(book.id, quantity - 1)} aria-label="Decrease">−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(book.id, quantity + 1)} aria-label="Increase" disabled={quantity >= 10}>+</button>
              </div>
              <div className="ci-total">
                <strong>{formatPrice(book.price * quantity)}</strong>
                <button className="link-danger" onClick={() => remove(book.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card summary">
          <h2>Order summary</h2>
          <div className="sum-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="sum-row"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span></div>
          {delivery > 0 && <p className="muted small">Add {formatPrice(FREE_DELIVERY_FROM - subtotal)} more for free delivery.</p>}
          <div className="sum-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
          {user ? (
            <button className="btn btn-dark btn-block" onClick={() => { clear(); setPlaced(true); }}>Place order</button>
          ) : (
            <Link to="/login" state={{ from: "/cart" }} className="btn btn-dark btn-block">Log in to check out</Link>
          )}
          <p className="muted small center">Demo checkout: no payment is taken.</p>
        </aside>
      </div>
    </div>
  );
}
