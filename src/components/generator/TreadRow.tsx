import React, { useState } from 'react';
import { TreadEntry } from '../../types';

interface TreadRowProps {
  entry: TreadEntry;
  onChange: (entry: TreadEntry) => void;
  isEditing: boolean;
}

export function TreadRow({ entry, onChange, isEditing }: TreadRowProps) {
  const [editValue, setEditValue] = useState(entry.raw);

  const handleBlur = () => {
    if (editValue !== entry.raw) {
      onChange({
        ...entry,
        raw: editValue
      });
    }
  };

  const textColorClass = entry.isRecover
    ? 'text-gray-400 italic'
    : entry.textColor === 'purple'
    ? 'text-hero font-semibold'
    : entry.textColor === 'red'
    ? 'text-incline font-semibold'
    : 'text-gray-900';

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        className={`w-full px-2 py-1 border border-gray-200 rounded text-sm font-mono ${textColorClass}`}
      />
    );
  }

  return (
    <span className={`font-mono text-sm ${textColorClass}`}>
      {entry.raw}
    </span>
  );
}
