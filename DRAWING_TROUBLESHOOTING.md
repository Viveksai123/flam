# Drawing Not Working - Troubleshooting Guide

## Quick Fix Checklist

### 1. ✅ Verify Backend is Running
```bash
# Terminal window showing:
Connected to SQLite database
Server running on port 3001
```

If NOT running:
```bash
node server.js
```

### 2. ✅ Verify Frontend is Running
```bash
# Another terminal showing:
> Local: http://localhost:3000
```

If NOT running:
```bash
npm run dev
```

### 3. ✅ Check Browser Console
Open DevTools (F12) → Console tab

You should see:
```
[v0] Connecting to socket, roomId: room-123
[v0] Socket connected
[v0] Received room state: {users: [], strokes: []}
[v0] Canvas resized to: 1200 x 800
```

If you see connection errors:
- Check if server.js is running
- Verify port 3001 is not blocked
- Check firewall settings

### 4. ✅ Test Canvas Element
Open DevTools → Console tab, paste:
```javascript
const canvas = document.querySelector('canvas');
console.log('Canvas exists:', !!canvas);
console.log('Canvas size:', canvas.width, 'x', canvas.height);
console.log('Canvas parent:', canvas.parentElement.className);
```

You should see:
```
Canvas exists: true
Canvas size: 1200 x 800
Canvas parent: block w-full h-full cursor-crosshair z-10
```

If canvas size is 0:
- Canvas didn't resize properly
- Check network tab for any JS errors
- Reload page

### 5. ✅ Test Mouse Events
Open DevTools → Console tab, paste:
```javascript
const canvas = document.querySelector('canvas');
canvas.addEventListener('mousedown', (e) => {
  console.log('[TEST] Mouse down at:', e.clientX, e.clientY);
});
canvas.addEventListener('mousemove', (e) => {
  console.log('[TEST] Mouse move at:', e.clientX, e.clientY);
});
canvas.addEventListener('mouseup', (e) => {
  console.log('[TEST] Mouse up');
});
```

Then:
1. Move mouse over canvas
2. Click and drag on canvas

You should see:
```
[TEST] Mouse down at: 500 200
[TEST] Mouse move at: 510 210
[TEST] Mouse up
```

If you don't see logs:
- Events not firing
- Canvas might not be visible
- DOM element issue

### 6. ✅ Test Canvas Drawing Directly
Open DevTools → Console tab, paste:
```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(100, 100);
ctx.stroke();
console.log('Canvas should now have white line');
```

If you see the line:
- Canvas drawing works
- Problem is in event handling

If you DON'T see the line:
- Canvas context issue
- 2D context not available

### 7. ✅ Check React Event Handlers
Open DevTools → Console tab, paste:
```javascript
// Check if handleStart is being called
const originalLog = console.log;
let drawingStarted = false;

// Listen for our log message
const logs = [];
console.log = function(...args) {
  if (args[0]?.includes?.('[v0] Drawing started')) {
    drawingStarted = true;
  }
  originalLog(...args);
};

// Now click canvas
console.log('Click on the canvas now...');
```

After clicking canvas, restore:
```javascript
console.log = originalLog;
console.log('Did drawing start?', drawingStarted);
```

### 8. ✅ Verify Socket Connection
Open DevTools → Network tab → Filter "WS" (WebSocket)

You should see:
```
Status: 101 Switching Protocols
ws://localhost:3001/socket.io/?...
```

If NOT showing:
- Server not running on 3001
- CORS issue
- Firewall blocking

### 9. ✅ Check Canvas Visibility
Open DevTools → Elements tab

Find `<canvas>` element. Check:
1. Has `style="display: block; background-color: rgb(15, 15, 15);"` or similar
2. Parent has classes: `flex-1 relative w-full overflow-hidden`
3. No `display: none` or `visibility: hidden` in computed styles

## Step-by-Step Debug Process

### Step 1: Does Canvas Render?
```javascript
// Paste in console
document.querySelector('canvas') ? 'YES' : 'NO'
```

If NO:
- Canvas component not rendering
- Check `components/canvas.tsx` JSX (line 413)

If YES → Go to Step 2

### Step 2: Canvas Has Size?
```javascript
const c = document.querySelector('canvas');
`${c.width}x${c.height}` // Should NOT be 0x0
```

If 0x0:
- Canvas not initialized
- Reload page and check console logs
- Look for resize errors

If has size → Go to Step 3

### Step 3: Canvas is Visible?
```javascript
const c = document.querySelector('canvas');
const computed = window.getComputedStyle(c);
`visible: ${computed.visibility}, display: ${computed.display}, opacity: ${computed.opacity}`
```

Should be:
```
visible: visible, display: block, opacity: 1
```

If not → CSS issue in drawing-toolbar blocking canvas

### Step 4: Events Fire?
Click canvas while watching console for:
```
[v0] Drawing started at:
```

If no log:
- Event handler not attached
- React synthetic events issue
- Handler has early return

If log shows → Go to Step 5

### Step 5: Drawing Works?
Check if line appears on canvas

If NO:
- Event fires but drawing fails
- Check `ctx` (canvas context) is valid
- `strokeStyle` not set correctly

If YES → Everything works!

## Common Issues & Fixes

### Issue: Black canvas, nothing happens
**Cause:** Canvas not resizing
**Fix:** 
```javascript
// Force resize
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 64;
console.log('Canvas forced to:', canvas.width, 'x', canvas.height);
```

### Issue: Click works once, then nothing
**Cause:** `isDrawing` stuck as true
**Fix:** Reload page

### Issue: Color dropdown appears but is empty
**Cause:** Styling issue
**Fix:** Check toolbar CSS, look for empty color grid

### Issue: Multiple browser windows don't sync
**Cause:** Different room IDs
**Fix:** Both must enter SAME room ID when prompted

### Issue: "Cannot read property 'getContext' of null"
**Cause:** Canvas ref not set
**Fix:** Wait for page to fully load, reload

## Server Issues

### Server won't start
```bash
# Check if port 3001 is in use:
lsof -i :3001

# If in use, kill the process:
kill -9 <PID>

# Or use different port:
PORT=3002 node server.js
```

### Database errors
```bash
# Remove old database:
rm drawings.db

# Server will create new one:
node server.js
```

### Socket connection fails
```bash
# Check server console shows "Server running on port 3001"
# Check client connects: "[v0] Socket connected"
# Check room state received: "[v0] Received room state"
```

## Final Test

If you've followed all steps:

1. Open http://localhost:3000
2. Console shows socket connected
3. Canvas is black and visible
4. Click canvas → "[v0] Drawing started" appears
5. Drag mouse → Line appears on canvas
6. Release mouse → "[v0] Drawing ended" appears
7. Open second window with same room → Drawing syncs

If all these work: ✅ **Everything is properly configured!**

## Get Help

Check these logs in console:
```javascript
// What room are you in?
localStorage.getItem('roomId') // or check prompt

// Is socket connected?
const logs = [];
console.log('[CHECK] Looking for connection logs...');
// Reload page and watch for:
// [v0] Socket connected
// [v0] Received room state

// What's the canvas size?
document.querySelector('canvas').width
```

If you still have issues:
1. Check server.js is running
2. Check browser console for "[v0]" logs
3. Check browser Network tab for WebSocket
4. Reload page
5. Try different room ID
