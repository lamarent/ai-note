import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-base-100 border-r border-gray-200 p-4 fixed left-0 top-0">
      <ul className="menu space-y-2">
        <li className="menu-title text-lg font-semibold mb-2">AI Brainstorm</li>
        <li>
          <Link to="/" className="menu-item">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/sessions" className="menu-item">
            Sessions
          </Link>
        </li>
        <li>
          <Link to="/settings" className="menu-item">
            Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
