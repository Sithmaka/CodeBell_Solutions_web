import { useMemo, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "../../styles/chatbot.css";

const SERVICES = [
  "Website Development",
  "Web App Development",
  "Mobile App Development",
  "Business Systems",
  "AI & Automation",
  "UI/UX Design",
  "E-commerce",
];

const SERVICE_QUESTIONS = {
  "Website Development": [
    {
      key: "companyName",
      label: "Company Name & Tagline",
      question:
        "What is your official company name and tagline you want displayed on the website?",
    },
    {
      key: "companyIdentity",
      label: "Company Identity",
      question:
        "Briefly describe your company history and identity. How should the website reflect this?",
    },
    {
      key: "branding",
      label: "Branding Assets",
      question:
        "Do you already have a logo, brand colors, or brand guidelines we should follow?",
    },
    {
      key: "highlights",
      label: "Values / Achievements",
      question:
        "Are there specific values, certifications, achievements, or trust points that should be highlighted?",
    },
    {
      key: "services",
      label: "Core Services",
      question: "What core services do you provide?",
    },
    {
      key: "specialPages",
      label: "Special Pages",
      question:
        "Do you want pages for special services, campaigns, portfolios, blogs, or case studies?",
    },
    {
      key: "pricing",
      label: "Pricing Visibility",
      question:
        "Do you want pricing, packages, or quotation details shown publicly on the website?",
    },
    {
      key: "audience",
      label: "Target Audience",
      question: "Who are your primary customers or ideal target audience?",
    },
    {
      key: "tone",
      label: "Content Tone",
      question:
        "Should the website tone feel corporate, premium, industrial, modern, or simple and friendly?",
    },
    {
      key: "contentSupport",
      label: "Content Support",
      question:
        "Will your team provide website content, or do you need support with copywriting and content planning?",
    },
    {
      key: "downloads",
      label: "Downloads / PDFs",
      question:
        "Do you need downloadable brochures, company profile PDFs, or catalogs on the website?",
    },
    {
      key: "legalPages",
      label: "Legal Pages",
      question:
        "Do you need legal pages like Privacy Policy, Terms & Conditions, Refund Policy, or similar?",
    },
    {
      key: "domainHosting",
      label: "Domain & Hosting",
      question:
        "Do you already have a domain and hosting, or do you need us to help with that too?",
    },
  ],

  "Web App Development": [
    {
      key: "businessType",
      label: "Business / Industry",
      question:
        "What type of business or industry is this web application for?",
    },
    {
      key: "appPurpose",
      label: "App Purpose",
      question:
        "What is the main purpose of the web app and what problem should it solve?",
    },
    {
      key: "users",
      label: "Users",
      question:
        "Who will use this system — admins, staff, customers, vendors, or multiple user roles?",
    },
    {
      key: "features",
      label: "Main Features",
      question:
        "What are the main features or modules you want in the web app?",
    },
    {
      key: "dashboards",
      label: "Dashboards / Roles",
      question:
        "Do you need dashboards, multiple user roles, permissions, or admin controls?",
    },
    {
      key: "integrations",
      label: "Integrations",
      question:
        "Do you need integration with payment gateways, APIs, Firebase, email, or other systems?",
    },
    {
      key: "dataHandling",
      label: "Data & Reports",
      question:
        "Will the app manage records, reports, analytics, exports, or real-time data?",
    },
    {
      key: "designStyle",
      label: "UI Style",
      question:
        "Should the design feel corporate, premium, dashboard-style, modern SaaS, or simple and clean?",
    },
    {
      key: "devices",
      label: "Device Usage",
      question:
        "Will this be used mainly on desktop, tablet, mobile browser, or all devices?",
    },
    {
      key: "security",
      label: "Security",
      question:
        "Do you need login, authentication, role-based access, audit logs, or high security?",
    },
    {
      key: "launchGoal",
      label: "Launch Goal",
      question:
        "Are you looking for an MVP first, or a full-featured production system from the beginning?",
    },
  ],

  "Mobile App Development": [
    {
      key: "appType",
      label: "App Type",
      question:
        "What kind of mobile app are you planning to build, and what is its main purpose?",
    },
    {
      key: "targetUsers",
      label: "Target Users",
      question:
        "Who are the primary users of the app and what will they mainly do inside it?",
    },
    {
      key: "platforms",
      label: "Platforms",
      question:
        "Do you want the app for Android, iPhone, or both platforms?",
    },
    {
      key: "features",
      label: "Main Features",
      question:
        "What core features do you need, such as login, chat, booking, payments, push notifications, or GPS?",
    },
    {
      key: "backend",
      label: "Backend Requirement",
      question:
        "Do you need a backend dashboard, admin panel, or database management system with the app?",
    },
    {
      key: "integrations",
      label: "Integrations",
      question:
        "Should the app connect with payment gateways, maps, social login, camera, or external APIs?",
    },
    {
      key: "offlineMode",
      label: "Offline Requirement",
      question:
        "Does the app need to work offline or in low-connectivity situations?",
    },
    {
      key: "designStyle",
      label: "UI Style",
      question:
        "Should the app design feel premium, corporate, minimal, playful, or user-friendly for general audiences?",
    },
    {
      key: "appStore",
      label: "App Publishing",
      question:
        "Do you need support for Play Store / App Store publishing as part of the project?",
    },
    {
      key: "futureGrowth",
      label: "Future Expansion",
      question:
        "Do you expect this app to grow later with more modules, subscriptions, or multiple user roles?",
    },
  ],

  "Business Systems": [
    {
      key: "systemType",
      label: "System Type",
      question:
        "What kind of business system do you need — ERP, CRM, HRM, inventory, POS, booking, or something custom?",
    },
    {
      key: "businessProcess",
      label: "Business Process",
      question:
        "What internal process or challenge do you want this system to improve or automate?",
    },
    {
      key: "departments",
      label: "Departments / Teams",
      question:
        "Which departments or teams will use the system?",
    },
    {
      key: "modules",
      label: "Required Modules",
      question:
        "What modules do you need, such as users, reports, finance, inventory, tasks, appointments, or documents?",
    },
    {
      key: "roles",
      label: "Roles & Permissions",
      question:
        "Do you need different user roles, permissions, approvals, or workflow stages?",
    },
    {
      key: "dataMigration",
      label: "Existing Data",
      question:
        "Do you already have data in Excel, paper records, or another system that needs to be migrated?",
    },
    {
      key: "reports",
      label: "Reports & Analytics",
      question:
        "What reports, charts, analytics, or exports should the system provide?",
    },
    {
      key: "locations",
      label: "Branches / Locations",
      question:
        "Will this system be used across multiple branches, teams, or locations?",
    },
    {
      key: "devices",
      label: "Usage Environment",
      question:
        "Will it be used on desktop only, mobile too, or as a PWA for field teams?",
    },
    {
      key: "integration",
      label: "System Integrations",
      question:
        "Do you need integration with accounting, email, WhatsApp, payment systems, or biometric devices?",
    },
  ],

  "AI & Automation": [
    {
      key: "useCase",
      label: "Use Case",
      question:
        "What specific AI or automation use case are you trying to solve?",
    },
    {
      key: "problem",
      label: "Business Problem",
      question:
        "What repetitive task, workflow bottleneck, or business challenge should the solution improve?",
    },
    {
      key: "dataSource",
      label: "Available Data",
      question:
        "Do you already have data, documents, spreadsheets, or chat history that the AI system should use?",
    },
    {
      key: "automationType",
      label: "Automation Type",
      question:
        "Do you need chatbots, AI recommendations, report generation, predictions, classification, or workflow automation?",
    },
    {
      key: "users",
      label: "Who Will Use It",
      question:
        "Who will use this AI solution — internal staff, customers, admins, or the public?",
    },
    {
      key: "integration",
      label: "Integration Need",
      question:
        "Should the AI system connect with your website, CRM, WhatsApp, email, dashboard, or internal system?",
    },
    {
      key: "accuracyNeeds",
      label: "Accuracy / Sensitivity",
      question:
        "How accurate or sensitive does the result need to be for your business process?",
    },
    {
      key: "humanReview",
      label: "Approval Flow",
      question:
        "Should AI suggestions be reviewed by a human before final action, or should the workflow be fully automated?",
    },
    {
      key: "deployment",
      label: "Deployment Preference",
      question:
        "Do you want this as a website feature, internal dashboard tool, API, or standalone system?",
    },
  ],

  "UI/UX Design": [
    {
      key: "projectType",
      label: "Project Type",
      question:
        "What are we designing — website, web app, mobile app, dashboard, or full product experience?",
    },
    {
      key: "goal",
      label: "Design Goal",
      question:
        "What is the main goal of the design — more conversions, better usability, premium branding, or product clarity?",
    },
    {
      key: "audience",
      label: "Target Users",
      question:
        "Who are the main users and what kind of experience should they have?",
    },
    {
      key: "style",
      label: "Preferred Style",
      question:
        "What style do you prefer — premium, minimal, bold, corporate, industrial, modern SaaS, or something else?",
    },
    {
      key: "references",
      label: "References",
      question:
        "Do you have reference websites, apps, screenshots, or brands you like?",
    },
    {
      key: "brandAssets",
      label: "Brand Assets",
      question:
        "Do you already have logo, colors, fonts, or brand guidelines?",
    },
    {
      key: "scope",
      label: "Scope",
      question:
        "Do you need wireframes only, UI design only, or full UX strategy with design system?",
    },
    {
      key: "deliverables",
      label: "Deliverables",
      question:
        "What deliverables do you expect — Figma files, design system, clickable prototype, or developer handoff?",
    },
  ],

  "E-commerce": [
    {
      key: "businessType",
      label: "Business Type",
      question:
        "What kind of business or store are you running, and what products do you sell?",
    },
    {
      key: "productRange",
      label: "Products / Categories",
      question:
        "What product categories or collections will be displayed?",
    },
    {
      key: "inventory",
      label: "Inventory Handling",
      question:
        "Do you need inventory management, stock alerts, product variations, or SKU tracking?",
    },
    {
      key: "checkout",
      label: "Checkout Flow",
      question:
        "Do you need a simple checkout or advanced checkout with shipping, coupons, and multiple payment methods?",
    },
    {
      key: "payments",
      label: "Payment Methods",
      question:
        "Which payment methods should be supported — card, bank transfer, COD, local gateways, or all?",
    },
    {
      key: "shipping",
      label: "Shipping / Delivery",
      question:
        "Do you need delivery zones, shipping rules, or order tracking?",
    },
    {
      key: "accounts",
      label: "Customer Accounts",
      question:
        "Should users create accounts, track orders, manage wishlists, or reorder products?",
    },
    {
      key: "marketing",
      label: "Marketing Features",
      question:
        "Do you need discount codes, abandoned cart recovery, product reviews, or email marketing integration?",
    },
    {
      key: "admin",
      label: "Admin Features",
      question:
        "Do you need an admin dashboard to manage products, orders, customers, and reports?",
    },
  ],
};

const COMMON_FINAL_QUESTIONS = [
  {
    key: "budget",
    label: "Budget",
    type: "options",
    options: [
      "Below LKR 100,000",
      "LKR 100,000 - 300,000",
      "LKR 300,000 - 700,000",
      "LKR 700,000+",
    ],
    question: "What is your approximate budget range for this project?",
  },
  {
    key: "timeline",
    label: "Timeline",
    type: "options",
    options: [
      "As soon as possible",
      "Within 2 weeks",
      "Within 1 month",
      "1 - 3 months",
      "Flexible",
    ],
    question: "What timeline are you aiming for?",
  },
  {
    key: "contact",
    label: "Contact Details",
    type: "text",
    question:
      "Please share your email address or phone number so our team can contact you.",
  },
];

function BotMessage({ children }) {
  return (
    <div className="cb-chat-message cb-chat-bot">
      <div className="cb-chat-bubble">{children}</div>
    </div>
  );
}

function UserMessage({ children }) {
  return (
    <div className="cb-chat-message cb-chat-user">
      <div className="cb-chat-bubble">{children}</div>
    </div>
  );
}

function OptionButtons({ options, onSelect }) {
  return (
    <div className="cb-chat-options">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="cb-chat-option-btn"
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [flowStarted, setFlowStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-2);
  const [selectedService, setSelectedService] = useState("");
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I’m CodeBell AI. I can guide you through your project requirement gathering.",
    },
    {
      sender: "bot",
      text: "What is your name?",
    },
  ]);

  const phoneNumber = "94704416217";

  const activeQuestions = selectedService
    ? [...(SERVICE_QUESTIONS[selectedService] || []), ...COMMON_FINAL_QUESTIONS]
    : [];

  const pushBot = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const pushUser = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const resetChat = () => {
    setInput("");
    setFlowStarted(false);
    setCurrentQuestionIndex(-2);
    setSelectedService("");
    setAnswers({});
    setMessages([
      {
        sender: "bot",
        text: "Hi, I’m CodeBell AI. I can guide you through your project requirement gathering.",
      },
      {
        sender: "bot",
        text: "What is your name?",
      },
    ]);
  };

  const summaryText = useMemo(() => {
    const serviceQuestions = selectedService
      ? [...(SERVICE_QUESTIONS[selectedService] || []), ...COMMON_FINAL_QUESTIONS]
      : [];

    const requirementText = serviceQuestions
      .map((q, index) => {
        const answer = answers[q.key] || "Not provided";
        return `${index + 1}. ${q.label}: ${answer}`;
      })
      .join("\n");

    return `Hello CodeBell, I would like to send a project inquiry.

Client Name: ${answers.name || "Not provided"}
Selected Service: ${selectedService || "Not selected"}

Requirement Details:
${requirementText}`;
  }, [answers, selectedService]);

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
  };

  const askNextQuestion = (nextIndex, serviceName = selectedService) => {
    const questionSet = [
      ...(SERVICE_QUESTIONS[serviceName] || []),
      ...COMMON_FINAL_QUESTIONS,
    ];

    if (nextIndex < questionSet.length) {
      setCurrentQuestionIndex(nextIndex);
      pushBot(questionSet[nextIndex].question);
    } else {
      setCurrentQuestionIndex(questionSet.length);
      pushBot(
        "Perfect. I’ve gathered your requirements. Please review the summary below and send it to WhatsApp."
      );
    }
  };

  const handleAnswer = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    pushUser(trimmed);
    setInput("");

    if (currentQuestionIndex === -2) {
      setAnswers((prev) => ({ ...prev, name: trimmed }));
      setFlowStarted(true);
      setCurrentQuestionIndex(-1);
      pushBot("What service are you looking for?");
      return;
    }

    if (currentQuestionIndex === -1) {
      setSelectedService(trimmed);
      askNextQuestion(0, trimmed);
      return;
    }

    if (currentQuestionIndex >= 0 && currentQuestionIndex < activeQuestions.length) {
      const activeQuestion = activeQuestions[currentQuestionIndex];

      setAnswers((prev) => ({
        ...prev,
        [activeQuestion.key]: trimmed,
      }));

      askNextQuestion(currentQuestionIndex + 1);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (currentQuestionIndex === activeQuestions.length) return;
    handleAnswer(input);
  };

  const showServiceOptions = currentQuestionIndex === -1;
  const currentQuestion =
    currentQuestionIndex >= 0 && currentQuestionIndex < activeQuestions.length
      ? activeQuestions[currentQuestionIndex]
      : null;

  const showQuestionOptions =
    currentQuestion &&
    currentQuestion.type === "options" &&
    Array.isArray(currentQuestion.options);

  const showSummary = currentQuestionIndex === activeQuestions.length;

  return (
    <>
      <button
        type="button"
        className="cb-chatbot-fab"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open chatbot"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="cb-chatbot-window">
          <div className="cb-chatbot-header">
            <div>
              <h3>CodeBell AI</h3>
              <p>Requirement Assistant</p>
            </div>
            <button
              type="button"
              className="cb-chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="cb-chatbot-body">
            {messages.map((message, index) =>
              message.sender === "bot" ? (
                <BotMessage key={index}>{message.text}</BotMessage>
              ) : (
                <UserMessage key={index}>{message.text}</UserMessage>
              )
            )}

            {showServiceOptions && (
              <OptionButtons options={SERVICES} onSelect={handleAnswer} />
            )}

            {showQuestionOptions && (
              <OptionButtons
                options={currentQuestion.options}
                onSelect={handleAnswer}
              />
            )}

            {showSummary && (
              <div className="cb-chat-summary">
                <h4>Inquiry Summary</h4>
                <ul>
                  <li>
                    <strong>Name:</strong> {answers.name || "Not provided"}
                  </li>
                  <li>
                    <strong>Service:</strong> {selectedService || "Not selected"}
                  </li>
                </ul>

                <h4 style={{ marginTop: 16 }}>Requirement Details</h4>
                <ul>
                  {activeQuestions.map((q, index) => (
                    <li key={q.key}>
                      <strong>
                        {index + 1}. {q.label}
                      </strong>
                      <br />
                      {answers[q.key] || "Not provided"}
                    </li>
                  ))}
                </ul>

                <div className="cb-chat-summary-actions">
                  <button
                    type="button"
                    className="cb-chat-send-btn"
                    onClick={openWhatsApp}
                  >
                    Send to WhatsApp
                  </button>
                  <button
                    type="button"
                    className="cb-chat-restart-btn"
                    onClick={resetChat}
                  >
                    Start Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {!showServiceOptions && !showQuestionOptions && !showSummary && (
            <form className="cb-chatbot-input" onSubmit={handleManualSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer..."
              />
              <button type="submit" aria-label="Send">
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}