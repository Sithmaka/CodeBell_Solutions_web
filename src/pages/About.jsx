import { Helmet } from "react-helmet-async";
import {
  Lightbulb,
  BadgeCheck,
  Handshake,
  ShieldCheck,
  GitBranch,
  Headset,
  Compass,
  Eye,
  Smile,
  ClipboardList,
  Clock3,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/about.css";

const startYear = 2022;
const currentYear = new Date().getFullYear();
const yearsOfExperience = Math.max(currentYear - startYear, 1);

const stats = [
  {
    icon: <Smile size={42} strokeWidth={2.1} />,
    number: "150",
    title: "Happy Clients",
    text: "with a growing list of satisfied.",
  },
  {
    icon: <ClipboardList size={42} strokeWidth={2.1} />,
    number: "260",
    title: "Projects",
    text: "having successfully delivered.",
  },
  {
    icon: <Clock3 size={42} strokeWidth={2.1} />,
    number: String(yearsOfExperience),
    title: yearsOfExperience > 1 ? "Years of experience" : "Year of experience",
    text: "in the industry, our team brings a wealth of knowledge and a deep understanding of technology trends.",
  },
];

const principleCards = [
  {
    icon: <Lightbulb size={48} strokeWidth={2.1} />,
    title: "Calculated Innovation.",
    description:
      "We adopt bleeding-edge tech not for the sake of novelty, but when it mathematically improves performance and resilience.",
    large: true,
  },
  {
    icon: <BadgeCheck size={44} strokeWidth={2.1} />,
    title: "Absolute Quality.",
    description:
      "Our code is our craft. Every deployment must meet brutal standards.",
  },
  {
    icon: <Handshake size={44} strokeWidth={2.1} />,
    title: "Immutable Trust.",
    description:
      "Transparency in execution. No black boxes. Just results.",
  },
  {
    title: "Relentless Focus.",
    description:
      "We strip away the non-essential to concentrate entirely on the critical path to system performance.",
    imageCard: true,
    wide: true,
  },
];

const advantageCards = [
  {
    icon: <ShieldCheck size={38} strokeWidth={2.1} />,
    title: "Deep Experience",
    description:
      "Strong project delivery experience across websites, business systems, and scalable digital platforms.",
  },
  {
    icon: <GitBranch size={38} strokeWidth={2.1} />,
    title: "End-to-End Execution",
    description:
      "From discovery and UI/UX to development, testing, launch, and long-term optimization.",
  },
  {
    icon: <Headset size={38} strokeWidth={2.1} />,
    title: "Unwavering Support",
    description:
      "Continuous technical support, improvement cycles, and practical guidance after launch.",
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About CodeBell | Architects of Scale</title>
        <meta
          name="description"
          content="Learn about CodeBell, our mission, vision, values, and the engineering approach behind high-performance digital solutions."
        />
        <meta
          name="keywords"
          content="About CodeBell, engineering agency, software architecture, digital solutions, web development company"
        />
        <meta
          property="og:title"
          content="About CodeBell | Architects of Scale"
        />
        <meta
          property="og:description"
          content="CodeBell is an engineering agency dedicated to crafting high-performance, immovable technical foundations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/about" />
        <link rel="canonical" href="https://www.codebell.online/about" />
      </Helmet>

      <Navbar />

      <main className="cb-about-page">
        <section className="cb-about-hero">
          <div className="cb-about-container">
            <div className="cb-about-hero-grid">
              <div className="cb-about-hero-left">
                <h1>
                  Building the
                  <br />
                  <span>Monolith.</span>
                </h1>
              </div>

              <div className="cb-about-hero-right">
                <p>
                  CodeBell is an engineering agency dedicated to crafting
                  high-performance, immovable technical foundations for modern
                  businesses and ambitious digital growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cb-about-stats-section">
          <div className="cb-about-container">
            <div className="cb-about-stats-grid">
              {stats.map((item, index) => (
                <article className="cb-about-stat-card" key={index}>
                  <div className="cb-about-stat-top">
                    <div className="cb-about-stat-icon">{item.icon}</div>
                    <h3>{item.number}</h3>
                  </div>
                  <p>
                    <strong>{item.title}</strong> {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cb-overview-section">
          <div className="cb-about-container">
            <div className="cb-overview-grid">
              <div className="cb-overview-label">OVERVIEW &amp; PURPOSE</div>

              <div className="cb-overview-content">
                <h2>Architects of scale.</h2>
                <p>
                  We are not just developers; we are digital architects. Since
                  2022, CodeBell has been building resilient, scalable systems
                  for businesses that need performance, reliability, and long-term
                  technical value. From internal business tools to public-facing
                  digital platforms, our solutions are designed to handle growth
                  with confidence.
                </p>

                <div className="cb-about-tags">
                  <span>Web Development</span>
                  <span>Business Systems</span>
                  <span>Mobile Apps</span>
                  <span>Automation</span>
                </div>

                <div className="cb-mission-vision-grid">
                  <article className="cb-mv-card">
                    <div className="cb-mv-icon">
                      <Compass size={40} strokeWidth={2.1} />
                    </div>
                    <h3>Our Mission</h3>
                    <p>
                      To engineer software that acts as a reliable foundation
                      for our clients’ business growth, efficiency, and digital
                      transformation.
                    </p>
                  </article>

                  <article className="cb-mv-card">
                    <div className="cb-mv-icon">
                      <Eye size={40} strokeWidth={2.1} />
                    </div>
                    <h3>Our Vision</h3>
                    <p>
                      To become a trusted digital engineering partner known for
                      building practical, scalable, and high-impact technology
                      solutions.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cb-principles-section">
          <div className="cb-about-container">
            <div className="cb-section-title-center">
              <h2>Principles of the Monolith.</h2>
            </div>

            <div className="cb-principles-grid">
              {principleCards.map((item, index) => (
                <article
                  key={index}
                  className={`cb-principle-card ${item.large ? "large" : ""} ${
                    item.wide ? "wide" : ""
                  } ${item.imageCard ? "image-card" : ""}`}
                >
                  {!item.imageCard && (
                    <div className="cb-principle-icon">{item.icon}</div>
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cb-advantage-section">
          <div className="cb-about-container">
            <div className="cb-advantage-grid">
              <div className="cb-advantage-intro">
                <h2>
                  The CodeBell
                  <br />
                  Advantage.
                </h2>
                <p>
                  Why businesses trust us to build and improve their digital
                  foundation.
                </p>
                <a href="#!" className="cb-case-link">
                  VIEW CASE STUDIES
                </a>
              </div>

              {advantageCards.map((item, index) => (
                <article className="cb-advantage-card" key={index}>
                  <div className="cb-advantage-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}