/**
 * TranscriptionView Component
 * ============================
 * Shows the transcription result: original → mRNA with step-by-step visualization.
 */

import type { TranscriptionResult } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';

interface Props {
  result: TranscriptionResult;
}

export default function TranscriptionView({ result }: Props) {
  const { original_sequence, mrna, steps, explanation, strand_type } = result;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-2">Transcription Result</h3>
        <p className="text-surface-400">
          {strand_type
            ? `Transcribed from the ${strand_type} strand`
            : 'RNA input — no transcription needed'}
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            Original {strand_type ? 'DNA' : 'RNA'}
          </h4>
          <div className="p-3 bg-surface-900/80 rounded-lg overflow-x-auto">
            <p className="sequence-text">
              {original_sequence.split('').map((base, i) => (
                <span key={i} className={`base-${base}`}>{base}</span>
              ))}
            </p>
          </div>
        </div>
        <div className="glass-card p-5">
          <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            mRNA
          </h4>
          <div className="p-3 bg-surface-900/80 rounded-lg overflow-x-auto">
            <p className="sequence-text">
              {mrna.split('').map((base, i) => (
                <span key={i} className={`base-${base}`}>{base}</span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-step */}
      <div className="glass-card p-6">
        <h4 className="text-sm font-semibold text-surface-300 mb-4">Step-by-Step Process</h4>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.step} className="flex gap-4">
              <div className="step-badge flex-shrink-0 mt-1">{step.step}</div>
              <div className="flex-1">
                <h5 className="font-semibold text-surface-200 mb-1">{step.title}</h5>
                <p className="text-sm text-surface-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExplanationPanel
        title="What is Transcription?"
        content={explanation}
      />
    </div>
  );
}
