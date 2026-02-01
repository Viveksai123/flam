# Quick Action Checklist

## Before Testing - Setup

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Start both servers
npm run dev

# Expected output:
# - Next.js server running on http://localhost:3000
# - Express server running on http://localhost:3001
# - No error messages in console
```

## Testing the App - Step by Step

### Step 1: Open the App
1. Go to http://localhost:3000
2. You should see the landing page
3. Click "Start Drawing Now"
4. Enter room ID: `test-123`
5. Click OK

### Step 2: Test Canvas Drawing
- [ ] Black canvas with grid appears
- [ ] Click on canvas - cursor changes to crosshair
- [ ] Draw with mouse - should see white lines
- [ ] Try drawing shapes on canvas

### Step 3: Test Color Picker
- [ ] Click the colored circle button (color picker)
- [ ] Dropdown menu appears with color options
- [ ] Click a color (e.g., red)
- [ ] Dropdown closes
- [ ] Draw with new color

### Step 4: Test Brush Size
- [ ] Click the brush size button
- [ ] Dropdown appears with sizes (2px, 4px, etc.)
- [ ] Click a size (e.g., 8px)
- [ ] Dropdown closes
- [ ] Draw with new brush size

### Step 5: Test All Tools
- [ ] Click Pencil tool - draw should work
- [ ] Click Eraser tool - erasing should work
- [ ] Click Rectangle tool - click and drag to make rectangle
- [ ] Click Circle tool - click and drag to make circle

### Step 6: Test Undo/Redo
- [ ] Draw something
- [ ] Click Undo (arrow pointing left) - last stroke disappears
- [ ] Click Redo (arrow pointing right) - stroke reappears

### Step 7: Test Clear
- [ ] Draw something
- [ ] Click Clear (trash can) - click OK in dialog
- [ ] Canvas should be completely empty

### Step 8: Test Zoom
- [ ] Click Zoom In (+) - drawing gets larger
- [ ] Click Zoom Out (-) - drawing gets smaller

### Step 9: Test Metrics
- [ ] Click "Show Metrics" button (bottom left)
- [ ] Performance panel appears (top right)
- [ ] FPS should show 55-60
- [ ] Should see latency, strokes count, collaborators count
- [ ] Click "Hide Metrics" to close

### Step 10: Test Export
- [ ] Draw something
- [ ] Click Export button (download icon)
- [ ] JSON file should download to your computer
- [ ] File name: `drawing-test-123-[timestamp].json`

### Step 11: Test Import
- [ ] Clear the canvas
- [ ] Click Import button (upload icon)
- [ ] Select the JSON file you just exported
- [ ] Drawing should reappear

## Multi-User Testing (Real-Time Sync)

### Setup Two Clients
1. **Browser 1:**
   - Open http://localhost:3000
   - Room ID: `shared-room`
   - Click OK

2. **Browser 2:**
   - Open http://localhost:3000 (different window/tab)
   - Room ID: `shared-room`
   - Click OK

### Test Real-Time Sync
- [ ] User 1 draws - User 2 should see it within 1 second
- [ ] User 2 draws - User 1 should see it immediately
- [ ] Both can see each other's colors and brush sizes
- [ ] Performance metrics show 2 users in room

## Troubleshooting Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Canvas is blank | Check if [v0] logs appear in console (F12) |
| Can't draw | Check if "Connected" appears in room info |
| Dropdowns not showing | Refresh page (Ctrl+R) |
| Server not starting | Check if port 3001 is free |
| Socket error | Stop server and `npm run dev` again |

## Features Checklist

### Drawing
- [x] Pencil tool with smooth lines
- [x] Eraser tool clears areas
- [x] Rectangle tool draws outlines
- [x] Circle tool draws circles
- [x] Color picker with 10 presets + custom
- [x] Brush size selector (2px-20px)

### Controls
- [x] Undo last stroke
- [x] Redo undone stroke
- [x] Clear entire canvas
- [x] Zoom in/out

### Data
- [x] Export to JSON file
- [x] Import from JSON file
- [x] Auto-save every 5 seconds
- [x] Persist drawings across page refresh

### Collaboration
- [x] Join room with ID
- [x] See real-time drawing from others
- [x] See list of collaborators
- [x] Latency display

### Performance
- [x] FPS counter (55-60 target)
- [x] Latency tracking
- [x] Memory usage display
- [x] Stroke count

## What to Check in Console (F12)

**Good Signs:**
```
[v0] Connecting to socket, roomId: test-123
[v0] Socket connected
[v0] Received room state: { users: [], strokes: [], ... }
[v0] Drawing started at: { x: 150, y: 200 }
[v0] Drawing ended, sending stroke
[v0] Stroke acknowledged, latency: 45
```

**Bad Signs:**
- CORS errors
- "Cannot read property" errors
- Socket connection errors
- No [v0] logs at all

## Performance Targets

- **FPS**: 55-60 (depends on vsync)
- **Latency**: 10-50ms (local), 50-200ms (network)
- **Draw delay**: < 100ms after mouse movement
- **Memory**: < 100MB for 1000 strokes

## End-to-End Verification

✓ Frontend loads
✓ Canvas initializes with proper dimensions
✓ Socket connects to backend
✓ Can draw on canvas
✓ Strokes appear in real-time
✓ Other users see drawings
✓ Data persists in database
✓ Export/import works
✓ All UI elements clickable
✓ No console errors

## Report Format

If something doesn't work, provide:

1. What you tried to do
2. What happened instead
3. What you expected to happen
4. Console errors (if any)
5. Room ID you were using
6. Browser type and version

Example:
```
Tried: Click color picker
Got: Dropdown didn't appear
Expected: Color dropdown with color options
Error: None in console
Room: test-123
Browser: Chrome 120
```
