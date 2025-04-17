import React from "react";

// Updated variant mapping to DaisyUI classes
const variantMap: Record<string, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary", // Assuming default gray is secondary
  success: "btn-success",
  danger: "btn-error", // DaisyUI uses 'error' for danger
  warning: "btn-warning",
  info: "btn-info",
};

// Updated size mapping to DaisyUI classes
const sizeMap: Record<string, string> = {
  sm: "btn-sm",
  md: "btn-md", // DaisyUI default size might not need explicit class, but good for clarity
  lg: "btn-lg",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | keyof typeof variantMap
    | "ghost"
    | "link"
    | "outline"
    | "accent"
    | "neutral"; // Added more DaisyUI variants
  size?: keyof typeof sizeMap | "xs"; // Added xs size
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean; // DaisyUI uses btn-block for full width
  shape?: "circle" | "square"; // DaisyUI shapes
  active?: boolean; // DaisyUI active state
  ghost?: boolean; // DaisyUI ghost style
  link?: boolean; // DaisyUI link style
  outline?: boolean; // DaisyUI outline style
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  shape,
  active = false,
  ghost = false,
  link = false,
  outline = false,
  className = "",
  disabled,
  children,
  ...props
}) => {
  // Base DaisyUI button class
  const baseClasses = "btn";

  // Map props to DaisyUI classes
  const variantClass =
    variantMap[variant] ||
    (variant === "accent"
      ? "btn-accent"
      : variant === "neutral"
        ? "btn-neutral"
        : "");
  const sizeClass = sizeMap[size] || (size === "xs" ? "btn-xs" : "");
  const widthClass = fullWidth ? "btn-block" : "";
  const shapeClass = shape ? `btn-${shape}` : "";
  const activeClass = active ? "btn-active" : "";
  const ghostClass = ghost ? "btn-ghost" : "";
  const linkClass = link ? "btn-link" : "";
  const outlineClass = outline ? "btn-outline" : "";

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    shapeClass,
    activeClass,
    ghostClass,
    linkClass,
    outlineClass,
    className, // Allow custom classes
  ]
    .filter(Boolean) // Remove empty strings
    .join(" ");

  const isDisabled = disabled || isLoading;

  return (
    <button className={combinedClasses} disabled={isDisabled} {...props}>
      {isLoading && <span className="loading loading-spinner"></span>}
      {!isLoading && leftIcon && (
        <span className={children ? "mr-2" : ""}>{leftIcon}</span>
      )}
      {!isLoading && children}
      {!isLoading && rightIcon && (
        <span className={children ? "ml-2" : ""}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
