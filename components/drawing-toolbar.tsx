'use client';

import React, { useState } from 'react';
import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
} from 'lucide-react';

interface DrawingToolbarProps {
  color: string;
  brushWidth: number;
  onColorChange: (color: string) => void;
  onBrushWidthChange: (width: number) => void;
  onToolChange: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedTool: string;
  canUndo: boolean;
  canRedo: boolean;
}

const COLORS = [
  '#ffffff',
  '#000000',
  '#7c3aed',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#ec4899',
  '#a78bfa',
];

const BRUSH_SIZES = [2, 4, 6, 8, 12, 16, 20];

export function DrawingToolbar({
  color,
  brushWidth,
  onColorChange,
  onBrushWidthChange,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onZoomIn,
  onZoomOut,
  onExport,
  onImport,
  selectedTool,
  canUndo,
  canRedo,
}: DrawingToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBrushSize, setShowBrushSize] = useState(false);
  const [customColor, setCustomColor] = useState(color);

  const tools = [
    { id: 'pencil', name: 'Pencil', icon: Pencil },
    { id: 'eraser', name: 'Eraser', icon: Eraser },
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 shadow-lg">
      <div className="max-w-full px-4 py-3 flex items-center gap-4 overflow-x-auto">
        {/* Tools */}
        <div className="flex gap-2 border-r border-border pr-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolChange(tool.id)}
                title={tool.name}
                className={`p-2.5 rounded-lg transition-all ${
                  selectedTool === tool.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2 border-r border-border pr-4">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Color"
              className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all"
            >
              <div
                className="w-5 h-5 rounded border border-border"
                style={{ backgroundColor: color }}
              />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-50 pointer-events-auto">
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onColorChange(c);
                        setCustomColor(c);
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor:
                          c === color ? '#a78bfa' : 'transparent',
                      }}
                      title={c}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      onColorChange(e.target.value);
                    }}
                    className="w-12 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs text-muted-foreground pt-1">
                    Custom
                  </span>
                </div>
              </div>
            )}
          </div>

          <span className="text-xs text-muted-foreground">Color</span>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 border-r border-border pr-4">
          <div className="relative">
            <button
              onClick={() => setShowBrushSize(!showBrushSize)}
              title="Brush Size"
              className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all"
            >
              <div
                className="rounded-full"
                style={{
                  backgroundColor: color,
                  width: `${Math.min(brushWidth, 20)}px`,
                  height: `${Math.min(brushWidth, 20)}px`,
                }}
              />
            </button>

            {showBrushSize && (
              <div className="absolute top-full left-0 mt-2 p-3 bg-card border border-border rounded-lg shadow-lg z-50 pointer-events-auto">
                <div className="flex flex-col gap-2">
                  {BRUSH_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        onBrushWidthChange(size);
                        setShowBrushSize(false);
                      }}
                      className={`px-3 py-2 rounded text-sm transition-all ${
                        brushWidth === size
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="rounded-full"
                          style={{
                            backgroundColor: color,
                            width: `${size}px`,
                            height: `${size}px`,
                          }}
                        />
                        <span>{size}px</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="text-xs text-muted-foreground">{brushWidth}px</span>
        </div>

        {/* Edit Actions */}
        <div className="flex gap-2 border-r border-border pr-4">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo2 size={20} />
          </button>
          <button
            onClick={onClear}
            title="Clear Canvas"
            className="p-2.5 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex gap-2 border-r border-border pr-4">
          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all"
          >
            <ZoomOut size={20} />
          </button>
        </div>

        {/* File Actions */}
        <div className="flex gap-2">
          <button
            onClick={onExport}
            title="Export Drawing"
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all"
          >
            <Download size={20} />
          </button>
          <label
            title="Import Drawing"
            className="p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
            <Upload size={20} />
          </label>
        </div>
      </div>
    </div>
  );
}
