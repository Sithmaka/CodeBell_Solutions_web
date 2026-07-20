import { Helmet } from "react-helmet-async";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/legal.css";

const sections = [
  ["overview", "Overview"],
  ["information", "Information we collect"],
  ["use", "How we use information"],
  ["sharing", "When we share information"],
  ["retention", "Data retention"],
  ["security", "Security"],
  ["rights", "Your choices and rights"],
  ["international", "International transfers"],
  ["children", "Children’s privacy"],
  ["changes", "Changes to this policy"],
  ["contact", "Contact us"],
];

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | CodeBell</title>
        <meta
          name="description"
          content="Learn how CodeBell collects, uses, protects, and manages personal information when you use our website and services."
        />
        <meta property="og:title" content="Privacy Policy | CodeBell" />
        <meta
          property="og:description"
          content="How CodeBell handles personal information across our website and services."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.codebell.online/privacy-policy"
        />
        <link
          rel="canonical"
          href="https://www.codebell.online/privacy-policy"
        />
      </Helmet>

      <Navbar />

      <main className="cb-legal-page">

        <header className="cb-legal-hero">
          <div className="cb-legal-shell">
            <div className="cb-legal-eyebrow">
              <ShieldCheck size={16} aria-hidden="true" />
              Legal &amp; privacy
            </div>
            <h1>
              Privacy <span>Policy.</span>
            </h1>
            <p className="cb-legal-summary">
              This policy explains what information CodeBell collects, why we
              use it, and the choices you have when you visit our website or
              work with us.
            </p>
            <div className="cb-legal-meta">
              <span>Effective July 20, 2026</span>
              <span>Last updated July 20, 2026</span>
            </div>
          </div>
        </header>

        <div className="cb-legal-shell cb-legal-layout">
          <aside className="cb-legal-toc" aria-label="Privacy policy contents">
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
            <section id="overview">
              <div className="cb-legal-section-number">01</div>
              <h2>Overview</h2>
              <p>
                CodeBell ("CodeBell", "we", "our", or "us") is a digital
                engineering business based in Colombo, Sri Lanka. This Privacy
                Policy applies to information collected through codebell.online,
                our inquiry tools, and our communications with prospective and
                current clients.
              </p>
              <p>
                By using our website, you acknowledge the practices described
                here. If you submit information on behalf of another person,
                you confirm that you are authorised to do so.
              </p>
            </section>

            <section id="information">
              <div className="cb-legal-section-number">02</div>
              <h2>Information we collect</h2>
              <p>We may collect the following categories of information:</p>
              <ul>
                <li>
                  <strong>Contact details:</strong> name, email address, phone
                  number, company name, and preferred contact method.
                </li>
                <li>
                  <strong>Project information:</strong> requirements, budgets,
                  timelines, business needs, files, and other details you choose
                  to provide through forms, chat, WhatsApp, email, or calls.
                </li>
                <li>
                  <strong>Technical information:</strong> IP address, browser
                  type, device information, referring page, and basic website
                  activity that may be recorded by our hosting and security
                  providers.
                </li>
                <li>
                  <strong>Business records:</strong> proposals, agreements,
                  invoices, payment status, support requests, and project
                  communications.
                </li>
              </ul>
              <p>
                Please do not send passwords, payment-card details, government
                identifiers, health information, or other sensitive data unless
                we specifically request it through an appropriate secure method.
              </p>
            </section>

            <section id="use">
              <div className="cb-legal-section-number">03</div>
              <h2>How we use information</h2>
              <p>We use information where needed to:</p>
              <ul>
                <li>respond to inquiries and prepare proposals or estimates;</li>
                <li>deliver, manage, support, and improve our services;</li>
                <li>communicate about projects, accounts, and service updates;</li>
                <li>secure our website and prevent misuse or fraud;</li>
                <li>maintain business, tax, and contractual records; and</li>
                <li>comply with legal obligations or establish legal claims.</li>
              </ul>
              <p>
                Depending on the context, we rely on your consent, steps taken
                at your request before entering a contract, performance of a
                contract, our legitimate business interests, or applicable
                legal obligations. We do not sell your personal information.
              </p>
            </section>

            <section id="sharing">
              <div className="cb-legal-section-number">04</div>
              <h2>When we share information</h2>
              <p>
                We disclose information only when reasonably necessary. This
                may include trusted hosting, cloud, communication, payment,
                security, and professional-service providers acting for us.
                When you choose to send an inquiry through WhatsApp, your
                information is also handled by WhatsApp under its own terms and
                privacy policy.
              </p>
              <p>
                We may also disclose information if required by law, to protect
                a person’s safety or our rights, in connection with a business
                reorganisation, or when you direct or consent to the disclosure.
                We expect service providers to use information only for the
                services they provide to us.
              </p>
            </section>

            <section id="retention">
              <div className="cb-legal-section-number">05</div>
              <h2>Data retention</h2>
              <p>
                We keep personal information only as long as reasonably needed
                for the purpose for which it was collected, including project
                delivery, support, recordkeeping, dispute resolution, and legal
                compliance. Retention periods vary by the type of record and our
                relationship with you. When information is no longer required,
                we delete, anonymise, or securely isolate it where practicable.
              </p>
            </section>

            <section id="security">
              <div className="cb-legal-section-number">06</div>
              <h2>Security</h2>
              <p>
                We use reasonable administrative, technical, and organisational
                safeguards designed to protect personal information. However,
                no internet transmission or storage system is completely secure,
                so we cannot guarantee absolute security. Contact us promptly if
                you believe information you shared with us has been compromised.
              </p>
            </section>

            <section id="rights">
              <div className="cb-legal-section-number">07</div>
              <h2>Your choices and rights</h2>
              <p>
                Subject to applicable law, you may ask us to access, correct,
                delete, restrict, or provide a copy of your personal information.
                You may also object to certain processing or withdraw consent
                where consent is the basis for processing. Withdrawal does not
                affect processing already completed lawfully.
              </p>
              <p>
                To make a request, email us using the address below. We may need
                to verify your identity before responding. You may also complain
                to the relevant data-protection authority where that right is
                available to you.
              </p>
            </section>

            <section id="international">
              <div className="cb-legal-section-number">08</div>
              <h2>International transfers</h2>
              <p>
                Some service providers may process information in countries
                other than your own. Where required, we use appropriate
                contractual or other safeguards for these transfers. Local laws
                in those countries may differ from the laws where you live.
              </p>
            </section>

            <section id="children">
              <div className="cb-legal-section-number">09</div>
              <h2>Children’s privacy</h2>
              <p>
                Our website and services are intended for businesses and are not
                directed to children under 18. We do not knowingly collect
                personal information from children. If you believe a child has
                provided information to us, please contact us so we can review
                and remove it where appropriate.
              </p>
            </section>

            <section id="changes">
              <div className="cb-legal-section-number">10</div>
              <h2>Changes to this policy</h2>
              <p>
                We may update this policy as our services or legal obligations
                change. The revised version will be posted here with a new
                effective date. Material changes may also be communicated by
                another reasonable method where required.
              </p>
            </section>

            <section id="contact">
              <div className="cb-legal-section-number">11</div>
              <h2>Contact us</h2>
              <p>
                Questions or privacy requests can be sent to CodeBell in Colombo,
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
              <Link to="/terms-and-conditions">
                Read our Terms &amp; Conditions
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
