import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { BRAND_ID, getService } from "../../config/services";
import { useAuth } from "../../context/AuthContext";
import { mutateLead } from "../../lib/crmApi";
import { getFirebaseServices } from "../../lib/firebaseClient";
import "../../styles/crm.css";

const STATUSES = ["new", "contacted", "qualified", "meeting_scheduled", "proposal_required", "proposal_sent", "won", "lost"];
const MANAGER_ROLES = new Set(["super_admin", "admin", "sales_manager"]);

function dateLabel(timestamp) {
  return timestamp?.toDate?.().toLocaleString() || "—";
}

export default function CRMLeadDetail() {
  const { leadId } = useParams();
  const auth = useAuth();
  const services = getFirebaseServices();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({ status: "", assignedTo: "", note: "", followupAt: "" });
  const [state, setState] = useState({ loading: true, saving: false, error: "", success: "" });

  const load = useCallback(async () => {
    if (!services) return;
    setState((value) => ({ ...value, loading: true, error: "" }));
    try {
      const activityConstraints = [where("brandId", "==", BRAND_ID), where("leadId", "==", leadId)];
      if (auth.role === "sales_agent") activityConstraints.push(where("assignedTo", "==", auth.user.uid));
      activityConstraints.push(orderBy("timestamp", "desc"), limit(100));
      const [leadSnapshot, activitySnapshot] = await Promise.all([
        getDoc(doc(services.db, "leads", leadId)),
        getDocs(query(collection(services.db, "activities"), ...activityConstraints)),
      ]);
      if (!leadSnapshot.exists()) throw new Error("Lead not found or access denied.");
      const leadData = { id: leadSnapshot.id, ...leadSnapshot.data() };
      setLead(leadData);
      setForm((value) => ({ ...value, status: leadData.status || "new", assignedTo: leadData.assignedTo || "" }));
      setActivities(activitySnapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
      setState((value) => ({ ...value, loading: false }));
    } catch (error) {
      setState((value) => ({ ...value, loading: false, error: error.message || "Lead could not be loaded." }));
    }
  }, [auth.role, auth.user.uid, leadId, services]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!services || !MANAGER_ROLES.has(auth.role)) return;
    getDocs(query(collection(services.db, "crm_users"), where("brands", "array-contains", BRAND_ID), limit(100)))
      .then((snapshot) => setOwners(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })).filter((user) => user.status === "active")))
      .catch(() => setOwners([]));
  }, [auth.role, services]);

  const save = async (payload, success) => {
    setState((value) => ({ ...value, saving: true, error: "", success: "" }));
    try {
      await mutateLead({ leadId, ...payload });
      setState((value) => ({ ...value, saving: false, success }));
      setForm((value) => ({ ...value, note: "", followupAt: "" }));
      await load();
    } catch (error) {
      setState((value) => ({ ...value, saving: false, error: error.message }));
    }
  };

  if (state.loading) return <main className="cb-crm-state" role="status"><p>Loading lead…</p></main>;
  if (!lead) return <main className="cb-crm-state"><h1>Lead unavailable</h1><p role="alert">{state.error}</p><Link to="/internal/crm">Back to dashboard</Link></main>;

  const canEdit = auth.role !== "viewer";
  return (
    <main className="cb-crm-shell">
      <Helmet><title>{lead.leadReference} | CodeBell CRM</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <header className="cb-crm-header"><div><Link to="/internal/crm">← Lead dashboard</Link><h1>{lead.leadReference}</h1><p>{lead.name} · {getService(lead.service).label}</p></div><button type="button" onClick={auth.signOut}>Sign out</button></header>
      {state.error && <p className="cb-crm-alert" role="alert">{state.error}</p>}
      {state.success && <p className="cb-crm-success" role="status">{state.success}</p>}

      <div className="cb-crm-detail-grid">
        <section className="cb-crm-panel">
          <h2>Lead details</h2>
          <dl className="cb-crm-details">
            <div><dt>Name</dt><dd>{lead.name}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
            <div><dt>Phone</dt><dd>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : "—"}</dd></div>
            <div><dt>Company</dt><dd>{lead.companyName || "—"}</dd></div>
            <div><dt>Country / timezone</dt><dd>{lead.country} / {lead.timezone}</dd></div>
            <div><dt>Service</dt><dd>{getService(lead.service).label}</dd></div>
            <div><dt>Budget</dt><dd>{lead.budgetRange ? `${lead.budgetCurrency || ""} ${lead.budgetRange}` : "Not provided"}</dd></div>
            <div><dt>Timeline</dt><dd>{lead.timeline || "Not provided"}</dd></div>
            <div className="wide"><dt>Project description</dt><dd>{lead.projectDescription}</dd></div>
            <div className="wide"><dt>Source</dt><dd><pre>{JSON.stringify(lead.source, null, 2)}</pre></dd></div>
            <div><dt>Privacy</dt><dd>{lead.consent?.privacyAcknowledged ? `Acknowledged (${lead.consent.privacyNoticeVersion})` : "Not recorded"}</dd></div>
            <div><dt>Marketing</dt><dd>{lead.consent?.marketingOptIn ? "Opted in" : "Not opted in"}</dd></div>
            <div><dt>Submitted</dt><dd>{dateLabel(lead.createdAt)}</dd></div>
          </dl>
        </section>

        <aside className="cb-crm-panel cb-crm-actions">
          <h2>Lead management</h2>
          {!canEdit && <p>This role has read-only access.</p>}
          <label htmlFor="lead-status">Status</label>
          <select id="lead-status" value={form.status} disabled={!canEdit || state.saving} onChange={(e) => setForm((value) => ({ ...value, status: e.target.value }))}>
            {STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
          </select>
          <button type="button" disabled={!canEdit || state.saving || form.status === lead.status} onClick={() => save({ action: "update_status", status: form.status }, "Status updated.")}>Update status</button>

          {MANAGER_ROLES.has(auth.role) && <><label htmlFor="lead-owner">Assigned employee</label><select id="lead-owner" value={form.assignedTo} disabled={state.saving} onChange={(e) => setForm((value) => ({ ...value, assignedTo: e.target.value }))}><option value="">Unassigned queue</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.displayName || owner.email || owner.id}</option>)}</select><button type="button" disabled={state.saving} onClick={() => save({ action: "assign", assignedTo: form.assignedTo || null }, "Assignment updated.")}>Update assignment</button></>}

          <label htmlFor="lead-note">Internal note</label>
          <textarea id="lead-note" rows="4" maxLength="2000" value={form.note} disabled={!canEdit || state.saving} onChange={(e) => setForm((value) => ({ ...value, note: e.target.value }))} />
          <button type="button" disabled={!canEdit || state.saving || !form.note.trim()} onClick={() => save({ action: "add_note", note: form.note }, "Note added.")}>Add note</button>

          <label htmlFor="lead-followup">Follow-up time</label>
          <input id="lead-followup" type="datetime-local" value={form.followupAt} disabled={!canEdit || state.saving} onChange={(e) => setForm((value) => ({ ...value, followupAt: e.target.value }))} />
          <button type="button" disabled={!canEdit || state.saving || !form.followupAt} onClick={() => save({ action: "schedule_followup", followupAt: new Date(form.followupAt).toISOString() }, "Follow-up scheduled.")}>Schedule follow-up</button>
        </aside>
      </div>

      <section className="cb-crm-panel">
        <h2>Activity history</h2>
        <ol className="cb-crm-activity">
          {activities.map((activity) => <li key={activity.id}><strong>{activity.eventType.replaceAll("_", " ")}</strong><span>{dateLabel(activity.timestamp)}</span>{activity.metadata?.note && <p>{activity.metadata.note}</p>}</li>)}
          {!activities.length && <li>No activity is visible for this lead.</li>}
        </ol>
      </section>
    </main>
  );
}
