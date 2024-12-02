const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors=require('cors');
const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's URL
  methods: ['GET', 'POST'],        // Allowed methods
  credentials: true                // Allow credentials (if needed)
}));

// Socket.IO server with CORS settings
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST'],        // Allowed methods
    credentials: true                // Allow credentials
  }
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/capture', (req, res) => {
  res.render('capture');
});
app.get('/capture2', (req, res) => {
  res.render('capture2');
});

app.get('/display', (req, res) => {
  res.render('display');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Relay video stream data from specific cameras
  socket.on('video-stream', ({ cameraId, data }) => {
    // Broadcast the data to viewers of the specific camera
    io.emit(`display-stream-${cameraId}`, data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
