/**
 * ExplanationPanel Component
 * ===========================
 * Reusable panel that displays plain-English educational content.
 * Renders markdown-like bold text (**text**).
 */

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export default function ExplanationPanel({ title, content, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Simple markdown bold rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-surface-200 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-bio-400 flex-shrink-0" />
          <span className="font-semibold text-surface-200 text-sm">{title}</span>
        </div>
        {isOpen
          ? <ChevronUp className="w-5 h-5 text-surface-500" />
          : <ChevronDown className="w-5 h-5 text-surface-500" />
        }
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-0 animate-fade-in">
          <div className="pl-8 text-sm text-surface-400 leading-relaxed whitespace-pre-line">
            {renderContent(content)}
          </div>
        </div>
      )}
    </div>
  );
}
