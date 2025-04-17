import React from "react";

interface FooterProps {
  showCopyright?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showCopyright = true }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content mt-auto">
      {showCopyright && (
        <aside>
          <p>&copy; {year} AI Brainstorm - All right reserved</p>
        </aside>
      )}
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="#" className="link link-hover">
            Terms of Service
          </a>
          <a href="#" className="link link-hover">
            Privacy Policy
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
