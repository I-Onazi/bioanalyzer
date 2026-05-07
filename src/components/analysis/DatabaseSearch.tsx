/**
 * DatabaseSearch Component
 * ========================
 * Shows the results of querying UniProt/BLAST.
 */

import type { DatabaseSearchResult } from '../../types';
import ExplanationPanel from '../education/ExplanationPanel';
import { Database, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  result: DatabaseSearchResult | null;
  loading: boolean;
  onSearch: () => void;
}

export default function DatabaseSearch({ result, loading, onSearch }: Props) {
  if (loading) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-bio-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-xl font-bold text-surface-200">Searching Databases</h3>
        <p className="text-surface-400 mt-2">Querying UniProt for protein matches...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <Database className="w-12 h-12 mx-auto text-bio-400 mb-4" />
        <h3 className="text-xl font-bold text-surface-200 mb-2">Ready to Search Databases</h3>
        <p className="text-surface-400 mb-6 max-w-md mx-auto">
          We can query the UniProt database to see if your translated protein sequence matches any known proteins in nature.
        </p>
        <button onClick={onSearch} className="btn-primary">
          Search UniProt Database
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-2">Database Matches</h3>
        <p className="text-surface-400">
          Source: {result.source} • Matches found: {result.matches.length}
        </p>
      </div>

      {result.matches.length > 0 ? (
        <div className="grid gap-4">
          {result.matches.map((match, i) => (
            <div key={i} className="glass-card p-5 border-l-4 border-l-bio-500 hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-bold text-surface-200 flex items-center gap-2">
                    {match.protein_name}
                    {match.identity === 100 && (
                      <span className="badge badge-dna flex gap-1 items-center">
                        <ShieldCheck className="w-3 h-3" /> Exact Match
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-surface-400 italic mt-0.5">{match.organism}</p>
                </div>
                {match.accession && match.accession !== 'Unknown' && (
                  <a
                    href={`https://www.uniprot.org/uniprotkb/${match.accession}/entry`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-bio-400 hover:text-bio-300 transition-colors"
                  >
                    {match.accession} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-sm text-surface-300 mt-3 bg-surface-900/50 p-3 rounded-lg border border-surface-700/50">
                {match.function}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 text-center border-l-4 border-l-red-500/50">
          <AlertCircle className="w-10 h-10 mx-auto text-red-400 mb-3" />
          <h4 className="text-lg font-bold text-surface-200 mb-2">No Matches Found</h4>
          <p className="text-surface-400">
            This sequence did not return any significant hits in the UniProt database.
            It might be too short, heavily mutated, or an artificial sequence.
          </p>
        </div>
      )}

      <ExplanationPanel title="About Database Searching" content={result.explanation} />
    </div>
  );
}
