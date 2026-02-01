# Next Steps - Start Using Your App

## Immediate Actions (Right Now!)

### 1. Start the App
```bash
npm run dev
```
This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

Wait for both to be ready (you'll see "ready - started server on ..." in terminal).

### 2. Open in Browser
```
http://localhost:3000
```

### 3. Click "Start Drawing Now"
You'll see the landing page. Click the big purple button to start.

### 4. Enter Room ID
A popup asks for a room ID. Options:
- **Auto-generate**: Just click OK (uses random ID)
- **Custom**: Type something like `my-project` or `team-1`
- **Share**: Give the room ID to others to collaborate

### 5. Start Drawing!
- You'll see the black canvas with grid
- Canvas has tools at the top:
  - **Pencil** (draw)
  - **Eraser** (erase)
  - **Rectangle** (draw rectangles)
  - **Circle** (draw circles)
  - **Color** (change color)
  - **Size** (change brush size)

## Testing Scenarios

### Test 1: Solo Drawing (5 minutes)
1. Draw something on canvas
2. Try different colors
3. Try different brush sizes
4. Try eraser
5. Use undo/redo

### Test 2: Export Your Drawing (2 minutes)
1. Draw something
2. Click export button (download icon)
3. Check your Downloads folder
4. File will be named `drawing-[roomid]-[timestamp].json`

### Test 3: Import Drawing (3 minutes)
1. Clear canvas (click trash icon, confirm)
2. Click import button (upload icon)
3. Select the JSON file you exported
4. Your drawing reappears!

### Test 4: Collaborate with Friend (10 minutes)
1. You: Open http://localhost:3000, room `shared-art`
2. Friend: Open http://localhost:3000, same browser or different computer
3. Friend: Enter same room ID: `shared-art`
4. You: Draw something
5. Friend: Should see your drawing appear in real-time
6. Friend: Draw something
7. You: Should see their drawing appear

### Test 5: Check Performance (5 minutes)
1. Click "Show Metrics" button (bottom left)
2. Performance panel appears (top right corner)
3. Watch as you draw:
   - FPS should be 55-60
   - Latency should be < 50ms
   - Strokes count increases
4. Click "Hide Metrics" to close

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Y` | Redo (Windows) |
| Click `?` button | Show shortcuts |

## Troubleshooting

### Canvas is blank
1. Wait 3 seconds for it to load
2. Press F12, check for errors
3. Reload page (Ctrl+R)

### Can't draw
1. Check if "Connected" shows in bottom left
2. Make sure server is running: `npm run dev`
3. Try different room ID

### Dropdowns not showing
1. Refresh page (Ctrl+R)
2. Click color/brush size buttons again

### Server won't start
```bash
# Kill any process on port 3001
# macOS/Linux:
lsof -ti :3001 | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Then try again:
npm run dev
```

## What Works Right Now

✅ Drawing with pencil, eraser, shapes
✅ Changing colors (10 presets + custom)
✅ Changing brush sizes
✅ Undo/redo
✅ Clear canvas
✅ Zoom in/out
✅ Export to JSON
✅ Import from JSON
✅ Real-time multi-user drawing
✅ Performance metrics
✅ Auto-save to database

## Share with Team

To let others draw with you:

1. **Local Network (Same WiFi):**
   - Get your IP: `ipconfig getifaddr en0` (macOS) or `ipconfig` (Windows)
   - Share: `http://YOUR_IP:3000`
   - Both enter same room ID

2. **Same Computer (Demo):**
   - Open two browser windows
   - Both go to `http://localhost:3000`
   - Both enter same room ID
   - Side-by-side collaboration!

3. **Internet (Deploy First):**
   - Deploy app to Vercel/AWS/Heroku
   - Update backend URL in code
   - Share deployed URL

## Documentation Files

Read these for more details:

- **QUICK_START.md** - Detailed setup instructions
- **CHECKLIST.md** - Testing checklist
- **DEBUG_GUIDE.md** - If something breaks
- **STATUS_REPORT.md** - Current status & features
- **FEATURES.md** - Complete feature list
- **README.md** - General information

## Common Questions

### Q: Can I use this without internet?
**A:** Yes! App works fully local on `localhost:3000`. Both frontend and backend run on your machine.

### Q: Can multiple people use this?
**A:** Yes! They need to be on your network:
- Same WiFi: Use your IP address instead of localhost
- Same computer: Open multiple browser windows
- Same network: Share your local IP

### Q: Does it save my drawings?
**A:** Yes! Automatically every 5 seconds to SQLite database. Persists even after page refresh if you use same room ID.

### Q: Can I export and keep my drawings?
**A:** Yes! Use the Export button to download as JSON. Import anytime to restore.

### Q: Is this secure?
**A:** It's a local app - no internet traffic. Room IDs are just names, not passwords. Good for teams, not for sensitive data.

### Q: Can I draw on tablet?
**A:** Yes! Full touch support. Pencil, eraser, shapes all work with touch.

## What to Try Next

1. **Create 3-4 drawings** - get comfortable with the tools
2. **Export one** - practice save/load workflow
3. **Invite someone** - test real-time sync
4. **Try shapes** - rectangle and circle tools
5. **Monitor performance** - watch metrics while drawing
6. **Check metrics** - see latency and FPS

## Feedback & Issues

If something doesn't work:

1. Check browser console (F12)
2. Look for errors starting with `[v0]`
3. Check DEBUG_GUIDE.md for solutions
4. Try clearing cache (Shift+Ctrl+Delete)
5. Restart app (stop and `npm run dev`)

## Success Indicators

You'll know it's working when:
- ✅ Canvas appears with grid
- ✅ You can draw with mouse
- ✅ Color dropdown appears when clicked
- ✅ Brush size dropdown appears when clicked
- ✅ Drawings appear in other browser windows (same room)
- ✅ Performance metrics show FPS 55-60
- ✅ Export downloads a file
- ✅ Import loads the file
- ✅ No red errors in console

## Now Go Draw! 🎨

Everything is ready. Time to start creating.

```bash
npm run dev
# Open http://localhost:3000
# Start drawing
```

Enjoy your collaborative drawing canvas!
