'use client';

import React, { useState } from 'react';
import {
  Pencil,
  Users,
  Share2,
  Zap,
  X,
  Copy,
  Check,
} from 'lucide-react';

interface WelcomeModalProps {
  roomId: string;
  onClose: () => void;
}

export function WelcomeModal({ roomId, onClose }: WelcomeModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: Pencil,
      title: 'Drawing Tools',
      description: 'Pencil, eraser, shapes and more',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Draw together with others instantly',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your room ID with anyone',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Smooth 60fps drawing experience',
    },
  ];

  const shortcuts = [
    { key: 'Pencil', action: 'Click tool in toolbar' },
    { key: 'Eraser', action: 'Click eraser tool' },
    { key: 'Undo', action: 'Click undo button or Ctrl+Z' },
    { key: 'Redo', action: 'Click redo button or Ctrl+Y' },
    { key: 'Export', action: 'Click download button' },
    { key: 'Import', action: 'Click upload button' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome to DrawSync
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time collaborative drawing canvas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-all"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Room Info */}
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Your Room ID</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background/50 text-primary-foreground px-4 py-3 rounded-lg font-mono text-sm">
                {roomId}
              </code>
              <button
                onClick={handleCopyRoomId}
                className="p-3 hover:bg-muted rounded-lg transition-all"
              >
                {copied ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <Copy size={20} className="text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this room ID with others to collaborate
            </p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="bg-secondary/50 border border-border rounded-lg p-4 hover:border-accent transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} className="text-accent" />
                      <h3 className="text-sm font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shortcuts */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Tips
            </h2>
            <div className="space-y-2">
              {shortcuts.map((shortcut, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-secondary/50 border border-border rounded-lg p-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {shortcut.key}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {shortcut.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Getting Started
            </h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Select a drawing tool from the top toolbar</li>
              <li>Choose your color and brush size</li>
              <li>Start drawing on the canvas</li>
              <li>Share your room ID with collaborators</li>
              <li>Watch them draw in real-time</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Start Drawing
          </button>
        </div>
      </div>
    </div>
  );
}
