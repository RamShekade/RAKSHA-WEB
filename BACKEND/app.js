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

  socket.on('video-stream', async ({ cameraId, data }) => {
    try {
        // Send frame to Flask for processing
        const response = await axios.post('http://localhost:5000/process-frame', {
            image: data, // The Base64 frame
        });

        // Broadcast processed result to viewers
        io.emit(`processed-stream-${cameraId}`, response.data);
    } catch (error) {
        console.error('Error processing frame:', error.message);
    }
});

  socket.on('userDetails', (data) => {
    console.log('Received user details:', data);
    // Process the data as needed
    io.emit('alert-userDetails', data);
  });

  socket.on("sendVideo", (data) => {
    const { image, name } = data;
    const buffer = Buffer.from(image, "base64"); // Convert Base64 to a Buffer
    const uploadDir = path.join(__dirname, "uploads"); // Ensure this directory exists
    const filePath = path.join(uploadDir, name);
  
    console.log(`Received video data for: ${name}`);
  
    console.log(`Video received: ${Buffer.byteLength(image, "base64")} bytes`);

    socket.broadcast.emit("receiveVideo", { image: buffer, name });


  
  });




  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
