/**
 * AminoAcidChain Component
 * =========================
 * Visual bead-chain representation of the polypeptide.
 */

import { useState } from 'react';
import type { CodonDetail } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';

interface Props {
  codons: CodonDetail[];
}

type DisplayMode = 'letter' | 'abbreviation' | 'full';

export default function AminoAcidChain({ codons }: Props) {
  const [mode, setMode] = useState<DisplayMode>('abbreviation');

  // Filter out stop codons from the chain display
  const aminoAcids = codons.filter(c => c.letter !== '*');

  const getDisplay = (c: CodonDetail) => {
    switch (mode) {
      case 'letter': return c.letter;
      case 'abbreviation': return c.abbreviation;
      case 'full': return c.amino_acid;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-surface-300">Polypeptide Chain</h4>
          <div className="flex gap-1 bg-surface-900/50 rounded-lg p-0.5">
            {(['letter', 'abbreviation', 'full'] as DisplayMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  mode === m
                    ? 'bg-dna-500 text-white shadow'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {m === 'letter' ? '1-Letter' : m === 'abbreviation' ? '3-Letter' : 'Full Name'}
              </button>
            ))}
          </div>
        </div>

        {/* Chain visualization */}
        <div className="flex flex-wrap items-center gap-1 p-4 bg-surface-900/50 rounded-xl">
          {aminoAcids.map((aa, i) => (
            <div key={i} className="flex items-center">
              <div
                className="px-2 py-1 rounded-lg bg-gradient-to-b from-bio-500/20 to-bio-600/10 
                           border border-bio-500/30 text-bio-300 font-mono text-xs font-semibold
                           hover:scale-110 hover:bg-bio-500/30 transition-all cursor-default"
                title={`Position ${i + 1}: ${aa.amino_acid} (${aa.abbreviation}) — Codon: ${aa.codon}`}
              >
                {getDisplay(aa)}
              </div>
              {i < aminoAcids.length - 1 && (
                <span className="text-surface-600 mx-0.5 text-xs">—</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-surface-500 mt-3">
          Hover over each amino acid to see its full name, abbreviation, and codon.
          The chain reads from left (N-terminus) to right (C-terminus).
        </p>
      </div>

      <ExplanationPanel
        title="What is a Polypeptide Chain?"
        content={`A **polypeptide chain** is a sequence of amino acids linked together by **peptide bonds**. Each amino acid is added one at a time by the ribosome during translation.

**Amino acids** are the building blocks of proteins. There are 20 standard amino acids, each with unique chemical properties:
• **Nonpolar** amino acids (e.g., Alanine, Valine) tend to be found in the interior of proteins
• **Polar** amino acids (e.g., Serine, Threonine) can form hydrogen bonds with water
• **Charged** amino acids (e.g., Lysine, Glutamic acid) carry positive or negative charges

The polypeptide chain folds into a specific 3D shape determined by its amino acid sequence. This shape is critical for the protein's function. The sequence shown is the **primary structure** — the linear order of amino acids from the N-terminus (start) to the C-terminus (end).`}
      />
    </div>
  );
}
