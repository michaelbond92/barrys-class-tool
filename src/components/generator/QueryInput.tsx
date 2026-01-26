// ============================================================================
// Query Input
// Natural language query input with interpretation feedback
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { SearchConstraints } from '../../types/hierarchyTypes';
import {
  parseQuery,
  interpretQuery,
  getExampleQueries,
  getSuggestions,
  validateQuery,
  isEmptyConstraints,
} from '../../services/queryParserService';

interface QueryInputProps {
  onSearch: (constraints: SearchConstraints) => void;
  placeholder?: string;
  className?: string;
}

export function QueryInput({
  onSearch,
  placeholder = 'Describe what you want (e.g., "10 min push/pull with snatch finisher")',
  className = '',
}: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [examples] = useState(() => getExampleQueries(5));

  // Load recent queries from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('barrys_recent_queries');
      if (stored) {
        setRecentQueries(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // Ignore errors
    }
  }, []);

  // Save query to recent
  const saveRecentQuery = useCallback((q: string) => {
    const updated = [q, ...recentQueries.filter(r => r !== q)].slice(0, 5);
    setRecentQueries(updated);
    try {
      localStorage.setItem('barrys_recent_queries', JSON.stringify(updated));
    } catch {
      // Ignore errors
    }
  }, [recentQueries]);

  // Parse query on change (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setInterpretation(null);
      setWarnings([]);
      return;
    }

    const timer = setTimeout(() => {
      const constraints = parseQuery(query);
      const interp = interpretQuery(constraints);
      const warns = validateQuery(constraints);

      setInterpretation(isEmptyConstraints(constraints) ? null : interp);
      setWarnings(warns);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const constraints = parseQuery(query);
    saveRecentQuery(query);
    onSearch(constraints);
    setShowExamples(false);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
    // Trigger search
    const constraints = parseQuery(example);
    saveRecentQuery(example);
    onSearch(constraints);
  };

  const handleClear = () => {
    setQuery('');
    setInterpretation(null);
    setWarnings([]);
    onSearch({});
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => !query && setShowExamples(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-600"
              title="Clear"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Interpretation feedback */}
      {interpretation && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-600">✓</span>
          <span className="text-gray-600">{interpretation}</span>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="text-sm text-amber-600 space-y-0.5">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-1">
              <span>⚠️</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Examples dropdown */}
      {showExamples && !query && (
        <div className="bg-white border rounded-lg shadow-lg p-3 space-y-3">
          {/* Recent queries */}
          {recentQueries.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1.5">Recent</div>
              <div className="space-y-1">
                {recentQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(q)}
                    className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Example queries */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1.5">Try these</div>
            <div className="space-y-1">
              {examples.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(q)}
                  className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowExamples(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Compact inline search
// ============================================================================

interface QuickSearchProps {
  onSearch: (constraints: SearchConstraints) => void;
  className?: string;
}

export function QuickSearch({ onSearch, className = '' }: QuickSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(parseQuery(query));
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Quick search..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
      >
        🔍
      </button>
    </form>
  );
}

export default QueryInput;
