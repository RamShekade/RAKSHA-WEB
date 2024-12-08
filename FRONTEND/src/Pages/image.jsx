import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const CameraApp = () => {
  const [videoUrl, setVideoUrl] = useState(null); // State to store received video URL
  const [socket, setSocket] = useState(null); // Socket state
  const videoRef = useRef(null); // Reference for the video element
  const mediaRecorderRef = useRef(null); // Reference for MediaRecorder
  const chunks = useRef([]); // Store video chunks temporarily

  useEffect(() => {
    // Connect to the Socket.io server
    const socketConnection = io("http://localhost:3000"); // Replace with your server IP

    setSocket(socketConnection);

    // Listen for the receiveVideo event
    socketConnection.on("receiveVideo", (data) => {
      const { video } = data;
      const videoBlob = new Blob([new Uint8Array(video)], { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    });

    return () => {
      socketConnection.disconnect(); // Clean up socket connection on component unmount
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize MediaRecorder for video recording
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.start();
      console.log("Recording started");
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("Recording stopped");

      const videoBlob = new Blob(chunks.current, { type: "video/webm" });
      chunks.current = []; // Clear chunks

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Video = reader.result.split(",")[1]; // Get Base64 data
        if (socket) {
          socket.emit("sendVideo", { video: base64Video, name: "recorded_video.webm" });
        }
      };
      reader.readAsDataURL(videoBlob);
    }
  };

  return (
    <div>
      <h1>React Video Recorder</h1>
      <video ref={videoRef} style={{ width: "400px", height: "auto" }} muted></video>
      <br />
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleStopRecording}>Stop Recording</button>

      <h3>Received Video:</h3>
      {videoUrl ? (
        <video src={videoUrl} controls style={{ width: "400px", height: "auto" }} />
      ) : (
        <p>No video received yet.</p>
      )}
    </div>
  );
};

export default CameraApp;
