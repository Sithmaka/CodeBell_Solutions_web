import { Helmet } from "react-helmet-async";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/legal.css";

const sections = [
  ["agreement", "Agreement to these terms"],
  ["services", "Services and proposals"],
  ["responsibilities", "Client responsibilities"],
  ["fees", "Fees and payment"],
  ["delivery", "Timelines and changes"],
  ["acceptance", "Review and acceptance"],
  ["ownership", "Intellectual property"],
  ["third-parties", "Third-party services"],
  ["confidentiality", "Confidentiality"],
  ["warranties", "Warranties and liability"],
  ["termination", "Suspension and termination"],
  ["general", "General terms"],
  ["contact", "Contact us"],
];

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms &amp; Conditions | CodeBell</title>
        <meta
          name="description"
          content="Review the terms that govern the CodeBell website, proposals, digital services, payments, deliverables, and client responsibilities."
        />
        <meta property="og:title" content="Terms & Conditions | CodeBell" />
        <meta
          property="og:description"
          content="The terms that apply when you use CodeBell’s website or engage our digital services."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.codebell.online/terms-and-conditions"
        />
        <link
          rel="canonical"
          href="https://www.codebell.online/terms-and-conditions"
        />
      </Helmet>

      <Navbar />

      <main className="cb-legal-page">

        <header className="cb-legal-hero">
          <div className="cb-legal-shell">
            <div className="cb-legal-eyebrow">
              <FileText size={16} aria-hidden="true" />
              Legal &amp; service terms
            </div>
            <h1>
              Terms &amp; <span>Conditions.</span>
            </h1>
            <p className="cb-legal-summary">
              These terms set clear expectations for using our website and
              working with CodeBell on digital products and services.
            </p>
            <div className="cb-legal-meta">
              <span>Effective July 20, 2026</span>
              <span>Last updated July 20, 2026</span>
            </div>
          </div>
        </header>

        <div className="cb-legal-shell cb-legal-layout">
          <aside className="cb-legal-toc" aria-label="Terms and conditions contents">
            <p>On this page</p>
            <nav>
              {sections.map(([id, label], index) => (
                <a href={`#${id}`} key={id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="cb-legal-content">
            <div className="cb-legal-notice">
              <strong>Important:</strong> a signed proposal, statement of work,
              or service agreement may include additional terms. If it conflicts
              with these general terms, the signed document controls for that
              engagement.
            </div>

            <section id="agreement">
              <div className="cb-legal-section-number">01</div>
              <h2>Agreement to these terms</h2>
              <p>
                These Terms &amp; Conditions ("Terms") apply to your use of
                codebell.online and services supplied by CodeBell ("CodeBell",
                "we", "our", or "us"). By using the website, accepting a quote
                or proposal, signing an agreement, or instructing us to begin
                work, you agree to the applicable Terms.
              </p>
              <p>
                You confirm that you are at least 18 and have authority to bind
                the person or organisation you represent. If you do not agree,
                do not use the website or engage our services.
              </p>
            </section>

            <section id="services">
              <div className="cb-legal-section-number">02</div>
              <h2>Services and proposals</h2>
              <p>
                CodeBell provides services such as website and application
                development, business systems, UI/UX design, e-commerce,
                automation, technical support, and related consulting. The exact
                scope, deliverables, assumptions, exclusions, price, and schedule
                for a project will be set out in a quote, proposal, statement of
                work, or other written agreement.
              </p>
              <p>
                Unless stated otherwise, estimates are based on the information
                available when issued and may change if requirements or
                assumptions change. A proposal remains open only for the
                acceptance period shown in it.
              </p>
            </section>

            <section id="responsibilities">
              <div className="cb-legal-section-number">03</div>
              <h2>Client responsibilities</h2>
              <p>You agree to:</p>
              <ul>
                <li>provide accurate requirements, content, access, and feedback;</li>
                <li>appoint an authorised contact who can make project decisions;</li>
                <li>review work and respond within agreed timeframes;</li>
                <li>
                  ensure materials you provide are lawful and do not infringe
                  another person’s rights;
                </li>
                <li>maintain backups and credentials under your control; and</li>
                <li>pay all undisputed fees when due.</li>
              </ul>
              <p>
                Delayed decisions, content, access, or feedback may affect
                delivery dates and cost. You remain responsible for the accuracy,
                legality, and completeness of your business content and data.
              </p>
            </section>

            <section id="fees">
              <div className="cb-legal-section-number">04</div>
              <h2>Fees and payment</h2>
              <p>
                Fees, deposits, milestones, currency, and payment dates are
                specified in the relevant proposal or invoice. Unless stated
                otherwise, fees exclude taxes, banking charges, domains, hosting,
                paid software, licences, and other third-party costs.
              </p>
              <p>
                Deposits and payments for work already performed are
                non-refundable except where required by law or expressly agreed
                in writing. We may pause work or withhold delivery after giving
                notice if an undisputed payment is overdue. You are responsible
                for reasonable costs caused by chargebacks or failed payments.
              </p>
            </section>

            <section id="delivery">
              <div className="cb-legal-section-number">05</div>
              <h2>Timelines and changes</h2>
              <p>
                Project dates are good-faith estimates unless expressly agreed
                as fixed deadlines. A request outside the agreed scope may
                require a written change, revised fee, and updated timeline. We
                will not be responsible for delays caused by missing client
                inputs, third parties, events outside our reasonable control, or
                approved scope changes.
              </p>
            </section>

            <section id="acceptance">
              <div className="cb-legal-section-number">06</div>
              <h2>Review and acceptance</h2>
              <p>
                You must review deliverables within the review period stated in
                the project agreement and report material non-conformities with
                enough detail for us to reproduce them. We will use reasonable
                efforts to correct verified issues within the agreed scope.
                Deliverables are accepted when approved in writing, used in
                production, or treated as accepted under the project agreement.
              </p>
              <p>
                New features, preference changes, and issues introduced by
                client or third-party modifications are not defects and may be
                quoted separately.
              </p>
            </section>

            <section id="ownership">
              <div className="cb-legal-section-number">07</div>
              <h2>Intellectual property</h2>
              <p>
                Each party keeps ownership of materials, tools, code, methods,
                trademarks, and intellectual property it owned or developed
                independently before the project. After full payment, you receive
                the ownership or licence rights to final deliverables expressly
                described in the project agreement.
              </p>
              <p>
                CodeBell retains ownership of reusable know-how, development
                tools, generic components, templates, and pre-existing materials.
                Where these are embedded in a deliverable, we grant you a
                non-exclusive licence to use them as necessary to use that
                deliverable. Open-source and third-party materials remain subject
                to their respective licences.
              </p>
              <p>
                We will not publicly identify you or display your project as
                portfolio work without permission or another contractual basis.
              </p>
            </section>

            <section id="third-parties">
              <div className="cb-legal-section-number">08</div>
              <h2>Third-party services</h2>
              <p>
                A project may rely on hosting platforms, domains, APIs, payment
                gateways, plugins, app stores, AI services, or other third-party
                products. Their terms, pricing, availability, security, and
                changes are controlled by those providers. Unless we expressly
                agree otherwise, you are responsible for maintaining required
                accounts, licences, and fees after handover.
              </p>
            </section>

            <section id="confidentiality">
              <div className="cb-legal-section-number">09</div>
              <h2>Confidentiality</h2>
              <p>
                Each party will use reasonable care to protect non-public
                information disclosed for a project and will use it only for the
                engagement. This does not cover information that is public
                through no breach, already lawfully known, independently
                developed, or lawfully received from another source. Disclosure
                may be made when legally required, where permitted after
                reasonable notice to the other party.
              </p>
            </section>

            <section id="warranties">
              <div className="cb-legal-section-number">10</div>
              <h2>Warranties and liability</h2>
              <p>
                We will perform agreed services with reasonable care and skill.
                Except for express commitments in a signed agreement and rights
                that cannot legally be excluded, the website and services are
                provided without additional warranties. We do not guarantee
                uninterrupted operation, specific commercial results, search
                rankings, or the continued availability of third-party services.
              </p>
              <p>
                To the maximum extent permitted by law, neither party is liable
                for indirect, incidental, special, punitive, or consequential
                loss, or for lost profit, revenue, data, or business opportunity.
                CodeBell’s total aggregate liability arising from an engagement
                will not exceed the fees paid to CodeBell for the service giving
                rise to the claim during the six months before the event. These
                limits do not apply where liability cannot lawfully be limited.
              </p>
            </section>

            <section id="termination">
              <div className="cb-legal-section-number">11</div>
              <h2>Suspension and termination</h2>
              <p>
                Either party may terminate an engagement as allowed by its
                project agreement. We may suspend or terminate services after
                notice if you materially breach an agreement, fail to pay an
                undisputed amount, misuse the services, or ask us to perform
                unlawful work. On termination, you must pay for completed work,
                committed third-party costs, and approved work in progress.
              </p>
              <p>
                Terms concerning payment, confidentiality, ownership, liability,
                and dispute resolution continue where their nature requires it.
              </p>
            </section>

            <section id="general">
              <div className="cb-legal-section-number">12</div>
              <h2>General terms</h2>
              <p>
                Neither party is liable for delay caused by circumstances beyond
                its reasonable control. You may not assign an engagement without
                our written consent, except as part of a genuine business sale or
                reorganisation. If a provision is unenforceable, the remaining
                provisions continue in effect. A failure to enforce a right is
                not a waiver of that right.
              </p>
              <p>
                These Terms and the applicable project documents form the entire
                agreement about their subject matter. Electronic approvals and
                signatures may be relied upon. Unless a signed agreement states
                otherwise, these Terms are governed by the laws of Sri Lanka and
                disputes are subject to the courts of Sri Lanka.
              </p>
              <p>
                We may update the website Terms from time to time. Changes apply
                from the updated effective date and do not retroactively change
                a signed project agreement unless both parties agree.
              </p>
            </section>

            <section id="contact">
              <div className="cb-legal-section-number">13</div>
              <h2>Contact us</h2>
              <p>
                Questions about these Terms can be sent to CodeBell in Colombo,
                Sri Lanka.
              </p>
              <a className="cb-legal-contact" href="mailto:info@codebell.online">
                <Mail size={20} aria-hidden="true" />
                <span>
                  <small>Email</small>
                  info@codebell.online
                </span>
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </section>

            <div className="cb-legal-next">
              <span>Related legal document</span>
              <Link to="/privacy-policy">
                Read our Privacy Policy
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
