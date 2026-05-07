/**
 * TranslationView Component
 * ==========================
 * Displays the codon-by-codon translation of mRNA to amino acids.
 */

import type { TranslationResult } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';

interface Props {
  result: TranslationResult;
}

// Color map for amino acid categories (simplified)
const aaColors: Record<string, string> = {
  M: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',  // Start
  '*': 'bg-red-500/20 border-red-500/40 text-red-300',            // Stop
  // Nonpolar
  A: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  V: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  I: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  L: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  F: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  W: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  P: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  G: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  // Polar
  S: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  T: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  C: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  Y: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  N: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  Q: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  // Charged
  K: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  R: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  H: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  D: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
  E: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
};

export default function TranslationView({ result }: Props) {
  const { codons, protein_sequence, start_position, has_stop_codon, explanation } = result;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-2">Translation Result</h3>
        <p className="text-surface-400">
          {codons.length} codons read • {protein_sequence.length} amino acids
          {has_stop_codon ? ' • Stop codon reached' : ' • No stop codon'}
        </p>
      </div>

      {/* Codon grid */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-surface-300 mb-4">Codon → Amino Acid Mapping</h4>
        <div className="flex flex-wrap gap-2">
          {codons.map((c, i) => (
            <div
              key={i}
              className={`flex flex-col items-center p-2 rounded-lg border transition-all hover:scale-105 ${
                aaColors[c.letter] || 'bg-surface-800/50 border-surface-700 text-surface-300'
              }`}
              title={`${c.codon} → ${c.amino_acid} (${c.abbreviation})`}
            >
              <span className="font-mono text-xs font-bold tracking-wider">{c.codon}</span>
              <span className="text-[10px] mt-0.5 opacity-70">{c.abbreviation}</span>
              <span className="text-lg font-bold">{c.letter}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-surface-700/50">
          <p className="text-xs text-surface-500 mb-2">Legend:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/30" /> Start (Met)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/30" /> Nonpolar</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sky-500/30" /> Polar</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500/30" /> + Charged</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-500/30" /> − Charged</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/30" /> Stop</span>
          </div>
        </div>
      </div>

      {/* Protein sequence summary */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-surface-300 mb-3">Protein Sequence (1-Letter Code)</h4>
        <div className="p-3 bg-surface-900/80 rounded-lg overflow-x-auto">
          <p className="font-mono text-sm tracking-wider text-bio-300 break-all">
            {protein_sequence}
          </p>
        </div>
        <p className="text-xs text-surface-500 mt-2">
          Start position in mRNA: {start_position + 1}
        </p>
      </div>

      <ExplanationPanel title="What is Translation?" content={explanation} />
    </div>
  );
}
