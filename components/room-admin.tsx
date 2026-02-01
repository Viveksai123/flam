'use client';

import React, { useEffect, useState } from 'react';

interface Room {
  roomId: string;
  usersCount: number;
  strokeCount: number;
}

export function RoomAdmin() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch active rooms
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch rooms'
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete room
  const deleteRoom = async (roomId: string) => {
    if (!confirm(`Are you sure you want to delete room "${roomId}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/room/${roomId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete room');

      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete room'
      );
    }
  };

  // Auto-refresh rooms
  useEffect(() => {
    fetchRooms();

    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchRooms();
      }, 3000); // Refresh every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Room Management Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh
            </label>
            <button
              onClick={fetchRooms}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/50 rounded text-destructive">
            {error}
          </div>
        )}

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {loading ? 'Loading rooms...' : 'No active rooms'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-foreground font-semibold">
                    Room ID
                  </th>
                  <th className="text-left p-4 text-foreground font-semibold">
                    Users
                  </th>
                  <th className="text-left p-4 text-foreground font-semibold">
                    Strokes
                  </th>
                  <th className="text-left p-4 text-foreground font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room.roomId}
                    className="border-b border-border hover:bg-card/50 transition"
                  >
                    <td className="p-4">
                      <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                        {room.roomId}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full text-sm font-medium text-primary">
                        {room.usersCount}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {room.strokeCount} strokes
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteRoom(room.roomId)}
                          className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {rooms.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="p-4 bg-card border border-border rounded">
              <p className="text-muted-foreground text-sm mb-1">
                Total Rooms
              </p>
              <p className="text-3xl font-bold text-foreground">
                {rooms.length}
              </p>
            </div>
            <div className="p-4 bg-card border border-border rounded">
              <p className="text-muted-foreground text-sm mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-foreground">
                {rooms.reduce((sum, r) => sum + r.usersCount, 0)}
              </p>
            </div>
            <div className="p-4 bg-card border border-border rounded">
              <p className="text-muted-foreground text-sm mb-1">
                Total Strokes
              </p>
              <p className="text-3xl font-bold text-foreground">
                {rooms.reduce((sum, r) => sum + r.strokeCount, 0)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
