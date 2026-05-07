/**
 * SequenceInput Component
 * =======================
 * Combined textarea + file upload + drag-and-drop input system.
 */

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Clipboard, Trash2, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (sequence: string) => void;
  onFileUpload: (file: File) => void;
  loading: boolean;
}

export default function SequenceInput({ onSubmit, onFileUpload, loading }: Props) {
  const [sequence, setSequence] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSequence(text);
    } catch {
      // Clipboard API not available
    }
  }, []);

  // File upload
  const handleFile = useCallback((file: File) => {
    const validTypes = ['.txt', '.fasta', '.fa', '.fna'];
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    if (!validTypes.includes(ext)) {
      alert('Please upload a .txt or .fasta file');
      return;
    }
    setFileName(file.name);
    onFileUpload(file);
  }, [onFileUpload]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = useCallback(() => {
    if (sequence.trim()) {
      onSubmit(sequence.trim());
    }
  }, [sequence, onSubmit]);

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text text-balance">
          Analyse Your DNA or RNA Sequence
        </h2>
        <p className="text-surface-400 text-lg max-w-2xl mx-auto">
          Paste a nucleotide sequence or upload a FASTA file to explore the Central Dogma of
          molecular biology — from DNA to protein.
        </p>
      </div>

      {/* Input area */}
      <div className="glass-card p-6 sm:p-8 space-y-6 animate-slide-up">
        {/* Textarea */}
        <div>
          <label htmlFor="sequence-input" className="block text-sm font-semibold text-surface-300 mb-2">
            Nucleotide Sequence
          </label>
          <div className="relative">
            <textarea
              id="sequence-input"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="Enter your DNA or RNA sequence here...&#10;Example: ATGAAAGCTTGA&#10;&#10;Accepts: A, T, C, G (DNA) or A, U, C, G (RNA)"
              className="w-full h-44 p-4 bg-surface-900/80 border border-surface-700/50 rounded-xl 
                         text-surface-200 font-mono text-sm placeholder-surface-600
                         focus:outline-none focus:ring-2 focus:ring-dna-500/50 focus:border-dna-500/50
                         transition-all resize-none"
              spellCheck={false}
            />
            {/* Character counter */}
            <div className="absolute bottom-3 right-3 text-xs text-surface-600">
              {sequence.replace(/\s/g, '').length} characters
            </div>
          </div>

          {/* Textarea action buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-400 
                         bg-surface-800/50 rounded-lg hover:bg-surface-700/50 hover:text-surface-200 transition-all"
            >
              <Clipboard className="w-3.5 h-3.5" /> Paste
            </button>
            <button
              onClick={() => setSequence('ATGAAAGCAACCGTTGAAAATCTAGCTGACTGA')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-400 
                         bg-surface-800/50 rounded-lg hover:bg-surface-700/50 hover:text-surface-200 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Example
            </button>
            {sequence && (
              <button
                onClick={() => { setSequence(''); setFileName(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400/70 
                           bg-red-500/10 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-surface-700/50" />
          <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">or upload a file</span>
          <div className="flex-1 h-px bg-surface-700/50" />
        </div>

        {/* Drag & drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-dna-400 bg-dna-500/10 scale-[1.02]'
              : 'border-surface-700/50 hover:border-surface-600 hover:bg-surface-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.fasta,.fa,.fna"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-dna-400' : 'text-surface-500'}`} />
          <p className={`font-medium ${isDragging ? 'text-dna-300' : 'text-surface-400'}`}>
            {isDragging ? 'Drop your file here!' : 'Drag & drop a file, or click to browse'}
          </p>
          <p className="text-xs text-surface-600 mt-1">
            Supports .txt, .fasta, .fa, .fna
          </p>
          {fileName && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bio-500/10 border border-bio-500/30">
              <FileText className="w-4 h-4 text-bio-400" />
              <span className="text-sm text-bio-300">{fileName}</span>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSubmit}
            disabled={!sequence.trim() || loading}
            className="btn-primary text-lg px-10 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analysing...
              </span>
            ) : (
              '🧬 Analyse Sequence'
            )}
          </button>
        </div>
      </div>

      {/* Educational info */}
      <div className="glass-card p-6 animate-slide-up">
        <h3 className="text-sm font-semibold text-surface-300 mb-3">💡 What can you analyse?</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-dna-500/5 border border-dna-500/20">
            <p className="font-semibold text-dna-300 mb-1">DNA Sequences</p>
            <p className="text-surface-500">Containing A, T, C, G nucleotides</p>
          </div>
          <div className="p-4 rounded-xl bg-rna-500/5 border border-rna-500/20">
            <p className="font-semibold text-rna-300 mb-1">RNA Sequences</p>
            <p className="text-surface-500">Containing A, U, C, G nucleotides</p>
          </div>
          <div className="p-4 rounded-xl bg-bio-500/5 border border-bio-500/20">
            <p className="font-semibold text-bio-300 mb-1">FASTA Files</p>
            <p className="text-surface-500">Standard bioinformatics file format</p>
          </div>
        </div>
      </div>
    </div>
  );
}
