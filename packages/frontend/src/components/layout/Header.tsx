import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = "AI Brainstorm",
  showNavigation = true,
}) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold hover:text-blue-100 transition-colors"
        >
          {title}
        </Link>

        {showNavigation && (
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-100 transition-colors font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/sessions"
                  className="hover:text-blue-100 transition-colors font-medium"
                >
                  Sessions
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
