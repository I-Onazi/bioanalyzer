/**
 * DetectionResult Component
 * =========================
 * Displays the DNA/RNA/Invalid detection result with explanation.
 */

import { Dna, FlaskConical, AlertTriangle } from 'lucide-react';
import type { SequenceDetection } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';

interface Props {
  detection: SequenceDetection;
}

export default function DetectionResult({ detection }: Props) {
  const { seq_type, cleaned_sequence, length, explanation, is_valid } = detection;

  const typeConfig = {
    DNA: {
      icon: <Dna className="w-8 h-8" />,
      badge: 'badge-dna',
      gradient: 'from-dna-400 to-dna-600',
      glow: 'shadow-dna-500/30',
      label: 'DNA Detected',
      color: 'text-dna-300',
    },
    RNA: {
      icon: <FlaskConical className="w-8 h-8" />,
      badge: 'badge-rna',
      gradient: 'from-rna-400 to-rna-600',
      glow: 'shadow-rna-500/30',
      label: 'RNA Detected',
      color: 'text-rna-300',
    },
    INVALID: {
      icon: <AlertTriangle className="w-8 h-8" />,
      badge: 'badge-invalid',
      gradient: 'from-red-400 to-red-600',
      glow: 'shadow-red-500/30',
      label: 'Invalid Sequence',
      color: 'text-red-300',
    },
  };

  const config = typeConfig[seq_type];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Detection badge */}
      <div className="glass-card p-8 text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-xl ${config.glow} mb-4`}>
          <div className="text-white">{config.icon}</div>
        </div>
        <h3 className={`text-2xl font-bold ${config.color} mb-2`}>
          {config.label}
        </h3>
        <span className={`badge ${config.badge}`}>{seq_type}</span>
        <p className="text-surface-500 mt-2">{length} bases</p>
      </div>

      {/* Sequence preview */}
      {is_valid && (
        <div className="glass-card p-6">
          <h4 className="text-sm font-semibold text-surface-300 mb-3">Cleaned Sequence</h4>
          <div className="p-4 bg-surface-900/80 rounded-xl overflow-x-auto">
            <p className="sequence-text">
              {cleaned_sequence.split('').map((base, i) => (
                <span key={i} className={`base-${base}`}>{base}</span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* Explanation */}
      <ExplanationPanel
        title="How was this detected?"
        content={explanation}
      />
    </div>
  );
}
