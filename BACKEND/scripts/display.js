const viewer = document.getElementById('viewer');
const socket = io();
const peerConnection = new RTCPeerConnection();

// Handle incoming tracks
peerConnection.ontrack = (event) => {
  viewer.srcObject = event.streams[0];
};

// Handle ICE candidates
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('candidate', event.candidate);
  }
};

// Listen for offer
socket.on('offer', (offer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  peerConnection.createAnswer()
    .then((answer) => {
      peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer);
    });
});

// Listen for ICE candidates
socket.on('candidate', (candidate) => {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
