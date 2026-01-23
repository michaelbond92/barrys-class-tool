import React from 'react';

interface DragDropRowProps {
  children: React.ReactNode;
  id: string;
  index: number;
  onMove?: (fromIndex: number, toIndex: number) => void;
}

export function DragDropRow({ children, id, index, onMove }: DragDropRowProps) {
  // Basic implementation without full drag-drop for now
  // Can be enhanced with @dnd-kit later

  return (
    <div className="group relative">
      {/* Drag handle (visual only for now) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 text-gray-400 hover:text-gray-600 cursor-grab">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
}
