import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api";
import { useAuth } from "../context/AuthContext";

interface Form {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  terms: boolean;
}

const EMPTY: Form = { fullName: "", email: "", phone: "", password: "", confirm: "", terms: false };

function validate(f: Form): Record<string, string> {
  const e: Record<string, string> = {};
  const name = f.fullName.trim();
  if (name.length < 2 || name.length > 60) e.fullName = "Full name must be 2 to 60 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address";
  if (f.phone && !/^\d{10}$/.test(f.phone)) e.phone = "Phone number must be 10 digits";
  if (f.password.length < 8) e.password = "Password must be at least 8 characters";
  else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) e.password = "Password must contain a letter and a number";
  if (f.confirm !== f.password) e.confirm = "Passwords don't match";
  if (!f.terms) e.terms = "Please accept the terms to continue";
  return e;
}

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const level = Math.min(4, s);
  return { level, label: ["Too short", "Weak", "Fair", "Good", "Strong"][level] };
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const errors = useMemo(() => validate(form), [form]);
  const pw = strength(form.password);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setServerErrors((s) => ({ ...s, [key]: "" }));
  };
  const show = (key: keyof Form) => (touched[key] ? errors[key] : undefined) || serverErrors[key] || undefined;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, password: true, confirm: true, terms: true });
    setError(null);
    if (Object.keys(errors).length) return;
    setBusy(true);
    try {
      await register({ fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone, password: form.password });
      navigate("/catalogue", { replace: true, state: { welcome: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setServerErrors(err.fieldErrors);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof Form, label: string, input: JSX.Element, hint?: string) => (
    <label className={`field ${show(key) ? "has-error" : ""}`}>
      <span>{label}</span>
      {input}
      {show(key) ? <small className="field-error">{show(key)}</small> : hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );

  const blur = (key: keyof Form) => () => setTouched((t) => ({ ...t, [key]: true }));

  return (
    <div className="auth-page">
      <form className="auth-card wide" onSubmit={onSubmit} noValidate>
        <h1>Create an account</h1>
        <p className="auth-sub">Join ShelfLife to save your cart and check out faster.</p>

        {error && <div className="alert alert-error" role="alert">{error}</div>}

        {field("fullName", "Full name",
          <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} onBlur={blur("fullName")} placeholder="Your full name" autoComplete="name" />)}

        <div className="field-row">
          {field("email", "Email",
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} placeholder="you@example.com" autoComplete="email" />)}
          {field("phone", "Phone (optional)",
            <input inputMode="numeric" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={blur("phone")} placeholder="10-digit mobile" autoComplete="tel" />)}
        </div>

        {field("password", "Password",
          <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} onBlur={blur("password")} placeholder="At least 8 characters" autoComplete="new-password" />,
          "Use 8+ characters with a letter and a number")}

        {form.password && (
          <div className={`strength s${pw.level}`} aria-live="polite">
            <div className="strength-bar"><span /><span /><span /><span /></div>
            <small>{pw.label}</small>
          </div>
        )}

        {field("confirm", "Confirm password",
          <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} onBlur={blur("confirm")} placeholder="Re-enter password" autoComplete="new-password" />)}

        <label className={`check ${show("terms") ? "has-error" : ""}`}>
          <input type="checkbox" checked={form.terms} onChange={(e) => set("terms", e.target.checked)} />
          <span>I agree to the ShelfLife terms and privacy policy</span>
        </label>
        {show("terms") && <small className="field-error">{show("terms")}</small>}

        <button className="btn btn-dark btn-block" type="submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>

        <p className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
