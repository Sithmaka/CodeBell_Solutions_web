import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="cb-navbar">
        <div className="cb-navbar-container">
            <Link to="/" className="cb-navbar-logo" onClick={closeMenu}>
                <img src="/codebell.png" alt="CodeBell Logo" />
            </Link>

          <nav className="cb-navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              About
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              FAQs
            </NavLink>
          </nav>

          <div className="cb-navbar-actions">
            <Link to="/contact" className="cb-quote-btn">
              Get a Quote
            </Link>

            <button
              className={`cb-menu-toggle ${menuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`cb-mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      ></div>

      <aside className={`cb-mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="cb-mobile-sidebar-top">
            <Link to="/" className="cb-navbar-logo" onClick={closeMenu}>
                <img src="/codebell.png" alt="CodeBell Logo" />
            </Link>

          <button
            className="cb-close-btn"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            type="button"
          >
            ×
          </button>
        </div>

        <nav className="cb-mobile-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "cb-mobile-link active" : "cb-mobile-link"
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "cb-mobile-link active" : "cb-mobile-link"
            }
            onClick={closeMenu}
          >
            About
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? "cb-mobile-link active" : "cb-mobile-link"
            }
            onClick={closeMenu}
          >
            Services
          </NavLink>

          <NavLink
            to="/faqs"
            className={({ isActive }) =>
              isActive ? "cb-mobile-link active" : "cb-mobile-link"
            }
            onClick={closeMenu}
          >
            FAQs
          </NavLink>
        </nav>

        <Link to="/contact" className="cb-mobile-quote-btn" onClick={closeMenu}>
          Get a Quote
        </Link>
      </aside>
    </>
  );
}