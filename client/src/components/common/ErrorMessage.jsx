import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorMessage = ({ message, onClose, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start justify-between gap-3 text-sm animate-in fade-in ${className}`}>
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
        <span className="font-medium text-xs leading-relaxed">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-700 transition-colors p-0.5 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
