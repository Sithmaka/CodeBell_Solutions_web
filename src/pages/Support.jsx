import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import {
  Bot,
  Ticket,
  Search,
  ChevronDown,
  CircleCheck,
  LoaderCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import {
  SUPPORT_ENDPOINTS,
  SUPPORT_EMAIL,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  createTicket,
  getTicketStatus,
  ticketEmailLink,
  whatsappLink,
} from "../lib/supportApi";
import "../styles/contact.css";
import "../styles/support.css";

const EMPTY_TICKET = {
  name: "",
  email: "",
  phone: "",
  company: "",
  project: "",
  category: "",
  priority: "normal",
  subject: "",
  description: "",
  consent: false,
  hp: "", // honeypot — hidden from real users; bots that fill it are ignored
};

const NEXT_STEPS = [
  {
    title: "You get a ticket number",
    text: "We email a confirmation with your ticket number so every reply stays in one thread.",
  },
  {
    title: "We link it to your project",
    text: "Our support desk connects the ticket to your project and the engineer responsible for it.",
  },
  {
    title: "Fixes are tested first",
    text: "Every fix is verified by our QA process before we tell you it's done.",
  },
  {
    title: "You confirm before we close",
    text: "We only close the ticket after you confirm everything works.",
  },
];

function openSupportChat() {
  window.dispatchEvent(new CustomEvent("cb:open-chat", { detail: { mode: "support" } }));
}

export default function Support() {
  const { hash } = useLocation();
  const [ticket, setTicket] = useState(EMPTY_TICKET);
  const [ticketState, setTicketState] = useState({ status: "idle" });
  const [track, setTrack] = useState({ ticketNumber: "", email: "" });
  const [trackState, setTrackState] = useState({ status: "idle" });

  useEffect(() => {
    if (!hash) return;
    const timer = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(timer);
  }, [hash]);

  const updateTicket = (e) => {
    const { name, value, type, checked } = e.target;
    setTicket((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (ticket.hp) return; // bot submission
    const { hp: _honeypot, ...payload } = ticket;

    if (!SUPPORT_ENDPOINTS.ticket) {
      window.location.href = ticketEmailLink(payload);
      setTicketState({ status: "emailed" });
      return;
    }

    setTicketState({ status: "sending" });
    try {
      const { ticketNumber } = await createTicket(payload);
      setTicketState({ status: "created", ticketNumber });
      setTicket(EMPTY_TICKET);
    } catch {
      setTicketState({ status: "error" });
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!SUPPORT_ENDPOINTS.ticketStatus) {
      setTrackState({ status: "unavailable" });
      return;
    }
    setTrackState({ status: "loading" });
    try {
      const result = await getTicketStatus(track);
      setTrackState(result && result.status ? { status: "found", result } : { status: "notfound" });
    } catch {
      setTrackState({ status: "notfound" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Support Center | CodeBell</title>
        <meta
          name="description"
          content="Get help with your CodeBell project: chat with our AI support assistant, raise a support ticket, or track an existing ticket."
        />
        <meta property="og:title" content="Support Center | CodeBell" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/support" />
        <link rel="canonical" href="https://www.codebell.online/support" />
      </Helmet>

      <Navbar />

      <main className="cb-contact-page cb-support-page">
        <section className="cb-contact-hero">
          <div className="cb-contact-container">
            <div className="cb-contact-hero-content">
              <p className="cb-layout-eyebrow">HELP &amp; SUPPORT</p>
              <h1>Support Center</h1>
              <p>
                Get help with a CodeBell project. Chat with our AI support assistant, raise a
                ticket, or check the status of one you&apos;ve already opened.
              </p>
            </div>
          </div>
        </section>

        <section className="cb-support-options">
          <div className="cb-contact-container cb-support-options-grid">
            <article className="cb-support-option">
              <Bot size={26} />
              <h2>Chat with our AI assistant</h2>
              <p>
                Instant answers about our services and your support options. You&apos;ll always
                know when you&apos;re talking to an AI.
              </p>
              <button type="button" className="cb-support-link-btn" onClick={openSupportChat}>
                Open chat <ArrowRight size={16} />
              </button>
            </article>

            <article className="cb-support-option">
              <Ticket size={26} />
              <h2>Raise a support ticket</h2>
              <p>
                Report a bug, request a change, or ask about billing. Every ticket gets a number
                and a named owner.
              </p>
              <a href="#ticket" className="cb-support-link-btn">
                New ticket <ArrowRight size={16} />
              </a>
            </article>

            <article className="cb-support-option">
              <Search size={26} />
              <h2>Track a ticket</h2>
              <p>Check progress with your ticket number and the email address you used.</p>
              <a href="#track" className="cb-support-link-btn">
                Track ticket <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </section>

        <section className="cb-contact-main-section" id="ticket">
          <div className="cb-contact-container">
            <div className="cb-contact-main-grid">
              <div className="cb-contact-form-card">
                <h2 className="cb-support-section-title">Raise a support ticket</h2>

                {ticketState.status === "created" ? (
                  <div className="cb-support-success" role="status">
                    <CircleCheck size={28} />
                    <div>
                      <h3>Ticket created{ticketState.ticketNumber ? `: ${ticketState.ticketNumber}` : ""}</h3>
                      <p>
                        We&apos;ve emailed you a confirmation. Reply to that email to add details
                        or screenshots.
                      </p>
                      <button
                        type="button"
                        className="cb-support-link-btn"
                        onClick={() => setTicketState({ status: "idle" })}
                      >
                        Raise another ticket
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="cb-contact-form" onSubmit={handleTicketSubmit}>
                    <div className="cb-contact-form-grid">
                      <div className="cb-field-group">
                        <label htmlFor="t-name">Full Name</label>
                        <input id="t-name" name="name" value={ticket.name} onChange={updateTicket} required />
                      </div>
                      <div className="cb-field-group">
                        <label htmlFor="t-email">Email Address</label>
                        <input id="t-email" type="email" name="email" value={ticket.email} onChange={updateTicket} required />
                      </div>
                      <div className="cb-field-group">
                        <label htmlFor="t-phone">Phone Number</label>
                        <input id="t-phone" name="phone" value={ticket.phone} onChange={updateTicket} />
                      </div>
                      <div className="cb-field-group">
                        <label htmlFor="t-company">Company</label>
                        <input id="t-company" name="company" value={ticket.company} onChange={updateTicket} />
                      </div>
                      <div className="cb-field-group">
                        <label htmlFor="t-category">Category</label>
                        <div className="cb-select-wrap">
                          <select id="t-category" name="category" value={ticket.category} onChange={updateTicket} required>
                            <option value="" disabled>Select a category...</option>
                            {TICKET_CATEGORIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                      <div className="cb-field-group">
                        <label htmlFor="t-priority">Priority</label>
                        <div className="cb-select-wrap">
                          <select id="t-priority" name="priority" value={ticket.priority} onChange={updateTicket}>
                            {TICKET_PRIORITIES.map((p) => (
                              <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="cb-field-group cb-full-width">
                      <label htmlFor="t-project">Project or website</label>
                      <input
                        id="t-project"
                        name="project"
                        value={ticket.project}
                        onChange={updateTicket}
                        placeholder="e.g. www.yourcompany.com or your app name"
                      />
                    </div>

                    <div className="cb-field-group cb-full-width">
                      <label htmlFor="t-subject">Subject</label>
                      <input id="t-subject" name="subject" value={ticket.subject} onChange={updateTicket} required maxLength={140} />
                    </div>

                    <div className="cb-field-group cb-full-width">
                      <label htmlFor="t-description">Describe the issue</label>
                      <textarea
                        id="t-description"
                        name="description"
                        rows="6"
                        value={ticket.description}
                        onChange={updateTicket}
                        required
                        maxLength={4000}
                        placeholder="What happened, where, and what you expected to happen."
                      />
                    </div>

                    <div className="cb-support-honeypot" aria-hidden="true">
                      <label htmlFor="t-hp">Leave this empty</label>
                      <input id="t-hp" name="hp" tabIndex={-1} autoComplete="off" value={ticket.hp} onChange={updateTicket} />
                    </div>

                    <label className="cb-support-consent">
                      <input type="checkbox" name="consent" checked={ticket.consent} onChange={updateTicket} required />
                      <span>
                        I agree that CodeBell may use these details, including AI-assisted processing,
                        to handle my request. See our <Link to="/privacy-policy">Privacy Policy</Link>.
                      </span>
                    </label>

                    {ticketState.status === "error" && (
                      <p className="cb-support-alert" role="alert">
                        We couldn&apos;t submit your ticket right now.{" "}
                        <a href={ticketEmailLink(ticket)}>Email it to {SUPPORT_EMAIL}</a> instead, or
                        try again in a moment.
                      </p>
                    )}
                    {ticketState.status === "emailed" && (
                      <p className="cb-support-note" role="status">
                        Your email app should have opened with the ticket details. Send that email to
                        reach our support desk at {SUPPORT_EMAIL}.
                      </p>
                    )}

                    <button type="submit" className="cb-contact-submit-btn" disabled={ticketState.status === "sending"}>
                      {ticketState.status === "sending" ? (
                        <span className="cb-support-btn-inner"><LoaderCircle size={18} className="cb-spin" /> SUBMITTING</span>
                      ) : (
                        "SUBMIT TICKET"
                      )}
                    </button>
                  </form>
                )}
              </div>

              <aside className="cb-contact-sidebar">
                <div className="cb-contact-info-block">
                  <h2>What happens next</h2>
                  <ol className="cb-support-steps">
                    {NEXT_STEPS.map((step, i) => (
                      <li key={step.title}>
                        <span className="cb-support-step-no">{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <strong>{step.title}</strong>
                          <p>{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="cb-support-ai-note">
                  <ShieldCheck size={20} />
                  <p>
                    CodeBell uses AI assistants for first-line support. They always identify
                    themselves as AI, and decisions about pricing, releases and contracts are made
                    by our team.
                  </p>
                </div>

                <div className="cb-hours-block">
                  <h2>Urgent?</h2>
                  <div className="cb-hours-list">
                    <div className="cb-hours-row">
                      <span>Monday - Friday</span>
                      <strong>08:00 - 18:00</strong>
                    </div>
                    <div className="cb-hours-row">
                      <span>Anytime</span>
                      <a
                        className="cb-hours-highlight"
                        href={whatsappLink("Hello CodeBell, I need urgent support.")}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp Support
                      </a>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="cb-support-track-section" id="track">
          <div className="cb-contact-container">
            <div className="cb-contact-form-card cb-support-track-card">
              <h2 className="cb-support-section-title">Track a ticket</h2>
              <form className="cb-support-track-form" onSubmit={handleTrackSubmit}>
                <div className="cb-field-group">
                  <label htmlFor="tr-number">Ticket number</label>
                  <input
                    id="tr-number"
                    value={track.ticketNumber}
                    onChange={(e) => setTrack((p) => ({ ...p, ticketNumber: e.target.value.toUpperCase() }))}
                    placeholder="TKT-10482"
                    required
                  />
                </div>
                <div className="cb-field-group">
                  <label htmlFor="tr-email">Email used on the ticket</label>
                  <input
                    id="tr-email"
                    type="email"
                    value={track.email}
                    onChange={(e) => setTrack((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="cb-contact-submit-btn" disabled={trackState.status === "loading"}>
                  {trackState.status === "loading" ? "CHECKING..." : "CHECK STATUS"}
                </button>
              </form>

              {trackState.status === "found" && (
                <div className="cb-support-track-result" role="status">
                  <span className="cb-support-status-pill">{trackState.result.status}</span>
                  {trackState.result.subject && <strong>{trackState.result.subject}</strong>}
                  {trackState.result.lastUpdate && <p>{trackState.result.lastUpdate}</p>}
                  {trackState.result.updatedAt && <small>Updated {trackState.result.updatedAt}</small>}
                </div>
              )}
              {trackState.status === "notfound" && (
                <p className="cb-support-alert" role="alert">
                  We couldn&apos;t find a ticket with that number and email. Check both, or reply to
                  your confirmation email.
                </p>
              )}
              {trackState.status === "unavailable" && (
                <p className="cb-support-note" role="status">
                  Online tracking is coming soon. For now, reply to your ticket confirmation email or
                  contact {SUPPORT_EMAIL} and we&apos;ll update you.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
