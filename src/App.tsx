/**
 * App.tsx — Root Application Component
 * =====================================
 * Orchestrates the full analysis pipeline as a step-by-step wizard.
 * Each step is shown sequentially: Input → Detection → Strand Select →
 * Transcription → Translation → Protein → Database Search.
 */

import { useState, useCallback, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SequenceInput from './components/input/SequenceInput';
import DetectionResult from './components/analysis/DetectionResult';
import StrandSelector from './components/analysis/StrandSelector';
import TranscriptionView from './components/analysis/TranscriptionView';
import TranslationView from './components/analysis/TranslationView';
import AminoAcidChain from './components/analysis/AminoAcidChain';
import ProteinCard from './components/analysis/ProteinCard';
import DatabaseSearch from './components/analysis/DatabaseSearch';
import ExplanationPanel from './components/education/ExplanationPanel';
import Toast from './components/ui/Toast';
import { submitSequence, uploadFile, runFullAnalysis, searchProtein } from './services/api';
import type {
  SequenceDetection,
  StrandType,
  FullAnalysis,
  AnalysisStep,
} from './types';

function App() {
  // ── State ──────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('input');
  const [detection, setDetection] = useState<SequenceDetection | null>(null);
  const [strandType, setStrandType] = useState<StrandType>('coding');
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbSearchLoading, setDbSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ── Handlers ───────────────────────────────────────────────────

  const handleSequenceSubmit = useCallback(async (sequence: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitSequence(sequence, 'paste');
      setDetection(result);
      setCurrentStep('detection');
      setToast({ message: `Sequence detected as ${result.seq_type}`, type: 'success' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to analyse sequence';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadFile(file);
      setDetection(result);
      setCurrentStep('detection');
      setToast({ message: `File parsed — ${result.seq_type} detected`, type: 'success' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to parse file';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProceedFromDetection = useCallback(() => {
    if (!detection) return;
    if (detection.seq_type === 'DNA') {
      setCurrentStep('strand-select');
    } else {
      // RNA — skip strand selection, run full analysis directly
      handleRunAnalysis('coding');
    }
  }, [detection]);

  const handleStrandSelect = useCallback((type: StrandType) => {
    setStrandType(type);
    handleRunAnalysis(type);
  }, []);

  const handleRunAnalysis = useCallback(async (strand: StrandType) => {
    if (!detection) return;
    setLoading(true);
    setError(null);
    try {
      const result = await runFullAnalysis(detection.cleaned_sequence, strand);
      setAnalysis(result);
      setCurrentStep('transcription');
      setToast({ message: 'Analysis complete!', type: 'success' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Analysis failed';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [detection]);

  const handleDatabaseSearch = useCallback(async () => {
    if (!analysis?.protein?.sequence) return;
    setDbSearchLoading(true);
    setError(null);
    try {
      const result = await searchProtein(analysis.protein.sequence);
      setAnalysis(prev => prev ? { ...prev, database_matches: result } : null);
      setToast({ message: `Found ${result.matches.length} matches!`, type: 'success' });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Database search failed';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setDbSearchLoading(false);
    }
  }, [analysis]);

  const handleReset = useCallback(() => {
    setCurrentStep('input');
    setDetection(null);
    setAnalysis(null);
    setStrandType('coding');
    setError(null);
  }, []);

  // ── Step progression ───────────────────────────────────────────
  const steps: { key: AnalysisStep; label: string; icon: string }[] = [
    { key: 'input', label: 'Input', icon: '1' },
    { key: 'detection', label: 'Detection', icon: '2' },
    { key: 'strand-select', label: 'Strand', icon: '3' },
    { key: 'transcription', label: 'Transcription', icon: '4' },
    { key: 'translation', label: 'Translation', icon: '5' },
    { key: 'protein', label: 'Protein', icon: '6' },
    { key: 'database', label: 'Database', icon: '7' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-helix flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, i) => {
              // Filter out strand-select for RNA
              if (step.key === 'strand-select' && detection?.seq_type === 'RNA') return null;
              const isActive = i === currentStepIndex;
              const isCompleted = i < currentStepIndex;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-bio-400 to-bio-600 text-white shadow-lg shadow-bio-500/30'
                          : isActive
                          ? 'bg-gradient-to-br from-dna-400 to-dna-600 text-white shadow-lg shadow-dna-500/30 scale-110'
                          : 'bg-surface-800 text-surface-300 border border-surface-700'
                      }`}
                    >
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-dna-400' : isCompleted ? 'text-bio-400' : 'text-surface-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mt-[-20px] transition-all duration-300 ${
                      isCompleted ? 'bg-bio-500' : 'bg-surface-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 animate-fade-in">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Step content */}
        <div className="animate-fade-in">
          {currentStep === 'input' && (
            <SequenceInput
              onSubmit={handleSequenceSubmit}
              onFileUpload={handleFileUpload}
              loading={loading}
            />
          )}

          {currentStep === 'detection' && detection && (
            <div className="space-y-6">
              <DetectionResult detection={detection} />
              {detection.is_valid && (
                <div className="flex justify-center">
                  <button onClick={handleProceedFromDetection} className="btn-primary text-lg">
                    Continue to {detection.seq_type === 'DNA' ? 'Strand Selection' : 'Analysis'} →
                  </button>
                </div>
              )}
              <div className="flex justify-center">
                <button onClick={handleReset} className="btn-secondary">
                  ← Start Over
                </button>
              </div>
            </div>
          )}

          {currentStep === 'strand-select' && detection?.seq_type === 'DNA' && (
            <StrandSelector
              onSelect={handleStrandSelect}
              loading={loading}
            />
          )}

          {currentStep === 'transcription' && analysis?.transcription && (
            <div className="space-y-6">
              <TranscriptionView result={analysis.transcription} />
              <div className="flex justify-center gap-4">
                <button onClick={() => setCurrentStep('translation')} className="btn-primary">
                  Continue to Translation →
                </button>
                <button onClick={handleReset} className="btn-secondary">← Start Over</button>
              </div>
            </div>
          )}

          {currentStep === 'translation' && analysis?.translation && (
            <div className="space-y-6">
              <TranslationView result={analysis.translation} />
              {analysis.translation.protein_sequence && (
                <AminoAcidChain
                  codons={analysis.translation.codons}
                  proteinSequence={analysis.translation.protein_sequence}
                />
              )}
              <div className="flex justify-center gap-4">
                {analysis.protein && (
                  <button onClick={() => setCurrentStep('protein')} className="btn-primary">
                    Continue to Protein Analysis →
                  </button>
                )}
                <button onClick={handleReset} className="btn-secondary">← Start Over</button>
              </div>
            </div>
          )}

          {currentStep === 'protein' && analysis?.protein && (
            <div className="space-y-6">
              <ProteinCard protein={analysis.protein} />
              <div className="flex justify-center gap-4">
                <button onClick={() => setCurrentStep('database')} className="btn-primary">
                  Continue to Database Search →
                </button>
                <button onClick={handleReset} className="btn-secondary">← Start Over</button>
              </div>
            </div>
          )}

          {currentStep === 'database' && (
            <div className="space-y-6">
              <DatabaseSearch
                result={analysis?.database_matches || null}
                loading={dbSearchLoading}
                onSearch={handleDatabaseSearch}
              />
              <div className="flex justify-center gap-4">
                <button onClick={handleReset} className="btn-secondary">← Start Over</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card p-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-dna-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-200 font-medium">Analysing sequence...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
