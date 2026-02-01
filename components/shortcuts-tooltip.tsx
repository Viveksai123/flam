'use client';

import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function ShortcutsTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl+Z', action: 'Undo last stroke' },
    { keys: 'Ctrl+Shift+Z', action: 'Redo stroke' },
    { keys: 'Ctrl+Y', action: 'Redo (alternate)' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-20 p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all z-30 group"
        title="Keyboard shortcuts"
      >
        <HelpCircle size={20} />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Shortcuts (? key)
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-16 left-4 bg-card border border-border rounded-lg shadow-lg p-4 z-30 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              Keyboard Shortcuts
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-secondary rounded transition-all"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs border-b border-border pb-2 last:border-b-0"
              >
                <span className="text-muted-foreground">
                  {shortcut.action}
                </span>
                <kbd className="px-2 py-1 bg-secondary rounded text-foreground font-mono text-xs">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <p>💡 Pro tips:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Use colors to stay organized</li>
              <li>Zoom in for detailed work</li>
              <li>Export before closing</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
