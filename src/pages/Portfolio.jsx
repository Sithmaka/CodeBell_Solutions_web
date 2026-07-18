import { Helmet } from "react-helmet-async";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/portfolio.css";

const projects = [
  {
    title: "Kanvisor",
    category: "Business Website",
    url: "https://kanvisor-website.vercel.app/",
  },
  {
    title: "CodeBell Business Systems",
    category: "Business Platform",
    url: "https://codebell.biz/",
  },
  {
    title: "Photographer Portfolio",
    category: "Creative Portfolio",
    url: "https://photographer-portfolio-drab.vercel.app/",
  },
  {
    title: "Valunova",
    category: "Business Website",
    url: "https://valunova-web.vercel.app/",
  },
  {
    title: "DT Store",
    category: "E-commerce Website",
    url: "https://dt-store-web.vercel.app/",
  },
  {
    title: "Events by RAW",
    category: "Events Website",
    url: "https://www.eventsbyraw.com/",
  },
  {
    title: "CANCHAM Sri Lanka",
    category: "Organization Website",
    url: "https://www.canchamlk.com/",
  },
  {
    title: "GrowFirst",
    category: "Business Website",
    url: "https://growfirst-website.vercel.app/",
  },
  {
    title: "RBM",
    category: "Corporate Website",
    url: "https://rbm-website-khaki.vercel.app/",
  },
  {
    title: "Aurelia Gems",
    category: "Jewellery Website",
    url: "https://aurelia-gems.vercel.app/",
  },
  {
    title: "Gem Sample",
    category: "Jewellery Website",
    url: "https://gem-sample-web.vercel.app/",
  },
  {
    title: "Gem Website",
    category: "Jewellery Website",
    url: "https://gem-website-eight.vercel.app/",
  },
  {
    title: "Villa Website",
    category: "Hospitality Website",
    url: "https://villa-website-gules.vercel.app/",
  },
  {
    title: "ServeSync",
    category: "Digital Platform",
    url: "https://servesync-web.vercel.app/",
  },
  {
    title: "Nexora Labs",
    category: "Technology Website",
    url: "https://nexoralabs-web.vercel.app/",
  },
  {
    title: "Rigor",
    category: "Business Website",
    url: "https://rigor-web.vercel.app/",
  },
  {
    title: "WizeSage",
    category: "Digital Platform",
    url: "https://wizesage-fe.vercel.app/",
  },
  {
    title: "NovaStack Lab",
    category: "Technology Website",
    url: "https://www.novastacklab.site/",
  },
];

const getHostname = (url) => new URL(url).hostname.replace("www.", "");

export default function Portfolio() {
  return (
    <>
      <Helmet>
        <title>Our Portfolio | CodeBell</title>
        <meta
          name="description"
          content="Explore websites, digital platforms, and business experiences designed and developed by CodeBell."
        />
        <meta property="og:title" content="Our Portfolio | CodeBell" />
        <meta
          property="og:description"
          content="A selection of digital experiences designed and developed by CodeBell."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/portfolio" />
        <link rel="canonical" href="https://www.codebell.online/portfolio" />
      </Helmet>

      <Navbar />

      <main className="cb-portfolio">
        <section className="cb-portfolio-hero">
          <div className="cb-portfolio-container">
            <span className="cb-portfolio-eyebrow">Selected work</span>
            <h1>
              Digital experiences built to <span>make an impact.</span>
            </h1>
            <p>
              A selection of websites and digital platforms we have designed and
              developed for ambitious brands and growing businesses.
            </p>
          </div>
        </section>

        <section className="cb-portfolio-work" aria-labelledby="portfolio-heading">
          <div className="cb-portfolio-container">
            <div className="cb-portfolio-section-heading">
              <div>
                <span>Featured projects</span>
                <h2 id="portfolio-heading">Explore our work</h2>
              </div>
              <p>{String(projects.length).padStart(2, "0")} live projects</p>
            </div>

            <div className="cb-portfolio-grid">
              {projects.map((project, index) => (
                <article className="cb-project-card" key={project.url}>
                  <a
                    className="cb-project-preview"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} website in a new tab`}
                  >
                    <div className="cb-browser-bar" aria-hidden="true">
                      <div className="cb-browser-dots">
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                      <div className="cb-browser-address">
                        <Globe2 size={13} />
                        <span>{getHostname(project.url)}</span>
                      </div>
                      <span className="cb-browser-spacer"></span>
                    </div>

                    <div className="cb-project-viewport">
                      <iframe
                        src={project.url}
                        title={`${project.title} website preview`}
                        loading="lazy"
                        tabIndex="-1"
                        aria-hidden="true"
                      />
                      <div className="cb-project-preview-overlay">
                        <span>
                          View live site <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </div>
                  </a>

                  <div className="cb-project-info">
                    <div>
                      <span className="cb-project-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p>{project.category}</p>
                      <h3>{project.title}</h3>
                    </div>
                    <a
                      className="cb-project-link"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ArrowUpRight size={22} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cb-portfolio-cta">
          <div className="cb-portfolio-container">
            <p>Have a project in mind?</p>
            <h2>Let’s create something exceptional.</h2>
            <Link to="/contact" className="cb-portfolio-cta-link">
              Start a project <ArrowUpRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
