import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isFullWidth = true,
      className = "",
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = !!error;

    const baseInputClasses =
      "rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200";
    const errorClasses = hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300";
    const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "";
    const widthClasses = isFullWidth ? "w-full" : "";
    const paddingClasses = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "px-4";

    return (
      <div className={`${isFullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`${baseInputClasses} ${errorClasses} ${disabledClasses} ${widthClasses} ${paddingClasses} py-2`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {(hasError || helperText) && (
          <p
            className={`mt-1 text-sm ${hasError ? "text-red-600" : "text-gray-500"}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
