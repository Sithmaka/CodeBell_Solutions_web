import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Globe,
  LayoutGrid,
  Smartphone,
  ShoppingCart,
  BriefcaseBusiness,
  PencilRuler,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/services.css";

const services = [
  {
    icon: <Globe size={36} strokeWidth={2.2} />,
    title: "Website Dev",
    description:
      "High-performance, SEO-optimized marketing websites designed to convert visitors into clients.",
    features: [
      "Custom Design",
      "CMS Integration",
      "Performance Optimization",
    ],
  },
  {
    icon: <LayoutGrid size={36} strokeWidth={2.2} />,
    title: "Web App Dev",
    description:
      "Scalable, secure web applications tailored to your complex business processes.",
    features: [
      "React / Vue / Angular",
      "Robust APIs",
      "Scalable Architecture",
    ],
  },
  {
    icon: <Smartphone size={36} strokeWidth={2.2} />,
    title: "Mobile App Dev",
    description:
      "Native and cross-platform mobile experiences that engage users on the go.",
    features: [
      "iOS & Android",
      "React Native / Flutter",
      "Offline Capabilities",
    ],
  },
  {
    icon: <ShoppingCart size={36} strokeWidth={2.2} />,
    title: "E-commerce",
    description:
      "Powerful digital storefronts engineered for high conversion rates and seamless management.",
    features: [
      "Custom Checkout Flow",
      "Inventory Management",
      "Payment Gateway Integrations",
    ],
  },
  {
    icon: <BriefcaseBusiness size={36} strokeWidth={2.2} />,
    title: "Business Management",
    description:
      "Custom ERP and CRM solutions to streamline your internal operations.",
    features: [
      "Process Automation",
      "Data Visualization",
      "Secure Access Control",
    ],
  },
  {
    icon: <PencilRuler size={36} strokeWidth={2.2} />,
    title: "UI/UX",
    description:
      "Intuitive, user-centric interfaces that elevate brand perception and usability.",
    features: [
      "User Research",
      "Wireframing & Prototyping",
      "Design Systems",
    ],
  },
];

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Services | CodeBell</title>
        <meta
          name="description"
          content="Explore CodeBell services including website development, web app development, mobile apps, e-commerce, business management systems, and UI/UX."
        />
        <meta
          name="keywords"
          content="CodeBell services, website development, web app development, mobile app development, e-commerce, UI UX, ERP, CRM"
        />
        <meta property="og:title" content="Services | CodeBell" />
        <meta
          property="og:description"
          content="Our specialized tech solutions for modern enterprises."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/services" />
        <link rel="canonical" href="https://www.codebell.online/services" />
      </Helmet>

      <Navbar />

      <main className="cb-services-page">
        <section className="cb-services-hero">
          <div className="cb-services-container">
            <div className="cb-services-hero-content">
              <h1>
                Our Specialized Tech
                <br />
                Solutions
              </h1>

              <p>
                We architect scalable, high-performance systems for modern
                enterprises. From complex web applications to intelligent
                automation, we build the foundations of your digital future.
              </p>
            </div>
          </div>
        </section>

        <section className="cb-services-grid-section">
          <div className="cb-services-container">
            <div className="cb-service-grid">
              {services.map((service, index) => (
                <article className="cb-service-box" key={index}>
                  <div className="cb-service-box-icon">{service.icon}</div>

                  <h2>{service.title}</h2>
                  <p className="cb-service-box-description">{service.description}</p>

                  <ul className="cb-service-feature-list">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>

                  <Link to="/contact" className="cb-service-learn-more">
                    LEARN MORE <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cb-services-cta-section">
          <div className="cb-services-container">
            <div className="cb-services-cta-box">
              <div className="cb-services-cta-left">
                <h2>
                  Ready to scale your technical
                  <br />
                  infrastructure?
                </h2>
                <p>
                  Partner with us to build robust, future-proof solutions across
                  Finance, Healthcare, Retail, and Logistics.
                </p>
              </div>

              <div className="cb-services-cta-right">
                <Link to="/contact" className="cb-services-primary-btn">
                  Start a Project
                </Link>
                <Link to="/contact" className="cb-services-secondary-btn">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}