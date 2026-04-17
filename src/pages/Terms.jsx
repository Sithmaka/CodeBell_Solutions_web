import { Helmet } from "react-helmet-async";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/legal.css";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | CodeBell</title>
      </Helmet>

      <Navbar />

      <main className="cb-legal-page">
        <div className="cb-legal-container">
          <h1>Terms & Conditions</h1>
          <p className="cb-legal-updated">Last Updated: 2026</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using CodeBell services, you agree to be bound by
              these terms.
            </p>
          </section>

          <section>
            <h2>2. Services</h2>
            <p>
              CodeBell provides web development, software solutions, and digital
              services tailored to client requirements.
            </p>
          </section>

          <section>
            <h2>3. Client Responsibilities</h2>
            <ul>
              <li>Provide accurate project information</li>
              <li>Respond to communication in a timely manner</li>
              <li>Make payments as agreed</li>
            </ul>
          </section>

          <section>
            <h2>4. Payments</h2>
            <p>
              Payments must be made according to agreed milestones. Failure to
              pay may result in project suspension.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              Upon full payment, ownership of the final deliverables will be
              transferred to the client unless otherwise agreed.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              CodeBell is not liable for indirect or consequential damages
              arising from use of our services.
            </p>
          </section>

          <section>
            <h2>7. Termination</h2>
            <p>
              We reserve the right to terminate services if terms are violated.
            </p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              Email: <strong>info@codebell.online</strong>
              <br />
              Phone: <strong>+94704416217</strong>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}