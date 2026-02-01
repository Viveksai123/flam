'use client';

import React, { useState } from 'react';
import {
  Copy,
  Share2,
  ChevronDown,
  History,
  Clock,
  FileJson,
} from 'lucide-react';

interface RoomInfoProps {
  roomId: string;
  strokeCount: number;
  isConnected: boolean;
  lastSave?: string;
}

export function RoomInfo({
  roomId,
  strokeCount,
  isConnected,
  lastSave,
}: RoomInfoProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Collaborative Drawing Room',
          text: `Join me in drawing! Room ID: ${roomId}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed top-16 left-4 bg-card border border-border rounded-lg shadow-lg z-30">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-all"
      >
        <div className="text-left">
          <h3 className="text-sm font-semibold text-foreground">Room</h3>
          <p className="text-xs text-muted-foreground truncate">
            ID: {roomId.slice(0, 12)}...
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${
            showDetails ? 'rotate-180' : ''
          }`}
        />
      </button>

      {showDetails && (
        <div className="border-t border-border p-4 min-w-max space-y-3">
          {/* Room ID */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Room ID</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono">
                {roomId}
              </code>
              <button
                onClick={handleCopyRoomId}
                title="Copy Room ID"
                className="p-1.5 rounded hover:bg-secondary transition-all"
              >
                <Copy
                  size={14}
                  className={
                    copied ? 'text-green-500' : 'text-muted-foreground'
                  }
                />
              </button>
            </div>
          </div>

          {/* Share */}
          <div>
            <button
              onClick={handleShare}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-all flex items-center gap-2 text-sm"
            >
              <Share2 size={14} />
              Share Room
            </button>
          </div>

          {/* Stats */}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Strokes</span>
              <span className="text-foreground font-semibold">
                {strokeCount}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  isConnected
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={12} />
                Last Save
              </div>
              <span className="text-foreground text-xs">
                {formatTime(lastSave)}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="border-t border-border pt-3 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <FileJson size={12} />
              <span>Auto-saves every 5 seconds</span>
            </div>
            <div className="flex items-center gap-1">
              <History size={12} />
              <span>Last 10 saves stored</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
