import { Helmet } from "react-helmet-async";
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  ChevronDown,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/contact.css";

export default function Contact() {

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const company = e.target.company.value;
    const service = e.target.service.value;
    const message = e.target.message.value;

    const whatsappNumber = "94704416217";

    const text = `Hello CodeBell,%0A
Name: ${fullName}%0A
Email: ${email}%0A
Phone: ${phone}%0A
Company: ${company}%0A
Service: ${service}%0A
Message: ${message}`;

    const url = `https://wa.me/${whatsappNumber}?text=${text}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>Contact CodeBell | Get in Touch</title>
        <meta
          name="description"
          content="Contact CodeBell to discuss web development, business systems, mobile apps, UI/UX, and digital transformation projects."
        />
        <meta
          name="keywords"
          content="Contact CodeBell, web development inquiry, software company contact, business systems, mobile app development"
        />
        <meta property="og:title" content="Contact CodeBell | Get in Touch" />
        <meta
          property="og:description"
          content="Reach out to discuss your next monolithic transformation."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebellsolutions.com/contact" />
        <link rel="canonical" href="https://www.codebellsolutions.com/contact" />
      </Helmet>

      <Navbar />

      <main className="cb-contact-page">
        <section className="cb-contact-hero">
          <div className="cb-contact-container">
            <div className="cb-contact-hero-content">
              <h1>Get in Touch</h1>
              <p>
                We build scalable architectures for ambitious enterprises. Reach
                out to discuss your next monolithic transformation.
              </p>
            </div>
          </div>
        </section>

        <section className="cb-contact-main-section">
          <div className="cb-contact-container">
            <div className="cb-contact-main-grid">

              {/* FORM */}
              <div className="cb-contact-form-card">
                <form className="cb-contact-form" onSubmit={handleSubmit}>
                  <div className="cb-contact-form-grid">

                    <div className="cb-field-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input type="text" id="fullName" name="fullName" required />
                    </div>

                    <div className="cb-field-group">
                      <label htmlFor="email">Email Address</label>
                      <input type="email" id="email" name="email" required />
                    </div>

                    <div className="cb-field-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input type="text" id="phone" name="phone" />
                    </div>

                    <div className="cb-field-group">
                      <label htmlFor="company">Company</label>
                      <input type="text" id="company" name="company" />
                    </div>
                  </div>

                  <div className="cb-field-group cb-full-width">
                    <label htmlFor="service">Service Needed</label>
                    <div className="cb-select-wrap">
                      <select id="service" name="service" defaultValue="">
                        <option value="" disabled>Select a service...</option>
                        <option>Website Development</option>
                        <option>Web App Development</option>
                        <option>Mobile App Development</option>
                        <option>Business Systems</option>
                        <option>UI/UX Design</option>
                        <option>E-commerce</option>
                      </select>
                      <ChevronDown size={18} />
                    </div>
                  </div>

                  <div className="cb-field-group cb-full-width">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="6"></textarea>
                  </div>

                  <button type="submit" className="cb-contact-submit-btn">
                    SEND VIA WHATSAPP
                  </button>
                </form>
              </div>

              {/* SIDEBAR */}
              <aside className="cb-contact-sidebar">
                <div className="cb-contact-info-block">
                  <h2>Direct Contact</h2>

                  <div className="cb-contact-info-list">

                    <div className="cb-contact-info-item">
                      <Mail size={18} />
                      <div>
                        <span>EMAIL</span>
                        <p>info@codebellsolutions.com</p>
                      </div>
                    </div>

                    <div className="cb-contact-info-item">
                      <Phone size={18} />
                      <div>
                        <span>PHONE</span>
                        <p>+94 70 441 6217</p>
                      </div>
                    </div>

                    <div className="cb-contact-info-item">
                      <MessageSquare size={18} />
                      <div>
                        <span>WHATSAPP</span>
                        <p>+94 70 441 6217</p>
                      </div>
                    </div>

                    <div className="cb-contact-info-item">
                      <MapPin size={18} />
                      <div>
                        <span>HEADQUARTERS</span>
                        <p>
                          Colombo, Sri Lanka
                          <br />
                          Remote-First Service
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Keep your hours unchanged */}
                <div className="cb-hours-block">
                  <h2>Operating Hours</h2>

                  <div className="cb-hours-list">
                    <div className="cb-hours-row">
                      <span>Monday - Friday</span>
                      <strong>08:00 - 18:00</strong>
                    </div>

                    <div className="cb-hours-row">
                      <span>Saturday - Sunday</span>
                      <strong className="cb-hours-highlight">
                        WhatsApp Support Only
                      </strong>
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </section>

        <section className="cb-contact-banner-section">
          <div className="cb-contact-container">
            <div className="cb-contact-banner">
              <div className="cb-contact-banner-placeholder">
                Safe
                <br />
                Work
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}