import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const wasOpen = useRef(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;
    let focusFrame;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...(sidebarRef.current?.querySelectorAll("a[href], button:not([disabled])") || [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (wasOpen.current) {
      focusFrame = requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
    wasOpen.current = menuOpen;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (focusFrame) cancelAnimationFrame(focusFrame);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="cb-navbar">
        <div className="cb-navbar-container">
          <Link to="/" className="cb-brand-logo cb-navbar-logo" onClick={closeMenu}>
            <img src="/codebell-dark.png" alt="CodeBell home" width="1248" height="505" />
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
              to="/portfolio"
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              Portfolio
            </NavLink>

            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              FAQs
            </NavLink>

            <NavLink
              to="/support"
              className={({ isActive }) =>
                isActive ? "cb-nav-link active" : "cb-nav-link"
              }
            >
              Support
            </NavLink>
          </nav>

          <div className="cb-navbar-actions">
            <Link to="/contact" className="cb-quote-btn" data-cta-id="nav_quote" data-consultation="true">
              Get a Quote
            </Link>

            <button
              ref={menuButtonRef}
              className={`cb-menu-toggle ${menuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="cb-mobile-navigation"
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
        aria-hidden="true"
      ></div>

      <aside
        ref={sidebarRef}
        id="cb-mobile-navigation"
        className={`cb-mobile-sidebar ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="cb-mobile-sidebar-top">
          <Link to="/" className="cb-brand-logo cb-navbar-logo" onClick={closeMenu}>
            <img src="/codebell-dark.png" alt="CodeBell home" width="1248" height="505" />
          </Link>

          <button
            ref={closeButtonRef}
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
            to="/portfolio"
            className={({ isActive }) =>
              isActive ? "cb-mobile-link active" : "cb-mobile-link"
            }
            onClick={closeMenu}
          >
            Portfolio
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

          <NavLink
            to="/support"
            className={({ isActive }) =>
              isActive ? "cb-mobile-link active" : "cb-mobile-link"
            }
            onClick={closeMenu}
          >
            Support
          </NavLink>
        </nav>

        <Link to="/contact" className="cb-mobile-quote-btn" onClick={closeMenu} data-cta-id="mobile_nav_quote" data-consultation="true">
          Get a Quote
        </Link>
      </aside>
    </>
  );
}
