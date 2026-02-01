# Debugging & Testing Guide

## Canvas Not Responding - Quick Fixes

### Issue 1: Nothing Appears on Canvas
**Causes:**
- Canvas width/height not set
- Socket not connected
- Room ID not provided

**Solutions:**
1. Check browser console for errors: Press `F12`
2. Look for `[v0]` log messages to track execution
3. Verify server is running: `npm run dev`
4. Check that you entered a valid room ID

### Issue 2: Unable to Draw
**Check List:**
```
1. Is the canvas visible? (black background with grid)
2. Can you click on the canvas? (cursor should change to crosshair)
3. Do you see "Connected" status in room info panel?
4. Is "Show Metrics" button showing FPS > 0?
```

**Debug Steps:**
1. Open DevTools: `F12`
2. Go to Console tab
3. Look for: `[v0] Drawing started at:` when you click
4. Look for: `[v0] Socket connected` on page load
5. Look for: `[v0] Received room state:` after joining

### Issue 3: Color/Brush Size Dropdowns Not Appearing
**Causes:**
- Z-index conflicts (fixed in latest version)
- Click event not registering
- Dropdown state not updating

**Solutions:**
1. Click the color circle button - dropdown should appear above it
2. Click brush size button - dropdown should appear above it
3. Both are now z-50, higher than canvas
4. If still not working, check browser console for errors

### Issue 4: Network Connection Issues
**Symptoms:**
- "Disconnected" status
- Cannot send/receive strokes
- Room state not loading

**Fix:**
1. Verify backend server running on port 3001:
   ```bash
   netstat -an | grep 3001  # macOS/Linux
   netstat -ano | findstr :3001  # Windows
   ```
2. Check server logs for errors
3. Try connecting to different room ID
4. Restart backend: Stop and run `npm run dev` again

## Testing Checklist

### Local Testing (Single Client)
- [ ] Enter room ID on load
- [ ] Click canvas - should see cursor turn to crosshair
- [ ] Click color button - dropdown appears with color options
- [ ] Click brush size button - dropdown appears with sizes
- [ ] Draw with pencil - black strokes appear
- [ ] Switch to eraser - erasing works
- [ ] Click undo - last stroke disappears
- [ ] Click redo - last stroke reappears
- [ ] Change color - new strokes use new color
- [ ] Change brush size - strokes get thicker/thinner
- [ ] Click clear - all strokes disappear
- [ ] Click show metrics - metrics panel appears

### Remote Testing (Two Clients)
1. **Client A:**
   - Open: http://localhost:3000
   - Enter room ID: "test-room-123"
   - Draw something

2. **Client B:**
   - Open: http://localhost:3000 (in different browser or incognito)
   - Enter room ID: "test-room-123"
   - Should see Client A's drawing appear
   - Try drawing - Client A should see it in real-time

### Export/Import Testing
1. Draw something in a room
2. Click export button - JSON file downloads
3. Clear canvas
4. Click import button - select JSON file
5. Drawing should restore

## Console Debugging Output

When you see these logs, the app is working:

```
[v0] Connecting to socket, roomId: test-room-123
[v0] Socket connected
[v0] Received room state: { users: [], strokes: [], ... }
[v0] Drawing started at: { x: 100, y: 150 }
[v0] Drawing ended, sending stroke
[v0] Stroke acknowledged, latency: 45
[v0] Remote stroke drawn: { points: [...], color: '#fff', ... }
```

## Performance Baseline

**Expected Performance:**
- FPS: 55-60 (vsync dependent)
- Latency: 10-50ms (local), 50-150ms (network)
- Strokes: No lag with 100+ strokes

**If Performance is Bad:**
- Check for browser extensions (disable them)
- Close other tabs
- Check Task Manager for CPU usage
- Try incognito mode

## Testing Different Tools

### Pencil
- Smooth continuous lines
- Works with pressure (if supported)

### Eraser
- Clears canvas in circular area
- Should show as clearing, not drawing

### Rectangle
- Click and drag to create rectangle outline
- Release to finalize

### Circle
- Click and drag to create circle outline
- Release to finalize

## Network Testing

### Test Real-Time Sync
1. Open two browser windows side-by-side
2. Enter same room ID in both
3. Draw in one - should appear in other within 100ms

### Test Persistence
1. Draw in a room
2. Refresh the page
3. Enter same room ID again
4. Previous drawing should reappear

## Common Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property 'getContext'` | Canvas ref not set | Check if canvas element exists |
| `CORS error` | Backend not running | Start backend: `npm run dev` |
| `Socket disconnected` | Network issue | Check backend logs |
| `Room not found` | Invalid room ID | Create new room |
| `Dropdown not visible` | Z-index issue | Should be fixed in v2 |

## Performance Profiling

To check if drawing is smooth:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click record, draw for 5 seconds, stop
4. Look for frame rate - should be 55-60 FPS

## Getting Detailed Logs

All debug messages start with `[v0]` and can be filtered in console:
- Filter: `[v0]`
- Shows all app-level debug info
- Includes socket events, drawing operations, state changes

## Still Having Issues?

1. Check browser console (F12) for all errors
2. Check terminal where you ran `npm run dev` for backend errors
3. Try in a different browser
4. Try clearing browser cache: `Shift+Ctrl+Delete`
5. Restart both frontend and backend

## Reset Everything

```bash
# Stop the dev server (Ctrl+C)
# Clear database
rm -f drawing.db

# Restart
npm run dev
```
