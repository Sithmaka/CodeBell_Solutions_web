import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/faqs.css";

const faqs = [
  {
    question: "What services does CodeBell offer?",
    answer:
      "CodeBell offers a comprehensive range of services including Generative AI Solutions, Custom Software Development, Data Analytics and Insights, Cloud Solutions, AI Integration and Automation, Consulting and Strategy, Training and Support.",
  },
  {
    question: "Can CodeBell customize solutions to fit my business needs?",
    answer:
      "Yes, absolutely. We tailor every solution to your specific business requirements, ensuring alignment with your workflows, goals, and long-term vision.",
  },
  {
    question: "How does CodeBell approach project management and communication?",
    answer:
      "We follow a collaborative approach with regular updates, structured milestones, and clear communication channels to ensure transparency and smooth delivery.",
  },
  {
    question: "What is the typical timeline for a project?",
    answer:
      "Timelines vary depending on project complexity, scope, and requirements. We always define clear timelines upfront and ensure timely delivery.",
  },
  {
    question: "How do I get started with CodeBell?",
    answer:
      "Simply contact us through the website or WhatsApp. We’ll schedule a consultation, understand your needs, and propose a tailored solution.",
  },
];

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>FAQs | CodeBell</title>
      </Helmet>

      <Navbar />

      <main className="cb-faq-page">
        <section className="cb-faq-section">
          <div className="cb-container">
            <div className="cb-faq-header">
              <h1>Frequently Asked Questions</h1>
            </div>

            <div className="cb-faq-list">
              {faqs.map((faq, index) => (
                <div
                  className={`cb-faq-item ${
                    activeIndex === index ? "active" : ""
                  }`}
                  key={index}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="cb-faq-question">
                    <span>{faq.question}</span>
                    <ChevronDown size={20} />
                  </div>

                  <div className="cb-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}