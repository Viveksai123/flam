'use client';

import React from 'react';
import { Users, Circle, Wifi, WifiOff } from 'lucide-react';

interface User {
  id: string;
  socketId: string;
}

interface UsersPanelProps {
  users: User[];
  currentUserId: string;
  isConnected: boolean;
  latency: number;
}

const USER_COLORS = [
  '#7c3aed',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#ec4899',
  '#a78bfa',
];

export function UsersPanel({
  users,
  currentUserId,
  isConnected,
  latency,
}: UsersPanelProps) {
  const getUserColor = (userId: string) => {
    const hash = userId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return USER_COLORS[hash % USER_COLORS.length];
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs z-30">
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} className="text-accent" />
        <h3 className="text-sm font-semibold text-foreground">
          Active Collaborators
        </h3>
        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
          {users.length}
        </span>
      </div>

      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId;
          const userColor = getUserColor(user.id);

          return (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-secondary hover:bg-muted transition-all"
            >
              <Circle
                size={12}
                className="flex-shrink-0"
                style={{ color: userColor, fill: userColor }}
              />
              <span className="text-sm text-secondary-foreground truncate">
                {isCurrentUser ? (
                  <>
                    <span>You</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      (me)
                    </span>
                  </>
                ) : (
                  `User ${user.id.slice(0, 8)}`
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi size={14} className="text-green-500" />
          ) : (
            <WifiOff size={14} className="text-red-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Circle
            size={6}
            className="flex-shrink-0"
            style={{
              color:
                latency < 50
                  ? '#10b981'
                  : latency < 150
                    ? '#f59e0b'
                    : '#ef4444',
              fill:
                latency < 50
                  ? '#10b981'
                  : latency < 150
                    ? '#f59e0b'
                    : '#ef4444',
            }}
          />
          <span className="text-xs text-muted-foreground">
            {latency}ms latency
          </span>
        </div>
      </div>
    </div>
  );
}
