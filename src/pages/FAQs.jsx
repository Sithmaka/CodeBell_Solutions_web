import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/faqs.css";

const faqs = [
  {
    question: "What services does CodeBell provide?",
    answer: "CodeBell provides custom software, ERP/CRM/HRMS systems, AI and workflow automation, websites and e-commerce, mobile applications, integrations, analytics, maintenance, and technical support.",
  },
  {
    question: "Can CodeBell work with an existing system?",
    answer: "Yes. We can review an existing website, application, workflow, or integration and recommend whether improvement, integration, staged replacement, or ongoing maintenance is the most practical next step.",
  },
  {
    question: "How does a new project begin?",
    answer: "It begins with a review of the business problem, affected users, current process, required outcome, constraints, and service fit. Suitable projects then move into discovery before scope, timing, or price is confirmed.",
  },
  {
    question: "How long does a software project take?",
    answer: "Timing depends on scope, integrations, data migration, approvals, testing, and release requirements. CodeBell provides a project-specific plan after discovery rather than promising a standard timeline before the work is understood.",
  },
  {
    question: "Can I request support for an existing CodeBell project?",
    answer: "Yes. Existing clients can use the Support page for incidents, change requests, access questions, and general project support. New project enquiries should use the Contact page.",
  },
  {
    question: "What information should I include in an enquiry?",
    answer: "Describe the current problem, who it affects, the outcome you want, the relevant service, and any useful timing or system context. Do not submit passwords, payment-card data, government identifiers, health information, or other sensitive data.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <Helmet>
        <title>Software Development FAQs | CodeBell</title>
        <meta name="description" content="Answers about CodeBell software services, project discovery, timelines, existing-system work, support, and what to include in an enquiry." />
        <meta property="og:title" content="Software Development FAQs | CodeBell" />
        <meta property="og:description" content="Understand CodeBell services, discovery, project planning, support, and enquiry requirements." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.codebell.online/faqs" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://www.codebell.online/faqs" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Navbar />
      <main className="cb-faq-page">
        <section className="cb-faq-section" aria-labelledby="faq-heading">
          <div className="cb-faq-container">
            <div className="cb-faq-header">
              <p className="cb-faq-eyebrow">Before you enquire</p>
              <h1 id="faq-heading"><span>F</span>requently <span>A</span>sked <span>Q</span>uestions</h1>
              <p>Clear answers about services, discovery, delivery, and support.</p>
            </div>
            <div className="cb-faq-list">
              {faqs.map((faq, index) => {
                const expanded = activeIndex === index;
                const buttonId = `faq-question-${index}`;
                const answerId = `faq-answer-${index}`;
                return (
                  <article className={`cb-faq-item ${expanded ? "active" : ""}`} key={faq.question}>
                    <h2>
                      <button type="button" id={buttonId} className="cb-faq-question" aria-expanded={expanded} aria-controls={answerId} onClick={() => setActiveIndex((current) => (index === current ? null : index))}>
                        <span>{faq.question}</span>
                        <ChevronDown size={20} aria-hidden="true" />
                      </button>
                    </h2>
                    <div id={answerId} className="cb-faq-answer" role="region" aria-labelledby={buttonId} hidden={!expanded}>
                      <p>{faq.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
