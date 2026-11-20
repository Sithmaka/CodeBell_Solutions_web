import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Phone, MessageSquare, MapPin, ChevronDown, CircleCheck, LoaderCircle } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { BRAND_ID, SERVICES, SERVICE_IDS, getService } from "../config/services";
import { getLeadAttribution } from "../lib/attribution";
import { trackEvent } from "../lib/analytics";
import { createIdempotencyKey, submitLead } from "../lib/leadApi";
import { INITIAL_LEAD_FORM, validateLeadForm } from "../lib/leadForm";
import { whatsappLink } from "../lib/supportApi";
import "../styles/contact.css";

const BUDGET_RANGES = ["Under 5,000", "5,000–15,000", "15,000–40,000", "40,000+", "Not sure yet"];
const CURRENCIES = ["USD", "LKR", "GBP", "EUR", "AUD"];
const TIMELINES = ["As soon as practical", "Within 1 month", "1–3 months", "3–6 months", "Exploring / flexible"];

function FieldError({ id, message }) {
  return message ? <span id={id} className="cb-field-error">{message}</span> : null;
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service");
  const [form, setForm] = useState({
    ...INITIAL_LEAD_FORM,
    service: SERVICE_IDS.includes(requestedService) ? requestedService : "",
  });
  const [errors, setErrors] = useState({});
  const [submission, setSubmission] = useState({ state: "idle", leadReference: null, message: "" });
  const idempotencyKey = useRef(createIdempotencyKey());
  const formStarted = useRef(false);
  const submissionInFlight = useRef(false);

  const update = (event) => {
    const { name, type, checked, value } = event.target;
    if (!formStarted.current && name !== "website") {
      formStarted.current = true;
      trackEvent("lead_form_start", { source_page: "/contact", cta_id: getLeadAttribution().ctaId || "contact_direct" });
    }
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submissionInFlight.current || submission.state === "sending" || submission.state === "success") return;
    const clientErrors = validateLeadForm(form);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setSubmission({ state: "error", leadReference: null, message: "Please correct the highlighted fields." });
      trackEvent("lead_form_error", { source_page: "/contact", error_type: "client_validation", service: form.service || "not_selected" });
      document.getElementById(Object.keys(clientErrors)[0])?.focus();
      return;
    }

    submissionInFlight.current = true;
    setSubmission({ state: "sending", leadReference: null, message: "" });
    trackEvent("lead_form_submit", { source_page: "/contact", service: form.service, cta_id: getLeadAttribution().ctaId || "contact_primary" });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    try {
      const response = await submitLead({
        brandId: BRAND_ID,
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        companyName: form.companyName.trim() || null,
        country: form.country.trim(),
        timezone,
        projectDescription: form.projectDescription.trim(),
        budgetRange: form.budgetRange || null,
        budgetCurrency: form.budgetRange ? form.budgetCurrency : null,
        timeline: form.timeline || null,
        existingSystemUrl: form.existingSystemUrl.trim() || null,
        source: getLeadAttribution(),
      }, idempotencyKey.current);
      setSubmission({ state: "success", leadReference: response.leadReference, message: response.message });
      trackEvent("lead_form_success", { source_page: "/contact", service: form.service, cta_id: getLeadAttribution().ctaId || "contact_primary" });
    } catch (error) {
      submissionInFlight.current = false;
      setErrors(error.fields || {});
      setSubmission({
        state: "error",
        leadReference: null,
        message: error.code === "rate_limited"
          ? "Too many attempts were received. Please wait before trying again."
          : error.message,
      });
      trackEvent("lead_form_error", { source_page: "/contact", error_type: error.code || "submission_failed", service: form.service });
    }
  };

  const startAnother = () => {
    setForm({ ...INITIAL_LEAD_FORM });
    setErrors({});
    setSubmission({ state: "idle", leadReference: null, message: "" });
    idempotencyKey.current = createIdempotencyKey();
    formStarted.current = false;
    submissionInFlight.current = false;
  };

  const whatsappMessage = submission.leadReference
    ? `Hello CodeBell, I submitted enquiry ${submission.leadReference} about ${getService(form.service).label}. I would like to continue the conversation here.`
    : "Hello CodeBell, I would like to discuss a project.";

  return (
    <>
      <Helmet>
        <title>Discuss a Software Project | Contact CodeBell</title>
        <meta name="description" content="Tell CodeBell about your software, business system, automation, website, mobile app, integration, or maintenance requirement." />
        <meta property="og:title" content="Discuss a Software Project | Contact CodeBell" />
        <meta property="og:description" content="Share the business problem, affected users, and outcome you want. CodeBell will review the context and suggest an appropriate next step." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/contact" />
        <link rel="canonical" href="https://www.codebell.online/contact" />
      </Helmet>

      <Navbar />
      <main className="cb-contact-page">
        <section className="cb-contact-hero"><div className="cb-contact-container"><div className="cb-contact-hero-content"><p className="cb-layout-eyebrow">START A CONVERSATION</p><h1>Tell us what your business needs to improve.</h1><p>Share the current problem, who it affects, and the outcome you want. We’ll review your enquiry and suggest the most appropriate next step.</p></div></div></section>

        <section className="cb-contact-main-section">
          <div className="cb-contact-container"><div className="cb-contact-main-grid">
            <div className="cb-contact-form-card">
              {submission.state === "success" ? (
                <div className="cb-lead-success" role="status" tabIndex="-1">
                  <CircleCheck size={34} aria-hidden="true" /><h2>Enquiry received</h2>
                  <p>Thank you for contacting CodeBell. Your enquiry has been received successfully. Our team will review your requirements and contact you using your preferred communication method.</p>
                  <p className="cb-lead-reference"><span>Lead reference</span><strong>{submission.leadReference}</strong></p>
                  <div className="cb-lead-success-actions"><a href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" data-cta-id="contact_success_whatsapp" data-whatsapp="true">Continue on WhatsApp</a><button type="button" onClick={startAnother}>Send another enquiry</button></div>
                </div>
              ) : (
                <form className="cb-contact-form" onSubmit={(event) => { void handleSubmit(event); }} noValidate>
                  <h2 className="cb-contact-form-title">Start a project conversation</h2>
                  {submission.state === "error" && <div className="cb-form-alert" role="alert"><strong>We couldn’t submit the form.</strong><p>{submission.message}</p></div>}
                  <div className="cb-contact-form-grid">
                    <div className="cb-field-group"><label htmlFor="name">Full name <span aria-hidden="true">*</span></label><input id="name" name="name" autoComplete="name" required maxLength="120" value={form.name} onChange={update} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} /><FieldError id="name-error" message={errors.name} /></div>
                    <div className="cb-field-group"><label htmlFor="email">Email address <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autoComplete="email" required maxLength="254" value={form.email} onChange={update} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} /><FieldError id="email-error" message={errors.email} /></div>
                    <div className="cb-field-group"><label htmlFor="companyName">Company <span className="cb-optional">Optional</span></label><input id="companyName" name="companyName" autoComplete="organization" maxLength="160" value={form.companyName} onChange={update} /></div>
                    <div className="cb-field-group"><label htmlFor="country">Country <span aria-hidden="true">*</span></label><input id="country" name="country" autoComplete="country-name" required maxLength="100" value={form.country} onChange={update} aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? "country-error" : undefined} /><FieldError id="country-error" message={errors.country} /></div>
                  </div>

                  <div className="cb-field-group cb-full-width"><label htmlFor="service">Required service <span aria-hidden="true">*</span></label><div className="cb-select-wrap"><select id="service" name="service" required value={form.service} onChange={update} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "service-error" : undefined}><option value="" disabled>Select a service…</option>{SERVICES.map((service) => <option key={service.id} value={service.id}>{service.label}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div><FieldError id="service-error" message={errors.service} /></div>

                  <div className="cb-field-group cb-full-width"><label htmlFor="projectDescription">Project description <span aria-hidden="true">*</span></label><textarea id="projectDescription" name="projectDescription" rows="6" required minLength="30" maxLength="4000" value={form.projectDescription} onChange={update} aria-invalid={Boolean(errors.projectDescription)} aria-describedby={`project-help${errors.projectDescription ? " project-error" : ""}`} placeholder="What is not working today, who is affected, and what outcome matters?" /><small id="project-help" className="cb-field-help">Do not include passwords, payment-card details, government identifiers, health information, or other sensitive data.</small><FieldError id="project-error" message={errors.projectDescription} /></div>

                  <div className="cb-contact-form-grid">
                    <div className="cb-field-group"><label htmlFor="preferredContactMethod">Preferred contact method <span aria-hidden="true">*</span></label><div className="cb-select-wrap"><select id="preferredContactMethod" name="preferredContactMethod" value={form.preferredContactMethod} onChange={update}><option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option></select><ChevronDown size={18} aria-hidden="true" /></div></div>
                    <div className="cb-field-group"><label htmlFor="phone">Phone number {["phone", "whatsapp"].includes(form.preferredContactMethod) ? <span aria-hidden="true">*</span> : <span className="cb-optional">Optional</span>}</label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength="40" required={["phone", "whatsapp"].includes(form.preferredContactMethod)} value={form.phone} onChange={update} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} /><FieldError id="phone-error" message={errors.phone} /></div>
                    <div className="cb-field-group"><label htmlFor="budgetRange">Estimated budget <span className="cb-optional">Optional</span></label><div className="cb-budget-row"><div className="cb-select-wrap"><select id="budgetCurrency" name="budgetCurrency" aria-label="Budget currency" value={form.budgetCurrency} onChange={update}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div><div className="cb-select-wrap"><select id="budgetRange" name="budgetRange" value={form.budgetRange} onChange={update}><option value="">Select range…</option>{BUDGET_RANGES.map((range) => <option key={range}>{range}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div></div></div>
                    <div className="cb-field-group"><label htmlFor="timeline">Expected timeline <span className="cb-optional">Optional</span></label><div className="cb-select-wrap"><select id="timeline" name="timeline" value={form.timeline} onChange={update}><option value="">Select timeline…</option>{TIMELINES.map((timeline) => <option key={timeline}>{timeline}</option>)}</select><ChevronDown size={18} aria-hidden="true" /></div></div>
                  </div>

                  <div className="cb-field-group cb-full-width"><label htmlFor="existingSystemUrl">Existing website or system URL <span className="cb-optional">Optional</span></label><input id="existingSystemUrl" name="existingSystemUrl" type="url" inputMode="url" placeholder="https://example.com" maxLength="300" value={form.existingSystemUrl} onChange={update} aria-invalid={Boolean(errors.existingSystemUrl)} aria-describedby={errors.existingSystemUrl ? "url-error" : undefined} /><FieldError id="url-error" message={errors.existingSystemUrl} /></div>

                  <div className="cb-honeypot" aria-hidden="true"><label htmlFor="website">Leave this empty</label><input id="website" name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={update} /></div>
                  <label className="cb-consent-row"><input type="checkbox" name="privacyAcknowledged" checked={form.privacyAcknowledged} onChange={update} required /><span>I acknowledge that CodeBell will use these details to review and respond to my enquiry. See the <Link to="/privacy-policy">Privacy Policy</Link>. <span aria-hidden="true">*</span></span></label><FieldError id="privacy-error" message={errors.privacyAcknowledged} />
                  <label className="cb-consent-row"><input type="checkbox" name="marketingOptIn" checked={form.marketingOptIn} onChange={update} /><span>I would also like to receive occasional relevant updates from CodeBell. <strong>Optional.</strong></span></label>
                  <button type="submit" className="cb-contact-submit-btn" disabled={submission.state === "sending"} data-cta-id="contact_primary" data-consultation="true">{submission.state === "sending" ? <><LoaderCircle size={18} className="cb-spin" aria-hidden="true" /> SUBMITTING</> : submission.state === "error" ? "TRY AGAIN" : "SEND PROJECT ENQUIRY"}</button>
                </form>
              )}
            </div>

            <aside className="cb-contact-sidebar">
              <div className="cb-contact-info-block"><h2>Direct contact</h2><div className="cb-contact-info-list">
                <div className="cb-contact-info-item"><Mail size={18} aria-hidden="true" /><div><span>EMAIL</span><p><a href="mailto:info@codebell.online" data-cta-id="contact_email">info@codebell.online</a></p></div></div>
                <div className="cb-contact-info-item"><Phone size={18} aria-hidden="true" /><div><span>PHONE</span><p><a href="tel:+94704416217" data-cta-id="contact_phone">+94 70 441 6217</a></p></div></div>
                <div className="cb-contact-info-item"><MessageSquare size={18} aria-hidden="true" /><div><span>WHATSAPP</span><p><a href={whatsappLink("Hello CodeBell, I would like to discuss a project.")} target="_blank" rel="noopener noreferrer" data-cta-id="contact_whatsapp" data-whatsapp="true">+94 70 441 6217</a></p></div></div>
                <div className="cb-contact-info-item"><MapPin size={18} aria-hidden="true" /><div><span>HEADQUARTERS</span><p>Colombo, Sri Lanka<br />Remote-First Service</p></div></div>
              </div></div>
              <div className="cb-hours-block"><h2>Operating hours</h2><div className="cb-hours-list"><div className="cb-hours-row"><span>Monday - Friday</span><strong>08:00 - 18:00</strong></div><div className="cb-hours-row"><span>Saturday - Sunday</span><strong className="cb-hours-highlight">WhatsApp Support Only</strong></div></div></div>
              <div className="cb-contact-next"><h2>What happens next</h2><ol><li>We review the business problem and service fit.</li><li>If more context is needed, an assigned team member contacts you.</li><li>Suitable projects move to discovery before scope, timing, or price is confirmed.</li></ol></div>
            </aside>
          </div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
