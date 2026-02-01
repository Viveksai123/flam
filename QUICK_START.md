# DrawSync - Quick Start Guide

## Install & Run (2 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Servers
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:3001 (Express + Socket.io)
- **Database**: SQLite (auto-created as drawings.db)

### Step 3: Open Application
```
http://localhost:3000
```

## First-Time Setup

When you open the app:
1. **Landing Page** appears with "Start Drawing Now" button
2. Click the button
3. Enter a **Room ID** (or let system generate one)
4. Click "Enter Room"
5. **Start drawing!**

## Invite Others to Collaborate

### Same Room (Live Collaboration)
1. Share your room ID with others
2. They open http://localhost:3000
3. They enter the same room ID
4. You see their drawings in real-time

## Basic Operations

### Drawing Tools
- **Pencil**: Default tool, draw freehand strokes
- **Eraser**: Remove parts of drawing
- **Rectangle**: Draw rectangular shapes
- **Circle**: Draw circular shapes

### Color & Size
- Click a color from palette (10 presets available)
- Or use hex color picker for custom colors
- Select brush size from dropdown (2px to 20px)

### Undo/Redo
- **Undo**: Press Ctrl+Z (Cmd+Z on Mac)
- **Redo**: Press Ctrl+Y or Ctrl+Shift+Z
- Or click buttons in toolbar

### Save & Load

#### Export Drawing
```
1. Click "Export" button in toolbar
2. Choose where to save the JSON file
3. Drawing is downloaded as JSON
```

#### Import Drawing
```
1. Click "Import" button in toolbar
2. Select a JSON file you saved
3. Drawing loads onto canvas
```

### Clear Canvas
```
Click "Clear" or delete icon in toolbar
Confirm when prompted
All strokes removed
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo last stroke |
| Ctrl+Y | Redo stroke |
| Ctrl+Shift+Z | Redo (alternate) |
| ? | Show shortcuts panel |

## UI Components Explained

### Top Toolbar
- **Tools**: Pencil, eraser, rectangle, circle
- **Colors**: Color palette + hex picker
- **Brush Size**: Size selector (2-20px)
- **Actions**: Undo, redo, clear, zoom, export, import

### Top-Left (Room Info)
- Room ID with copy button
- Stroke count
- Last auto-save time
- Share button for web sharing

### Bottom-Right (Active Collaborators)
- List of users currently in room
- Each user has unique color
- Connection status
- Latency indicator

### Metrics Panel (Toggle with "Show Metrics")
- **FPS**: Rendering performance (target 60+)
- **Latency**: Network round-trip time (lower is better)
- **Strokes**: Total strokes on canvas
- **Collaborators**: Users in room
- **Memory**: RAM usage

## Troubleshooting

### Canvas Not Responding
- Refresh page (F5)
- Check browser console for errors
- Ensure both servers are running

### Can't See Other User's Drawing
- Verify room IDs match exactly
- Check browser's Network tab for Socket.io errors
- Ensure firewall allows localhost:3001

### Drawing Lags
- Close other browser tabs
- Check FPS in metrics panel
- Reduce zoom level

### Can't Save/Load
- Check file format (must be JSON)
- Ensure room ID hasn't changed
- Check file is valid JSON (use online validator)

## Performance Tips

1. **Zoom In** for detailed work (less to render)
2. **Export often** to prevent data loss
3. **Use colors** to organize your drawing
4. **Clear old drawings** to reduce memory usage
5. **Close unused rooms** to free server resources

## Production Deployment

To deploy to production (e.g., Vercel):

1. **Update CORS in server.js**
```javascript
// Line 12 in server.js
cors: {
  origin: 'https://yourdomain.com',  // Change this
  methods: ['GET', 'POST'],
}
```

2. **Build project**
```bash
npm run build
```

3. **Deploy frontend to Vercel**
```bash
vercel deploy
```

4. **Deploy backend** (Heroku, Railway, etc.)
```bash
git push heroku main
```

## Advanced Features

### Custom Colors
1. Click "Custom Color" in color palette
2. Enter hex code (e.g., #FF5733)
3. Click confirm
4. New color added to palette

### Zoom Controls
- Click zoom in/out buttons
- Range: 0.5x to 3x
- Useful for detailed work

### History Management
- Each room keeps 10 auto-saves
- Automatic every 5 seconds
- No manual action needed

### Admin Dashboard
- Access metrics for active rooms
- View user connections
- Delete old rooms
- Monitor performance

## Support & Issues

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (iOS Safari, Chrome Mobile)

### System Requirements
- Minimum 4GB RAM
- Modern browser (2020+)
- Stable internet connection (for collaboration)

### Getting Help
- Check E2E_VERIFICATION.md for detailed architecture
- See Z_INDEX_FIX_SUMMARY.md for technical details
- Review README.md for full feature list

## Quick Reference

```bash
# Development
npm run dev          # Start both servers

# Production
npm run build        # Build for production
npm start            # Run production server

# Database
# SQLite database auto-created: ./drawings.db
# No migration needed
```

## API Reference (For Developers)

### Export Drawing
```bash
curl http://localhost:3001/api/room/my-room/export
```

### Import Drawing
```bash
curl -X POST http://localhost:3001/api/room/my-room/import \
  -H "Content-Type: application/json" \
  -d '{"strokes": [...]}'
```

### Get Room History
```bash
curl http://localhost:3001/api/room/my-room/history
```

### Delete Room
```bash
curl -X DELETE http://localhost:3001/api/room/my-room
```

---

**That's it!** You now have a fully functional collaborative drawing application. Start drawing!
