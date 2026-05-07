/**
 * StrandSelector Component
 * ========================
 * Lets the user choose between coding (sense) and template (antisense) strand.
 * Only shown when the detected sequence is DNA.
 */

import { useState } from 'react';
import type { StrandType } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';

interface Props {
  onSelect: (type: StrandType) => void;
  loading: boolean;
}

export default function StrandSelector({ onSelect, loading }: Props) {
  const [selected, setSelected] = useState<StrandType | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-surface-200 mb-2">
          Which DNA Strand Is This?
        </h3>
        <p className="text-surface-400 max-w-xl mx-auto">
          DNA is double-stranded. The strand type determines how we transcribe it into mRNA.
          If you're unsure, <strong className="text-dna-300">coding strand</strong> is the most common choice.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Coding strand */}
        <button
          onClick={() => setSelected('coding')}
          className={`glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            selected === 'coding'
              ? 'ring-2 ring-dna-400 border-dna-500/50 shadow-xl shadow-dna-500/10'
              : 'hover:border-surface-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === 'coding' ? 'border-dna-400 bg-dna-500' : 'border-surface-600'
            }`}>
              {selected === 'coding' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <h4 className="text-lg font-bold text-dna-300">Coding Strand</h4>
          </div>
          <p className="text-sm text-surface-400 mb-3">
            Also called the <strong>sense</strong> or <strong>non-template</strong> strand.
          </p>
          <div className="p-3 rounded-lg bg-surface-900/50 text-xs">
            <p className="text-surface-500 mb-1">Transcription method:</p>
            <p className="font-mono text-dna-300">Replace T → U</p>
            <p className="text-surface-500 mt-2">
              The coding strand has the same sequence as the mRNA (except T↔U).
            </p>
          </div>
        </button>

        {/* Template strand */}
        <button
          onClick={() => setSelected('template')}
          className={`glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            selected === 'template'
              ? 'ring-2 ring-rna-400 border-rna-500/50 shadow-xl shadow-rna-500/10'
              : 'hover:border-surface-600'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected === 'template' ? 'border-rna-400 bg-rna-500' : 'border-surface-600'
            }`}>
              {selected === 'template' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <h4 className="text-lg font-bold text-rna-300">Template Strand</h4>
          </div>
          <p className="text-sm text-surface-400 mb-3">
            Also called the <strong>antisense</strong> strand.
          </p>
          <div className="p-3 rounded-lg bg-surface-900/50 text-xs">
            <p className="text-surface-500 mb-1">Transcription method:</p>
            <p className="font-mono text-rna-300">Complement: A→U, T→A, C→G, G→C</p>
            <p className="text-surface-500 mt-2">
              RNA polymerase reads this strand to build the mRNA.
            </p>
          </div>
        </button>
      </div>

      {selected && (
        <div className="flex justify-center animate-fade-in">
          <button
            onClick={() => onSelect(selected)}
            disabled={loading}
            className="btn-primary text-lg"
          >
            {loading ? 'Processing...' : 'Run Full Analysis →'}
          </button>
        </div>
      )}

      <ExplanationPanel
        title="Understanding DNA Strands"
        content={`DNA is a double-stranded molecule. The two strands are complementary — they run in opposite directions (antiparallel) and their bases pair up: A with T, and C with G.

**Coding (Sense) Strand:** This strand has the same base sequence as the mRNA that will be produced (except DNA uses thymine where RNA uses uracil). It's called "coding" because you can read the genetic code directly from it.

**Template (Antisense) Strand:** This is the strand that RNA polymerase actually reads during transcription. It reads the template strand in the 3'→5' direction and builds the complementary mRNA in the 5'→3' direction.

**If you're not sure:** Most sequences in databases and textbooks are written as the coding strand, so choose "Coding Strand" if unsure.`}
      />
    </div>
  );
}
