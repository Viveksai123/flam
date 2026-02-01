const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://flam-d7y3.onrender.com'|| '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'drawings.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS drawings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS strokes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      stroke_data TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES drawings(room_id)
    )
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_room_id ON drawings(room_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_strokes_room ON strokes(room_id)
  `);
});

// In-memory room management
const rooms = new Map();

class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.users = new Map();
    this.strokes = [];
    this.history = [];
    this.historyIndex = -1;
  }

  addUser(userId, socketId) {
    this.users.set(userId, { socketId, joinedAt: Date.now() });
  }

  removeUser(userId) {
    this.users.delete(userId);
  }

  addStroke(stroke) {
    this.strokes.push(stroke);
    // Keep history for undo/redo
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push([...this.strokes]);
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.strokes = [...this.history[this.historyIndex]];
      return this.strokes;
    }
    return null;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.strokes = [...this.history[this.historyIndex]];
      return this.strokes;
    }
    return null;
  }

  clear() {
    this.strokes = [];
    this.history = [];
    this.historyIndex = -1;
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  let userRoom = null;
  let userId = null;

  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId, newUserId) => {
    userRoom = roomId;
    userId = newUserId;

    // Validate room ID
    if (!roomId || typeof roomId !== 'string' || roomId.length > 100) {
      socket.emit('error', { message: 'Invalid room ID' });
      return;
    }

    // Create room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Room(roomId));
      // Load previous drawing data from database
      loadRoomData(roomId);
    }

    const room = rooms.get(roomId);
    room.addUser(userId, socket.id);

    socket.join(roomId);

    // Send timestamp for latency calculation
    const joinTime = Date.now();
    socket.emit('join-ack', { timestamp: joinTime });

    // Notify others in the room
    socket.broadcast.to(roomId).emit('user-joined', {
      userId,
      usersCount: room.users.size,
      timestamp: Date.now(),
    });

    // Send current state to the new user
    socket.emit('room-state', {
      strokes: room.strokes,
      users: Array.from(room.users.entries()).map(([id, data]) => ({
        id,
        socketId: data.socketId,
      })),
      roomId,
      timestamp: Date.now(),
    });

    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on('draw-stroke', (strokeData, callback) => {
    if (!userRoom) {
      if (callback) callback({ error: 'Not in a room' });
      return;
    }

    const room = rooms.get(userRoom);
    if (!room) {
      if (callback) callback({ error: 'Room not found' });
      return;
    }

    // Validate stroke data
    if (!strokeData || !Array.isArray(strokeData.points) || strokeData.points.length === 0) {
      if (callback) callback({ error: 'Invalid stroke data' });
      return;
    }

    const serverTimestamp = Date.now();
    const strokeWithMeta = {
      ...strokeData,
      userId,
      timestamp: serverTimestamp,
      sequenceId: room.strokes.length, // For conflict resolution
    };

    room.addStroke(strokeWithMeta);

    // Broadcast to all users in the room with server timestamp
    io.to(userRoom).emit('stroke-drawn', strokeWithMeta);

    // Send acknowledgment with server timestamp for latency calculation
    if (callback) {
      callback({
        success: true,
        serverTimestamp,
        sequenceId: room.strokes.length - 1,
      });
    }

    // Save to database (debounced)
    saveStrokeToDb(userRoom, userId, strokeData);
  });

  socket.on('undo', () => {
    if (!userRoom) return;

    const room = rooms.get(userRoom);
    if (!room) return;

    const result = room.undo();
    if (result) {
      io.to(userRoom).emit('canvas-state', result);
    }
  });

  socket.on('redo', () => {
    if (!userRoom) return;

    const room = rooms.get(userRoom);
    if (!room) return;

    const result = room.redo();
    if (result) {
      io.to(userRoom).emit('canvas-state', result);
    }
  });

  socket.on('clear-canvas', () => {
    if (!userRoom) return;

    const room = rooms.get(userRoom);
    if (!room) return;

    room.clear();
    io.to(userRoom).emit('canvas-cleared');
  });

  socket.on('request-state', () => {
    if (!userRoom) return;

    const room = rooms.get(userRoom);
    if (!room) return;

    socket.emit('room-state', {
      strokes: room.strokes,
      users: Array.from(room.users.entries()).map(([id, data]) => ({
        id,
        socketId: data.socketId,
      })),
    });
  });

  socket.on('disconnect', () => {
    if (userRoom && userId) {
      const room = rooms.get(userRoom);
      if (room) {
        room.removeUser(userId);
        io.to(userRoom).emit('user-left', {
          userId,
          usersCount: room.users.size,
        });

        // Clean up empty rooms
        if (room.users.size === 0) {
          saveRoomData(userRoom, room);
          rooms.delete(userRoom);
        }
      }
    }

    console.log(`User disconnected: ${socket.id}`);
  });
});

// Database functions
function loadRoomData(roomId) {
  db.get(
    'SELECT data FROM drawings WHERE room_id = ? ORDER BY updated_at DESC LIMIT 1',
    [roomId],
    (err, row) => {
      if (err) {
        console.error('Error loading room data:', err);
        return;
      }

      if (row) {
        const room = rooms.get(roomId);
        if (room) {
          try {
            room.strokes = JSON.parse(row.data);
            room.history = [room.strokes];
            room.historyIndex = 0;
          } catch (e) {
            console.error('Error parsing room data:', e);
          }
        }
      }
    }
  );
}

let saveDebouncedRooms = new Map();

function saveStrokeToDb(roomId, userId, strokeData) {
  // Debounce database saves
  if (!saveDebouncedRooms.has(roomId)) {
    saveDebouncedRooms.set(roomId, setTimeout(() => {
      const room = rooms.get(roomId);
      if (room) {
        saveRoomData(roomId, room);
      }
      saveDebouncedRooms.delete(roomId);
    }, 5000)); // Save every 5 seconds
  }
}

function saveRoomData(roomId, room) {
  const data = JSON.stringify(room.strokes);
  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO drawings (room_id, data, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(room_id) DO UPDATE SET data = ?, updated_at = ?`,
    [roomId, data, timestamp, data, timestamp],
    (err) => {
      if (err) console.error('Error saving room data:', err);
    }
  );
}

// REST API endpoints
app.get('/api/rooms', (req, res) => {
  const activeRooms = Array.from(rooms.entries()).map(([roomId, room]) => ({
    roomId,
    usersCount: room.users.size,
    strokeCount: room.strokes.length,
  }));

  res.json({ rooms: activeRooms });
});

app.get('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({
    roomId,
    usersCount: room.users.size,
    strokeCount: room.strokes.length,
    users: Array.from(room.users.entries()).map(([id]) => id),
  });
});

app.delete('/api/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (room) {
    // Notify all users in the room that it's being deleted
    io.to(roomId).emit('room-deleted');
    rooms.delete(roomId);
  }

  // Delete from database
  db.run('DELETE FROM drawings WHERE room_id = ?', [roomId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete room' });
    }
    res.json({ success: true });
  });
});

// Export drawing as JSON
app.get('/api/room/:roomId/export', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);

  if (!room) {
    // Try to load from database
    db.get(
      'SELECT data, updated_at FROM drawings WHERE room_id = ? ORDER BY updated_at DESC LIMIT 1',
      [roomId],
      (err, row) => {
        if (err || !row) {
          return res.status(404).json({ error: 'Room not found' });
        }

        try {
          const strokes = JSON.parse(row.data);
          res.json({
            roomId,
            strokes,
            exportDate: new Date().toISOString(),
            lastUpdated: row.updated_at,
          });
        } catch (e) {
          res.status(500).json({ error: 'Failed to parse drawing data' });
        }
      }
    );
  } else {
    res.json({
      roomId,
      strokes: room.strokes,
      usersCount: room.users.size,
      exportDate: new Date().toISOString(),
    });
  }
});

// Import drawing from JSON
app.post('/api/room/:roomId/import', express.json({ limit: '50mb' }), (req, res) => {
  const { roomId } = req.params;
  const { strokes } = req.body;

  if (!Array.isArray(strokes)) {
    return res.status(400).json({ error: 'Invalid strokes data' });
  }

  const room = rooms.get(roomId) || new Room(roomId);
  room.strokes = strokes;
  room.history = [strokes];
  room.historyIndex = 0;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, room);
  }

  // Save to database
  const data = JSON.stringify(strokes);
  db.run(
    `INSERT OR REPLACE INTO drawings (room_id, data, updated_at)
     VALUES (?, ?, ?)`,
    [roomId, data, new Date().toISOString()],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to import drawing' });
      }

      // Notify connected users in the room
      io.to(roomId).emit('canvas-state', strokes);

      res.json({
        success: true,
        roomId,
        strokeCount: strokes.length,
      });
    }
  );
});

// Get drawing history
app.get('/api/room/:roomId/history', (req, res) => {
  const { roomId } = req.params;

  db.all(
    'SELECT id, data, updated_at FROM drawings WHERE room_id = ? ORDER BY updated_at DESC LIMIT 10',
    [roomId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch history' });
      }

      const history = rows.map((row) => ({
        id: row.id,
        timestamp: row.updated_at,
        strokeCount: JSON.parse(row.data).length,
      }));

      res.json({ roomId, history });
    }
  );
});

const next = require('next');

const dev = false;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Serve Next frontend for ALL non-API routes
  app.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
