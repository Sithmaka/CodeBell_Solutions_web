import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { BRAND_ID, getService } from "../../config/services";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseServices } from "../../lib/firebaseClient";
import "../../styles/crm.css";

const PAGE_SIZE = 25;
const MANAGER_ROLES = new Set(["super_admin", "admin", "sales_manager"]);

function dateLabel(timestamp) {
  return timestamp?.toDate?.().toLocaleString() || "Pending";
}

export default function CRMDashboard() {
  const auth = useAuth();
  const [leads, setLeads] = useState([]);
  const [owners, setOwners] = useState(new Map());
  const [cursor, setCursor] = useState(null);
  const [history, setHistory] = useState([]);
  const [referenceTime, setReferenceTime] = useState(Date.now);
  const [state, setState] = useState({ loading: true, error: "", hasMore: false });
  const services = getFirebaseServices();

  const loadLeads = useCallback(async (nextCursor = null, replace = true) => {
    if (!services) return;
    await Promise.resolve();
    setState((value) => ({ ...value, loading: true, error: "" }));
    try {
      const constraints = [where("brandId", "==", BRAND_ID)];
      if (auth.role === "sales_agent") constraints.push(where("assignedTo", "==", auth.user.uid));
      constraints.push(orderBy("createdAt", "desc"), limit(PAGE_SIZE + 1));
      if (nextCursor) constraints.push(startAfter(nextCursor));
      const snapshot = await getDocs(query(collection(services.db, "leads"), ...constraints));
      const visible = snapshot.docs.slice(0, PAGE_SIZE);
      setLeads(visible.map((document) => ({ id: document.id, ...document.data(), _snapshot: document })));
      setCursor(visible.at(-1) || null);
      setState({ loading: false, error: "", hasMore: snapshot.docs.length > PAGE_SIZE });
      setReferenceTime(Date.now());
      if (replace && !nextCursor) setHistory([]);
    } catch (error) {
      setState({ loading: false, error: error.message || "Leads could not be loaded.", hasMore: false });
    }
  }, [auth.role, auth.user.uid, services]);

  // The callback starts the external Firestore synchronization for this route.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadLeads(); }, [loadLeads]);

  useEffect(() => {
    if (!services || !MANAGER_ROLES.has(auth.role)) return;
    getDocs(query(collection(services.db, "crm_users"), where("brands", "array-contains", BRAND_ID), limit(100)))
      .then((snapshot) => setOwners(new Map(snapshot.docs.map((document) => [document.id, document.data().displayName || document.data().email || "CRM user"]))))
      .catch(() => setOwners(new Map()));
  }, [auth.role, services]);

  const summary = useMemo(() => ({
    total: leads.length,
    new: leads.filter((lead) => lead.status === "new").length,
    assigned: leads.filter((lead) => Boolean(lead.assignedTo)).length,
    followup: leads.filter((lead) => lead.nextFollowupAt?.toMillis?.() <= referenceTime).length,
  }), [leads, referenceTime]);

  const goNext = () => {
    if (!cursor) return;
    setHistory((value) => [...value, leads[0]?._snapshot || null]);
    loadLeads(cursor, false);
  };

  const goFirst = () => loadLeads();

  return (
    <main className="cb-crm-shell">
      <Helmet><title>Lead Dashboard | CodeBell CRM</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <header className="cb-crm-header">
        <div><p className="eyebrow">CodeBell Development</p><h1>Lead dashboard</h1><p>Signed in as {auth.user.email} · {auth.role.replaceAll("_", " ")}</p></div>
        <button type="button" onClick={auth.signOut}>Sign out</button>
      </header>

      <section className="cb-crm-summary" aria-label="Current page lead summary">
        <article><span>Loaded leads</span><strong>{summary.total}</strong></article>
        <article><span>New</span><strong>{summary.new}</strong></article>
        <article><span>Assigned</span><strong>{summary.assigned}</strong></article>
        <article><span>Follow-up due</span><strong>{summary.followup}</strong></article>
      </section>
      <p className="cb-crm-caption">Summary cards describe the current paginated result, not the entire database.</p>

      <section className="cb-crm-panel">
        <div className="cb-crm-panel-heading"><h2>Leads</h2><button type="button" onClick={() => loadLeads()}>Refresh</button></div>
        {state.error && <p className="cb-crm-alert" role="alert">{state.error}</p>}
        {state.loading ? <p role="status">Loading leads…</p> : (
          <div className="cb-crm-table-wrap">
            <table>
              <thead><tr><th>Reference</th><th>Customer</th><th>Company</th><th>Service</th><th>Source</th><th>Submitted</th><th>Status</th><th>Assigned</th></tr></thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td><Link to={`/internal/crm/leads/${lead.id}`}>{lead.leadReference}</Link></td>
                    <td>{lead.name}</td>
                    <td>{lead.companyName || "—"}</td>
                    <td>{getService(lead.service).label}</td>
                    <td>{lead.source?.utmSource || lead.source?.referrer || "Direct / unknown"}</td>
                    <td>{dateLabel(lead.createdAt)}</td>
                    <td><span className={`cb-crm-status status-${lead.status}`}>{lead.status?.replaceAll("_", " ")}</span></td>
                    <td>{lead.assignedTo ? owners.get(lead.assignedTo) || "Assigned" : "Unassigned"}</td>
                  </tr>
                ))}
                {!leads.length && <tr><td colSpan="8">No authorized leads found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        <div className="cb-crm-pagination">
          <button type="button" onClick={goFirst} disabled={!history.length || state.loading}>First page</button>
          <button type="button" onClick={goNext} disabled={!state.hasMore || state.loading}>Next page</button>
        </div>
      </section>
    </main>
  );
}
