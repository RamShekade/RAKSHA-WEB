const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors=require('cors');
const fs = require('fs');
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
    origin: "*",
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
  socket.on('userDetails', (data) => {
    console.log('Received user details:', data);
    // Process the data as needed
    io.emit('alert-userDetails', data);
  });

  socket.on("sendImage", (data) => {
    const { image, name } = data;
    const buffer = Buffer.from(image, "base64");
    const uploadDir = path.join(__dirname, "uploads");
    const filePath = path.join(uploadDir, name);
   console.log(buffer);
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error("Error saving image:", err);
        socket.emit("uploadStatus", { success: false });
      } else {
        console.log("Image saved successfully");
        socket.emit("uploadStatus", { success: true });
      }
    });
    socket.broadcast.emit('receiveImage', { image, name });

  
  });




  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
