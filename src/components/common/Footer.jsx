import { Link } from "react-router-dom";
import "../../styles/footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="cb-footer">
      <div className="cb-footer-container">
        <div className="cb-footer-top-line"></div>

        <div className="cb-footer-grid">
          <div className="cb-footer-brand">
            <h3>CodeBell</h3>
            <p>
              © {year} CodeBell. Built for the kinetic monolith. Premium digital
              systems engineered for modern businesses.
            </p>
          </div>

          <div className="cb-footer-column">
            <h4>Links</h4>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="cb-footer-column">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="cb-footer-column">
            <h4>Social</h4>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/company/codebelllk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CodeBell-Solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="cb-footer-bottom">
          <span>CodeBell</span>
          <span>Engineering digital foundations.</span>
        </div>
      </div>
    </footer>
  );
}