import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isFullWidth?: boolean;
  variant?:
    | "bordered"
    | "ghost"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  inputSize?: "xs" | "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isFullWidth = true,
      className = "",
      disabled,
      id,
      variant = "bordered",
      inputSize = "md",
      ...props
    },
    ref
  ) => {
    const inputId =
      id ||
      (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const hasError = !!error;

    const inputClasses = [
      "input",
      variant !== "bordered" ? `input-${variant}` : "input-bordered",
      hasError ? "input-error" : "",
      inputSize !== "md" ? `input-${inputSize}` : "",
      isFullWidth ? "w-full" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={`form-control ${isFullWidth ? "w-full" : ""} ${className}`}
      >
        {label && (
          <label htmlFor={inputId} className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            hasError || helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {(hasError || helperText) && (
          <label className="label" id={`${inputId}-helper`}>
            <span className={`label-text-alt ${hasError ? "text-error" : ""}`}>
              {error || helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
