'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  drawStrokeOptimized,
  simplifyPoints,
  distance,
  drawRectangle,
  drawCircle,
  eraseArea,
} from '@/lib/canvas-utils';
import { DrawingToolbar } from './drawing-toolbar';
import { UsersPanel } from './users-panel';
import { RoomInfo } from './room-info';
import { PerformanceMetrics } from './performance-metrics';
import { WelcomeModal } from './welcome-modal';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { ShortcutsTooltip } from './shortcuts-tooltip';

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  userId: string;
  timestamp: number;
  type?: 'freehand' | 'rectangle' | 'circle';
}

interface User {
  id: string;
  socketId: string;
}

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushWidth, setBrushWidth] = useState(2);
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [metrics, setMetrics] = useState({ fps: 0, latency: 0 });
  const [showMetrics, setShowMetrics] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [zoom, setZoom] = useState(1);
  const [showWelcome, setShowWelcome] = useState(true);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const currentStrokeRef = useRef<Stroke | null>(null);
  const pendingStrokesRef = useRef<Map<number, number>>(new Map());
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<Stroke[][]>([[]]); 
  const historyIndexRef = useRef(0);

  // Initialize room and canvas
  useEffect(() => {
    const newRoomId = prompt('Enter Room ID:', 'room-' + Math.random().toString(36).slice(2, 9));
    const newUserId = 'user-' + Math.random().toString(36).slice(2, 9);

    if (newRoomId) {
      setRoomId(newRoomId);
      setUserId(newUserId);
    }
  }, []);

  // Setup canvas with proper dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      console.log('[v0] Canvas or container ref not available');
      return;
    }

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height - 64); // Account for toolbar
      
      canvas.width = width;
      canvas.height = height;
      
      // Redraw after resize
      const ctx = canvas.getContext('2d');
      if (ctx && strokes.length > 0) {
        redrawCanvas(strokes);
      } else if (ctx) {
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, width, height);
      }
      
      console.log('[v0] Canvas resized to:', width, 'x', height);
    };

    // Small delay to ensure container is rendered
    const timer = setTimeout(resizeCanvas, 100);
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [strokes]);

  // Socket connection
  useEffect(() => {
    if (!roomId || !userId) return;

    console.log('[v0] Connecting to socket, roomId:', roomId);

    socketRef.current = io('http://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current.on('connect', () => {
      console.log('[v0] Socket connected');
      setConnected(true);
      socketRef.current?.emit('join-room', roomId, userId);
    });

    socketRef.current.on('room-state', (data) => {
      console.log('[v0] Received room state:', data);
      setUsers(data.users || []);
      setStrokes(data.strokes || []);
      setCanvasReady(true);
      historyRef.current = [data.strokes || []];
      historyIndexRef.current = 0;
    });

    socketRef.current.on('stroke-drawn', (stroke: Stroke) => {
      console.log('[v0] Remote stroke drawn:', stroke);
      setStrokes(prev => {
        const updated = [...prev, stroke];
        redrawCanvas(updated);
        return updated;
      });
    });

    socketRef.current.on('user-joined', (data) => {
      setUsersCount(data.usersCount);
    });

    socketRef.current.on('disconnect', () => {
      console.log('[v0] Socket disconnected');
      setConnected(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, userId]);

  // FPS counter
  useEffect(() => {
    const fpsInterval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      const fps = frameCountRef.current > 0 ? Math.round((frameCountRef.current * 1000) / delta) : 0;
      setMetrics(prev => ({ ...prev, fps }));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }, 1000);

    return () => clearInterval(fpsInterval);
  }, []);

  const getContext = () => canvasRef.current?.getContext('2d');

  const redrawCanvas = useCallback((strokesArray: Stroke[]) => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokesArray.forEach((stroke) => {
      if (stroke.type === 'rectangle' && stroke.points.length >= 2) {
        drawRectangle(ctx, stroke.points[0], stroke.points[1], stroke.color, stroke.width);
      } else if (stroke.type === 'circle' && stroke.points.length >= 2) {
        drawCircle(ctx, stroke.points[0], stroke.points[1], stroke.color, stroke.width);
      } else {
        drawStrokeOptimized(ctx, stroke.points, stroke.color, stroke.width);
      }
    });
  }, []);

  const handleStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('[v0] Canvas ref not available');
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const coords = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    console.log('[v0] Drawing started at:', coords, 'Tool:', selectedTool, 'Canvas size:', canvas.width, 'x', canvas.height);

    setIsDrawing(true);
    shapeStartRef.current = coords;

    if (selectedTool === 'pencil' || selectedTool === 'eraser') {
      currentStrokeRef.current = {
        points: [coords],
        color: selectedTool === 'eraser' ? '#0f0f0f' : color,
        width: brushWidth,
        userId,
        timestamp: Date.now(),
        type: 'freehand',
      };
    } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      currentStrokeRef.current = {
        points: [coords],
        color,
        width: brushWidth,
        userId,
        timestamp: Date.now(),
        type: selectedTool as 'rectangle' | 'circle',
      };
    }
  }, [selectedTool, color, brushWidth, userId]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;

    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const coords = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    frameCountRef.current++;

    if (selectedTool === 'pencil') {
      const lastPoint = currentStrokeRef.current.points[currentStrokeRef.current.points.length - 1];
      if (distance(lastPoint, coords) > 2) {
        currentStrokeRef.current.points.push(coords);
        ctx.strokeStyle = color;
        ctx.lineWidth = brushWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      }
    } else if (selectedTool === 'eraser') {
      eraseArea(ctx, coords.x, coords.y, brushWidth);
      currentStrokeRef.current.points.push(coords);
    } else if (selectedTool === 'rectangle' && shapeStartRef.current) {
      redrawCanvas(strokes);
      drawRectangle(ctx, shapeStartRef.current, coords, color, brushWidth);
    } else if (selectedTool === 'circle' && shapeStartRef.current) {
      redrawCanvas(strokes);
      drawCircle(ctx, shapeStartRef.current, coords, color, brushWidth);
    }
  }, [isDrawing, selectedTool, color, brushWidth, strokes]);

  const handleEnd = useCallback(() => {
    if (!isDrawing || !currentStrokeRef.current) return;

    console.log('[v0] Drawing ended, sending stroke');

    setIsDrawing(false);

    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      if (shapeStartRef.current && currentStrokeRef.current.points.length === 0) {
        currentStrokeRef.current.points = [shapeStartRef.current];
      }
    }

    if (socketRef.current?.connected && currentStrokeRef.current.points.length > 0) {
      const stroke = currentStrokeRef.current;
      const simplifiedStroke = {
        ...stroke,
        points: simplifyPoints(stroke.points, 1),
      };

      const sendTime = Date.now();
      socketRef.current.emit('draw-stroke', simplifiedStroke, (response: any) => {
        if (response?.success) {
          const latency = Date.now() - sendTime;
          setMetrics(prev => ({ ...prev, latency }));
          console.log('[v0] Stroke acknowledged, latency:', latency);
        }
      });

      setStrokes(prev => [...prev, simplifiedStroke]);
      historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), [...strokes, simplifiedStroke]];
      historyIndexRef.current++;
    }

    currentStrokeRef.current = null;
    shapeStartRef.current = null;
  }, [isDrawing, selectedTool, strokes]);

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const prevStrokes = historyRef.current[historyIndexRef.current];
      setStrokes(prevStrokes);
      redrawCanvas(prevStrokes);
      if (socketRef.current?.connected) {
        socketRef.current.emit('sync-strokes', prevStrokes);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const nextStrokes = historyRef.current[historyIndexRef.current];
      setStrokes(nextStrokes);
      redrawCanvas(nextStrokes);
      if (socketRef.current?.connected) {
        socketRef.current.emit('sync-strokes', nextStrokes);
      }
    }
  };

  const handleClear = () => {
    if (confirm('Clear the entire canvas?')) {
      setStrokes([]);
      redrawCanvas([]);
      historyRef.current = [[]];
      historyIndexRef.current = 0;
      if (socketRef.current?.connected) {
        socketRef.current.emit('clear-canvas');
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleExportDrawing = async () => {
    if (!roomId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/room/${roomId}/export`);
      if (!response.ok) throw new Error('Export failed');
      const data = await response.json();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drawing-${roomId}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export');
    }
  };

  const handleImportDrawing = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !roomId) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data.strokes)) throw new Error('Invalid format');

      const response = await fetch(`http://localhost:3001/api/room/${roomId}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strokes: data.strokes }),
      });
      if (!response.ok) throw new Error('Import failed');
      setStrokes(data.strokes);
      redrawCanvas(data.strokes);
      alert('Drawing imported!');
    } catch (err) {
      alert('Failed to import');
    }
    e.target.value = '';
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-background overflow-hidden flex flex-col">
      {showWelcome && roomId && (
        <WelcomeModal roomId={roomId} onClose={() => setShowWelcome(false)} />
      )}

      <DrawingToolbar
        color={color}
        brushWidth={brushWidth}
        onColorChange={setColor}
        onBrushWidthChange={setBrushWidth}
        onToolChange={setSelectedTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onExport={handleExportDrawing}
        onImport={handleImportDrawing}
        selectedTool={selectedTool}
        canUndo={historyIndexRef.current > 0}
        canRedo={historyIndexRef.current < historyRef.current.length - 1}
      />

      <div className="flex-1 relative w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="block w-full h-full cursor-crosshair z-10"
          style={{ 
            display: 'block',
            backgroundColor: '#0f0f0f',
          }}
        />
      </div>

      <RoomInfo roomId={roomId} strokeCount={strokes.length} isConnected={connected} lastSave={undefined} />
      <UsersPanel users={users} currentUserId={userId} isConnected={connected} latency={metrics.latency} />
      <PerformanceMetrics isVisible={showMetrics} data={{
        fps: metrics.fps,
        latency: metrics.latency,
        pendingStrokes: pendingStrokesRef.current.size,
        totalStrokes: strokes.length,
        roomSize: usersCount || users.length,
      }} />

      <button
        onClick={() => setShowMetrics(!showMetrics)}
        className="fixed bottom-4 left-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 z-30"
      >
        {showMetrics ? 'Hide' : 'Show'} Metrics
      </button>

      <KeyboardShortcuts onUndo={handleUndo} onRedo={handleRedo} onClear={handleClear} />
      <ShortcutsTooltip />
    </div>
  );
}
