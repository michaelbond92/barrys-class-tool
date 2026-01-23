import React from 'react';
import { TextArea } from '../ui/Input';
import { Button } from '../ui/Button';

interface TreadInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function TreadInput({ value, onChange, onClear }: TreadInputProps) {
  const placeholder = `Paste your tread column here...

Examples:
5, 6, 7
6, 7, 8 | 7, 8, 9
RECOVER
5% 5, 6, 7
6, 7, 8 | SPRINT`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tread Input</h2>
        {value && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>

      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="font-mono text-sm w-full"
      />

      <div className="mt-4 text-sm text-gray-500">
        <p className="font-medium mb-2">Supported formats:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="bg-gray-100 px-1 rounded">6, 7, 8</code> - Standard speed set (low, mid, high)</li>
          <li><code className="bg-gray-100 px-1 rounded">6, 7, 8 | 7, 8, 9</code> - Multiple speed sets</li>
          <li><code className="bg-gray-100 px-1 rounded">RECOVER</code> - Recovery (excluded from average)</li>
          <li><code className="bg-gray-100 px-1 rounded">5% 6, 7, 8</code> - Incline (+0.2 per 1% to effective speed)</li>
          <li><code className="bg-gray-100 px-1 rounded">6, 7, 8 | SPRINT</code> - Sprint marker</li>
        </ul>
      </div>
    </div>
  );
}
