import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Monitor,
  Smartphone,
  Database,
  Rocket,
  Code2,
  Workflow,
  Network,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ParticleNetwork from "../components/visuals/ParticleNetwork";
import { MotionCard, MotionSection, MotionStagger } from "../components/motion/MotionPrimitives";
import "../styles/home.css";

const logoModules = import.meta.glob("../assets/clients/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
});

const clientLogos = Object.values(logoModules);

const services = [
  {
    id: "custom_software",
    icon: <Monitor size={42} strokeWidth={2.2} />,
    title: "Web Applications",
    description:
      "Purpose-built applications for workflows, customer experiences, and operational tools.",
  },
  {
    id: "mobile_app",
    icon: <Smartphone size={42} strokeWidth={2.2} />,
    title: "Mobile Apps",
    description:
      "Mobile products planned around user tasks, platform requirements, and maintainable delivery.",
  },
  {
    id: "erp_crm_hrms",
    icon: <Database size={42} strokeWidth={2.2} />,
    title: "Business Systems",
    description:
      "Role-based systems for operations, customer relationships, people, approvals, and reporting.",
  },
  {
    id: "ai_automation",
    icon: <Rocket size={42} strokeWidth={2.2} />,
    title: "AI & Automation",
    description:
      "Workflow and AI-assisted automation designed with clear human controls and integration boundaries.",
    wide: true,
  },
  {
    id: "website_ecommerce",
    icon: <Code2 size={42} strokeWidth={2.2} />,
    title: "Website Development",
    description:
      "Accessible websites and e-commerce experiences built around content, trust, and conversion paths.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    text: "Understand the problem, users, constraints, and desired outcome.",
  },
  {
    number: "02",
    title: "Design",
    text: "Define the solution, user journeys, and delivery approach.",
  },
  {
    number: "03",
    title: "Development",
    text: "Build in visible, reviewable stages.",
  },
  {
    number: "04",
    title: "Testing",
    text: "Check functionality, usability, and release risks.",
  },
  {
    number: "05",
    title: "Launch",
    text: "Release with a clear handover and support path.",
  },
];

const foundationPoints = [
  {
    icon: <Workflow size={22} strokeWidth={1.8} />,
    title: "Processes first",
    text: "We begin with the work, people, constraints, and result the business needs.",
  },
  {
    icon: <Network size={22} strokeWidth={1.8} />,
    title: "Connected by design",
    text: "Interfaces, data, roles, and integrations are planned as one operating system.",
  },
  {
    icon: <RefreshCw size={22} strokeWidth={1.8} />,
    title: "Built to evolve",
    text: "Clear architecture and delivery stages make the product easier to support and improve.",
  },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Custom Software &amp; Business Systems | CodeBell</title>
        <meta
          name="description"
          content="CodeBell develops custom software, ERP/CRM/HRMS systems, automation, websites, e-commerce, mobile apps, integrations, and maintenance."
        />
        <meta
          name="keywords"
          content="CodeBell, web applications, mobile apps, business systems, AI automation, website development"
        />
        <meta property="og:title" content="Custom Software & Business Systems | CodeBell" />
        <meta
          property="og:description"
          content="Software and digital systems designed around the way your business needs to work."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/" />
        <link rel="canonical" href="https://www.codebell.online/" />
      </Helmet>

      <Navbar />

      <main className="cb-home">
        <section className="cb-hero">
        <ParticleNetwork />
        <div className="cb-container">
            <div className="cb-hero-layout">
            <div className="cb-hero-content">
                <p className="cb-layout-eyebrow">BUILD · AUTOMATE · SCALE</p>
                <h1>
                Software that makes your business{" "}
                <br />
                <span>easier to run.</span>
                </h1>

                <p>
                CodeBell designs and develops custom software, business systems,
                automation, websites, and mobile products around real operational
                problems and measurable outcomes.
                </p>

                <div className="cb-hero-actions">
                <Link to="/services" className="cb-primary-btn" data-cta-id="home_hero_services">
                    Explore Services
                </Link>
                <Link to="/contact" className="cb-secondary-btn" data-cta-id="home_hero_contact" data-consultation="true">
                    Discuss a Project
                </Link>
                </div>
                <div className="cb-hero-engine" aria-hidden="true">
                  <span><Code2 size={21} strokeWidth={1.7} /></span>
                </div>
                <div className="cb-hero-capabilities" aria-label="Core capabilities">
                  <span>Web applications</span>
                  <span>Business systems</span>
                  <span>AI automation</span>
                </div>
            </div>

            </div>
        </div>
        </section>

        <MotionSection className="cb-clients-strip">
        <div className="cb-container">
            <div className="cb-clients-marquee">
            <div className="cb-clients-track">
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                <div className="cb-client-logo-card" key={index}>
                    <img
                    src={logo}
                    alt=""
                    className="cb-client-logo"
                    loading="lazy"
                    />
                </div>
                ))}
            </div>
            </div>
        </div>
        </MotionSection>

        <MotionSection className="cb-home-intro-section" aria-labelledby="home-intro-heading">
          <div className="cb-container">
            <div className="cb-home-intro-copy">
              <span className="cb-layout-eyebrow">INTRODUCTION</span>
              <h2 id="home-intro-heading">Digital systems built around the work.</h2>
              <p>
                CodeBell turns defined business problems into practical software,
                connected systems, and digital experiences that teams can operate and improve.
              </p>
            </div>
            <MotionStagger className="cb-home-intro-grid">
              {foundationPoints.map((point) => (
                <MotionCard className="cb-home-intro-card" key={point.title}>
                  <div className="cb-home-intro-icon">{point.icon}</div>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                </MotionCard>
              ))}
            </MotionStagger>
          </div>
        </MotionSection>

        <MotionSection className="cb-process-section">
          <div className="cb-container">
            <div className="cb-process-header">
              <span className="cb-layout-eyebrow">CHOOSE · BUILD · LAUNCH · IMPROVE</span>
              <h2>How it works</h2>
            </div>

            <MotionStagger className="cb-process-grid">
              {processSteps.map((step, index) => (
                <MotionCard as="div" className="cb-process-item" key={index}>
                  <span className="cb-process-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </MotionCard>
              ))}
            </MotionStagger>
          </div>
        </MotionSection>

        <MotionSection className="cb-services-section">
          <div className="cb-container">
            <div className="cb-section-header">
              <div><span className="cb-layout-eyebrow">CAPABILITIES</span><h2>What we provide</h2></div>
              <p>Choose the capability that best matches the problem you need to solve.</p>
            </div>

            <MotionStagger className="cb-services-grid">
              {services.map((service, index) => (
                <MotionCard
                  key={index}
                  className={`cb-service-card ${service.wide ? "wide" : ""}`}
                  data-service={service.id}
                >
                  <span className="cb-card-index">{String(index + 1).padStart(2, "0")}</span>
                  <div className="cb-service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </MotionCard>
              ))}
            </MotionStagger>
            <div className="cb-home-services-action">
              <Link to="/services">Explore all capabilities <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </MotionSection>

        <MotionSection className="cb-cta-section">
          <div className="cb-container">
            <div className="cb-cta-box">
              <h2>
                Let’s build your next digital
                <br />
                solution.
              </h2>
              <Link to="/contact" className="cb-primary-btn" data-cta-id="home_final_project" data-consultation="true">
                Start a Project
              </Link>
            </div>
          </div>
        </MotionSection>
      </main>

      <Footer />
    </>
  );
}
