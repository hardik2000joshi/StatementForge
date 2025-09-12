import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant?: "default" | "outline";
}

export default function Button({children, className="", variant, ...props} : ButtonProps) {
    const baseStyles = 
    "px-4 py-2 rounded-lg shadow-sm transition-colors focus:outline-none";
    const variants = {
        default: "bg-slate-100 hover:bg-slate-200",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        destructive: "bg-red-500 hover:bg-red-600 text-white",
    };

    return (
        <button
        className={`${baseStyles} ${variant ? variants[variant] : ""} ${className}`}
        {...props}
        >
            {children}
        </button>
    );
}