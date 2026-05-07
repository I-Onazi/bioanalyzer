/**
 * Toast Notification Component
 */

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-bio-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-dna-400" />,
};

const bgColors = {
  success: 'border-bio-500/30 bg-bio-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-dna-500/30 bg-dna-500/10',
};

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${bgColors[type]}`}>
        {icons[type]}
        <p className="text-sm font-medium text-surface-200">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-surface-400 hover:text-surface-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
