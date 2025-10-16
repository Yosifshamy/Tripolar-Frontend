import React, { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      placeholder,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      "w-full px-4 py-3 border bg-primary-rich-black text-secondary-white placeholder-gray-400 transition-colors duration-200 font-light tracking-wide focus:outline-none focus:ring-2",
      error
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-600 focus:ring-secondary-white focus:border-secondary-white",
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-primary-black tracking-wide">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          style={{ borderRadius: "5px" }} // Sharp edges
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400 font-light tracking-wide">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
