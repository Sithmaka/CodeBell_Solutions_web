import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BRAND_ID } from "../../config/services";

const ALLOWED_ROLES = new Set(["super_admin", "admin", "sales_manager", "sales_agent", "viewer"]);

export default function ProtectedCrmRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.configured) {
    return <main className="cb-crm-state"><h1>CRM setup required</h1><p>Firebase client configuration is not available in this environment.</p></main>;
  }
  if (auth.loading) return <main className="cb-crm-state" role="status"><p>Checking your session…</p></main>;
  if (!auth.user) return <Navigate to="/internal/crm/login" replace state={{ from: location }} />;
  if (!ALLOWED_ROLES.has(auth.role) || !auth.brands.includes(BRAND_ID)) {
    return (
      <main className="cb-crm-state">
        <h1>Access denied</h1>
        <p>Your account is authenticated but is not authorized for CodeBell Development CRM data.</p>
        <button type="button" onClick={auth.signOut}>Sign out</button>
      </main>
    );
  }
  return children;
}
