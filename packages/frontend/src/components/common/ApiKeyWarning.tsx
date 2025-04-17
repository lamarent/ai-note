import React from "react";
import { Link } from "react-router-dom";
import { useApiKey } from "../../hooks/useApiKey";

interface ApiKeyWarningProps {
  message?: string;
}

/**
 * Component to display when API key is missing.
 * This can be used in any component that needs API key access.
 */
const ApiKeyWarning: React.FC<ApiKeyWarningProps> = ({ message }) => {
  const { hasApiKey } = useApiKey();

  if (hasApiKey) {
    return null;
  }

  return (
    <div className="alert alert-warning shadow-lg mb-6">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 className="font-bold">API Key Required</h3>
          <div className="text-sm">
            {message || "AI features require an API key to work."}{" "}
            <Link to="/settings" className="font-semibold underline">
              Add your API key in Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarning;
