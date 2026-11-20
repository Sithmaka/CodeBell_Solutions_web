import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/not-found.css";

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found | CodeBell</title><meta name="robots" content="noindex,follow" /></Helmet>
      <Navbar />
      <main className="cb-not-found">
        <div>
          <p>404</p>
          <h1>This page could not be found.</h1>
          <span>The address may have changed, or the page may no longer exist.</span>
          <div className="cb-not-found-actions"><Link to="/">Return home</Link><Link to="/contact">Discuss a project</Link></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
