/**
 * Footer Component
 */

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-800/50 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-surface-500 text-sm">
          <p>
            Built with <Heart className="w-4 h-4 inline text-rna-400 fill-rna-400" /> for Bioinformatics Education
          </p>
          <p className="text-xs">
            DNA & RNA Sequence Analyzer — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
