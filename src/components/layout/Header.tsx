import React from 'react';

export function Header() {
  return (
    <header className="bg-header text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-header font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Barry's Class Tool</h1>
              <p className="text-orange-100 text-sm">Class Programming Made Easy</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
