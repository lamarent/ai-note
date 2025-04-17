import React from "react";

interface FooterProps {
  showCopyright?: boolean;
}

const Footer: React.FC<FooterProps> = ({ showCopyright = true }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600">
        {showCopyright && <p>&copy; {year} AI Brainstorm</p>}
        <div className="mt-2 text-sm">
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors mr-4"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
