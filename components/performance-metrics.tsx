'use client';

import React from 'react';
import { Activity, TrendingUp, Users, Zap } from 'lucide-react';

interface MetricsData {
  fps: number;
  latency: number;
  pendingStrokes: number;
  totalStrokes: number;
  roomSize: number;
  memoryUsage?: number;
}

interface PerformanceMetricsProps {
  data: MetricsData;
  isVisible: boolean;
}

export function PerformanceMetrics({
  data,
  isVisible,
}: PerformanceMetricsProps) {
  if (!isVisible) return null;

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return { bg: 'bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500/30' };
    if (fps >= 30) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/30' };
    return { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500/30' };
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return { bg: 'bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500/30' };
    if (latency < 150) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/30' };
    return { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500/30' };
  };

  const fpsColors = getFpsColor(data.fps);
  const latencyColors = getLatencyColor(data.latency);

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    unit,
    colors,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    unit: string;
    colors: { bg: string; text: string; ring: string };
  }) => (
    <div className={`${colors.bg} border border-border rounded-lg p-3 ring-1 ${colors.ring}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`${colors.text}`}>{Icon}</div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
      <div className="mt-2 text-lg font-bold">
        <span className={colors.text}>{value}</span>
        <span className={`${colors.text} text-xs ml-1`}>{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed top-20 right-4 bg-card/95 backdrop-blur border border-border rounded-xl shadow-2xl z-30 w-80 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Activity size={18} className="text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Live Performance</h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <MetricCard
          icon={<Zap size={16} />}
          label="Rendering"
          value={Math.round(data.fps)}
          unit="fps"
          colors={fpsColors}
        />

        <MetricCard
          icon={<TrendingUp size={16} />}
          label="Latency"
          value={data.latency}
          unit="ms"
          colors={latencyColors}
        />

        <MetricCard
          icon={<Activity size={16} />}
          label="Strokes"
          value={data.totalStrokes}
          unit=""
          colors={{
            bg: 'bg-blue-500/20',
            text: 'text-blue-400',
            ring: 'ring-blue-500/30',
          }}
        />

        <MetricCard
          icon={<Users size={16} />}
          label="Collaborators"
          value={data.roomSize}
          unit=""
          colors={{
            bg: 'bg-purple-500/20',
            text: 'text-purple-400',
            ring: 'ring-purple-500/30',
          }}
        />
      </div>

      {/* Additional Metrics */}
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Pending Strokes</span>
          <span className="font-mono font-semibold text-foreground">
            {data.pendingStrokes}
          </span>
        </div>

        {data.memoryUsage !== undefined && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Memory Usage</span>
            <span className="font-mono font-semibold text-foreground">
              {(data.memoryUsage / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-green-400">Connected & Synced</span>
      </div>
    </div>
  );
}
