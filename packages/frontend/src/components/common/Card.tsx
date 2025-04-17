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
  bordered?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  imageFull?: boolean;
  compact?: boolean;
  side?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  className = "",
  bodyClassName = "",
  onClick,
  hoverable = false,
  bordered = true,
  imageSrc,
  imageAlt = "Card image",
  imageFull = false,
  compact = false,
  side = false,
}) => {
  const cardClasses = [
    "card",
    "bg-base-100",
    bordered ? "border border-base-300" : "shadow-xl",
    hoverable ? "hover:shadow-md transition-shadow" : "",
    compact ? "card-compact" : "",
    side ? "card-side" : "",
    onClick ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} onClick={onClick}>
      {imageSrc && (
        <figure className={imageFull ? "" : "px-10 pt-10"}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={imageFull ? "w-full" : "rounded-xl"}
          />
        </figure>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {title && <h2 className="card-title">{title}</h2>}
        {children}
        {footer && <div className="card-actions justify-end">{footer}</div>}
      </div>
    </div>
  );
};

export default Card;
