/**
 * Header Component
 * ================
 * Top navigation bar with app branding and DNA helix icon.
 */

import { Dna } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-surface-800/50 backdrop-blur-md bg-surface-900/80 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-dna-500 to-bio-500 shadow-lg shadow-dna-500/20">
              <Dna className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">
                BioAnalyzer
              </h1>
              <p className="text-[10px] text-surface-500 tracking-wider uppercase">
                DNA & RNA Sequence Analyzer
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="badge badge-dna text-[10px]">v1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
