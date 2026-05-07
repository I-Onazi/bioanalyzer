/**
 * API Client Service
 * ==================
 * Centralised HTTP client for communicating with the FastAPI backend.
 * Uses axios for interceptors, error handling, and request/response transforms.
 */

import axios from 'axios';
import type {
  SequenceDetection,
  FullAnalysis,
  DatabaseSearchResult,
  HealthStatus,
} from '../types';

// ── Base client ────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Health check ───────────────────────────────────────────────────
export const checkHealth = async (): Promise<HealthStatus> => {
  const { data } = await api.get('/api/health');
  return data;
};

// ── Sequence submission ────────────────────────────────────────────
export const submitSequence = async (
  sequence: string,
  source: string = 'paste'
): Promise<SequenceDetection> => {
  const { data } = await api.post('/api/sequence/submit', { sequence, source });
  return data;
};

// ── File upload ────────────────────────────────────────────────────
export const uploadFile = async (file: File): Promise<SequenceDetection> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/sequence/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ── Full analysis pipeline ─────────────────────────────────────────
export const runFullAnalysis = async (
  sequence: string,
  strandType: string = 'coding'
): Promise<FullAnalysis> => {
  const { data } = await api.post(
    `/api/analysis/full?sequence=${encodeURIComponent(sequence)}&strand_type=${strandType}`
  );
  return data;
};

// ── Database search ────────────────────────────────────────────────
export const searchProtein = async (
  proteinSequence: string
): Promise<DatabaseSearchResult> => {
  const { data } = await api.post(
    `/api/search/protein?protein_sequence=${encodeURIComponent(proteinSequence)}`
  );
  return data;
};

export default api;
