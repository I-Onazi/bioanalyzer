/**
 * Shared TypeScript type definitions.
 * Single source of truth for data shapes between API and components.
 */

// ── Sequence Types ─────────────────────────────────────────────────

export type SequenceType = 'DNA' | 'RNA' | 'INVALID';
export type StrandType = 'coding' | 'template';
export type InputSource = 'paste' | 'upload' | 'drag-drop';

export interface SequenceDetection {
  id: string;
  cleaned_sequence: string;
  length: number;
  seq_type: SequenceType;
  explanation: string;
  is_valid: boolean;
}

// ── Transcription ──────────────────────────────────────────────────

export interface TranscriptionStep {
  step: number;
  title: string;
  description: string;
  before: string;
  after: string;
}

export interface TranscriptionResult {
  original_sequence: string;
  strand_type: string | null;
  mrna: string;
  steps: TranscriptionStep[];
  explanation: string;
}

// ── Translation ────────────────────────────────────────────────────

export interface CodonDetail {
  codon: string;
  amino_acid: string;
  abbreviation: string;
  letter: string;
}

export interface TranslationResult {
  mrna: string;
  codons: CodonDetail[];
  protein_sequence: string;
  protein_full_names: string;
  start_position: number;
  has_stop_codon: boolean;
  explanation: string;
}

// ── Protein ────────────────────────────────────────────────────────

export interface ProteinCharacterization {
  sequence: string;
  length: number;
  molecular_weight: number;
  amino_acid_composition: Record<string, number>;
  hydrophobicity_avg: number;
  hydrophobicity_profile: number[];
  charged_residues: number;
  polar_residues: number;
  nonpolar_residues: number;
  explanation: string;
}

// ── Database Search ────────────────────────────────────────────────

export interface DatabaseMatch {
  protein_name: string;
  organism: string;
  function: string;
  identity?: number;
  e_value?: number;
  accession?: string;
}

export interface DatabaseSearchResult {
  matches: DatabaseMatch[];
  source: string;
  explanation: string;
}

// ── Full Analysis ──────────────────────────────────────────────────

export interface FullAnalysis {
  sequence_info: SequenceDetection;
  transcription?: TranscriptionResult;
  translation?: TranslationResult;
  protein?: ProteinCharacterization;
  database_matches?: DatabaseSearchResult;
}

// ── API Health ─────────────────────────────────────────────────────

export interface HealthStatus {
  status: string;
  app_name: string;
  version: string;
}

// ── App State ──────────────────────────────────────────────────────

export type AnalysisStep = 
  | 'input' 
  | 'detection' 
  | 'strand-select' 
  | 'transcription' 
  | 'translation' 
  | 'protein' 
  | 'database';
