import { Loader2 } from 'lucide-react';

export const Button = ({ children, onClick, disabled, variant = 'primary', className = '', loading = false }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white disabled:hover:bg-indigo-600",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    outline: "border border-white/10 bg-gray-800 hover:bg-gray-700 text-white"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};