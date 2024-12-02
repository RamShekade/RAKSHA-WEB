const camera = document.getElementById('camera');
const socket = io();
const peerConnection = new RTCPeerConnection();

// Access camera
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then((stream) => {
    camera.srcObject = stream;
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
  })
  .catch((err) => console.error('Error accessing camera:', err));

// Create offer
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('candidate', event.candidate);
  }
};

peerConnection.createOffer()
  .then((offer) => {
    peerConnection.setLocalDescription(offer);
    socket.emit('offer', offer);
  });

// Listen for answer
socket.on('answer', (answer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});
