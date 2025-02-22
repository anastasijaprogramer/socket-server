// socket-server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ["https://www.pomodoroom.com", "https://pomodoroom.com" ], // Production URL only "http://localhost:5173"
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // xhr error
  path: '/socket.io/',
  // Production socket.io settings
  path: '/socket.io/',
  allowEIO3: true,
  
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: true,
  secure: true
});

let PORT = 8080;
let currentUserCount = 24082; // Initial count

/**
 * Handles WebSocket connections and updates the current user count.
 * 
 * When a new client connects, it sends the current user count to the client.
 * When a client sends an 'update_user_count' event, it updates the current user count
 * and broadcasts the new count to all connected clients.  
 */
io.on('connection', (socket) =>  
{
  console.log(`User connected: ${socket.id}`);
  socket.emit('user_count_update', currentUserCount);

  socket.on('update_user_count', (newCount) =>
  {
    currentUserCount = newCount;
    // Broadcast to all clients
    io.emit('user_count_update', currentUserCount);
  });

  socket.on('error', (error) =>
  {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', () =>
  {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
server.listen(PORT, () =>
{
  console.log(`Production server running at ${PORT}`);
});


