/**
 * ProteinCard Component
 * =====================
 * Summary cards showing protein characterization results.
 */

import type { ProteinCharacterization } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';
import { Atom, Droplets, Scale, BarChart3 } from 'lucide-react';

interface Props {
  protein: ProteinCharacterization;
}

export default function ProteinCard({ protein }: Props) {
  const {
    length, molecular_weight, hydrophobicity_avg,
    charged_residues, polar_residues, nonpolar_residues,
    amino_acid_composition, explanation,
  } = protein;

  const totalResidues = charged_residues + polar_residues + nonpolar_residues;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-2">Protein Characterization</h3>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Scale className="w-5 h-5" />}
          label="Length"
          value={`${length} aa`}
          sub="amino acids"
          color="dna"
        />
        <StatCard
          icon={<Atom className="w-5 h-5" />}
          label="Molecular Weight"
          value={`${(molecular_weight / 1000).toFixed(1)} kDa`}
          sub={`${molecular_weight.toLocaleString()} Da`}
          color="bio"
        />
        <StatCard
          icon={<Droplets className="w-5 h-5" />}
          label="Hydrophobicity"
          value={hydrophobicity_avg.toFixed(2)}
          sub={hydrophobicity_avg > 0 ? 'Hydrophobic' : 'Hydrophilic'}
          color="rna"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Charged Residues"
          value={`${charged_residues}`}
          sub={`${((charged_residues / totalResidues) * 100).toFixed(1)}%`}
          color="dna"
        />
      </div>

      {/* Residue distribution */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-surface-300 mb-4">Residue Distribution</h4>
        <div className="space-y-3">
          <ProgressBar
            label="Nonpolar"
            count={nonpolar_residues}
            total={totalResidues}
            color="bg-amber-400"
          />
          <ProgressBar
            label="Polar"
            count={polar_residues}
            total={totalResidues}
            color="bg-sky-400"
          />
          <ProgressBar
            label="Charged"
            count={charged_residues}
            total={totalResidues}
            color="bg-rose-400"
          />
        </div>
      </div>

      {/* Amino acid composition */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-surface-300 mb-4">Amino Acid Composition</h4>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {Object.entries(amino_acid_composition).map(([aa, pct]) => (
            <div
              key={aa}
              className="text-center p-2 rounded-lg bg-surface-900/50 hover:bg-surface-800/50 transition-all"
              title={`${aa}: ${pct}%`}
            >
              <span className="text-sm font-bold text-bio-300">{aa}</span>
              <span className="block text-[10px] text-surface-500">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <ExplanationPanel title="Understanding Protein Properties" content={explanation} />
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: 'dna' | 'bio' | 'rna';
}) {
  const gradients = {
    dna: 'from-dna-500/20 to-dna-600/5 border-dna-500/20',
    bio: 'from-bio-500/20 to-bio-600/5 border-bio-500/20',
    rna: 'from-rna-500/20 to-rna-600/5 border-rna-500/20',
  };
  const iconColors = {
    dna: 'text-dna-400',
    bio: 'text-bio-400',
    rna: 'text-rna-400',
  };

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-br border ${gradients[color]}`}>
      <div className={`mb-2 ${iconColors[color]}`}>{icon}</div>
      <p className="text-xs text-surface-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-surface-200 mt-1">{value}</p>
      <p className="text-xs text-surface-500">{sub}</p>
    </div>
  );
}

function ProgressBar({ label, count, total, color }: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-surface-300">{label}</span>
        <span className="text-surface-500">{count} ({pct.toFixed(1)}%)</span>
      </div>
      <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
