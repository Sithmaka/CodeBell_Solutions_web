import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/crm.css";

export default function CRMLogin() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  if (auth.user && auth.role) return <Navigate to="/internal/crm" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      await auth.signIn(form.email.trim(), form.password);
      await auth.refreshClaims();
      navigate(location.state?.from?.pathname || "/internal/crm", { replace: true });
    } catch {
      setStatus({ state: "error", message: "Sign-in failed. Check your credentials and CRM access." });
    }
  };

  return (
    <main className="cb-crm-login">
      <Helmet><title>CRM Sign In | CodeBell</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <section>
        <img src="/codebell.png" alt="CodeBell" />
        <p className="eyebrow">Internal system</p>
        <h1>CRM sign in</h1>
        <p>Employee accounts are provisioned by an authorized administrator. Public registration is not available.</p>
        {!auth.configured ? (
          <p className="cb-crm-alert" role="alert">Firebase is not configured for this environment.</p>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="crm-email">Work email</label>
            <input id="crm-email" type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm((value) => ({ ...value, email: e.target.value }))} />
            <label htmlFor="crm-password">Password</label>
            <input id="crm-password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm((value) => ({ ...value, password: e.target.value }))} />
            {status.state === "error" && <p className="cb-crm-alert" role="alert">{status.message}</p>}
            <button type="submit" disabled={status.state === "loading"}>{status.state === "loading" ? "Signing in…" : "Sign in"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
