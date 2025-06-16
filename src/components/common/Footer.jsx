import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-branding">
          <h3>नाप-Jhok</h3>
          <p>Where every stitch fits your story.</p>
        </div>

        <div className="footer-minimal-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Naap-Jhok. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
