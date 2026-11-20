import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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

const stats = [
  {
    icon: <Smile size={42} strokeWidth={2.1} />,
    number: "Discover",
    title: "Understand the problem",
    text: "before recommending a technical direction.",
  },
  {
    icon: <ClipboardList size={42} strokeWidth={2.1} />,
    number: "Deliver",
    title: "Work in clear stages",
    text: "with visible decisions, milestones, and testing.",
  },
  {
    icon: <Clock3 size={42} strokeWidth={2.1} />,
    number: "Improve",
    title: "Support what ships",
    text: "with practical maintenance and improvement options.",
  },
];

const principleCards = [
  {
    icon: <Lightbulb size={48} strokeWidth={2.1} />,
    title: "Purposeful Technology.",
    description:
      "We choose technology for fit, maintainability, security, and the outcome it needs to support.",
    large: true,
  },
  {
    icon: <BadgeCheck size={44} strokeWidth={2.1} />,
    title: "Quality Controls.",
    description:
      "Reviews, testing, and release checks are planned around the risks of each project.",
  },
  {
    icon: <Handshake size={44} strokeWidth={2.1} />,
    title: "Clear Communication.",
    description:
      "Decisions, assumptions, dependencies, and trade-offs should be visible to the people involved.",
  },
  {
    title: "Focused Delivery.",
    description:
      "We prioritize the work that directly supports the agreed users, workflow, and release outcome.",
    imageCard: true,
    wide: true,
  },
];

const advantageCards = [
  {
    icon: <ShieldCheck size={38} strokeWidth={2.1} />,
    title: "Practical Engineering",
    description:
      "We connect technical decisions to the people, process, constraints, and operating needs behind the project.",
  },
  {
    icon: <GitBranch size={38} strokeWidth={2.1} />,
    title: "End-to-End Execution",
    description:
      "A project can cover discovery, UI/UX, development, testing, launch, and an agreed improvement plan.",
  },
  {
    icon: <Headset size={38} strokeWidth={2.1} />,
    title: "Post-Launch Options",
    description:
      "Maintenance, change, and support needs can be planned around the system and operating context.",
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About CodeBell | Practical Software Engineering</title>
        <meta
          name="description"
          content="Learn how CodeBell approaches discovery, software delivery, quality, communication, launch, and post-launch improvement."
        />
        <meta
          name="keywords"
          content="About CodeBell, engineering agency, software architecture, digital solutions, web development company"
        />
        <meta
          property="og:title"
          content="About CodeBell | Practical Software Engineering"
        />
        <meta
          property="og:description"
          content="CodeBell designs software and digital systems around defined business problems and practical delivery plans."
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
                <p className="cb-layout-eyebrow">ABOUT CODEBELL</p>
                <h1>
                  Software built around
                  <br />
                  <span>real operations.</span>
                </h1>
              </div>

              <div className="cb-about-hero-right">
                <p>
                  CodeBell designs and develops software, business systems,
                  automation, websites, and mobile products around a defined
                  business problem and a practical delivery plan.
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
                <h2>Technology with a clear business purpose.</h2>
                <p>
                  We work from the current process, the people affected, the
                  constraints, and the result the business needs. From internal
                  tools to customer-facing platforms, the aim is to create a
                  solution that can be understood, operated, and improved after launch.
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
              <h2>Principles that guide the work.</h2>
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
                <Link to="/portfolio" className="cb-case-link">VIEW SELECTED WORK</Link>
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
