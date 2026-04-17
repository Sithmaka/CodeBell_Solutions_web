import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Monitor,
  Smartphone,
  Database,
  Rocket,
  Code2,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/home.css";

const logoModules = import.meta.glob("../assets/clients/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
});

const clientLogos = Object.values(logoModules);

const services = [
  {
    icon: <Monitor size={42} strokeWidth={2.2} />,
    title: "Web Applications",
    description:
      "Scalable, high-performance web platforms built for complexity and speed.",
  },
  {
    icon: <Smartphone size={42} strokeWidth={2.2} />,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile experiences that command attention.",
  },
  {
    icon: <Database size={42} strokeWidth={2.2} />,
    title: "Business Systems",
    description:
      "Robust internal tools and ERP integrations designed for operational dominance.",
  },
  {
    icon: <Rocket size={42} strokeWidth={2.2} />,
    title: "AI & Automation",
    description:
      "Leveraging artificial intelligence to automate workflows and unlock predictive capabilities within your enterprise.",
    wide: true,
  },
  {
    icon: <Code2 size={42} strokeWidth={2.2} />,
    title: "Website Development",
    description:
      "High-converting, architecturally sound marketing sites.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Requirement",
    text: "Deep dive into technical needs.",
  },
  {
    number: "02",
    title: "Design",
    text: "Architecting the interface.",
  },
  {
    number: "03",
    title: "Development",
    text: "Writing kinetic code.",
  },
  {
    number: "04",
    title: "Testing",
    text: "Rigorous quality assurance.",
  },
  {
    number: "05",
    title: "Launch",
    text: "Deploying the solution.",
  },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>CodeBell | Home</title>
        <meta
          name="description"
          content="CodeBell builds authoritative digital solutions including web applications, mobile apps, business systems, AI automation, and websites."
        />
        <meta
          name="keywords"
          content="CodeBell, web applications, mobile apps, business systems, AI automation, website development"
        />
        <meta property="og:title" content="CodeBell | Home" />
        <meta
          property="og:description"
          content="We build authoritative digital solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebellsolutions.com/" />
        <link rel="canonical" href="https://www.codebellsolutions.com/" />
      </Helmet>

      <Navbar />

      <main className="cb-home">
        <section className="cb-hero">
        <div className="cb-container">
            <div className="cb-hero-layout">
            <div className="cb-hero-content">
                <h1>
                Empowering your businesses with
                <br />
                transformative digital solutions.
                </h1>

                <p>
                CodeBell engineers high-performance web applications, robust business
                systems, and cutting-edge mobile experiences. We deliver undeniable
                technical excellence.
                </p>

                <div className="cb-hero-actions">
                <Link to="/services" className="cb-primary-btn">
                    Get Started
                </Link>
                <Link to="/contact" className="cb-secondary-btn">
                    Contact Us
                </Link>
                </div>
            </div>

            <div className="cb-hero-visual">
                <div className="cb-tech-orb-wrap">
                <div className="cb-tech-glow"></div>

                <div className="cb-tech-ring cb-tech-ring-1"></div>
                <div className="cb-tech-ring cb-tech-ring-2"></div>
                <div className="cb-tech-ring cb-tech-ring-3"></div>

                <div className="cb-tech-core">
                    <div className="cb-tech-core-inner"></div>
                </div>

                <span className="cb-tech-node cb-node-1"></span>
                <span className="cb-tech-node cb-node-2"></span>
                <span className="cb-tech-node cb-node-3"></span>
                <span className="cb-tech-node cb-node-4"></span>
                <span className="cb-tech-node cb-node-5"></span>
                <span className="cb-tech-node cb-node-6"></span>

                <div className="cb-tech-grid"></div>
                </div>
            </div>
            </div>
        </div>
        </section>

        <section className="cb-clients-strip">
        <div className="cb-container">
            <div className="cb-clients-marquee">
            <div className="cb-clients-track">
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                <div className="cb-client-logo-card" key={index}>
                    <img
                    src={logo}
                    alt={`Client logo ${index + 1}`}
                    className="cb-client-logo"
                    loading="lazy"
                    />
                </div>
                ))}
            </div>
            </div>
        </div>
        </section>

        <section className="cb-services-section">
          <div className="cb-container">
            <div className="cb-section-header">
              <h2>Our Core Services</h2>
              <p>Engineering precision across the digital spectrum.</p>
            </div>

            <div className="cb-services-grid">
              {services.map((service, index) => (
                <article
                  key={index}
                  className={`cb-service-card ${service.wide ? "wide" : ""}`}
                >
                  <div className="cb-service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cb-process-section">
          <div className="cb-container">
            <div className="cb-process-header">
              <h2>The Monolith Process</h2>
            </div>

            <div className="cb-process-grid">
              {processSteps.map((step, index) => (
                <div className="cb-process-item" key={index}>
                  <span className="cb-process-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cb-cta-section">
          <div className="cb-container">
            <div className="cb-cta-box">
              <h2>
                Let’s build your next digital
                <br />
                solution.
              </h2>
              <Link to="/contact" className="cb-primary-btn">
                Start a Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}