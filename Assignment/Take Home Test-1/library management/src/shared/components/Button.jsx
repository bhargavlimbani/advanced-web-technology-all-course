import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 active:scale-95",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 active:scale-95",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 active:scale-95"
  };

  return (
    <button className={`\${baseStyle} \${variants[variant]} \${className}`} {...props}>
      {children}
    </button>
  );
};
