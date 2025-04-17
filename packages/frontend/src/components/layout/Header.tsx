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
    <div className="navbar bg-primary text-primary-content shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          {title}
        </Link>
      </div>

      {showNavigation && (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sessions">Sessions</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
