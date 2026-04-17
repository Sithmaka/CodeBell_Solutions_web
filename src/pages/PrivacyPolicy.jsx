import { Helmet } from "react-helmet-async";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/legal.css";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | CodeBell</title>
      </Helmet>

      <Navbar />

      <main className="cb-legal-page">
        <div className="cb-legal-container">
          <h1>Privacy Policy</h1>
          <p className="cb-legal-updated">Last Updated: 2026</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              CodeBell ("we", "our", "us") respects your privacy and is committed
              to protecting your personal data. This policy explains how we
              collect, use, and safeguard your information.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Business and project details submitted via forms</li>
              <li>Usage data (browser, device, pages visited)</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To respond to inquiries and provide services</li>
              <li>To improve our website and offerings</li>
              <li>To communicate updates and proposals</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect your
              data from unauthorized access, disclosure, or misuse.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Services</h2>
            <p>
              We may use third-party tools such as analytics or communication
              platforms. These providers have their own privacy policies.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You may request access, correction, or deletion of your personal
              data by contacting us at:
              <br />
              <strong>info@codebell.online</strong>
            </p>
          </section>

          <section>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this policy periodically. Changes will be posted on
              this page.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}