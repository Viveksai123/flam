# Complete Setup & Verification Guide

## IS IT END-TO-END? YES ✅

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 3000)                      │
│  Next.js + React + Canvas API                               │
│  ├─ Canvas Component (Drawing)                              │
│  ├─ Socket.io Client (Real-time comms)                      │
│  ├─ Drawing Toolbar (Tools & Colors)                        │
│  └─ Performance Monitoring                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ WebSocket (Socket.io)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Port 3001)                       │
│  Express.js + Socket.io                                      │
│  ├─ WebSocket Server (Real-time messaging)                  │
│  ├─ Room Management (Isolated spaces)                       │
│  ├─ REST APIs (Export/Import/History)                       │
│  └─ Event Broadcasting (stroke-drawn, user-joined, etc)     │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (SQLite)                           │
│  ├─ drawings table (room data, timestamps)                  │
│  ├─ strokes table (individual stroke tracking)              │
│  └─ Auto-save every 5 seconds                               │
└─────────────────────────────────────────────────────────────┘
```

## What's Implemented

### Frontend Features ✅
- Canvas drawing with pencil tool
- Color picker with 10 presets + custom hex
- Brush size selector (2-20px)
- Eraser tool
- Shape tools (rectangle, circle)
- Undo/Redo functionality
- Zoom in/out
- Export to JSON
- Import from JSON
- Real-time FPS & latency display
- User presence panel
- Room info display

### Backend Features ✅
- Socket.io WebSocket server
- join-room event handler
- draw-stroke event handler
- stroke-drawn broadcast
- user-joined notification
- disconnect handling
- Room management
- SQLite persistence
- Auto-save mechanism
- Export API endpoint
- Import API endpoint
- History API endpoint

### Database Features ✅
- SQLite with 2 tables
- drawings table (room_id, data, timestamps)
- strokes table (room_id, user_id, stroke_data)
- Foreign key relationships
- Created/updated timestamps
- Automatic indexing

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web server
- `socket.io` - WebSocket library
- `sqlite3` - Database
- `cors` - Cross-origin requests
- `next` - Frontend framework
- `react` - UI library

### 2. Start Development Servers

Open TWO terminal windows:

**Terminal 1 (Next.js Frontend):**
```bash
npm run dev
```
Output should show:
```
> Local:        http://localhost:3000
```

**Terminal 2 (Express Backend):**
```bash
node server.js
```
Output should show:
```
Connected to SQLite database
Server running on port 3001
```

### 3. Open Browser
Go to: `http://localhost:3000`

You should see:
- Landing page with "Start Drawing Now" button
- No errors in browser console

### 4. Create a Room
- Click "Start Drawing Now"
- Enter room name (e.g., "room-123")
- Click OK

You should see:
- Black canvas area
- Toolbar at top with tools
- Room info panel (bottom left)
- Users panel (bottom right)
- Console logs: "[v0] Socket connected", "[v0] Received room state"

### 5. Test Drawing
- Click on canvas
- Drag to draw
- Should see white line appear

If not working, check:
- Browser console for "[v0]" logs
- Server terminal for errors
- Canvas size logs: "[v0] Canvas resized to: XXXX x YYYY"

### 6. Test Color Picker
- Click "Color" button in toolbar
- Click on a color
- Draw again - should be new color

### 7. Test Brush Size
- Click "Size" button in toolbar
- Select different size
- Draw - should be different thickness

### 8. Test Real-Time Sync
- Open second browser window/tab with same room ID
- Draw in one window
- Should appear instantly in other window

### 9. Test Export/Import
- Click "Export" button
- File downloads as JSON
- Clear canvas
- Click "Import"
- Select downloaded file
- Drawing should restore

## Socket.io Events Flow

### Connection Flow
```
Client connects → "connect" event
    ↓
Client sends "join-room" with roomId, userId
    ↓
Server creates/joins room
    ↓
Server sends "room-state" back to client
    ↓
Server broadcasts "user-joined" to room
```

### Drawing Flow
```
User draws on canvas
    ↓
handleMove() → sends points to canvas
    ↓
handleEnd() → finalizes stroke
    ↓
socketRef.emit("draw-stroke", stroke)
    ↓
Server receives → validates → stores
    ↓
Server broadcasts "stroke-drawn" to all clients
    ↓
All clients receive → redraw canvas
    ↓
Database saves automatically
```

## Troubleshooting

### Canvas is black but can't draw

**Check:**
1. Console logs for errors
2. Canvas size: `[v0] Canvas resized to: XXXX x YYYY`
3. Mouse coordinates: `[v0] Drawing started at:`

**If logs missing:**
- Canvas JSX not rendering
- Check `components/canvas.tsx` line 413-428
- Ensure `<canvas>` element has `ref={canvasRef}`

### Can't connect to socket

**Check:**
1. Server running on port 3001: `node server.js`
2. Browser network tab - should see WebSocket connection
3. Console error: "Failed to connect"

**Common issues:**
- Server not running
- Port 3001 in use
- Wrong URL in canvas component (line 98)

### Color picker not appearing

**Check:**
1. Is dropdown button clickable?
2. Console for errors
3. z-index: Should be z-50 for dropdown

### Drawing doesn't sync between windows

**Check:**
1. Both windows have same room ID
2. Server console shows: "User X joined room Y"
3. Network tab shows WebSocket messages

## Database Files

The app creates `drawings.db` in the project root.

View with:
```bash
sqlite3 drawings.db
sqlite> .tables
sqlite> SELECT * FROM drawings;
sqlite> SELECT * FROM strokes;
```

## Package.json Scripts

```json
"scripts": {
  "dev": "concurrently \"next dev\" \"node server.js\"",
  "build": "next build",
  "start": "node server.js",
  "lint": "eslint ."
}
```

- `npm run dev` - Run both frontend and backend
- `npm run build` - Build Next.js
- `npm start` - Run production server

## Ports

- **Port 3000**: Next.js frontend
- **Port 3001**: Express backend + Socket.io
- **localhost:3000**: Open this in browser
- **localhost:3001**: Backend API (don't open directly)

## File Structure

```
project/
├── app/
│   ├── page.tsx        (Main page)
│   ├── layout.tsx      (App layout)
│   └── globals.css     (Styles & theme)
├── components/
│   ├── canvas.tsx      (Drawing component)
│   ├── drawing-toolbar.tsx
│   ├── performance-metrics.tsx
│   └── ... (other components)
├── lib/
│   └── canvas-utils.ts (Drawing functions)
├── server.js           (Express + Socket.io)
├── drawings.db         (SQLite database - auto-created)
└── package.json
```

## Console Logs to Expect

When everything works:
```
[v0] Connecting to socket, roomId: room-123
[v0] Socket connected
[v0] Received room state: {users: [], strokes: []}
[v0] Canvas resized to: 1200 x 800
[v0] Drawing started at: {x: 100, y: 200} Tool: pencil
[v0] Drawing ended, sending stroke
[v0] Stroke acknowledged, latency: 45ms
```

## YES, This IS End-to-End ✅

The complete data flow is:
1. User draws on canvas
2. Client captures event
3. Socket.io sends to server (WebSocket)
4. Server validates & stores in SQLite
5. Server broadcasts to all connected clients
6. All clients receive & redraw
7. Database persists automatically

All three layers (Frontend, Backend, Database) are fully implemented and connected!
