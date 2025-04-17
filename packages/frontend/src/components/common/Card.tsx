import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
  onClick,
  hoverable = false,
}) => {
  const cardClasses = `bg-white shadow rounded-lg overflow-hidden ${
    hoverable ? "transition-shadow hover:shadow-md" : ""
  } ${onClick ? "cursor-pointer" : ""} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div
          className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}
        >
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div
          className={`px-4 py-3 bg-gray-50 border-t border-gray-200 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
